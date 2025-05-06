'use client'

import Highscore from "../Highscore";
import styles from "./page.module.css";

import { useEffect, useState, useCallback } from "react";

export default function Home() {

  const [teamData, setTeamData] = useState(undefined);
  const fetchTeamData = useCallback(async () => {
    let response = await fetch("https://api.trickycity.com/juspuzzle/teams");
    response = await response.json();
    setTeamData(response);
  }, [setTeamData]);
  
  useEffect(() => {
    fetchTeamData().catch(console.error);
  }, [fetchTeamData]);

  // update team data continuously
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTeamData().catch(console.error);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (teamData) {
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
        <Highscore teams={teams} />
      </div>
    );
  } else {
    return (<div className={styles.page}>Loading</div>);
  }
}
