import WebFont from 'webfontloader';
import mud from './dependencies/load-behaviour';

import { megaNav } from  './behaviours/megaNav';
import canvasNavigation from './behaviours/canvasNavigation';

import accordion from './behaviours/accordion';
import carousel from './behaviours/carousel';
import slide from './behaviours/slide';
import video from './behaviours/video';
import map from './behaviours/map';



// https://github.com/typekit/webfontloader
WebFont.load({
	// google: { families: ['Droid Sans', 'Droid Serif'] },
	typekit: { id: 'vcl8lns' },
	// custom: {
	// 	families: ['My Font', 'My Other Font:n4,i4,n7'],
	// 	urls: ['/_assets/css/fonts.css']
	// }
});


// assign the data-behaviour functions
mud.Behaviours.canvasNavigation = canvasNavigation;
mud.Behaviours.megaNav = megaNav;


mud.Behaviours.accordion = accordion;
mud.Behaviours.carousel = carousel;
mud.Behaviours.slide = slide;
mud.Behaviours.video = video;
mud.LoadWindow.map = map;

window.onload = function(){
    mud.onWindowLoad();
};

$(function() {
	mud.loadBehaviour();
});
