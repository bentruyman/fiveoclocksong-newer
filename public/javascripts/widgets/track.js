define(
  ['services/jquery', 'services/template'],
  function ($, templateService) {
    return {
      creator: function (sandbox) {
        var parent = document.getElementById(sandbox.getOption('parent')),
            trackData = sandbox.getOption('track'),
            trackContainer;
        
        return {
          create: function () {
            // apply the template and append it to the parent container
            templateService.applyWith('track', trackData, function (html) {
              trackContainer = $(html).get(0);
              $(parent).append(trackContainer);
            });
          },
          destroy: function () {
            $(trackContainer).remove();
          }
        };
      }
    };
  }
);
