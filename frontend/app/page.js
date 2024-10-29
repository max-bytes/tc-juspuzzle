'use client'

import Highscore from "./Highscore";
import styles from "./page.module.css";
import Puzzle from "./Puzzle";

import { useEffect, useState, useCallback } from "react";

export default function Home() {

  const [data, setData] = useState(undefined);
  const fetchData = useCallback(async () => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/teams");
    response = await response.json();
    setData(response);
  }, [setData]);
  useEffect(() => {
    fetchData().catch(console.error);
  }, [fetchData]);

  const onSolvedF = useCallback(async (teamID) => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: teamID }),
    });

    await fetchData();
  }, []);

  // debug
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     let d = {
  //       teams: [
  //         {"id": 1, "name": "foo", "startTime": "2024-10-01T00:00:00Z"},
  //         {"id": 2, "name": "foo2", "startTime": "2024-10-01T00:00:00Z"},
  //         {"id": 3, "name": "foo3", "startTime": "2024-10-01T00:00:00Z"},
  //       ]
  //     };
  //     shuffleArray(d.teams);
  //     shuffleArray(d);
  //     setData(d)
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  if (data) {
    let teams = data.teams;
    for(const team of teams) {
        team['startTimeDate'] = new Date(team['startTime']);
        if (team['endTime'] ?? undefined) {
            team['endTimeDate'] = new Date(team['endTime']);
            team['duration'] = team['endTimeDate'].getTime() - team['startTimeDate'].getTime();
            team['isFinished'] = true;
        } else {
            team['duration'] = Number.MAX_SAFE_INTEGER;
        }
    }

    teams.sort(function(a,b) {
        return a['duration'] - b['duration'];
    });

    return (
      <div className={styles.page}>
        <Puzzle teams={teams} onSolvedF={onSolvedF} />
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