import local from 'local-links'
import Tweezer from 'tweezer.js'
import axios from 'axios'

/**
 * Return the prefix used by the current browser
 * @return {Object} prefix object
 */
export const prefix = (function() {
	const styles = window.getComputedStyle(document.documentElement, '')
	const pre = (Array.prototype.slice
		.call(styles)
		.join('')
		.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
		)[1]
	const dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1]
	return {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre[0].toUpperCase() + pre.substr(1)
	}
})()

/**
 * Return the prefix transitionEnd event name
 * @return {String} the transition end string
 */
export const transitionEnd = (function(){
	const el = document.createElement('div')
	const transEndEventNames = {
		WebkitTransition : 'webkitTransitionEnd',
		MozTransition    : 'transitionend',
		OTransition      : 'oTransitionEnd otransitionend',
		transition       : 'transitionend'
	}
	for (let name in transEndEventNames) {
		if (el.style[name] !== undefined) {
			return transEndEventNames[name]
		}
	}
	return false
})()

/**
 * Return the prefix css3 property
 * @param {prop} prop - the un prefix css property (camelCase)
 * @return {String} the css3 property
 */
export function css3(prop) {
	const el = document.createElement('div')
	const _prefix = prefix.js
	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	const prefixed = _prefix + capitalize(prop)
	const test = [prop, prefixed]

	for(let i = 0; i < test.length; i += 1) {
		if(el && el.style[test[i]] !== undefined) {
			return test[i]
		}
	}
	return false
}

/**
 * Return the prefix animationEnd event name
 * @return {String} the animation end string
 */
export const animationEnd = (function(){
	const el = document.createElement('div')
	const transEndEventNames = {
		WebkitTransition : 'webkitAnimationEnd',
		MozTransition    : 'animationend',
		OTransition      : 'oAnimationEnd oanimationend',
		transition       : 'animationend'
	}
	for (let name in transEndEventNames) {
		if (el.style[name] !== undefined) {
			return transEndEventNames[name]
		}
	}
	return false
})()

export const lock = () => {
	const { style } = document.body
	let windowTop

	return {
		capture() {
			windowTop = window.pageYOffset
			style.position = 'fixed'
			style.height = '100%'
			style.width = '100%'
			style.overflow = 'hidden'
			style.top = `${windowTop * -1}px`
		},
		release() {
			style.position = ''
			style.height = ''
			style.width = ''
			style.overflow = ''
			style.top = ''
			window.scrollTo(0, windowTop)
		}
	}
}

export function ajax(url) {
	return axios.get(url)
}

export function externalLinks() {
	Array.from(document.querySelectorAll('a')).forEach((el) => {
		if(local.pathname(el) === null || el.getAttribute('href').indexOf('.pdf') > -1) {
			el.setAttribute('target', '_blank')
			el.setAttribute('rel', 'noopener')
		}
	})
}

export const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

// this is designed to work with lazysizes
export function lazyLoadedImagesLoaded(el, each, complete) {
	const config = {
		attributes: true,
		childList: false,
		characterData: false,
		subtree: true,
		attributeFilter: ['class']
	}
	const images = el.querySelectorAll('img')
	const total = images.length
	let previous = ''
	const observer = new MutationObserver((mutations) => {
		mutations.filter((mutation) => mutation.target.tagName.toUpperCase() === 'IMG')
						.forEach((mutation) => {
							if(previous === mutation.target.currentSrc && typeof each === 'function') {
								each(mutation.target)
							}
							previous = mutation.target.currentSrc
							if(el.querySelectorAll('.lazyloaded').length >= total) {
								observer.disconnect()
								if(typeof complete === 'function') {
									complete()
								}
							}
						})
	})
	observer.observe(el, config)
}

export const breakpoints = {

	from : {
		'mobile': '(min-width: 20em)',
		'mobile-large': '(min-width: 30em)',
		'tablet-small': '(min-width: 33.75em)',
		'tablet': '(min-width: 47.5em)',
		'desktop': '(min-width: 64em)',
		'wide': '(min-width: 90em)'
	},

	until : {
		'mobile': '(max-width: 20em)',
		'mobile-large': '(max-width: 30em)',
		'tablet-small': '(max-width: 33.75em)',
		'tablet': '(max-width: 47.5em)',
		'desktop': '(max-width: 64em)',
		'wide': '(max-width: 90em)'
	}
}





export function getParents(elem, selector) {
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem
	}
	return null
}

export const scrollTo = (obj = {}) => {

	const defaults = {
		start: window.pageYOffset,
		end: 0,
		callback: null
	}

	const { start, end, callback } = Object.assign({}, defaults, obj)

	new Tweezer({
		start,
		end,
		duration: 1000,
		easing: (t, b, c, d) => {
			if ((t/=d/2) < 1) return c/2*t*t + b
			return -c/2 * ((t -= 1) * (t-2) - 1) + b
		}
	})
	.on('tick', v => window.scrollTo(0, v))
	.on('done', ()=> {
		if(typeof callback === 'function') {
			callback()
		}
	})
	.begin() // this fires the tweening
}


export function upAndDown(start, min, max, loop = false) {

	let count = start
	return {
		increment() {
			count = (count + 1) % max
			if(!loop && count === 0) {
				count = max - 1
			}
			return count
		},
		decrement() {
			if(loop && count === 0) {
				count = max
			}
			count = count === 0 ? 0 : (count -= 1)
			return count
		},
		setStart(value) {
			count = value
		},
		max() {
			return max - 1
		},
		min() {
			return min
		},
		current() {
			return count
		}
	}
}



export function delaySpread(container, fn, selector) {
	const elements = selector ? container.querySelectorAll(selector) : container.children
	Array.from(elements).forEach((element, index) => element.style[css3('transitionDelay')] = `${fn(index)}ms`)
}
