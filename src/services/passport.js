import passport from "passport";
import passportJWT from "passport-jwt";
import LocalStrategy from "passport-local";
import config from "../../config";
import dbRepo from "../services/dbRepo";
import { getDBNameFromRequest } from "../utils/dbConnector";

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

// config for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
  passReqToCallback: true,
};

// config for local strategy
const localOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

// create local strategy
const localLogin = new LocalStrategy(
  localOptions,
  async (request, email, password, done) => {
    const dbName = await getDBNameFromRequest(dbRepo, request);
    // if the specified tenant database name is not found in the default database, call done with null
    if (dbName === "") {
      return done(null, false, { message: "Invalid TENANT-ID." });
    }
    if (dbName === null) {
      return done(null, false, { message: "No TENANT-ID was specified." });
    }
    const User = dbRepo[dbName].model("User");
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: "Incorrect email.",
        });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    });
  }
);

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (req, payload, done) => {
  const dbName = await getDBNameFromRequest(dbRepo, req);
  // if the specified tenant database name is not found in the default database (has no account), call done with null
  if (dbName === "") {
    return done(null, false, { message: "Invalid TENANT-ID." });
  }
  if (dbName === null) {
    return done(null, false, { message: "No TENANT-ID was specified." });
  }
  const User = await dbRepo[dbName].model("User");
  // check if the user id in the payload exists in it's tenant database (has an account)
  // if it does, call done with the user
  // if it doesn't, call done with null
  User.findById(payload.sub, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false, { message: "User not found." });
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);

export default passport;
