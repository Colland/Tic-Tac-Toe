const gameBoard = (function()
{
    const boardArray = document.querySelectorAll(".game-container div");

    function addListeners()
    {
        boardArray.forEach((item) => item.addEventListener('click', gameController.mainLoop));
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

    function mainLoop(event)
    {
        let square = event.target;

        if(player1.isTurn)
        {
            if(square.textContent === "")
            {
                square.textContent = 'X';
                player1.isTurn = false;
                player2.isTurn = true;
            }
        }
        else if(player2.isTurn)
        {
            if(square.textContent === "")
            {
                square.textContent = "O";
                player2.isTurn = false;
                player1.isTurn = true;
            }
        }
    }

    return {startGame, mainLoop}

})()

function Player(isTurn)
{
    isTurn;
    return {isTurn};
}

gameController.startGame();