const passport = require("passport");
const passportJWT = require("passport-jwt");
const Profile = require("../model/profileModel");

passport.use(
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "SECRET_KEY",
    },
    function (jwtPayload, done) {
      return Profile.findById(jwtPayload.id)
        .then((user) => done(null, user))
        .catch((error) => done(error));
    }
  )
);
