crmApp
  .directive('linkageSelect', ['$parse','$timeout','$compile',function ($parse,$timeout,$compile) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope:{
        ngModel:"=",
        treeId:"@",
        treeData:"=",
        nodeConfig:"@",
      },
      priority: 10,
      link:function(scope, element, attrs,ngModel){



        /***********************变量区域***********************/

          scope.element = element;//存储当前dom对象
          scope.treeNewData  = [];//将层级节点转换成一维数组形式
        

        /*************************函数区域************************/



        /***********************初始化区域**********************/

          element.selectpicker('refresh');

          //判断是否是树下拉
          if(!attrs.treeData){

            scope.$watch(attrs.ngModel, function (newVal, oldVal) {
              scope.$evalAsync(function () {
                element.val(newVal);
                element.selectpicker('refresh');
              });
            });

            ngModel.$render = function () {
              scope.$evalAsync(function () {
                element.val(ngModel.$modelValue);
                    element.selectpicker('refresh');
              });
            }
          }else{
            var nodeConfig = scope.nodeConfig.split(',')
            scope.pId = nodeConfig[0];
            scope.Id = nodeConfig[1];
            scope.name = nodeConfig[2];
          }

          if(attrs.treeData){

              var _html = '<div class="tree-drop-menu"><linkage-tree z-nodes="treeData" node-setting="setting2" tree-id="'+scope.treeId+'" ng-click="clickTree($event)"></linkage-tree></div>';
              var treeNode = angular.element(scope.element[0]).next().find('div.dropdown-menu').html($compile(_html)(scope));


              scope.setting2 = {
                view: {
                    showIcon:false,
                },
                key:{
                  name:scope.name
                },
                edit: {
                    enable: true,
                },
                check: {
                  enable: true
                },
                data: {
                    simpleData: {
                        enable:true,
                        idKey: scope.Id,
                        pIdKey: scope.pId,
                        rootPId: ""
                    }
                },
                callback: {
                    onCheck:onCheck
                }
                
              }
              
            // },100)

            $timeout(function(){

              if(scope.ngModel&&scope.ngModel.length>0){
                // var treeObj=$.fn.zTree.getZTreeObj(scope.treeId);
                // var  nodes=treeObj.getNodes(true);
                // var data = treeObj.transformToArray(nodes);
                var data = angular.copy(scope.treeNewData);
                for(var c =0;c<scope.ngModel.length;c++){
                  for(var x = 0;x<data.length;x++){
                    // delete data[x].children;
                    if(data[x][scope.Id]==scope.ngModel[c]){
                      // scope.nodes[x].
                      data[x].checked =  true;
                      
                    }
                  }
                }
                scope.treeData = data;
              }

            },500)

            // 点击树 冒泡 阻止 dropdown menu的时间
            scope.clickTree = function(e){
              e.stopPropagation()
            }

            // 下拉选择
            function onCheck(){
              var treeObj=$.fn.zTree.getZTreeObj(scope.treeId);
              nodes=treeObj.getCheckedNodes(true);

              var checkedList  =  [];
              for(var i = 0;i<nodes.length;i++){
                if(nodes[i].check_Child_State==-1){
                  checkedList.push(nodes[i][scope.Id]);
                }
              }

              scope.ngModel = checkedList;
              // console.log(checkedList);
            }

            



            function formatGs(opDataParam){
              for(var i= 0;i<opDataParam.length;i++){
                if(opDataParam[i].children&&opDataParam[i].children.length!==0){

                  var childrenData = opDataParam[i].children;
                  delete opDataParam[i].children;
                  scope.treeNewData.push(opDataParam[i]);
                  formatGs(childrenData);
                }else{
                  scope.treeNewData.push(opDataParam[i]);
                }
              }
            }

            function initSelectedHtml(){
              var showText = [];
              for(var i = 0;i<scope.treeNewData.length;i++){
                for(var j = 0;j<scope.ngModel.length;j++){
                  if(scope.ngModel[j]==scope.treeNewData[i][scope.Id]){
                    showText.push(scope.treeNewData[i][scope.name])
                  }
                }
              }

              showText.length==0?"请选择":showText;
              angular.element(scope.element[0]).next().find('.filter-option').text(showText.join(','))
            }

          }

        /***********************监控区域**********************/

          if(attrs.treeData){

            scope.$watch('ngModel',function(nv,ov){

              if(!nv) return;

              initSelectedHtml();

            })

            scope.$watch('treeData',function(nv,ov){
              if(!nv) return;
              scope.treeNewData = [];

              formatGs(scope.treeData);
              // 处理

              if(ngModel){
                initSelectedHtml();
              }

            })
          }
        
          
      }
        
    };
  }]);
