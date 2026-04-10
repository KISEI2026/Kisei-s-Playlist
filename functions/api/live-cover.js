const BILIBILI_H5_INFO_API =
  "https://api.live.bilibili.com/xlive/web-room/v1/index/getH5InfoByRoom?room_id=";
const BILIBILI_LIVE_URL = "https://live.bilibili.com/";

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const roomId = (url.searchParams.get("roomId") || "").trim();

  if (!/^\d+$/.test(roomId)) {
    return json(
      {
        ok: false,
        error: "Invalid roomId",
      },
      400
    );
  }

  const upstream = await fetch(BILIBILI_H5_INFO_API + encodeURIComponent(roomId), {
    method: "GET",
    headers: {
      accept: "application/json, text/plain, */*",
      "user-agent": "Cloudflare Pages Function",
    },
  });

  if (!upstream.ok) {
    return json(
      {
        ok: false,
        error: "Upstream request failed",
        status: upstream.status,
      },
      502
    );
  }

  const payload = await upstream.json();
  const roomInfo = (payload && payload.data && payload.data.room_info) || {};
  const anchorBase =
    (payload &&
      payload.data &&
      payload.data.anchor_info &&
      payload.data.anchor_info.base_info) ||
    {};

  return json({
    ok: true,
    data: {
      roomId: String(roomInfo.room_id || roomId),
      href: BILIBILI_LIVE_URL + String(roomInfo.room_id || roomId),
      cover: roomInfo.cover || "",
      coverProxyUrl: "/api/live-cover-image?roomId=" + encodeURIComponent(roomId),
      title: roomInfo.title || "",
      liveStatus: roomInfo.live_status ?? null,
      anchorName: anchorBase.uname || "",
    },
  });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=60",
    },
  });
}
