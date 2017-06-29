import Base from '../core'

export class Header extends Base {
	constructor(el) {
		super(el)
		log('Header')
	}

	destroy() {
		log('destroy Header')
	}

	mounted() {
		log('mount Header')
	}
}