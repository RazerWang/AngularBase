/**
 * @author by tiht (tiht@Linkstec.com)
 * @data 2018/3/2
 *@function 复杂选择
 */

crmApp.directive("complexSelect", [function() {
    return {
        scope: {
            filterKey: "=", //用来判断数据唯一性的字段
            flagInput: "=", //单选还是复选 //0单选  1多选
            listTreeNodes: "=", //菜单树
            toSelectList: "=", //待选择列表
            getDisplayListFun: "=", //待选择数据的回调
            postSelectedListFun: "=" //提交已选择的数据
        },
        restrict: 'EA',
        template: '<div class="member-selection" ">' +
            '<div class="member-selection-comment">' +
            '<div class="selection-menu" ng-if="listTreeNodes.length>0">' +
            '<span class="menu-list" ng-class="{\'menu-list-active\':firstMenuClass==item.key}" ng-repeat="item in listTreeNodes" ng-click="clickFirstMenu(item,1)">{{item.value}}</span>' +
            '</div>' +
            '<div class="selection-two-menu" ng-show="twoMenu.length>0">' +
            ' <div class="two-menu-lis" ng-repeat="item in twoMenu" ng-class="{\'two-menu-lis-active\':twoMenuClass==item.key}" ng-click="clickFirstMenu(item,2)">' +
            '<span>{{item.value}}</span>' +
            '<i></i>' +
            '</div>' +
            '</div>' +
            '<div class="selection-comment" ng-class="{\'selection-comment1\':twoMenu.length>0}">' +
            '<div class="alphabet">' +
            '<div>' +
            '<span class="letter" ng-class="{\'letter-active\':item.hasData}" ng-repeat="item in letterList track by $index" ng-click="clickLetter(item,$index)">{{item.key}}</span>' +
            '</div>' +
            '</div>' +
            '<div class="nav">' +
            '<span>{{alphabetClass}}</span>' +
            '</div>' +
            '<div class="nav-conment alphabetScroll" >' +
            '<div class="nav-lis" ng-repeat="item in toSelectList" letter-label="alphabet{{item.shouZM}}">' +

            '<span class="checkbox-label-item " >' +
            '<label  class="checkbox-lable">' +
            '<input ng-if="flagInput==0" type="radio" class="childCheckBox" value={{item.key}}  ng-model="radioValue"  name="childCheckBox"  ng-click="clickPerson(item,$index)">' +
            '<input  ng-if="flagInput==1" type="checkbox" class="childCheckBox" ng-model="item.checked" name="childCheckBox" ng-change="clickPerson(item,$index)">' +
            '&nbsp;{{item[value]}}' +
            '</label>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="selection-checked" ng-show="showBars==true">' +
            '<div class="checked-title">' +
            '<span >已选项</span>' +
            '<span>({{checkedPerson.length}})</span>' +
            '<span class="text-blue fr" ng-click="clearPerson()">清空</span>' +
            '</div>' +
            '<div class="checked-lis">' +
            '<no-data img-width="130" tip-text="nodataTxt" ng-show="showBars==true&&checkedPerson.length==0" style="margin-top:10px;margin-bottom:20px"></no-data>'+

            // '<span ng-show="showBars==true&&checkedPerson.length==0">暂无选中信息</span>' +
            '<div class="nav-lis" ng-repeat="item in checkedPerson  | filter :{ checked :\'true\'}">' +
            '<span class="checkbox-label-item">' +
            '<label  class="checkbox-lable">' +
            '<input  ng-if="flagInput==0" type="radio" class="childCheckBox1"   name="childCheckBox1" checked  ng-click="clickPerson1()">' +
            '<input  ng-if="flagInput==1"  ng-change="select(item,$index)" type="checkbox" class="childCheckBox1" ng-model="item.checked" name="childCheckBox1" >' +
            '&nbsp;{{item[value]}}' +
            '</label>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="member-selection-success">' +
            '<span class="btn btn-blue" ng-click="clickSuccess()">确定</span>' +
            '</div>' +
            '</div>',
        replace: true,
        link: function(scope, element, attributes, controller) {


            scope.flagInput = (scope.flagInput===1||scope.flagInput===0)?scope.flagInput:1;

            var filterKey = scope.filterKey.split(',');
            var key = filterKey[0]; //name
            var value = filterKey[1]; //id
            scope.key = filterKey[0];
            scope.value = filterKey[1];

            scope.nodataTxt = "暂时没有选择"

             //字母表
            scope.letterList = [{key:"A",hasData:false},{key:"B",hasData:false},{key:"C",hasData:false},{key:"D",hasData:false},
                               {key:"E",hasData:false},{key:"F",hasData:false},{key:"G",hasData:false},{key:"H",hasData:false},
                               {key:"I",hasData:false},{key:"J",hasData:false},{key:"K",hasData:false},{key:"L",hasData:false},
                               {key:"M",hasData:false},{key:"N",hasData:false},{key:"O",hasData:false},{key:"P",hasData:false},
                               {key:"Q",hasData:false},{key:"R",hasData:false},{key:"S",hasData:false},{key:"T",hasData:false},
                               {key:"U",hasData:false},{key:"V",hasData:false},{key:"W",hasData:false},{key:"X",hasData:false},
                               {key:"Y",hasData:false},{key:"Z",hasData:false}]

            angular.element(".alphabetScroll").scrollTop(0)
            scope.firstMenuClass = (scope.listTreeNodes&&scope.listTreeNodes.length>0)?scope.listTreeNodes[0].key:"";
            scope.twoMenuClass = 0;
            scope.showBars = false;
            //scope.selectedBars=0;
            scope.alphabetClass = 'A';
            scope.twoMenu = [];
            


            scope.checkedPerson = []; //已选择分组
            scope.commonIds = []
           

            //点击菜单
            scope.clickFirstMenu = function(item, data) {

                scope.alphabetClass = 'A';
                //scope.selectedBars=0;

                angular.element(element[0]).find(".alphabetScroll").scrollTop(0)
                switch (data) {
                    case 1:
                        if(scope.firstMenuClass==item.key) return;
                        
                        var itemStatic ;
                        scope.firstMenuClass = item.key;
                        if (item.children.length == 0) { //没有二级菜单
                            //alert('当前选择的菜单为'+item.name)
                            scope.twoMenu = [];
                            itemStatic = item;
                        } else {
                            scope.twoMenu = item.children;
                            scope.twoMenuClass = item.children[0].key

                            itemStatic = item.children[0];
                        }

                        scope.getDisplayListFun(itemStatic);

                        break;
                    case 2:
                        if (scope.twoMenuClass != item.key) {
                            scope.getDisplayListFun(item);
                        }
                        scope.twoMenuClass = item.key;
                        //alert('当前选择的菜单为'+item.name)
                        break;
                }
            }

            //============点击字母筛选
            scope.clickLetter = function(data,index) {
                var str = 'alphabet' + data.key;

                if(scope.letterList[index].hasData){
                    var scrollTop = angular.element(element[0]).find(".alphabetScroll").scrollTop();
                    var letterTop = angular.element(angular.element(element[0]).find("[letter-label=" + str + "]")[0]).position().top;
                    angular.element(element[0]).find('.alphabetScroll').animate({ "scrollTop":letterTop+scrollTop})
                }
                // console.log(letterTop+scrollTop);

            }
            //监听滚动条进行字母筛选
            angular.element(element[0]).find(".alphabetScroll").on('scroll', function() { //为页面添加页面滚动监听事件
                var wst = angular.element(element[0]).find(".alphabetScroll").scrollTop(); //滚动条距离顶端值
                // console.log("wst:"+wst)
                var num = Math.ceil((wst) / angular.element(angular.element('.nav-lis')[0]).outerHeight(true)); //26位每个元素高度

                // console.log(num)
                var alphabetClass = "A";
                if (num >= 0 && num <= scope.toSelectList.length) {
                    var obj = (scope.toSelectList[num])
                    alphabetClass = obj.shouZM;
                }

                scope.alphabetClass = alphabetClass;
                scope.$apply()
            });

            //===============点击确定事件
            scope.clickSuccess = function() {
                var arr = [];
                for (var j = 0; j < scope.toSelectList.length; j++) {
                    if (scope.toSelectList[j].checked == true) {
                        arr.push(scope.toSelectList[j])
                    }
                }
                scope.postSelectedListFun(arr)
            }

            //===================选择成员
            scope.clickPerson = function(item, $index) {
                scope.showBars = true;
                if (scope.flagInput == 0) { //单选
                    scope.clearPerson();
                    scope.commonIds = [item[value]]
                    scope.toSelectList[$index].checked = true;
                    scope.checkedPerson = [item];
                    scope.radioValue = item[value]
                    $(element[0]).find(".childCheckBox").eq($index).prop("checked", true);
                } else {
                    var obj = new Object();
                    obj.key = item[key]; //名字
                    obj.value = item[value]; //id
                    obj.checked = item.checked;
                    //console.log(obj.value,scope.commonIds)
                    if (item.checked == true) {
                        if ($.inArray(obj.value, scope.commonIds) == -1) {
                            scope.commonIds.push(obj.value)
                            scope.checkedPerson.push(item)
                        }
                    } else {
                        var isChecked = false;
                        var index;
                        for (var i = 0; i < scope.checkedPerson.length; i++) {
                            if (scope.checkedPerson[i][value] == obj.value) {
                                isChecked = true;
                                index = i;
                            }
                        }
                        if (isChecked == true) {
                            var j = scope.commonIds.indexOf(obj.value);
                            scope.commonIds.splice(j, 1)
                            scope.checkedPerson.splice(index, 1)
                        }

                    }
                }
            }
            //单选按钮的点击事件
            scope.clickPerson1 = function() {
                scope.clearPerson()
                $(element[0]).find(".childCheckBox").prop("checked", false);
            }
            //已选分组为复选按钮时处理
            scope.select = function(obj, index) {
                var j = scope.commonIds.indexOf(obj.value);
                scope.commonIds.splice(j, 1);
                scope.checkedPerson.splice(index, 1);
                var inchecked = false;
                var _index;
                for (var i = 0; i < scope.toSelectList.length; i++) {
                    if (obj.value == scope.toSelectList[i][value]) {
                        inchecked = true;
                        _index = i;
                        break
                    }
                }
                if (inchecked == true) {
                    scope.toSelectList.splice(_index, 1)
                }
            }
            //===========================点击==选择分组=================
            scope.clearPerson = function() {
                scope.checkedPerson = []
                scope.commonIds = []
                if (scope.flagInput == 0) {
                    $(element[0]).find(".childCheckBox").prop("checked", false);
                }
                for (var j = 0; j < scope.toSelectList.length; j++) {
                    scope.toSelectList[j].checked = false;
                }
            }
            //================监听数据源变化=================================
            scope.$watch('toSelectList', function() {
                //console.log(scope.commonIds)

                for(var j = 0;j<scope.letterList.length;j++){
                    scope.letterList[j].hasData = false;
                }

                scope.toSelectList = getArrSZM(scope.toSelectList)
                for (var i = 0; i < scope.toSelectList.length; i++) {
                    var j = scope.commonIds.indexOf(scope.toSelectList[i][value]);
                    if (j != -1) {
                        scope.radioValue = scope.toSelectList[i][value];
                        // console.log(scope.radioValue)
                        //$(element[0]).find(".childCheckBox").eq(i).attr('checked')
                        //$(element[0]).find(".childCheckBox").eq(i).prop("checked",true);
                        scope.toSelectList[i].checked = true;
                    }
                }
            })
            //=========================添加首字母==========================
            function getArrSZM(arr) {
                for (var i = 0; i < arr.length; i++) {
                    var res;
                    res = myCommon.coverToPinYin(arr[i][value])
                    if (res == undefined) {
                        arr[i].shouZM = ''
                    } else {
                        arr[i].shouZM = res;
                    }

                    for(var j = 0;j<scope.letterList.length;j++){
                        // scope.letterList[j].hasData = false;
                        if(res==scope.letterList[j].key){
                            scope.letterList[j].hasData = true;
                            // console.log(scope.letterList[j]);
                        }
                    }

                }
                arr = sortLis(arr)
                return arr;
            }
            //字母排序
            function sortLis(tmp) {
                tmp.sort(function(m, n) {
                    var s = m.shouZM;
                    var e = n.shouZM
                    if (s > e) {
                        return 1
                    } else if (s < e) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
                return tmp
            }
        }
    }

}])