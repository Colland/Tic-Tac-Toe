const gameBoard = (function()
{
    const boardArray = document.querySelectorAll(".game-container div");

    function addListeners()
    {
        boardArray.forEach((item) => item.addEventListener('click', gameController.playerMark));
    }

    function removeListeners()
    {
        boardArray.forEach((item) => item.removeEventListener('click', gameController.playerMark));
    }

    function resetBoard()
    {
        boardArray.forEach((item) => item.textContent = "")
    }

    return{
        addListeners, removeListeners, resetBoard
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

                    if(winCondition)
                    {
                        gameWon(player1);
                    }
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

                    if(winCondition)
                    {
                        gameWon(player2);
                    }
                }
            }
        }
    }

    function checkWin(player)
    {
        let winCondition = false;

        if(arrayComparison())
        {
            winCondition = true;
            return winCondition;
        }

        //Checks to see if player array has 3 numbers that are a subset of one of the winning-combination 3 number arrays.
        function arrayComparison(element, i)
        {
            //Iterates through each winningCombination 3 number array.
            for(let i = 0; i < winningCombinations.length; i++)
            {
                //counter
                let amountOfEquivalentNumbers = 0;

                //Iterates through each number in the player array.
                for(let k = 0; k < player.squaresMarked.length; k++)
                {
                    //Checks if the current player number is included anywhere in the current winningCombinations 3 number array.
                    //If true, increments the counter.
                    if(winningCombinations[i].includes(player.squaresMarked[k]))
                    {
                        amountOfEquivalentNumbers++;
                    }
                }

                //Once 3 player numbers are found in a single winning combination, returns true.
                if(amountOfEquivalentNumbers === 3)
                {
                    return true;
                }
            }

            return false;
        }

        return winCondition;
    }

    function gameWon(player)
    {
        gameBoard.removeListeners();

        const buttonsContainer = document.querySelector(".buttons-container");
        const newGameButton = document.createElement("button");

        newGameButton.textContent = "New game";
        newGameButton.type = "button";
        newGameButton.classList.add("new-game-button");
        newGameButton.addEventListener('click', startGame);

        buttonsContainer.appendChild(newGameButton);
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