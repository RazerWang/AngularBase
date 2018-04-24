/**
 * @Author WangZe (wangze@linkstec.com)
 * @Date 2018/3/14 10:00
 * @Function 穿梭框组件
 **/
/**
 * sourceData       源列表                          Array
 * targetData       目标列表                        Array
 * sourceName       源表头                          String
 * targetName       目标表头                        String
 * showSourceNum    是否展示源长度                  Boolean
 * showTargetNum    是否展示目标长度                Boolean
 * keyValue         键值                            String
 * isMultiple       是否是多选                      Boolean（默认 false ，单选）
 * isTree           是否是树形结构                  Boolean（默认 false ，非树形结构）
 * treeChildrenKey  树形结构子集的字段名称          String
 * isTable          是否是table结构                 Boolean
 * tableColumns     table列配置                     Array
 * tableColumns     table列配置                     Array
 * **/
crmApp.directive("linkageTransfer",['ngToast',function(ngToast){
    return {
        scope: {
            sourceData : "=",
            targetData : "=",
            sourceName: "=",
            targetName: "=",
            keyValue: "=",//scope.keyValue.split(',')[0]    scope.keyValue.split(',')[1]
            isMultiple: "=",
            isTree : "=",
            treeChildrenKey : "=",
            isTable : "=",
            tableColumns : '=',
            showSourceNum:"=",
            showTargetNum:"=",
        },
        restrict: 'EA',
        template: '<div class="transfer-wrap">' +
                        // 标题部分
                        '<ul class="transfer-title-box">' +
                            '<li class="transfer-title-item" style="width:{{transfer_leftBoxWidth+\'px\'}};" ng-bind="sourceName">--</li>'+
                            '<li class="transfer-title-item" style="width:{{transfer_rightBoxWidth+\'px\'}};margin-left: 70px;" ng-if="isMultiple || isTable || isTree" ng-bind="targetName">--</li>'+
                            '<li class="transfer-title-item" style="width:{{transfer_rightBoxWidth+\'px\'}};margin-left: 20px;" ng-if="!isMultiple && !isTable && !isTree" ng-bind="targetName">--</li>'+
                        '</ul>'+


                        // 穿梭框内容部分
                        '<div class="transfer-container clear-float" style="height: {{transfer_boxHeight+\'px\'}}">' +
                            // 穿梭框左边box
                            '<div class="transfer-box" style="width: {{transfer_leftBoxWidth+\'px\'}}">' +
                                '<div class="transfer-box-header">' +
                                    '<label class="transfer-item" style="display: inline-block;" ng-if="transferType == \'defaultMultiple\'">' +
                                        '<input type="checkbox" class="transfer-checkbox" ng-click="sourceDataCheckAllAction($event)" ng-checked = \'transfer_isChosenAll === 1\'>' +
                                        '<span>全选</span>' +
                                    '</label>' +
                                    '<span ng-if="showSourceNum" style="margin-left: 10px;line-height: 32px;">{{"可选记录("+transfer_sourceDataLeftLength+"条)"}}</span>'+
                                    // '<div style="padding: 0 10px;"><span ng-repeat="showSourceItem in show_source_lists" style="line-height: 32px;">{{showSourceItem}}<i class="lk-icon lk-icon-arrowR" ng-if="$index != show_source_lists.length-1" style="font-size: 12px;margin: 0 5px;"></i></span></div>'+
                                '</div>' +
                                // 基本类型
                                '<ul ng-if="!isTree && !isTable" class="transfer-list" style="width: {{transfer_leftBoxWidth+\'px\'}};height:{{transfer_boxHeight-44+\'px\'}};">' +
                                    '<li ng-repeat="sourceDataItem in transfer_sourceDataCopy" ng-hide="sourceDataItem.transfer_isHas === 1">' +
                                        '<label class="transfer-item">' +
                                            '<input type="checkbox" class="transfer-checkbox" ng-click="sourceDataCheckItemAction($event,sourceDataItem)" ng-checked="sourceDataItem.transfer_isChosen === 1">' +
                                            '<span class="transfer-item-text" title="{{sourceDataItem[itemValue]}}" style="width: {{transfer_leftBoxWidth-60+\'px\'}};">{{sourceDataItem[itemValue]}}</span>' +
                                        '</label>' +
                                    '</li>' +
                                '</ul>' +

                                // table结构 多选
                                '<div ng-if="isTable && isMultiple" class="transfer-list" style="margin:0;width: {{transfer_leftBoxWidth-2+\'px\'}};height:{{transfer_boxHeight-36+\'px\'}};overflow: hidden;">' +
                                    '<linkage-table columns="tableColumns" data="transfer_sourceDataCopy" set-table-height="transfer_boxHeight-36-40" has-checkbox="true" checked-list="transfer_tableTransfer.tableTransferSourceData" ></linkage-table>'+
                                '</div>'+
                                // table结构 单选
                                '<div ng-if="isTable && !isMultiple" class="transfer-list" style="margin:0;width: {{transfer_leftBoxWidth-2+\'px\'}};height:{{transfer_boxHeight-36+\'px\'}};overflow: hidden;">' +
                                    '<linkage-table columns="tableColumns" input-type="1" data="transfer_sourceDataCopy" set-table-height="transfer_boxHeight-36-40" has-checkbox="true" checked-list="transfer_tableTransfer.tableTransferSourceData" ></linkage-table>'+
                                '</div>'+

                                // 树形结构
                                '<div ng-if="isTree" class="transfer-list" style="width: {{transfer_leftBoxWidth+\'px\'}};height:{{transfer_boxHeight-44+\'px\'}};overflow-y: hidden;">' +
                                    '<div style="width: {{transfer_leftBoxWidth/3*source_lists.length+\'px\'}};height:{{transfer_boxHeight-44+\'px\'}};">' +
                                        '<ul ng-repeat="columnList in source_lists" ng-init="columnIndex = $index" style="width: {{transfer_leftBoxWidth/3+\'px\'}};height:{{transfer_boxHeight-44+\'px\'}};overflow-y: auto;overflow-x: hidden;float:left;">' +
                                            // 复选框类型
                                            // '<li ng-if="needTransferBtn" ng-repeat="treeItem in columnList">' +
                                            //     '<label ng-if="!treeItem[treeChildrenKey] || treeItem[treeChildrenKey].length === 0" class="transfer-item">' +
                                            //         '<input type="checkbox" ng-click="sourceDataCheckItemAction($event,treeItem)" ng-checked="treeItem.transfer_isChosen === 1">' +
                                            //         '<span class="transfer-item-text">{{treeItem[itemValue]}}</span>' +
                                            //     '</label>' +
                                            //     '<label ng-if="treeItem[treeChildrenKey] && treeItem[treeChildrenKey].length !== 0" class="transfer-item" ng-class="{\'active\':treeItem.transfer_isChosen === 1}" ng-click="treeItemClickAction(columnIndex,treeItem)" ng-dblclick="treeItemDbClickAction(treeItem)">' +
                                            //         '<span class="transfer-item-text">{{treeItem[itemValue]}}</span>' +
                                            //     '</label>' +
                                            // '</li>' +

                                            //单击选中+中间按钮 || 双击类型
                                            '<li ng-repeat="treeItem in columnList">' +
                                                '<label class="transfer-item" ng-class="{\'active\':treeItem.transfer_isChosen === 1,\'parent-active\':treeItem.transfer_isChosen === 1 && treeItem[treeChildrenKey] && treeItem[treeChildrenKey].length !== 0}" ng-click="treeItemClickAction(columnIndex,treeItem)" ng-dblclick="treeItemDbClickAction(treeItem)">' +
                                                    '<span class="transfer-item-text" title="{{treeItem[itemValue]}}" style="width: {{transfer_leftBoxWidth/3-40+\'px\'}};">{{treeItem[itemValue]}}</span>' +
                                                    '<i class="lk-icon lk-icon-arrowR" style="font-size: 12px;float: right;" ng-if="treeItem[treeChildrenKey] && treeItem[treeChildrenKey].length !== 0"></i>'+
                                                '</label>' +
                                            '</li>' +
                                        '</ul>' +
                                    '</div>'+
                                '</div>' +

                            '</div>' +
                            // 穿梭框左边box end


                            //穿梭框中间按钮
                            '<div class="transfer-btn-box" ng-if="isMultiple || isTable || isTree">' +
                                '<ul class="transfer-btn-list">' +
                                    '<li><span class="btn btn-default" ng-click="addToTargetDataAction()" ng-disabled="transfer_sourceDataIsChosenLength === 0"><i class="lk-icon lk-icon-arrowR-o" style="font-size: 14px;"></i></span></li>' +
                                    '<li><span class="btn btn-default" ng-click="removeFromTargetDataAction()" ng-disabled="transfer_targetDataIsChosenLength === 0"><i class="lk-icon lk-icon-arrowL-o" style="font-size: 14px;"></i></span></li>' +
                                '</ul>' +
                            '</div>' +
                            '<div class="transfer-btn-box" style="width: 20px;margin: 0;" ng-if="!isMultiple && !isTable && !isTree"></div>'+
                            //穿梭框中间按钮 end


                            //穿梭框右边box
                            '<div class="transfer-box" style="width: {{transfer_rightBoxWidth+\'px\'}}">' +
                                '<div class="transfer-box-header">' +
                                    '<label class="transfer-item fr">' +
                                        '<span ng-class="{\'text-blue\':transfer_targetDataCopy.length > 0}" ng-disabled="transfer_targetDataCopy.length === 0" ng-click="targetDataClearAction()">清空</span>' +
                                    '</label>' +
                                    '<span ng-if="showTargetNum" style="margin-left: 10px;line-height: 32px;">{{"可选记录("+transfer_targetDataLeftLength+"条)"}}</span>'+
                                '</div>' +
                                // 普通类型
                                '<ul ng-if="!isTable" class="transfer-list" style="width: {{transfer_rightBoxWidth+\'px\'}};height:{{transfer_boxHeight-44+\'px\'}};">' +
                                    // 基本类型
                                    '<li ng-if="transferType == \'defaultSingle\' || transferType == \'defaultMultiple\'" ng-repeat="targetDataItem in transfer_targetDataCopy">' +
                                        '<label class="transfer-item">' +
                                            '<input type="checkbox" class="transfer-checkbox" ng-if="isMultiple || isTable || isTree" ng-click="targetDataCheckItemAction($event,targetDataItem)" ng-checked="targetDataItem.transfer_isChosen === 1">' +
                                            '<span class="transfer-item-text" title="{{targetDataItem[itemValue]}}" style="width: {{transfer_rightBoxWidth-70+\'px\'}};">{{targetDataItem[itemValue]}}</span>' +
                                            '<i class="lk-icon lk-icon-delete-o transfer-delete-btn" title="移除" ng-click="removeFromTargetItemAction(targetDataItem)"></i>'+
                                        '</label>' +
                                    '</li>' +
                                    //树形
                                    '<li ng-if="transferType == \'treeSingle\' || transferType == \'treeMultiple\'" ng-repeat="targetDataItem in transfer_targetDataCopy">' +
                                        '<label class="transfer-item" ng-class="{\'active\':targetDataItem.transfer_isChosen === 1}" ng-click="targetDataItemClickAction(targetDataItem)" ng-dblclick="targetDataItemDbClickAction(targetDataItem)">' +
                                            '<span class="transfer-item-text" title="{{targetDataItem[itemValue]}}" style="width: {{transfer_rightBoxWidth-40+\'px\'}};">{{targetDataItem[itemValue]}}</span>' +
                                            '<i class="lk-icon lk-icon-delete-o transfer-delete-btn" title="移除" ng-click="targetDataItemDbClickAction(targetDataItem)"></i>'+
                                        '</label>' +
                                    '</li>' +
                                    '<no-data ng-if="transfer_targetDataCopy.length === 0"></no-data>'+
                                '</ul>' +

                                // table结构 多选
                                '<div ng-if="isTable && isMultiple" class="transfer-list transfer-right-list" style="margin:0;width: {{transfer_leftBoxWidth-2+\'px\'}};height:{{transfer_boxHeight-36+\'px\'}};overflow: hidden;">' +
                                    '<linkage-table columns="tableColumns" data="transfer_targetDataCopy" set-table-height="transfer_boxHeight-36-40" has-checkbox="true" checked-list="transfer_tableTransfer.tableTransferTargetData" ></linkage-table>'+
                                '</div>'+
                                // table结构 单选
                                '<div ng-if="isTable && !isMultiple" class="transfer-list transfer-right-list" style="margin:0;width: {{transfer_leftBoxWidth-2+\'px\'}};height:{{transfer_boxHeight-36+\'px\'}};overflow: hidden;">' +
                                    '<linkage-table columns="tableColumns" input-type="1" data="transfer_targetDataCopy" set-table-height="transfer_boxHeight-36-40" has-checkbox="true" checked-list="transfer_tableTransfer.tableTransferTargetData" ></linkage-table>'+
                                '</div>'+

                            '</div>' +
                            //穿梭框右边box end
                        '</div>' +
                        // 穿梭框内容部分 end

                    '</div>',
        replace: true,
        link: function(scope, element, attributes, controller) {
            /**************************************************默认配置*******************************************************************/
            if(typeof scope.sourceData === 'undefined'){
                scope.sourceData = [];
            }
            if(typeof scope.targetData === 'undefined'){
                scope.targetData = [];
            }
            if(typeof scope.sourceName === 'undefined'){
                scope.sourceName = '';
            }
            if(typeof scope.targetName === 'undefined'){
                scope.targetName = '';
            }
            if(typeof scope.showSourceNum === 'undefined'){
                scope.showSourceNum = false;
            }
            if(typeof scope.showTargetNum === 'undefined'){
                scope.showTargetNum = false;
            }
            if(typeof scope.keyValue === 'undefined'){
                scope.keyValue = '';
            }
            if(typeof scope.isMultiple === 'undefined'){
                scope.isMultiple = false;
            }
            if(typeof scope.isTree === 'undefined'){
                scope.isTree = false;
            }
            if(typeof scope.treeChildrenKey === 'undefined'){
                scope.treeChildrenKey = '';
            }
            if(typeof scope.isTable === 'undefined'){
                scope.isTable = false;
            }
            if(typeof scope.tableColumns === 'undefined'){
                scope.tableColumns = [];
            }
            /**************************************************params*******************************************************************/
            //判断是否是树形结构，树形3：1;  没有中间按钮的情况;  默认1：1
            if(scope.isTree){
                scope.transfer_leftBoxWidth = (angular.element(element[0]).width()-70)*3/4;
                scope.transfer_rightBoxWidth = (angular.element(element[0]).width()-70)/4;
            }else if(!scope.isMultiple && !scope.isTable){
                scope.transfer_leftBoxWidth = (angular.element(element[0]).width()-20)/2;
                scope.transfer_rightBoxWidth = (angular.element(element[0]).width()-20)/2;
            }else{
                scope.transfer_leftBoxWidth = (angular.element(element[0]).width()-70)/2;
                scope.transfer_rightBoxWidth = (angular.element(element[0]).width()-70)/2;
            }
            //判断有没有标题，有标题高度 - 30
            if(typeof scope.sourceName === 'undefined' || scope.sourceName === ''){
                scope.transfer_boxHeight = angular.element(element[0]).height();
            }else{
                scope.transfer_boxHeight = angular.element(element[0]).height()-30;
            }
            /**
             * 源列表 和 目标列表 备份
             * 只在该组件内使用
             * **/
            scope.transfer_sourceDataCopy = angular.copy(scope.sourceData);//源列表拷贝
            scope.transfer_targetDataCopy = angular.copy(scope.targetData);//目标列表拷贝

            scope.itemKey = scope.keyValue.split(',')[0];
            scope.itemValue = scope.keyValue.split(',')[1];

            scope.transfer_sourceDataIsChosenLength = 0;//源列表 当前选择项的长度
            scope.transfer_targetDataIsChosenLength = 0;//目标列表 当前选择项的长度

            scope.transfer_sourceDataLeftLength = 0;//源列表 可选择项的长度
            scope.transfer_targetDataLeftLength = 0;//源列表 可选择项的长度

            scope.transfer_isChosenAll = 0;//全选状态

            if(!scope.isTable && !scope.isTree && !scope.isMultiple){//基本 单选 无按钮
                scope.transferType = 'defaultSingle';
            }else if(!scope.isTable && !scope.isTree && scope.isMultiple){//基本 多选 有按钮
                scope.transferType = 'defaultMultiple';
            }else if(!scope.isTable && scope.isTree && !scope.isMultiple){//树形 单选 有按钮
                scope.transferType = 'treeSingle';
            }else if(!scope.isTable && scope.isTree && scope.isMultiple){//树形 多选 有按钮
                scope.transferType = 'treeMultiple';
            }else if(scope.isTable && !scope.isTree && !scope.isMultiple){//表格 单选 有按钮
                scope.transferType = 'tableSingle';
            }else if(scope.isTable && !scope.isTree && scope.isMultiple){//表格 多选 有按钮
                scope.transferType = 'tableMultiple';
            }
            /****************************************针对table结构类型*********************************************************************************/
            // 存放选择的数据变量
            scope.transfer_tableTransfer = {//table选中状态的list
                tableTransferSourceData : [],
                tableTransferTargetData : []
            };
            scope.$watch('transfer_tableTransfer.tableTransferSourceData',function (nV,oV) {
                if(nV != oV){
                    scope.transfer_sourceDataIsChosenLength = nV.length;
                }
            },true);
            scope.$watch('transfer_tableTransfer.tableTransferTargetData',function (nV,oV) {
                if(nV != oV){
                    scope.transfer_targetDataIsChosenLength = nV.length;
                }
            },true);
            /****************************************针对树形结构类型***********************************************************************/
            scope.source_lists = [];
            scope.source_lists[0] = angular.copy(scope.sourceData);
            // scope.show_source_lists=[];
            scope.current_selectItem = null;
            /**
             * 可选部分 单击操作
             * @param columnIndex
             * @param item
             */
            scope.treeItemClickAction = function (columnIndex,item) {
                var currentColumnList = scope.source_lists[columnIndex];
                /**如果当选不是已经选择的项目，则进行判断有无子集**/
                if(item.transfer_isChosen !== 1){
                    if(typeof item[scope.treeChildrenKey] !== 'undefined' && item[scope.treeChildrenKey].length !== 0){
                        scope.source_lists[columnIndex+1] = angular.copy(item[scope.treeChildrenKey]);
                        scope.transfer_sourceDataIsChosenLength = 0;//源列表 当前选择项的长度
                    }else{
                        scope.source_lists = scope.source_lists.slice(0,columnIndex+1);
                        // scope.show_source_lists = scope.show_source_lists.slice(0,columnIndex);
                        scope.current_selectItem = item;
                        scope.transfer_sourceDataIsChosenLength = 1;//源列表 当前选择项的长度
                    }
                }
                // scope.show_source_lists[columnIndex] = item[scope.itemValue];
                /**单项状态的改变**/
                for(var k=0;k<currentColumnList.length;k++){
                    if(currentColumnList[k][scope.itemKey] === item[scope.itemKey]){
                        currentColumnList[k].transfer_isChosen = 1;
                    }else {
                        currentColumnList[k].transfer_isChosen = 0;
                    }
                }
            };
            /**
             * 可选部分 双击操作
             * @param item
             */
            scope.treeItemDbClickAction = function (item) {
                /**如果当选不是已经选择的项目，则进行判断有无子集**/
                if(typeof item[scope.treeChildrenKey] === 'undefined' || item[scope.treeChildrenKey].length === 0){
                    var isHasFlag = false;
                    if(scope.isMultiple){//多选的情况
                        for(var j=0;j<scope.transfer_targetDataCopy.length;j++){
                            if(scope.transfer_targetDataCopy[j][scope.itemKey] === item[scope.itemKey]){
                                isHasFlag = true;
                            }
                        }
                        if(!isHasFlag){
                            var toRightItem = angular.copy(item);
                            toRightItem.transfer_isChosen = 0;//添加到右边之前将选择状态初始化
                            scope.transfer_targetDataCopy.push(toRightItem);
                        }
                    }else{
                        var toRightSingleItem = angular.copy(item);
                        toRightSingleItem.transfer_isChosen = 0;//添加到右边之前将选择状态初始化
                        scope.transfer_targetDataCopy[0] = toRightSingleItem;
                    }
                }
            };
            /**
             * 已选部分 单击操作
             * @param item
             */
            scope.targetDataItemClickAction = function (item) {
                /**单项状态的改变**/
                for(var k=0;k<scope.transfer_targetDataCopy.length;k++){
                    if(scope.transfer_targetDataCopy[k][scope.itemKey] === item[scope.itemKey]){
                        scope.transfer_targetDataCopy[k].transfer_isChosen = 1;
                    }else {
                        scope.transfer_targetDataCopy[k].transfer_isChosen = 0;
                    }
                }
            };
            /**
             * 已选部分 双击操作
             * @param item
             */
            scope.targetDataItemDbClickAction = function (item) {
                if(scope.isMultiple){//多选的情况
                    for(var j=0;j<scope.transfer_targetDataCopy.length;j++){
                        if(scope.transfer_targetDataCopy[j][scope.itemKey] === item[scope.itemKey]){
                            scope.transfer_targetDataCopy.splice(j,1);
                        }
                    }
                }else{
                    scope.transfer_targetDataCopy = [];
                }
            };
            /**************************************************可选部分*****************************************************************/
            /**
             * 可选部分 选择操作
             * @param e
             * @param item
             */
            scope.sourceDataCheckItemAction = function (e,item) {
                var _target = e.target;
                if(scope.isMultiple){//多选的情况
                    /**单项状态字段的改变**/
                    for(var j=0;j<scope.transfer_sourceDataCopy.length;j++){
                        if(scope.transfer_sourceDataCopy[j][scope.itemKey] === item[scope.itemKey]){
                            if(_target.checked){
                                scope.transfer_sourceDataCopy[j].transfer_isChosen = 1;
                            }else{
                                scope.transfer_sourceDataCopy[j].transfer_isChosen = 0;
                            }
                        }
                    }
                }else{//单选的情况
                    /**单项状态的改变**/
                    for(var k=0;k<scope.transfer_sourceDataCopy.length;k++){
                        if(_target.checked){
                            if(scope.transfer_sourceDataCopy[k][scope.itemKey] === item[scope.itemKey]){
                                scope.transfer_sourceDataCopy[k].transfer_isChosen = 1;
                                if(scope.transferType === 'defaultSingle'){
                                    scope.transfer_targetDataCopy[0] = angular.copy(item);
                                }
                            }else {
                                scope.transfer_sourceDataCopy[k].transfer_isChosen = 0;
                            }
                        }else {
                            scope.transfer_sourceDataCopy[k].transfer_isChosen = 0;
                            if(scope.transferType === 'defaultSingle'){
                                scope.transfer_targetDataCopy = [];
                            }
                        }
                    }
                }
            };
            /**
             * 中间部分 添加操作
             */
            scope.addToTargetDataAction = function () {
                if(scope.transferType === 'defaultMultiple'){//基本类型
                    for(var i=0;i<scope.transfer_sourceDataCopy.length;i++){
                        var isHasFlag = false;
                        if(scope.transfer_sourceDataCopy[i].transfer_isChosen === 1){
                            for(var j=0;j<scope.transfer_targetDataCopy.length;j++){
                                if(scope.transfer_targetDataCopy[j][scope.itemKey] === scope.transfer_sourceDataCopy[i][scope.itemKey]){
                                    isHasFlag = true;
                                }
                            }
                            if(!isHasFlag){
                                var toRightItem = angular.copy(scope.transfer_sourceDataCopy[i]);
                                scope.transfer_targetDataCopy.push(toRightItem);
                            }
                        }
                    }
                }else if(scope.transferType === 'treeMultiple'){//树形结构 多选
                    var treeIsHasFlag = false;
                    for(var w=0;w<scope.transfer_targetDataCopy.length;w++){
                        if(scope.transfer_targetDataCopy[w][scope.itemKey] === scope.current_selectItem[scope.itemKey]){
                            treeIsHasFlag = true;
                        }
                    }
                    if(!treeIsHasFlag){
                        var treeToRightItem = angular.copy(scope.current_selectItem);
                        treeToRightItem.transfer_isChosen = 0;//添加到右边之前将选择状态初始化
                        scope.transfer_targetDataCopy.push(treeToRightItem);
                    }
                }else if(scope.transferType === 'treeSingle'){//树形结构 单选
                    var treeToRightSingleItem = angular.copy(scope.current_selectItem);
                    treeToRightSingleItem.transfer_isChosen = 0;//添加到右边之前将选择状态初始化
                    scope.transfer_targetDataCopy[0] = treeToRightSingleItem;
                }else if(scope.transferType === 'tableMultiple'){//table结构
                    for(var r=0;r<scope.transfer_tableTransfer.tableTransferSourceData.length;r++) {
                        var tableIsHasFlag = false;
                        for (var e = 0; e < scope.transfer_targetDataCopy.length; e++) {
                            if (scope.transfer_targetDataCopy[e][scope.itemKey] === scope.transfer_tableTransfer.tableTransferSourceData[r][scope.itemKey]) {
                                tableIsHasFlag = true;
                            }
                        }
                        if (!tableIsHasFlag) {
                            var tableToRightItem = angular.copy(scope.transfer_tableTransfer.tableTransferSourceData[r]);
                            tableToRightItem.transfer_isChosen = 0;//添加到右边之前将选择状态初始化
                            scope.transfer_targetDataCopy.push(tableToRightItem);
                        }
                    }
                }else if(scope.transferType === 'tableSingle'){
                    for(var q=0;q<scope.transfer_tableTransfer.tableTransferSourceData.length;q++) {
                        var tableSingleIsHasFlag = false;
                        for (var a = 0; a < scope.transfer_targetDataCopy.length; a++) {
                            if (scope.transfer_targetDataCopy[a][scope.itemKey] === scope.transfer_tableTransfer.tableTransferSourceData[q][scope.itemKey]) {
                                tableIsHasFlag = true;
                            }
                        }
                        if (!tableSingleIsHasFlag) {
                            var tableToRightSingleItem = angular.copy(scope.transfer_tableTransfer.tableTransferSourceData[q]);
                            tableToRightSingleItem.transfer_isChosen = 0;//添加到右边之前将选择状态初始化
                            scope.transfer_targetDataCopy[0] = tableToRightSingleItem;
                        }
                    }
                }

            };
            /**
             * 可选部分 全选操作
             * @param e
             */
            scope.sourceDataCheckAllAction = function (e) {
                var _target = e.target;
                /**全选状态改变**/
                if(_target.checked){
                    scope.transfer_isChosenAll = 1;
                }else{
                    scope.transfer_isChosenAll = 0;
                }
                /**单项状态的改变**/
                for(var j=0;j<scope.transfer_sourceDataCopy.length;j++){
                    if(_target.checked){
                        scope.transfer_sourceDataCopy[j].transfer_isChosen = 1;
                    }else{
                        scope.transfer_sourceDataCopy[j].transfer_isChosen = 0;
                    }
                }
            };


            /**************************************************已选部分*****************************************************************/
            /**
             * 已选部分 选择操作
             * @param e
             * @param item
             */
            scope.targetDataCheckItemAction = function (e,item) {
                var _target = e.target;
                /**状态的改变**/
                for(var j=0;j<scope.transfer_targetDataCopy.length;j++){
                    if(scope.transfer_targetDataCopy[j][scope.itemKey] === item[scope.itemKey]){
                        if(_target.checked){
                            scope.transfer_targetDataCopy[j].transfer_isChosen = 1;
                        }else{
                            scope.transfer_targetDataCopy[j].transfer_isChosen = 0;
                        }
                    }
                }
            };

            /**
             * 中间部分 移除操作
             */
            scope.removeFromTargetDataAction = function () {
                if(!scope.isTable){//非表格结构
                    for(var j=scope.transfer_targetDataCopy.length-1;j>=0;j--){
                        if(scope.transfer_targetDataCopy[j].transfer_isChosen === 1){
                            scope.transfer_targetDataCopy.splice(j,1);
                        }
                    }
                }else{//table结构
                    for(var r=0;r<scope.transfer_tableTransfer.tableTransferTargetData.length;r++) {
                        for (var e = scope.transfer_targetDataCopy.length-1; e >= 0; e--) {
                            if (scope.transfer_targetDataCopy[e][scope.itemKey] === scope.transfer_tableTransfer.tableTransferTargetData[r][scope.itemKey]) {
                                scope.transfer_targetDataCopy.splice(e,1);
                            }
                        }
                    }
                    scope.transfer_tableTransfer.tableTransferTargetData = [];
                }

            };
            /**
             * 已选部分 清空操作
             */
            scope.targetDataClearAction = function () {
                scope.transfer_targetDataCopy = [];
            };
            /**
             * 移除单项操作
             */
            scope.removeFromTargetItemAction = function (item) {
                //移除单项
                for(var i=scope.transfer_targetDataCopy.length-1;i>=0;i--){
                    if(scope.transfer_targetDataCopy[i][scope.itemKey] === item[scope.itemKey]){
                        scope.transfer_targetDataCopy.splice(i,1);
                    }
                }
            };

            /**********************************监听区域***************************************************/

            /**
             * 监听可选部分数据
             * **/
            scope.$watch('transfer_sourceDataCopy',function (nV,oV) {
                //检验可选部分选择项目的数量
                var num = 0;
                for(var j=0;j<nV.length;j++){
                    if(nV[j].transfer_isChosen === 1){
                        num++;
                    }
                }
                scope.transfer_sourceDataIsChosenLength = num;
                scope.transfer_sourceDataLeftLength = nV.length;//未选择部分，可选择的长度
                if(scope.transferType === 'defaultMultiple'){
                    var leftNum = 0;
                    for(var i=0;i<nV.length;i++){
                        if(nV[i].transfer_isHas !== 1){
                            leftNum++;
                        }
                    }
                    scope.transfer_sourceDataLeftLength = leftNum;
                }

                //检查可选部分选择项目是不是全选
                if(nV.length === num){
                    scope.transfer_isChosenAll = 1;
                }else{
                    scope.transfer_isChosenAll = 0;
                }

            },true);

            /**
             * 监听已选部分数据
             * **/
            scope.$watch('transfer_targetDataCopy',function (nV,oV) {
                //检验已选部分选择项目的数量
                var num = 0;
                for(var j=0;j<nV.length;j++){
                    if(nV[j].transfer_isChosen === 1){
                        num++;
                    }
                }
                scope.transfer_targetDataIsChosenLength = num;//已经选择部分，选择长度
                scope.transfer_targetDataLeftLength = nV.length;//已经选择部分，可选择的长度

                //基本类型 重置未选部分当前选择状态
                if(scope.transferType === 'defaultSingle' || scope.transferType === 'defaultMultiple'){
                    for(var i=0;i<scope.transfer_sourceDataCopy.length;i++){
                        scope.transfer_sourceDataCopy[i].transfer_isChosen = 0;
                        scope.transfer_sourceDataCopy[i].transfer_isHas = 0;
                        for(var k=0;k<nV.length;k++){
                            if(nV[k][scope.itemKey] === scope.transfer_sourceDataCopy[i][scope.itemKey]){
                                if(scope.transferType === 'defaultSingle'){
                                    scope.transfer_sourceDataCopy[i].transfer_isChosen = 1;
                                }else{
                                    scope.transfer_sourceDataCopy[i].transfer_isHas = 1;
                                }
                                break;
                            }
                        }
                    }
                }

                //将备份的值赋给target
                scope.targetData = [];
                for(var q=0;q<nV.length;q++){
                    scope.targetData[q] = angular.copy(scope.transfer_targetDataCopy[q]);
                    delete scope.targetData[q].transfer_isChosen;
                    delete scope.targetData[q].transfer_isHas;
                }
                // console.log(scope.targetData);
            },true);




        }
    }
}]);