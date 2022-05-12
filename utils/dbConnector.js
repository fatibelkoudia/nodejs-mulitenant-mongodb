const { default: mongoose } = require("mongoose");

const createNewConnection = (dbName) => {
  return mongoose.createConnection("mongodb://localhost:27017/" + dbName);
};
const DBConnector = {
  addConnectionToRepo: (dbRepo, dbName) => {
    if (dbName === "default") {
      dbRepo[dbName] = createNewConnection("dev_MT");
    } else {
      dbRepo[dbName] = createNewConnection(dbName);
    }
    return dbRepo;
  },
};

module.exports = DBConnector;
