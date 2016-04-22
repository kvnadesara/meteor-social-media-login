var debug = Meteor.npmRequire('debug')('app:server::accounts');
// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: "facebook"
});
ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "1322461887780363",
  secret: "8d493afb66f6243e349ff93e8ac45819"
});

// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: "twitter"
});
ServiceConfiguration.configurations.insert({
  service: "twitter",
  consumerKey: "xuRFDi7UGd6d06U2rqYjCc081",
  secret: "6FQTaLHZbrG1xLrTqmpPhX7d6Ai1sYBYxRF7ficuj6N9WI3Yqy"
});

// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: "google"
});
ServiceConfiguration.configurations.insert({
  service: "google",
  clientId: "124801543008-jg93gl1gfadtq9o4g0eobio9pdtqk4pb.apps.googleusercontent.com",
  secret: "ELAv0cvD5fkxOZskTUrbL2Y5",
  loginStyle: "popup"
});


Accounts.onCreateUser(function(options, user) {
  user.profile = options.profile || {};
  //Twitter returns some useful info as the username and the picture
  if (user.services.twitter) {
    user.profile.picture = user.services.twitter.profile_image_url_https;
    user.profile.username = user.services.twitter.screenName;
    user.profile.id = user.services.twitter.id;
  } else if(user.services.facebook) {
    user.profile.picture = 'http://graph.facebook.com/' + user.services.facebook.id + '/picture/?type=large';
    user.profile.username = user.services.facebook.name;
    user.profile.id = user.services.facebook.id;
    user.profile.email = user.services.facebook.email;
  } else if(user.services.google) {
    user.profile.picture = user.services.google.picture;
    user.profile.username = user.services.google.name;
    user.profile.id = user.services.google.id;
    user.profile.email = user.services.google.email;
  }
  return user;
});
