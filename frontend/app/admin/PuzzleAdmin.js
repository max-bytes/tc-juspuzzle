'use client'

import styles from "../page.module.css";
import { cellTypes, gridFigureIndices, numFigures } from "../Puzzle";

function Cell({width, height, figureIndex, neighborFigureIndices, tabIndex, isCorrect, type, toggle} = props) {

    const neighborSameFigure = neighborFigureIndices.map(nfi => nfi === figureIndex);
    const borders = neighborSameFigure.map(nsf => nsf ? "none" : "4px solid black");
    const paddings = neighborSameFigure.map(nsf => nsf ? "4px" : "0px");
    const correctClass = isCorrect ? styles['correct-admin'] : styles.incorrect;
    const typeClass = styles[`type${type}`];

    return <button onClick={toggle} className={`${styles.cell} ${correctClass} ${typeClass}`} tabIndex={tabIndex} style={{width: `${width}px`, height: `${height}px`, display: "inline-flex", justifyContent: 'center', alignItems: 'center', margin: "-1px",
        borderTop: borders[0], borderRight: borders[1], borderBottom: borders[2], borderLeft: borders[3],
        paddingTop: paddings[0], paddingRight: paddings[1], paddingBottom: paddings[2], paddingLeft: paddings[3] }}>
        {'\u00A0'}
    </button>;
}

export default function PuzzleAdmin({solvedPuzzles, onSolveF, onUnsolveF} = props) {
    const correctFigures = Array.apply(null, Array(numFigures)).map(function (x, i) { return solvedPuzzles.findIndex(t => t === i + 1) !== -1; });

    const width=40;
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
                isCorrect={correctFigures[figureIndex - 1]}
                type={cellTypes[y][x]}
                toggle={() => {
                    if (correctFigures[figureIndex - 1])
                        onUnsolveF(figureIndex);
                    else
                        onSolveF(figureIndex);
                }}
            />);
        }
        rows.push(<div key={y} style={{whiteSpace: 'nowrap', minWidth: '0px'}}>{rowCells}</div>);
    }

    return <div className={styles.puzzle} style={{width: `${(width - 2) * gridFigureIndices[0].length}px`, height: `${(height - 2) * gridFigureIndices.length}px`}}>
        {rows}
    </div>;
}