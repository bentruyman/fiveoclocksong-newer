var ldap = require('ldapjs');

var config = require('../../config');

module.exports = {
  createClient: function () {
    return ldap.createClient({ url: config.ldap.url });
  }
};
