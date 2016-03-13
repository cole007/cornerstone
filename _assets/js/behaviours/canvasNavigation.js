import Transition from '../helpers/transition';
import utils from '../helpers/utils';
import Viewport from '../helpers/viewport';
import config from '../dependencies/config';
import $ from 'jquery';
import { resetMenu } from '../behaviours/megaNav';

function canvasNavigation(container) {
	let lock = utils.lock();
	let $btn = $('.menu__btn');
	let viewport = new Viewport();
	let { breakpoints } = config;
	let transition = new Transition({
		el: '.js-menu',	
		activeClass: 'is-active',
		openStart: function() {
			$(this.el).addClass('is-animating-in');
			$btn.addClass('is-active');
			lock.capture();
		},
		openComplete: function() {
			$(this.el).addClass('is-active').removeClass('is-animating-in');
		},
		closeStart: function(){
			$(this.el).addClass('is-animating-out');
			$btn.removeClass('is-active');
			lock.release();
		},
		closeComplete: function(){
			$(this.el).removeClass('is-animating-out is-active');
			resetMenu();
		}
	});
	// the click handler
	function clickHandle(e) {
		e.preventDefault();
		transition.trigger();
	}
	// if onLoad the viewport is smaller than desktop
	if(viewport.width < breakpoints.desktop) {
		container.on('click', '.menu__btn', clickHandle);
	}
	// watch for breakpoint changes
	// the function only gets called when a breakpoint changes
	// Used to unbind the click event
	viewport.change(function(current, prev) {
		if(current === 'desktop' || this.width >= breakpoints.desktop) {
			console.log('unbind');
			container.off('click', '.menu__btn', clickHandle);
		}
		if(current === 'tablet' || this.width < breakpoints.desktop) {
			console.log('bind');
			container.on('click', '.menu__btn', clickHandle);
		}
	});
};

export default canvasNavigation;