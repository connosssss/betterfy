import React from 'react';
import Image from 'next/image';

interface middleImageyTitleProps {
  playerState: any;
  imgRef: React.RefObject<HTMLImageElement | null>;
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
    return <div className=' flex flex-col items-center h-full'>
      <div className='group flex items-center cursor-pointer mt-10 mb-3' style={{ width: imgRef.current?.width || 'auto' }}>
        <Image 
        src={txtColor === 'text-black' ? '/Spotify_Primary_Logo_RGB_Black.svg' : '/Spotify_Primary_Logo_RGB_White.svg'}
        alt="Spotify Logo"
        width={30}
        height={30}
        className={`${colorTransition}  `}
          />

          <div className={`overflow-hidden w-0 group-hover:w-24 transition-all duration-300 ${txtColor} ${colorTransition} ml-2`}>
            <div className='whitespace-nowrap translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 underline'
            onClick={handleClick}>To song link</div>
          </div>
      </div>

    <img ref={imgRef} src={playerState.item.album.images[0].url} 
      className='rounded-xl shadow-xl h-2/3 w-auto'
      onLoad={getColor} crossOrigin="anonymous"
       />
       
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