/**
 * @jest-environment node
 */
import fs from 'fs'
import { fetchWowheadData } from '../../../../app/api/wowhead-data/server-function'

describe('fetchWowheadData', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')
  // The module persists every hit to data/wowhead-cache.json; keep the test off disk.
  const writeSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined)

  beforeEach(() => fetchSpy.mockReset())
  afterAll(() => {
    fetchSpy.mockRestore()
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
    // An id that is not in the committed cache, so the code has to go through fetch.
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
    expect(writeSpy).toHaveBeenCalled()
  })
})
