/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let lockBoard = false;
let lockInfo = false;

// make the boards

function makeBoard() {
  board = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => null));
}


function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');

  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}



// handle the click
function handleClick(evt) {
  let x = +evt.target.id;
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // place piece in board and add to HTML table
  currPlayer===1? board[y][x] = 1 : board[y][x] = 2;
  placeInTable(y, x);


  // check for win
  if (checkForWin()) {
    // here you would want to call create message with this as it's p
    const div = makeMessage(`Player ${currPlayer} won!`, `Play Again`);

      endGame(div);


    // return endGame(`Player ${currPlayer} won!`);
  }

  if (checkForTie()) {
    const div = makeMessage(`It's a tie`, `Play Again`);
    endGame(div);
    // return endGame(`It's a tie`);
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

  // find the correct row
function findSpotForCol(x) {
  for (let i = board.length - 1; i >= 0; i--){
    if (board[i][x] === null) { return i }
  }
    return null
}
// place the circle
function placeInTable(y, x) {

  let tdPiece = document.createElement('div');
  tdPiece.classList.add('piece','p1','p2');

  currPlayer===1? tdPiece.classList.toggle('p2'):tdPiece.classList.toggle('p1') ;
  let td = document.getElementById(`${y}-${x}`)
  td.append(tdPiece)

}
  // determain winner
function checkForWin() {
  function _win(cells) {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }


  // looping through the height and width
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // creating a four points line array horizantally, vertically and diagonally
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // checking if any of those arrays returns true using the win private function
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { return true; }

    }
  }
}
// check for tie
function checkForTie(){
  for (let row of board) { return row.every(data => data !== null); }
}
// end game
function endGame(msg) {

  msg.style.display = 'inline-block';

  document.querySelector('#game').prepend(msg);
  setTimeout(function () {
    document.querySelector('#game').children[0].remove();
    newGame();
  },5000)

}

function showInfo(messageDiv) {

  if (lockInfo === false) {
    document.querySelector('#game').insertBefore(messageDiv, document.querySelector('#board'));
    messageDiv.style.display = 'inline-block'
    lockInfo = true
  }
  else {
    return
  }

}

function makeMessage(data, btnData) {
  const div = document.createElement('div');
  div.classList.add('info');
  const p = document.createElement('p');
  p.innerHTML = data;
  div.append(p);
  const button = document.createElement('button');
  button.innerHTML = btnData;
  btnData === 'X' ? button.addEventListener('click', removeMsg) : button.addEventListener('click', newGame)

  div.append(button);

  return div;
}

function removeMsg(e) {
  e.target.parentElement.remove();
}

function newGame() {
  location.reload(true);

}


// handling buttons
function buttonHandling() {
  document.querySelector('#start-game').addEventListener('click', (e) => {
    if (lockBoard === false) {
      console.log(e.target)
      makeBoard();
      makeHtmlBoard();
      lockBoard = true
    }
    else {return }


  });
  document.querySelector('#info').addEventListener('click', () => {
    const innerHTMLForInfo = `Connect Four is played on a grid, with two players,
    1(red) and 2(yellow).The players alternate turns,
    dropping a piece of their color in the top of a column.
    The piece will fall down to the further - down unoccupied slot.
    The game is won when a player makes four in a row
    (horizontally, vertically, or diagonally).
    The game is a tie if the entire board fills up without a winner.`
    const div = makeMessage(innerHTMLForInfo, 'X');
    console.log(div);
    showInfo(div);
  })

}
buttonHandling();
