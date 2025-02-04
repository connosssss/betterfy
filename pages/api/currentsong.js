import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (response.status === 204 || response.status === 200) {
      const data = await response.json();

      if (!data || !data.is_playing) {
        return res.status(200).json({ isPlaying: false });
      }

      return res.status(200).json({
        isPlaying: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map((a) => a.name).join(", "),
        albumImage: data.item.album.images[0].url,
        songUrl: data.item.external_urls.spotify,
      });
    }

    return res.status(response.status).json({ error: "Failed to fetch currently playing song" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch currently playing song" });
  }
}