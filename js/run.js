
crmApp
    .run(["$rootScope","getDataFactory","getDirectoryData",function ($rootScope,getDataFactory,getDirectoryData) {
        /**
         * 登录人信息
         * **/
        if(window.top !== window.self){//内嵌进框架
            var doc = window.parent.document;
            var flash = doc.getElementById("Main");
            if(!myCommon.isEmpty(flash)){
            	$rootScope.currentStaffInfo = flash.getUserInfo();
            }else{
            	$rootScope.currentStaffInfo = window.parent.L.userInfo;
            }
        }else{//顶层的时候
            // debug
            $rootScope.currentStaffInfo = {
                memberId:1,
                stfId:"admin",
                stfName:"系统管理员"
            };
        }


        /**
         * 数据字典查询
         * **/
        /**
         * 数据字典查询 返回数组格式
         * 接口 common.QueryDataDictBo
         * **/
        function getDictionary(type) {
            var returnArray = [];
            getDirectoryData.fetchData({
                dirName:type,
                success :function (response) {
                    var list = response.resultData.data;
                    for(var i = 0;i<list.length;i++){
                        returnArray[i] = list[i]
                    }
                }
            });
            return returnArray;
        }
        /**
         * 数据字典查询并格式化成key : value
         * 接口 common.QueryDataDictBo
         * **/
        function formatterDictionary(type) {
            var obj = {};
            getDataFactory.fetchData({
                url : myCommon.getWebApp(),
                method : "POST",
                params : {
                    "p": {
                        "busiNo": "common.QueryDataDictBo",//业务功能bo
                        "type": type
                    }
                },
            }).then(function (response) {
                var list = response.resultData.data;
                for(var i = 0;i<list.length;i++){
                    obj[list[i].key] = list[i].value;
                }
            },function (error) {
                // console.log(error);
            });
            return obj;
        }
        /**
         * 特殊接口查询 返回数组格式
         * **/
        function getQueryBo(bo) {
            var returnArray = [];
            getDataFactory.fetchData({
                url : myCommon.getWebApp(),
                method : "POST",
                params : {
                    "p": {
                        "busiNo": bo//业务功能bo
                    }
                },
            }).then(function (response) {
                var list = response.resultData.data;
                for(var i = 0;i<list.length;i++){
                    returnArray[i] = list[i]
                }
            },function (error) {
                // console.log(error);
            });
            return returnArray;
        }
    }]);
