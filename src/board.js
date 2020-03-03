import React, { Component } from 'react';
import './index.css'
import './App.css';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faceBomb: '',
            firstClick: true,
            questionMark: '?',
            bombsOnBoard: 0,
            bombsDiscovered: 0,
            bombsDiscoveredVerified: 0,
            idsOfBombs: [],
            Board
        }
    }

    getBoardReady = () => {
        this.createNestedArray(5, 9);

    };

    randomTrueFalse = () => Math.random() <= 0.2;

    createNestedArray = (x, y) => {
        //x is how many arrays
        // y is how many objects in x array

        //ex x = 3, y = 2
        //[
        //[{}, {}], 
        //[{}, {}], 
        //[{}, {}]
        //]
        let countBombs = 0;
        let idsOfBombsHere = [];

        let nestedArray = [];
        for (let i = 0; i < x; i++) {
            nestedArray.push([]);
            for (let j = 0; j < y; j++) {
                //true represents bomb
                let trueFalse = this.randomTrueFalse();
                //keeps track of trues count && the ids 
                if (trueFalse) { countBombs++; idsOfBombsHere.push(`${i}-${j}`); }
                //information of individual cell
                nestedArray[i][j] = {
                    screen: "?",
                    isBomb: trueFalse,
                    hasBeenClicked: false,
                    nearbyBombs: 0,
                    id: `${i}-${j}`,
                    wasrightClicked: false
                };
            }
        }

        for (let i = 0; i < idsOfBombsHere.length; i++) {
            //increments all nearby cells if its a bomb
            this.allNearbyCells(nestedArray, idsOfBombsHere[i], (bomb) => { bomb.nearbyBombs++ })
        }

        this.setState({
            //keeps track of board and some bomb info
            board: nestedArray,
            bombsOnBoard: countBombs,
            idsOfBombs: idsOfBombsHere,
            firstClick: true,
            bombsDiscovered: 0,
            bombsDiscoveredVerified: 0
        })
    }

    //for every item in array creates cell
    //[[],creates row from array
    //[{randomObj}], creates cell from randomObj
    //[{}, {}, {}] row with 3 cells
    tablerows = (nestedArray) => {
        if (!this.state.board) { return; }//if a board already exist return
        return nestedArray.map((rows, x) => {
            let row = rows.map((cell, y) => <td id={`${x}-${y}`} onClick={(e) => { this.cellClick(e); }} onContextMenu={(e) => this.handleRightClick(e)}>
                {/*if is hasnt been clicked display a question mark, else deplending on the situation display some kind of logic */}
                {this.state.board[x][y].screen}
            </td>);
            return (
                <tr>
                    {row}
                </tr>
            );
        });
    }

    stringToId(string) {
        //given 'x-y' will return ['x', 'y']
        let theId = string.split('-');
        //x && y will be turned into numbers, returns array
        let ID = theId.map(stringNumber => parseInt(stringNumber));
        return ID;
    }

    cellClick = (e) => {

        let ID = this.stringToId(e.target.id)
        let cellClicked = this.state.board[ID[0]][ID[1]];

        //console.log(this.state.idsOfBombs)

        if (cellClicked.hasBeenClicked) { return; }
        //if you die on first click, fix that
        if (this.state.firstClick) {
            //the reason for passing e.target.id instead of ID is beacuse its easier to check if array has 
            //a string than a array
            this.fixFirstClickBomb(e.target.id);
        }

        if (cellClicked.isBomb) {
            alert('youve lost please reload page to play again');
        }

        let newBoard = this.state.board;

        newBoard[ID[0]][ID[1]].hasBeenClicked = true;

        this.changeCellScreen(newBoard, e.target.id);

        this.setState({
            board: newBoard,
            firstClick: false
        });
    }

    changeCellScreen(currentBoard, id) {
        let ID = this.stringToId(id)
        //if its a bomb show bomb
        if (currentBoard[ID[0]][ID[1]].isBomb) { currentBoard[ID[0]][ID[1]].screen = "*" }
        //if its not a bomb and no nearby bombs dont display anything
        else if (!currentBoard[ID[0]][ID[1]].isBomb && currentBoard[ID[0]][ID[1]].nearbyBombs === 0) { currentBoard[ID[0]][ID[1]].screen = "" }
        //else display nearby bomb number
        else { currentBoard[ID[0]][ID[1]].screen = currentBoard[ID[0]][ID[1]].nearbyBombs }
    }

    //gets all nearby cells
    allNearbyCells(board, stringId, fn) {
        let Id = this.stringToId(stringId);

        const x = Id[0];
        const y = Id[1];

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                //if it dont exist, move on
                if (!board[i] || !board[i][j]) { continue; }
                //dont put the box you clicked on the array of ids that represent the surrounding ids
                if (i === x && j === y) { continue; }

                fn(board[i][j]);
            }
        }
    }

    getCell(board, cellID, fn) {
        //modify one cell
        let Id = this.stringToId(cellID)

        fn(board[Id[0]][Id[1]]);
    }

    removeBomb(newBoard, cellID) {
        //makes the cell bomb false
        this.getCell(newBoard, cellID, (cell) => { cell.isBomb = false });
        //keeps count of nearby bombs of surrounding cells
        this.allNearbyCells(newBoard, cellID, (cell) => { cell.nearbyBombs-- })
    }

    //makes all cells including the middle cell unckickable
    make3by3Unclickable(newBoard, cellID) {

        this.getCell(newBoard, cellID, (cell) => { cell.hasBeenClicked = true })

        this.allNearbyCells(newBoard, cellID, (cell) => { cell.hasBeenClicked = true })
    }

    fixFirstClickBomb(cellID) {
        let newBoard = this.state.board;

        let newidsOfBombs = this.state.idsOfBombs;
        
        let removeTheseBombs = [];

        this.make3by3Unclickable(newBoard, cellID)

        this.allNearbyCells(newBoard, cellID, (cell) => {
            if (cell.isBomb) {
                removeTheseBombs.push(cell.id)
            }
        })

        //remove the cell that was clicked
        this.getCell(newBoard, cellID, (cell) => {
            if (cell.isBomb) {
                removeTheseBombs.push(cellID)
            }
        })

        //and any bombs nearby aswell
        removeTheseBombs.forEach((cell) => {
            this.removeBomb(newBoard, cell)
        })
        //substract removeTheseBombs array from newIdsOfBombs
        newidsOfBombs = newidsOfBombs.filter((item) =>
            !removeTheseBombs.includes(item)
        )
        //changes it from a ? to what needs to be shown
        this.allNearbyCells(newBoard, cellID, (cell) => {
            this.changeCellScreen(newBoard, cell.id)
        })

        this.setState({
            board: newBoard,
            idsOfBombs: newidsOfBombs,
            bombsOnBoard: newidsOfBombs.length
        })
    };
    //all this functions really does is mark and unmarks a cell from ? to m
    handleRightClick(e) {
        //stops menu that pops up when right clicked it
        e.preventDefault();

        let ID = this.stringToId(e.target.id);

        let newBoard = this.state.board;
        let cellClicked = newBoard[ID[0]][ID[1]];

        if (cellClicked.hasBeenClicked) { return; }
        //so you can mark and unmark cell
        cellClicked.wasrightClicked = !cellClicked.wasrightClicked;

        if (cellClicked.wasrightClicked) {
            cellClicked.screen = "M";
            //keeps track of bombs marked
            this.setState(prevState => { return { bombsDiscovered: prevState.bombsDiscovered + 1 } });
            //if you marked a cell that really was a bomb, increment counter
            if (cellClicked.isBomb) {
                this.setState(prevState => { return { bombsDiscoveredVerified: prevState.bombsDiscoveredVerified + 1 } });
            }
        } else {
            cellClicked.screen = '?';
            //keeps track of bombs marked
            this.setState(prevState => {
                return {
                    bombsDiscovered: prevState.bombsDiscovered - 1
                }
            })
            if (cellClicked.isBomb) {
                this.setState(prevState => { return { bombsDiscoveredVerified: prevState.bombsDiscoveredVerified - 1 } })
            }
        }

        this.setState({
            board: newBoard
        })
        this.checkWin();
    }

    checkWin() {
        if (this.state.bombsOnBoard === this.state.bombsDiscoveredVerified) {
            alert('youve kinda won')
        }
    }

    render() {
        return (
            <div>
                <div>Bombs on Board {this.state.bombsOnBoard}</div>
                <div>Bombs Ive Discovered {this.state.bombsDiscovered}</div>
                <div>Verified Bombs marked {this.state.bombsDiscoveredVerified}</div>
                <button onClick={() => { this.getBoardReady(); }}>Start New Game</button>
                <table><tbody>{this.tablerows(this.state.board)}</tbody></table>
            </div>
        )
    }
}
