/**
 * @Author WangZe (wangze@linkstec.com)
 * @Date 2018/2/26 10:21
 * @Function 首页控制器
 **/
crmApp.controller('indexController',['$scope','$state','$location',function($scope,$state,$location){

    /*************************参数区域**********************************************/
    $scope.isLoading = false;

    /*************************函数区域*********************************************/


    /*************************初始化区域********************************************/


    /*************************监听区域*********************************************/
     $scope.$on('isLoading', function(event,flag) {
         $scope.isLoading = flag;
     });

}]);



