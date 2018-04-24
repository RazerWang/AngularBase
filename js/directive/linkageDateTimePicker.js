
crmApp.directive("datetimepicker",['$timeout','$parse','$compile',function($timeout,$parse,$compile){
    return{  
        require:'?ngModel',  
        restrict:'AE',
        priority: 10,
        scope:{
            ngModel:'=',
            format:'@',//默认显示月视图，不显示时分秒
            minDate:'=',//当天显示是否高亮，默认显示
            maxDate:'=',//是否显示上下午，默认不显示
            formatTime:'@',// 时间显示格式
            timepicker:'=',//是否需要时间选择  默认false
            datepicker:'=',//是否需要日期选择 默认ttrue
            step:"@"
        },
        link:function(scope,element,attr,ngModel){  

            scope.element = element;
            $timeout(function(){  
                element.datetimepicker({  
                    minDate:scope.minDate ? scope.minDate:false,
                    maxDate:scope.minDate ? scope.maxDate:false,
                    timepicker:scope.timepicker ? scope.timepicker:false,
                    datepicker:(scope.datepicker||scope.datepicker==false) ? scope.datepicker:true,
                    formatTime:scope.formatTime ? scope.formatTime : 'H:i:s',
                    format:scope.format ? scope.format : 'Y/m/d',
                    lang: 'ch',  
                    validateOnBlur:false,
                    step:scope.step ? Number(scope.step) : 60,
                    onClose : function(){
                        element.change();
                    },
                })

                scope.$watch('minDate',function(nv,ov,scope){
                    if(nv==ov) return;
                    // alert(nv);
                    scope.element.datetimepicker({
                        minDate:nv==""?false:nv
                    })
                })

                scope.$watch('maxDate',function(nv,ov,scope){
                    if(nv==ov) return;
                    // alert(nv);
                    scope.element.datetimepicker({
                        maxDate:nv==""?false:nv
                    })
                })

                element.css({'padding-right':30});//按钮占位区域
                
            },0)  


            scope.modelIsNull = true;//输入的内容是否是空标识  true 是空   false 非空
            scope.isFocus = false;//是否是对焦状态  true 焦点状态    false 非焦点状态
            scope.cancelShow = false;//按钮是否显示  true 显示     false 不显示
           
            html = $compile('<i class="lk-icon lk-icon-cancel form-control-icon" style="font-size: 14px;margin-top: -7px;" ng-show="cancelShow" ng-click="clearModel()"></i><i class="lk-icon lk-icon-calendar-o form-control-icon" ng-show="!cancelShow"></i>')(scope);
            angular.element(element[0]).after(html);


            //清空操作
            scope.clearModel = function () {
                $timeout(function(){
                    angular.element(element[0]).focus();
                },100)
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
                },150);
            });


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
}])
