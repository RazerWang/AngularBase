/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2018-04-20 16:02:29
 * @function  下拉 收起
 */

// crmApp.directive('linkageToggle', function(){
//     return {
//         restrict: 'A',
//         link: function (scope, elem, attrs, ctrl) {


//             if ('down' == attrs.slidedownInit){
//                 elem.css('display', '');
//             } else {
//                 elem.css('display', 'none');
//             }
//             scope.$watch(attrs.toggleSlidedown, function (val) {


//                 var duration = _.isUndefined(attrs.slidedownDuration) ? 150 : attrs.slidedownDuration;
//                 if (val) {
//                     elem.slideDown(duration);
//                 } else {
//                     elem.slideUp(duration);
//                 }
//             });
//         }
//     }
// });


crmApp.animation('.linkage-toggle', function(){
  return {
  		beforeAddClass : function(element, className, done){
	        if (className == 'ng-hide'){
	            $(element).slideUp({duration: 400}, done);
	        } else {done();}
	    },
	    beforeRemoveClass :  function(element, className, done){
	        if (className == 'ng-hide'){
	            $(element).css({display:'none'});
	            $(element).slideDown({duration: 400}, done);
	        } else {done();}
	    }  
	}
})
