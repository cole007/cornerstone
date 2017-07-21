import Listener from '../core/listener'
import { Dispatcher, Prefetch, Pjax, HistoryManager, BaseTransition } from 'barba.js'
import pathToRegexp from 'path-to-regexp'

const transition = BaseTransition.extend({
	start: function () {
		log('start trans')
		this.newContainerLoading.then(() => this.done())
	},

	done: function () {
		log('end trans')
		this.oldContainer.parentNode.removeChild(this.oldContainer)
		this.newContainer.style.visibility = 'visible'
		this.deferred.resolve()
	}
})

export default class RouteManager {
	constructor(routes) {
		this.routes = routes
		this.listener = new Listener()
		this.clicked = false
	}

	get container() {
		return document.querySelector(`.${Pjax.Dom.containerClass}`)
	}

	getRouterObject(path) {
		const pattern = pathToRegexp('/:foo/:bar?')
		return pattern.exec(path.split('.')[0])
	}

	currentRoute() {
		return {
			path: this.getRouterObject(window.location.pathname),
			namespace: Pjax.Dom.getNamespace(this.container)
		}
	}

	getRoute(href) {
		return {
			path: this.getRouterObject(href),
			namespace: null
		}
	}

	match(pathname) {
		HistoryManager.routes = {
			from: this.currentRoute(),
			to: this.getRoute(pathname)
		}
	}

	mount(loader) {
		Pjax.getTransition = function () {
			return transition.extend({
				loader
			})
		}

		Dispatcher.on('linkClicked', (HTMLElement) => {
			this.clicked = true
			const { pathname } = HTMLElement
			this.match(pathname)
		})

		Dispatcher.on('initStateChange', (/*currentStatus*/) => {})

		Dispatcher.on('newPageReady', (x, y, HTMLElementContainer) => {
			if(this.clicked) {
				loader.unmount().update(HTMLElementContainer, false)
			}
		})

		Dispatcher.on('transitionCompleted', (/*currentStatus, prevStatus*/) => {
			if(this.clicked) {
				log('transitionCompleted')
			}
		})

		Pjax.Dom.containerClass = 'barba-container'
		Pjax.Dom.wrapperId = 'barba-wrapper'

		Prefetch.init()
		Pjax.start()
	}
}
