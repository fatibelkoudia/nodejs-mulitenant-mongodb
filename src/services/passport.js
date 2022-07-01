import passport from "passport";
import passportJWT from "passport-jwt";
import LocalStrategy from "passport-local";
import dbRepo from "../services/dbRepo";
import { getDBKeyFromPayload, getDBKeyFromRequest } from "../utils/dbConnector";
import jwtUtils from "../utils/jwtUtils";

const JwtStrategy = passportJWT.Strategy;

// config for JWT strategy
const jwtOptions = jwtUtils.jwtOptions();

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
    const dbKey = await getDBKeyFromRequest(dbRepo, request);
    // if the specified tenant database name is not found in the default database, call done with null
    if (dbKey === "") {
      return done(null, false, { message: "Invalid TENANT-ID." });
    }
    if (dbKey === null) {
      return done(null, false, { message: "No TENANT-ID was specified." });
    }
    const dbName = "tenant_" + dbKey;
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
        return done(null, user, { tenantId: dbKey });
      });
    });
  }
);

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (req, payload, done) => {
  const dbName = await getDBKeyFromPayload(dbRepo, payload);
  // if the specified tenant id is not found, then the jwt token is invalid
  if (!dbName) {
    return done(null, false, { message: "Invalid JWT." });
  }
  const User = await dbRepo["tenant_" + dbName].model("User");

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
