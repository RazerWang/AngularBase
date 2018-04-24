/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2018-03-29 14:40:13
 * @function  筛选条件
 */

crmApp.directive("linkageSelectconditions",['$timeout','ngToast',"$sce",function($timeout,ngToast,$sce){
    return {
        scope: {
            conditionsData : "=",  //待选择条件数据
            selectedConditions:"=",//已选择的数据
            conditionKeyValue:"@",//循环条件的主键和显示名的key 和 父级的标识
            tabData:"=",//以及tab显示的数据
            tabKeyValue:"@",//循环条件的主键和显示名的key
            // linkKey:"@"//一级和二级的关联字段   

        },
        restrict: 'EA',
        template: '<div class="select-conditions-wrap">'+
        				'<!--已选择条件-->'+
        				'<div class="selected-list-wrap">'+
                            '<div class="selected-conditions-div">'+
                                '<div class="selected-conditions-title">筛选条件：</div>'+
                                '<div class="clear-condotions-btn" ng-if="selectedConditions.length!=0" ng-click="delAllSelectedCon()">清空</div>'+
                            '</div>'+
        					'<div class="selected-conditions">'+
                                '<ul class="selected-conditions-ul">'+
                                    '<li class="selected-conditions-item" ng-repeat="item in selectedConditions track by $index">'+
                                        '<span class="selected-conditions-name">{{item[conditionValue]}}:{{item.children[0][conditionValue]}}</span>'+
                                        '<i class="lk-icon lk-icon-close-o" ng-click="delSelectCondition(item,$index)"></i>'+
                                    '</li>'+
                                '</ul>'+
                            '</div>'+
        					// '<div class="open-conditions-btn">'+
        					// 	'<button class="btn btn-default btn-outline"><span>展开更多</span><i class="lk-icon lk-icon-arrowD"></i></span>'+
        					// '</div>'+
        				'</div>'+
        				'<!--待选择条件-->'+
        				'<div class="to-select-conditions">'+
        					'<!--一级菜单-->'+
        					'<div class="first-conditions">'+
        						'<ul class="first-conditions-ul">'+
        							'<li class="first-conditions-item" ng-repeat="tab in tabData track by $index" ng-class={"tab-active":curTabKey==tab[tabKey]} ng-click="switchTypeTab(tab)">'+
        								'<span class="first-conditions-name" >{{tab[tabValue]}}</span>'+
        							'</li>'+
        						'</ul>'+
        					'</div>'+
        					'<!--二级菜单-->'+
        					'<div class="second-conditions">'+
        						'<ul class="second-conditions-ul">'+
        							'<li class="second-conditions-item" ng-repeat="condition in conditionsData track by $index" ng-show="curTabKey==condition[tabKey]">'+
        								'<div class="second-conditions-title">{{condition[conditionValue]}}：</div>'+
        								'<div class="third-conditions">'+
        									'<ul class="third-conditions-ul">'+
                                                '<!--一般逻辑-->'+
        										'<li class="third-conditions-item" ng-repeat="itemCon in condition.children track by $index" ng-click="selectCondition(condition,itemCon)" ng-class={"selected-active":checkIsSelect(itemCon)} ng-if="itemCon.colType!=1">'+
        											'<span class="third-conditions-item-name">{{itemCon[conditionValue]}}</span>'+
        										'</li>'+
                                                '<!--阈值 判断-->'+
                                                '<li class="third-conditions-item" ng-repeat="itemCon in condition.children track by $index"  ng-class={"selected-active":checkIsSelect(itemCon)} ng-if="itemCon.colType==1">'+
                                                    // ng-click="selectCondition(condition,itemCon)"
                                                    '<div class="insert-form">'+
                                                        '<div class="form-wrap small-form-wrap" style="margin-right:5px;width:70px"><input type="number" class="form-control" placeholder="请输入" ng-model="itemCon.start"/></div>-'+
                                                        '<div class="form-wrap small-form-wrap" style="margin-left:5px;width:70px"><input type="number" class="form-control" placeholder="请输入" ng-model="itemCon.end"/></div>'+
                                                    '</div>'+
                                                    '<span class="third-conditions-item-name" style="margin:0px 8px">{{itemCon[conditionValue]}}</span>'+
                                                    '<button class="btn btn-blue small-btn" ng-click="moreSearchCondition(condition,itemCon)"><span>添加</span></button>'+
                                                '</li>'+
        									'</ul>'+
        								'</div>'+
        							'</li>'+
        						'</ul>'+
        					'</div>'+
        				'</div>'+
        		  '</div>',
        replace: true,
        link: function(scope, element, attributes, controller) {

            
		/***********************变量区域***********************/

            // console.log()
		    

		    // 父级菜单 对应的 主键和显示变量
		    scope.tabKey = scope.tabKeyValue.split(',')[0];
		    scope.tabValue = scope.tabKeyValue.split(',')[1];

		    // 当前的显示的父级的tab的key
		    scope.curTabKey = scope.tabData.length>0?scope.tabData[0][scope.tabKey]:"";

		    // 条件 对应的 主键和显示变量
		    scope.conditionKey = scope.conditionKeyValue.split(',')[0];
            scope.conditionValue = scope.conditionKeyValue.split(',')[1];

            scope.selectedConditions = scope.selectedConditions?scope.selectedConditions:[];
		    // scope.conditionParentKey = scope.conditionKeyValue.split(',')[2];


		    // 父级和子级的关联的字段
		    // scope.linkKey = 



		/***********************函数区域***********************/

            // 选中某个选项
            scope.selectCondition = function(parentItemParam,itemParam){

                // 判定是否已经添加了该字段的数据
                var parentIsExistIndex = -1;
                var parentExistKey = "";
                var curIsExist = -1;//判断当前点击项是否已经在已选择中

                var item = angular.copy(itemParam);
                if(itemParam.colType=="1"){
                    if((item.start == "" || item.start == undefined) && (item.end == "" || item.end == undefined)){
                        ngToast.warning({
                            timeout:1000,
                            content: '请输入有效内容'
                        });
                        return;
                    }else if((item.start == "" || item.start == undefined) && (item.end != "" && item.end != undefined)){
                        item[scope.conditionValue] = item.end+'以下'+item[scope.conditionValue];
                        item.sql = item.sqlStr+"<"+item.end;
                    }else if((item.start != "" && item.start != undefined) && (item.end == "" || item.end == undefined)){
                        item[scope.conditionValue] = item.start+'以上'+item[scope.conditionValue];
                        item.sql = item.sqlStr+">="+item.start;
                    }else{
                        item[scope.conditionValue] = item.start+"-"+item.end+item[scope.conditionValue];
                        item.sql = item.sqlStr+">="+item.start+" and "+item.sqlStr+"<"+item.end;
                    }

                }

                for(var i =0;i<scope.selectedConditions.length;i++){
                    if(scope.selectedConditions[i][scope.conditionKey]==parentItemParam[scope.conditionKey]){
                        parentIsExistIndex = i;
                        existKey = scope.selectedConditions[i].children[0][scope.conditionKey];

                        if(scope.selectedConditions[i].children[0][scope.conditionKey]==itemParam[scope.conditionKey]){
                            curIsExist = i;

                        }
                    }
                }
                

                // 表示当前选择项已经选择了，取消
                if(curIsExist>-1&&itemParam.colType!="1"){
                    scope.selectedConditions.splice(curIsExist,1);
                    return;
                }

                // 拼接需要存储的数据
                var insertCondition = {};
                insertCondition[scope.conditionKey] = parentItemParam[scope.conditionKey];
                insertCondition[scope.conditionValue] = parentItemParam[scope.conditionValue];
                insertCondition.children = [];

                // 判断是否是 start和end

                if(itemParam.colType=="1"){
                    insertCondition.children.push(item);
                }else{
                    insertCondition.children.push(itemParam);
                }
                

                // 判断是否应存在了
                if(parentIsExistIndex>-1){
                    // 判定下是否是 多选
                    if(parentItemParam.isMuilt==="1"){

                        scope.selectedConditions.push(item);

                    }else{
                        scope.selectedConditions[parentIsExistIndex] = insertCondition;
                         
                    }
                }else{

                    
                    scope.selectedConditions.push(insertCondition);

                }
                
            }


		    // 点击切换以及的类型tab的时候调用
		    scope.switchTypeTab = function(itemParam){
		    	scope.curTabKey = itemParam[scope.tabKey];
		    }

            // 清空所有所选项
            scope.delAllSelectedCon = function(){
                scope.selectedConditions = [];
            }

            // 删除某一个选项
            scope.delSelectCondition = function(itemParam,indexParam){
                scope.selectedConditions.splice(indexParam,1);


            }
            // 为了在待选择区域，已选择的选项设置为蓝色背景的选中状态
            scope.checkIsSelect = function (itemParam) {
                var flag = false;
                for(var i = 0;i<scope.selectedConditions.length;i++){
                    // 判断当前的
                    if(scope.selectedConditions[i].children[0][scope.conditionKey]==itemParam[scope.conditionKey]){
                        flag = true;
                    }
                }
                
                return flag;
            }

            // 添加
            scope.moreSearchCondition = function(parentItemParam,itemParam){
                scope.selectCondition(parentItemParam,itemParam)
            }

    	/***********************初始化区域**********************/


    	/***********************监控区域**********************/
 			
 			// 监控待选择条件数据结构
            scope.$watch('conditionsData',function(nv,ov){
                
            },true)



        }
    }
}])
