// config
var crmApp =  
angular.module('linkageCrmApp')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide','ngToastProvider','w5cValidatorProvider',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide,ngToastProvider,w5cValidatorProvider) {
        
        // lazy controller, directive and service
        crmApp.controller = $controllerProvider.register;
        crmApp.directive  = $compileProvider.directive;
        crmApp.filter     = $filterProvider.register;
        crmApp.factory    = $provide.factory;
        crmApp.service    = $provide.service;
        crmApp.constant   = $provide.constant;
        crmApp.value      = $provide.value;
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|local|data):/);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|data|chrome-extension):/);

        ngToastProvider.configure({
          animation: 'slide',
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });

         // 全局配置
        w5cValidatorProvider.config({
            blurTrig: false,
            showError: true,
            removeError: true
            // showError: function(elem,errorMessages){
            //     console.log(errorMessages)
            // },
            // removeError: function(elem){
            //     console.log(elem)
            // }

        });
        
    }
  ])



// Mock.mockjax(crmApp);


