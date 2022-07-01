import fs from "fs";
import jwt from "jsonwebtoken";
import passportJWT from "passport-jwt";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ExtractJwt = passportJWT.ExtractJwt;

const privateKEY = fs.readFileSync(
  path.join(__dirname, "../cert/private.pem"),
  "utf8"
);

const publicKEY = fs.readFileSync(
  path.join(__dirname, "../cert/public.pem"),
  "utf8"
);

const generateJWT = (user, tenantId) => {
  return jwt.sign({ user: user.toJSON(), tenant: tenantId }, privateKEY, {
    expiresIn: "30d", // 30 days validity
    algorithm: "RS256",
    subject: user.id,
  });
};

const jwtOptions = () => {
  return {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKEY,
    passReqToCallback: true,
    algorithm: ["RS256"],
  };
};

export default {
  generateJWT,
  jwtOptions,
};
