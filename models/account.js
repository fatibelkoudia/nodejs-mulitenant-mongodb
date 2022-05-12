const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create  Account schema
const AccountSchema = new Schema({
  name: {
    type: String,
    allowNull: false,
    unique: true,
  },
  domain: {
    type: String,
    allowNull: false,
    unique: true,
  },
  owner: {
    type: String,
    allowNull: false,
    unique: true,
  },
  tenantId: {
    type: String,
    allowNull: false,
    unique: true,
  },
});

module.exports = AccountSchema;
