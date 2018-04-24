/**
 * Created by sh on 2017/11/17.
 */

/**
 * responseTotalSize    返回数据的条数
 * getDataFunction      ajax请求function
 * currentPageNum       当前页页码
 * currentPageSize      当前一页显示条数
 * isSimple             是否是简短的样式
 * **/
crmApp.directive("linkagePager",["ngToast",function(ngToast){
    return {
        scope: {
            responseTotalSize : "=",
            getDataFunction : "=",
            currentPageNum : "=",
            currentPageSize : "=",
            isSimple : "@"
        },
        restrict: 'EA',
        template: '<div class="pagination-bar"><div class="pagination-box">' +
                        '<!--下拉框-->'+
                        '<span class="deep-grey-text text-v-center big-gap fl" ng-hide="isSimple == \'true\'">显示行数</span>' +
                        '<select class="pagination-select" ng-model="currentPageSize" ng-change="changePageSizeAction()" ng-hide="isSimple == \'true\'">' +
                            '<option value="{{paginationSelectItem.key}}" ng-repeat="paginationSelectItem in paginationSelectList">{{paginationSelectItem.value}}</option>' +
                        '</select>' +

                        '<span class="btn pagination-btn" ng-class="{\'disabled\':isFirst || responseTotalSize == 0}" ng-click="prevPageAction()">上一页</span>' +
                        '<!--翻页、页码按钮组-->'+
                        '<ul class="pagination-list"  ng-if="isSimple != \'true\'"><li class="pagination-item-ellipsis"' +
                            'ng-class="{\'btn\':paginationItemNumber != \'-1\',\'pagination-item\':paginationItemNumber != \'-1\',\'pagination-item-active\':currentPageNum == paginationItemNumber}"' +
                            'ng-repeat="paginationItemNumber in paginationList track by $index"' +
                            'ng-click="paginationItemAction(paginationItemNumber)">' +
                            '{{paginationItemNumber==-1?\'...\':paginationItemNumber}}' +
                            '</li></ul>' +

                        '<!--简洁版展示当前页数/总页数-->'+
                        '<span class="deep-grey-text text-v-center fl" ng-if="isSimple == \'true\'">{{currentPageNum}}</span>' +
                        '<span class="deep-grey-text text-v-center big-gap fl" ng-if="isSimple == \'true\'">/{{lastPageNumber}}</span>' +

                        '<span class="btn pagination-btn big-gap" ng-class="{\'disabled\':isLast || responseTotalSize == 0}" ng-click="nextPageAction()">下一页</span>' +
                        '<span class="deep-grey-text text-v-center gap fl" ng-hide="isSimple == \'true\'">共<span>{{responseTotalSize}}</span>条</span>' +

                        '<!--跳转页码-->'+
                        '<span class="deep-grey-text text-v-center big-gap fl">前往</span>' +
                        '<input type="text" class="pagination-input big-gap" ng-model="showPageNum" ng-keydown="toPageNumAction($event)">' +
                        '<span class="deep-grey-text text-v-center big-gap fl">页</span>' +
                        '<span class="btn pagination-btn big-gap" ng-class="{\'disabled\': responseTotalSize == 0}" ng-click="clickToPageNumAction()">确定</span>' +
                    '</div></div>',
        replace: true,
        link: function(scope, element, attributes, controller) {
            /**
             * params
             * **/
            scope.paginationSelectList = [{"key" : "10","value" : "10条"},
                {"key" : "20","value" : "20条"},
                {"key" : "50","value" : "50条"},
                // {"key" : "100","value" : "100条"}
                ];//下拉条数展示列表
            scope.isFirst = true;//是否是第一页
            scope.isLast = true;//是否是最后一页
            scope.currentPageSize = '10';//当前下拉选中条数(分页大小)
            scope.currentPageNum = '1';//当前页码
            scope.showPageNum = scope.currentPageNum;//跳转展示用的页码

            scope.paginationList = [];//按钮组list  如:[1,2,3,4,-1,6]
            scope.lastPageNumber = 0;
            /**
             * init
             * **/
            scope.$watch('responseTotalSize',function (nV,oV) {
                if(nV != oV){
                    checkPagination();
                }
            });
            scope.$watch('currentPageNum',function (nV,oV) {
                if(nV != oV){
                    scope.getDataFunction();
                    checkPagination();
                }
            });
            scope.$watch('currentPageSize',function (nV,oV) {
                if(nV != oV){
                    scope.getDataFunction();
                    checkPagination();
                }
            });
            /************************************Action************************************************************************************/
            /**
             * 跳转页码
             * A、回车触发
             * B、点击触发
             * **/
            scope.toPageNumAction = function (e) { //回车触发跳转
                if(scope.currentPageNum === scope.showPageNum){
                    return;
                }
                var keyCode=e.keyCode ? e.keyCode:e.which?e.which:e.charCode;
                if(keyCode == "13"){
                    if(checkGoToPageNum()){
                        scope.currentPageNum = scope.showPageNum;//当前页码
                    }
                }
            };
            scope.clickToPageNumAction = function () { //失去焦点触发跳转
                if(scope.currentPageNum === scope.showPageNum){
                    return;
                }
                if(checkGoToPageNum()){
                    scope.currentPageNum = scope.showPageNum;//当前页码
                }
            };
            scope.$watch('currentPageNum',function (nV,oV) {
                if(nV !== oV){
                    scope.showPageNum = scope.currentPageNum;//跳转展示用的页码
                }
            });
            /**
             * 下拉框选择页数逻辑
             * **/
            scope.changePageSizeAction = function () {
                scope.currentPageNum = '1';//当前页码
            };
            /**
             * 页码按钮逻辑
             * **/
            scope.paginationItemAction = function (itemNumber) {
                if(itemNumber == '-1'){
                    return;
                }
                scope.currentPageNum = itemNumber;
            };
            /**
             * 上一页
             * **/
            scope.prevPageAction = function () {
                if(scope.currentPageNum == '1'){
                    return;
                }
                scope.currentPageNum--;
            };
            /**
             * 下一页
             * **/
            scope.nextPageAction = function () {
                if(scope.currentPageNum == scope.lastPageNumber){
                    return;
                }
                scope.currentPageNum++;
            };
            /**********************************Function******************************************************************************/
            /**
             * 检查当前页码，展示按钮的paginationList
             * **/
            function checkPagination() {
                //判断最后一页
                var isInt = Number(scope.responseTotalSize)%Number(scope.currentPageSize);
                if(isInt == '0'){
                    scope.lastPageNumber = Number(scope.responseTotalSize)/Number(scope.currentPageSize);
                }else{
                    scope.lastPageNumber = (Number(scope.responseTotalSize)-isInt)/Number(scope.currentPageSize)+1;
                }
                checkIsFirstOrLast(scope.lastPageNumber);
                formatterPaginationList(scope.lastPageNumber);
            }
            /**
             * 检查是否是第一页或者最后一页
             * **/
            function checkIsFirstOrLast(lastPageNum) {
                if(scope.currentPageNum == '1'){
                    scope.isFirst = true;
                }else{
                    scope.isFirst = false;
                }
                if(scope.currentPageNum == lastPageNum){
                    scope.isLast = true;
                }else{
                    scope.isLast = false;
                }
            }
            /**
             * 格式化按钮组list,情况如下：
             * A、当最后一页小于等于8，有多少展示多少 [1,2,3,4,5,6,7,8]
             * B、当最后一页大于8
             *  b1、前面6个，后面省略号，最后一页 [1,2,3,4,5,6,-1,9]
             *  b2、后面6个，前面省略号，第一页 [1,-1,4,5,6,7,8,9]
             *  b3、第一页，省略号，中间5个，省略号，最后一页 [1,-1,3,4,5,6,7,-1,9]
             * **/
            function formatterPaginationList(lastPageNum) {
                scope.paginationList = [];
                if(lastPageNum <= 8){ //A
                    for(var i=1;i<=lastPageNum;i++){
                        scope.paginationList.push(i);
                    }
                }else{ //B
                    if(scope.currentPageNum < 5){ //b1----[1,2,3,4,5,6,-1,9]
                        for(var j=1;j<=8;j++){
                            if(j < 7){
                                scope.paginationList.push(j);
                            }else if(j === 7){
                                scope.paginationList.push(-1);
                            }else{
                                scope.paginationList.push(lastPageNum);
                            }
                        }
                    }else if(lastPageNum - scope.currentPageNum < 4){ //b2----[1,-1,4,5,6,7,8,9]
                        for(var k=7;k>=0;k--){
                            if(k === 7){
                                scope.paginationList.push(1);
                            }else if(k === 6){
                                scope.paginationList.push(-1);
                            }else if(k < 6){
                                scope.paginationList.push(lastPageNum-k);
                            }
                        }
                    }else{  //b3----[1,-1,3,4,5,6,7,-1,9]
                        for(var l=0;l<=8;l++){
                            if(l === 0){
                                scope.paginationList.push(1);
                            }else if(l === 1 || l === 7){
                                scope.paginationList.push(-1);
                            }else if(l === 8){
                                scope.paginationList.push(lastPageNum);
                            }else{
                                scope.paginationList.push(scope.currentPageNum-4+l);
                            }
                        }
                    }
                }
            }
            /**
             * 检查输入框的值
             * **/
            function checkGoToPageNum() {
                var tipsStr = '';
                var reg = /^[1-9]\d*$/;
                if(scope.showPageNum > scope.lastPageNumber){
                    tipsStr = '最大页码为:'+scope.lastPageNumber+'<br/>请输入有效页码';
                    toast(tipsStr);
                    scope.showPageNum = "";
                    return false;
                }else if(scope.showPageNum < 1){
                    tipsStr = '最小页码为:1<br/>请输入有效页码';
                    toast(tipsStr);
                    scope.showPageNum = "";
                    return false;
                }else if(scope.showPageNum === "" || scope.showPageNum === undefined){
                    tipsStr = '请输入页码';
                    toast(tipsStr);
                    return false;
                }else if(!reg.test(scope.showPageNum)){
                    tipsStr = '请输入正确页码';
                    toast(tipsStr);
                    return false;
                }else{
                    return true;
                }
            }
            /**
             * warning toast
             * **/
            function toast(string){
                ngToast.create({
                    className: 'warning',
                    timeout:2000,
                    content: string,
                    zIndex : 9999
                });
            }
        }
    }
}]);