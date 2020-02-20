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
        this.setState({
            board: this.createNestedArray(3, 9)
        })

        for (let i = 0; i < this.state.idsOfBombs.length; i++) {
            //doesnt work, is not updating state, line 94
            this.getNearbyIds(this.state.idsOfBombs[i]);
        }
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
        this.setState({
            //keeps track of amount bombs
            bombsOnBoard: countBombs
        })

        this.setState({
            //ids of bombs on board
            idsOfBombs: idsOfBombsHere
        })
        return nestedArray;
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
                if (this.state.board[i][j].isBomb) {
                    this.setState(state => state.board[i][j]['nearbyBombs']++)
                }
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
                { //
                    (this.state.board[x][y].isBomb)
                        ? this.state.screen
                        : this.state.board[x][y].nearbyBombs
                }
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

        console.log('before click ', cellClicked.hasBeenClicked);

        //this.setState({ board[ID[0]][ID[1]]: !this.state.board[ID[0]][ID[1]]['hasBeenClicked'] }

        // this.setState(state => {state.board[ID[0]][ID[1]]: 'clicked'})
        //let reference = board[ID[0]][ID[1]]

        //this.setState( state => {state.board[ID[0]][ID[1]][0]['hasBenenClicked']: true});


        /*this.setState(prevState => ({
            board[ID[0]][ID[1]].hasBeenClicked: !prevState.board[ID[0]][ID[1]].hasBeenClicked
          }))*/
        /*
        this.setState((state, board) => ({
          board[ID[0]][ID[1]]: state.counter + props.increment
        }));*/

        /*
                this.setState(prevState => ({
                    check: !prevState.check
                }));*/
        console.log('after click,', this.state.board[ID[0]][ID[1]]);

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
                <button onClick={this.getBoardReady}></button>

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