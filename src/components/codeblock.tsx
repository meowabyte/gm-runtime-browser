import "highlight.js/styles/cybertopia-icecap.min.css"

import hljs from "highlight.js/lib/core"
import hljsJavascriptLib from "highlight.js/lib/languages/javascript"
import { useMemo } from "react"

const LANGUAGES = {
    "javascript": hljsJavascriptLib
} as const

type SupportedLanguages = keyof typeof LANGUAGES

for (const [name, langDefinition] of Object.entries(LANGUAGES)) hljs.registerLanguage(name, langDefinition)

type Props = {
    code: string,
    language?: SupportedLanguages
}

export default function CodeBlock({ code, language = "javascript" }: Props) {
    const highlighted = useMemo(() => hljs.highlight(code.trim(), { language }), [code, language])

    return <pre>
        <code className="hljs" dangerouslySetInnerHTML={{ __html: highlighted.value }}></code>
    </pre>
}