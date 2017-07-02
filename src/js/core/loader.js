import { Pjax } from 'barba.js'
import { DomClosest } from '../utils/dom'
// import * as views from '../views'
import RouteManager from './router'

/**
 * Returns an array of nodes with a data-behaviour attribute
 *
 * @function  getNodes
 * @param {HTMLElement} context, the current context
 * @return {Array}
 */

function getNodes(context = document) {
	return [...context.querySelectorAll('*[data-behaviour]')]
}

/**
 * Loop through all of the current nodes with a data-behaviour attributes
 * Instantiate each behaviour as a new constructor function
 *
 * @function  gatherBehaviours
 * @param {Array} nodes, an array of elements with data attributes
 * @return {Array}
 */

function gatherBehaviours(nodes) {
	return nodes.map((node) => {
		const behaviours = node.getAttribute('data-behaviour').split(' ')
		return behaviours.map((behaviourName) => {
			return { behaviourName, node: node}
		})
	})
	.reduce((acc, curr) => [ ...acc, ...curr ], [])
}

/**
 * Manages data-behaviours, integrated with Barba.js
 *
 * @class  Loader
 */
export default class Loader {
	/**
	 * Manages data-behaviours, integrated with Barba.js
	 *
	 * @function  constructor
	 * @param {HTMLElement} context, the current context
	 * @param {Object} behaviours, Object of behaviour constructors
	 */
	constructor(context, behaviours) {
		this.context = context
		this.behaviours = behaviours
	}

	scoped = []

	containerClass = `.${Pjax.Dom.containerClass}`

	/**
	 * getter, returns the current barba container
	 *
	 * @function  getter
	 * @param {HTMLElement} context, the current context
	 * @return {HTMLElement}
	 */
	get container() {
		return document.querySelector(`.${Pjax.Dom.containerClass}`)
	}

	/**
	 * Gather the behaviorus 
	 *
	 * @function  start
	 * @param {Array} nodes, an array of elements with data attributes
	 * @return {Loader}
	 */
	start(context = this.context) {
		// get all of the behaviours from the current context
		const all = gatherBehaviours(getNodes(context))
		// get all of the behaviours outside of the barba wrapper
		const outer = all.filter(({node}) => !DomClosest(node, this.containerClass))
		// get all of the behaviours inside of the barba wrapper
		const inner  = all.filter(({node}) => DomClosest(node, this.containerClass))
		// concatenate the arrays together, and tell the function that this is the first load
		// and call the 
		this.load([...outer, ...inner], true)
		return this
	}

	/**
	 * Instantiate each behaviour
	 *
	 * @function  start
	 * @param {Array} items, an array of objects containing a html element and a behaviour name
	 * @return {Loader}
	 */
	load(items, inital = true) {
		const { behaviours } = this
		// map over the items, returning an array of behaviour classes 
		this.current = items.map(({node, behaviourName}) => {
			// instantiate the new behaviours
			const behaviour = new behaviours[behaviourName](node)
			// initialize it (adds, events and the such)
			behaviour.initialize()
			// return the behaviour
			return behaviour
		})

		// get the scoped behaviours, we'll need this later for destroying
		// inital will be false on pagination so we can use the current set as scopeed
		this.scroped = inital === true ? this.current.filter(({node}) => DomClosest(node, this.containerClass))
																		: this.scoped = this.current

		// from the event loop, call each behaviours mounted method
		setTimeout(() => {
			this.current.forEach(behaviour => behaviour.mounted())
		})

		return this
	}

	/**
	 * Instantiate each behaviour
	 *
	 * @function  update
	 * @param {HTMLElement} context, the current context
	 * @return {Loader}
	 */
	update(context) {
		// where are we, barba me thinks, oh, update the context, might come in handy.. dunno
		this.context = context
		// do the load thinger with the current batch of nodes
		this.load(gatherBehaviours(getNodes(context)), false)
		return this
	}

	/**
	 * The barba method, start the barba 
	 *
	 * @function  {Array} routes
	 * @return {Loader}
	 */
	watch(routes = []) {
		// kick off the router... wip
		new RouteManager(routes).mount(this)
		// pjax yeah
		Pjax.start()
		return this
	}

	/**
	 * Destroy all the the scoped behaviours and empty the array
	 *
	 * @function  unmount
	 * @return {Loader}
	 */
	unmount() {
		// loop over each behaviour and destroy, and empty the array
		this.scoped = this.scoped.reduce((acc, curr) => {
			// an emptry method you can use in your behaviour
			curr.unmount()
			// base destroy, removes event handlers
			curr.destroy()
			return acc
		}, [])
		return this
	}



	beforeEnter(to, from) {
		this.current
			.filter(behaviour => typeof behaviour.onBeforeEnter === 'function')
			.map((behaviour) => behaviour.onBeforeEnter(to, from))
		return this
	}

	afterEnter(to, from) {
		this.current
			.filter(behaviour => typeof behaviour.onAfterEnter === 'function')
			.map((behaviour) => behaviour.onAfterEnter(to, from))
		return this
	}

	beforeLeave(from, to) {
		const promises = this.current.filter(behaviour => typeof behaviour.onBeforeLeave === 'function')
																.map((behaviour) => {
																	return new Promise(behaviour.onBeforeLeave.bind(behaviour, from, to))
																})
		return Promise.all(promises)
	}

	afterLeave(to, from) {
		const promises = this.current.filter(behaviour => typeof behaviour.onAfterLeave === 'function')
																.map((behaviour) => {
																	return new Promise(behaviour.onAfterLeave.bind(behaviour, from, to))
																})

		return Promise.all(promises)
	}
}