import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen animate-background text-start font-atkinson-hyperlegible">
      <div className="h-full w-screen bg-opacity-20 text-white flex justify-center items-center py-10">
        <div className="text-left bg-black bg-opacity-20 w-2/3 flex flex-col gap-4 p-8 rounded-lg">
          <h1 className="font-atkinson-hyperlegible text-3xl text-center mb-6">Privacy Policy</h1>
          
          <p className="mb-4">This Privacy Policy describes how your personal information is collected, used, and shared when you use Betterfy.</p>
          
          <h2 className="text-xl font-semibold mt-4">1. Information We Collect</h2>
          <p>When you use Betterfy, we access your Spotify account information through the Spotify API. This includes:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Your Spotify username and profile information</li>
            <li>Your currently playing track and playback state</li>
            <li>Your playlists and queue information</li>
            <li>Your playback controls (play, pause, skip, etc.)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-4">2. How We Use Your Information</h2>
          <p>We use the information we collect solely to provide, maintain, and improve the Betterfy service. Specifically, we use this information to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Display your currently playing music</li>
            <li>Show your playlists and queue</li>
            <li>Enable playback controls</li>
            <li>Customize the user interface based on your music</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-4">3. Data Storage</h2>
          <p>Betterfy does not store your Spotify data on our servers. Your Spotify access token is stored locally in your browser and is used only for the duration of your session.</p>
          
          <h2 className="text-xl font-semibold mt-4">4. Data Sharing</h2>
          <p>We do not share your personal information with third parties. Betterfy is a client-side application that interacts directly with the Spotify API.</p>
          
          <h2 className="text-xl font-semibold mt-4">5. Cookies</h2>
          <p>Betterfy uses browser local storage to save your authentication state. This allows you to remain logged in between sessions.</p>
          
          <h2 className="text-xl font-semibold mt-4">6. Your Rights</h2>
          <p>You have the right to access, update, or delete your information at any time. Since we do not store your data on our servers, this can be managed through your Spotify account settings or by revoking Betterfy's access to your Spotify account.</p>
          
          <h2 className="text-xl font-semibold mt-4">7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.</p>
          
          <h2 className="text-xl font-semibold mt-4">8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through the About page.</p>
          
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