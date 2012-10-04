define(
  'widgets/modal',
  [
    'jquery',
    'jade!/templates/modal'
  ],
  function($, modalView) {
    'use strict';

    // constants
    var MODAL_BASE_URI  = 'modals',
        HEADER_SELECTOR = '.modal-window-header',
        BODY_SELECTOR   = '.modal-window-body',
        TEMPLATE        = 'modal';

    // containers
    var container, content;

    return {
      render: function (container) {

      }
    };
  }
);
