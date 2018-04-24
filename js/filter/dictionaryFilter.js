crmApp
    .filter("dictionaryFilter",function(){
        return function(showValue,list,objKy){
            var num = 0;
            if(myCommon.isEmpty(list)||list.length==0){
                return;
            }
            var objKyArray = objKy.split(',');
            var key = objKyArray[0];
            var name = objKyArray[1];
            var returnName = ""

            if(myCommon.isEmpty(showValue)){
                return "-";
            }

            var inputList = showValue.split(',');

            for(var i = 0; i<inputList.length;i++){
                var thisVal = inputList[i]
                list.forEach(function(item){
                    if(item[key]==thisVal){
                        
                        if(num==0){
                            returnName += item[name];
                            num++;
                        }else{
                            returnName += (","+item[name]);
                            num++;
                        }
                        
                    }
                });
            }

            return returnName?returnName:"-";
        }
    })