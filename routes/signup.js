const passport = require('passport');
const User = require('../modelStore').Users;
module.exports = app => {
  app.post('/signup', (req, res, next) => {
    console.log('******req.body',req.body)
    passport.authenticate('signup', (err, user, info) => {
      if (err) {
        console.error(err);
      }
      if (info !== undefined) {
        console.error(info.message);
        res.status(403).send(info.message);
      } else {
        // eslint-disable-next-line no-unused-vars
        req.logIn(user, error => {
          console.log(user);
          const data = {

            email: req.body.email
          };
          console.log(data);
          User.findOne({
            where: {
              email: data.email,
            },
          }).then(user => {
            console.log(user);
            user
              .update({

                email: data.email,
              })
              .then(() => {
                console.log('user created in db');
                res.status(200).send({ message: 'user created' });
              });
          });
        });
      }
    })(req, res, next);
  });
};