/**
 * @Author WangZe (wangze@linkstec.com)
 * @Date 2018/4/23 11:47
 * @Function
 **/
crmApp.directive('linkageSwitch',[function(){
    return {
        restrict: 'E',
        replace: true,
        scope:{
            'ngModel':'=',
            'innerText':'=',
            'ngDisabled':'=',
            'ngChange':'='
        },
        template:'<label class="linkage-switch">' +
                    '<input type="checkbox" class="linkage-switch-checkbox" ng-model="ngModel" ng-checked="ngModel" ng-disabled="ngDisabled">' +
                    '<div class="slider">' +
                        '<div class="slider-inner-text">{{ngModel?innerText[0]:innerText[1]}}</div>'+
                        '<div class="slider-thumb"></div>' +
                    '</div>' +
                '</label>',
        link:function(scope,ele,attr){
            if(typeof scope.innerText === 'undefined'){
                scope.innerText = ['',''];
            }
            if(scope.innerText[0].length>1 || scope.innerText[1].length>1){
                angular.element(ele[0]).find('.slider').addClass('big-slider');
            }


        }
    }
}]);