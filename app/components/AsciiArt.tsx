// @ts-nocheck
 
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
    <div className="relative flex h-full w-full flex-col p-3 pb-0">
      <pre className="z-10 -mb-7 flex flex-1 items-end justify-end font-mono text-sm text-[#4b2e39]">
        <code>{art}</code>
      </pre>
    </div>
  )
}
