'use client'

import { Flipper, Flipped } from 'react-flip-toolkit'

export default function Highscore({teams} = props) {

    const maxNumTeams = 30;

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
        <h1 style={{textAlign: 'center', paddingBottom: '10px'}}>Ranking</h1>
        <div style={{display: 'flex', flexDirection: 'column', gap: '3px'}}>
            <Flipper flipKey={finalScores.map(fs => JSON.stringify(fs)).join('')}>
            { finalScores.map(team => {
                return <Flipped key={team['rank']} flipId={team['name']}>
                    <div style={{display: 'flex', gap: '5px'}}>
                        <span style={{width: '22px', display: 'inline-block', textAlign: 'right'}}>{team['rank']}.</span>
                        <span style={{width: '300px', flexGrow: '1', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{team['name'] === undefined ? '' : team['name']}</span>
                        <span style={{fontFamily: "monospace"}}>{team['duration'] < Number.MAX_SAFE_INTEGER ? msToTime(team['duration']) : '--:--:--'}</span>
                    </div>
                </Flipped>;
            })}
            </Flipper>
        </div>
    </div>;
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