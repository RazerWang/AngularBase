crmApp.factory('getDirectoryData', ["$http","$q","$rootScope",'getDataFactory',function ($http, $q, $rootScope,getDataFactory){  
    var factory = {};  
    factory.fetchData = function(dataParam) {  
      getDataFactory.fetchData({
        method: "POST",
        url: myCommon.getWebApp(),
        params:{
          p:{
            "busiNo": "common.QueryDataDictBo",
            "type":dataParam.dirName
          }
        }
      }).then(function(response) {  

        dataParam.success(response);

      },function(data){  
      //error函数  
      })  
    };  
    return factory;  
}]);  