import Base from '../helpers/base'
import SideNav from '../helpers/sidenav'

export class mobileMenu extends Base {
	constructor(el) {
		super(el)
		const viewport = this.viewport

		const sidenav = new SideNav(el.querySelector('.js-mobile-nav-btn'), {
			init: false,
			lock: true
		})


		// at method takes two/three/four arguments
		// the first is the media query to test
		// the second argument is a function, that is called once
		// and only once the first argument evaluates to true
		// the third (optional) argument is another function
		// that is called once and only once the first argument
		// evaluates as false
		// the forth arugment is a bollean that sets the method to
		// automatically listen resize events, the default value is true

		// viewport.on('resize', (e) => log(e))

		viewport.at(
			'(max-width: 46.25em)',
			(e) => {
				sidenav.addEvents()
				log(e)
			},
			(e) => {
				sidenav.destroy()
				log(e)
			}
		)

		// now that this at method exists we can listen to events/

		// viewport.on('pass:at:(max-width: 46.25em)', (e) => log(e,'pass:at:(max-width: 46.25em)'))
		// viewport.on('fail:at:(max-width: 46.25em)', (e) => log(e,'fail:at:(max-width: 46.25em)'))

		// when method is basically the same as the at method/
		// except the pass method is called on every resize
		// whereas the fail method is only called once, like the at method
		// this method is only called on resize
		// viewport.when(
		// 	'(max-width: 46.25em)',
		// 	(e) => {
		// 		log('Wowsa, I sense the browser is being resized above 46.25em', e)
		// 	},
		// 	(e) => {
		// 		log('Aaand rest, thanks for stopping', e)
		// 	}
		// )
		//
		// viewport.on('pass:when:(max-width: 46.25em)', () => log('pass:when:(max-width: 46.25em)'))
		// viewport.on('fail:when:(max-width: 46.25em)', () => log('fail:when:(max-width: 46.25em)'))
	}
}
