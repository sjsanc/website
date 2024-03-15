import Blinker from "../ui/Blinker";
import Block from "../ui/Block";
import Image from "next/image";
import { kv } from "@vercel/kv";
import { HeadphonesIcon } from "../icons";

interface SpotifyTokenPayload {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getSpotifyAccessToken() {
  try {
    const existingToken = await kv.get("spotify_access_token");

    if (existingToken) return existingToken as string;

    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
    const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!client_id || !client_secret || !refresh_token) {
      throw new Error(
        "Unable to generate refresh token due to missing env variable",
      );
    }

    const params = new URLSearchParams();
    params.append("client_id", client_id);
    params.append("client_secret", client_secret);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Spotify access token");
    }

    const data = (await response.json()) as SpotifyTokenPayload;

    await kv.set("spotify_access_token", data.access_token, {
      ex: data.expires_in,
    });

    return data.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getSpotifyCurrentlyPlaying() {
  try {
    const token = await getSpotifyAccessToken();

    if (!token) return null;

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!response.ok) {
      console.error("Failed to fetch currently playing track");
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function SpotifyModule() {
  const spotifyData = await getSpotifyCurrentlyPlaying();

  return (
    <Block className="p-2">
      <a href={spotifyData?.item?.external_urls?.spotify}>
        {spotifyData ? (
          <Image
            width={250}
            height={250}
            src={spotifyData?.item?.album?.images?.[0]?.url}
            priority
            alt={"Album cover"}
            className="rounded-lg overflow-hidden mb-2 drop-shadow"
          />
        ) : (
          <div className="flex items-center aspect-square w-full justify-center text-zinc-600 bg-zinc-900 rounded mb-2">
            <HeadphonesIcon />
          </div>
        )}
      </a>
      <div className="font-title font-medium">
        <h2 className="font-medium font-sans text-sm text-zinc-700">
          Currently listening...
        </h2>

        <p className="flex items-center gap-2">
          <Blinker color={spotifyData ? "#65a30d" : "#e11d48"} />

          {!spotifyData ? (
            <span>I'm not.</span>
          ) : (
            <div className="line-clamp-1">
              {spotifyData?.item?.artists
                ?.map((a: { name: string }) => a.name)
                .join(", ")}{" "}
              - {spotifyData?.item?.name}
            </div>
          )}
        </p>
      </div>
    </Block>
  );
}
