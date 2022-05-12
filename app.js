const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const signupRouter = require("./routes/signup");

const port = 3000;

//set up express app
const app = express();

//connect to mongodb

app.use(bodyParser.json());

//initialization routes
app.use("/auth", authRouter);
app.use("/signup", signupRouter);

//error handling middleware
app.use(function (err, req, res, next) {
  //console.log(err);
  res.status(422).send({ error: err.message });
});

app.listen(port, () => {
  console.log("app listening on port 3000");
});

module.exports = app;
