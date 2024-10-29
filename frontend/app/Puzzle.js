'use client'

import styles from "./page.module.css";
import { useEffect, useState } from "react";

// const numFigures = 3;
// const gridFigureIndices = [
//     [0,0,1],
//     [0,1,1],
//     [2,2,2],
// ]
// const correctGridNumbers = [
//     [3,3,4],
//     [3,4,4],
//     [5,5,5],
// ]
// const initialGridNumbers = Array(3).fill(Array(3).fill(undefined))

const numFigures = 30;
const gridFigureIndices = [
    [1,2,2,3,3,4,4,5,5,5],
    [1,2,2,3,4,4,4,5,5,5],
    [1,2,6,6,6,6,6,6,7,5],
    [1,1,8,6,9,9,9,9,7,5],
    [10,11,8,8,8,8,8,9,7,7],
    [10,11,12,13,13,8,8,9,7,14],
    [10,11,12,13,13,13,15,9,14,14],
    [10,11,12,12,12,15,15,14,14,14],
    [10,11,11,11,12,15,15,15,14,16],
    [17,11,11,11,18,15,15,18,14,16],
    [17,11,17,17,18,18,18,18,16,16],
    [17,17,17,19,18,20,20,18,16,16],
    [19,19,19,19,20,20,20,20,16,16],
    [19,19,19,19,21,20,20,21,22,22],
    [19,23,24,24,21,21,21,21,22,22],
    [23,23,23,24,25,25,26,26,26,22],
    [23,23,24,24,24,25,25,26,26,22],
    [23,27,28,24,25,25,25,25,26,26],
    [27,27,28,28,28,29,25,29,30,30],
    [27,27,27,28,28,29,29,29,30,30],

]
const correctGridNumbers = [
    [2,3,4,3,1,4,4,9,8,9],
    [4,2,8,5,5,4,3,2,7,8],
    [7,2,6,3,3,5,4,3,6,3],
    [1,3,3,4,4,4,5,1,8,5],
    [6,7,7,5,5,2,2,3,4,2],
    [6,8,9,8,6,3,1,2,9,6],
    [3,9,8,9,7,4,1,4,9,7],
    [4,6,9,7,2,6,5,6,8,3],
    [9,7,4,8,1,7,6,8,7,7],
    [8,5,3,6,1,8,9,1,1,8],
    [7,6,4,9,3,9,8,3,3,1],
    [5,4,5,5,2,1,7,1,5,7],
    [6,7,6,8,4,2,9,4,6,6],
    [7,4,7,2,7,3,2,5,2,5],
    [1,3,6,6,8,4,3,1,3,4],
    [2,4,5,1,1,5,2,1,2,2],
    [3,7,1,4,2,6,4,2,5,1],
    [4,8,2,6,1,7,5,4,6,1],
    [5,9,3,5,3,9,3,7,7,7],
    [6,8,4,8,4,3,6,8,1,9],
]
const initialGridNumbers = Array(20).fill(Array(10).fill(undefined))

function Cell({width, height, figureIndex, neighborFigureIndices, tabIndex, gridNumber, isCorrect, updateGridNumber} = props) {

    const handleOnKeyPressed = (e) => {
        // console.log(e);
        
        if (!(isNaN(e.key) || e.key === null || e.key === ' '))
        {
            const key = Number(e.key);
            updateGridNumber(key);
        }
    };

    const neighborSameFigure = neighborFigureIndices.map(nfi => nfi === figureIndex);
    const borders = neighborSameFigure.map(nsf => nsf ? "none" : "2px solid black");
    const paddings = neighborSameFigure.map(nsf => nsf ? "2px" : "0px");
    const correctClass = isCorrect ? styles.correct : styles.incorrect;

    return <div onKeyDown={handleOnKeyPressed} className={`${styles.cell} ${correctClass}`} tabIndex={tabIndex} style={{width: `${width}px`, height: `${height}px`, display: "inline-flex", justifyContent: 'center', alignItems: 'center', margin: "-1px",
        borderTop: borders[0], borderRight: borders[1], borderBottom: borders[2], borderLeft: borders[3],
        paddingTop: paddings[0], paddingRight: paddings[1], paddingBottom: paddings[2], paddingLeft: paddings[3] }}>
        {gridNumber ?? '\u00A0'}
    </div>;
}

export default function Puzzle({teams, onSolvedF} = props) {

    const [currentGridNumbers, setCurrentGridNumbers] = useState(initialGridNumbers);
    const correctFigures = Array.apply(null, Array(numFigures)).map(function (x, i) { return teams.findIndex(t => t.id === i + 1 && t.isFinished) !== -1; });

    // useEffect(() => {
    //     setCorrectFigures(old => {
    //         let newNumbers = Array.apply(null, Array(numFigures)).map(function (x, i) { return true; });
    //         for(var index = 0;index < numFigures;index++) {
    //             let myContinue = false;
    //             for(let y = 0;y < gridFigureIndices.length && !myContinue;y++) {
    //                 for(let x = 0;x < gridFigureIndices[y].length && !myContinue;x++) {
    //                     if (gridFigureIndices[y][x] == index && currentGridNumbers[y][x] != correctGridNumbers[y][x])
    //                     {
    //                         newNumbers[index] = false;
    //                         myContinue = true;
    //                     }
    //                 }
    //             }
    //         }

    //         return newNumbers;
    //     });
    // }, [currentGridNumbers, setCorrectFigures]);

    useEffect(() => {
        for(var index = 0;index < numFigures;index++) {

            if (correctFigures[index]) // figure already solved
                continue;

            let isCorrect = true;
            for(let y = 0;y < gridFigureIndices.length && isCorrect;y++) {
                for(let x = 0;x < gridFigureIndices[y].length && isCorrect;x++) {
                    if (gridFigureIndices[y][x] == index + 1 && currentGridNumbers[y][x] != correctGridNumbers[y][x])
                        isCorrect = false;
                }
            }

            if (isCorrect) {
                onSolvedF(index + 1);
            }
        }
    }, [currentGridNumbers, onSolvedF]);

    const width=80;
    const height=40;
    
    let rows = [];
    for(let y = 0;y < gridFigureIndices.length;y++) {
        let rowCells = [];
        for(let x = 0;x < gridFigureIndices[y].length;x++) {
            const matrixIndex = y * gridFigureIndices[y].length + x;
            const figureIndex = gridFigureIndices[y][x];
            rowCells.push(<Cell tabIndex={matrixIndex} key={matrixIndex} 
                width={width} height={height} 
                figureIndex={figureIndex} 
                neighborFigureIndices={[gridFigureIndices[y - 1]?.[x],gridFigureIndices[y]?.[x + 1],gridFigureIndices[y + 1]?.[x],gridFigureIndices[y]?.[x - 1]]}
                gridNumber={currentGridNumbers[y][x]}
                isCorrect={correctFigures[figureIndex - 1]}
                updateGridNumber={(newNumber) => {
                    setCurrentGridNumbers(oldNumbers => {
                        let newGridNumbers = currentGridNumbers.map(function(arr) {
                            return arr.slice();
                        });
                        newGridNumbers[y][x] = newNumber;
                        return newGridNumbers;
                    })
                }} />);
        }
        rows.push(<div key={y} style={{whiteSpace: 'nowrap', minWidth: '0px'}}>{rowCells}</div>);
    }

    return <div className={styles.puzzle} style={{width: `${(width - 2) * gridFigureIndices[0].length}px`, height: `${(height - 2) * gridFigureIndices.length}px`}}>
        {rows}
    </div>;
}