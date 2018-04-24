'use strict';
angular.module('linkageCrmApp')

    .config(["$stateProvider",'$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
        $urlRouterProvider
            .otherwise('404');
        $stateProvider
            .state("404", {
                url: '/404',
                templateUrl:'',
                views:{
                    'content':{templateUrl:"./view/404.html"}
                }
            })
        //原则
        .state("basicRule", {
            url: '/basicRule',
            views:{
                'content':{templateUrl:'./view/basicRule/basicRule.html'},
            },
            resolve: {
                deps: ['$ocLazyLoad',function( $ocLazyLoad ){
                  return $ocLazyLoad.load('./js/controller/basicRule/basicRuleController.js');
              }]
            }
        })

    }]);
