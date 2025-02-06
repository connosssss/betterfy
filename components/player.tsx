import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX, Volume1,
  Play, Pause, SkipBack, SkipForward } from 'lucide-react';

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
  const [volume, setVolume] = useState(50);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);

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
      //nvm it is api error 429
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

  useEffect(() => {
    if (playerState?.is_playing && !isSeeking) {
      const interval = setInterval(() => {
        setLocalProgress(prev => prev + 100);
      }, 100);
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

  const handleVolumeChange = async (newVolume: number) => {
    try {
      setVolume(newVolume);
      await spotifyFetch(`/me/player/volume?volume_percent=${newVolume}`, 'PUT');
    } catch (error) {
      console.error('Error changing volume:', error);
    }
  };

  if (!playerState?.device) return <div className='w-screen text-center'>No active device</div>;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  // !!!!! Possible need to change text color based on that of the backgroujnd
  // ALSO need to add in bug fixing to make it so it doesnt result in API error when spamming click on controls
  // Also need to add in dynamic height changing
  
  return (
    <div className="transition-colors duration-1000 ease-in-out h-screen w-full" style={{ backgroundColor: bg }}>
      {playerState.item && (
        <div className='flex flex-col items-center justify-center h-full'>
          <div className=' w-full h-[90%] top-0 fixed'>
          {middleImageyTitle()}
          </div>
        
          <div className="w-screen fixed bottom-0 left-0 right-0 h-[10%] bg-black bg-opacity-20 backdrop-blur-3xl rounded-sm ">
          {bottomBar()}
          </div>

      </div>
      )}
    </div>
  );


  //Different parts (should maybe make in different folders)
  function middleImageyTitle() {
    return <div className=' flex flex-col items-center justify-center'>
      <img ref={imgRef} src={playerState.item.album.images[0].url} 
        className='rounded-xl mt-16 shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out h-1/4 w-1/4'
        onLoad={getColor} crossOrigin="anonymous"
        onClick={handleClick} />
      <div className='mt-5 text-center'>
        <div className='text-5xl font-atkinson-hyperlegible p-3'>{playerState.item.name}</div>
        <div className='text-xl font-atkinson-hyperlegible'>{playerState.item.artists[0].name}</div>
      </div>
    </div>;
  }

  function bottomBar() {
    return <div className="max-w-4xl mx-auto">

        {progressBar()}


        <div className='flex justify-content-center'>
          {volumeController()}

          {songController()}
        </div>
      </div>;
    
  }

  function progressBar() {
    return <div className="flex items-center gap-4 mb-2 mt-3">
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
          } }

          onMouseUp={() => {
            handleSeek(localProgress);
            setSeeking(false);
          } }
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
      <span className="text-white text-sm font-atkinson-hyperlegible">
        {formatTime(playerState?.item?.duration_ms || 0)}
      </span>
    </div>;
  }

  function volumeController() {
    return <div className="relative flex items-center gap-2 mb-5 "
      onMouseEnter={() => setIsVolumeVisible(true)}
      onMouseLeave={() => setIsVolumeVisible(false)}>
      <button
        className="text-white hover:bg-white hover:bg-opacity-10 rounded-full p-2 transition-colors"
        onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
      >
        <VolumeIcon size={20} />
      </button>
      <div className={`relative w-24 h-2 bg-white bg-opacity-20 rounded-lg ${isVolumeVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-lg transition-all duration-300"
          style={{ width: `${volume}%` }}
        ></div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => handleVolumeChange(Number(e.target.value))}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
      </div>
    </div>;
  }

  function songController() {
    return <div className="flex items-center justify-center gap-20 mb-5 pl-3 ml-40 ">

      <button
        onClick={() => handleSkip('previous')}
        className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors text-white align-middle"
      >
        <SkipBack size={15} />
      </button>
      <button
        onClick={handlePlayPause}
        className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors text-white"
      >
        {playerState?.is_playing ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <button
        onClick={() => handleSkip('next')}
        className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors text-white"
      >
        <SkipForward size={15} />
      </button>
    </div>;
  }
}