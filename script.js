const gameBoard = (function()
{
    const boardArray = document.querySelectorAll(".game-container div");

    function addListeners()
    {
        boardArray.forEach((item) => item.addEventListener('click', gameController.playerMark));
    }

    function resetBoard()
    {
        boardArray.forEach( (item) => item.textContent = "")
    }

    return{
        addListeners, resetBoard
    };
})()

const gameController = (function()
{
    let player1;
    let player2;

    let winningCombinations =
    [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    function startGame()
    {
        gameBoard.resetBoard();
        gameBoard.addListeners();
        populatePlayers();
    }

    function populatePlayers()
    {
        player1 = Player(true);
        player2 = Player(false);
    }

    function playerMark(event)
    {
        let square = event.target;
        
        if(player1.isTurn)
        {
            if(square.textContent === "")
            {
                square.textContent = 'X';
                player1.squaresMarked.push(parseInt(square.dataset.index));
                player1.isTurn = false;
                player2.isTurn = true;
                player1.turnNum++;

                if(player1.turnNum >= 3)
                {
                    const winCondition = checkWin(player1);
                    console.log(winCondition);
                }
            }
        }
        else if(player2.isTurn)
        {
            if(square.textContent === "")
            {
                square.textContent = "O";
                player2.squaresMarked.push(parseInt(square.dataset.index));
                player2.isTurn = false;
                player1.isTurn = true;
                player2.turnNum++

                if(player2.turnNum >= 3)
                {
                    const winCondition = checkWin(player2);
                    console.log(winCondition);
                }
            }
        }
    }

    function checkWin(player)
    {
        let winCondition = false;

        for(let i = 0; i< winningCombinations.length; i++)
        {
            if(player.squaresMarked.every((element) => winningCombinations[i].includes(element)))
            {
                console.log("Dog");
                winCondition = true;
                return winCondition;
            }
        }

        return winCondition;
    }

    return {startGame, playerMark, winningCombinations}
})()

function Player(isTurn)
{
    let squaresMarked = [];
    let turnNum = 0;

    return {isTurn, squaresMarked, turnNum};
}

gameController.startGame();