import Image from "next/image";
import portalKey from "../public/pk.png";
import Block from "@/components/Block";
import * as cheerio from "cheerio";

interface SpotifyTokenPayload {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getSpotifyAccessToken() {
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

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Spotify access token");
    }

    const data = (await response.json()) as SpotifyTokenPayload;
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getSpotifyCurrentlyPlaying(accessToken: string | undefined) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch currently playing track");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCurrentlyReading(id: string) {
  try {
    const response = await fetch(`https://www.goodreads.com/book/show/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch webpage");
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $(".Text__title1");
    const authors = $(".ContributorLink");
    const cover = $(".ResponsiveImage");

    authors.each((i, a) => {
      console.log($(a).text());
    });

    return {
      url: `https://www.goodreads.com/book/show/${id}`,
      title: $(title).text(),
      authors: $(authors[0]).text().trim(),
      cover: $(cover).attr("src"),
    };
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const currentlyReading = await getCurrentlyReading("16634");
  const token = await getSpotifyAccessToken();

  const currentlyPlaying = await getSpotifyCurrentlyPlaying(
    token?.access_token,
  );

  const albumSrc = currentlyPlaying?.item?.album?.images?.[0]?.url;

  console.log(currentlyReading);

  return (
    <main className="flex min-h-screen items-start p-12 relative font-sans">
      <div className="absolute inset-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff25_1px,#0a0a0a_1px)] bg-[size:20px_20px]" />

      <div className="columns-4 gap-2">
        <Block className="flex items-center gap-2 p-2">
          <Image
            width={40}
            height={40}
            src={portalKey}
            alt="Picture of the author"
            placeholder="blur" // Optional blur-up while loading
          />
          <div>
            <h1 className="font-medium font-title">SJSANC</h1>
            <h2 className="text-xs text-zinc-600">software engineer</h2>
          </div>
        </Block>

        <Block className="p-2">
          <h2 className="font-medium font-title">Did you know?</h2>
          <p className="font-sans text-sm text-zinc-400">
            Something interesting...
          </p>
        </Block>

        <Block className="p-2">
          <a href={currentlyPlaying?.item?.external_urls?.spotify}>
            <Image
              width={250}
              height={250}
              src={albumSrc}
              priority
              alt={"Album cover"}
              className="rounded-lg overflow-hidden mb-2 drop-shadow"
            />
          </a>
          <div className="font-title font-medium">
            <h2 className="font-medium font-sans text-sm text-zinc-700">
              Currently listening...
            </h2>

            <p className="flex items-center gap-2 truncate">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>
                {currentlyPlaying.item?.artists?.map((a) => a.name).join(", ")}
              </span>
              <span>-</span>
              <span>{currentlyPlaying.item?.name}</span>
            </p>
          </div>
        </Block>

        <Block className="p-2">
          <a href={currentlyReading?.url} className="overflow-hidden">
            <Image
              width={250}
              height={250}
              src={currentlyReading?.cover}
              priority
              style={{
                objectFit: "contain", // cover, contain, none
              }}
              alt={"Album cover"}
              className="rounded-lg mb-2 drop-shadow"
            />
          </a>
          <div className="font-title font-medium">
            <h2 className="font-medium font-sans text-sm text-zinc-700">
              Currently reading...
            </h2>

            <p>{currentlyReading?.title}</p>
            <p className="text-xs text-zinc-200 italic">
              {currentlyReading?.authors}
            </p>
          </div>
        </Block>

        <div className="grid grid-cols-4 gap-2">
          <Block className="aspect-square">
            <a
              href="https://www.linkedin.com/in/steven-scheepers-72b45b131/"
              className="flex items-center justify-center text-zinc-800 hover:text-white transition duration-200 h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <title>Linkedin</title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                <path d="M8 11l0 5" />
                <path d="M8 8l0 .01" />
                <path d="M12 16l0 -5" />
                <path d="M16 16v-3a2 2 0 0 0 -4 0" />
              </svg>
            </a>
          </Block>
          <Block className="aspect-square">
            <a
              href="https://github.com/sjsanc"
              className="flex items-center justify-center text-zinc-800 hover:text-white transition duration-200 h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <title>Github</title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
              </svg>
            </a>
          </Block>
          <Block className="aspect-square">
            <a
              href="https://github.com/sjsanc"
              className="flex items-center justify-center text-zinc-800 hover:text-white transition duration-200 h-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <title>CV</title>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                <path d="M11 12.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" />
                <path d="M13 11l1.5 6l1.5 -6" />
              </svg>
            </a>
          </Block>
          <Block className="aspect-square flex items-center justify-center text-zinc-800 hover:text-white transition duration-200 h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <title>Email</title>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
              <path d="M3 7l9 6l9 -6" />
            </svg>
          </Block>
        </div>
      </div>
    </main>
  );
}
