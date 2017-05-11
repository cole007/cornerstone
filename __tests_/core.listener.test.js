import Listener from '../src/js/core/listener'

test('Listener: when called it creates an instance of Listener ', () => {
	expect(new Listener()).toBeInstanceOf(Listener)
})

test('Listener: new instances refer to the same singleton ', () => {
	const mockFn = jest.fn()
	const a = new Listener()
	const b = new Listener()
	mockFn.mock.instances[0] = a
	mockFn.mock.instances[1] = b
	expect(mockFn.mock.instances[0]).toBe(mockFn.mock.instances[1])
})

test('Listener: the inherited functions are alive ', () => {
	const a = new Listener()
	expect(a.on).toBeInstanceOf(Function)
	expect(a.once).toBeInstanceOf(Function)
	expect(a.off).toBeInstanceOf(Function)
	expect(a.trigger).toBeInstanceOf(Function)
})