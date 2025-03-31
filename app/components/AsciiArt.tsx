// @ts-nocheck
/* eslint-disable no-irregular-whitespace */

import border from 'public/static/images/april/border.png'
import dot from 'public/static/images/april/dot.jpg'
import tree from 'public/static/images/april/tree.png'
import Image from 'next/image'

export const AsciiArt = () => {
  const art = `           _____
　　　　　 /  ＞　　フ meoowowwerrr mewowowo mewurrr      
　　　　　| 　◉　 ◉ l     prr prr prrr
　 　　　／\` ミ＿ᴥノ  
　　 　 /　　　 　|
　　　 /　 ヽ　　 ﾉ                            ╱|、
　 　 │　　|　|　|                           (˚ˎ。7
　／￣|　　 |　|　|                           |、˜〵
　| (￣ヽ＿_ヽ_)__)                          じしˍ,)ノ
　＼二つ`
  return (
    <div
      className="relative flex h-full w-full flex-col p-3 pb-0 "
      style={
        {
          //borderStyle: 'solid',
          //borderWidth: '7px',
          //borderImage: `url(${border.src}) 7 fill round`,
          //backgroundColor: 'white',
        }
      }
    >
      <pre className="z-10 mb-[-1.75rem] flex flex-1 items-end justify-end font-mono text-sm text-[#4b2e39]">
        <code>{art}</code>
      </pre>
    </div>
  )
}
