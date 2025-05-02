'use client'

import Highscore from "./Highscore";
import styles from "./page.module.css";
import Puzzle from "./Puzzle";

import { useEffect, useState, useCallback } from "react";

export default function Home() {

  const [teamData, setTeamData] = useState(undefined);
  const fetchTeamData = useCallback(async () => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/teams");
    response = await response.json();
    setTeamData(response);
  }, [setTeamData]);
  const [solvedPuzzles, setSolvedPuzzles] = useState(undefined);
  const fetchSolvedPuzzles = useCallback(async () => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/solved_puzzles");
    response = await response.json();
    setSolvedPuzzles(response);
  }, [setSolvedPuzzles]);
  useEffect(() => {
    fetchTeamData().catch(console.error);
    fetchSolvedPuzzles().catch(console.error);
  }, [fetchTeamData, fetchSolvedPuzzles]);

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

  // update team data continuously
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTeamData().catch(console.error);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (teamData && solvedPuzzles) {
    let teams = teamData.teams;
    for(const team of teams) {
        team['startTimeDate'] = new Date(team['startTime']);
        if (team['endTime']) {
            team['endTimeDate'] = new Date(team['endTime']);
            team['duration'] = team['endTimeDate'].getTime() - team['startTimeDate'].getTime();
        } else {
            team['duration'] = Number.MAX_SAFE_INTEGER;
        }
    }

    teams.sort(function(a,b) {
        return a['duration'] - b['duration'];
    });

    return (
      <div className={styles.page}>
        <Puzzle solvedPuzzles={solvedPuzzles} onSolvedF={onSolvedF} />
        <Highscore teams={teams} />
      </div>
    );
  } else {
    return (<div className={styles.page}>Loading</div>);
  }
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i >= 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}