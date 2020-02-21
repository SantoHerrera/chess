import React, { Component } from 'react';
//import './src/components/board/row.js'
//import VictoryModal from '../victoryModal/VictoryModal'
//import CatModal from '../catModal/CatModal'
import './index.css'
import './App.css';

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faceBomb: '',
            bombsOnBoard: 0,
            bombsDiscovered: 0,
            bombsDiscoveredVerified: 0,
            idsOfBombs: [],
            Board
        }
    }

    getBoardReady = () => {

            this.createNestedArray(3, 9);

            //console.log(this.state.idsOfBombs);

           // const idsOfBombs = this.state.idsOfBombs


        
    };

    countNearbyBombs(arr) {
        const currentBombs = this.state.idsOfBombs
        //console.log(currentBombs, this.state.idsOfBombs)
        /*
        for (let i = 0; i < this.state.idsOfBombs; i++) {
            //doesnt work, is not updating state, line 94
            this.incrementNearbyCellBomb(this.state.idsOfBombs[i]);
        }*/
    }

    randomTrueFalse = () => Math.random() <= 0.3;

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
                //true represent bomb
                let trueFalse = this.randomTrueFalse();
                //keeps track of trues count && the ids 
                if (trueFalse) { countBombs++; idsOfBombsHere.push(`${i}-${j}`); }
                //information of individual cell
                nestedArray[i][j] = {
                    whatToShow: "?",
                    isBomb: trueFalse,
                    hasBeenClicked: false,
                    nearbyBombs: 0,
                    id: `${i}-${j}`
                };
            }
        }

        for(let i = 0; i < idsOfBombsHere.length; i++) {
            this.incrementNearbyCellBomb(nestedArray, idsOfBombsHere[i])
        }
        
        //nestedArray[0][0] = 'fujckkkjflkasjdf this'
        //console.log(nestedArray);


        
        this.setState({
            //keeps track of amount bombs
            board: nestedArray,
            bombsOnBoard: countBombs,
            idsOfBombs: idsOfBombsHere
        })
/*
        return {
            board: nestedArray,
            bombsOnBoard: countBombs,
            idsOfBombs: idsOfBombsHere
        }*/
    }

    incrementNearbyCellBomb(board, stringId) {
        //console.log('this is being ran');
        let Id = this.stringToId(stringId);
        //let test = [];

        const x = Id[0];
        const y = Id[1];

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                //if it dont exist, move on
                if (!board[i] || !board[i][j]) { continue; }
                //dont put the box you clicked on the array of ids that represent the surrounding ids
                else if (i === x && j === y) { continue; }

                board[i][j].nearbyBombs++



                //if neighbor is bomb increment
                //what toDo

                //1. if its a bomb move on
                //else if (this.state.board[i][j].isBomb) { continue; }

                //2 else state.board[x][y].nearbyBombs ++
                //else {
                    /*
                    let newBoard = this.state.board;
                    newBoard[i][j].nearbyBombs++;
                    this.setState({
                        board: newBoard
                    })
                    */
                //   console.log(Id, this.state.board[i][j]);
                //}






                /*
                let newBoard = this.state.board;
                newBoard[x][y]['nearbyBombs']++;
                this.setState({
                    board: newBoard
                })*/
            }
        }
       // return board;
    }

    getNearbyIds(stringId) {
        let Id = this.stringToId(stringId);
        //let test = [];

        const x = Id[0];
        const y = Id[1];

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                //if it dont exist, move on
                if (!this.state.board[i] || !this.state.board[i][j]) { continue; }
                //dont put the box you clicked on the array of ids that represent the surrounding ids
                if (i === x && j === y) { continue; }

                //test.push(`${i}-${j}`)
                //if neighbor is bomb increment
                /*
                if (this.state.board[i][j].isBomb) {
                    this.setState(state => state.board[i][j]['nearbyBombs']++)
                }*/

                let newBoard = this.state.board;
                newBoard[i][j].nearbyBombs++;
                this.setState({
                    board: newBoard
                })
            }
        }
        //return test;
    }
    //for every item in array creates cell
    //[[],creates row from array
    //[{randomObj}], creates cell from randomObj
    //[{}, {}, {}] row with 3 cells
    tablerows = (nestedArray) => {
        if (!this.state.board) { return; }//if a board already exist return
        return nestedArray.map((rows, x) => {
            let row = rows.map((cell, y) => <td id={`${x}-${y}`} onClick={(e) => { this.cellClick(e) }}>
                {`${this.state.board[x][y].whatToShow}`
                }
                { this.state.board[x][y].nearbyBombs}
                { `${this.state.board[x][y].isBomb}`}
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
        //todo get hasBennClicked to change from false to true onclick
        console.log(cellClicked);
        if (cellClicked.hasBeenClicked) {
            return;
        } else {
            let newBoard = this.state.board;
            newBoard[ID[0]][ID[1]].hasBeenClicked = true;
            this.setState({
                board: newBoard
            })
        }
        //what toDO 
        //1.    if is a bomb, setstate screen of cell to bomb
        /*
        if(this.state.board[ID[0]][ID[1]].isBomb) {
            this.setState(state => state.board[ID[0]][ID[1]].whatToShow: '*')
        }
        */
        //2.    if its not a bomb and the nighbor bombs === 0 
        //setState of faceCelll to blank

        //3.    else set state to the neighborBomb number

        if (this.state.board[ID[0]][ID[1]].isBomb) {
            this.setState(state => state.bombsDiscovered++)
        }

        if (this.state.bombsOnBoard === this.state.bombsDiscovered) {
            alert('youve kinda won')
        }
    }

    render() {

        return (
            <div
            //toDo want to disable context menu, but I still need to to things with right click
            //onContextMenu={
            //(e)=> e.preventDefault()}
            >
                <div>Bombs on Board {this.state.bombsOnBoard}</div>
                <div>Bombs Ive Discovered {this.state.bombsDiscovered}</div>
                <button onClick={() => {this.getBoardReady(); this.countNearbyBombs(this.state.idsOfBombs)}}></button>

                <table><tbody>{this.tablerows(this.state.board)}</tbody></table>
            </div>
        )
    }
}



/* might need for later
getNearbyIds(stringId) {
    let Id = this.stringToId(stringId);
    let test = [];

    const x = Id[0];
    const y = Id[1];

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            //if it dont exist, move on
            if (!this.state.board[i] || !this.state.board[i][j]) { continue; }
            //dont put the box you clicked on the array of ids that represent the surrounding ids
            if (i === x && j === y) { continue; }

            test.push(`${i}-${j}`)

            this.state.board[][]
        }
    }
    return test;
}
*/