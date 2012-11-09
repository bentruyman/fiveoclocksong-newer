var ldap = require('ldapjs');

var LDAPClient = function (endpoint) {
  return ldap.createClient({ url: endpoint });
};

module.exports = {
  createClient: function (endpoint) {
    return new LDAPClient(endpoint);
  }
};
