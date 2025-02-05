import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

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

const ColorThief = dynamic(() => import('colorthief'), { ssr: false });

export default function Player({ accessToken }: PlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bg, setBg] = useState('#1a1a1a');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const colorThiefRef = useRef<any>(null);

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
      getPlayerState();
      const interval = setInterval(getPlayerState, 1000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  useEffect(() => {
    const loadColorThief = async () => {
      const module = await import('colorthief');
      colorThiefRef.current = new module.default();
    };
    loadColorThief();
  }, []);

  //Color
  const getColor = () => {
    if (imgRef.current && colorThiefRef.current) {
      //Color thief for now works buy may want to use something else in the future to get colors
      try {
        const color = colorThiefRef.current.getColor(imgRef.current);
        const hexColor = rgbToHex(color[0], color[1], color[2]);
        setBg(hexColor);
      } catch (error) {
        console.error('Error extracting color:', error);
      }
    }
  };
    //copied/can change if needed but dont think it doesnt work 
  const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  //PlayerState
  const getPlayerState = async () => {
    try {
      const state = await spotifyFetch('/me/player');
      setPlayerState(state);
      setIsPlaying(state?.is_playing);
    } catch (error) {
      console.error('Error with player state:', error);
    }
  };

  const handleClick = () => {
    if (playerState?.item) {
      const songUrl = `https://open.spotify.com/track/${playerState.item.id}`;
      window.open(songUrl, '_blank');
    }
  };

  if (!playerState?.device) return <div className='w-screen text-center'>No active device</div>;
  // !!!!! Possible need to change text color based on that of the backgroujnd
  return (
    <div className="transition-colors duration-1000 ease-in-out h-screen w-full" style={{ backgroundColor: bg }}>
      {playerState.item && (
        <div className='flex flex-col items-center justify-center'>
          <img ref={imgRef} src={playerState.item.album.images[0].url} width={550} height={550}  
           className='rounded-xl mt-10 shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out'
            onLoad={getColor} crossOrigin="anonymous"
            onClick={handleClick}
          />
          <div className='mt-5 text-center'>
            <div className='text-5xl font-atkinson-hyperlegible p-3'>{playerState.item.name}</div>
            <div className='text-xl font-atkinson-hyperlegible'>{playerState.item.artists[0].name}</div>
          </div>
        </div>
      )}
    </div>
  );
}