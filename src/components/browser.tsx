"use client"

import {
    type EntryType, type RuntimeVersionItem,
    entryTypeKeys
} from "@/types/runtime"

import { useCallback, useEffect, useMemo, useState } from "react"
import Loading from "./loading"
import { normalizeId } from "@/app/helpers/string"
import { compare as compareversions } from "compare-versions"
import { yoyomd5 } from "yoyo-md5"


type RuntimeVersionItemExt = RuntimeVersionItem & {
    id: string,
    password: string
}

// TODO: fix md5
const itemUrlToId = (url: string) => new URL(url).pathname.split(/[\/\.]/)[1]
const itemIdToPass = (id: string) => btoa(yoyomd5(`MRJA${id}.zipPHMD`))

const extendItem = (i: RuntimeVersionItem): RuntimeVersionItemExt => {
    const id = itemUrlToId(i.url)
    const password = itemIdToPass(id)

    return {
        ...i,
        id, password
    }
}

const MAX_PER_PAGE = 5
export default function Browser() {
    const [type, setType] = useState<EntryType>("main")
    const [platform, setPlatform] = useState<string | undefined>()
    const [version, setVersion] = useState<string | undefined>()

    const [items, setItems] = useState<RuntimeVersionItemExt[] | null>(null)

    const [page, setPage] = useState(0);

    const filteredItems = useMemo(() => 
        (items ?? [])
            .filter(i =>
                (!platform || i.platform === platform) &&
                (!version || i.version === version)
            )
            .map(({id, platform, url, version, password}, i) =>
                <tr key={`runtimeitem-${i}`}>
                    <td><code>{id}</code></td>
                    <td><code>{platform}</code></td>
                    <td><a href={url}>Download</a></td>
                    <td><code>{version}</code></td>
                    <td><code>{password}</code></td>
                </tr>
            ),
    [items, platform, version])

const maxPages = useMemo(() => Math.floor(filteredItems.length / MAX_PER_PAGE) + 1, [filteredItems.length])

    useEffect(() => {
        const fetchItems = async () => {
            const resp = await fetch(`/api/entries/${type}`)
            if (!resp.ok) return;

            const json: RuntimeVersionItem[] = await resp.json()
            setItems(
                json.map(extendItem).sort((a, b) => Number(compareversions(a.version, b.version, ">")))
            )

        }

        fetchItems()
        return () => setItems(null)
    }, [type])

    const nextPage = useCallback(() => setPage(p => p + 1), [])
    const previousPage = useCallback(() => setPage(p => p - 1), [])

    const resetFilters = useCallback(() => {
        setPlatform(undefined)
        setVersion(undefined)
    }, [])

    useEffect(() => {
        resetFilters()
    }, [resetFilters, items])

    useEffect(() => {
        setPage(0)
    }, [filteredItems])

    if (!items) return <Loading />

    return <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between flex-wrap">
            <div>
                <label>Types:</label>
                <select value={type} onChange={e => setType(e.currentTarget.value as EntryType)}>
                    {
                        entryTypeKeys
                            .map(k => <option key={`entrytype-${k}`} value={k}>{normalizeId(k)}</option>)
                    }
                </select>
            </div>
            <div>
                <label>Platform:</label>
                <select value={platform} onChange={e => setPlatform(e.currentTarget.value)}>
                    {
                        Array.from(new Set(items.map(i => i.platform)))
                            .map(p => <option key={`platform-${p}`} value={p}>{p}</option>)
                    }
                </select>
            </div>
            <div>
                <label>Version:</label>
                <select value={version} onChange={e => setVersion(e.currentTarget.value)}>
                    {
                        Array.from(new Set(items.map(i => i.version)))
                            .map(v => <option key={`version-${v}`} value={v}>{v}</option>)
                    }
                </select>
            </div>
            <button onClick={resetFilters}>Reset filter</button>
        </div>
        <table>
            <tbody>
                <tr>
                    <td>ID</td>
                    <td>Platform</td>
                    <td>URL</td>
                    <td>Version</td>
                    <td>Password</td>
                </tr>
                {
                    filteredItems
                        .slice(page * MAX_PER_PAGE, (page+1) * MAX_PER_PAGE)
                }
            </tbody>
        </table>
        {filteredItems.length === 0 && <span className="text-center">No items found! qwq</span>}
        <div className="place-self-center w-64 grid grid-cols-3 text-center p-2">
            {page > 0 ? <button onClick={previousPage}>Prev.</button> : <div />}
            <span className="font-bold">{page + 1}/{maxPages}</span>
            {page + 1 < maxPages ? <button onClick={nextPage}>Next</button> : <div />}
        </div>
    </div>
}