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



/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function showInfo() {
  // create a div, p and a button
  const div = document.createElement('div');
  div.classList.add('info');
// paragraph
  const p = document.createElement('p')
  p.innerHTML = `Connect Four is played on a grid, with two players,
  1(red) and 2(yellow).The players alternate turns,
  dropping a piece of their color in the top of a column.
  The piece will fall down to the further - down unoccupied slot.
  The game is won when a player makes four in a row
  (horizontally, vertically, or diagonally).
  The game is a tie if the entire board fills up without a winner.`
  // button
  const button = document.createElement('button');
  button.innerHTML = 'X';
  button.addEventListener('click', removeInfo)
  div.append(p)
  div.append(button)
  // document.querySelector('#game').append(div);
  document.querySelector('#game').insertBefore(div, document.querySelector('#board'));
  div.style.display = 'inline-block'

}

function removeInfo(e) {
  e.target.parentElement.remove();
}

function makeBoard() {
  // should add p1 || p2 in this  array
  board = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => null));
}


/** makeHtmlBoard: make HTML table and row of column tops. */

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

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let i = board.length - 1; i >= 0; i--){
    if (board[i][x] === null) { return i }
  }
    return null
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  // the variable tdPiece might need to be a global one in the future
  let tdPiece = document.createElement('div');
  tdPiece.classList.add('piece','p1','p2');

  // check what the value of currentPlayer
  currPlayer===1? tdPiece.classList.toggle('p2'):tdPiece.classList.toggle('p1') ;
  let td = document.getElementById(`${y}-${x}`)
  td.append(tdPiece)

}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {

  // get x from ID of clicked cell
  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
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
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkForTie()) {
    // here you would want to call create message with this as it's p
    return endGame(`It's a tie`);
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

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

function checkForTie(){
  for (let row of board) { return row.every(data => data !== null); }
}

document.querySelector('#start-game').addEventListener('click', () => {
  makeBoard();
  makeHtmlBoard();

});
document.querySelector('#info').addEventListener('click', () => {
  showInfo();
})
