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
  debug('inside onCreateUser');
  user.profile = options.profile || {};
  var ref, ref1, ref2, ref3, ref4, ref5, ref6, serviceName;
  serviceName = null;
  if (((ref = user.services) != null ? ref.facebook : void 0) != null) {
    serviceName = 'facebook';
    user.profile.picture = 'http://graph.facebook.com/' + user.services.facebook.id + '/picture/?type=large';
  } else if (((ref1 = user.services) != null ? ref1.google : void 0) != null) {
    serviceName = 'google';
    user.profile.picture = user.services.google.picture;
  } else if (((ref2 = user.services) != null ? ref2.github : void 0) != null) {
    serviceName = 'github';
  } else if (((ref3 = user.services) != null ? ref3['meteor-developer'] : void 0) != null) {
    serviceName = 'meteor-developer';
  } else if (((ref4 = user.services) != null ? ref4.twitter : void 0) != null) {
    serviceName = 'twitter';
    user.profile.picture = user.services.twitter.profile_image_url_https;
  }
  if (serviceName === 'facebook' || serviceName === 'google' || serviceName === 'meteor-developer' || serviceName === 'github' || serviceName === 'twitter') {
    if (((user != null ? user.name : void 0) == null) || user.name === '') {
      if (((ref5 = options.profile) != null ? ref5.name : void 0) != null) {
        user.name = (ref6 = options.profile) != null ? ref6.name : void 0;
      } else if (user.services[serviceName].name != null) {
        user.name = user.services[serviceName].name;
      } else {
        user.name = user.services[serviceName].username;
      }
    }
    if (user.services[serviceName].email) {
      user.emails = [
        {
          address: user.services[serviceName].email,
          verified: true
        }
      ];
    }
  }
  return user;
});
