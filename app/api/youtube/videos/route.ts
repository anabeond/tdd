import { NextResponse } from 'next/server'

const API_KEY = process.env.YOUTUBE_API_KEY!

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ids = searchParams.get('ids')
  if (!ids) return NextResponse.json({ error: 'ids required' }, { status: 400 })

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${ids}&part=snippet&key=${API_KEY}`,
      { next: { revalidate: 3600 } },
    )
    const data = await res.json() as {
      items: Array<{
        id: string
        snippet: { title: string; publishedAt: string }
      }>
    }

    const videos = data.items.map((item) => ({
      youtubeId: item.id,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
    }))

    return NextResponse.json(videos)
  } catch (err) {
    console.error('[youtube/videos]', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
