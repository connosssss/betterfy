import React from 'react';
import { Volume2, SkipBack, SkipForward, Play, Settings, ListMusic, Maximize, Minimize, LogOut } from 'lucide-react';


interface PlaceHolderProps {
  setQueueVisible: React.Dispatch<React.SetStateAction<boolean>>;
  QueueVisible: boolean;
  settingsOpen: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


interface TextColorMode {
  mode: 'auto' | 'white' | 'black';
}


const SettingsMenu = ({
  setSettingsOpen
}: {
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    window.location.href = '/login';
  };


  return (
    <div 
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-80 max-h-[80vh] rounded-lg 
        bg-black
        bg-opacity-40 backdrop-blur-sm shadow-lg overflow-hidden flex flex-col z-30"
    >

      <div className="p-6">
        <h2 className="text-2xl font-atkinson-hyperlegible text-white mb-4">
          Settings
        </h2>
      </div>
      

      <div 
        className="flex-1 overflow-y-auto px-6 pb-6
          [&::-webkit-scrollbar]:w-2 
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-white"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="space-y-6">
          <div className="pt-4 border-t border-gray-600">

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between
                hover:bg-white hover:bg-opacity-10"
            >
              <span className="text-md text-white">Logout</span>
              <LogOut size={18} className="text-white" />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};


export const PlaceHolder: React.FC<PlaceHolderProps> = ({ 
  setQueueVisible, 
  QueueVisible, 
  settingsOpen, 
  setSettingsOpen 
}) => {

  return (
    <div className="transition-colors duration-1000 ease-in-out h-screen w-full" 
    style={{ 
      backgroundColor: '#1a1a1a',
    }}>

      <div className='flex h-full'>
        {settingsOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
              onClick={() => setSettingsOpen(false)}
            />
            <SettingsMenu
              setSettingsOpen={setSettingsOpen}
            />
          </>
        )}
      

        <button
          onClick={() => setQueueVisible(!QueueVisible)}
          className="fixed left-4 top-4 p-3 hover:bg-white hover:bg-opacity-10 rounded-full z-10 text-white"
        >
          <ListMusic size={25} />
        </button>


        <div className='h-[87%] top-0 fixed flex w-full items-center justify-center'>
          <div className='flex flex-col items-center justify-center h-full'>
            <div 
              className='rounded-xl mt-16 shadow-xl h-2/3 aspect-square bg-white bg-opacity-5 flex items-center justify-center'
            >
              <div className="text-white text-xl font-atkinson-hyperlegible opacity-50">
                No active device
              </div>
            </div>

            <div className='mt-5 text-center'>
              <div className="text-5xl font-atkinson-hyperlegible p-3 text-white opacity-50">
                Not Song Playing
              </div>

              <div className="text-xl font-atkinson-hyperlegible text-white opacity-50">
                Start playing on Spotify
              </div>
            </div>
          </div>
        </div>


        <div className="w-screen fixed bottom-0 left-0 right-0 h-[13%] bg-black bg-opacity-20 backdrop-blur-3xl rounded-sm">
          <div className="max-w-4xl mx-auto px-4 z-20">

            <div className="flex items-center gap-4 mb-2 mt-3">
              <div className="text-md font-atkinson-hyperlegible text-white opacity-50">
                0:00
              </div>

              <div className="relative w-full h-2 bg-white bg-opacity-20 rounded-lg">
                <div className="absolute top-0 left-0 h-full bg-white rounded-lg opacity-50" style={{ width: '0%' }} />
              </div>

              <div className="text-md font-atkinson-hyperlegible text-white opacity-50">
                0:00
              </div>
            </div>


            <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className="flex-1 flex justify-center sm:justify-start">
                <div className="relative flex items-center gap-2">
                  <button className="hover:bg-white hover:bg-opacity-10 rounded-full p-2 text-white opacity-50">
                    <Volume2 size={20} />
                  </button>
                </div>
              </div>


              <div className="flex-1 flex justify-center">
                <div className="flex items-center justify-center gap-20 pl-3">
                  <button className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full text-white opacity-50">
                    <SkipBack size={15} />
                  </button>

                  <button className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full text-white opacity-50">
                    <Play size={20} />
                  </button>

                  <button className="p-3 hover:bg-white hover:bg-opacity-10 rounded-full text-white opacity-50">
                    <SkipForward size={15} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex justify-center sm:justify-end relative">
                <button 
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full text-white opacity-50"
                >
                  <Settings size={20} />
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};