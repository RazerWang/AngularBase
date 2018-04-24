/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2017-11-07 15:17:45
 * @function  模板指令，专门针对于子页面的嵌套用的
 */

// templateUrl 模板的链接
crmApp.directive("templateDirective",[function(){
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
        	
       	},
        templateUrl: function(elem,attrs) {
           return attrs.tmlUrl
        }
    }
}]);