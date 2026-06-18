import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.TWITCH_CLIENT_ID!
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET!
const CHANNEL = process.env.TWITCH_CHANNEL_NAME!

let cachedToken: { value: string; expiresAt: number } | null = null
let cachedUserId: string | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' }),
  })
  const data = await res.json() as { access_token: string; expires_in: number }
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 }
  return cachedToken.value
}

async function getUserId(headers: Record<string, string>): Promise<string> {
  if (cachedUserId) return cachedUserId
  const res = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(CHANNEL)}`, { headers })
  const data = await res.json() as { data: Array<{ id: string }> }
  cachedUserId = data.data[0].id
  return cachedUserId
}

export async function GET() {
  try {
    const token = await getAccessToken()
    const headers = { 'Client-ID': CLIENT_ID, Authorization: `Bearer ${token}` }

    const userId = await getUserId(headers)

    const [streamRes, videoRes] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, { headers, next: { revalidate: 60 } }),
      fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&type=archive&first=1`, { headers, next: { revalidate: 3600 } }),
    ])

    const streamData = await streamRes.json() as { data: Array<{ title: string; viewer_count: number }> }
    const videoData = await videoRes.json() as { data: Array<{ id: string; thumbnail_url: string }> }

    const stream = streamData.data[0]
    const video = videoData.data[0]

    return NextResponse.json({
      live: !!stream,
      title: stream?.title ?? null,
      viewerCount: stream?.viewer_count ?? null,
      videoId: video?.id ?? null,
    })
  } catch (err) {
    console.error('[twitch/status]', err)
    return NextResponse.json({ live: false, thumbnailUrl: null })
  }
}
