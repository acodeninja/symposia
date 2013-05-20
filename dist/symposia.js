/*
 postal
 Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
 Version 0.8.4
 */

(function(e,t){typeof module=="object"&&module.exports?module.exports=function(e){return e=e||require("underscore"),t(e)}:typeof define=="function"&&define.amd?define("postal",["underscore"],function(n){return t(n,e)}):e.postal=t(e._,e)})(this,function(e,t,n){var r="/",i=0,s="postal",o=function(){var t;return function(n){var r=!1;return e.isString(n)?(r=n===t,t=n):(r=e.isEqual(n,t),t=e.clone(n)),!r}},u=function(){var t=[];return function(n){var r=!e.any(t,function(t){return e.isObject(n)||e.isArray(n)?e.isEqual(n,t):n===t});return r&&t.push(n),r}},a=function(e){this.channel=e||r};a.prototype.subscribe=function(){return arguments.length===1?new f(this.channel,arguments[0].topic,arguments[0].callback):new f(this.channel,arguments[0],arguments[1])},a.prototype.publish=function(){var e=arguments.length===1?Object.prototype.toString.call(arguments[0])==="[object String]"?{topic:arguments[0]}:arguments[0]:{topic:arguments[0],data:arguments[1]};return e.channel=this.channel,m.configuration.bus.publish(e)};var f=function(e,t,n){this.channel=e,this.topic=t,this.callback=n,this.constraints=[],this.context=null,m.configuration.bus.publish({channel:s,topic:"subscription.created",data:{event:"subscription.created",channel:e,topic:t}}),m.configuration.bus.subscribe(this)};f.prototype={unsubscribe:function(){this.inactive=!0,m.configuration.bus.unsubscribe(this),m.configuration.bus.publish({channel:s,topic:"subscription.removed",data:{event:"subscription.removed",channel:this.channel,topic:this.topic}})},defer:function(){var e=this.callback;return this.callback=function(t){setTimeout(function(){e(t)},0)},this},disposeAfter:function(t){if(e.isNaN(t)||t<=0)throw"The value provided to disposeAfter (maxCalls) must be a number greater than zero.";var n=this.callback,r=e.after(t,e.bind(function(){this.unsubscribe()},this));return this.callback=function(){n.apply(this.context,arguments),r()},this},distinctUntilChanged:function(){return this.withConstraint(new o),this},distinct:function(){return this.withConstraint(new u),this},once:function(){return this.disposeAfter(1),this},withConstraint:function(t){if(!e.isFunction(t))throw"Predicate constraint must be a function";return this.constraints.push(t),this},withConstraints:function(t){var n=this;return e.isArray(t)&&e.each(t,function(e){n.withConstraint(e)}),n},withContext:function(e){return this.context=e,this},withDebounce:function(t){if(e.isNaN(t))throw"Milliseconds must be a number";var n=this.callback;return this.callback=e.debounce(n,t),this},withDelay:function(t){if(e.isNaN(t))throw"Milliseconds must be a number";var n=this.callback;return this.callback=function(e){setTimeout(function(){n(e)},t)},this},withThrottle:function(t){if(e.isNaN(t))throw"Milliseconds must be a number";var n=this.callback;return this.callback=e.throttle(n,t),this},subscribe:function(e){return this.callback=e,this}};var l={cache:{},regex:{},compare:function(t,n){var r,i,s,o=this.cache[n]&&this.cache[n][t];return typeof o!="undefined"?o:((i=this.regex[t])||(r="^"+e.map(t.split("."),function(e){var t="";return!s||(t=s!=="#"?"\\.\\b":"\\b"),e==="#"?t+="[\\s\\S]*":e==="*"?t+="[^.]+":t+=e,s=e,t}).join("")+"$",i=this.regex[t]=new RegExp(r)),this.cache[n]=this.cache[n]||{},this.cache[n][t]=o=i.test(n),o)},reset:function(){this.cache={},this.regex={}}},c=function(t,n){!t.inactive&&m.configuration.resolver.compare(t.topic,n.topic)&&e.all(t.constraints,function(e){return e.call(t.context,n.data,n)})&&typeof t.callback=="function"&&t.callback.call(t.context,n.data,n)},h=!1,p=[],d=function(){while(p.length)p.shift().unsubscribe()},v={addWireTap:function(e){var t=this;return t.wireTaps.push(e),function(){var n=t.wireTaps.indexOf(e);n!==-1&&t.wireTaps.splice(n,1)}},publish:function(t){return h=!0,t.timeStamp=new Date,e.each(this.wireTaps,function(e){e(t.data,t)}),this.subscriptions[t.channel]&&e.each(this.subscriptions[t.channel],function(e){var n=0,r=e.length,i;while(n<r)(i=e[n++])&&c(i,t)}),h=!1,t},reset:function(){this.subscriptions&&(e.each(this.subscriptions,function(t){e.each(t,function(e){while(e.length)e.pop().unsubscribe()})}),this.subscriptions={})},subscribe:function(e){var t,n,r,i=this.subscriptions[e.channel],s;return i||(i=this.subscriptions[e.channel]={}),s=this.subscriptions[e.channel][e.topic],s||(s=this.subscriptions[e.channel][e.topic]=[]),s.push(e),e},subscriptions:{},wireTaps:[],unsubscribe:function(e){if(h){p.push(e);return}if(this.subscriptions[e.channel][e.topic]){var t=this.subscriptions[e.channel][e.topic].length,n=0;while(n<t){if(this.subscriptions[e.channel][e.topic][n]===e){this.subscriptions[e.channel][e.topic].splice(n,1);break}n+=1}}}};v.subscriptions[s]={};var m={configuration:{bus:v,resolver:l,DEFAULT_CHANNEL:r,SYSTEM_CHANNEL:s},ChannelDefinition:a,SubscriptionDefinition:f,channel:function(e){return new a(e)},subscribe:function(e){return new f(e.channel||r,e.topic,e.callback)},publish:function(e){return e.channel=e.channel||r,m.configuration.bus.publish(e)},addWireTap:function(e){return this.configuration.bus.addWireTap(e)},linkChannels:function(t,n){var i=[];return t=e.isArray(t)?t:[t],n=e.isArray(n)?n:[n],e.each(t,function(t){var s=t.topic||"#";e.each(n,function(n){var s=n.channel||r;i.push(m.subscribe({channel:t.channel||r,topic:t.topic||"#",callback:function(t,r){var i=e.clone(r);i.topic=e.isFunction(n.topic)?n.topic(r.topic):n.topic||r.topic,i.channel=s,i.data=t,m.publish(i)}}))})}),i},utils:{getSubscribersFor:function(){var e=arguments[0],t=arguments[1];return arguments.length===1&&(e=arguments[0].channel||m.configuration.DEFAULT_CHANNEL,t=arguments[0].topic),m.configuration.bus.subscriptions[e]&&m.configuration.bus.subscriptions[e].hasOwnProperty(t)?m.configuration.bus.subscriptions[e][t]:[]},reset:function(){m.configuration.bus.reset(),m.configuration.resolver.reset()}}};return m}),function(){var e={require:{shim:{jquery:{exports:"$"},underscore:{exports:"_"}},paths:{jquery:"vendor/jquery/jquery",underscore:"vendor/lodash/lodash",postal:"vendor/postaljs/lib/postal.min"}}};require.config(e.require),define("symposia/base",["module","underscore","jquery","postal"],function(e,t,n,r){var i={debug:!0};return i.bus=r,i})}(),define("symposia/sandbox",["jquery"],function(e){return{sandbox:{create:function(t,n){var r=e("[data-symposia-module="+n.name+"]");return{publish:function(e){t.events.publish(e)},subscribe:function(e){t.events.subscribe(e,n._id)},unsubscribeAll:function(){t.events.unsubscribeAll(n._id)},unsubscribe:function(e){t.events.unsubscribe(e,n._id)},find:function(){},container:function(){return r},getModuleId:function(){return n._id}}}}}}),define("symposia/core",["symposia/base","symposia/sandbox"],function(e,t){var n={},r={},i=_.extend(e,t);return i.modules={get:function(e){if(this.isModule(e))return r[e]},getModules:function(){return r},create:function(e,t,n){var i,s,o=this;if(typeof e!="object")throw new Error("Create must be passed an object");if(!_.isUndefined(t)&&!_.isFunction(t))throw new Error("Callback must be a function");return _.each(e,function(e,t){if(!_.isFunction(e.creator))throw new Error("Creator should be an instance of Function");s=e.creator();if(!_.isObject(s))throw new Error("Creator should return a public interface");if(!_.isFunction(s.init)&&!_.isFunction(s.destroy))throw new Error("Module return an object containing both an init and destroy method");s=null,r[t]={_id:_.uniqueId("module-"),name:t,creator:e.creator}}),this},start:function(){var e=this,t=[].splice.call(arguments,0);if(!t.length)throw new Error("No module name supplied");return _.each(t,function(t,n){e.isRunning(t)||(r[t].instance=r[t].creator(i.sandbox.create(i,r[t])),r[t].instance.init(),i.bus.publish({channel:"modules",topic:"module.started",data:{module:t}}))}),this},startAll:function(){return this.start.apply(this,_.keys(r))},stop:function(){var e=this,t=[].splice.call(arguments,0);if(!t.length)throw new Error("No module name supplied");return _.each(t,function(t){e.isRunning(t)&&(r[t].instance.destroy(),r[t].instance=null,i.events.unsubscribeAll(t),i.bus.publish({channel:"modules",topic:"module.stopped",data:{name:t}}),delete r[t].instance)}),this},stopAll:function(){this.stop.apply(this,_.keys(r))},getRunning:function(){var e=_.filter(r,function(e){return _.has(e,"instance")});return e},isRunning:function(e){if(this.isModule(e))return _.isObject(r[e].instance)},isModule:function(e){if(_.isUndefined(e))throw new Error("No module name supplied");if(!_.isString(e))throw new TypeError("Module name must be a string");if(!_.has(r,e))throw new Error("Unable to find module '"+e+"'");return!0},reset:function(){r={}}},i.events={publish:function(e){return i.bus.publish(e)},subscribe:function(e,t){var r;if(!_.isString(t))throw new Error("Invalid subscriber id");if(!_.isString(e.topic)||!_.isFunction(e.callback))throw new Error("Subscription definition must have a topic (string) and callback (function)");return r=n[t],r||(r=n[t]=[]),r.push(i.bus.subscribe(e)),r.length},unsubscribe:function(e,t){if(!_.has(e,"topic")&&!_.has("channel"))throw new Error("topic or channel required");_.each(n,function(e){e.signature===t&&console.log(e)})},unsubscribeAll:function(e){var t=0,r=n[e];if(r)while(r.length)r.shift().unsubscribe(),t+=1;return t},getSubscribers:function(e){return e?n[e]:n},reset:function(){return _.each(n,function(e){while(e.length)e.shift().unsubscribe()}),n={},this}},i.debug&&(window.symposia=i),i}),define("symposia",["symposia/base","symposia/core"],function(e,t){return t});