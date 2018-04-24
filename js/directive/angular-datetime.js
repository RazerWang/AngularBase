
crmApp.directive("datetimepicker",['$timeout','$parse',function($timeout,$parse){
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
            console.log(scope.ngModel);
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
                        minDate:nv
                    })
                })

                scope.$watch('maxDate',function(nv,ov,scope){
                    if(nv==ov) return;
                    // alert(nv);
                    scope.element.datetimepicker({
                        maxDate:nv
                    })
                })

                
                // .on('click',function(){//设置最大最小时间限制  
                //     if(attr.hasOwnProperty('maxDate')){  
                //         element.datetimepicker('maxDate', attr.maxDate);  
                //     }  
                //     if(attr.hasOwnProperty('minDate')){  
                //         element.datetimepicker('minDate', attr.minDate);  
                //     }  
                // });  
            },0)  




        }  
    } 
}])
