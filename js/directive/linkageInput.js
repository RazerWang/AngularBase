/**
 * @Author WangZe (wangze@linkstec.com)
 * @Date 2018/3/28 11:22
 * @Function
 **/
crmApp.directive("linkageInput",['$compile','$timeout',function($compile,$timeout){
    return {
        require:'?ngModel',
        scope : {
          ngModel : '='
        },
        restrict: 'A',
        priority: 100,
        link: function(scope, element, attrs,ngModel) {
            /***********************参数区域*******************************************/
            scope.modelIsNull = true;//输入的内容是否是空标识  true 是空   false 非空
            scope.isFocus = false;//是否是对焦状态  true 焦点状态    false 非焦点状态
            scope.cancelShow = false;//按钮是否显示  true 显示     false 不显示
            // 判断类型
            var inputType = 'normalInput';
            if(typeof angular.element(element[0]).attr('datetimepicker') != 'undefined'){
                inputType = 'dateInput';
            }else{
                inputType = 'normalInput';
            }
            var html = '';
            switch(inputType){
                case 'normalInput':
                    html = $compile('<i class="lk-icon lk-icon-cancel form-control-icon" style="font-size: 14px;margin-top: -7px;" ng-show="cancelShow" ng-click="clearModel()"></i>')(scope);
                    angular.element(element[0]).after(html);
                    break;
                case 'dateInput':
                    html = $compile('<i class="lk-icon lk-icon-calendar-o form-control-icon"></i>')(scope);
                    angular.element(element[0]).after(html);
                    break;
            }
            /***********************函数区域******************************************/
            //清空操作
            scope.clearModel = function () {
                angular.element(element[0]).focus();
                scope.ngModel='';
            };
            //获取焦点
            angular.element(element[0]).on('focus',function () {
                $timeout(function () {
                    scope.isFocus = true;//是否是对焦状态  true 焦点状态    false 非焦点状态
                    if(scope.modelIsNull){
                        scope.cancelShow = false;
                    }else{
                        scope.cancelShow = true;
                    }
                },100);
            });
            //失去焦点
            angular.element(element[0]).on('blur',function () {
                $timeout(function () {
                    scope.isFocus = false;//是否是对焦状态  true 焦点状态    false 非焦点状态
                    scope.cancelShow = false;
                },250);
            });

            /***********************初始化区域****************************************/
            
            element.css({'padding-right':30});//按钮占位区域

            /***********************监控区域*******************************************/

            // 监听viewValue
             scope.$watch(function(){
                    return ngModel.$viewValue;
                }, 
                function(newValue, oldValue){
                    // do something
                    // console.log("gg:"+newValue);
                    if(newValue != null && typeof newValue != 'undefined'){
                        if(newValue.toString().length === 0){
                            scope.modelIsNull = true;//判断是否显示参数
                        }else{
                            scope.modelIsNull = false;//判断是否显示参数
                        }
                    }
                    if(scope.isFocus && !scope.modelIsNull){
                        scope.cancelShow = true;
                    }else{
                        scope.cancelShow = false;
                    }
                }
            );


        }
    }

}]);