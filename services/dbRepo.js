const DBConnector = require("../utils/dbConnector");

let dbRepo = {};
DBConnector.addConnectionToRepo(dbRepo, "default");
module.exports = dbRepo;
