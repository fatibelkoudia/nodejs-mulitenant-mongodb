const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
   app.use(bodyParser.json());

app.use('/auth', authRouter);


  app.listen(port, () => {
    console.log('app listening on port ${port}')
  })


module.exports = app;
