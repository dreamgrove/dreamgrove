import border from 'public/static/images/april/border.png'

export const Poll = () => {
  return (
    <div
      className="flex h-full w-full flex-col px-3 py-2"
      style={{
        borderStyle: 'solid',
        borderWidth: '7px',
        borderImage: `url(${border.src}) 7 fill round`,
        backgroundColor: 'white',
      }}
    >
      <div className="mb-2 text-center">
        <h2 className="font-pixel mb-1 text-2xl font-bold text-[#FF7AAD]">✧ 𝒸𝓊𝓉ℯ 𝓅ℴ𝓁𝓁 ✧</h2>
      </div>
      <div className="flex flex-1 flex-col gap-3 rounded-sm border border-pink-200 bg-white/80 px-3 py-2 text-[#513e58]">
        <form
          method="post"
          action="https://poll.pollcode.com/66746461"
          className="flex flex-1 flex-col gap-2"
        >
          <div className="font-pixel text-lg font-bold text-[#FF7AAD]">
            What's the most adorable thing about Druids?
          </div>
          <label className="font-pixel flex items-center gap-2">
            <input type="radio" name="answer" value="1" className="accent-pink-500" />
            <span className="text-sm">Their little paw prints when in animal form</span>
          </label>
          <label className="font-pixel flex items-center gap-2">
            <input type="radio" name="answer" value="2" className="accent-pink-500" />
            <span className="text-sm">Wiggly butt animation when shifting into Cat Form 🐈</span>
          </label>
          <label className="font-pixel flex items-center gap-2">
            <input type="radio" name="answer" value="3" className="accent-pink-500" />
            <span className="text-sm">Moonkin dance party!!!</span>
          </label>
          <label className="font-pixel flex items-center gap-2">
            <input type="radio" name="answer" value="4" className="accent-pink-500" />
            <span className="text-sm">Trees, flowers, and nature :3</span>
          </label>
          <div className="mt-auto flex justify-center gap-2">
            <input
              type="submit"
              value=" Vote "
              className="font-pixel cursor-pointer rounded-sm border border-pink-200 bg-white/80 px-4 py-1 text-sm text-[#FF7AAD] hover:bg-pink-50"
            />
            <input
              type="submit"
              name="view"
              value=" View "
              className="font-pixel cursor-pointer rounded-sm border border-pink-200 bg-white/80 px-4 py-1 text-sm text-[#FF7AAD] hover:bg-pink-50"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
