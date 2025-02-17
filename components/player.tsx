import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Volume2, VolumeX, Volume1,
  Play, Pause, SkipBack, SkipForward, ListMusic,
  Maximize, Minimize, Settings, Library,
  RefreshCw, LogOut  } from 'lucide-react';

  import { MiddleImageyTitle } from './MiddleImageyTitle';
  import { Queue } from './Queue';
  import { Playlists } from './Playlists';

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

interface BackgroundColors {
  topColor: string;
  bottomColor: string;
  dominant: string;
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

interface TextColorMode {
  mode: 'auto' | 'white' | 'black';
}

const SettingsMenu = ({
  txtColor,
  colorTransition,
  currentBackground,
  setCurrentBackground,
  textColorMode,
  setTextColorMode,
  setTxtColor,
  isFullscreen,
  setIsFullscreen,
  getColor
}: {
  txtColor: string;
  colorTransition: string;
  currentBackground: { mode: 'gradient' | 'solid'; topColor: string; bottomColor: string };
  setCurrentBackground: React.Dispatch<React.SetStateAction<{ mode: 'gradient' | 'solid'; topColor: string; bottomColor: string }>>;
  textColorMode: TextColorMode['mode'];
  setTextColorMode: React.Dispatch<React.SetStateAction<TextColorMode['mode']>>;
  setTxtColor: React.Dispatch<React.SetStateAction<string>>;
  isFullscreen: boolean;
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
  getColor: () => void;
}) => {
  const handleModeChange = (newMode: 'gradient' | 'solid') => {
    setCurrentBackground(prev => ({
      ...prev,
      mode: newMode
    }));
  };

  const handleTextColorChange = (mode: TextColorMode['mode']) => {
    setTextColorMode(mode);
    if (mode === 'white') setTxtColor('text-white');
    if (mode === 'black') setTxtColor('text-black');
    if (mode === 'auto') getColor();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  
  const handleLogout = () => {
    
    localStorage.removeItem('spotify_token');
    window.location.href = '/login';
  };

  return (
    <div 
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-80 max-h-[80vh] rounded-lg 
        ${txtColor === 'text-black' ? 'bg-white' : 'bg-black'} 
        bg-opacity-40 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col z-30`}
    >
      <div className="p-6">
        <h2 className={`text-2xl font-atkinson-hyperlegible ${txtColor} ${colorTransition} mb-4`}>
          Settings
        </h2>
      </div>
      
      <div 
        className={`flex-1 overflow-y-auto px-6 pb-6
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:rounded-full
          ${txtColor === 'text-black' 
            ? '[&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-black'
            : '[&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-white'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-medium mb-3 ${txtColor}`}>Background Style</h3>
            <div className="flex flex-col gap-2">
              
              <button
                onClick={() => handleModeChange('solid')}
                className={`px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                  currentBackground.mode === 'solid' 
                    ? `${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} bg-opacity-20` 
                    : `${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`
                }`}
              >
                <span className={`text-md ${txtColor}`}>Solid Color
                <p className='text-sm'>A more stable background with better transitions</p>
                </span>
              </button>
              <button
                onClick={() => handleModeChange('gradient')}
                className={`px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                  currentBackground.mode === 'gradient' 
                    ? `${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} bg-opacity-20` 
                    : `${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`
                }`}
              >
                <span className={`text-md ${txtColor}`}>Gradient
                  <p className='text-sm'>A more dynamic background</p>
                </span>
              </button>
            </div>
          </div>
          
          <div>
              <h3 className={`text-lg font-medium mb-3 ${txtColor}`}>Text Color</h3>
              <div className="flex flex-col gap-2">
                <button
                  onMouseDown={() => handleTextColorChange('auto')}
                  onTouchStart={() => handleTextColorChange('auto')}
                  className={`px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                    textColorMode === 'auto' 
                      ? `${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} bg-opacity-20` 
                      : `${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`
                  }`}
                >
                  <span className={`text-md ${txtColor}`}>Auto (Based on BG brightness) </span>
                </button>
                <button
                  onMouseDown={() => handleTextColorChange('white')}
                  onTouchStart={() => handleTextColorChange('white')}
                  className={`px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                    textColorMode === 'white' 
                      ? `${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} bg-opacity-20` 
                      : `${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`
                  }`}
                >
                  <span className={`text-md ${txtColor}`}>White</span>
                </button>
                <button
                  onClick={() => handleTextColorChange('black')}
                  className={`px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                    textColorMode === 'black' 
                      ? `${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} bg-opacity-20` 
                      : `${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`
                  }`}
                >
                  <span className={`text-md ${txtColor}`}>Black</span>
                </button>
              </div>
            </div>

          <div>
            <h3 className={`text-lg font-medium mb-3 ${txtColor}`}>Display</h3>
            <button
              onClick={toggleFullscreen}
              className={`w-full px-4 py-2 rounded-lg text-left transition-all duration-200 flex items-center justify-between
                ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`}
            >

              <span className={`text-md ${txtColor}`}>
                {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              </span>

              {isFullscreen ? 
                <Minimize size={18} className={txtColor} /> : 
                <Maximize size={18} className={txtColor} />
              }
            </button>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between
                ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10`}
            >
              <span className={`text-md ${txtColor}`}>Logout</span>
              <LogOut size={18} className={txtColor} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const analyzeImageColors = (img: HTMLImageElement): BackgroundColors => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { topColor: '#1a1a1a', bottomColor: '#1a1a1a', dominant: '#1a1a1a' };

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

    return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
  };

  const topColor = getRegionAverage(0, 0, img.width, edgeSize);
  const bottomColor = getRegionAverage(0, img.height - edgeSize, img.width, edgeSize);

  return { topColor, bottomColor, dominant: topColor };
};


export default function Player({ accessToken }: PlayerProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [isSeeking, setSeeking] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [txtColor, setTxtColor] = useState('text-white');
  const colorTransition = 'transition-colors duration-1000 ease-in-out';
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [QueueVisible, setQueueVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [backgroundColors, setBackgroundColors] = useState<BackgroundColors>({ 
    topColor: '#1a1a1a', 
    bottomColor: '#1a1a1a',
    dominant: '#1a1a1a'
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<{ mode: 'gradient' | 'solid'; topColor: string; bottomColor: string }>({
    topColor: '#1a1a1a',
    bottomColor: '#1a1a1a',
    mode: 'solid'
  });
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [textColorMode, setTextColorMode] = useState<TextColorMode['mode']>('auto');
  const [hasError, setHasError] = useState(false);

  const spotifyFetch = async (endpoint: string, method = 'GET', body: any = null) => {
    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok && response.status !== 403){
      setHasError(true);
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

      const interval = setInterval(() => {
        getPlayerState();
        getQueue();
        getPlaylists();
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

 

  //Color
  const getColor = () => {
    if (imgRef.current!) {
      const colors = analyzeImageColors(imgRef.current);
      setBackgroundColors(colors);
      
      setCurrentBackground(prev => ({
        ...prev,
        topColor: colors.topColor,
        bottomColor: colors.bottomColor
      }));
  
      
      if (textColorMode === 'auto') {
        const rgb = colors.topColor.match(/\d+/g);
        if (rgb) {
          const [r, g, b] = rgb.map(Number);
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const newTxtColor = luminance > 0.6 ? 'text-black' : 'text-white';
          setTxtColor(newTxtColor);
        }
      } else {
        setTxtColor(textColorMode === 'white' ? 'text-white' : 'text-black');
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

  const handleReload = () => {
    window.location.reload();
    setHasError(false);
  };


  if (!playerState?.device) return <div className='w-screen text-center'>No active device. Please start playing a song on spotify(device it is on doesn't matter) to start </div>;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2; 

  
 

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
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
                onClick={() => setSettingsOpen(false)}
              />
              <SettingsMenu
                txtColor={txtColor}
                colorTransition={colorTransition}
                currentBackground={currentBackground}
                setCurrentBackground={setCurrentBackground}
                textColorMode={textColorMode}
                setTextColorMode={setTextColorMode}
                setTxtColor={setTxtColor}
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
                getColor={getColor}
              />
            </>
          )}
          {hasError && <Reload />}
        

      <button
            onClick={() => setIsPlaylistVisible(!isPlaylistVisible)}
            className={`fixed right-4 top-4 p-3 ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} 
              hover:bg-opacity-10 rounded-full z-10 ${colorTransition} ${txtColor}`}
          >
            <Library size={25} />
          </button>
        
        <button
        onClick={() => setQueueVisible(!QueueVisible)}
        className={`fixed left-4 top-4 p-3 ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} 
          hover:bg-opacity-10 rounded-full z-10 ${colorTransition} ${txtColor}`}
      >
        <ListMusic size={25} />
      </button>
      
      

          <div className=' h-[87%] top-0 fixed flex w-full items-center justify-center'>
          <Queue 
             QueueVisible={QueueVisible}
              txtColor={txtColor}
              colorTransition={colorTransition}
              queue={queue}
              handleChooseTrack={handleChooseTrack}
              />
          <MiddleImageyTitle 
                playerState={playerState}
                imgRef={imgRef}
                txtColor={txtColor}
                colorTransition={colorTransition}
                getColor={getColor}
                handleClick={handleClick}
              />
          <Playlists 
            isPlaylistVisible={isPlaylistVisible}
            txtColor={txtColor}
            colorTransition={colorTransition}
            playlists={playlists}
            handlePlaylistSelect={handlePlaylistSelect}
          />           
          </div>
        
          <div
          className={`w-screen fixed bottom-0 left-0 right-0 h-[13%]  bg-opacity-20 backdrop-blur-3xl rounded-sm  ${txtColor === 'text-black' ?  'bg-white': 'bg-black'} ${colorTransition}`}>
          {bottomBar()}
          </div>

      </div>
      )}
    </div>
  );

  //Different parts (should maybe make in different folders)
 

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
              txtColor === 'text-black' 
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
      <div className={`relative w-full h-2 ${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} 
      bg-opacity-20 rounded-lg ${colorTransition}`}>
        <div
          className={`absolute top-0 left-0 h-full ${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} 
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
      <div className={`relative w-24 h-2 ${txtColor === 'text-black' ? 'bg-black' : 'bg-white'} 
        bg-opacity-20 rounded-lg ${isVolumeVisible ? 'opacity-100' : 'opacity-0'} 
        transition-opacity duration-200 ${colorTransition}`}>

        <div
          className={`absolute top-0 left-0 h-full ${txtColor === 'text-black' ? 'bg-black' : 'bg-white'}
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
        className={`p-3 ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'}  hover:bg-opacity-10 rounded-full ${txtColor}`}
      >
        <div className={`${colorTransition} ${txtColor}`}>
        <SkipBack size={15} />
        </div>
      </button>
      <button
        onClick={handlePlayPause}
        className={`p-3 ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'}  hover:bg-opacity-10 rounded-full ${txtColor}`}
      >
        <div className={`${colorTransition} ${txtColor}`}>
        {playerState?.is_playing ? <Pause size={20} /> : <Play size={20} />} 
        </div>
      </button>
      <button
        onClick={() => handleSkip('next')}
        className={`p-3 ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'}  hover:bg-opacity-10 rounded-full ${colorTransition} ${txtColor}`}
      >
        <div className={`${colorTransition} ${txtColor}`}>
        <SkipForward size={15} />
        </div>
      </button>
    </div>;
  }
      function Reload() {
        return <div className="fixed flex items-center justify-center ${txtColor} z-50 right-1/2 top-5 left-1/2">
        <button onClick={handleReload} className={`p-4 rounded-full ${txtColor === 'text-black' ? 'bg-white' : 'bg-black'} bg-opacity-20 px-48`}>

          <RefreshCw size={20} className={txtColor} />
        </button>


          </div>;
      }
}

