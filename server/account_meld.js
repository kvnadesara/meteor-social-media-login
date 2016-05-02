var debug = Meteor.npmRequire('debug')('app:server::account_meld');
var orig_updateOrCreateUserFromExternalService;

orig_updateOrCreateUserFromExternalService = Accounts.updateOrCreateUserFromExternalService;

Accounts.updateOrCreateUserFromExternalService = function(serviceName, serviceData, options) {
  debug('updateOrCreateUserFromExternalService:: service=>', serviceName);
  var email, i, len, notVerifiedUser, ref, serviceIdKey, update, user;
  if (serviceName !== 'facebook' && serviceName !== 'github' && serviceName !== 'google' && serviceName !== 'meteor-developer' && serviceName !== 'linkedin' && serviceName !== 'twitter') {
    return;
  }
  if (serviceName === 'meteor-developer') {
    if (_.isArray(serviceData != null ? serviceData.emails : void 0)) {
      serviceData.emails.sort(function(a, b) {
        return a.primary !== true;
      });
      ref = serviceData.emails;
      for (i = 0, len = ref.length; i < len; i++) {
        email = ref[i];
        if (email.verified === true) {
          serviceData.email = email.address;
          break;
        }
      }
    }
  }
  if (serviceName === 'linkedin') {
    serviceData.email = serviceData.emailAddress;
  }
  if (serviceData.email) {
    notVerifiedUser = Meteor.users.remove({
      emails: {
        $elemMatch: {
          address: serviceData.email,
          verified: false
        }
      }
    });
    user = Meteor.users.findOne({
      emails: {
        $elemMatch: {
          address: serviceData.email,
          verified: true
        }
      }
    });
    if (user != null) {
      serviceIdKey = "services." + serviceName + ".id";
      update = {};
      update[serviceIdKey] = serviceData.id;
      Meteor.users.update({
        _id: user._id
      }, {
        $set: update
      });
    }
  }
  return orig_updateOrCreateUserFromExternalService.apply(this, arguments);
};
