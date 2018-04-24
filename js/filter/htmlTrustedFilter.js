/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2018-01-16 19:25:39
 * @function  angular 绑定 html代码
 */


crmApp.filter('htmlTrustedFilter', ['$sce', function ($sce) {
	return function (text) {
	    return $sce.trustAsHtml(text);
	}
}])