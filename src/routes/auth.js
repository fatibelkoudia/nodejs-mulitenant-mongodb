import { Router } from "express";
import passport from "passport";
import jwtUtils from "../utils/jwtUtils";
const router = Router();

router.post("/", function (req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return next(err);
      }
      const token = jwtUtils.generateJWT(user, info.tenantId);
      return res.json({ user, token });
    });
    return next();
  })(req, res);
});

export default router;
