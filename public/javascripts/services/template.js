define(
  ['services/jquery', 'services/jade'],
  function($, jade) {
    var TEMPLATES_EXT = '.jade',
        TEMPLATES_URI = '/templates';
    
    var TemplateService = {
      applyWith: function (templateName, locals, callback) {
        if (!callback) {
          callback = locals;
          locals = {};
        }
        
        $.get(TEMPLATES_URI + '/' + templateName + TEMPLATES_EXT, function (resp) {
          callback(jade.compile(resp)(locals));
        });
      }
    };
    
    return TemplateService;
  }
);
