'use client'

import { useEffect, useState, useCallback } from "react";

export default function Highscore() {

    const maxNumTeams = 30;

    const [data, setData] = useState(undefined);
    const fetchData = useCallback(async () => {
		let response = await fetch("https://api.trickycity.com/juspuzzle/teams");
		response = await response.json();

		setData(response);
	}, [setData]);

    useEffect(() => {
        fetchData().catch(console.error);
    }, [fetchData]);

    if (data) {
        const teams = data['teams'];

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

        let finalScores = [];
        for(let i = 0;i < maxNumTeams;i++) {
            if (i < teams.length) {
                finalScores[i] = {
                    ...teams[i],
                    rank: i + 1
                };
            } else {
                finalScores[i] = {
                    rank: i + 1,
                    name: undefined,

                };
            }

        }

        return <div>
            <h1 style={{textAlign: 'center', paddingBottom: '10px'}}>Highscores</h1>
            <div style={{display: 'flex', flexDirection: 'column', gap: '3px'}}>
                { finalScores.map(team => {
                    return <div key={team['rank']} style={{display: 'flex', gap: '5px'}}>
                        <span style={{width: '22px', display: 'inline-block', textAlign: 'right'}}>{team['rank']}.</span>
                        <span style={{width: '200px', flexGrow: '1', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{team['name'] === undefined ? '' : team['name']}</span>
                        <span style={{fontFamily: "monospace"}}>{team['isFinished'] ? msToTime(team['duration']) : '--:--:--'}</span>
                    </div>;
                })}
            </div>
        </div>;
    } else {
        return "Loading highscores";
    }
}

var pad_array = function(arr,len,fill) {
    return arr.concat(Array(len).fill(fill)).slice(0,len);
}

function msToTime(duration) {
    // var milliseconds = Math.floor((duration % 1000) / 100),
    var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}