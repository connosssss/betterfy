import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX, Volume1,
  Play, Pause, SkipBack, SkipForward, ListMusic } from 'lucide-react';

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
  context?: {
       uri: string;
   };
}

interface QueueItem {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
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
  const [txtColor, setTxtColor] = useState('text-white');
  const colorTransition = 'transition-colors duration-1000 ease-in-out';
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [QueueVisible, setQueueVisible] = useState(false);
  const [playlistTracks, setPlaylistTracks] = useState<string[]>([]);
  
  const spotifyFetch = async (endpoint: string, method = 'GET', body: any = null) => {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok && response.status !== 403){
      throw new Error(`API error: ${response.status}`);
    }

    if (method !== 'PUT' && method !== 'POST') {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    }

    
  };

  const progressPercentage = (localProgress / (playerState?.item?.duration_ms || 1)) * 100;
  
  // Use effects

  //idk if making it faster ups api usage or if that is really a problem rn
      //nvm it is api error 429
  useEffect(() => {
    if (accessToken) {
      getPlayerState();
      getQueue();
      const interval = setInterval(() => {
        getPlayerState();
        getQueue();
      }, 1000);
      return () => clearInterval(interval);
    }}, [accessToken]);


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

  useEffect(() => {

        getPlaylist();

    }, [playerState?.context?.uri]);



  //Color
  const getColor = () => {
    if (imgRef.current && colorThiefRef.current) {
      //Color thief for now works buy may want to use something else in the future to get colors
      try {
        const color = colorThiefRef.current.getColor(imgRef.current);
        const hexColor = rgbToHex(color[0], color[1], color[2]);
        setBg(hexColor);

        const r = color[0] / 255;
        const g = color[1] / 255;
        const b = color[2] / 255;
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const newTxtColor = luminance > 0.7 ? 'text-gray-800' : 'text-white';
        setTxtColor(newTxtColor);
        console.log(txtColor);
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
  const getQueue = async () => {
    try {
      const queueData = await spotifyFetch('/me/player/queue');
      if (queueData.queue) {
        setQueue(queueData.queue);
      }
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const getPlaylist = async () => {
     if (playerState?.context?.uri && playerState.context.uri.startsWith("spotify:playlist:")) {
            const playlistId = playerState.context.uri.split(":")[2];
      try {
        const data = await spotifyFetch(`/playlists/${playlistId}/tracks`);
     if (data && data.items) {
      const trackIds = data.items.map((item: any) => item.track?.id).filter((id: string | undefined) => id);
      setPlaylistTracks(trackIds);
        }
      } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      setPlaylistTracks([]);
      }
    } else {
      setPlaylistTracks([]);
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
      setLocalProgress(position);
      await spotifyFetch(`/me/player/seek?position_ms=${position}`, 'PUT');
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

  // ERROR / NEED TO FIX, IF AT END OF PLAYLIST AND CLIKC A SONG
  // IT WILL BUG OUT / STOP PLAYING ALL SONGS NO SONG IN QUEUE
  const handleChooseTrack = async (uri: string) => {
  try {
    if (playerState?.context?.uri) {
      await spotifyFetch('/me/player/play', 'PUT', {
        context_uri: playerState.context.uri,
        offset: { uri: uri }
      });
    }
    await getPlayerState(); 
  } catch (error) {
    console.error('Error choosing track:', error);
  }
};

  if (!playerState?.device) return <div className='w-screen text-center'>No active device</div>;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2; 
  // ALSO need to add in bug fixing to make it so it doesnt result in API error when spamming click on controls
  
  return (
    <div className={"transition-colors duration-1000 ease-in-out h-screen w-full ${textColor}"} style={{ backgroundColor: bg }}>
      {playerState.item && (
        <div className='flex h-full'>
        
        

        
        <button
          onClick={() => setQueueVisible(!QueueVisible)}
          className={`fixed left-4 top-4 p-3 ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'} 
            hover:bg-opacity-10 rounded-full z-10 ${colorTransition} ${txtColor}`}
        >
          <ListMusic size={20} />
        </button>
          <div className=' h-[87%] top-0 fixed flex w-full items-center justify-center'>
          {Queue()}
          {middleImageyTitle()}
          
          </div>
        
          <div
          className={`w-screen fixed bottom-0 left-0 right-0 h-[13%]  bg-opacity-20 backdrop-blur-3xl rounded-sm  ${txtColor === 'text-gray-800' ?  'bg-white': 'bg-black'} ${colorTransition}`}>
          {bottomBar()}
          </div>

      </div>
      )}
    </div>
  );


  function Queue() {
    const display =  playlistTracks.length !== 100 ? ` ${playlistTracks.indexOf(playerState.item.id) + 1} / ${playlistTracks.length}`: ``;
//Spotify cap at 100 
    return <div className={` fixed left-0 top-0 h-[87%] w-80 ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} 
           backdrop-blur-3xl transform transition-transform duration-300 ease-in-out flex flex-col bg-opacity-20 appearance-none
          ${QueueVisible ? 'translate-x-0' : '-translate-x-full'}`}>


      <div className={`p-4 pt-16 ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} bg-opacity-20  gap-5`}>
        <h2 className={`text-2xl font-atkinson-hyperlegible ${txtColor} ${colorTransition}`}>Queue </h2>
        <p className={`text-md h-3 mb-0 font-atkinson-hyperlegible ${txtColor} ${colorTransition}`}> {display}</p>
      </div>
      <div className={`flex-1 min-h-0 overflow-y-auto mt-4 mb-4
      [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
      [&::-webkit-scrollbar-track]:rounded-full
      [&::-webkit-scrollbar-thumb]:rounded-full
      ${txtColor === 'text-gray-800' 
      ? '[&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-black'
      : '[&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-white'
      }
      `}>
        <div className="p-4 space-y-4">
          {queue.map((track, index) => (
            <div key={index} className={`flex items-center space-x-3 p-2 r</div>ounded-lg 
                  ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10
                  cursor-pointer`}
                  onClick={() => handleChooseTrack(`spotify:track:${track.id}`)}>
              <img
                src={track.album.images[2]?.url}
                alt=""
                className="w-10 h-10 rounded"
                crossOrigin="anonymous" />
              <div className="min-w-0 ">
                <p className={`font-atkinson-hyperlegible ${txtColor} ${colorTransition} truncate`}>
                  {track.name}
                </p>
                <p className={`text-sm ${txtColor} opacity-75 ${colorTransition} truncate`}>
                  {track.artists[0].name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>;
  }

  //Different parts (should maybe make in different folders)
  function middleImageyTitle() {
    return <div className=' flex flex-col items-center justify-center h-full'>
      <img ref={imgRef} src={playerState.item.album.images[0].url} 
        className='rounded-xl mt-16 shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out h-2/3 w-auto'
        onLoad={getColor} crossOrigin="anonymous"
        onClick={handleClick} />
      <div className='mt-5 text-center'>
       <div className={`text-5xl font-atkinson-hyperlegible p-3 ${txtColor} ${colorTransition}`}>
          {playerState.item.name}
       </div>
       <div className={`text-xl font-atkinson-hyperlegible ${txtColor} ${colorTransition}`}>
         {playerState.item.artists[0].name}
        </div>
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
      <span className={`text-md font-atkinson-hyperlegible ${txtColor} ${colorTransition}`}>
        {formatTime(localProgress)}
      </span>
      <div className={`relative w-full h-2 ${txtColor === 'text-gray-800' ? 'bg-black' : 'bg-white'} 
      bg-opacity-20 rounded-lg ${colorTransition}`}>
        <div
          className={`absolute top-0 left-0 h-full ${txtColor === 'text-gray-800' ? 'bg-black' : 'bg-white'} 
            rounded-lg transition-all duration-300 ${colorTransition}`}
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
      <span className={`text-md font-atkinson-hyperlegible ${colorTransition} ${txtColor}`}>
        {formatTime(playerState?.item?.duration_ms || 0)}
      </span>
    </div>;
  }

  function volumeController() {
    return <div className="relative flex items-center gap-2 mb-5 "
      onMouseEnter={() => setIsVolumeVisible(true)}
      onMouseLeave={() => setIsVolumeVisible(false)}>
      <button
        className={`hover:bg-white hover:bg-opacity-10 rounded-full p-2 ${colorTransition} ${txtColor}`}
        onClick={() => handleVolumeChange(volume === 0 ? 50 : 0)}
      >
        <VolumeIcon size={20} />
      </button>
      <div className={`relative w-24 h-2 ${txtColor === 'text-gray-800' ? 'bg-black' : 'bg-white'} 
        bg-opacity-20 rounded-lg ${isVolumeVisible ? 'opacity-100' : 'opacity-0'} 
        transition-opacity duration-200 ${colorTransition}`}>

        <div
          className={`absolute top-0 left-0 h-full ${txtColor === 'text-gray-800' ? 'bg-black' : 'bg-white'}
             rounded-lg ${colorTransition}`}
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
    return <div className="flex items-center justify-center gap-20 mb-3 pl-3 ml-40 ">

      <button
        onClick={() => handleSkip('previous')}
        className={`p-3 ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'}  hover:bg-opacity-10 rounded-full ${txtColor}`}
      >
        <div className={`${colorTransition} ${txtColor}`}>
        <SkipBack size={15} />
        </div>
      </button>
      <button
        onClick={handlePlayPause}
        className={`p-3 ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'}  hover:bg-opacity-10 rounded-full ${txtColor}`}
      >
        <div className={`${colorTransition} ${txtColor}`}>
        {playerState?.is_playing ? <Pause size={20} /> : <Play size={20} />} 
        </div>
      </button>
      <button
        onClick={() => handleSkip('next')}
        className={`p-3 ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'}  hover:bg-opacity-10 rounded-full ${colorTransition} ${txtColor}`}
      >
        <div className={`${colorTransition} ${txtColor}`}>
        <SkipForward size={15} />
        </div>
      </button>
    </div>;
  }
}