import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import dbRepo from "../services";
import { addConnectionToRepo } from "../utils";
const router = Router();

router.post("/", async function (req, res, next) {
  const { name, email, domain, password, firstName, lastName } = req.body;
  const owner = email;
  const Account = dbRepo["default"].model("Account");

  // generate a random tenant id to be used as the database name
  const tenantId = uuidv4();

  // Check if a user with the given email already exists
  let existingUser;
  try {
    existingUser = await Account.findOne({
      owner: owner,
    });
  } catch (err) {
    return next(err);
  }

  if (existingUser) {
    // If an account with email does exist, return an error
    return res.status(409).send({ error: `Email already exists` }); // Conflict
  }

  // If an account with email does NOT exist, create and save account record

  let account;
  try {
    account = await new Account({
      name,
      domain,
      owner,
      tenantId: tenantId,
    }).save();
  } catch (err) {
    return next(err);
  }

  if (account) {
    // if the account was created successfully, create and save user record in it's tenant database as a super admin
    // first, we create a new database for the tenant (saved account)
    addConnectionToRepo(dbRepo, "tenant_" + tenantId);

    // create a new user and save it
    const User = dbRepo["tenant_" + tenantId].model("User");
    let user;
    try {
      user = await new User({
        firstName,
        lastName,
        email,
        password,
        isSuperAdmin: true,
      }).save();
    } catch (err) {
      return next(err);
    }
    if (user) {
      res.status(201).json({ user, account });
    }
  }
});

export default router;
