import Browser from "@/components/browser";
import Image from "next/image";
import GameMakerLogo from "@/img/gm.webp"
import CodeBlock from "@/components/codeblock";

function Header() {
  return <header className="flex flex-col items-center gap-5 place-self-center p-8 w-1/2 text-center">

    <div className="flex flex-col gap-3 items-center">
      <Image priority height={150} src={GameMakerLogo} alt="Gamemaker Logo" />
      <h1 className="text-primary">GM Runner Browser</h1>
    </div>

    <span className="text-lg">
      Browse through huge collection of GameMaker runners for various platforms!
    </span>

  </header>
}

const CODE_EXAMPLE = `
import { yoyomd5 } from "yoyo-md5"

const ID = "abc"
const EXT = "zip"

// MRJAabcPHMD
const str = \`MRJA\${ID}.\${EXT}PHMD\`

const password = yoyomd5(str)

// Output: "92NrMoGv3KF1Eu0wIZeXoA=="
console.log(password)
` as const

function Content() {
  return <main className="flex flex-col gap-10 justify-center items-center place-self-center m-10 w-3/4">
    <Browser />

    <div className="flex flex-col gap-10 *:flex *:flex-col *:gap-2">
      <h1>FAQ:</h1>

      <div>
        <h2>Why passwords? How do they work?</h2>

        <span>
          Shout out to <a href="https://mike309game.github.io/gms.html">this page</a> for calculations.
          All packages have been password protected by YoYo Games as part of a security.
          Yet, some smart people were able to figure out how to replicate those.
          <br /><br />
          The password is created by grabbing the <b>ID</b> of the runner and it&apos;s <b>extension</b>, then prefixing it with <code>MRJA</code> and suffixing with <code>PHMD</code>.
          The string&apos;s gonna look like this: <code>MRJA<span className="text-primary">ID.EXT</span>PHMD</code> (Replace ID and EXT with valid data),
          hash the result with implementation of MD5 designed specifically for YoYo passwords and then encode buffer into base64.
          <br /><br />
          <b>Here&apos;s an example in JavaScript using my package - <a href="https://github.com/meowabyte/Yoyo-MD5">yoyo-md5</a>:</b>
          <CodeBlock code={CODE_EXAMPLE} />
        </span>
      </div>

      <div>
        <h2>What&apos;s the difference between all the runner sources?</h2>

        <span>
          Each one grabs runner from different source or branch of it:
          <br />
          <br />
          <b>Main</b> - The current branch of runners available straight from GameMaker Studio 2<br />
          <b>Beta</b> - Branch with less stable runners, usually with new features being earlier. Can be obtained through GameMaker Studio 2 on Windows version and are the only branch on Linux version.<br />
          <b>Old &lt;year&gt;</b> - Outdated, old runners grabbed using <a href="http://web.archive.org/web/*/http://gms.yoyogames.com/Zeus-Runtime.rss">Web Archive</a>.
          For some reason a lot of files in those branches are still kept on GM servers so you don&apos;t need to access them through archive yourself.
          The button for archive download is there anyways in case some don't exist. <b>(Some might not be archived!)</b>
        </span>
      </div>

      <div>
        <h2>Where are GameMaker Studio 1/GameMaker 8.0/etc. runners?</h2>

        <span>
          Since it&apos;s really difficult to find archives of such old stuff for a long time I thought it would be impossible. <br />
          But... You can do it now! <i>(partially)</i> <a href="https://archive.org/details/GameMakerStudioModules" target="_blank">Go to this archive website</a>,
          you should have direct download for all supported by <b>GameMaker Studio 1.4.9999</b> platforms! Just download and pick which one you need the most.
          <br />
          <br />
          For other - GMS1, GM8.0 or even older - runners you can try your luck by exploring files of old <a href="https://archive.org/details/GMStudio1.4.x" target="_blank">GameMaker Studio 1.4.X</a> or <a href="https://archive.org/details/GameMaker81" target="_blank">GameMaker Studio 8.1</a>.
        </span>
      </div>
    </div>
  </main>
}

function Footer() {
  return <footer className="flex flex-col place-self-center p-10 w-3/4 text-secondary text-center">
    <span>Created with <span className="animate-pulse text-primary">&#9829;</span> by <a href="https://meowpa.ws">meowabyte</a></span>
    
    <span>
      GM Runner Browser is a third party website and is not associated or partnered with YoYo Games, GameMaker or any of it&apos;s partners in any way.
      None of the files presented on here are hosted on the website.
    </span>
  </footer>
}

export default function Home() {
  return <>
    <Header />
    <Content />
    <Footer />
  </>
}
