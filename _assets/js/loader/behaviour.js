import assignIn from 'lodash.assignin';
import Concert from 'concert';
import raf from 'raf';
import { mud } from '../loader/mud';

 
mud.Behaviours = {};
mud.LoadWindow = {};
mud.LoadFont = {};
mud.Animation = [];
mud.Collection = [];
/** 
 * Method used to create an object based on input string
 * @method  mud.loadBehaviour
 * @param  {String} context Context within dom that behaviour will look at
 * @example
 * by default set context to the $(document);
 * this could be call specifically on a DOM element e.g. mud.loadBehaviour($('#myElement'))
 */
mud.loadBehaviour = (context = document) => {
 
    const nodes = context.querySelectorAll('*[data-behaviour]');
    Array.prototype.forEach.call(nodes, function(element) {
        //var k = element.getAttribute('data-behaviour');
        element.getAttribute('data-behaviour').split(" ").forEach((behaviourName) => {
            try{
                // assign instance of method object based on behaviour name e.g. mud.Behaviours.showVid to variable
                const BehaviourClass = mud.Behaviours[behaviourName];


                // instantiate method object
                if(typeof mud.Behaviours[behaviourName] !== 'undefined'){

                    // Inheritable Observables
                    // https://github.com/moll/js-concert
                    assignIn(
                        BehaviourClass.prototype,
                        Concert
                    )

                    BehaviourClass.prototype.state = {};
                    BehaviourClass.prototype.el = element;

                    BehaviourClass.prototype.add = function(name) {
                        if(typeof mud.Collection[name] === 'undefined') {
                            mud.Collection[name] = this;
                        } else {
                            console.error(name, 'already existing in the collection');
                        }
                    }

                    BehaviourClass.prototype.get = function(name) {
                        if(typeof mud.Collection[name] !== 'undefined') {
                            return mud.Collection[name]
                        } else {
                            console.error(name, 'does not existing in the collection');
                        }
                    }

                    BehaviourClass.prototype.setState = function(state) {
                        Object.assign(this.state, state)
                    }

                    const initializedBehaviour = new BehaviourClass(element);
                }else{
                    console.warn(behaviourName+' Behaviour not found');
                }
            }
            catch(e){
                console.error(e);
            }
        });
    })
};

mud.onWindowLoad = function(){
    // call loadWindow
    if(mud.LoadWindow){
      for(let k in mud.LoadWindow) {
        if(Object.keys(mud.LoadWindow).length > 0) {
          mud.LoadWindow[k]();
        } 
      }
    }
};



mud.onLoadFont = function(){
    // call loadWindow
    if(mud.LoadFont){
      for(let k in mud.LoadFont) {
        if(Object.keys(mud.LoadFont).length > 0) {
          mud.LoadFont[k]();
        } 
      }
    }
};


mud.loadRequestAnimationFrame = function(){
    // call loadWindow
    if(mud.Animation.length > 0) {
        const loop = () => {
            mud.Animation.map(e => {
                if(typeof e.loop === 'function') {
                    e.loop();
                }
            });
            if(mud.Animation.length === 0) {
                raf.cancel(handle);
                return;
            }
            const handle = raf( loop );
        }
        loop();
    }
};

export default mud;