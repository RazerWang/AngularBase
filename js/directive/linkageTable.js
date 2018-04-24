/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2017-11-10 10:04:45
 * @function  table组件
 * 功能点：1、固定头和固定列
 *        2、标记列表头的显示和顺序
 */

/**
 * dataSource   table数据
 * dataColumns  表头
 * **/
crmApp.directive("linkageTable",['$timeout','ngToast',"$sce","$compile",function($timeout,ngToast,$sce,$compile){
    return {
        scope: {
            data : "=",  //列表的数据
            columns : "=", //列表的列项
            setTableHeight:"=",//设置的表格的高度
            sortField:"=",//排序的字段
            sortDirection:"=",// 排序类型
            pagerCurrentNum:"=",//当前页码
            pagerGoNum:"=",//跳转到
            responseTotalSize:"=",//共多少条数据
            // totalPage:"=",//
            // spaceDiv:"=",
            fetchDataFunction:"=",//回调函数
            // footerColumns:"=",//
            // footerData:"=",
            hasCheckbox:"=",//第一列是否显示 checkbox
            crossPageCkbox:"@",//是否需要跨页全选
            inputType:"@",//0 表示 checkbox 1 表示单选
            pageCkFlag:"=",//全选
            checkedList:"=", //选中的数据列表
            checkedListKey:"=",
            // currentPageNum:"="
            settingFlag:"=", //判断是否有最后一列的设置表头
            operateMenuListFun:"=",//操作项的回调逻辑
            trClickFunction:"=",//整行点击回调
            trClickClass:"=",
        },
        restrict: 'EA',
        template: '<div class="table-wrap"><div class="table-container" ng-mouseleave="outTableBody()">'+
                        '<!--头部 ng-if="hiddenFixedTableLong"-->'+
                        '<div class="tableDiv table-header" ng-class={"right-scroll":hasScroll} >'+
                            '<table class="table table-hover ">'+
                                '<thead>'+
                                    '<tr style="z-index:10">'+
                                        '<th ng-if="hasCheckbox&&showColumns.length!=0" style="max-width:40px;min-width:40px;width:40px;"   rowspan="{{showColumns.length!=repeatTdColumns.length?2:1}}"><input  type="checkbox" name="" ></th>'+
                                        '<th ng-repeat="thData in showColumns track by $index" key="{{thData.key}}" rowspan="{{thData.rowspan?thData.rowspan:1}}" colspan="{{thData.colspan?thData.colspan:1}}" ng-style={"min-width":thData.width+"px","max-width":thData.width+"px"} ng-click="sortListByField(thData.key,$event,thData.sortFlag)" title="{{thData.title}}"><span class="th-cell" >'+
                                            
                                            '<span ng-if="!thData.thRender">{{thData.title}}</span>'+
                                            '<span ng-if="thData.thRender" bind-html-scope="parentScope" bind-html-compile="thData.thRender(tdData,$index)"></span>'+
                                            
                                            '<span ng-if="thData.sortFlag" class="trangleUp" ng-class="{trangleOn:sortField==thData.key&&sortDirection==\'ASC\'}"></span>'+
                                            '<span ng-if="thData.sortFlag" class="trangleDown" ng-class="{trangleOn:sortField==thData.key&&sortDirection==\'DESC\'}"></span>'+
                                        '</span></th>'+
                                        '<th ng-if="settingFlag" style="max-width:40px;min-width:40px;width:40px;padding: 8px 0px;" ng-click="" rowspan="{{showColumns.length!=repeatTdColumns.length?2:1}}">'+
                                            '<span><i class="lk-icon lk-icon-set-o text-blue" ng-click="showSettingMenu($event)"></i></span>'+
                                        '</th>'+
                                    '</tr>'+
                                    '<tr ng-if="showColumns.length!=repeatTdColumns.length">'+
                                        '<th ng-repeat="thData in repeatTdColumns track by $index" key="{{thData.key}}" ng-style={"min-width":thData.width+"px","max-width":thData.width+"px"} ng-if="thData.isChild" ng-click="sortListByField(thData.key,$event,thData.sortFlag)" title="{{thData.title}}">'+
                                        '{{thData.title}}'+
                                            '<span ng-if="thData.sortFlag" class="trangleUp" ng-class="{trangleOn:sortField==thData.key&&sortDirection==\'ASC\'}"></span>'+
                                            '<span ng-if="thData.sortFlag" class="trangleDown" ng-class="{trangleOn:sortField==thData.key&&sortDirection==\'DESC\'}"></span>'+
                                        '</th>'+
                                    '</tr>'+
                                '</thead>'+
                            '</table>'+
                        '</div>'+

                        '<!--左侧悬浮-->'+
                        
                        '<div class="tableDiv table-columns-left"  ng-style={"width":colHeaderLeftWidth+"px"} ng-class={"box-right-shadow":scrollLeftNum} ng-hide="hiddenFixedTable&&!hasCheckbox">'+
                            '<div class="tableDiv table-header-columns-left" ng-style={"width":colHeaderLeftWidth+"px"} ng-class={"box-right-shadow":scrollLeftNum} > '+
                                '<table class="table table-hover ">'+
                                    '<thead>'+
                                        '<tr ng-style={"height":thHeight-1}>'+
                                             '<th ng-if="hasCheckbox&&showColumns.length!=0" style="max-width:40px;min-width:40px;width:40px;" rowspan="{{showColumns.length!=repeatTdColumns.length?2:1}}"><span id="all" style="position:absolute;left:-4px;top:30px;"></span><input  type="checkbox" name="" ng-change="allCheck()" class="parentCheckBox" ng-model="$parent.parentCheck" ng-show="inputType==\'0\'"></th>'+

                                            '<th  key="{{thData.key}}" ng-style={"min-width":thData.width+"px","max-width":thData.width+"px"} ng-repeat="thData in showColumns track by $index" ng-if="thData.fixed==\'left\'" ng-click="sortListByField(thData.key,$event,thData.sortFlag)">'+
                                                '{{thData.title}}'+
                                                '<span ng-if="thData.sortFlag" class="trangleUp" ng-class="{trangleOn:sortField==thData.key&&sortDirection==\'ASC\'}"></span>'+
                                                '<span ng-if="thData.sortFlag" class="trangleDown" ng-class="{trangleOn:sortField==thData.key&&sortDirection==\'DESC\'}"></span>'+
                                            '</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                '</table>'+
                            '</div>'+
                            '<div class="tableDiv table-body-columns-left" ng-style={"height":setTableHeight?(setTableHeight-scrollBarHeight+"px"):"auto"} ng-if="data.length!=0">'+
                                '<table class="table table-hover " style="border-top:none">'+
                                    '<tbody>'+
                                    '<tr  ng-repeat="tdData in data track by $index" ng-mouseover="bindHover($index)" ng-class={"tr-hover":curHoverColNum==$index,"tr-click":curClickColNum==$index} ng-click="clickTrFunction($event,$index,tdData)">'+
                                        '<td ng-if="hasCheckbox&&showColumns.length!=0" style="max-width:40px;min-width:40px;width:40px;"><input ng-model="childCheck[$index]" type="checkbox" name="" class="child-checkbox" ng-change="singleCheck($index)" ng-disabled="pageCkFlag"></td>'+
                                        
                                        '<td ng-repeat="tdName in showColumns | filter:{fixed:\'left\'}" ng-style={"min-width":tdName.width+"px","max-width":tdName.width+"px"}>'+
                                            
                                            '<!--需要title-->'+
                                            '<span ng-if="!tdName.dirList&&!tdName.render&&tdName.tipFlag" title="{{tdData[tdName.key]}}">{{tdData[tdName.key]?tdData[tdName.key]:\'-\'}}</span>'+
                                            
                                            '<!--不需要title  -->'+
                                            '<span class="td-span" ng-if="!tdName.dirList&&tdName.render&&!tdName.tipFlag"  bind-html-scope="parentScope" bind-html-compile="tdName.render(tdData,$parent.$parent.$index,$index)">'+
                                            '</span>'+

                                            '<!--数据字典  -->'+
                                            '<span ng-if="tdName.dirList&&!tdName.tipFlag">'+
                                                '{{tdData[tdName.key] | dictionaryFilter : tdName.dirList : tdName.dirKeyValue}}'+
                                            '</span>'+

                                            '<span ng-if="!tdName.dirList&&!tdName.render&&!tdName.tipFlag">'+
                                                '{{tdData[tdName.key]?tdData[tdName.key]:\'-\'}}'+
                                            '</span>'+

                                        '</td>'+
                                    '</tr>'+
                                    '</tbody>'+
                                '</table>'+
                            '</div>'+
                        '</div>'+

                        '<!--右侧悬浮 ng-class={"box-left-shadow":isToRightNum!==0}-->'+
                        '<div class="tableDiv table-columns-right" ng-style={"width":colHeaderRightWidth+"px"}  ng-hide="hiddenFixedTable">'+
                            '<div class="tableDiv table-header-columns-right" ng-style={"width":colHeaderRightWidth+"px"} ng-class={"box-left-shadow":isToRightNum!==0} > '+
                                '<table class="table table-hover ">'+
                                    '<thead>'+
                                        '<tr>'+
                                            '<th  key="{{thData.key}}" ng-style={"min-width":thData.width+"px","max-width":thData.width+"px"} ng-repeat="thData in showColumns track by $index" ng-if="thData.fixed==\'right\'"><span class="th-cell" >{{thData.title}}</span></th>'+
                                            '<th ng-if="settingFlag" style="max-width:40px;min-width:40px;width:40px;padding: 8px 0px;" rowspan="{{showColumns.length!=repeatTdColumns.length?2:1}}" ng-style={"height":thHeight-1+"px"} >'+
                                                '<span><i class="lk-icon-set-o lk-icon text-blue" ng-click="showSettingMenu($event)"></i></span>'+
                                            '</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                '</table>'+
                            '</div>'+
                            '<div class="tableDiv table-body-columns-right" ng-style={"height":setTableHeight?(setTableHeight-(hiddenFixedTableLong?0:thHeight)-scrollBarHeight+"px"):"auto"} ng-if="data.length!=0">'+
                                '<table class="table table-hover " style="border-top:none" >'+
                                    '<tbody>'+
                                    '<tr ng-if="data.length!=0" ng-repeat="tdData in data track by $index" ng-mouseover="bindHover($index)" ng-class={"tr-hover":curHoverColNum==$index,"tr-click":curClickColNum==$index} ng-click="clickTrFunction($event,$index,tdData)">'+
                                        '<td ng-repeat="tdName in showColumns | filter:{fixed:\'right\'}" ng-style={"min-width":tdName.width+"px","max-width":tdName.width+"px"}>'+
                                           
                                        '<!--需要title-->'+
                                        '<span ng-if="!tdName.dirList&&!tdName.render&&tdName.tipFlag" title="{{tdData[tdName.key]}}">{{tdData[tdName.key]?tdData[tdName.key]:\'-\'}}</span>'+
                                        
                                        '<!--不需要title  -->'+
                                        '<span class="td-span" ng-if="!tdName.dirList&&tdName.render&&!tdName.tipFlag"  bind-html-scope="parentScope" bind-html-compile="tdName.render(tdData,$parent.$parent.$index,$index)">'+
                                        '</span>'+

                                        '<!--数据字典  -->'+
                                        '<span ng-if="tdName.dirList&&!tdName.tipFlag">'+
                                            '{{tdData[tdName.key] | dictionaryFilter : tdName.dirList : tdName.dirKeyValue}}'+
                                        '</span>'+

                                        '<span ng-if="!tdName.dirList&&!tdName.render&&!tdName.tipFlag">'+
                                            '{{tdData[tdName.key]?tdData[tdName.key]:\'-\'}}'+
                                        '</span>'+

                                        '</td>'+
                                        '<td ng-if="settingFlag" style="max-width:40px;min-width:40px;padding:0px;width:40px;">'+
                                            '<span></span>'+
                                        '</td>'+
                                    '</tr>'+
                                    '</tbody>'+
                                '</table>'+
                            '</div>'+
                        '</div>'+
                        '<!--主体内容-->'+
                        '<div class="tableDiv table-body"  ng-style={"height":setTableHeight?(setTableHeight+"px"):"auto"} >'+  
                            '<div class="table-con-true" ng-if="data.length!=0"></div>'+
                            '<div style="position:absoulte;" class="table-parent">'+
                            '<table class="table table-hover " ng-if="data.length!=0" >'+
                                '<tbody>'+
                                '<tr ng-if="data.length!=0" ng-repeat="tdData in data track by $index" ng-mouseover="bindHover($index)" ng-class={"tr-hover":curHoverColNum==$index,"tr-click":curClickColNum==$index} ng-click="clickTrFunction($event,$index,tdData)">'+
                                    
                                    '<td ng-if="hasCheckbox&&showColumns.length!=0" style="max-width:40px;min-width:40px;width:40px;"><input  type="checkbox" name="" ></td>'+
                                    '<td  ng-repeat="tdName in repeatTdColumns track by $index" ng-style={"min-width":tdName.width+"px","max-width":tdName.width+"px"}  ng-class={"is-form-td":tdName.isForm}>'+
                                        
                                        '<!--需要title-->'+
                                        '<span class="td-span" ng-if="!tdName.dirList&&!tdName.render&&tdName.tipFlag" title="{{tdData[tdName.key]}}">{{tdData[tdName.key]?tdData[tdName.key]:\'-\'}}</span>'+
                                        
                                        '<!--不需要title  -->'+
                                        '<span class="td-span" ng-if="!tdName.dirList&&tdName.render&&!tdName.tipFlag"  bind-html-scope="parentScope" bind-html-compile="tdName.render(tdData,$parent.$parent.$index,$index)">'+
                                        '</span>'+

                                        '<!--数据字典  -->'+
                                        '<span ng-if="tdName.dirList&&!tdName.tipFlag">'+
                                        // '{{tdName.dirList}}'+
                                            '{{tdData[tdName.key] | dictionaryFilter : tdName.dirList : tdName.dirKeyValue}}'+
                                        '</span>'+

                                        '<span class="td-span" ng-if="!tdName.dirList&&!tdName.render&&!tdName.tipFlag">'+
                                            '{{tdData[tdName.key]?tdData[tdName.key]:\'-\'}}'+
                                        '</span>'+

                                    '</td>'+

                                    '<td ng-if="settingFlag" style="max-width:40px;min-width:40px;width:40px;padding:0px">'+
                                        '<span ></span>'+
                                    '</td>'+
                                    // 以下 td 是用于 操作悬浮列 
                                    '<td style="min-width:0px;width:0px;max-width:0px;padding: 0px;" ng-if="operateMenuListFun">'+

                                        '<div class="operate-span" style="width:0px;" ng-class="{\'operate-span-open\':operateSpanOpen}" ng-style={"left":editeListLeft,"height":tdHeight} >'+
                                            
                                            
                                            '<span class="text-blue">'+
                                                // '<i class="lk-icon text-blue lk-icon-edit" style="cursor: pointer;" ></i>'+
                                                '<span ng-repeat="menu in data[$index].operateMenuList track by $index" ng-click="menuClick($event,menu.operateFun)" ng-if="$index==0">{{menu.menuName}}</span>'+
                                                '<i class="lk-icon text-blue lk-icon-arrowD" style="cursor: pointer;font-size: 12px;margin-left: 5px;" ng-if="data[$index].operateMenuList.length>1" ng-click="operateMenu($event,$index)"></i>'+
                                            '</span>'+
                                        '</div>'+
                                    '</td>'+

                                '</tr>'+
                                '</tbody>'+
                                '<tfoot ng-if="footerColumns">'+
                                    '<tr >'+
                                        '<td ng-click="closeTfoot()" class="first"></td>'+
                                        '<td colspan="3" class="second">'+
                                            '<ul>'+
                                                '<li class="li_active" ng-click="chooseTotal(0)" ng-class={"li_active":totalNumIndex==0}>总计</li>'+
                                                '<li ng-click="chooseTotal(1)" ng-class={"li_active":totalNumIndex==1}>平均</li>'+
                                                '<li ng-click="chooseTotal(2)" ng-class={"li_active":totalNumIndex==2}>最大</li>'+
                                                '<li ng-click="chooseTotal(3)" ng-class={"li_active":totalNumIndex==3}>最小</li>'+
                                            '</ul>'+
                                        '</td>'+
                                        '<td ng-repeat="tfData in curFtData track by $index">'+
                                            '{{tfData[footerColumns[$index]]}}'+
                                        '</td>'+
                                    '</tr>'+
                                '</tfoot>'+
                            '</table>'+
                            //table行选中样式
                            '<div class="tr-click-label" ng-style={"top":trClickOffset.top+"px"} ng-if="curClickColNum!=-1">'+
                                '<div class="tr-click-label-con">'+
                                    '<i class="lk-icon lk-icon-arrowL" style="color:#fff"></i>'+
                                '</div>'+
                            '</div>'+ 
                            '</div>'+
                            '<no-data img-width="150" ng-show="data.length==0" style="margin-top:60px;margin-bottom:20px"></no-data>'+
                        '</div>'+

                        // 设置列表头部的显影和顺序
                        '<div class="lk-dropdown animeted fade-in-big-height" style="position:absolute;right:0px;top:42px;width:190px;z-index:12;max-height:350px" ng-if="showSeting" id="settingDropMenuId">'+
                           
                            '<div class="lk-dropdown-con">'+
                                '<ul class="lk-dropdown-menu" style="max-height:300px">'+
                                    '<li class="lk-dropdown-item" ng-repeat="col in editeHeaderColumns track by $index">'+
                                        '<span class="checkbox-label-item">'+

                                            // ''+
                                            '<label  class="checkbox-lable"><input type="checkbox" class=""  ng-model="col.showHFg" >&nbsp;{{col.title}}</label>'+
                                        '</span>'+
                                    '</li>'+
                                '</ul>'+
                                '<div class="btn-dropdown btn-list">'+
                                    '<span class="btn btn-blue" ng-click="submitSettingShowColums()">确定</span>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+

                        // 每行的编辑功能
                       '<div class="lk-dropdown lk-select-dropdown animeted fade-in-big-height" style="position:absolute;z-index:11" ng-style={"top":operateTdOffset.top+"px","right":operateTdOffset.right} ng-if="operateMenuShow" ng-mouseover="mouseOverOperate()" ng-mouseleave="mouseLeaveOperate()">'+
                            '<div class="lk-dropdown-con">'+   
                                '<span class="dropdown-menu-triangle"></span>'+  
                                '<ul class="lk-dropdown-menu">'+
                                    '<li class="lk-dropdown-item" ng-repeat="menu in operateMenuList track by $index" ng-click="menuClick($event,menu.operateFun)" ng-if="$index>0">{{menu.menuName}}</li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'+
                        
                    '</div>'+
                    // '<crm-item-pagination response-total-size="totalpage" get-data-function="action" current-page-num="currentPageNum" current-page-size="2" is-simple="false"></crm-item-pagination>'+
                '</div>',
        replace: true,
        link: function(scope, element, attributes, controller) {

            scope.element = element;


            scope.parentScope = scope.$parent;

            scope.isFirst = true; //判断是不是 第一次进来
            
            scope.colHeaderRightWidth = 0;// 右侧悬浮头部宽度
            
            scope.colHeaderLeftWidth  = 0;// 左侧悬浮宽度
            
            scope.scrollLeftNum = 0;// body区域滚动left值
            
            scope.scrollTopNum = 0;// body区域滚动top值
            
            scope.isToRightNum = -1;// 滚动条到达右侧的数值
            
            scope.curHoverColNum = -1;// 鼠标滑过table

            scope.curClickColNum = -1;// 鼠标点击table

            scope.scrollBarWidth = getScrollbarWidth();//获取滚动条的宽度  为0  表示 没有滚动条

            scope.scrollBarHeight = getScrollbarWidth();//获取滚动条的高度  为0  表示 没有滚动条

            scope.hiddenFixedTable = false; //判断是否 出现悬浮的列

            scope.hiddenFixedTableLong = true; //判断是否 出现悬浮的列

            scope.thHeight = -1;//获取th的高度
            scope.tdHeight = -1;//获取td的高度

            scope.showColumns = [];//编辑表头的显示字段
            scope.showSeting = false;//是否显示 编辑表头
            scope.editeHeaderColumns = [];//编辑表头的操作的数据
            scope.editeHeaderColumnsOld = [];//用于保存编辑前的数据

            scope.repeatTdColumns = [];//用于去循环 td 数据的（最早的时候因为没有合并列和合并行的问题，所以直接使用额了传进来的Columns）

            scope.operateSpanOpen = false;//是否已经打开下拉


            // 操作列的 下拉 出现的 位置

            scope.operateTdOffset = {
                top:0,
                right:20
            }

            // 点击的行的背景icon 所处的位置

            scope.trClickOffset = {
                top:0,
                right:0
            }


            scope.operateMenuShow = false;
            scope.operateSpanOpen = false;
            scope.operateMenuList = [];


            // 操作列识别的字段名
            scope.tableControlName = "tableControl";


            scope.totalNumIndex = 0;
            scope.curFtData = scope.footerData?footerData[0]:[];


            scope.parentCheck = false;

            scope.childCheck = [];

            scope.hasScroll = false;//纵向是否出现滚动条

            scope.editeListLeft = 0;

            scope.pageCkFlagNum = (attributes.pageCkFlag?true:false);//是否需要跨页全选

            scope.pageCkFlag = false;//是否跨页全选了

            scope.inputType = scope.inputType?"1":"0";

            // scope.tableWidth = 0;


            // 监听data数据的变化
            scope.$watch('data',function(newValue,oldValue){
                // if(newValue!=oldValue){
                
                // $(element[0]).find(".parentCheckBox").prop("checked",false);

                if(!newValue)return ;

                $timeout(function(){
                    // getScrollWidth();
                    if(scope.isFirst){
                        bindScroll();
                        scope.isFirst = false;
                    }

                    scope.childCheck = [];

                    scope.thHeight = angular.element(element[0]).find('.table-header').height();
                    scope.tdHeight = angular.element(element[0]).find('.table-body td').height();

                    var totalBodyHeight = newValue.length*scope.tdHeight+scope.thHeight;
                    
                    
                    // 判断该table纵向是否会出现 滚动条

                    // if(angular.element(element[0]).find('.table-body').height()>totalBodyHeight){
                    //     scope.hiddenFixedTableLong = false;
                    // }


                    // 根据数据去初始化 checkbox的状态
                    if(scope.hasCheckbox){
                        for(var i = 0;i<scope.data.length;i++){
                            if(scope.data[i].selectFlag||scope.pageCkFlag){
                                scope.childCheck.push(true);
                                // scope.checkedList.push(scope.data[i]);
                            }else{
                                scope.childCheck.push(false);
                            }
                        }
                    }

                    
                    // 获取编辑列
                    var staticData = angular.copy(scope.data);
                    if(scope.operateMenuListFun){
                        for(var i = 0;i<scope.data.length;i++){
                            staticData[i].operateMenuList = scope.operateMenuListFun(i);
                        }
                        scope.data = staticData;
                    }

                    scope.hasScroll = scope.data.length*scope.tdHeight>scope.setTableHeight;

                },100)

            },true)

            // 监听到外部的表头发生改变的时候 
            scope.$watch('columns',function(newValue,oldValue){
                var swtTotalWidth = 0;
                if(newValue&&newValue.length>0){

                    // for(var i = 0;i<scope.columns.length;i++){
                    //     swtTotalWidth+=scope.columns[i].width
                    // }

                    // if(swtTotalWidth>angular.element(element[0]).find('.table-container').width()){
                    //     scope.hiddenFixedTable = false;
                    // }else{
                    //     scope.hiddenFixedTable = true;
                    // }

                    var columnsStatic = new Array(newValue.length);
                    for(var i = 0;i<newValue.length;i++){
                        columnsStatic[i] = newValue[i];
                        columnsStatic[i].showHFg = true;
                    }
                    angular.copy(columnsStatic,scope.editeHeaderColumns);
                    angular.copy(columnsStatic,scope.editeHeaderColumnsOld);
                    scope.showColumns = newValue;


                    
                    initColHeader();
                }
            },true)


            // 监听到设置表头 
            scope.$watch('showColumns',function(newValue,oldValue){

                var swtTotalWidth = 0;
                var repeatTdColumnsStatic = [];
                $timeout(function(){
                    scope.editeListLeft = angular.element(element[0]).find('.table-parent').width()-100;
                },200)

                if(newValue&&newValue.length>0){
                    for(var i = 0;i<scope.showColumns.length;i++){
                        swtTotalWidth+=scope.showColumns[i].width;

                        if(scope.showColumns[i].colspanList&&scope.showColumns[i].colspanList.length>0){
                            for(var j = 0;j<scope.showColumns[i].colspanList.length;j++){

                                scope.showColumns[i].colspanList[j].isChild = true;//判断是都是 合并行 出现的子的 表头项
                                if(scope.showColumns[i].fixed){
                                    repeatTdColumnsStatic.fixed = scope.showColumns[i].fixed;
                                }
                                repeatTdColumnsStatic.push(scope.showColumns[i].colspanList[j]);
                                
                            }
                        }else{

                            repeatTdColumnsStatic.push(scope.showColumns[i]);

                        }
                    }

                     // 初始化 td 显示字段显示对应的 变量
                     scope.repeatTdColumns = repeatTdColumnsStatic;

                    if(swtTotalWidth>angular.element(element[0]).find('.table-container').width()){
                        scope.hiddenFixedTable = false;
                    }else{
                        scope.hiddenFixedTable = true;
                    }

                    // scope.showColumns = newValue;
                }
            })

            // 

            scope.$watch('spaceheight',function(newValue,oldValue){
                if(newValue){
                    // 计算table的高度
                    // scope.tableHeight = document.body.clientHeight - scope.spaceheight;
                }
            })

            // 
            scope.$watch('childCheck',function(nv,ov){
                scope.checkedList = [];
                for(var i = 0;i<nv.length;i++){
                    if(nv[i]){
                        scope.checkedList.push(scope.data[i]);
                    }
                }
                if(scope.data){
                    if(scope.checkedList.length==scope.data.length){
                        scope.parentCheck = true;
                    }
                    if(scope.data.length === 0){
                        scope.parentCheck = false;
                    }
                }

                
            },true)


             scope.$watch('checkedList',function(nv,ov){
                // console.log(nv);
            },true)

            // scope.$watch('pageCkFlag',function(nv,ov){
                // if(nv==undefined) return;
                // scope.parentCheck = true;



            // })

            
            // 绑定滚动条滚动
            
            // 初始化固定纵向的头的宽度
            function initColHeader(){
                scope.colHeaderRightWidth = 0;
                scope.colHeaderLeftWidth = 0;
                scope.showColumns = scope.showColumns?scope.showColumns:[];
                for(var i = 0;i < scope.columns.length;i++){
                    if(scope.showColumns[i].fixed=="left"){
                        scope.colHeaderLeftWidth += scope.showColumns[i].width;
                    }else  if(scope.showColumns[i].fixed=="right"){
                        scope.colHeaderRightWidth += scope.showColumns[i].width;
                    }
                }

                // 判断如果存在右边悬浮的时候table的时候 需要追加一个 滚动条的宽度
                if(scope.colHeaderRightWidth!=0||scope.settingFlag){
                    scope.colHeaderRightWidth+=scope.scrollBarHeight;
                }
                

                if(scope.settingFlag){
                    scope.colHeaderRightWidth+=40;//判断是否 设置 的flag是打开的
                }

                if(scope.hasCheckbox){
                    scope.colHeaderLeftWidth+=40;
                }
            }

           
            angular.element(window).on('resize',function(){
                var swtTotalWidth = 0;

                if(scope.showColumns&&scope.showColumns.length>0){
                    for(var i = 0;i<scope.showColumns.length;i++){
                        swtTotalWidth+=scope.showColumns[i].width
                    }

                    if(swtTotalWidth>angular.element(element[0]).find('.table-container').width()){
                        scope.hiddenFixedTable = false;
                    }else{
                        scope.hiddenFixedTable = true;
                    }
                }

                scope.editeListLeft = angular.element(element[0]).find('.table-parent').width()+scope.scrollLeftNum-100
                // console.log(scope.editeListLeft);

                scope.$apply();

            })

            // scope.resize = function(){
            //     // scope.aa = scope.scrollBarWidth;
            //     // angular.element(scope.spaceDiv).siblings();
            //     var spaceList = scope.
            //     for(){

            //     }
            // }

            // 绑定滚动条滚动
            function bindScroll(){

                // 绑定中间主区域的滚动事件
                angular.element(element[0]).find('.table-body').on('scroll',function(){

                    // console.log("2131")

                    scope.scrollLeftNum = angular.element(element[0]).find('.table-body').scrollLeft();

                    scope.editeListLeft = angular.element(element[0]).find('.table-parent').width()+scope.scrollLeftNum-100;
                    // console.log(scope.editeListLeft)
                    scope.isToRightNum = angular.element(element[0]).find('.table-body .table').width()-angular.element(element[0]).find('.table-body').width()-scope.scrollLeftNum+scope.scrollBarWidth;
                    scope.scrollTopNum = angular.element(element[0]).find('.table-body').scrollTop();

                    // console.log("scrollLeftNum:",scope.scrollLeftNum)

                    angular.element(element[0]).find('.table-header').scrollLeft(scope.scrollLeftNum)
                    angular.element(element[0]).find('.table-body-columns-left').scrollTop(scope.scrollTopNum)
                    angular.element(element[0]).find('.table-body-columns-right').scrollTop(scope.scrollTopNum)

                    scope.$apply()
                })


                // 绑定右侧悬浮区域的滚动效果
                angular.element(element[0]).find('.tableDiv .table-body-columns-right').on('scroll',function(){

                    scope.scrollTopNum = angular.element(element[0]).find('.table-body-columns-right').scrollTop();

                    // console.log(scope.scrollTopNum);
                    // scope.isMyScroll = false;

                    angular.element(element[0]).find('.table-body-columns-left').scrollTop(scope.scrollTopNum)
                    angular.element(element[0]).find('.table-body').scrollTop(scope.scrollTopNum)

                    scope.$apply()
                })
            }

            // 显示滑动tr的效果
            scope.bindHover = function(index){
                if(scope.curHoverColNum===index) return;
                // console.log("--:",index);
                scope.curHoverColNum=index;
                scope.operateMenuShow = false;
                scope.operateSpanOpen = false;
            }


            // 绑定是否鼠标离开了 table的数据 div
            scope.outTableBody = function(){
                // console.log("outTableBody");
               
                hideOperateMenu();
            }

            // 获取滚动条的宽度和高度
            // function getScrollWidth(){

            //     scope.scrollBarWidth = $(element[0]).find('.table-body').width() - $(element[0]).find('.table-con-true').width();
            //     scope.scrollBarHeight = $(element[0]).find('.table-body').height() - $(element[0]).find('.table-con-true').height();
            // }


            // 收起操作下拉
            function hideOperateMenu(){
                scope.curHoverColNum=-1;
                scope.operateMenuShow = false;
                scope.operateSpanOpen = false;

            }

            function mouseOverOperate(){
                // console.log("mouseOverOperate")
                // $timeout.cancel(timer);
            }

            function mouseLeaveOperate(){
                // 延时 判定是否 鼠标移到下拉 menu上了
                // if(timer!=undefined){
                //     $timeOut.cancel(timer);
                // }
                // timer = $timeout(function(){
                // console.log("mouseLeaveOperate")

                //     hideOperateMenu();
                // },100)
            }

            /**
            * 按照字段排序
            * **/
            scope.sortListByField = function (param,e,isOrder) {
                if(!isOrder) return;
                if(!myCommon.isEmpty(param)){
                  scope.sortField = param;
                }

                var clickTarget ;
                if(angular.element(e.target).parents('th').length>0){
                    clickTarget = angular.element(e.target).parents('th').find('.trangleUp');
                }else{
                    clickTarget = angular.element(e.target).find('.trangleUp');
                }

                if(clickTarget.hasClass('trangleOn')){
                    scope.sortDirection = 'DESC';
                }else {
                    scope.sortDirection = 'ASC';
                }
                
                scope.pagerCurrentNum = 1;
                scope.pagerGoNum = scope.pagerCurrentNum;//去到某一页输入框页码 （供输入框展示、修改用）

                $timeout(function(){
                   scope.fetchDataFunction(); 
               },100)
                
            };


            // function 有多个参数 将其格式成angular 识别的样子
            scope.formatParam = function(thisData,paramList,index){
                var returnParam =[]
                for(var i = 0;i<paramList.length;i++){

                    // 判断当前传过来的这个是 单值还是 array
                    if(typeof(paramList[i].paramKey)=="object"&&scope.isEmpty(paramList[i].isNormal)){
                        returnParam.push([]);
                        for(var j=0;j<paramList[i].paramKey.length;j++ ){
                            
                            var staticParam = {};
                            if(scope.isEmpty(paramList[i].isNormal)){
                                // staticParam[paramList[i].paramKey[j].paramKey] = thisData[paramList[i].paramKey[j].paramKey];
                                // returnParam[i].push({});
                                staticParam[paramList[i].paramKey[j].paramKey] = thisData[paramList[i].paramKey[j].paramKey];
                            }else{
                                // returnParam[i].push(paramList[i].paramKey);
                                
                            }

                            returnParam[i].push(staticParam);
                        }


                    }else{
                        if(paramList[i].paramKey=="$index"){
                            returnParam.push(index);
                        }else{
                            if(scope.isEmpty(paramList[i].isNormal)){
                                returnParam.push(thisData[paramList[i].paramKey]);
                            }else{
                                returnParam.push(paramList[i].paramKey);
                            }
                        }
                    }
                }
                return returnParam;
            }

            scope.formatCondition = function(thisData,conditionParam,index){

                var conditionParamText = conditionParam;


                if(scope.isEmpty(conditionParamText)){
                    return true;
                }
                
                for(key in thisData){
                    if(conditionParamText.indexOf(key)>-1){
                        var reg = new RegExp(key , "g")
                        conditionParamText = conditionParamText.replace(reg,thisData[key])
                    }
                }

                // console.log(conditionParamText);
                return eval(conditionParamText);
            }


            scope.isEmpty = function(value){
                return myCommon.isEmpty(value)
            }


            //  计算总计和平均最大最小
            function chooseTotal(number){
                scope.totalNumIndex = number;
                scope.curFtData = scope.footerData[number];
            }


            // 监听全选
            scope.allCheck=function(){


                if(scope.parentCheck){
                    for(var i=0;i<scope.childCheck.length;i++){
                        scope.childCheck[i] = true;
                    }    

                    if(scope.pageCkFlagNum){
                         var _html = '<div>'+
                                    '<span style="font-size:12px;color:#333333">已选中本页</span>'+
                                    '<span style="font-size:12px;color:#F15A22;padding:0px 5px"> {{data.length}}条 </span>'+
                                    '<span style="font-size:12px;color:#333333">记录，</span>'+
                                    '<span style="font-size:12px;color:#F15A22;cursor: pointer;padding:0px 5px" ng-click="pageCkClick()">点此全选</span>'+
                                    '<span style="font-size:12px;color:#333333">所有</span>'+
                                    '<span style="font-size:12px;color:#F15A22;padding:0px 5px"> {{responseTotalSize}}条 </span>'+
                                    '<span style="font-size:12px;color:#333333"> 记录</span>'+
                                '</div>';
                        scope.pageCkboxDialog = dialog({
                            skin: 'page-ck-dialog',
                            content: $compile(_html)(scope),
                            quickClose: true// 点击空白处快速关闭
                        }).show(angular.element(scope.element[0]).find('#all')[0]);
                    }

                   
                }else{
                    if(scope.pageCkFlagNum){
                        scope.pageCkFlag = false;
                    }
                    
                    for(var i=0;i<scope.childCheck.length;i++){
                        scope.childCheck[i] = false;
                    }
                }
            };

            /**
             * 单个按钮
             * */
            scope.singleCheck=function(index){

                if(scope.inputType=="1"){
                    for(var i=0;i<scope.childCheck.length;i++){
                        if(scope.childCheck[i]&&i!=index){
                            scope.childCheck[i] = false;
                        }
                    }

                }else{

                    var checkNum = 0;
                    var checkInputNum = scope.data.length;
                    for(var i=0;i<checkInputNum;i++){
                        if(scope.childCheck[i]){
                            checkNum++;
                        }
                    }
                    if(checkNum === checkInputNum){
                        scope.parentCheck = true;
                    }else{
                        scope.parentCheck = false;
                    }
                }

            };

            // 点击显示编辑表头的下拉
            scope.showSettingMenu = function(event){
                // console.log("showSettingMenu");
                if(!scope.showSeting){
                    scope.showSeting = true;
                    // scope.editeHeaderColumns = scope.editeHeaderColumnsOld;
                    angular.copy(scope.editeHeaderColumnsOld,scope.editeHeaderColumns);

                    // console.log(scope.editeHeaderColumns);
                }else{
                    event.stopPropagation();
                    scope.showSeting = false;
                    angular.element(document).unbind('click');
                    

                }

                $timeout(function(){
                    angular.element(document).unbind('click').click(function(e) {  

                        // console.log("click");

                        var thisTarget = angular.element(e.target)
                        if(thisTarget.parents('#settingDropMenuId').length>0){
                            return;
                        }
                        // console.log("click");
                        scope.showSeting = false;
                        scope.$apply();
                        angular.element(document).unbind('click');
                    });
                },10) 
            }

            // 编辑表头显示字段

            scope.submitSettingShowColums = function(){

                var showColumnsStatic = [];
                for(var i = 0;i<scope.editeHeaderColumns.length;i++){
                    if(scope.editeHeaderColumns[i].showHFg){
                        showColumnsStatic.push(scope.editeHeaderColumns[i]);
                    }
                }

                if(showColumnsStatic.length==0){
                    ngToast.danger('最少需要有一个头部')
                    return;
                }

                angular.copy(scope.editeHeaderColumns,scope.editeHeaderColumnsOld);

                scope.showColumns = showColumnsStatic;

                scope.showSeting = false;
                angular.element(document).unbind('click');

            }

            // 点击当行显示 操作下拉
            scope.operateMenu = function(event,index){

                event.stopPropagation()


                scope.operateMenuShow = true;
                scope.operateSpanOpen = true;

                var eStatic = event ;

                var bodyScrollTop = angular.element(eStatic.target).parents('.table-body').scrollTop(); 

                scope.operateTdOffset.top = scope.thHeight*scope.curHoverColNum-angular.element(element[0]).find('.table-body').scrollTop()+scope.thHeight+scope.tdHeight/2+5;

            
                scope.operateMenuList = scope.operateMenuListFun(index);


            }

            // 操作按钮的点击
            scope.menuClick = function(e,fun){
                // console.log(fun)

                e.stopPropagation()
                fun(scope.data[scope.curHoverColNum]);

                // scope.curHoverColNum=-1;
                // scope.operateMenuShow = false;
                // scope.operateSpanOpen = false;

            }
            function getScrollbarWidth() {
                var oP = document.createElement('p'), styles = {
                    width: '100px',
                    height: '100px',
                    overflowY: 'scroll',
                }, i, scrollbarWidth;

                for (i in styles){
                    oP.style[i] = styles[i];
                }
                document.body.appendChild(oP);
                scrollbarWidth = oP.offsetWidth - oP.clientWidth;


                

                if(isIE()||isIE11()){
                    oP.removeNode(true);
            　　}else{
             　　　 oP.remove();
                }


                return scrollbarWidth;
            }

            scope.clickTrFunction = function(event,index,data){
                
                if(scope.trClickFunction){

                    var bodyScrollTop = angular.element(event.target).parents('.table-body').scrollTop(); 

                    // if(angular.element(event.target).hasClass("operate-span")){
                        scope.trClickOffset.top = angular.element(event.target).parents('tr').position().top+scope.tdHeight/2-9;
                    // }else{
                        // scope.operateTdOffset.top = angular.element(event.target).parents('.operate-span').position().top+scope.thHeight+scope.tdHeight/2+10;
                    // }
                    scope.curClickColNum = index;
                    scope.trClickFunction(data);
                }
            }


            // 点击跨页全选
            scope.pageCkClick = function(){
                scope.pageCkFlag = true;
            }

            function isIE(){
            　　if(!!window.ActiveXObject || "ActiveXObject" in window){
            　　　　return true;
            　　}else{
            　　　　return false;
            　　}
            } 

            function isIE11(){
            　　if((/Trident\/7\./).test(navigator.userAgent)){
            　　　　return true;
            　　}else{
            　　　　return false;
            　　}
            }

        }
    }
}]).directive('bindHtmlCompile', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(function () {
        return scope.$eval(attrs.bindHtmlCompile);
      }, function (value) {
        // Incase value is a TrustedValueHolderType, sometimes it
        // needs to be explicitly called into a string in order to
        // get the HTML string.
        element.html(value && value.toString());
        // If scope is provided use it, otherwise use parent scope
        var compileScope = scope;
        if (attrs.bindHtmlScope) {
          compileScope = scope.$eval(attrs.bindHtmlScope);
        }
        $compile(element.contents())(compileScope);
      });
    }
  };
}]);



