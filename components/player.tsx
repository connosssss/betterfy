import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

interface PlayerProps {
  accessToken: string;
}

interface PlayerState {
  device: any;
  item: {
    id: string;
    album: {
      images: { url: string }[];
    };
    name: string;
    artists: { name: string }[];
    duration_ms: number;
  };
  is_playing: boolean;
  progress_ms: number;
}



const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ColorThief = dynamic(() => import('colorthief'), { ssr: false });

export default function Player({ accessToken }: PlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bg, setBg] = useState('#1a1a1a');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const colorThiefRef = useRef<any>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [isSeeking, setSeeking] = useState(false);

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

  const progressPercentage = (localProgress / (playerState?.item?.duration_ms || 1)) * 100;
  
  // Use effects
  useEffect(() => {
    if (accessToken) {
      getPlayerState();
      //idk if making it faster ups api usage or if that is really a problem rn
      const interval = setInterval(getPlayerState, 100);
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

  useEffect(() => {
    if (playerState?.is_playing && !isSeeking) {
      const interval = setInterval(() => {
        setLocalProgress(prev => prev + 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playerState?.is_playing, isSeeking]);
  
  useEffect(() => {
    if (playerState?.progress_ms && !isSeeking) {
      setLocalProgress(playerState.progress_ms);
    }
  }, [playerState?.progress_ms]);





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
      window.open(songUrl);
    }
  };
  
  const handlePlayPause = async () => {
    try {
      await spotifyFetch(`/me/player/${playerState?.is_playing ? 'pause' : 'play'}`, 'PUT');
      setIsPlaying(!playerState?.is_playing);
    } catch (error) {
      console.error('Error pausing:', error);
    }
  };
  
  const handleSeek = async (position: number) => {
    try {
      await spotifyFetch(`/me/player/seek?position_ms=${position}`, 'PUT');
      setLocalProgress(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };
  
  const handleSkip = async (direction: 'next' | 'previous') => {
    try {
      await spotifyFetch(`/me/player/${direction}`, 'POST');
      await getPlayerState();
    } catch (error) {
      console.error(`Error skipping ${direction}:`, error);
    }
  };

  if (!playerState?.device) return <div className='w-screen text-center'>No active device</div>;

  // !!!!! Possible need to change text color based on that of the backgroujnd
  // ALSO need to add in bug fixing to make it so it doesnt result in API error when spamming click on controls
  
  return (
    <div className="transition-colors duration-1000 ease-in-out h-screen w-full" style={{ backgroundColor: bg }}>
      {playerState.item && (
        <div className='flex flex-col items-center justify-center'>
          
          <img ref={imgRef} src={playerState.item.album.images[0].url} width={500} height={500}  
           className='rounded-xl mt-10 shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out'
            onLoad={getColor} crossOrigin="anonymous"
            onClick={handleClick}
          />
          <div className='mt-5 text-center'>
            <div className='text-5xl font-atkinson-hyperlegible p-3'>{playerState.item.name}</div>
            <div className='text-xl font-atkinson-hyperlegible'>{playerState.item.artists[0].name}</div>
          </div>
          
        

  <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-20 backdrop-blur-3xl rounded-sm">
    <div className="max-w-4xl mx-auto">
   
      <div className="flex items-center gap-4 mb-4 mt-5">
       <span className="text-white text-sm font-atkinson-hyperlegible">
          {formatTime(localProgress)}
       </span>
       <div className="relative w-full h-2 bg-white bg-opacity-20 rounded-lg">
          <div 
            className="absolute top-0 left-0 h-full bg-white rounded-lg transition-all duration-300"
            style={{ width: `${progressPercentage}%` }} />
          <input
            type="range"
            min={0}
            max={playerState?.item?.duration_ms || 0}
            value={localProgress}
            
            onChange={(e) => {
              setSeeking(true);
              setLocalProgress(Number(e.target.value));
            }}

            onMouseUp={() => {
              handleSeek(localProgress);
              setSeeking(false);
            }}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
       <span className="text-white text-sm font-atkinson-hyperlegible">
         {formatTime(playerState?.item?.duration_ms || 0)}
       </span>
      </div>
      
     <div className="flex items-center justify-center gap-20 mb-5">
       <button
         onClick={() => handleSkip('previous')}
         className="pt-3 pb-3 pl-4 pr-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors text-xl"
       >⏮</button>
       <button
         onClick={handlePlayPause}
         className="pt-3 pb-3 pl-4 pr-4  hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors text-xl"
       >{playerState?.is_playing ? '⏸' : '▶'}</button>
       <button
         onClick={() => handleSkip('next')}
         className="pt-3 pb-3 pl-4 pr-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors text-xl"
       >⏭</button>
     </div>
   </div>
  </div>
          
   </div>
      )}
    </div>
  );
}