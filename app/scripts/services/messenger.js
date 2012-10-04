define({
  createClient: function (host, port, mount) {
    return new Faye.Client(window.location.protocol + '//' + host + ':' + port + '/' + mount);
  }
});
