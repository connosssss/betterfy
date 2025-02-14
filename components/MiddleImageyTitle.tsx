import React from 'react';

interface middleImageyTitleProps {
  playerState: any;
  imgRef: React.RefObject<HTMLImageElement>;
  txtColor: string;
  colorTransition: string;
  getColor: () => void;
  handleClick: () => void;
}

export const MiddleImageyTitle : React.FC<middleImageyTitleProps> = ({
  playerState,
  imgRef,
  txtColor,
  colorTransition,
  getColor,
  handleClick
}) => {
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
};