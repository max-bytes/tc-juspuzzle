'use client'

import { useEffect, useState, useCallback } from "react";

export default function Highscore() {

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
    
        // TODO: order by time
        
        return <div>
            <h1>Highscores</h1>
            { teams.map(team => {
                return <div key={team['id']}>{team['id']} {team['name']}</div>;
            })}
        </div>;
    } else {
        return "Loading highscores";
    }
}