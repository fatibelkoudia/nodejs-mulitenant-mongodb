import express from "express";
import { createServer } from "http";
import morgan from "morgan";
import passport from "passport";
import { authRouter, signupRouter } from "./src/routes";

const app = express();

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: "*/*" })); // parse incoming requests to json

// allow-cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  if ("OPTIONS" === req.method) {
    //respond with 200
    res.send(200);
  } else {
    //move on
    next();
  }
});

//initialization passport
const requireAuth = passport.authenticate("jwt", { session: false });

//initialization routes
app.use("/login", authRouter);
app.use("/signup", signupRouter);

app.get("/", requireAuth, (req, res) => {
  res.send("Hello World!");
});

//error handling middleware
app.use(function (err, req, res, next) {
  //console.log(err);
  res.status(422).send({ error: err.message });
});

// server setup
const port = process.env.PORT || 3090;
const server = createServer(app);
server.listen(port, () => {
  console.log("app listening on port 3000");
});

export default app;
