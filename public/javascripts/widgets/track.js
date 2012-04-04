define(
  ['services/jquery'],
  function ($, pollService) {
    return {
      creator: function (sandbox) {
        return {
          create: function () {},
          destroy: function () {}
        };
      }
    };
  }
);