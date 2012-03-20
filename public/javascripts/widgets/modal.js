define(
  ['services/jquery', 'services/template'],
  function($, templateService) {
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
          templateService.applyWith('modal', { header: header, body: body }, function (html) {
            container = $(html);
            $('body').append(container);
          });
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
