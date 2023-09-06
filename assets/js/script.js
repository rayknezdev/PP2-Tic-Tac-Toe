//adds audible feedback when a tile is clicked or game ends with a win/tie
let audio = new Audio();
audio.src = "assets/media/click.mp3";
audio.volume = 0.1;

let winaudio = new Audio ('assets/media/winaudio.wav');
winaudio.volume = 0.3;

let tieaudio = new Audio ('assets/media/tieaudio.wav');
tieaudio.volume = 0.3;  

// variables
let tiles = Array.from(document.querySelectorAll('.tile'));
let playerDisplay = document.querySelector('.display-player');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;

// auto show rule's popup menu on page load
let popupRules = document.querySelector('.popup');
let closeRules = document.querySelector('#close-rules');

window.onload = function() { 
    setTimeout(function() {
        popupRules.style.display = 'block';
    }, 2000);
};

closeRules.addEventListener('click', () => { 
    popupRules.style.display = 'none';
});

// declaring end game statments 
const PLAYERX_WON = 'PlayerX_WON';
const PLAYERO_WON = 'PlayerO_WON';
const TIE = 'TIE';

/* 
    Game board index:
    [0][1][2]
    [3][4][5]
    [6][7][8]
*/

let winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], 
    [0, 4, 8],
    [2, 4, 6]
];

// runs loop to see if game winning conditions have been met 
let handleResultValidation = (roundWon) => { 
    for (let i = 0; i <= 7; i++) { 
        let winCondition = winningConditions[i];
        let conditionOne = board[winCondition[0]];
        let conditionTwo = board[winCondition[1]];
        let conditionThree = board[winCondition[2]];
        if (conditionOne === '' || conditionTwo === '' || conditionThree === '') { 
            continue;
        }
        if (conditionOne === conditionTwo && conditionTwo === conditionThree) { 
            roundWon = true;
            break;
        }
    }

if (roundWon) { 
    announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
    isGameActive = false; 
    winaudio.play();
    return;
}
if (!board.includes(''))
announce(TIE);
};

// announces which player has won
let announce = (type) => {
    let announcer = document.querySelector('.announcer');
    switch(type){
        case PLAYERO_WON:
            announcer.innerHTML = 'Player <span class="playerO">O</span> Won!';
            break;
        case PLAYERX_WON:
            announcer.innerHTML = 'Player <span class="playerX">X</span> Won!';
            break;
        case TIE:
            announcer.innerText = 'Tie';
            tieaudio.play();
    }
    announcer.classList.remove('hide');
};


//checks whether a tile has a value or not
let isValidAction = (tile) => { 
    if (tile.innerText === 'X' || tile.innerText === 'O'){ 
        return false;
    }
    
    return true;
};

//updates the board
let updateBoard = (index) => {
    board[index] = currentPlayer;
};

// changes player based on which turn has just been taken
let changePlayer = () => { 
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);
};

// represents which user is currently playing. Checks whether game is active or not.
let userAction = (tile, index) => { 
    if(isValidAction(tile) && isGameActive) { 
        tile.innerText = currentPlayer;
        tile.classList.add(`player${currentPlayer}`);
        updateBoard(index);
        handleResultValidation();
        changePlayer();
    }
};

let resetBoard = () => { 
    let announcer = document.querySelector('.announcer');
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true; 
    announcer.classList.add('hide');

    if (currentPlayer === 'O') { 
        changePlayer();
    }

    tiles.forEach(tile => { 
        tile.innerText = '';
        tile.classList.remove('playerX');
        tile.classList.remove('playerO');
    });
};

tiles.forEach( (tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
});

let resetButton = document.querySelector('#reset-btn');
resetButton.addEventListener('click', resetBoard);