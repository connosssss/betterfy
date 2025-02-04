import { useEffect, useState } from 'react';

export default function Player({ accessToken }) {

  const [playerState, setPlayerState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const spotifyFetch = async (endpoint, method = 'GET', body = null) => {

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {

      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : null,
    });
    
    if (method !== 'PUT' && method !== 'POST') {
      return response.json();
    }
  }

  useEffect(() => {
    if (accessToken) {
      getPlayerState()
      const interval = setInterval(getPlayerState, 1000);
      return () => clearInterval(interval);
    }
  }, [accessToken])

  const getPlayerState = async () => {
    try {
      const state = await spotifyFetch('/me/player');
      setPlayerState(state);
      setIsPlaying(state?.is_playing);
    } catch (error) {
      console.error('Error with player state:', error);
    }
  }

  

 

  if (!playerState?.device) return <div>No active device</div>

  return (
    <div>
      {playerState.item && (
        <div>
          <img src={playerState.item.album.images[0].url} width={300} height={300}/>
          <div>
            <div>{playerState.item.name}</div>
            <div>{playerState.item.artists[0].name}</div>
          </div>
        </div>
      )}
      
    </div>
  )
}