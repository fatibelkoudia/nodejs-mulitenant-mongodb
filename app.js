const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');

const authRouter=require('./routes/auth');
const port = 3000

//set up express app
const app = express();

//connect to mongodb
mongoose.connect('mongodb://localhost/myDB');
mongoose.Promise=global.Promise;

app.use(bodyParser.json());

//initialization routes 
app.use('/auth', authRouter);



  app.listen(port, () => {
    console.log('app listening on port 3000')
  })


module.exports = app;
