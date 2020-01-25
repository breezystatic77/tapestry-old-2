import * as utils from './utils'

const ID = '67469959-dc91-4aa9-8232-0a93fa223175'

it('roomSocketName()', () => {
	expect(utils.roomSocketName(ID)).toBe(`room:${ID}`)
})

it('roomIdFromSocketName()', () => {
	expect(utils.roomIdFromSocketName(`room:${ID}`)).toBe(ID)
})
