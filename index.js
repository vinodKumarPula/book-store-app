const express = require('express');
// const mongoose = require('mongoose');
const Cors= require('cors')
const passport = require('passport');
const bodyParser = require('body-parser');
// const keys = require('./config/keys');

// require('./models/User');
// require('./models/Blog');
require('./services/passport');

// mongoose.Promise = global.Promise;
// mongoose.connect(keys.mongoURI, { useMongoClient: true });

const app = express();
app.use(Cors())
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
const validator= require('./validators/validator')
app.use(validator)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

require('./routes/signup')(app);
require('./routes/loginUser')(app);
require('./routes/userBooks')(app);

// require('./routes/blogRoutes')(app);

// if (['production'].includes(process.env.NODE_ENV)) {
//   app.use(express.static('client/build'));
//   const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve('client', 'build', 'index.html'));
//   });
// }
app.get('/',(req,res)=>{
  res.send('Hello in book APp ')
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port`, PORT);
});
