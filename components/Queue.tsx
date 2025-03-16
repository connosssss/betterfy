import React from 'react';

interface queueProps {
  QueueVisible: boolean;
  txtColor: string;
  colorTransition: string;
  queue: any[];
  handleChooseTrack: (uri: string) => void;
}

export const Queue: React.FC<queueProps> = ({
  QueueVisible,
  txtColor,
  colorTransition,
  queue,
  handleChooseTrack
}) => {
    return <div className={` fixed left-0 top-0 h-[87%] w-80 z-50 ${txtColor === 'text-black' ? 'bg-white' : 'bg-black'} 
        backdrop-blur-3xl transform transition-transform duration-300 ease-in-out flex flex-col bg-opacity-20 appearance-none
       ${QueueVisible ? 'translate-x-0' : '-translate-x-full'}`}>


   <div className={`p-4 pt-16 ${txtColor === 'text-black' ? 'bg-white' : 'bg-black'} bg-opacity-20  gap-5`}>
     <h2 className={`text-2xl font-atkinson-hyperlegible ${txtColor} ${colorTransition} mt-5`}> Queue </h2>
     
   </div>
   <div className={`flex-1 min-h-0 overflow-y-auto mt-4 mb-4 mr-2
   [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2
   [&::-webkit-scrollbar-track]:rounded-full
   [&::-webkit-scrollbar-thumb]:rounded-full
   ${txtColor === 'text-black' 
   ? '[&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-black'
   : '[&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-10 [&::-webkit-scrollbar-thumb]:bg-white'
   }
   `}>

     <div className="p-4 space-y-4">
       {queue.map((track, index) => (
         <div key={index} className={`flex items-center space-x-3 p-2 r</div>ounded-lg 
               ${txtColor === 'text-black' ? 'hover:bg-black' : 'hover:bg-white'} hover:bg-opacity-10
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
};