const BILIBILI_H5_INFO_API =
  "https://api.live.bilibili.com/xlive/web-room/v1/index/getH5InfoByRoom?room_id=";
const BILIBILI_LIVE_URL = "https://live.bilibili.com/";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const roomId = (url.searchParams.get("roomId") || "").trim();

  if (!/^\d+$/.test(roomId)) {
    return new Response("Invalid roomId", { status: 400 });
  }

  const upstream = await fetch(BILIBILI_H5_INFO_API + encodeURIComponent(roomId), {
    method: "GET",
    headers: {
      accept: "application/json, text/plain, */*",
      "user-agent": "Cloudflare Pages Function",
    },
  });

  if (!upstream.ok) {
    return new Response("Failed to fetch room info", { status: 502 });
  }

  const payload = await upstream.json();
  const roomInfo = (payload && payload.data && payload.data.room_info) || {};
  const coverUrl = String(roomInfo.cover || "").trim();

  if (!coverUrl) {
    return new Response("Cover not found", { status: 404 });
  }

  const imageResponse = await fetch(coverUrl, {
    method: "GET",
    headers: {
      accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      referer: BILIBILI_LIVE_URL + encodeURIComponent(roomId),
      origin: BILIBILI_LIVE_URL,
      "user-agent": "Mozilla/5.0 (compatible; Cloudflare Pages Function)",
    },
  });

  if (!imageResponse.ok) {
    return new Response("Failed to fetch cover image", { status: 502 });
  }

  const headers = new Headers();
  headers.set(
    "content-type",
    imageResponse.headers.get("content-type") || "image/jpeg"
  );
  headers.set("cache-control", "public, max-age=300");

  return new Response(imageResponse.body, {
    status: 200,
    headers,
  });
}
