define(
  'widgets/track',
  [
    'jquery',
    'jade!/templates/track'
  ],
  function ($, trackView) {
    'use strict';

    return {
      render: function (container) {
        // apply the template and append it to the parent container
        // $(container).append(trackView(trackData));
      }
    };
  }
);
