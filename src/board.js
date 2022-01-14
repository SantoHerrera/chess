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
        this.createNestedArray(8, 9);

    };

    createNestedArray = (x, y) => {
        //x is how many arrays
        // y is how many objects in x array

        //ex x = 3, y = 2
        //[
        //[{}, {}], 
        //[{}, {}], 
        //[{}, {}]
        //]

        let nestedArray = [];

        for (let i = 0; i < y; i++) {
            nestedArray.push([]);
            for (let j = 0; j < x; j++) {
                //true represents bomb

                //keeps track of trues count && the ids 

                //information of individual cell
                nestedArray[i][j] = {
                    screen: `${j}-${i}`,

                    hasBeenClicked: false,
                    nearbyBombs: 0,
                    id: `${j}-${i}`,
                    wasrightClicked: false
                };
            }
        }

        nestedArray.reverse()


        this.setState({
            //keeps track of board and some bomb info
            board: nestedArray,
            firstClick: true
        })
    }

    cellClick = (e) => {

        console.log(e.target.id)
    }


    handleRightClick(e) {
        //stops menu that pops up when right clicked 
        e.preventDefault();
        console.log("right click")
    }


    tablerows = (nestedArray) => {
        if (!this.state.board) { return; }//if a board already exists in state return

        return nestedArray.map((rows, x) => {

            let row = rows.map((cell, y) =>
                <td id={nestedArray[x][y].id} onClick={(e) => { this.cellClick(e); }} onContextMenu={(e) => this.handleRightClick(e)}>
                    {nestedArray[x][y].screen}
                </td>);

            return (
                <tr>
                    {row}
                </tr>
            );
        });
    }


    changeCellScreen(currentBoard, id) {

        let currentCell = this.getCell(currentBoard, id)
        //if its a bomb show bomb
        if (currentCell.isBomb) {
            this.getCell(currentBoard, id, (cell) => { cell.screen = '*' })
        }
        //if its not a bomb and no nearby bombs dont display anything
        else if (!currentCell.isBomb && currentCell.nearbyBombs === 0) { this.getCell(currentBoard, id, (cell) => { cell.screen = "" }) }
        //else display nearby bomb number
        else {
            this.getCell(currentBoard, id, (cell) => { cell.screen = cell.nearbyBombs })
        }
    }

    getCell(board, cellID, fn) {
        //modify one cell
        let Id = this.stringToId(cellID)

        if (fn) {
            fn(board[Id[0]][Id[1]]);
        }
        return board[Id[0]][Id[1]];
    }

    stringToId(string) {
        //given 'x-y' will return ['x', 'y']
        let theId = string.split('-');
        //x && y will be turned into numbers, returns array
        let ID = theId.map(stringNumber => parseInt(stringNumber));
        return ID;
    }


    render() {
        return (
            <div>

                <button onClick={() => { this.getBoardReady(); }}>Start New Game</button>
                <table><tbody>{this.tablerows(this.state.board)}</tbody></table>
            </div>
        )
    }
}
