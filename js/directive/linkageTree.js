/**
 * 
 * @authors joyXie (xiec@linkstec.com)
 * @date    2018-04-02 14:49:43
 * @function  树结构
 */

crmApp.directive("linkageTree",['$compile','$timeout',function($compile,$timeout){
    return{  
        // require:'?ngModel',  
        scope:{
        	"zNodes":"=",
        	"nodeSetting":"=",
        	"treeId":"@",
        	"showChecked":"=",
        	"searchTreeKey":"=",

        },
        restrict:'E',
        template: '<ul style="" class="linkage-tree" id="{{treeId}}"></ul>',
        link:function(scope,element,attrs,ngModel){  
             
            /***********************变量区域***********************/ 

            	scope.name = (scope.nodeSetting&&scope.nodeSetting.data&&scope.nodeSetting.data.name)?scope.nodeSetting.data.key.name:"name";

			/***********************函数区域***********************/


			// 初始化树结构
			scope.initTree = function(){
				// if ($("#diyBtn_"+treeNode.id).length>0) return;
				tt = $("#"+scope.treeId);
				scope.tree = $.fn.zTree.init(tt, scope.nodeSetting, scope.zNodes);

			}

			// 显示隐藏
	        function showAndHide(){
	            var zTreeObj=$.fn.zTree.getZTreeObj(scope.treeId);
	            //显示上次搜索后背隐藏的结点
	            zTreeObj.showNodes(scope.hiddenNodes?scope.hiddenNodes:[]);
	            
	            //查找不符合条件的叶子节点
	            function filterFunc(node){
	                if(scope.showChecked){
	                    if((node.isParent||node[scope.name].indexOf(scope.searchTreeKey?scope.searchTreeKey:"")!=-1)&&node.checked) return false;
	                }else{
	                    if(node.isParent||node[scope.name].indexOf(scope.searchTreeKey?scope.searchTreeKey:"")!=-1) return false;
	                }
	                
	                return true;        
	            };
	         
	            //获取不符合条件的叶子结点
	            scope.hiddenNodes=zTreeObj.getNodesByFilter(filterFunc);

	            zTreeObj.hideNodes(scope.hiddenNodes);
	        }

			/***********************初始化区域**********************/
				// scope.initTree();
			/***********************监控区域**********************/


			scope.$watch('zNodes',function(nv,ov){
				if(!myCommon.isEmpty(nv)){	
					// if(scope.tree){
					// 	scope.tree.refresh()
					// }else{
					if(scope.tree){
						scope.tree.destroy()
					}
					scope.initTree();
					// }
					
				}
			},true)

			scope.$watch('showChecked',function(nv,ov){
	            if(nv == undefined) return;

	            
	            showAndHide();
	        })

	        scope.$watch('searchTreeKey',function(nv,ov){

	            if(nv == undefined) return;
	            showAndHide();

	        })


  
        }  
    }  

}])