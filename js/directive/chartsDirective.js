
//area图表
crmApp.directive("areaCharts",function(){
	return {
        scope: {
            item : "=",
            legend: "=",
            data : "=",
            linecolor : "="
        },
        restrict: 'EA',
        template: '<div style="width:100%"></div>',
        replace: true,
       	link: function($scope, $element, $attributes, controller) {
            var option = {
			    tooltip: {
			    	trigger: 'axis'
			    },
			    grid: {//左右下都空出一块
			        left: '2%',
			        right: '2%',
			        bottom: '20',
			        top: '20',
			        containLabel: true
			    },
			    toolbox: {
			    	show:false,//下载图标不显示
			        feature: {//自定义图标
			            saveAsImage: {}
			        }
			    },
			    xAxis: [
			    	{
				    	splitLine:{
				    		show:true,//显示纵向的分割线
				    		lineStyle : {
				    			color:"#eee"//x轴网格颜色
				    		}
				    	},
				    	axisLine : {
				    		show:false//不显示x轴线
				    	},
				    	axisTick:{
				    		show:false
				    	},
				        type: 'category',//类目
				        boundaryGap: false,//x轴从零开始，true为从的间隔开始
				        data: $scope.item
			    	}
			    ],
			    yAxis: [
			    	{
				    	splitLine:{
				    		show:true,//显示横向的分隔线
				    		lineStyle : {
				    			color:"#eee"//y轴网格颜色
				    		}
				    	},
				    	axisLine : {
				    		show:false//不显示y轴线
				    	},
				    	axisTick:{
				    		show:false
				    	},
				        type: 'value'//数值
			    	}
			    ],
			    series: function() {
                   	var serie = [];
                   	for (var i = 0; i < 1; i++) {
                       	var item = {
                           	name: $scope.legend[0],
                           	type: 'line',
                           	data: $scope.data[0],
                           	itemStyle: {
                           		normal : {
                           			color : $scope.linecolor[0]
                           		}
                           	},
                           	lineStyle: {
                           		normal : {
                           			color : $scope.linecolor[0]
                           		}
                           	},
                           	areaStyle:{
                           		normal:{
                           			color : $scope.linecolor[0],
                           			opacity : "0.15"
                           		}
                           	}
                       	};
                       	serie.push(item);
                   	}
                   	return serie;
                }()
			};
		    var myChart = echarts.init($element[0]);
            myChart.setOption(option);
            $scope.$watch("data",function(newVal,oldVal) {
				if(newVal != oldVal){
					option = {
					    tooltip: {
					    	trigger: 'axis'
					    },
					    grid: {//左右下都空出一块
					        left: '2%',
					        right: '2%',
					        bottom: '20',
					        top: '20',
					        containLabel: true
					    },
					    toolbox: {
					    	show:false,//下载图标不显示
					        feature: {//自定义图标
					            saveAsImage: {}
					        }
					    },
					    xAxis: [
					    	{
						    	splitLine:{
						    		show:true,//显示纵向的分割线
						    		lineStyle : {
						    			color:"#eee"//x轴网格颜色
						    		}
						    	},
						    	axisLine : {
						    		show:false//不显示x轴线
						    	},
						    	axisTick:{
						    		show:false
						    	},
						        type: 'category',//类目
						        boundaryGap: false,//x轴从零开始，true为从的间隔开始
						        data: $scope.item
					    	}
					    ],
					    yAxis: [
					    	{
						    	splitLine:{
						    		show:true,//显示横向的分隔线
						    		lineStyle : {
						    			color:"#eee"//y轴网格颜色
						    		}
						    	},
						    	axisLine : {
						    		show:false//不显示y轴线
						    	},
						    	axisTick:{
						    		show:false
						    	},
						        type: 'value'//数值
					    	}
					    ],
					    series: function() {
		                   	var serie = [];
		                   	for (var i = 0; i < 1; i++) {
		                       	var item = {
		                           	name: $scope.legend[0],
		                           	type: 'line',
		                           	data: $scope.data[0],
		                           	itemStyle: {
		                           		normal : {
		                           			color : $scope.linecolor[0]
		                           		}
		                           	},
		                           	lineStyle: {
		                           		normal : {
		                           			color : $scope.linecolor[0]
		                           		}
		                           	},
		                           	areaStyle:{
		                           		normal:{
		                           			color : $scope.linecolor[0],
		                           			opacity : "0.15"
		                           		}
		                           	}
		                       	};
		                       	serie.push(item);
		                   	}
		                   	return serie;
		                }()
					};
					myChart.setOption(option);
				}
			})
        }
   }
});

//line图表
crmApp.directive("lineCharts",function(){
	return {
        scope: {
            item : "=",
            legend: "=",
            data : "=",
            linecolor : "="
        },
        restrict: 'EA',
        template: '<div style="width:100%;height:300px;float:left;"></div>',
        replace: true,
       	link: function($scope, $element, $attributes, controller) {
            var option = {
			    tooltip: {
			        trigger: 'axis'
			    },
			    grid: {//左右下都空出一块
			        left: '2%',
			        right: '2%',
			        bottom: '20',
			        top: '20',
			        containLabel: true
			    },
			    toolbox: {
			    	show:false,//下载图标不显示
			        feature: {//自定义图标
			            saveAsImage: {}
			        }
			    },
			    legend: {
			        orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
			        x: 'left',               // 水平安放位置，默认为全图居中，可选为：
			        y: 'top',                  // 垂直安放位置，默认为全图顶端，可选为：
			    },
			    xAxis: [
			    	{
				    	splitLine:{
				    		show:true,//显示纵向的分割线
				    		lineStyle : {
				    			color:"#eee"//x轴网格颜色
				    		}
				    	},
				    	axisLine : {
				    		show:false//不显示x轴线
				    	},
				    	axisTick:{
				    		show:false
				    	},
				        type: 'category',//类目
				        boundaryGap: false,//x轴从零开始，true为从的间隔开始
				        data: $scope.item
			    	}
			    ],
			    yAxis: [
			    	{
				    	splitLine:{
				    		show:true,//显示横向的分隔线
				    		lineStyle : {
				    			color:"#eee"//y轴网格颜色
				    		}
				    	},
				    	axisLine : {
				    		show:false//不显示y轴线
				    	},
				    	axisTick:{
				    		show:false
				    	},
				        type: 'value'//数值
			    	}
			    ],
			    series: function() {
                   	var serie = [];
                   	for (var i = 0; i < $scope.legend.length; i++) {
                       	var item = {
                           	name: $scope.legend[i],
                           	type: 'line',
                           	data: $scope.data[i],
                           	itemStyle: {
                           		normal : {
                           			color : $scope.linecolor[i]
                           		}
                           	},
                           	lineStyle: {
                           		normal : {
                           			color : $scope.linecolor[i]
                           		}
                           	}
                       	};
                       	serie.push(item);
                   	}
                   	return serie;
                }()
			};
		    var myChart = echarts.init($element[0]);
            myChart.setOption(option);
            $scope.$watch("data",function(newVal,oldVal) {
            	if(newVal != oldVal){
            		myChart.clear();
            		option = {
					    tooltip: {
					        trigger: 'axis'
					    },
					    grid: {//左右下都空出一块
					        left: '2%',
					        right: '2%',
					        bottom: '50',
					        top: '20',
					        containLabel: true
					    },
					    toolbox: {
					    	show:false,//下载图标不显示
					        feature: {//自定义图标
					            saveAsImage: {}
					        }
					    },
					    legend: {
					    	data:$scope.legend,
					        orient: 'horizontal',      // 布局方式，默认为水平布局，可选为：
					        x: 'center',               // 水平安放位置，默认为全图居中，可选为：
					        y: 'bottom',                  // 垂直安放位置，默认为全图顶端，可选为：
					    },
					    xAxis: [
					    	{
						    	splitLine:{
						    		show:true,//显示纵向的分割线
						    		lineStyle : {
						    			color:"#eee"//x轴网格颜色
						    		}
						    	},
						    	axisLine : {
						    		show:false//不显示x轴线
						    	},
						    	axisTick:{
						    		show:false
						    	},
						        type: 'category',//类目
						        boundaryGap: false,//x轴从零开始，true为从的间隔开始
						        data: $scope.item
					    	}
					    ],
					    yAxis: [
					    	{
						    	splitLine:{
						    		show:true,//显示横向的分隔线
						    		lineStyle : {
						    			color:"#eee"//y轴网格颜色
						    		}
						    	},
						    	axisLine : {
						    		show:false//不显示y轴线
						    	},
						    	axisTick:{
						    		show:false
						    	},
						        type: 'value'//数值
					    	}
					    ],
					    series: function() {
		                   	var serie = [];
		                   	for (var i = 0; i < $scope.legend.length; i++) {
		                       	var item = {
		                           	name: $scope.legend[i],
		                           	type: 'line',
		                           	data: $scope.data[i],
		                           	itemStyle: {
		                           		normal : {
		                           			color : $scope.linecolor[i]
		                           		}
		                           	},
		                           	lineStyle: {
		                           		normal : {
		                           			color : $scope.linecolor[i]
		                           		}
		                           	}
		                       	};
		                       	serie.push(item);
		                   	}
		                   	return serie;
		                }()
					};
					myChart.setOption(option);
            	}
            });
        }
   }
});