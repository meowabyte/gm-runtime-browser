import { MouseEvent } from "react"

export default function Copyable({ children }: { children: React.ReactNode }) {
    const copyFromElement = (ev: MouseEvent<HTMLDivElement>) => {
        navigator.clipboard.writeText(ev.currentTarget.innerText)
            .then(() => alert("Copied! ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧"))
            .catch(() => alert("Could not copy... (╥﹏╥) Please allow for copying!"))
    }

    return <div onClick={copyFromElement} className="cursor-pointer">
        {children}
    </div>
}