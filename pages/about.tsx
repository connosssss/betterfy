export default function About() {
  
  
  return (
    <div className="flex items-center justify-center w-full h-screen animate-background text-start font-atkinson-hyperlegible  ">
        <div className=" h-screen w-screen bg-opacity-20 text-white flex justify-center items-center ">
          <div className="text-center  bg-black bg-opacity-20 h-[80%] w-1/2 flex flex-col gap-2 p-8 rounded-lg items-center">
                <h1 className="font-atkinson-hyperlegible text-xl underline">About</h1>
                <p className="font-atkinson-hyperlegible text-md">betterfy is a custom UI for the spotify webplayer meant to improve 
                    the visuals while a song is playing. It makes use of the Spotify Web API to show and give controls to the song that is currently
                    playing while also allowing you to choose a song in the queue or to play a new playlist.
                </p>
                <h1 className="font-atkinson-hyperlegible text-xl mt-5 underline"> How to use</h1>
                <p className="font-atkinson-hyperlegible text-md">Login using spotify and play a song using any type of device(does not have to be the same one the website is on)
                </p>
                <p className="font-atkinson-hyperlegible text-md"> ❗ If there are any problems logging in, try to clear browser cookies
                </p>
                <p className="font-atkinson-hyperlegible text-md">❗ If there are 
                  any issues with playing the song, try to reload the page.
                </p>


                <h1 className="font-atkinson-hyperlegible text-xl mt-5 underline">Features</h1>
                <ul className="font-atkinson-hyperlegible text-md list-disc list-inside">
                  <li>Improved UI</li>
                  <li>Queue Selection</li>
                  <li>Playlist Selection</li>
                </ul>


                <button
                  onClick={() => window.location.href = '/login'}
                  className="text-lg font-semibold text-white  bg-black bg-opacity-30 hover:bg-opacity-20 rounded-lg  transition-all duration-300 font-atkinson-hyperlegible px-5 py-4 w-1/3 mt-5"
                >
                  Back to Login
                </button>
          </div>

        </div>
      
    </div>
  );
}