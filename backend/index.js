'use starict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./router');
const app = express();
const PORT = 4000;


const mongo = mongoose.connect('mongodb://testUser:admin321@ds119675.mlab.com:19675/employee-mgmt', { useNewUrlParser: true });


mongo.then(() => {
  console.log('connected');
}).catch(err => {
  console.log('err', err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', router);
app.listen(PORT, () => console.log(`app listening on port ${PORT}`));