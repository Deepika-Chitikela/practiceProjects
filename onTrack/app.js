//Step 1: create a  module logicController for logic
var logicController=function(){
    // we will be usiing the data from th ui and calculating weight gain or weight loss
    // step 11:for which we need two function constuctors weight gain and weight loss

    var weightLoss=function(id,month,change){
        this.id=id;
        this.month=month;
        this.change=change;
    };

    var weightGain=function(id,month,change){
        this.id=id;
        this.month=month;
        this.change=change;
    };

    //step 26.1: function constructor to calculate weight change
    var totalWeight= function(type){
        var sum=0;
        data.allChanges[type].forEach(function(current){
            sum += current.change;
        });
        data.totals[type] = sum;
    };
    //step 25.2: method to calculate final weight
    var finalWeight= function(){
        data.weight=data.originalWeight + data.totals.gain- data.totals.loss;
    };
    //step 12: instead of creating seperate arrays for weight gain and loss we created one object 
    // this object stores data seperately and also calculates the aggregate
    var data={
        allChanges:{
            gain:[],
            loss:[]
        },
        totals:{
            gain:0,
            loss:0
        },
        originalWeight:0,
        //step 27.1 add weight and average to ds
        weight:0,
        avg:{
            gainAvg:0,
            lossAvg:0
        }
    };

    return{
        //step 13: create a function to add new items  to its respective gain or loss arrays
        
        pushDataInArrays: function(type, month, change) {
            var newItem,ID;
            //step 15: if its the first element of array id=0 else id is the length of the array -1

            if(data.allChanges[type].length >0){
                ID=data.allChanges[type][data.allChanges[type].length -1].id+1;
            }
            else{
                ID=0;
            }

        //step 14:if type is gain then create a weightgain object else weightloss object    
        if( type==='gain'){
            newItem= new weightGain(ID,month,change);
        }
        else if(type==='loss'){
            newItem= new weightLoss(ID,month,change);
        }
        //step 16: push all data into the respective array and return the newItem for the insertHtml method to access it.

        data.allChanges[type].push(newItem);
        return newItem;
        },
        //step 25.1: set original weight in data
        setOriginalWeight:function(object){
            data.originalWeight=object.originalWeight;
        },
        //step 27: update change in weight
        changeInWeight:function(){
            totalWeight('gain');
            totalWeight('loss');
            //27.2: modify the value in data.weight, data. avg
            finalWeight();
            if(data.allChanges.gain.length>0)
           data.avg.gainAvg=Math.round(data.totals.gain/data.allChanges.gain.length);
           else if(data.allChanges.loss.length>0)
            data.avg.lossAvg=Math.round(data.totals.loss/data.allChanges.loss.length);
            else{
                data.avg.gainAvg=0;
                data.avg.lossAvg=0;
            }
        } ,//28: return the values as object
        getChangeInWeightData:function(){
            return{
                totalGain:data.totals.gain,
                totalLoss:data.totals.loss,
                weightChange:data.weight,
                avgWeightGain:data.avg.gainAvg,
                avgWeightLoss:data.avg.lossAvg,
                originalWeight:data.originalWeight
            };
        },
        test:function(){
            console.log(data);
        }

    };


}();


//Step 2:create a module UIController for UI display
var UIController=(function(){
    //step 7 create  object for dom elements original
    var inputFromDom={
        inputBtn:'.btn__submit',
        inputOriginalWeight:'.input__originalWeight',
        inputIncDec:'.inputIncDec',
        inputMonth:'.input__month',
        inputWeightChange:'.input__weightchange',
        weightGainContainer:'.weightGain__list__element',
        weightLossContainer:'.weightLoss__list__element',
        displayInputOriginalWeight:'.display__originalWeight',
        displayAverageWeightGain:'.list__element__gainAvg__value',
        displayAverageWeightLoss:'.list__element__lossAvg__value'
    }
    
  // step 5: create a function for getting input from dom input form bar
    return{
        getInput:function(){
            return{
            // returning object as properties 
            type: document.querySelector(inputFromDom.inputIncDec).value,
            originalWeight: parseFloat(document.querySelector(inputFromDom.inputOriginalWeight).value),
            month: document.querySelector(inputFromDom.inputMonth).value,
            change: parseFloat(document.querySelector(inputFromDom.inputWeightChange).value)//step 24 : convert the value to parse int
            };
        },
        //step8: exposing this private dom inputs to public
        getInputFromDom:function(){
            return inputFromDom;
        },

        //step 18: function to insert html into dom or UI

        insertHtml:function(obj ,type){
            var html,element;
            if(type==='gain'){
                element=inputFromDom.weightGainContainer;
                html='<div class="item"><div class="list__element__month">%month%</div><div class="right clearfix">    <div class="list__element__value">%value%</div>    <div class="item__delete">        <button class="item__delete--btn">x</button>    </div></div></div>';
            }else if(type==='loss'){
                element=inputFromDom.weightLossContainer;
                html='  <div class="item"> <div class="list__element__month">%month%</div><div class="right clearfix"><div class="list__element__value">%value%</div><div class="item__delete">    <button class="item__delete--btn">x</button></div></div></div>';
            }
            //step 19: replace the place holders in the html string with object data
            html=html.replace("%month%",obj.month);
            html=html.replace("%value%",obj.change);
            
            //step 20: insert the list item in html page or UI
            document.querySelector(element).insertAdjacentHTML('beforeend',html);
            
        },
        //extra: display actual weight
        actualWeight:function(object){
            var displayOriginalWeight;
            //extra: to display original weight in circle
          
            displayOriginalWeight='<div class="originalWeight__text">%originalWeight%</div>';
            
            displayOriginalWeight=displayOriginalWeight.replace("%originalWeight%",object.weightChange);
            document.querySelector(inputFromDom.displayInputOriginalWeight).insertAdjacentHTML('beforeend',displayOriginalWeight);
            document.querySelector(inputFromDom.displayInputOriginalWeight).style.display="block";
        },
        //step 22: create a function to clear the input fields after posting the list item to html
        clearFields:function(){
            var fields,arrFields;
            //step 22.1: select input fields and store it in fields element
            fields=document.querySelectorAll(inputFromDom.inputMonth + ', ' +inputFromDom.inputWeightChange);
            //step 22.2:as qsAll returns list we need to convert it into arrat¥y to apply the array methods
            arrFields= Array.prototype.slice.call(fields);
            //step 22.3: apply for each loop to clear all the input fields
            arrFields.forEach(function(current){
                current.value="";
            });
                
            arrFields[0].focus();
        },
        //step 28.1: update avg of both the lists and also the weight on top
        updateFinal:function(obj){
            document.querySelector(inputFromDom.displayAverageWeightGain).textContent=obj.avgWeightGain;
            document.querySelector(inputFromDom.displayAverageWeightLoss).textContent=obj.avgWeightLoss;
            document.querySelector(inputFromDom.displayInputOriginalWeight).textContent=obj.weightChange;
        }
        };
  
})();


//step 3: create a module controller for communicating between UIController and LogicController
var controller=(function(logicCtrlr,UICtrl){

   //step 9: invoke get dom inputs function
   var DomInputs=UICtrl.getInputFromDom();

    //step 10: group all event listeners into a single function
    var setUpEventListeners=function(){
         
        //step 4: we need to get data from the form when we click submit or press enter//moved to set up event listeners
         document.querySelector(DomInputs.inputBtn).addEventListener('click',ctrlAddItems);
         document.addEventListener('keypress', function(event){
        if(event.keyCode===13 || event.which===13)
         ctrlAddItems();
     });
    };
  // step 25: create a function to update the weight changes     
    var updateWeightChange= function(){
        // step 26: calculate weight change,
        logicCtrlr.changeInWeight();
        //step 27: update weight change
        var weightChange=logicCtrlr.getChangeInWeightData();
        //step 28: insert change into the web pade or UI
        console.log(weightChange);
        UICtrl.actualWeight(weightChange);
        UICtrl.updateFinal(weightChange);
      
    };
    
     var ctrlAddItems= function(){
         
        var input,newItem;
    //step 6: get the inputs from the UIController from getInput function
        input=UICtrl.getInput();
        console.log(input);

        if(input.month !=="" && !isNaN(input.change) && input.change!==0)
        {
        //display actual weight
        
        document.querySelector(DomInputs.inputOriginalWeight).style.display='none';

    //step 17: call the fuction pushdataintoarray and passing the input parameters
        newItem=logicCtrlr.pushDataInArrays(input.type, input.month, input.change);
      //step 25.1: set original weight element in data object
            logicCtrlr.setOriginalWeight(input);

    //step 21: call the function to insert the input into list items
      UICtrl.insertHtml(newItem, input.type);
    //step 23: call the function to clear input fields after insertion
        UICtrl.clearFields();
        //step 25.2: call the update weight function
        updateWeightChange();
        }
};
       
return{
    init:function(){
        console.log('Application has Started!');
        setUpEventListeners();
    }
};

})(logicController,UIController);

 
controller.init();


