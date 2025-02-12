export default function About() {
  
  
  return (
    <div className="flex items-center justify-center w-full h-screen animate-background text-start font-atkinson-hyperlegible  ">
        <div className=" h-screen w-screen bg-opacity-20 text-white flex justify-center items-center ">
          <div className="text-center  bg-black bg-opacity-20 h-1/2 w-1/2 flex flex-col gap-8 p-8 rounded-lg">
                <h1 className="font-atkinson-hyperlegible text-xl">About</h1>
                <p className="font-atkinson-hyperlegible text-md">betterfy is a custom UI for the spotify webplayer meant to improve 
                    the visuals while a song is playing. It makes use of the Spotify Web API to show and give controls to the song that is currently
                    playing while also allowing you to choose a song in the queue or to play a new playlist.
                </p>
                <h1 className="font-atkinson-hyperlegible text-xl"> How to use</h1>
                <p></p>
          </div>

        </div>
      
    </div>
  );
}