/**
 * Created by joyXie on 2017/8/16.
 */

/**
 * validText   提示的错误
 * **/
crmApp.directive("validateTooltip",[function(){
    return {
        scope: {
            validText : "@",
        },
        restrict: 'EA',
        template: '<div class="tooltip bottom" role="tooltip" ><div class="tooltip-arrow"></div><div class="tooltip-inner">{{validText}}</div></div>',
        replace: true,
        link: function(scope, element, attributes, controller) {
        }
    }
}]);