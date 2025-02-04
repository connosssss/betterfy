import { useEffect, useState } from "react";

interface Track {
  albumImage: string;
  title: string;
  artist: string;
  songUrl: string;
  isPlaying: boolean;
}

interface PlayerProps {
  accessToken: string;
}

export default function Player({ accessToken }: PlayerProps) {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTrack = async () => {
      const response = await fetch("/api/spotify/current");
      const data = await response.json();
      setTrack(data);
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 10000); 
    return () => clearInterval(interval);
  }, [accessToken]);

  if (!track || !track.isPlaying) return <p>No song is currently playing.</p>;

  return (
    <div className="flex items-center p-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <img src={track.albumImage} alt={track.title} className="w-16 h-16 rounded-lg" />
      <div className="ml-4">
        <h3 className="text-lg font-bold">{track.title}</h3>
        <p className="text-gray-400">{track.artist}</p>
      </div>
      <a href={track.songUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-green-400 hover:underline">
        Open in Spotify
      </a>
    </div>
  );
}