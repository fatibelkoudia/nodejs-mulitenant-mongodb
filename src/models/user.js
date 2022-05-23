import bcrypt from "bcrypt-nodejs";
import mongoose from "mongoose";
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
      lowercase: true,
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

// before saving the user, we need to hash the password
UserSchema.pre("save", function (next) {
  const user = this;
  try {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
    next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// remove password from the user object before sending it to the client
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default UserSchema;
