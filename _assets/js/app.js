// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array etc
import './libs/polyfills'
// https://github.com/aFarkas/lazysizes
import 'lazysizes'
import './helpers/customEvents'
// https://github.com/bfred-it/object-fit-images
import objectFitImages from 'object-fit-images'

//https://github.com/typekit/webfontloader
import WebFont from 'webfontloader'
import {
	views
} from './views'
import debug from 'debug'

// logs enabled during development
window.log = debug('app:log')
if (process.env.NODE_ENV === 'development') {
	debug.enable('app:log')
} else {
	debug.disable('app:log')
} 

log(`Logging is enabled!, NODE_ENV: ${process.env.NODE_ENV}`)

WebFont.load({
	/*
		custom: {
	    families: ['My Font', 'My Other Font:n4,i4,n7'],
	    urls: ['/dist/css/fonts.css']
	  },
		google: {
	    families: ['Droid Sans', 'Droid Serif:bold']
	  },
		typekit: {
			id: 'cdu5srl'
		}
	*/
	google: {
		families: ['Lato:300,400,700']
	},
})





$(function () {
	views()
	objectFitImages()
})