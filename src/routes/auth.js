import { Router } from "express";
import passport from "passport";
import { userUtils } from "../utils";
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
      const token = userUtils.generateJWT(user);
      return res.json({ user, token });
    });
    return next();
  })(req, res);
});

export default router;
