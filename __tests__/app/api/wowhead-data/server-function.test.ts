/**
 * @jest-environment node
 */
import fs from 'fs'
import { fetchWowheadData } from '../../../../app/api/wowhead-data/server-function'

describe('fetchWowheadData', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')
  // The module reads data/wowhead-cache.json once and persists every fetched
  // result back to it. Start it from an empty cache and keep it off disk, so
  // the tests neither depend on the committed entries nor add to them.
  const existsSpy = jest.spyOn(fs, 'existsSync').mockReturnValue(false)
  const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined)

  beforeEach(() => fetchSpy.mockReset())
  afterAll(() => {
    fetchSpy.mockRestore()
    existsSpy.mockRestore()
    writeSpy.mockRestore()
  })

  test('refuses a URL it cannot take an id from instead of caching under an empty key', async () => {
    await expect(
      fetchWowheadData({
        id: '',
        type: 'spell',
        name: '',
        url: 'https://www.wowhead.com/guide/classes/druid',
      })
    ).rejects.toThrow(/No spell id/)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('refuses a call with neither id nor url', async () => {
    await expect(fetchWowheadData({ id: '', type: 'item', name: 'x' })).rejects.toThrow(
      /No item id/
    )
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  test('takes the id from the url when none is given', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ name: 'Test Spell', icon: 'inv_misc_questionmark' }), {
        status: 200,
      })
    )
    const data = await fetchWowheadData({
      id: '',
      type: 'spell',
      name: '',
      url: 'https://ko.wowhead.com/spell=999999901',
    })
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://nether.wowhead.com/tooltip/spell/999999901',
      expect.anything()
    )
    expect(data.display).toBe('Test Spell')
    const [file, json] = writeSpy.mock.calls.at(-1) as [string, string]
    expect(file).toMatch(/data[\\/]wowhead-cache\.json$/)
    expect(JSON.parse(json)['spell-999999901']).toMatchObject({
      display: 'Test Spell',
      icon: 'inv_misc_questionmark',
    })
  })

  test('names the entry from the URL when the tooltip JSON has no name', async () => {
    // A fresh Response per call: a body can only be read once.
    fetchSpy.mockImplementation(
      async () => new Response(JSON.stringify({ icon: 'x' }), { status: 200 })
    )
    const withSlug = await fetchWowheadData({
      id: '',
      type: 'spell',
      name: '',
      url: 'https://www.wowhead.com/spell=999999902/some-slug',
    })
    expect(withSlug.display).toBe('Some Slug')

    const slugless = await fetchWowheadData({
      id: '',
      type: 'spell',
      name: '',
      url: 'https://www.wowhead.com/spell=999999903',
    })
    expect(slugless.display).toBe('spell-999999903')
  })
})
