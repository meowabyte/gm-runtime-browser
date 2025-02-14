import Browser from "@/components/browser";
import Image from "next/image";
import GameMakerLogo from "#/img/gm.webp"
import CodeBlock from "@/components/codeblock";

export default function Home() {
  return <>
  <header className="p-8 flex flex-col justify-center items-center gap-5 text-center w-1/2 place-self-center">
    <div className="flex flex-col justify-center items-center gap-3">
      <Image priority height={150} src={GameMakerLogo} alt="Gamemaker Logo" />
      <h1 className="text-primary">GM Runtime Browser</h1>
    </div>
    <span className="text-lg">
      Browse various GameMaker runtimes for various platforms.<br/>
      I mainly made this tool because I wanted to experiment with porting Windows-only mods/games to Linux so easily accessible Runtimes will be useful for me (and maybe <b>you</b>!)
    </span>
  </header>
  <main className="flex flex-col gap-10 justify-center items-center place-self-center m-10 w-3/4">
    <Browser />
    <div className="flex flex-col gap-8 *:flex *:flex-col *:gap-2">
      <h1>FAQ:</h1>
      <div>
        <h2>Why passwords? How do they work?</h2>
        <span>
          Shout out to <a href="https://mike309game.github.io/gms.html">this page</a> for calculations.
          All packages have been password protected by YoYo Games as part of a security, probably so people couldnt be able to play with it outside of the editor.
          Yet, some of the smart people were able to find out how to get around it.
          <br /><br />
          The password is created by grabbing the <code>ID</code> of the runtime and it&apos;s extension (<code>EXT</code>), then prefixing it with <code>MRJA</code> and suffixing with <code>PHMD</code>.
          The string&apos;s gonna look something like this: <code className="text-neutral-500">MRJA<span className="text-primary">ID.EXT</span>PHMD</code>.
          Then, you hash the string with special implementation of md5 hashing and returned buffer encode into base64.
          <br /><br />
          <b>Here&apos;s example in JavaScript using my package &quot;<a href="https://github.com/kvba5/Yoyo-MD5">yoyo-md5</a>&quot;:</b>
          <CodeBlock code={
`
import { yoyomd5 } from "yoyo-md5"

const ID = "abc"
const EXT = "zip"

// MRJAabcPHMD
const str = \`MRJA\${ID}.\${EXT}PHMD\`

const password = yoyomd5(str)

// Output: "92NrMoGv3KF1Eu0wIZeXoA=="
console.log(password)
`
          } />
        </span>
      </div>
    </div>
    <div>
      <h2>What&apos;s the difference between Main/Beta/Old&lt;year&gt;?</h2>
      <span>
        Every type gets runtimes from different sources. These sources are:
        <br /><br />
        <b>Main</b> - Up to date, latest versions of runtimes available in GM.<br />
        <b>Beta</b> - Even more up to date, beta versions of runtimes available in GM. Usually have new features quicker than latest ones for the price of stability. Optional on stable version of GM and required when using GM on Linux.<br />
        
        <b>Old &lt;year&gt;</b> - These runtimes are usually taken from <a href="http://web.archive.org/web/*/http://gms.yoyogames.com/Zeus-Runtime.rss">Web archive</a> as they are not listed on official lists anymore.
        For some reason these files are still kept on GM servers so you don&apos;t need to access them through Web archive yourself.

      </span>
    </div>
  </main>
  <footer className="text-secondary w-3/4 text-center place-self-center *:block p-10">
    <span>Created with <span className="animate-pulse text-primary">&lt;3</span> by <a href="https://meowpa.ws">kvba5</a></span>
    <span>GM Runtime Browser is a third party website and is not associated or partnered with YoYo Games, GameMaker or any of it&apos;s partners in any way.</span>
    <span>None of the files presented on here are hosted on the website.</span>
  </footer>
  </>
}
