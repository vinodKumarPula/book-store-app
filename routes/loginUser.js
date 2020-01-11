const jwt = require('jsonwebtoken');
const passport = require('passport');
const  jwtSecret = require('../services/jwtConfig');
const User =require('../modelStore').Users;
module.exports = app => {
  app.post('/login',(req, res, next) => {
    console.log('inside login',req.body)
    passport.authenticate('login', (err, users, info) => {
      if (err) {
        console.error(`error ${err}`);
      }
      if (info !== undefined) {
        console.error(info.message);
        if (info.message === 'bad username') {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        req.logIn(users, () => {
          User.findOne({
            where: {
              email: req.body.email,
            },
          }).then(user => {
            const token = jwt.sign({ id: user.id }, jwtSecret.secret, {
              expiresIn: 60 * 60,
            });
            res.status(200).send({
              auth: true,
              token,
              message: 'user found & logged in',
              email:req.body.email
            });
          });
        });
      }
    })(req, res, next);
  });
};