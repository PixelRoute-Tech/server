// config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        const user = {
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0].value,
        }
        console.log(user);
        // const user = await User.findOneAndUpdate(
        //   {
        //     provider: "google",
        //     providerId: profile.id
        //   },
        //   {
        //     email: profile.emails[0].value,
        //     name: profile.displayName,
        //     avatar: profile.photos[0].value,
        //     lastLogin: new Date()
        //   },
        //   { upsert: true, new: true }
        // );

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
