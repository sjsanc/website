import { loadEnvConfig } from "@next/env";
loadEnvConfig(".");

const getRefreshToken = async (code: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "Unable to generate refresh token due to missing env variable"
    );
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      body: params,
    });

    const data = await response.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

const printRefreshToken = async () => {
  const code = process.argv[2];

  const token = await getRefreshToken(code);

  console.log(token);
};

printRefreshToken();
