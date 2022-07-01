const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const dbRepo = require("../services/dbRepo");
const AccountSchema = require("../models/account");
const DBConnector = require("../utils/dbConnector");
const UserSchema = require("../models/user");

router.post("/", async function (req, res, next) {
  let tenantId = uuidv4();
  const Account = dbRepo["default"].model("Account", AccountSchema);

  const account = await Account.create({
    name: req.body.name,
    domain: req.body.domain,
    owner: req.body.email,
    tenantId: tenantId,
  });

  DBConnector.addConnectionToRepo(dbRepo, "tenant_" + tenantId);
  const User = dbRepo["tenant_" + tenantId].model("User", UserSchema);
  await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    isSuperAdmin: true,
  });
  res.send(account);
});

module.exports = router;
