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

function resetGameAfterTie(){
    console.log("Tie");  
    resetGame();
    button1.style.display = "block";
    button1.innerText = "AI";
    button2.innerText = "Manual";
}


function isBoardFull(board) {
    let count=0;
    for(let i=0;i<board.length;i++){
        for(let j=0;j<board[i].length;j++){
            if(board[i][j] == "X" || board[i][j] == "O"){
                count++;
            }
        }
    }
    return count==9;
}


function getBestMoveForO(Board) {
    const scoreMap = { X: -1, O: 1, tie: 0 };

    function checkWinner(b) {
        // Flatten Board for simplicity
        const flat = b.flat();

        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (let combo of wins) {
            const [a, b, c] = combo;
            if (
                flat[a] &&
                flat[a] === flat[b] &&
                flat[a] === flat[c]
            ) {
                return flat[a];
            }
        }

        if (flat.every(cell => cell !== undefined)) return "tie";
        return null;
    }

    function minimax(b, isMaximizing) {
        const result = checkWinner(b);
        if (result !== null) return scoreMap[result];

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (!b[r][c]) {
                        b[r][c] = "O";
                        let score = minimax(b, false);
                        b[r][c] = undefined;
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (!b[r][c]) {
                        b[r][c] = "X";
                        let score = minimax(b, true);
                        b[r][c] = undefined;
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    let bestScore = -Infinity;
    let move = { row: -1, col: -1 };

    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (!Board[r][c]) {
                Board[r][c] = "O";
                let score = minimax(Board, false);
                Board[r][c] = undefined;

                if (score > bestScore) {
                    bestScore = score;
                    move = { row: r, col: c };
                }
            }
        }
    }

    return move;
}


board.addEventListener('click', (e) => {  
    if(!isGameStarted){
        alert("Please Start the Game");
        return;
    }
    if(currentMode== undefined ){
        alert("Please Select the Mode");
        return;
    } 
    if(currentPlayer== undefined){
        return;
    } 
    console.log(e.target);
    let cellelement = e.target;
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
    if (currentMode == "AI" && currentPlayer == "O"  && !isBoardFull(gameBoard) && checkWinner(gameBoard) === undefined) {
        (async () => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
    
            const { row, col } = getBestMoveForO(gameBoard);
            let position = row + "_" + col;
            cellelement = document.getElementById(position);
            cellelement.innerText = currentPlayer;
            console.log("Ai move:-", row, col);
            gameBoard[row][col] = currentPlayer;
    
            winner = checkWinner(gameBoard);
            console.log(winner);
            if (winner == "X" || winner == "O") {
                console.log(`Player ${winner} Wins`);
                setTimeout(() => {
                    resetGameAfterWinner();
                }, 500);
            }
    
            currentPlayer = currentPlayer == "X" ? "O" : "X";
        })();
    }
    if(isBoardFull(gameBoard)){  
        currentPlayer=undefined;     
        setTimeout(() => {
            resetGameAfterTie();
        }, 500);
    }
    console.log(row, col);   
});