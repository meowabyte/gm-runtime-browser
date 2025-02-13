import {
    type EntryType, type RuntimeVersionItem,
    EntryTypes
} from "@/types/runtime";

const VERSION_REGEX = /module name="([\w\.]+)?" url="([\w:/\.-]+)?" sparkle:version="([\d\.]+?)"/g

export const dynamic = 'force-static'
export const revalidate = 3600;

export function generateStaticParams() {
    return Object.keys(EntryTypes).map(type => ({ type }))
}


const parseRSS = (str: string): RuntimeVersionItem[] => {
    const matches = str.matchAll(VERSION_REGEX)
    return Array.from(matches)
        .map<RuntimeVersionItem>(([, platform, url, version]) => ({ platform, url, version }))
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ type: string }> }
) {
    const { type } = await params;
    if (!type || !Object.keys(EntryTypes).includes(type)) return new Response(null, { status: 400 })

    const parsed = parseRSS(
        await fetch(EntryTypes[type as EntryType]).then(r => r.text())
    )

    return Response.json(parsed)
}