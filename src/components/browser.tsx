"use client"

import type { EntryType, RunnerData, RunnerVersionItem } from "@/types/runtime"

import { entryTypeKeys } from "@/types/runtime"
import { useCallback, useEffect, useMemo, useState } from "react"
import { normalizeId } from "@/helpers/string"
import { compare as compareversions } from "compare-versions"
import { yoyomd5 } from "yoyo-md5"
import { Loader2 } from "lucide-react"
import Copyable from "./copyable"



const extendRunner = (i: RunnerVersionItem): RunnerData => {
    const fileName = new URL(i.url, location.href).pathname.replace(/^.*\//, "")
    const id = fileName.replace(/\.[^.]*$/, "")
    const password = Buffer.from(yoyomd5(`MRJA${id}.zipPHMD`), "binary").toString("base64")

    return {
        ...i,
        id, password
    }
}

export default function Browser() {
    // Filters
    const [type, setType] = useState<EntryType>("main")
    const [platform, setPlatform] = useState<string | undefined>()
    const [version, setVersion] = useState<string | undefined>()

    const resetFilters = useCallback(() => {
        setPlatform(undefined)
        setVersion(undefined)
    }, [])

    // Items and pages
    const [items, setItems] = useState<RunnerData[] | null>(null)
    const [perPage, setPerPage] = useState(5)
    const [page, setPage] = useState(0);

    const nextPage = useCallback(() => setPage(p => p + 1), [])
    const previousPage = useCallback(() => setPage(p => p - 1), [])

    // Item elements
    const showArchiveDownload = useMemo(() => type.startsWith("old"), [type])
    const filteredItems = useMemo(() => {
        if (!items || items.length === 0) return []
        
        return items
            .filter((r, i, arr) =>
                (!platform || r.platform === platform) &&
                (!version || r.version === version) &&
                arr.findIndex(x => r.id === x.id) === i
            )
            .map(({id, platform, url, version, password}, i) =>
                <tr key={`runner-${id}`}>
                    <td><code>{id}</code></td>
                    <td><code>{platform}</code></td>
                    <td className="*:block">
                        <a download href={url} target="_blank">Download</a>
                        {showArchiveDownload && <a download href={`https://web.archive.org/web/2oe_/${url}`} target="_blank">Archive</a>}
                    </td>
                    <td><code>{version}</code></td>
                    <td><Copyable><code>{password}</code></Copyable></td>
                </tr>
            )
    }, [items, platform, version, showArchiveDownload])
    const maxPages = useMemo(() => Math.floor(filteredItems.length / perPage) + 1, [filteredItems.length, perPage])

    useEffect(() => {
        const fetchSignal = new AbortController()
        const fetchItems = async () => {
            const resp = await fetch(`/api/entries/${type}`, {
                signal: fetchSignal.signal
            })
            if (!resp.ok) {
                setItems([])
                alert("Could not get runners! ( ｡ •̀ ᴖ •́ ｡) Try again later")
                return
            }

            const json: RunnerVersionItem[] = await resp.json()
            setItems(
                json.map(extendRunner)
                    .toSorted((a, b) => Number(compareversions(a.version, b.version, ">")))
            )
        }

        fetchItems()
        return () => {
            if (!fetchSignal.signal.aborted) fetchSignal.abort()
            setItems(null)
        }
    }, [type])

    // Reset filters if source changed
    useEffect(() => { resetFilters() }, [resetFilters, items])

    // Prevent page overflowing
    useEffect(() => {
        setPage(Math.min(page, maxPages-1))
    }, [filteredItems])

    if (!items) return <Loader2 className="animate-spin" />

    return <div className="flex flex-col gap-5">
        <div className="flex flex-row justify-center gap-12 flex-wrap">
            <div>
                <label>Source:</label>
                <select value={type} onChange={e => setType(e.currentTarget.value as EntryType)}>
                    {
                        entryTypeKeys
                            .map(k => <option key={`option-${k}`} value={k}>{normalizeId(k)}</option>)
                    }
                </select>
            </div>
            <div>
                <label>Platform:</label>
                <select value={platform ?? "none"} onChange={({ target: { value: v } }) => setPlatform(v === "none" ? undefined : v)}>
                    <option value="none">&lt;any&gt;</option>
                    {
                        Array.from(new Set(items.map(i => i.platform)))
                            .map(p => <option key={`option-${p}`} value={p}>{normalizeId(p)}</option>)
                    }
                </select>
            </div>
            <div>
                <label htmlFor="">Version:</label>
                <select value={version ?? "none"} onChange={({ target: { value: v } }) => setVersion(v === "none" ? undefined : v)}>
                    <option value="none">&lt;any&gt;</option>
                    {
                        Array.from(new Set(items.map(i => i.version)))
                            .map(v => <option key={`option-${v}`} value={v}>{v}</option>)
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
                        .slice(page * perPage, (page+1) * perPage)
                }
            </tbody>
        </table>
        {filteredItems.length === 0 && <span className="text-center text-secondary">No items found! (╥﹏╥)</span>}

        <div className="flex flex-row w-full">
            <div className="flex flex-row grow justify-center">
                {filteredItems.length > 0 &&
                    <div className="grid grid-cols-3 gap-12 w-max text-center p-2">
                        {page > 0 ? <button onClick={previousPage}>Prev.</button> : <div />}
                        <span className="font-bold">{page + 1}/{maxPages}</span>
                        {page + 1 < maxPages ? <button onClick={nextPage}>Next</button> : <div />}
                    </div>
                }
            </div>
            <select value={perPage} onChange={({ target: { value: v } }) => setPerPage(parseInt(v) ?? 5)}>
                {
                [5, 10, 15, 20].map(n => <option key={`perpage-${n}`} value={n}>{n}</option>)
                }
            </select>
        </div>
    </div>
}
