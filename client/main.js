import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';

import './main.html';

Template.login.events({
  'click [data-social-login]' (event, template) {
    const service = event.target.getAttribute('data-social-login'),
      options = {
        requestPermissions: ['email']
      };

    if (service === 'loginWithTwitter') {
      delete options.requestPermissions;
    }

    Meteor[service](options, (error) => {
      if (error) {
        Bert.alert(error.message, 'danger');
      }
    });
  }
});

Template.profile.events({
  'click .btn-logout': function(e, t) {
    Meteor.logout();
  }
});
