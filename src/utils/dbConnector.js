import { default as mongoose } from "mongoose";
import { AccountSchema, UserSchema } from "../models";
import { AccountService } from "../services";

const createNewConnection = (dbName) => {
  return mongoose.createConnection("mongodb://127.0.0.1:27017/" + dbName, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

/**
 * add new connection to the database pool
 * @param {Object} dbRepo
 * @param {String} dbName
 * @returns {Object} dbRepo
 */
export const addConnectionToRepo = (dbRepo, dbName) => {
  if (!dbRepo[dbName]) {
    if (dbName === "default") {
      dbRepo[dbName] = createNewConnection("dev_MT");
      dbRepo[dbName].model("Account", AccountSchema);
    } else {
      dbRepo[dbName] = dbRepo["default"].useDb(dbName); // use the same connection pool as the default database
      dbRepo[dbName].model("User", UserSchema);
    }
  }
  return dbRepo;
};

/**
 * extract the tenanat id from the request headers which is used to determine which database to use
 * @param {Object} dbRepo the database pool
 * @param {Request} req the request object
 * returns dbName if found, empty string if not found, null if no tenant id was specified
 */
export const getDBNameFromRequest = async (dbRepo, req) => {
  // extract tenant id from request headers
  const tenentId = req.headers["tenant-id"];

  // if the tenantId is specified in the request headers, we want to connect to the tenant database
  // if it's not specified, we want to connect to the default database
  if (tenentId) {
    const dbName = "tenant_" + tenentId;
    // check the existence of the tenant database name in the default database
    let account = await AccountService.getAccountByTenantId(tenentId);
    if (account) {
      // if the database pool doesn't contain the tenant database yet, create it
      addConnectionToRepo(dbRepo, dbName);
      return dbName;
    } else {
      return "";
    }
  }

  return null;
};
