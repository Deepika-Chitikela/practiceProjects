//Step1: declare variables 
var counter1,active1,dice1,dice2,randNum1,randNum2,score1,score2,turns;
//step2: initialize variables with init function
function init(){
 counter1=0;
 counter2=0;  
randNum=0;
score1=0;
score2=0;
turns=0;
document.getElementById("dice1").style.display='none';
document.getElementById("dice2").style.display='none';
document.querySelector(".winner").style.display='none';
document.querySelector('.score-1-value').textContent='0';
document.querySelector('.score-2-value').textContent='0';
document.querySelector('.turns').textContent='0';
}
init();
//step3: enter the number of turns
document.querySelector('.begin').addEventListener('click',function(){
    turns=document.querySelector('.turns').value;
    console.log(turns);
    counter1=turns;
    counter2= turns;
});
document.querySelector('#roll-dice-1').addEventListener('click',function(){ 
   
   
   
    console.log('counter of if else'+counter1);
    randNum=Math.floor(Math.random() * 6) +1;
    console.log(randNum);
    document.getElementById("dice1").style.display='block';
    document.getElementById('dice1').src='dice-'+randNum+'.png';
    //check for next player
    if(counter1>0){
        score1 +=randNum;
        document.querySelector('.score-1-value').textContent=score1;
        counter1--;
    }
    else{
        document.querySelector('.player-2-panel').classList.add('active');
        document.querySelector('.player-1-panel').classList.remove('active');
        document.querySelector('#roll-dice-1').style.display="none";
    }


   

});
document.querySelector('#roll-dice-2').addEventListener('click',function(){
  
   
    console.log('counter of if else'+counter2);
    randNum=Math.floor(Math.random() * 6) +1;
    console.log(randNum);
    document.getElementById("dice2").style.display='block';
    document.getElementById('dice2').src='dice-'+randNum+'.png';

    if(counter2>0){
        score2 +=randNum;
        document.querySelector('.score-2-value').textContent=score2;
    }
    else{
        
        document.querySelector('#roll-dice-2').style.display="none";
    
    if (score1>score2){
        alert("player 1 wins.._!");
    }
    else if(score1==score2){
        alert("both players wins..!");
    }
    else{
        alert('player 2 wins!');
    }
}
    counter2--;
});


    
    /*else if(counter<=turns){
 
        
        counter++;
        
        /*if(counter>turns){
            
            document.querySelector('.player-1-panel').classList.remove('active');
               document.querySelector('.player-2-panel').classList.remove('active');
           }
          
        
}
    else{
        document.querySelector('.player-1-panel').classList.add('active');
        document.querySelector('.player-2-panel').classList.remove('active');
    }  */
    

