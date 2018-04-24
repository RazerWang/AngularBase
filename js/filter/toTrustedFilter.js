/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2018-03-12 18:03:13
 * @function  让html可以不要过滤掉html的属性
 */

crmApp
.filter('to_trusted', ['$sce', function($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}])