const gameBoard = (function()
{
    const boardArray = document.querySelectorAll(".game-container div");

    function addListeners(isAiMatch)
    {
        if(isAiMatch)
        {
            boardArray.forEach((item) => item.addEventListener('click', gameController.aiMatchAction));
        }
        else
        {
            boardArray.forEach((item) => item.addEventListener('click', gameController.twoPlayerMatchAction));
        }
    }

    function removeListeners()
    {
        boardArray.forEach((item) => item.removeEventListener('click', gameController.playerMark));
        //TODO remove ai match event listeners and player match listeners.
    }

    function displayBoard()
    {
        document.querySelector(".game-container").style.display = "grid";
    }

    function resetBoard()
    {
        boardArray.forEach((item) => item.textContent = "")
    }

    function returnOpenSquares()
    {
        let openSquares = [];

        for(let i = 0; i < boardArray.length; i++)
        {
            if(boardArray[i].textContent === "")
            {
                openSquares.push(parseInt(boardArray[i].dataset.index));
            }
        }

        return openSquares;
    }

    function removeSquareClasses()
    {
        boardArray.forEach((element) => element.classList.remove("game-square-ai-move"));
    }

    return{
        addListeners, removeListeners, resetBoard, displayBoard, returnOpenSquares, removeSquareClasses
    };
})()

const gameController = (function()
{
    let player1;
    let player2;
    let isAiMatch;
    let totalTurns = 0;
    let isADraw = false;
    let currentWinnerCombination = [];

    const playerButton = document.querySelector("#playerMatch")
    const aiButton = document.querySelector("#aiMatch")

    playerButton.addEventListener('click', playerMatch);
    aiButton.addEventListener('click', aiMatch);

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

    function playerMatch()
    {
        isAiMatch = false;
        playerButton.style.display = "none";
        aiButton.style.display = "none";
        startGame();
    }

    function aiMatch()
    {
        isAiMatch = true;
        playerButton.style.display = "none";
        aiButton.style.display = "none";
        startGame();
    }

    function startGame()
    {
        gameBoard.displayBoard();
        gameBoard.resetBoard();
        gameBoard.addListeners(isAiMatch);
        populatePlayers();
    }

    function populatePlayers()
    {
        player1 = Player(true, "Player 1");
        player2 = Player(false, "Player 2");
    }

    function twoPlayerMatchAction(event)
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
                totalTurns++;

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
                totalTurns++;

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

        if(totalTurns >= 9)
        {
            isADraw = true;
            gameWon();
        }
    }

    function aiMatchAction(event)
    {
        let square = event.target;

        if(player1.isTurn)
        {
            if(square.textContent === "")
            {
                square.classList.add("game-square-ai-move");
                square.textContent = "X";
                player1.squaresMarked.push(parseInt(square.dataset.index));
                player1.isTurn = false;
                player2.isTurn = true;
                player1.turnNum++;
                totalTurns++;

                if(player1.turnNum >= 3)
                {
                    const winCondition = checkWin(player1);

                    if(winCondition)
                    {
                        player2.isTurn = false;
                        gameWon(player1);
                    }
                    else if(totalTurns >= 9)
                    {
                        isADraw = true;
                        gameWon();
                    }
                }
            }
        }

        if(totalTurns >= 9)
        {

        }
        else if(player2.isTurn)
        {
            let openSquares = gameBoard.returnOpenSquares();
            let randomSquare = openSquares[Math.floor(Math.random() * openSquares.length)];

            const square = document.querySelector('[data-index=' + CSS.escape(randomSquare) + ']');
            square.classList.add("game-square-ai-move");
            square.textContent = "O";

            player2.squaresMarked.push(parseInt(square.dataset.index));
            player2.isTurn = false;
            player1.isTurn = true;
            player2.turnNum++;
            totalTurns++;

            if(player2.turnNum >= 3)
            {
                const winCondition = checkWin(player2);

                if(winCondition)
                {
                    player1.isTurn = false;
                    gameWon(player2);
                }
                else if(totalTurns >= 9)
                {
                    isADraw = true;
                    gameWon();
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
                    currentWinnerCombination = winningCombinations[i];
                    return true;
                }
            }

            return false;
        }

        return winCondition;
    }

    function gameWon(player)
    {
        if(!isADraw)
        {
            drawLine();
        }

        gameBoard.removeListeners();

        const buttonsContainer = document.querySelector(".buttons-container");
        const newGameButton = document.createElement("button");

        newGameButton.textContent = "New game";
        newGameButton.type = "button";
        newGameButton.classList.add("new-game-button");
        newGameButton.addEventListener('click', newGame);

        buttonsContainer.appendChild(newGameButton);

        const winnerContainer = document.querySelector(".winner-container");
        const winnerMessage = document.createElement("p");

        if(isADraw)
        {
            winnerMessage.textContent = "It's a draw!";
        }
        else
        {
            winnerMessage.textContent = player.playerName + " has won!";
        }

        winnerMessage.classList.add("winner-message");
        winnerContainer.appendChild(winnerMessage);
    }

    function newGame(e)
    {
        e.target.remove();
        document.querySelector(".winner-message").remove();
        totalTurns = 0;
        isADraw = false;

        const svgContainer = document.querySelector("#svg-container")
        svgContainer.classList.remove("winner-line-visible");
        svgContainer.classList.add("winner-line");

        const svgLines = document.querySelectorAll("line");
        svgLines.forEach((element) => element.style.display = "none");

        gameBoard.removeSquareClasses();
        startGame();
    }

    function drawLine()
    {
        const svgContainer = document.querySelector("#svg-container");
        svgContainer.classList.remove("winner-line");
        svgContainer.classList.add("winner-line-visible");


        if(currentWinnerCombination === winningCombinations[0])
        {
            document.querySelector("#line1").style.display = "block";
        }
        else if(currentWinnerCombination === winningCombinations[1])
        {
            document.querySelector("#line2").style.display = "block"; 
        }
        else if(currentWinnerCombination === winningCombinations[2])
        {
            document.querySelector("#line3").style.display = "block";  
        }
        else if(currentWinnerCombination === winningCombinations[3])
        {
            document.querySelector("#line4").style.display = "block"; 
        }
        else if(currentWinnerCombination === winningCombinations[4])
        {
            document.querySelector("#line5").style.display = "block";  
        }
        else if(currentWinnerCombination === winningCombinations[5])
        {
            document.querySelector("#line6").style.display = "block"; 
        }
        else if(currentWinnerCombination === winningCombinations[6])
        {
            document.querySelector("#line7").style.display = "block";  
        }
        else if(currentWinnerCombination === winningCombinations[7])
        {
            document.querySelector("#line8").style.display = "block"; 
        }
    }

    return {startGame, twoPlayerMatchAction, aiMatchAction, winningCombinations}
})()

function Player(isTurn, name)
{
    let squaresMarked = [];
    let turnNum = 0;
    let playerName = name;

    return {isTurn, squaresMarked, turnNum, playerName};
}