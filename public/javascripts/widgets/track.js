define(
  [
    'services/jquery',
    'jade!/templates/track'
  ],
  function ($, trackView) {
    return {
      creator: function (sandbox) {
        var parent = document.getElementById(sandbox.getOption('parent')),
            trackData = sandbox.getOption('track'),
            trackContainer;
        
        return {
          create: function () {
            // apply the template and append it to the parent container
            $(parent).append(trackView(trackData));
          },
          destroy: function () {
            $(trackContainer).remove();
          }
        };
      }
    };
  }
);
