
//step1: module for budgetController
//step5: create function for storing income and expense
var budgetController= (function(){
    var Income= function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        
    };

    var Expenses=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    //step 13.1 : calculate percentage of each expense item
    Expenses.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            
            this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            console.log(data.totals.inc);
            this.percentage=-1;
        }
    };

    Expenses.prototype.getPercentage=function(){
        return this.percentage;
    };

    //step 10.1.1: calculate totals using function constructor
        var calculateTotals =function(type){
            var sum=0;
            data.allItems[type].forEach(function(current){
                sum += current.value;
            });
            data.totals[type] = sum;
        };

    var data={
       allItems:{
           exp:[],
           inc:[]
       },
        totals:{
            exp:0,
            inc:0
        },
        //step 10.1.3: add budget and percentage into the ds
        budget: 0,
        percentage: -1
        };

       

        return{
            addItems: function(type,des,val){
                var newItem, ID;
                if(data.allItems[type].length > 0 ){
                ID=data.allItems[type][data.allItems[type].length - 1].id + 1;
                }
            else{
                ID=0;
            }
                if(type==='exp'){
                    newItem=new Expenses(ID , des, val );
                }
                else if(type==='inc'){
                    newItem=new Income(ID, des, val );
                }
                data.allItems[type].push(newItem);
                return newItem;
            },

            deleteItem: function(type, id){
                var ids,index;
                ids=data.allItems[type].map(function(current){
                    return current.id;
                });
                index=ids.indexOf(id);

                if(index!==-1){
                    data.allItems[type].splice(index,1);
                }
            },
            //step 10.1.2: calculate budget 
            calculateBudget: function(){
                calculateTotals('inc');
                calculateTotals('exp');

                //step 10.1.4:calculate total budget
                data.budget = data.totals.inc - data.totals.exp;
                //step 10.1.5: calculate percentage
                if(data.totals.inc>0){
                data.percentage=Math.round(((data.totals.exp) / data.totals.inc) *100);//change
                }else{
                    data.percentage=-1;
                }
            },

            //step 13 : calculate percentage
            calculatePercentage:function(){
            // step 13.2: loop through the array of exp

            data.allItems.exp.forEach(function (cur){
                cur.calcPercentage(data.totals.inc);
            });
            },
            //step 13.3:  get percentage
            getPercentage: function(){
            var allPercentages=data.allItems.exp.map(function (current){
            return current.getPercentage();
            });
            return allPercentages;
            },
            getBudget: function(){
                return{
                    totalIncome: data.totals.inc ,
                    totalExpense: data.totals.exp,
                    budget: data.budget,
                    percentage: data.percentage
                };
            },

        
            testing: function(){
                console.log(data);
            }
           
        };
})();


//step 2: module forUIController
var UIController=( function(){
    //3.1.1: get input from UIController
     
    var inputObjectDOM={
            inputType:'.add__type',
            inputDescription:'.add__description',
            inputValue:'.add__value',
            inputBtn:'.add__btn',
            incomeContainer:'.income__list',
            expensesContainer:'.expenses__list',
            displayBudget:'.budget__value',
            displayIncome:'.budget__income--value',//step 10.3.1.1:add displaying labels to the inputdom obj
            displayExpenses:'.budget__expenses--value',
            displayExpensePercentage:'.budget__expenses--percentage',
            container:'.container',//step12.1: add root element of incom or exp row
            expensesPercLabel:'.item__percentage',
            monthOnBudgetPanel:'.budget__title--month'
    };
    //step 15: format the numbers on the display
    var formatNumber= function(num,type){
        var splitNum ,int, dec,type,sign;
        //+ for income - for expense
        //, after 3 digits
        //convert it into absolute number 
        num=Math.abs(num);// removes any signs attached to it
        num=num.toFixed(2);//rounds figure to 2 decimal places and appensa the decimal places returns string
        splitNum=num.split('.');//splits the integer and decimal part
        int=splitNum[0];
        dec=splitNum[1];
        if(int.length>3)
        {
            int=int.substr(0,int.length-3)+ '.' + int.substr(int.length-3,3);//substr(pos,no of pos)

        }
        if (num === 0 || num === '') {type = 'anything';}
        //CHANGE this to not use a sign    
        if (type === 'exp'){sign = '-';}
        else if (type === 'inc'){sign = '+';}
        else {sign = '';}
 
     console.log(type);
     
    return sign + ' ' + int + '.' + dec;
     
     };
        /*return (type==='exp' ? '-': '+' ) + ' ' + int +'.'+dec;
    };*/
// step 14.4 making it a private function so that its accessible in step 16
    var nodeListForEach=function(nodeList,callback){
        for(var i=0;i<nodeList.length;i++){
            callback(nodeList[i],i);
        }
    };
    

    return{
       
        getStrings:function(){
            return{
             type: document.querySelector(inputObjectDOM.inputType ).value,
             description: document.querySelector(inputObjectDOM.inputDescription).value,
             value :parseFloat(document.querySelector(inputObjectDOM.inputValue).value),
            };
        },

        //step 6: create add items list
        addItemsList: function(obj,type){
            var html,element;
            if(type==='inc'){
                element=inputObjectDOM.incomeContainer;
            html = '<div class="item clearfix" id="inc- %id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp'){
                element=inputObjectDOM.expensesContainer;
                html = '<div class="item clearfix" id="exp- %id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>\<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //step 7: replace place holders text with value
            html = html.replace('%id%', obj.id);
            html = html.replace('%description%', obj.description);
            html = html.replace('%value%', formatNumber(obj.value,type));
           
             //step 8: insert list into html dom
         document.querySelector(element).insertAdjacentHTML('beforeend',html);

        },// step: 12.5.1 : function for deleting item from ui but getting the id from the controller and calling this function then the getting its parent node and child node then deleting the child node
        deleteItemList:function(itemID){

            var el=document.getElementById(itemID);
            el.parentNode.removeChild(el);
        },
        clearFields:function(){
            var fields,arrFields;
            //step 9.1: select input fields and store it in fields element
            fields=document.querySelectorAll(inputObjectDOM.inputDescription + ', ' + inputObjectDOM.inputValue);
            //step 9.2:as qsAll returns list we need to convert it into arrat¥y to apply the array methods
            arrFields= Array.prototype.slice.call(fields);
           
            //step 9.3: apply for each loop to clear all the input fields
            arrFields.forEach(function(current){
                current.value="";
            });
                
            arrFields[0].focus();
        },
        //step 10.3.1: method to change the values in web page of budget income and expenses
        displayBudget:function(obj){
            /*var type;
            obj.budget > 0 ? type= 'inc' : type= 'dec';*/
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            
            document.querySelector(inputObjectDOM.displayBudget).textContent=formatNumber(obj.budget,type);
            document.querySelector(inputObjectDOM.displayIncome).textContent=formatNumber(obj.totalIncome,'inc');
            document.querySelector(inputObjectDOM.displayExpenses).textContent=formatNumber(obj.totalExpense,'exp');
            document.querySelector(inputObjectDOM.displayExpensePercentage).textContent=obj.percentage;
            if(obj.percentage>0){
            document.querySelector(inputObjectDOM.displayExpensePercentage).textContent=obj.percentage +'%';
            }else{
                document.querySelector(inputObjectDOM.displayExpensePercentage).textContent='---'; 
            }

           
        },
        //step 14: for displayPercentageforEachExpense
        displayPercentageforEachExpense:function(percentage){

            //get the percentages nodelist from data.allItems.exp 

            var fields=document.querySelectorAll(inputObjectDOM.expensesPercLabel);

            
            nodeListForEach(fields,function(current,index){
                if(percentage[index]>0){
                    current.textContent=percentage[index] + '%';
                }else{
                    current.textContent= '---';
                }
                
            });

        },
        //step 15: display monthe on the header of budget

        displayMonth:function(){
            var date,month,year,months;
            
            date= new Date();
            months=['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
            month=date.getMonth();
            year=date.getFullYear()

            document.querySelector(inputObjectDOM.monthOnBudgetPanel).textContent=months[month]+' '+year+' ';
        },

        //step 16: the border of input fields based on type
        toggleOutlineBasedOnType: function(){
            var fields =document.querySelectorAll(inputObjectDOM.inputType +
                                                 ',' + inputObjectDOM.inputDescription +
                                                 ','+ inputObjectDOM.inputValue );
            nodeListForEach(fields,function(cur){

                cur.classList.toggle('red-focus');
            });

        },
        

        getInputObjectDom:function(){
            return inputObjectDOM;
        }
        
    };
})();


//step 3: module global controller that interacts with budgetController and UIController

var controller=(function(budgetCtrlr,UICtrlr){
    
    var setupEventListeners= function(){
        var inputDom=UICtrlr.getInputObjectDom();
        document.querySelector(inputDom.inputBtn).addEventListener('click',ctrlrAddItems);

    document.addEventListener('keypress',function(event){
       if(event.keyCode===13 || event.which===13 )
        ctrlrAddItems();
    });

    //step 12: set up event delegator for icon x

    document.querySelector(inputDom.container).addEventListener('click',ctrlDeleteItem);

    //step 16.1 : set up event listener to change the color pased on input type

    document.querySelector(inputDom.inputType).addEventListener('change',UICtrlr.toggleOutlineBasedOnType);

};

//step 10: create a function to update budget
    var updateBudget= function(){
        
        //step 10.1: calculate budget,
        budgetCtrlr.calculateBudget();
        //step 10.2: update budget,
        var budget=budgetCtrlr.getBudget();
        
        //step 10.3: insert budget into the html
        UICtrlr.displayBudget(budget);
    };

    //step 13 :update percentage
    var updatePercentage=function(){
        //13.1 calc percentage
        budgetCtrlr.calculatePercentage();
        //13.2 : get percentage
        var percentage =budgetCtrlr.getPercentage();
        //13.3 :update percentage on ui
        UICtrlr.displayPercentageforEachExpense(percentage);
    } ;
    //step 4: arrange all the input and the event listeners in one function

    var ctrlrAddItems= function(){
        var input, newItem ;
        //3.1:get Input data from fields, 3.1.1: get input from UIController with dom names
        
       input=UICtrlr.getStrings();
       //step 11: all the below functions should be only possible if the input fields are not empty or 0
       if(input.description!=="" && !isNaN(input.value) && input.value!==0){

    
        //3.2:get Add items to budgetController
        newItem=budgetCtrlr.addItems(input.type,input.description, input.value);
        //3.3: add items to UI// step 8
        UICtrlr.addItemsList(newItem, input.type);
        //3.4:clear input fields
        UICtrlr.clearFields();
        //3.5: budget
        updateBudget();
        //3.6 :percentage update after 13
        updatePercentage();
        
       }
    };

        //step 12.2:create event handler function

        var ctrlDeleteItem=function(event){
            //step 12.3: select the id of the parent nodeof the icon and split it so that there is a type and  id array
            var itemId,splitId,splitType,ID;
            itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
            splitId=itemId.split('-');
            splitType=splitId[0];
            ID=parseInt(splitId[1]);
            // step 12.4 delete the item from the data structure
            budgetCtrlr.deleteItem(splitType,ID);
            // step 12.5: delete the item from the UI
            UICtrlr.deleteItemList(itemId);
            // step 12.6: calculate and update the new budget
            updateBudget();
            // 12.7: update percentage after 13
            updatePercentage();
        };

    return {
        init: function(){
            console.log('Application has started!');
            //step 15.1: display month on budget panel
            UICtrlr.displayMonth();
            //step 10.3.2: setting the initial values of the budget panel
            UICtrlr.displayBudget({
                totalIncome: 0 ,
                    totalExpense: 0,
                    budget: 0,
                    percentage: 0
            });
            setupEventListeners();
        }
    } ; 

})(budgetController,UIController);

controller.init();
