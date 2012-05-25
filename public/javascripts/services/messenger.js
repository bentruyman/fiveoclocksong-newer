define(
  ['json!/config.json'],
  function (config) {
    return new Faye.Client(window.location.protocol + '//' + config.server.host);
  }
);
