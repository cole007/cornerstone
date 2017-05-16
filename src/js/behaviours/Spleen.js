import Base from '../core'

export class Spleen extends Base {
	constructor(document) {
		super(document, 'spleen')
	}

	events = {
		'click .menu-btn':  (e, elm) => {
			e.preventDefault()
			log('menu', this, elm)
		}
	}

	onLeave(resolve) {
		log('onLeave spleen')
		setTimeout(() => {
			log('Resolved spleen')
			resolve()
		}, 5000)
	}
}