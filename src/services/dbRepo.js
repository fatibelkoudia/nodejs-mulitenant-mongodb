import { addConnectionToRepo } from "../utils/dbConnector";

let dbRepo = {};
// whenever dbRepo is called, we want to add the default database to the pool if it doesn't exist
addConnectionToRepo(dbRepo, "default");
export default dbRepo;
