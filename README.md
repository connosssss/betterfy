# betterfy

### About
betterfy is a customized UI for the spotify player. It uses the Spotify API to display what song is playing while also giving the user the ability to control the player through the site itself

### How to Install and Run 

Start off by cloning the repository or downloading the file and unzipping, then running these commands

```bash
npm install
npm install lucide-react
```

After, make a .env.local file in the root of the app, declaring these variabels
```bash
SPOTIFY_CLIENT_ID = 
SPOTIFY_CLIENT_SECRET = 
NEXTAUTH_SECRET = 
NEXTAUTH_URL = http://localhost:3000
```
---
Next, you will need to go to the spotify developers site to get and API ID and secret. While making the project, make sure to set the callback URIs as http://localhost:3000/ and http://localhost:3000/api/auth/callback/spotify. Then, set the client ID and secret in the env file. 

To get the next auth secret, you can visit [this](https://auth-secret-gen.vercel.app) site and paste what is generated into the env file 

Then finally, run the application using ` npm run dev` 
