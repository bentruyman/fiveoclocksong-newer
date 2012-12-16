var mongoose = require('mongoose');

var MongoClient = function (host, port, db) {
  return mongoose.createConnection('mongodb://' + host + ':' + port + '/' + db);
};

module.exports = {
  MongoClient: MongoClient,
  createClient: function (host, port, db) {
    return new MongoClient(host, port, db);
  }
};
