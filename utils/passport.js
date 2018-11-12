require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
module.exports = new JwtStrategy(opts, (jwtPayload, done) => {
  if (jwtPayload.email === 'paul@nanosoft.co.za') {
    return done(null, true);
  }
  return done(null, false);
});
