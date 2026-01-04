// services/oauthUser.service.js
const User = require("../models/User.model");

module.exports = async function upsertOAuthUser(provider, profile) {
  const providerId = profile.id;
  const email = profile.emails?.[0]?.value;
  const name = profile.displayName;
  const imageUrl = profile.photos?.[0]?.value;

  const isNewUser = !(await User.exists({
    provider,
    providerId
  }));
  console.log("provider = ",provider)
  console.log("providerId = ",providerId)

  // const user = await User.findOneAndUpdate(
  //   { provider, providerId },
  //   {
  //     provider,
  //     providerId,
  //     email,
  //     name,
  //     imageUrl,
  //     lastLogin: new Date()
  //   },
  //   { upsert: true, new: true }
  // );

  return { user:profile, isNewUser };
};
