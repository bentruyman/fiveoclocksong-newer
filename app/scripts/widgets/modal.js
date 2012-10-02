define(
  'widgets/modal',
  [
    'services/jquery',
    'jade!/templates/modal'
  ],
  function($, modalView) {
    'use strict';
    
    return {
      creator: function (sandbox) {
        // constants
        var MODAL_BASE_URI  = 'modals',
            HEADER_SELECTOR = '.modal-window-header',
            BODY_SELECTOR   = '.modal-window-body',
            TEMPLATE        = 'modal';
        
        // containers
        var container, content;
        
        // options
        var header = sandbox.getOption('header'),
            body   = sandbox.getOption('body');
        
        var create = function () {
          $('body').append(modalView({ header: header, body: body }));
        };
        
        var destroy = function () {
          $(container).remove();
        };
        
        return {
          create: create,
          destroy: destroy
        };
      }
    };
  }
);
