import { useEffect, useState } from 'react';

interface PlayerProps {
  accessToken: string;
}

interface PlayerState {
  device: any;
  item: {
    album: {
      images: { url: string }[];
    };
    name: string;
    artists: { name: string }[];
  };
  is_playing: boolean;
}

export default function Player({ accessToken }) {

  const [playerState, setPlayerState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const spotifyFetch = async (endpoint: string, method = 'GET', body: any = null) => {
    
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (method !== 'PUT' && method !== 'POST') {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }
  };

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
    } 
    catch (error) {
      console.error('Error with player state:', error);
    }
  }

  


  if (!playerState?.device) return <div>No active device</div>

  return (
    <div>
      {playerState.item && (
        <div className='h-9/10 w-full flex bg-slate-600 flex-col items-center justify-center'>
          <img src={playerState.item.album.images[0].url} width={550} height={550} className='rounded-xl mt-10'/>
          <div className='mt-5 text-center'>
            <div className='text-5xl font-atkinson-hyperlegible p-3'>{playerState.item.name}</div>
            <div className='text-xl font-atkinson-hyperlegible'>By {playerState.item.artists[0].name}</div>
          </div>
        </div>
      )}
      
    </div>
  )
}