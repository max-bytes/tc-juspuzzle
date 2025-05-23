'use client'

import styles from "./page.module.css";
import { useEffect, useState, useLayoutEffect } from "react";

export const numFigures = 30;
export const gridFigureIndices = [
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
export const correctGridNumbers = [
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
export const cellTypes = [
    [3,3,3,3,3,3,3,3,3,4],
    [2,2,2,2,2,2,2,2,2,4],
    [2,1,1,1,1,1,1,1,1,4],
    [2,4,1,4,4,4,4,4,4,4],
    [2,2,1,2,2,2,2,2,2,4],
    [2,1,1,1,1,1,1,1,1,4],
    [2,3,1,3,3,4,3,3,3,4],
    [2,4,1,4,4,4,4,4,4,4],
    [1,1,1,1,1,4,1,1,1,4],
    [1,3,3,3,3,4,3,3,3,3],
    [1,2,2,2,2,4,2,2,2,3],
    [1,4,4,4,4,4,4,3,4,3],
    [4,1,1,1,1,1,1,3,1,3],
    [4,2,2,2,2,2,2,3,2,2],
    [4,4,4,4,4,4,4,3,4,4],
    [4,3,3,3,2,3,3,3,3,3],
    [4,1,1,1,2,1,1,3,1,1],
    [4,3,3,3,2,3,3,3,3,3],
    [4,2,2,2,2,2,2,3,2,3],
    [4,4,4,4,2,4,4,3,4,3],
]

function Cell({width, height, figureIndex, neighborFigureIndices, tabIndex, gridNumber, isCorrect, updateGridNumber, type, wiggle} = props) {

    const handleOnKeyPressed = (e) => {
        // console.log(e);
        
        if (!(isNaN(e.key) || e.key === null || e.key === ' '))
        {
            const key = Number(e.key);
            updateGridNumber(key);
        }
    };

    const neighborSameFigure = neighborFigureIndices.map(nfi => nfi === figureIndex);
    const borders = neighborSameFigure.map(nsf => nsf ? "none" : "4px solid black");
    const paddings = neighborSameFigure.map(nsf => nsf ? "4px" : "0px");
    const correctClass = isCorrect ? styles.correct : styles.incorrect;
    const hasNumberClass = gridNumber ? styles.hasNumber : undefined;
    const typeClass = styles[`type${type}`];
    const wiggleClass = wiggle ? undefined : styles.wiggled;

    return <div onKeyDown={handleOnKeyPressed} className={`${styles.cell} ${correctClass} ${hasNumberClass} ${typeClass} ${wiggleClass}`} tabIndex={tabIndex} style={{width: `${width}px`, height: `${height}px`, display: "inline-flex", justifyContent: 'center', alignItems: 'center', margin: "-1px",
        borderTop: borders[0], borderRight: borders[1], borderBottom: borders[2], borderLeft: borders[3],
        paddingTop: paddings[0], paddingRight: paddings[1], paddingBottom: paddings[2], paddingLeft: paddings[3] }}>
        {gridNumber ?? '\u00A0'}
    </div>;
}

export default function Puzzle({solvedPuzzles, onSolvedF} = props) {

    const initialGridNumbers = Array(20).fill(Array(10).fill(undefined))
    const [currentGridNumbers, setCurrentGridNumbers] = useState(initialGridNumbers);
    const correctFigures = Array.apply(null, Array(numFigures)).map(function (x, i) { return solvedPuzzles.findIndex(t => t === i + 1) !== -1; });
    const allCorrect = correctFigures.length === numFigures && correctFigures.every((v) => v === true);
    const [wiggle, setWiggle] = useState(false);
    useEffect(() => {
        if (wiggle)
            setWiggle(false);
    }, [wiggle, setWiggle]);

    // NOTE: for some reason, useLayoutEffect is needed instead of useEffect to ensure wiggle goes off
    useLayoutEffect(() => {
        let reset = false;
        for(var index = 0;index < numFigures;index++) {

            if (correctFigures[index]) // figure already solved
                continue;

            let isCorrect = true;
            let isFullyFilled = true;
            for(let y = 0;y < gridFigureIndices.length && isFullyFilled;y++) {
                for(let x = 0;x < gridFigureIndices[y].length && isFullyFilled;x++) {
                    if (gridFigureIndices[y][x] == index + 1) {
                        if (currentGridNumbers[y][x] === undefined)
                            isFullyFilled = false;
                        if (currentGridNumbers[y][x] != correctGridNumbers[y][x])
                            isCorrect = false;
                    }
                }
            }

            if (isFullyFilled) {
                if (isCorrect) {
                    onSolvedF(index + 1);
                } else {
                    reset = true;
                }
            }
        }

        if (reset) {
            // reset all grid numbers of incorrectly entered figure
            setCurrentGridNumbers(initialGridNumbers);
            setWiggle(true);
        }
    }, [currentGridNumbers, setCurrentGridNumbers, setWiggle, onSolvedF]);
    
    const width=40;
    const height=40;

    if (allCorrect) {
        return <div className={styles.puzzle} style={{width: `${(width - 2) * gridFigureIndices[0].length}px`, height: `${(height - 2) * gridFigureIndices.length}px`,
            display: "flex", justifyContent: 'center', alignItems: 'center', margin: "auto"}}>
            <div style={{backgroundColor: '#000000cc', padding: '20px', borderRadius: '20px', fontSize: '60px', textAlign: 'center', color: '#00cc00'}}>Zugriff auf alle Dateien wiederhergestellt!</div>
        </div>;
    } else {
        let rows = [];
        for(let y = 0;y < gridFigureIndices.length;y++) {
            let rowCells = [];
            for(let x = 0;x < gridFigureIndices[y].length;x++) {
                const matrixIndex = y * gridFigureIndices[y].length + x;
                const figureIndex = gridFigureIndices[y][x];
                rowCells.push(<Cell tabIndex={matrixIndex} key={matrixIndex} 
                    width={width} height={height} 
                    figureIndex={figureIndex}
                    wiggle={wiggle}
                    neighborFigureIndices={[gridFigureIndices[y - 1]?.[x],gridFigureIndices[y]?.[x + 1],gridFigureIndices[y + 1]?.[x],gridFigureIndices[y]?.[x - 1]]}
                    gridNumber={currentGridNumbers[y][x]}
                    isCorrect={correctFigures[figureIndex - 1]}
                    type={cellTypes[y][x]}
                    updateGridNumber={(newNumber) => {
                        setCurrentGridNumbers(oldNumbers => {
                            let newGridNumbers = oldNumbers.map(function(arr) {
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
}