/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2018-01-05 10:17:45
 * @function  没有数据指令
 */

// tipText 没有数据提示文字
// imgWidth 图片的大小
crmApp.directive("noData",[function(){
    return {
    	 scope: {
            tipText : "=",
            imgWidth : "=",
        },
        restrict: 'E',
        replace: true,
        link: function(scope, element, attrs) {
        	scope.tipText = scope.tipText?scope.tipText:"暂时没有数据";
        	scope.imgWidth = scope.imgWidth?scope.imgWidth:100;

            // scope.$watch('imgWidth',function(nv,ov){
            //     scope.imgWidth =  nv;
            //     console.log(nv);
            // })

            // scope.$watch('tipText',function(nv,ov){
            //     scope.tipText =  nv;
            //     console.log(nv);
            // })
       	},
        template: '<div class="no-data-con">'
        			+'<div class="no-data-img-con">'
        			  +'<img ng-style={"width":imgWidth+"px"} src="./img/nodata.png" class="no-data-img"  />'
        			+'</div>'
        			+'<div class="no-data-text">{{tipText}}</div>'
        		+'</div>'

        }
}]);