const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create user schema
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isSuperAdmin: {
      type: Boolean,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

module.exports = UserSchema;
