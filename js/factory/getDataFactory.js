var loadingNum = 0;
crmApp.factory('getDataFactory', ["$http","$q","$rootScope","ngToast",function ($http, $q, $rootScope,ngToast){  
    var factory = {};  
    factory.fetchData = function(dataParam) {  
        $rootScope.$broadcast('isLoading', true);
        loadingNum++;
        var defer = $q.defer(); 
        if(myCommon.isEmpty(dataParam.headers)){
            dataParam.headers = {'Content-Type': 'application/json'};
        } 
        $http({  
            url: dataParam.url,  
            method: dataParam.method,  
            headers: dataParam.headers,  
            params: dataParam.params,
        }).success(function (data) {
            loadingNum--;
            if(loadingNum==0){
                $rootScope.$broadcast('isLoading', false);
            }
            if(data.statusCode == 1){
                if(data.resultData.successStatus==="S200"){
                    defer.resolve(data);
                }else{
                    // ngToast.dismiss();
                    if(!myCommon.isEmpty(data.resultData.errorDesc)){
                        ngToast.create({
                            className: 'warning',
                            timeout:3000,
                            content: data.resultData.errorDesc
                        });
                    }

                }

            }else{
                ngToast.create({
                    className: 'warning',
                    timeout:3000,
                    content: data.errorMsg
                });
            }

        }).  
        error(function (data, status, headers, config) {  
            loadingNum--;
            if(loadingNum==0){
                $rootScope.$broadcast('isLoading', false);
            }
            defer.reject(data);  
        });
        return defer.promise;  
        };  
        return factory;  
}]);  