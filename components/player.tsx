import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX, Volume1,
  Play, Pause, SkipBack, SkipForward, ListMusic,
  Maximize, Minimize, Settings, Library } from 'lucide-react';

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

interface PlaylistItem {
  id: string;
  name: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
}

interface PlayerProps {
  accessToken: string;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const analyzeImageColors = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#1a1a1a';

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const edgeSize = Math.floor(Math.min(img.width, img.height) * 0.1);

  const getRegionAverage = (x: number, y: number, width: number, height: number) => {
    const data = ctx.getImageData(x, y, width, height).data;
    let r = 0, g = 0, b = 0, count = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    
    return `rgb(${Math.round(r/count)}, ${Math.round(g/count)}, ${Math.round(b/count)})`;
  };

  const topColor = getRegionAverage(0, 0, img.width, edgeSize);
  const bottomColor = getRegionAverage(0, img.height - edgeSize, img.width, edgeSize);

  return { topColor, bottomColor };
};


export default function Player({ accessToken }: PlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  //const [bg, setBg] = useState('#1a1a1a');
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [isSeeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [txtColor, setTxtColor] = useState('text-white');
  const colorTransition = 'transition-colors duration-1000 ease-in-out';
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [QueueVisible, setQueueVisible] = useState(false);
 // const [playlistTracks, setPlaylistTracks] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [backgroundColors, setBackgroundColors] = useState<BackgroundColors>({ 
  edgeTop: '#1a1a1a', 
  edgeBottom: '#1a1a1a',
  dominant: '#1a1a1a'
});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentBackground, setCurrentBackground] = useState({
    topColor: '#1a1a1a',
    bottomColor: '#1a1a1a',
    mode: 'gradient'
  });

  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  
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
/*()
  useEffect(() => {

        getPlaylist();

    }, [playerState?.context?.uri]);
*/
  useEffect(() => {
    if (playerState?.item) {
      setCurrentBackground(prev => ({
        ...prev,
        topColor: backgroundColors.topColor,
        bottomColor: backgroundColors.bottomColor
      }));
    }
  }, [backgroundColors, playerState?.item]);

  useEffect(() => {
    if (accessToken) {
      getPlayerState();
      getQueue();
      getPlaylists(); 
      const interval = setInterval(() => {
        getPlayerState();
        getQueue();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  //Color
  const getColor = () => {
    if (imgRef.current) {
      const colors = analyzeImageColors(imgRef.current);
      setBackgroundColors(colors);
    
   
      setCurrentBackground(prev => ({
       ...prev,
       topColor: colors.topColor,
       bottomColor: colors.bottomColor
     }));

   
      const rgb = colors.bottomColor.match(/\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const newTxtColor = luminance > 0.7 ? 'text-gray-800' : 'text-white';
        setTxtColor(newTxtColor);
      }
   }
  };


    //copied/can change if needed but dont think it doesnt work 
  //const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
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
  

/*  const getPlaylist = async () => {
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
    }; (--)*/

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

  const getPlaylists = async () => {
    try {
      const playlistData = await spotifyFetch('/me/playlists');
      if (playlistData.items) {
        setPlaylists(playlistData.items);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const handlePlaylistSelect = async (playlistUri: string) => {
    try {
      await spotifyFetch('/me/player/play', 'PUT', {
        context_uri: playlistUri
      });
      await getPlayerState();
    }
     catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  if (!playerState?.device) return <div className='w-screen text-center'>No active device</div>;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2; 

  
  // ALSO need to add in bug fixing to make it so it doesnt result in API error when spamming click on controls
  
  return (
    <div className={"transition-colors duration-1000 ease-in-out h-screen w-full ${textColor}"} 
    style={{ 
      background: currentBackground.mode === 'gradient'
        ? `linear-gradient(to bottom, ${currentBackground.topColor} 0%, ${currentBackground.bottomColor} 100%)`
        : currentBackground.topColor,
      backgroundColor: '#1a1a1a',
    }}>
      
      {playerState.item && (
        <div className='flex h-full'>
        
        
        {settingsOpen && (
        <>
        <div className="fixed flex bg-black bg-opacity-50 z-20 backdrop-blur-sm items-center justify-center h-screen w-screen" onClick={() => setSettingsOpen(false)}></div>
        <div className="flex z-30 h-1/2 w-1/2 fixed top-1/4 left-1/4">
        
          
            <SettingsMenu />
          
        </div>
      </>
      )}
      <button
            onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
            className={`fixed right-4 top-4 p-3 ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'} 
              hover:bg-opacity-10 rounded-full z-10 ${colorTransition} ${txtColor}`}
          >
            <Library size={25} />
          </button>
        
        <button
        onClick={() => setQueueVisible(!QueueVisible)}
        className={`fixed left-4 top-4 p-3 ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'} 
          hover:bg-opacity-10 rounded-full z-10 ${colorTransition} ${txtColor}`}
      >
        <ListMusic size={25} />
      </button>
      
      

          <div className=' h-[87%] top-0 fixed flex w-full items-center justify-center'>
          {Queue()}
          {middleImageyTitle()}
          {Playlists()}
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
   // const display =  playlistTracks.length !== 100 ? ` ${playlistTracks.indexOf(playerState.item.id) + 1} / ${playlistTracks.length}`: ``;
   //<p className={`text-md h-3 mb-0 font-atkinson-hyperlegible ${txtColor} ${colorTransition}`}> {display}</p>
//Spotify cap at 100 
    return <div className={` fixed left-0 top-0 h-[87%] w-80 ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} 
           backdrop-blur-3xl transform transition-transform duration-300 ease-in-out flex flex-col bg-opacity-20 appearance-none
          ${QueueVisible ? 'translate-x-0' : '-translate-x-full'}`}>


      <div className={`p-4 pt-16 ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} bg-opacity-20  gap-5`}>
        <h2 className={`text-2xl font-atkinson-hyperlegible ${txtColor} ${colorTransition} mt-5`}> Queue </h2>
        
      </div>
      <div className={`flex-1 min-h-0 overflow-y-auto mt-4 mb-4 mr-2
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
                src={track.album.images[0]?.url}
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
    return <div className="max-w-4xl mx-auto px-4 z-20">

        {progressBar()}


        <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>

        <div className="flex-1 flex justify-center sm:justify-start">
          {volumeController()}
        </div>

          <div className="flex-1 flex justify-center">
          {songController()}
        </div>

          <div className="flex-1 flex justify-center sm:justify-end relative">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 ${
              txtColor === 'text-gray-800' 
                ? 'hover:bg-black' 
                : 'hover:bg-white'
            } hover:bg-opacity-10 rounded-full`}
          >
            <Settings size={20} className={txtColor} />
          </button>
          
        </div>
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
    return <div className="relative flex items-center gap-2  "
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
    return <div className="flex items-center justify-center gap-20 pl-3 ">

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
  function SettingsMenu() {
    
    const handleModeChange = (newMode: 'gradient' | 'solid') => {
      setCurrentBackground(prev => ({
        ...prev,
        mode: newMode
      }));
      
    };
    const toggleFullscreen = () => {
    
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } 
  
      else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };
    //!!!NEED TO FOCUS ON NOT JUST USING DIVS
    return (
      <div className={`h-full w-full rounded-lg ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} bg-opacity-40 backdrop-blur-sm shadow-lg`}>
        <div className="flex flex-col gap-3">

          <button
            onMouseDown={() => handleModeChange('gradient')}

            onTouchStart={() => handleModeChange('gradient')}
            className={`px-3 py-1 rounded-full text-left ${
              currentBackground.mode === 'gradient' ? 'bg-opacity-40' : 'bg-opacity-10'
            } ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'}`}
          >
            
            <span className={`text-sm ${txtColor}`}>
              Gradient Background
            </span>
          </button>
          <button
            onMouseDown={() => handleModeChange('solid')}
            onTouchStart={() => handleModeChange('solid')}
            className={`py-1 rounded-full text-left ${
              currentBackground.mode === 'solid' ? 'bg-opacity-40' : 'bg-opacity-10'
            } ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'}`}
          >
            <span className={`text-sm ${txtColor}`}>
              Solid Background
            </span>

          </button>
          <div className="h-px bg-current opacity-10 my-2"></div>

        <button
          onMouseDown={toggleFullscreen}
          
          className={` py-1 rounded-lg text-left flex items-center justify-between
            ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'} 
            hover:bg-opacity-10`}
        >
          <span className={`text-sm ${txtColor}`}>
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </span>
          {isFullscreen ? 
            <Minimize size={18} className={txtColor} /> : 
            <Maximize size={18} className={txtColor} />
          }
        </button>
      
        </div>
      </div>
      );}

      function Playlists() {
        return (
          <div className={`fixed right-0 top-0 h-[87%] w-80 ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} 
               backdrop-blur-3xl transform transition-transform duration-300 ease-in-out flex flex-col bg-opacity-20 appearance-none
              ${isPlaylistVisible ? 'translate-x-0' : 'translate-x-full'}`}>
    
            <div className={`p-4 pt-16 ${txtColor === 'text-gray-800' ? 'bg-white' : 'bg-black'} bg-opacity-20 gap-5`}>
              <h2 className={`text-2xl font-atkinson-hyperlegible ${txtColor} ${colorTransition} mt-5`}>Your Library</h2>
            </div>
    
            <div className={`flex-1 min-h-0 overflow-y-auto mt-4 mb-4 mr-2
              [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:rounded-full
              ${txtColor === 'text-gray-800' 
                ? '[&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-black'
                : '[&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-white'
              }`}>
    
              <div className="p-4 space-y-4">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg 
                      ${txtColor === 'text-gray-800' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10
                      cursor-pointer`}
                    onClick={() => handlePlaylistSelect(`spotify:playlist:${playlist.id}`)}
                  >
                    <img
                      src={playlist.images[0]?.url}
                      alt=""
                      className="w-10 h-10 rounded"
                      crossOrigin="anonymous"
                    />
                    <div className="min-w-0">
                      <p className={`font-atkinson-hyperlegible ${txtColor} ${colorTransition} truncate`}>
                        {playlist.name}
                      </p>
                      <p className={`text-sm ${txtColor} opacity-75 ${colorTransition} truncate`}>
                        {playlist.tracks.total} tracks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
}

