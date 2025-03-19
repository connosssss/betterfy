import Link from 'next/link';

export default function Agreement() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen animate-background text-start font-atkinson-hyperlegible">
      <div className="h-full w-screen bg-opacity-20 text-white flex justify-center items-center py-10">
        <div className="text-left bg-black bg-opacity-20 w-2/3 flex flex-col gap-4 p-8 rounded-lg">
          <h1 className="font-atkinson-hyperlegible text-3xl text-center mb-6">End User License Agreement</h1>
          
          <h2 className="text-xl font-semibold mt-4">1. Acceptance of Terms</h2>
          <p>By accessing or using Betterfy, you agree to be bound by this End User License Agreement. If you do not agree to these terms, please do not use the application.</p>
          
          <h2 className="text-xl font-semibold mt-4">2. Description of Service</h2>
          <p>Betterfy is a custom user interface for the Spotify web player that enhances the visual experience while listening to music. It utilizes the Spotify Web API to display currently playing songs and provide playback controls.</p>
          
          <h2 className="text-xl font-semibold mt-4">3. Spotify Account Requirement</h2>
          <p>To use Betterfy, you must have a valid Spotify account and comply with Spotify's Terms of Service. Betterfy is not affiliated with Spotify and is an independent application.</p>
          
          <h2 className="text-xl font-semibold mt-4">4. Personal Data</h2>
          <p>Betterfy accesses your Spotify account information solely for the purpose of providing the service. Please refer to our Privacy Policy for details on how we handle your data.</p>
          
          <h2 className="text-xl font-semibold mt-4">5. Limitations</h2>
          <p>Due to Spotify API restrictions, some features may be limited for non-premium Spotify users.</p>
          
          <h2 className="text-xl font-semibold mt-4">6. Disclaimer of Warranty</h2>
          <p>Betterfy is provided "as is" without warranty of any kind. We do not guarantee that the application will be error-free or uninterrupted.</p>
          
          <h2 className="text-xl font-semibold mt-4">7. Limitation of Liability</h2>
          <p>In no event shall the developers of Betterfy be liable for any damages arising out of the use or inability to use the application.</p>
          
          <h2 className="text-xl font-semibold mt-4">8. Changes to Agreement</h2>
          <p>We reserve the right to modify this agreement at any time. Continued use of Betterfy after changes indicates acceptance of the modified terms.</p>
          
          <div className="flex justify-center mt-8">
            <Link href="/login">
              <button className="text-lg font-semibold text-white bg-black bg-opacity-30 hover:bg-opacity-20 rounded-lg transition-all duration-300 font-atkinson-hyperlegible px-5 py-4 w-40 mt-5">
                Back to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 