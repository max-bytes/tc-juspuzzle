'use client'

import PuzzleAdmin from "./PuzzleAdmin";
import styles from "../page.module.css";
import { useEffect, useState, useCallback } from "react";

export default function Home() {

  const [solvedPuzzles, setSolvedPuzzles] = useState(undefined);
  const fetchSolvedPuzzles = useCallback(async () => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/solved_puzzles");
    response = await response.json();
    setSolvedPuzzles(response);
  }, [setSolvedPuzzles]);
  useEffect(() => {
    fetchSolvedPuzzles().catch(console.error);
  }, [fetchSolvedPuzzles]);

  const onSolveF = useCallback(async (puzzleID) => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: puzzleID }),
    });
    await fetchSolvedPuzzles();
  }, []);
  
  const onUnsolveF = useCallback(async (puzzleID) => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/unsolve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: puzzleID }),
    });
    await fetchSolvedPuzzles();
  }, []);

  if (solvedPuzzles) {
    return (
      <div>
        <h1 style={{textAlign: 'center'}}>Admin</h1>
        <PuzzleAdmin solvedPuzzles={solvedPuzzles} onSolveF={onSolveF} onUnsolveF={onUnsolveF} />
      </div>
    );
  } else {
    return (<div>Loading</div>);
  }
}
