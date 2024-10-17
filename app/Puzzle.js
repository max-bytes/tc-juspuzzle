'use client'

import styles from "./page.module.css";
import { useEffect, useState } from "react";

const numFigures = 3;

const gridFigureIndices = [
    [0,0,1],
    [0,1,1],
    [2,2,2],
]

const correctGridNumbers = [
    [3,3,4],
    [3,4,4],
    [5,5,5],
]

const initialGridNumbers = [
    [undefined,undefined,undefined],
    [undefined,undefined,undefined],
    [undefined,undefined,undefined],
]

function Cell({row, col, figureIndex, neighborFigureIndices, tabIndex, gridNumber, isCorrect, updateGridNumber} = props) {

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

    return <div onKeyDown={handleOnKeyPressed} className={`${styles.cell} ${correctClass}`} tabIndex={tabIndex} style={{width: "100px", height: "100px", display: "inline-flex", justifyContent: 'center', alignItems: 'center', margin: "-1px",
        borderTop: borders[0], borderRight: borders[1], borderBottom: borders[2], borderLeft: borders[3],
        paddingTop: paddings[0], paddingRight: paddings[1], paddingBottom: paddings[2], paddingLeft: paddings[3] }}>
        {gridNumber ?? '\u00A0'}
    </div>;
}

export default function Puzzle() {

    const [currentGridNumbers, setCurrentGridNumbers] = useState(initialGridNumbers);
    const [correctFigures, setCorrectFigures] = useState(Array.apply(null, Array(numFigures)).map(function (x, i) { return false; }));

    useEffect(() => {
        setCorrectFigures(old => {
            let newNumbers = Array.apply(null, Array(numFigures)).map(function (x, i) { return true; });
            for(var index = 0;index < numFigures;index++) {
                let myContinue = false;
                for(let y = 0;y < gridFigureIndices.length && !myContinue;y++) {
                    for(let x = 0;x < gridFigureIndices[y].length && !myContinue;x++) {
                        if (gridFigureIndices[y][x] == index && currentGridNumbers[y][x] != correctGridNumbers[y][x])
                        {
                            newNumbers[index] = false;
                            myContinue = true;
                        }
                    }
                }
            }

            return newNumbers;
        });
    }, [currentGridNumbers, setCorrectFigures]);
    
    let rows = [];
    for(let y = 0;y < gridFigureIndices.length;y++) {
        let rowCells = [];
        for(let x = 0;x < gridFigureIndices[y].length;x++) {
            const matrixIndex = y * gridFigureIndices[y].length + x;
            const figureIndex = gridFigureIndices[y][x];
            rowCells.push(<Cell tabIndex={matrixIndex} key={matrixIndex} 
                row={y} col={x} 
                figureIndex={figureIndex} 
                neighborFigureIndices={[gridFigureIndices[y - 1]?.[x],gridFigureIndices[y]?.[x + 1],gridFigureIndices[y + 1]?.[x],gridFigureIndices[y]?.[x - 1]]}
                gridNumber={currentGridNumbers[y][x]}
                isCorrect={correctFigures[figureIndex]}
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
        rows.push(<div key={y}>{rowCells}</div>);
    }

    return <div className={styles.puzzle}>
        {rows}
    </div>;
}