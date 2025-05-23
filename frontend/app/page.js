'use client'

import styles from "./page.module.css";
import Puzzle from "./Puzzle";

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

  const onSolvedF = useCallback(async (puzzleID) => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/solve", {
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
      <div className={styles.page}>
        <Puzzle solvedPuzzles={solvedPuzzles} onSolvedF={onSolvedF} />
      </div>
    );
  } else {
    return (<div>Loading</div>);
  }
}
