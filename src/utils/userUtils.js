import jwt from "jwt-simple";
import config from "../../config.js";

const generateJWT = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.jwtSecret);
};

export default {
  generateJWT,
};
