const board = document.querySelector('.board');
const button1 = document.getElementsByClassName('btn-1')[0];
const button2 = document.getElementsByClassName('btn-2')[0];
let currentPlayer;
let currentMode;
let isGameStarted=false;
let gameBoard = [[],[],[]];
const checkWinner=(gameBoard)=>{
    for(let i=0;i<3;i++){
        if(gameBoard[i][0] == currentPlayer && gameBoard[i][1] == currentPlayer && gameBoard[i][2] == currentPlayer){
            return currentPlayer;
        }
        if(gameBoard[0][i] == currentPlayer && gameBoard[1][i] == currentPlayer && gameBoard[2][i] == currentPlayer){
            return currentPlayer;
        }  
    }
    if(gameBoard[0][0] == currentPlayer && gameBoard[1][1] == currentPlayer && gameBoard[2][2] == currentPlayer){
        return currentPlayer;
    }
    if(gameBoard[0][2] == currentPlayer && gameBoard[1][1] == currentPlayer && gameBoard[2][0] == currentPlayer){
        return currentPlayer;
    }
    return undefined;
    
}
button1.addEventListener('click', () => {
    if(button1.innerText == "AI"){
        currentMode="AI";
        button1.style.display = "none";
        button1.innerText = "Start";
        button2.style.display = "block";
        button2.innerText = "Reset";
        currentPlayer="X";
        alert("Player X Turn");
    }else{
        isGameStarted=true;
        button1.innerText = "AI";
        button2.style.display = "block";
        button2.innerText = "Manual";
    }   
});

function resetGame(){
    currentPlayer=undefined;
    currentMode=undefined;
    gameBoard = [[],[],[]];
    let cells = board.children;
    for(let i=0;i<cells.length;i++){
        cells[i].textContent = '';
    }
    
}
function resetGameAfterWinner(){
    resetGame();
    button1.style.display = "block";
    button1.innerText = "AI";
    button2.innerText = "Manual";
}
button2.addEventListener('click', () => {
    if(button2.innerText == "Manual"){
        currentMode="Manual";
        button1.style.display = "none";
        button1.innerText = "Start";
        button2.style.display = "block";
        button2.innerText = "Reset";
        currentPlayer="X";
        alert("Player X Turn");
    }else{
        button1.style.display = "block";
        button1.innerText = "AI";
        button2.innerText = "Manual";
        resetGame();
    }
});

board.addEventListener('click', (e) => {  
    if(!isGameStarted){
        alert("Please Start the Game");
        return;
    }
    if(currentMode== undefined){
        alert("Please Select the Mode");
        return;
    }  
    console.log(e.target);
    const cellelement = e.target;
    let cell = e.target.id;
    console.log(cell); 
    cell=cell.split("_");
    const row = parseInt(cell[0]);
    const col = parseInt(cell[1]);
    if(gameBoard[row][col] == undefined ){
     gameBoard[row][col] = currentPlayer;
     cellelement.innerText = currentPlayer;
     let winner = checkWinner(gameBoard);
     console.log(winner);
     if(winner== "X" || winner== "O"){
         console.log(`Player ${winner} Wins`);
        setTimeout(() => {
            resetGameAfterWinner();
        }, 500);
     }
     currentPlayer = currentPlayer == "X" ? "O" : "X";
    }
    else{
        alert("Already Filled");
    }
    console.log(row, col);   
})