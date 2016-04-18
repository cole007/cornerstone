#Mudstone
![Mud](http://ournameismud.co.uk/css/images/maps-icon.png)

**Mudstone**, gulp based web framework

##Gulp 

* Compile sass (using libsass)
* Compile ES6 with babel/browserify
* Uglify and concatenate javascript assets
* Sourcemaps
* Optimise Images
* Sprite generator
* SVG sprites, with png sprite fallback
* SVG symbol
* Compile jade templates
* Optimise css with uncss and clean css
* Html validator
* Critcal path css generator
* Build task for deployment directory
* Watch with Browsersync for live reload and server

##SCSS 

Boilerplate setup to use Bourbon (via node)
Autoprefixer used for... wait for it... prefixing

##Setup

Make sure you have Node.js and gulp installed 

######From the terminal run
```
 npm install
 gulp init - this will run all of the tasks (sass, jade, scripts, sprites, fonts, images)
 gulp - starts server, watches css,js,jade et al
 
```

See gulp/configs.js for paths and files

##Folder Structure

All of the site files are stored in the _assets directory

During development (see gulp/config.js) files are published to a tmp directory

For production every is built in the deploy directory

##Javascript

-  /_assets/js/app.js is the main entry point
-  /_assets/js/dependencies/* contains the namespace function the data-behaviour method
-  /_assets/js/helpers/* small utility functions
-  /_assets/js/behaviours/* page behaviours, modules etc
-  /_assets/plugins/* any scripts that need to be bundled before browserfy (jquery plugins)
-  /_assets/libs/* any libraries that need to be included in the head (such as moderniz),

The data-behaviour method provides the vanilla js dom node.  If you need to use jquery methods you will need to wrap container in a jquery obect
```
function eg(container) {
	$(container).addClass('is-active')
} 
```

## NPM packages included:

- lodash (debounce, throttle, template) (https://www.npmjs.com/package/lodash)
- webfontloader (https://www.npmjs.com/package/webfontloader)
- local-links (https://www.npmjs.com/package/local-links)
- verge (https://www.npmjs.com/package/verge)
- lazysizes (https://github.com/aFarkas/lazysizes)
- tweezer (https://github.com/jaxgeller/tweezer.js) 
- wallop (https://github.com/peduarte/wallop)
- lory-js (http://meandmax.github.io/lory/)
- plyr (https://plyr.io)
- hammerjs (http://hammerjs.github.io/)
- imagesloaded (http://imagesloaded.desandro.com/)
- google-maps (https://www.npmjs.com/package/google-maps)

To use a NPM module use the es6 import syntax

`import _ from 'lodash';`

## Non es6/common js plugins

If you need to use any old school plugins, you now can.  Any files in 'js/plugins' will be merged together and concatenated to the start of the final output js file.

##Git methodology

At a core we should be working on four branches:

- master
- dev / backend
- deploy/staging
- deploy/production

Dev work should be merged into master before going into deployment.

Any extra branches should be feature-specific and named accordingly, e.g. 

- feature/nav
- feature/add-on-x

Once completed a feature branch should be merged into master and removed. Ideally when logging time we should be adding comments related to the feature(s) we are working on.

###Tips
`git branch` - list branches in a repository  
`git branch feature/nav` - create new git branch  
`git branch -D feature/nav` - create new git branch  
`git checkout feature/nav` - moves branch and updates working directory  
`git merge feature/nav` - merge development branch into master (must checkout into master first)  