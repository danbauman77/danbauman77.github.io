/** @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */
!function(t){"use strict";function e(){console.log.apply(console,arguments)}function s(t,e){var s,n,o,i;for(this.list=t,this.options=e=e||{},s=0,i=["sort","shouldSort","verbose","tokenize"],n=i.length;n>s;s++)o=i[s],this.options[o]=o in e?e[o]:r[o];for(s=0,i=["searchFn","sortFn","keys","getFn","include","tokenSeparator"],n=i.length;n>s;s++)o=i[s],this.options[o]=e[o]||r[o]}function n(t,e,s){var i,r,h,a,p,c;if(e){if(h=e.indexOf("."),-1!==h?(i=e.slice(0,h),r=e.slice(h+1)):i=e,a=t[i],null!==a&&void 0!==a)if(r||"string"!=typeof a&&"number"!=typeof a)if(o(a))for(p=0,c=a.length;c>p;p++)n(a[p],r,s);else r&&n(a,r,s);else s.push(a)}else s.push(t);return s}function o(t){return"[object Array]"===Object.prototype.toString.call(t)}function i(t,e){e=e||{},this.options=e,this.options.location=e.location||i.defaultOptions.location,this.options.distance="distance"in e?e.distance:i.defaultOptions.distance,this.options.threshold="threshold"in e?e.threshold:i.defaultOptions.threshold,this.options.maxPatternLength=e.maxPatternLength||i.defaultOptions.maxPatternLength,this.pattern=e.caseSensitive?t:t.toLowerCase(),this.patternLen=t.length,this.patternLen<=this.options.maxPatternLength&&(this.matchmask=1<<this.patternLen-1,this.patternAlphabet=this._calculatePatternAlphabet())}var r={id:null,caseSensitive:!1,include:[],shouldSort:!0,searchFn:i,sortFn:function(t,e){return t.score-e.score},getFn:n,keys:[],verbose:!1,tokenize:!1,tokenSeparator:/ +/g};s.VERSION="2.4.1",s.prototype.set=function(t){return this.list=t,t},s.prototype.search=function(t){this.options.verbose&&e("\nSearch term:",t,"\n"),this.pattern=t,this.results=[],this.resultMap={},this._keyMap=null,this._prepareSearchers(),this._startSearch(),this._computeScore(),this._sort();var s=this._format();return s},s.prototype._prepareSearchers=function(){var t=this.options,e=this.pattern,s=t.searchFn,n=e.split(t.tokenSeparator),o=0,i=n.length;if(this.options.tokenize)for(this.tokenSearchers=[];i>o;o++)this.tokenSearchers.push(new s(n[o],t));this.fullSeacher=new s(e,t)},s.prototype._startSearch=function(){var t,e,s,n,o=this.options,i=o.getFn,r=this.list,h=r.length,a=this.options.keys,p=a.length,c=null;if("string"==typeof r[0])for(s=0;h>s;s++)this._analyze("",r[s],s,s);else for(this._keyMap={},s=0;h>s;s++)for(c=r[s],n=0;p>n;n++){if(t=a[n],"string"!=typeof t){if(e=1-t.weight||1,this._keyMap[t.name]={weight:e},t.weight<=0||t.weight>1)throw new Error("Key weight has to be > 0 and <= 1");t=t.name}else this._keyMap[t]={weight:1};this._analyze(t,i(c,t,[]),c,s)}},s.prototype._analyze=function(t,s,n,i){var r,h,a,p,c,l,u,f,d,g,m,y,v,S=this.options,k=!1;if(void 0!==s&&null!==s)if(h=[],"string"==typeof s){if(r=s.split(S.tokenSeparator),S.verbose&&e("---------\nKey:",t),this.options.tokenize){for(y=0;y<this.tokenSearchers.length;y++){for(f=this.tokenSearchers[y],S.verbose&&e("Pattern:",f.pattern),d=[],v=0;v<r.length;v++){g=r[v],m=f.search(g);var b={};m.isMatch?(b[g]=m.score,k=!0,h.push(m.score)):(b[g]=1,h.push(1)),d.push(b)}S.verbose&&e("Token scores:",d)}for(p=h[0],l=h.length,y=1;l>y;y++)p+=h[y];p/=l,S.verbose&&e("Token score average:",p)}u=this.fullSeacher.search(s),S.verbose&&e("Full text score:",u.score),c=u.score,void 0!==p&&(c=(c+p)/2),S.verbose&&e("Score average:",c),(k||u.isMatch)&&(a=this.resultMap[i],a?a.output.push({key:t,score:c,matchedIndices:u.matchedIndices}):(this.resultMap[i]={item:n,output:[{key:t,score:c,matchedIndices:u.matchedIndices}]},this.results.push(this.resultMap[i])))}else if(o(s))for(y=0;y<s.length;y++)this._analyze(t,s[y],n,i)},s.prototype._computeScore=function(){var t,s,n,o,i,r,h,a,p,c=this._keyMap,l=this.results;for(this.options.verbose&&e("\n\nComputing score:\n"),t=0;t<l.length;t++){for(n=0,o=l[t].output,i=o.length,a=1,s=0;i>s;s++)r=o[s].score,h=c?c[o[s].key].weight:1,p=r*h,1!==h?a=Math.min(a,p):(n+=p,o[s].nScore=p);1===a?l[t].score=n/i:l[t].score=a,this.options.verbose&&e(l[t])}},s.prototype._sort=function(){var t=this.options;t.shouldSort&&(t.verbose&&e("\n\nSorting...."),this.results.sort(t.sortFn))},s.prototype._format=function(){var t,s,n,o,i,r=this.options,h=r.getFn,a=[],p=this.results,c=r.include;for(r.verbose&&e("\n\nOutput:\n\n",p),o=r.id?function(t){p[t].item=h(p[t].item,r.id,[])[0]}:function(){},i=function(t){var e,s,n,o,i,r=p[t];if(c.length>0){if(e={item:r.item},-1!==c.indexOf("matches"))for(n=r.output,e.matches=[],s=0;s<n.length;s++)o=n[s],i={indices:o.matchedIndices},o.key&&(i.key=o.key),e.matches.push(i);-1!==c.indexOf("score")&&(e.score=p[t].score)}else e=r.item;return e},s=0,n=p.length;n>s;s++)o(s),t=i(s),a.push(t);return a},i.defaultOptions={location:0,distance:100,threshold:.6,maxPatternLength:32},i.prototype._calculatePatternAlphabet=function(){var t={},e=0;for(e=0;e<this.patternLen;e++)t[this.pattern.charAt(e)]=0;for(e=0;e<this.patternLen;e++)t[this.pattern.charAt(e)]|=1<<this.pattern.length-e-1;return t},i.prototype._bitapScore=function(t,e){var s=t/this.patternLen,n=Math.abs(this.options.location-e);return this.options.distance?s+n/this.options.distance:n?1:s},i.prototype.search=function(t){var e,s,n,o,i,r,h,a,p,c,l,u,f,d,g,m,y,v,S,k,b,_,M=this.options;if(t=M.caseSensitive?t:t.toLowerCase(),this.pattern===t)return{isMatch:!0,score:0,matchedIndices:[[0,t.length-1]]};if(this.patternLen>M.maxPatternLength){if(y=t.match(new RegExp(this.pattern.replace(M.tokenSeparator,"|"))),v=!!y)for(k=[],e=0,b=y.length;b>e;e++)_=y[e],k.push([t.indexOf(_),_.length-1]);return{isMatch:v,score:v?.5:1,matchedIndices:k}}for(o=M.location,n=t.length,i=M.threshold,r=t.indexOf(this.pattern,o),S=[],e=0;n>e;e++)S[e]=0;for(-1!=r&&(i=Math.min(this._bitapScore(0,r),i),r=t.lastIndexOf(this.pattern,o+this.patternLen),-1!=r&&(i=Math.min(this._bitapScore(0,r),i))),r=-1,g=1,m=[],p=this.patternLen+n,e=0;e<this.patternLen;e++){for(h=0,a=p;a>h;)this._bitapScore(e,o+a)<=i?h=a:p=a,a=Math.floor((p-h)/2+h);for(p=a,c=Math.max(1,o-a+1),l=Math.min(o+a,n)+this.patternLen,u=Array(l+2),u[l+1]=(1<<e)-1,s=l;s>=c;s--)if(d=this.patternAlphabet[t.charAt(s-1)],d&&(S[s-1]=1),0===e?u[s]=(u[s+1]<<1|1)&d:u[s]=(u[s+1]<<1|1)&d|((f[s+1]|f[s])<<1|1)|f[s+1],u[s]&this.matchmask&&(g=this._bitapScore(e,s-1),i>=g)){if(i=g,r=s-1,m.push(r),!(r>o))break;c=Math.max(1,2*o-r)}if(this._bitapScore(e+1,o)>i)break;f=u}return k=this._getMatchedIndices(S),{isMatch:r>=0,score:0===g?.001:g,matchedIndices:k}},i.prototype._getMatchedIndices=function(t){for(var e,s=[],n=-1,o=-1,i=0,r=t.length;r>i;i++)e=t[i],e&&-1===n?n=i:e||-1===n||(o=i-1,s.push([n,o]),n=-1);return t[i-1]&&s.push([n,i-1]),s},"object"==typeof exports?module.exports=s:"function"==typeof define&&define.amd?define(function(){return s}):t.Fuse=s}(this);

/* jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
 * http://benalman.com/projects/jquery-bbq-plugin/
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/ */
(function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I: {},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
 
/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(e,t,n){"$:nomunge";function f(e){e=e||location.href;return"#"+e.replace(/^[^#]*#?(.*)$/,"$1")}var r="hashchange",i=document,s,o=e.event.special,u=i.documentMode,a="on"+r in t&&(u===n||u>7);e.fn[r]=function(e){return e?this.bind(r,e):this.trigger(r)};e.fn[r].delay=50;o[r]=e.extend(o[r],{setup:function(){if(a){return false}e(s.start)},teardown:function(){if(a){return false}e(s.stop)}});s=function(){function p(){var n=f(),i=h(u);if(n!==u){c(u=n,i);e(t).trigger(r)}else if(i!==u){location.href=location.href.replace(/#.*/,"")+i}o=setTimeout(p,e.fn[r].delay)}var s={},o,u=f(),l=function(e){return e},c=l,h=l;s.start=function(){o||p()};s.stop=function(){o&&clearTimeout(o);o=n};var d=function(){var e,t=3,n=document.createElement("div"),r=n.getElementsByTagName("i");while(n.innerHTML="<!--[if gt IE "+ ++t+"]><i></i><![endif]-->",r[0]);return t>4?t:e}();d<9&&!a&&function(){var t,n;s.start=function(){if(!t){n=e.fn[r].src;n=n&&n+f();t=e('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){n||c(f());p()}).attr("src",n||"javascript:0").insertAfter("body")[0].contentWindow;i.onpropertychange=function(){try{if(event.propertyName==="title"){t.document.title=i.title}}catch(e){}}}};s.stop=l;h=function(){return f(t.location.href)};c=function(n,s){var o=t.document,u=e.fn[r].domain;if(n!==s){o.title=i.title;o.open();u&&o.write('<script>document.domain="'+u+'"</script>');o.close();t.location.hash=n}}}();return s}()})(jQuery,this);

/* Utilities */

/////LOG
// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};
String.prototype.addCommas = function() {
	var nStr = this, x, x1, x2;
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
};
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.toTitleCase = function () {
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|vs?\.?|via)$/i;

  return this.replace(/([^\W_]+[^\s-]*) */g, function (match, p1, index, title) {
    if (index > 0 && index + p1.length !== title.length &&
      p1.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && 
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
      return match.toLowerCase();
    }

    if (p1.substr(1).search(/[A-Z]|\../) > -1) {
      return match;
    }

    return match.charAt(0).toUpperCase() + match.substr(1);
  });
};
String.prototype.addRank = function() { // rewrite to optimize if/switch statements
	var str = this;
	var lastChar = str.charAt(str.length - 1);

	if (str == '11' || str == '12' || str == '13') {
		return str + 'th';
	} else if (lastChar == '1') {
		return str + 'st';
	} else if (lastChar == '2') {
		return str + 'nd';
	} else if (lastChar == '3') {
		return str + 'rd';
	} else if (lastChar == 'A'){
		return str;
	} else {
		return str + 'th';
	}
};
// add object keys support for Non EMCA5 browsers (IE8, FF3.6, etc)
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys

if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

      var result = [];

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }

      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    };
  })();
}
	
$(document).ready(function() {
var cheg = cheg || { };

	cheg.getData = function(request){
			var domain = "d2",
				instance = "q",
				fieldText = "",
				limitText = "",
				sortText = "",
				keyText = "",
				getFieldString = function(fields) { // field strings can either be in an array or values in a simple object
					var fieldString = '/fields/',
						fieldValues = '';

					if (jQuery.isArray(fields)) { // if array, read the array values into the string
						fieldValues = fields.join('|');
						fieldString += fieldValues;
					} else if (fields instanceof Object) { // if object, read the object values into the string
						for (var field in request.fields) {
							if (request.fields.hasOwnProperty(field)) {
								var val = request.fields[field];

								if (val !== '') {
									fieldString += val + '|';
								}
							}
						}
						fieldString = fieldString.substr(0, fieldText.length - 1); // remove trailing '|'
					} else {
						return '';
					}

					return fieldString;
				};
				
			// required paramaters
			if (!request.name) {
				log('Missing data request name (name parameter). Cancelling data request.');
				return false;
			}
			
			if (!request.table) {
				log('Please specify a Datalite table (table parameter). Cancelling data request.');
				return false;
			}

			// optional parameters 
			request.success = request.success || log;
			request.noResults = request.noResults || log;
			request.tooManyResults = request.tooManyResults || log;
			request.url = request.url || "";
			request.jsonCallback = request.name + 'CB';
			request.isCount = request.isCount || false;
			request.successParam = request.successParam || undefined;
			request.cache = request.cache || true;
			
			if (request.fields) {			
				fieldText = getFieldString(request.fields);
			}

			if (request.limit) {
				limitText = 'limit/' + request.limit + '/';
			}
			
			if (request.sort) {
				sortText = 'order/' + request.sort;
			}
			domain = "https://api.chronicle.com/dl";
			
			if (request.isCount) {
				request.table += 'COUNT';
			}
			var loadJsonReq = $.ajax({
				type: "GET",
				url: encodeURI(domain + "/" + instance + "/bo/public/" + keyText + "format/jsonp/name/" + request.table + "/" + limitText + sortText + fieldText + request.url + "/callback/" + request.jsonCallback),
				dataType: "jsonp",
				cache: request.cache,
				jsonpCallback: request.jsonCallback,
				success: function(json){
					if (json.error) {
						switch (json.error) {
							case 'No Results!':
								log("no results json");
								request.noResults(json);
								break;
							case 'Too Many Results!':
								request.tooManyResults(json);
								break;
							default: 
								log('Unknown Datalite error. Log of returned data follows.', json);
								break;
						}
						return false;
					}

					if (request.successParam) {
						request.success(json, request.successParam);
					} else {
						request.success(json);
					}
				},
				error: function(a,b,c){
					log("error handler");
					var theStatus = a.status;
					log('Data error: ' + request.name, a, b, theStatus);
				}
			});	
	};

	cheg.months = {
		'0': '',
		'1':'January',
		'2':'February',
		'3':'March',
		'4':'April',
		'5':'May',
		'6':'June',
		'7':'July',
		'8':'August',
		'9':'September',
		'10':'October',
		'11':'November',
		'12':'December'
	};

	cheg.states = {
		full: {
			'ak': 'Alaska',
			'al': 'Alabama',
			'ar': 'Arkansas',
			'az': 'Arizona',
			'ca': 'California',
			'co': 'Colorado',
			'ct': 'Connecticut',
			'de': 'Delaware',
			'dc': 'District of Columbia',
			'fl': 'Florida',
			'ga': 'Georgia',
			'hi': 'Hawaii',
			'id': 'Idaho',
			'ia': 'Iowa',
			'in': 'Indiana',
			'il': 'Illinois',
			'ks': 'Kansas',
			'ky': 'Kentucky',
			'la': 'Louisiana',
			'ma': 'Massachusetts',
			'md': 'Maryland',
			'me': 'Maine',
			'mi': 'Michigan',
			'mn': 'Minnesota',
			'ms': 'Mississippi',
			'mo': 'Missouri',
			'mt': 'Montana',
			'nc': 'North Carolina',
			'nd': 'North Dakota',
			'ne': 'Nebraska',
			'nh': 'New Hampshire',
			'nj': 'New Jersey',
			'nm': 'New Mexico',
			'nv': 'Nevada',
			'ny': 'New York',
			'oh': 'Ohio',
			'ok': 'Oklahoma',
			'or': 'Oregon',
			'pa': 'Pennsylvania',
			'pr': 'Puerto Rico',
			'ri': 'Rhode Island',
			'sc': 'South Carolina',
			'sd': 'South Dakota',
			'tn': 'Tennessee',
			'tx': 'Texas',
			'ut': 'Utah',
			'va': 'Virginia',
			'vt': 'Vermont',
			'wa': 'Washington',
			'wi': 'Wisconsin',
			'wv': 'West Virginia',
			'wy': 'Wyoming'
		},
		code: {
			'alaska':'ak',
			'alabama':'al',
			'arkansas':'ar',
			'arizona':'az',
			'california':'ca',
			'colorado':'co',
			'connecticut':'ct',
			'delaware':'de',
			'districtofcolumbia':'dc',
			'florida':'fl',
			'georgia':'ga',
			'hawaii':'hi',
			'idaho':'id',
			'iowa':'ia',
			'indiana':'in',
			'illinois':'il',
			'kansas':'ks',
			'kentucky':'ky',
			'louisiana':'la',
			'massachusetts':'ma',
			'maryland':'md',
			'maine':'me',
			'michigan':'mi',
			'minnesota':'mn',
			'mississippi':'ms',
			'missouri':'mo',
			'montana':'mt',
			'northcarolina':'nc',
			'northdakota':'nd',
			'nebraska':'ne',
			'newhampshire':'nh',
			'newjersey':'nj',
			'newmexico':'nm',
			'nevada':'nv',
			'newyork':'ny',
			'ohio':'oh',
			'oklahoma':'ok',
			'oregon':'or',
			'pennsylvania':'pa',
			'puertorico': 'pr',
			'rhodeisland':'ri',
			'southcarolina':'sc',
			'southdakota':'sd',
			'tennessee':'tn',
			'texas':'tx',
			'utah':'ut',
			'virginia':'va',
			'vermont':'vt',
			'washington':'wa',
			'wisconsin':'wi',
			'westvirginia':'wv',
			'wyoming':'wy'
		}
	};
	$('#table_navtabs').find('a').click(function(e) {
		if ($(this).parent().attr('id') !== 'details_tableReturn') {
			var isOpen = $(this).hasClass('activeTab'),
				whichControl = $(this).parent().attr('id').split('_')[1];
			e.preventDefault();
			if (!isOpen) {			
				view.highestVal = 0;
				data.filters.year = whichControl === "private" ? "2017" : "2019";
				$('#ec_container').removeClass(data.filters.control);
				tableFilter.controlSwitch(whichControl);
				data.filters.control = whichControl;
				window.location = '#id=table_'+data.filters.control +'_'+data.filters.year;
			}
		}
	});
	$('#tableselects').find('.select_item > a').click(function(e) {
		var isOpen = $(this).parent().hasClass('opendrawer');
		e.preventDefault();
		$('#tableselects').find('.select_item').removeClass('opendrawer');
		if (!isOpen) {
			tableFilter.init($(this).parent().attr('id'));
			$(this).parent().addClass('opendrawer');
		} 
	});
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
      $('.container').addClass('mobile');
    }
	$('#interactive_about').find('.showAbout').unbind('click').click(function (e) {
		e.preventDefault();
		if ($('#aboutmore').hasClass('showmore')) {
			$(this).text('Show more');
			$('#aboutmore').removeClass('showmore');
		} else {
			$(this).text('Show less');
			$('#aboutmore').addClass('showmore');
		}
	});
	Raphael.fn.pieChart = function (cx, cy, r, values, labels, fill) {
	    var paper = this,
	        rad = Math.PI / 180,
	        chart = this.set();
	    function sector(cx, cy, r, startAngle, endAngle, params) {
	        var x1 = cx + r * Math.cos(-startAngle * rad),
	            x2 = cx + r * Math.cos(-endAngle * rad),
	            y1 = cy + r * Math.sin(-startAngle * rad),
	            y2 = cy + r * Math.sin(-endAngle * rad);
	        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
	    }

	    var angle = 0,
	        total = 0,
	        start = 0,
	        process = function (j) {
	        	var value = values[j],
	                angleplus = 360 * value / total,
	                ms = 500,
	                bcolor = fill[j],
	                p = sector(cx, cy, r, angle, angle + angleplus, {fill: bcolor, stroke: '#ffffff', "stroke-width": 1}),
	                txt = $('.dt_bkd_'+labels[j]);
	            p.mouseover(function () {
	                p.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, ms, "elastic");
	                txt.addClass('bkd_hovered');
	            }).mouseout(function () {
	                p.stop().animate({transform: ""}, ms, "elastic");
	                txt.removeClass('bkd_hovered');
	            });
	            angle += angleplus;
	            chart.push(p);
	            chart.push(txt);
	            start += 0.1;
	        };
	    for (var i = 0, ii = values.length; i < ii; i++) {
	        total += values[i];
	    }
	    for (i = 0; i < ii; i++) {
	        process(i);
	    }
	    return chart;
	};
	// http://bost.ocks.org/mike/chart/
	var table = {
			container: $('#ec_table'),// containing html element
			shortURL: {
				table: '',
				details: ''
   				},
			dataVersion: 'pre02',
			longLink: '//chronicle.com/interactives/exec_comp/',
			sort: 'totalComp',// field to sort by on load, defaults to first column if fields are specified
			sortOrder: 'dsc',// initial sort order
			noun: 'excomp20_spring',// datalite table noun
			limit: 50,// number of results to display at one time
			start: 0,// which result to start with; first result is 0
			fields: ['employeeName', 'totalComp', 'baseSalary', 'bonus', 'otherComp', 'retirement', 'chronorgname',  'employeeID', 'unitid', 'fiscalYear', 'calendarYear', 'partialYear', 'photoURL', 'footnote', 'footnoteFlag']
		},
		data = {
			openID: -1,
			yearType: {'public': 'fiscalYear', 'private': 'calendarYear'},
			filters: {
				stabbr: null,
				System: null,
				year: '2019',
				sort: 'totalComp',
				control: 'public',
			},
			params: {
				order: 'dsc',
				column: 'totalComp'
			},
			flagable: [false,false,false,false,false,false,false],
			filterReset: true,
			maxVal: 3048000,
			details: [],
			defaultVal: 'totalComp',
			failState: function() {
				$('#ec_table_fail').show();
				$('.interactive_table').hide();
			},
			raw: [],
			sortTableContents: function (table) {
				var x, y;
				data.raw.sort(function(a, b) {
					x = +a[table];
					y = +b[table];

					if (x > y && table !== "StartTerm") {
						return -1;
					} else if (y > x && table === "StartTerm") {
						return -1;
					} else {
						return 1;
					}
				});
			},
			fetch: function() {
				var that = this,
					filterItem,
					filterIndex,
					filterVal = '',
					findURL = data.filters.control === 'public' && +data.filters.year > 2017 ? "/find/positionCategory:1:eq|calendarYear:"+data.filters.year+":eq|public:1:eq": "/find/positionCategory:1:eq|"+ data.yearType[data.filters.control]+ ":" + data.filters.year + ":eq",
					params = {
						'name': 'chegTable' + table.dataVersion,
						'table': table.noun,
						'fields': table.fields,
						'noResults': data.failState,
						'url': findURL,
						'limit': table.start + "|" + table.limit,
						'success': this.record
					},
					countParams = {
						name: 'chegTableCount' + table.dataVersion,
						table: table.noun + 'COUNT',
						'url': findURL,
						'success': that.processCount
					};
				$('#tableNotes').find('.flagable').hide();
				for (var index in data.filters) {
					if (data.filters[index] && (index !== "year") && (index !== "sort") && (index !== "control")) {
						filterVal += "|";
						if (index === "System") {
							filterIndex = data.systemLookup[data.filters.System];
							filterVal += filterIndex;
						} else if (index === "Ccbasic") {
							filterVal += data.ccbasicLookup[data.filters.Ccbasic];
						} else {
							filterItem = data.filters[index] + ":eq";
							filterVal += index + ":" + filterItem;
						}
					}
				}
				if (filterVal !== '') {
					countParams.url = params.url = findURL + filterVal;
				}
				
				$('#ec_table').find('.table_overcontainer').show();
				$('#ec_table_fail').hide();
				table.container.removeClass('loaded');
				params.sort = data.filters.sort + ":dsc";
				cheg.getData(params);
				cheg.getData(countParams);
			},
			get: function() {
				return this.raw;
			},
			systemLookup: {
				'institutions': 'System:1:neq',
				'systems': '%5BSystem:1:eq||System:3:eq%5D',
				'flagships': 'System:2:eq',
				'ivy':'Ivy:1:eq'
			},
			ccbasicLookup: {
				'ba': '%5BCcbasic:10:eq||Ccbasic:20:gt%5D',
				'ma': 'Ccbasic:21:lt|Ccbasic:17:gt',
				'phd': 'Ccbasic:18:lt|Ccbasic:10:gt'
			},
			processCount: function(json) {
				var d = data,
					count = json[0];

				d.count = Number(count.dracula);
				if (d.count === 0) {
					data.failState();
				} else {
					$('#ec_showmore').show();
				}
				d.setNavPosition();
			},
			record: function(json) {
				data.raw = json;
				$('#ec_table_fail').hide();
				$('.interactive_table').show();
				view.generate();

			},
			setNavPosition: function() {
				var count = this.count;
				var $wrapper = $('#ec_table'),
					outerBound = Math.min((table.start + (table.limit)), count);
				$wrapper.find('.table_results_start').html(table.start + 1);
				$wrapper.find('.table_results_finish').html(outerBound);
				$wrapper.find('.results_num').html(String(count).addCommas());
				if ((table.start + table.limit) >= count) {
					$wrapper.addClass('last_page');
				} else {
					$wrapper.removeClass('last_page');
				}
				if (table.start === 0) {
					$wrapper.addClass('first_page');
				} else {
					$wrapper.removeClass('first_page');
				}
			},
			colNames: {
				'totalComp': ['employeeName', 'totalComp'],
				'baseSalary': ['employeeName', 'baseSalary'],
				'tuitionTotalCompRatio': ['employeeName', 'tuitionTotalCompRatio'], 
				'totalCompExpendituresRatio': ['employeeName', 'totalCompExpendituresRatio']
			},
			colCount: 2,
		},
		nav = {
			paginate: {
				init: function() {
					var $navbar = table.container.find('.table_nav');
					$navbar.find('.table_btns').find('.table_btn').unbind('click').click(this.changePage);
				},
				changePage: function(e) {
					var $this = $(this),
						startPos = table.start;
					e.preventDefault();
					if ($this.hasClass('next')) {
						startPos += table.limit;
					} else {
						startPos -= table.limit;
					}
					if ((startPos < 0) || ($this.hasClass('next') && table.container.hasClass('last_page'))) {
						return false;
					}
					table.start = startPos;
					data.fetch(true);
				}
			}
		},
		url = {
			defaultParams: 'table',
			currentParams: '',
			previousParams: '',
			alpha: ['','a','b','c','d','e',''],
			idnote: {},
			theShort: 'table',
			socialComp: '',
			socialName: '',
			title1: '',
			title2: '',
			root2: '',
			cohorts: "",
			hasTable: null,
			hasHashHandler: false,
			read: function() {
				if (!url.hasHashHandler) { // don't set this more than once
					url.hasHashHandler = true;
					$(window).bind('hashchange', function(e) {
						var params = e.getState(),
							initializePage = function() {
								checkSection(params);
							},
							checkSection = function(params) {
								var thePage = params.id,
									yrID, index,
									theDetails = thePage.split('_'),
									tempYear;
								$('#details_benefits').find('.active_bene').removeClass('active_bene');
								$('#search_text').val(tableSearch.defaultVal);
								$('.opendrawer').removeClass('opendrawer');
								if (theDetails[0] !== "table") {
									$('html').scrollTop(0);
									details.active.year = theDetails[2];
									details.active.org = theDetails[1];
									details.active.employee = theDetails[0];
									details.active.control = theDetails[3];
									data.filters.control = theDetails[3];
									data.filters.year = theDetails[2];
									$('#control_private').hide();
									$('#control_public').hide();
									$('#ec_table').fadeOut();
									$('.filtersOnly').fadeOut();
									$('#ec_container').removeClass('details public private').addClass('details');
									$('#ec_details').fadeIn();
									$('#ec_details').find('.public').hide();
									$('#ec_details').find('.private').hide();
									$('#ec_details').find('.'+data.filters.control).show();
									$('#details_tableReturn').show();
									details.resetSettings();
									$('#ec_tableReturn').attr('href', '#id=table_'+data.filters.control+'_'+data.filters.year);
									if (details.raw[details.active.org]) {
										details.processEmp(details.raw[details.active.org]);
									} else {
										details.init();
									}
									$('.ds_payswitch').find('a').unbind('click').click(function(e) {
										e.preventDefault();
										var section;
										if (!$(this).parent().hasClass('active')) {
											section = $(this).parent().parent().parent().parent().parent().attr('id').split('_')[1];
											details.displayType[section] = details.displayType[section] === "totalComp" ? "baseSalary" : "totalComp";
											details['make'+section]();
											$(this).parent().parent().find('.active').removeClass('active');
											$(this).parent().addClass('active');
										}	
									});
									if (theDetails[2] === "2014" && theDetails[3] === "public") {$('#tableNotes').find('.yr2014').show();} else {$('#tableNotes').find('.yr2014').hide();}
								} else {
									table.start = 0;
									$('#table-main').find('.table_window').css('max-height',"708px" );
									data.filters.year = theDetails[2] ? theDetails[2] : theDetails[1] === "public" ? '2019' : '2017';
									if (theDetails[1] !== data.filters.control) {tableFilter.controlSwitch(theDetails[1]);}
									$('#ec_container').removeClass('details public private').addClass(theDetails[1]);
									$('#control_private').show();
									$('#control_public').show();
									data.filters.control = theDetails[1];
									$('.activeTab').removeClass('activeTab');
									$('#control_'+data.filters.control).find('a').addClass('activeTab');
									$('#ec_details').fadeOut();
									$('#ec_table').fadeIn();
									$('.filtersOnly').fadeIn();
									$('#details_tableReturn').hide();

									$('#ecdrop_'+data.filters.control).addClass('ecdrop_active');
									tempYear = data.filters.control === 'public' && +data.filters.year < 2018 ? (+data.filters.year - 1) + "-" + (+data.filters.year - 2000) : data.filters.year;
									$('#year_select > a').text(tempYear);
									$('#year_select').find('li').removeClass('ecdrop_active');
									yrID = data.filters.control === "private" ? 'ecdropcy' : 'ecdropfy';
									$('#' +yrID + "_" + data.filters.year).addClass('ecdrop_active');
									$('#ec_details').hide();
									$('#ec_table').show();
									if (url.hasTable !== data.filters.control + '_' + data.filters.year) {
										for (index in data.flagable) {
											data.flagable[index] = false;
										}
										data.fetch();
									} else {
										$('#note_custom').html('');
										$('#tableNotes').find('.flagable').hide();
										for (index in data.flagable) {
											if (data.flagable[index]) {
												$('#note_' + index).show();
											}
										}
									}
									url.hasTable = data.filters.control + '_' + data.filters.year;
									if (theDetails[2] === "2014" && theDetails[1] === "public") {
										$('#tableNotes').find('.yr2014').show();
									} else {
										$('#tableNotes').find('.yr2014').hide();}
									}
								};
								if (params.id) {
									if (params.id === url.currentParams) {
										return false;
									} else {
										url.previousParams = url.currentParams;
										url.currentParams = params.id;
										initializePage();
									}
								} else {
									if (url.currentParams === "") { // if no institution id and no current institution, reset url to default institution with no arguments
										window.location = "#id=table_public_2019";
									}
								}
							});
						$(window).trigger('hashchange');
					}
			}
		},
		view = {
			structureHtml: '',
			tables: {
				'baseSalary': '',
				'totalComp': '',
				'tuitionTotalCompRatio': '',
				'totalCompExpendituresRatio': ''
			},
			highestVal: 0,// row content contained in tbody
			generate: function() { // self-defining function
				var that = this,
					// first time this function runs, create whole table
					updateRows = function() {
						var v;
						url.idnote = {};
						view.footnoteNum = 1;
						$('#note_custom').html('');
							v = that.getRows();
							that.drawRows(v);
					};

				if (!tableSearch.exists) {
					tableSearch.init();
					tableSearch.exists = true;
				}
				updateRows();
				nav.paginate.init();
				this.generate = updateRows; // redefine this function so after first time just update rows
			},
			footnoteNum: 1,
			failRows: function (k) {
				return "<tr class='failrow'><td colspan='2'>No institutions had the data shown in this table.</td></tr>";
			},
			getRows: function() {
				var rowsHtml = '',
					row = 0,
					rows = data.raw.length,
					d = data,
					transformData = function(d, i, rowData, colname) {
						var displayFunction, displayValue, transformCols = {
							'employeeName': function(d) {
								var isPartial = (rowData.partialYear === "1") ? '<span class="partialStar"><sup>*</sup><span class="partialStarNote">Did not serve as chief executive for the full year.</span></span>' : '',
									fnote = '', theHTML,
									targetVal = +rowData.totalComp,
									nonbasePct = +rowData.baseSalary < targetVal ? (((targetVal - (+rowData.baseSalary))/targetVal) * 100) + "%" : '',
									name = rowData.employeeName,
									hoverBox = '<div class="ec_rowHover"><span class="ech_label">' + name + ' <em>' + rowData.chronorgname + ', ' + rowData[data.yearType[data.filters.control]] + '</em></span><span class="ech_detail"><em>Total Compensation: </em>' + view.nullCheck(rowData.totalComp,'$','') + 
										'</span><span class="ech_detail ech_base"><em>Base Pay: </em>' + view.nullCheck(rowData.baseSalary,'$','') + '</span>' + '<span class="ech_detail ech_bonus"><em>Bonus Pay: </em>' + view.nullCheck(rowData.bonus,'$','') + 
										'</span><span class="ech_detail ech_other"><em>Other Pay: </em>' + view.nullCheck(rowData.otherComp,'$','') + '</span></div>';
									empPhoto = rowData.photoURL ? rowData.photoURL : "//chronicle.s3.amazonaws.com/DI/exec-comp/not_available.jpg";
								if (rowData.footnoteFlag) {
									if (rowData.footnoteFlag && (+rowData.footnoteFlag > 0)) {
										fnote = '<sup>' + url.alpha[+rowData.footnoteFlag] + '</sup>';
										$('#note_' + rowData.footnoteFlag).show();
										data.flagable[+rowData.footnoteFlag] = true;
									} 
								}
								view.highestVal = Number(targetVal) > view.highestVal ? Number(targetVal): view.highestVal; 
									theHTML = '<div class="ect_name"><div class="ect_head"><img class="fl headshot" src="' + empPhoto + '" alt="' + name + '" /></div><span class="name">' + name + ' ' + isPartial + fnote + 
									'</span><span class="college">' + rowData.chronorgname + '</span></div><div class="ec_baractual" data-val="' + targetVal + 
									'"><div class="ecba_notbase" style="width:' + nonbasePct + ';"></div></div><span class="ec_barlabel">' + view.nullCheck(targetVal, '$', '') + "</span>" + hoverBox;
								return theHTML;
							}
						};
						displayFunction = transformCols[colname];
						displayValue = displayFunction(d);
						return displayValue;
					},
					getRowContentHtml = function(rowData) {
						var contentHtml = '';
						contentHtml = '<td class="col_0">' + transformData(rowData.employeeName, 0, rowData, 'employeeName') +'</td>';

						return contentHtml;
					},
					getRowHtml = function(rowData, rowNumber) {
						var rowHtml = '',
							evenOdd = 'odd',
							yrTemp = data.filters.control === 'public' && +data.filters.year > 2017 ? data.filters.year : rowData[data.yearType[data.filters.control]];
						if ((rowNumber + 1) % 2 === 0) {
							evenOdd = 'even';
						}
						rowHtml += '<tr id="table-' + rowData.employeeID + '_' + rowData.unitid + '_'+ yrTemp + '_' + data.filters.control + '" class="result ' + evenOdd + '">';
						rowHtml += getRowContentHtml(rowData);
						rowHtml += '</tr>';
						return rowHtml;
					};
					for (row = 0; row < rows; row++) {
						rowsHtml += getRowHtml(data.raw[row], row);
					}
				return rowsHtml;
			},
			nullCheck: function(val, prefix, suffix, tofixed2, noZero) {
				var asNum = parseFloat(val);
				if (isNaN(asNum)) {
					asNum = "N/A";
				} else if (noZero && asNum === 0) {
					asNum = "N/A";
				} else if (tofixed2) {
					asNum = prefix + Math.round(asNum).toString().addCommas() + suffix;
				} else {
					asNum = prefix + asNum.toString().addCommas() + suffix;
				}
				return asNum;
			},
			drawRows: function(v) {
				table.container.addClass('loaded').find('tbody').html(v);
				$('tr.result').unbind('click').click(function(e) {
					var theID = $(this).attr('id').split('-')[1];
					window.location = "#id=" + theID;
				});
				$('tr.result').each(function() {
					var theBar =$(this).find(".ec_baractual"),
						thisNum = Number(theBar.attr("data-val")),
						proportion = thisNum/view.highestVal * 100;
					theBar.css({'width':proportion + "%"});
				});
			},
			tableSwitch: {
				init: function () {},
				changeHandler: function () {}
			}
		},
		details = {
			contextWidth: 0,
			contextBlob: [],
			emp: [],
			fnotearray: {},
			raw: {},
			active: {
				'year': '2019',
				'org': '',
				'employee': '',
				'control': 'public'
			},
			displayType: {
				'compare': 'totalComp',
				'employees': 'totalComp'
			},
			activePlaced: false,
			rankMax: {
				'public': {
					'2019': '285',
					'2018': '268',
					'2017': '253',
					'2016': '254',
					'2015': '258',
					'2014': '244',
					'2013': '255',
					'2012': '212',
					'2011': '198',
					'2010': '184'
				},
				'private': {
					'2017': '560',
					'2016': '528',
					'2015': '556',
					'2014': '510',
					'2013': '531',
					'2012': '502',
					'2011': '517',
					'2010': '473',
					'2009': '477',
					'2008': null
				}
			},
			compare: [],
			prior: [],
			employees: [],
			selectedInst: null,
			benefitsLookup: {
				'house': 'House',
				'car': 'Car',
				'club': 'Club',
				'personal': 'Personal services',
				'expenseAccount': 'Expense account',
				'travel': 'Travel',
				'otherFringe': 'Other fringe benefits'
			},
			params: {
				active: {
					'datasets': ['Total','Base','Bonus','Deferred', 'Severance'],
					'saved': true
				},
				max: {
					'employees': null,
					'prior': null,
					'compare': null,
					'custom': null
				}
			},
			idnote: {},
			footnoteNum: 1,
			init: function() {
				var that = this,
					getSearchData = cheg.getData({
						name: 'detailsEmp' + table.dataVersion,
						table: table.noun,
						sort: data.yearType[details.active.control] + ':dsc',
						url: '/find/unitid:' + details.active.org + ':eq|positionCategory:1:eq',
						success: that.processEmp
					});
				details.emp = [];
				details.activePlaced = false;
				if (!tableSearch.exists) {
					tableSearch.init();
					tableSearch.exists = true;
				}
			},
			partialCheck: function(partial) {
				if (partial === "1") {
					return '<span class="partialStar"><sup>*</sup><span class="partialStarNote">Did not serve as chief executive for the full year.</span>';//"<span class='pAsterisk'>*</span>";
				} else {
					return "";
				}
			},
			processBenefits: function () {
				$.each(details.benefitsLookup,function(i,d) {
					if (details.emp[i + "Flag"] == "1") {
						$('.dt_bkd_'+i).addClass('active_element');
					} else {
						$('.dt_bkd_'+i).removeClass('active_element');
					}
				});

			},
			makeBreakdown: function (datarow, theID) {
				var barArray = ['baseSalary','bonus', 'nontaxableComp', 'otherComp', 'nonPayrollComp', 'severance', 'deferredCompPaidOut','remainingOtherComp', 'partVIIReportableComp', 'partVIINontaxableComp', 'deferredCompSetAside', 'retirement'],
					colorTemp = {
						'baseSalary':'#6f92b2',
						'bonus':'#53a97c',
						'nontaxableComp':'rgb(215, 225, 52)',
						'otherComp':'rgb(233, 166, 65)',
						'nonPayrollComp':'#e76e49',
						'deferredCompPaidOut':'#876f9d'
					},
					dataArray = [],colorArray = [], labelArray = [];
					var activeCount = 0,
					pie = {type: 'pie', data: [], backgroundColor: [], labels: [], options: 'responsive'},
					tempDisplay;
					
				for (var index in barArray) {
					tempVal = datarow[barArray[index]] ? "$" + datarow[barArray[index]].addCommas() : barArray[index] === 'severance' ? 'N/A' : "$0";
					tempDisplay = '';
					if (datarow[barArray[index]] && datarow[barArray[index]] > 0) {
						$("#break_"+theID).find('.dt_bkd_' + barArray[index]).addClass('active_element').find(".value").text(tempVal);
						dataArray.push((+datarow[barArray[index]] / +datarow.totalComp) * 100);
						colorArray.push(colorTemp[barArray[index]]);
						labelArray.push(barArray[index]);
						if (barArray[index] !== 'deferredCompSetAside' && barArray[index] !== 'retirement' && barArray[index] !== 'deferredCompPaidOut' && barArray[index] !== 'partVIIReportableComp' && barArray[index] !== 'partVIINontaxableComp' && barArray[index] !== 'severance' && barArray[index] !== 'remainingOtherComp') {
							tempPct = ((+datarow[barArray[index]] / +datarow.totalComp) * 100);
							pie.data.push(tempPct);
							pie.backgroundColor.push(colorTemp[barArray[index]]);
							pie.labels.push(barArray[index]);
							$("#break_"+theID).find('.dt_bkd_'+ barArray[index]).find('.swatch').css({'background-color':colorTemp[barArray[index]]});
							
						}
						$("#break_"+theID).find('.dt_bkd_'+barArray[index]).addClass('active_element').find('.value').text(tempVal + tempDisplay);
					} else {
						$("#break_"+theID).find('.dt_bkd_'+barArray[index]).removeClass('active_element').find(".value").text('');
						$("#break_"+theID).find('.dt_bkd_'+ barArray[index]).find('.swatch').css({'background-color':'#eeeeee'});
					}
					activeCount += 1;
				}
				$('#pie_'+theID).html('');
				if (pie.data.length > 1) {
					//$('#'+theID+'pie').show();
	    			Raphael('pie_'+theID, 226, 226).pieChart(113, 113, 101, pie.data, pie.labels, pie.backgroundColor);
	    		} else {
	    			//$('#'+theID+'pie').hide();
	    		}
	    		if (datarow.nonPayrollCompNote && (datarow.nonPayrollCompNote !== "Unspecified")) {
					$("#break_"+theID).find('.dt_bkd_nonPayrollComp').find('.bkd_note').show().find('.bkdn_text').text(datarow.nonPayrollCompNote);

				} else {
					$("#break_"+theID).find('.dt_bkd_nonPayrollComp').find('.bkd_note').hide();
				}
			
				if (datarow.remainingOtherCompNote && (datarow.remainingOtherCompNote !== "Unspecified")) {
					$("#break_"+theID).find('.dt_bkd_remainingOtherComp').find('.bkd_note').show().find('.bkdn_text').text(datarow.remainingOtherCompNote);

				} else {
					$("#break_"+theID).find('.dt_bkd_remainingOtherComp').find('.bkd_note').hide();
				}
					
				if (details.active.control === "public") {
					$('.details_benefits').show();
					details.processBenefits();
				} else {
					$("#break_"+theID).find('.details_benefits').hide().removeClass('active_element');
				}
				if (!datarow.severance || (datarow.severance === '0')) {
					$("#break_"+theID).find('.dt_bkd_severance').hide();
				} else {
					$("#break_"+theID).find('.dt_bkd_severance').show();
				}
				if ((datarow.public === '1') && (+datarow.fiscalYear < 2016) && (+datarow.calendarYear < 2018)) {
					$("#break_"+theID).find('.dt_bkd_nontaxableComp').hide();
				} else {
					$("#break_"+theID).find('.dt_bkd_nontaxableComp').show();
				}
				if ((datarow.public === '1') && (+datarow.fiscalYear < 2016) && (+datarow.calendarYear < 2018)) {
					$("#break_"+theID).find('.dt_bkd_remainingOtherComp').hide();
				} else {
					$("#break_"+theID).find('.dt_bkd_remainingOtherComp').show();
				}
				if (datarow.private === "1") {
					$('#details_breakdown').find('.private_row').show();
					$('#details_breakdown').find('.public_row').hide();
					if ((+datarow.baseSalary === 0) && (+datarow.partVIIReportableComp > 0) ) {
						$("#break_"+theID).find('.dt_bkd_partVIIReportableComp').show();
						$("#break_"+theID).find('.nop7_row').hide();
					} else {
						$("#break_"+theID).find('.dt_bkd_partVIIReportableComp').hide();
						$("#break_"+theID).find('.nop7_row').show();
					}
					if (+datarow.partVIINontaxableComp > 0) {
						$("#break_"+theID).find('.dt_bkd_partVIINontaxableComp').show();
					}

				} else {
					$('#details_breakdown').find('.private_row').hide();
					$('#details_breakdown').find('.public_row').show();
				}
				$('.ds_header').find('.ds_year').text(details.active.year);
				$('.ds_header').find('.ds_control').text(details.active.control);
				$('.details_context').find('.ds_control').text(details.active.control);
			},
			makeSummary: function() {
				var results, starttemp, endtemp,
					photo, empName, isPartial, rankText, endData,
					$detailH = $('#details_header'), uniqueCode,
					fnote, i;
				$('#details_breakdown').html('');
				for (i =0; i < details.raw[details.active.org].length; i++) {
					if (details.raw[details.active.org][i].calendarYear === details.active.year || details.raw[details.active.org][i].fiscalYear === details.active.year) {
						results = details.raw[details.active.org][i];
						uniqueCode = results.employeeID + "_" + details.active.year;
						photo = results.photoURL ? results.photoURL : "//chronicle.s3.amazonaws.com/DI/exec-comp/not_available.jpg";
						empName = results.employeeName;
						isPartial = results.partialYear === "1" ? '<span class="partialStar"><sup>*</sup><span class="partialStarNote">Did not serve as chief executive for the full year.</span>' : '';
						rankText = results.totalCompRank && details.rankMax[details.active.control][details.active.year] ? ' <span><span class="rankPos">' + results.totalCompRank + '</span>/' + details.rankMax[details.active.control][details.active.year] + '</span>':'<span><span class="rankPos"> </span></span>';
						endDate = results.endYear ? results.endMonth ? cheg.months[results.endMonth] + ' ' +results.endYear : results.endYear : 'current';
						$('#details_breakdown').append('<div class="presbox" id="box_'+uniqueCode+'"><div class="preshed" id="hed_'+uniqueCode+'"><img class="detail_photo" src="" />'+
                			'<h3><span class="details_name"></span><span class="details_main"></span></span></h3><p class="presterm"></p></div><div class="presbreak" id="break_'+uniqueCode+'"><div id="pie_'+uniqueCode+'" class="bkd_pie"></div>'+
                '<div class="dtb_sect">'+
                    '<h4>Total compensation</h4>'+
                    '<p class="details_breakdown nop7_row dt_bkd_baseSalary"><span class="swatch"></span>Base pay <span class="value"></span></p>'+
                    '<p class="dt_bkd_bonus details_breakdown nop7_row"><span class="swatch"></span>Bonus pay <span class="value"></span></p>'+
                    '<p class="dt_bkd_partVIIReportableComp private partvii_row details_breakdown details_other"><span class="swatch"></span>Reportable compensation <span class="value"></span></p>'+
                    '<p class="dt_bkd_partVIINontaxableComp private partvii_row details_breakdown details_other"><span class="swatch"></span>Other compensation <span class="value"></span></p>'+
                    '<p class="dt_bkd_nontaxableComp details_breakdown nop7_row"><span class="swatch"></span>Nontaxable benefits <span class="value"></span></p>'+
                    '<p class="dt_bkd_otherComp details_breakdown nop7_row"><span class="swatch"></span>Other pay <span class="value"></span></p>'+
                    '<p class="dt_bkd_deferredCompPaidOut public sub-bkd details_breakdown nop7_row details_other"><span class="swatch"></span>Deferred paid out <span class="value"></span></p>'+
                    '<p class="dt_bkd_severance sub-bkd details_breakdown details_other"><span class="swatch"></span>Severance pay <span class="value"></span></p>'+
                    '<p class="dt_bkd_remainingOtherComp public sub-bkd details_breakdown details_other"><span class="swatch"></span>Remaining reportable <span class="value"></span><span class="bkd_note">i<span class="bkdn_text"></span></span></p>'+
                    '<p class="dt_bkd_nonPayrollComp details_breakdown nop7_row"><span class="swatch"></span>Non-payroll compensation <span class="value"></span><span class="bkd_note">i<span class="bkdn_text"></span></span></p>'+
                '</div>'+
                '<div class="dtb_sect dtbs_other">'+
                '<h4>Other benefits<!--not included in total compensation--></h4>'+
                    '<p class="dt_bkd_deferredCompSetAside details_breakdown details_other"><span class="swatch active"></span>Pay set aside <span class="value"></span></p>'+
                    '<p class="dt_bkd_retirement details_breakdown details_other"><span class="swatch active"></span>Retirement <span class="value"></span></p>'+
                    '<p class="dt_bkd_house details_breakdown details_benefits details_other"><span class="swatch active"></span>House Benefit</p>'+
                    '<p class="dt_bkd_car details_breakdown details_benefits details_other"><span class="swatch active"></span>Car benefit</p>'+
                    '<p class="dt_bkd_club details_breakdown details_benefits details_other"><span class="swatch active"></span>Social club benefit</p>'+
                    '<p class="dt_bkd_personal details_breakdown details_benefits details_other"><span class="swatch active"></span>Personal services benefit</p>'+
                '</div<</div></div>');
						$('#hed_'+uniqueCode).find('.detail_photo').attr('src', photo);
						$('#hed_'+uniqueCode).find('.details_main').html("$"+results.totalComp.addCommas() + "<span class='details_rank'>" + rankText + "</span>");
						if (results.footnoteFlag) {
							if (results.footnoteFlag && (+results.footnoteFlag > 0)) {
								fnote = '<sup>' + url.alpha[+results.footnoteFlag] + '</sup>';
								$('#note_' + results.footnoteFlag).show();
							} else if (results.footnoteFlag) {
								if (details.idnote[results.employeeID]) {
									fnote = '<sup>' + details.idnote[results.employeeID] + '</sup>';
								} else {
									fnote = '<sup>' + details.footnoteNum + '</sup>';
									details.idnote[results.employeeID] = details.footnoteNum;
									$('#note_custom').append('<p><sup>' + details.footnoteNum + '</sup> ' + results.footnote + '</p>');
									details.footnoteNum += 1;
								}
							}
						} else {
							fnote = '';
						}
						$('#hed_'+uniqueCode).find('.details_name').html(empName + isPartial + fnote);
						startTemp = results.startYear ? 'Started ' + cheg.months[results.startMonth] + " " + results.startYear + "" : '';
						endTemp = results.endYear ? '<span class="endedTerm">| </span>Ended ' + cheg.months[results.endMonth] + " " + results.endYear: "";
						$('#hed_'+uniqueCode).find('.presterm').html(results.employeeTitle + "<span class='startedTerm'><span class='termsep'> | </span>" + startTemp + endTemp + "</span>");
						details.makeBreakdown(results, uniqueCode);
					}
					
				}
				$detailH.find('h2').html(details.emp.chronorgname);
				$('.presbox').removeClass('activepres');
				
				$('#box_'+ details.active.employee +"_"+ details.active.year).addClass('activepres');
				$('.presbox').click(function() {
					if (!$(this).hasClass('activepres')) {
						window.location = "#id="+$(this).attr('id').split('_')[1] + "_" + details.active.org + "_" + details.active.year + "_" + details.active.control;

					}
				});
				/*$detailH.find('p').html(details.emp.stabbr);*/
				
				
				/*if (results.totalComp) {
					$('#hed'+uniquecode).find('.details_main').style(html('$' + results.totalComp.addCommas() + details.partialCheck(results.partialYear));
				} else {
					$('#details_totalcomp').text('N/A');
				}*/
				

				
			},
			contextType: function(value, set) {
				var num = Number(value);
				if (!value || (num === 0 && set === "tuiper") || (num === 0 && set === "salary")|| (num === 0 && set === "expper")|| (num === 0 && set === "tuition") || (num === 0 && set === "salper")) {
					$('#' + set + '_value').text("N/A");
					$('#' + set + '_percent').text("--");
				} else {
					$('#' + set + '_percent').text(view.nullCheck(Math.round(+value),'','').addRank() + " percentile");
				}

			},
			getContext: function() {
				var tempYr = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? details.emp.calendarYear: details.emp.fiscalYear,
					yrType = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? "calendarYear" : "fiscalYear",
					sysTemp = details.emp.system ? +details.emp.system > 0 ? '|system:0:gt': '|system:0:eq' : '',
					sysLabel = +details.emp.system > 0 || !details.emp.system ? 'College' : 'System';
					$('#details_context').find('.ds_system').text(sysLabel);
					$('#details_context').find('.context_chart').html('<span class="preContext">Loading ...</span>');
					getContextData = cheg.getData({
						name: 'detailsContext' + table.dataVersion,
						table: table.noun,
						fields: ['unitid','tuitionTotalCompRatio','totalCompExpendituresRatio', 'totalComp', 'fullProfSalaryTotalCompRatio','tuitionFees','fullProfSalary','instExpenditures','employeeName','chronorgname','employeeID','system'],
						url: '/find/' + yrType + ':' + tempYr + ':eq' + sysTemp + '|positionCategory:1:eq',
						success: this.processContext
					});
			},
			getMedian: function (values) {
    			values.sort( function(a,b) {return a - b;} );
    			var half = Math.floor(values.length/2);
    			if (values.length % 2) {
    				return values[half];
    			} else {
    				return (values[half-1] + values[half]) / 2;
    			}
			},
			processContext: function(json) {
				details.contextBlob = json;
				details.contextWidth = $('#details_context').width();

				var contextBlocks = ['tuitionTotalCompRatio','totalCompExpendituresRatio', 'totalComp', 'fullProfSalaryTotalCompRatio'],
				thisItem, thisVal, thisPos, i, 
				displayFields = {
					'tuitionTotalCompRatio': ['tuitionTotalCompRatio','tuitionFees', 'totalComp'],
					'totalCompExpendituresRatio': ['totalCompExpendituresRatio', 'totalComp','instExpenditures'], 
					'totalComp': ['totalComp'], 
					'fullProfSalaryTotalCompRatio': ['totalComp', 'fullProfSalaryTotalCompRatio','fullProfSalary']
				},
				displayNames= {
					'tuitionTotalCompRatio': 'Pay-to-tuition ratio',
					'totalCompExpendituresRatio': 'Pay per millions in expenses', 
					'totalComp': 'Total pay', 
					'fullProfSalaryTotalCompRatio': 'Ratio of total pay to faculty salary',
					'fullProfSalary': 'Full-professor salary',
					'instExpenditures': 'Institution\'s expenses',
					'tuitionFees': 'Average tuition and fees'

				},
				getTooltip= function (row,set) {
					var i, thisItem, tempReturn = '<p class="chart_name">' +row.employeeName + '</p><p class="chart_org">'+row.chronorgname +'</p>';
					for (i=0; i<displayFields[set].length;i++) {
						thisItem = displayFields[set][i];
						tempReturn += '<p class="amount">' + displayNames[thisItem] + ": " + formatter[thisItem](row[thisItem]) + "</p>";
					}
					return tempReturn;
				},
				median = function (values) {
					values.sort( function(a,b) {return a - b;} );
					var half = Math.floor(values.length/2);

				    if (values.length % 2){
				        return values[half];
				    } else {
				        return (values[half-1] + values[half]) / 2.0;
					}
				},
				makeBandChart = function (which) {
            		var width = $('#' + which + '_chart').width(),
				    height = 40;
				
					var x = d3.scale.linear()
					    .range([0, width - 6]);
					var y = d3.scale.linear()
					    .range([height, 0]);
					var svg = d3.select('#' + which + '_chart').append("svg")
					    .attr("width", width)
					    .attr("height", height)
					  	.append("g")
					    	.attr("transform", "translate(0,0)");

					var theData = details.contextBlob,
						div = d3.select(".chart_over");	
					theData.forEach(function(d) {
					 	d[which] = +d[which];
					});
					var theMedian = d3.median(theData, d => d[which]);
					x.domain([0,d3.max(theData, function(d) { return d[which]; })]);
					svg.append('rect')
							.attr('class', 'backdrop')
							.attr("x", 0)
							.attr("y", 0)
							.attr("width", x(theMedian))
							.attr("height", height)
							.style("fill", 'rgba(0,122,173,0.3)');	 		
					  svg.selectAll(".dot")
					      .data(theData)
					    .enter().append("rect")
					      .attr("class", "dot" )
					      .attr("height", 30)
					      .attr("width",  4)
					      .attr('y',  5)
					      .attr('x', function (d) {return x(d[which]);})
					      .style("fill", 'rgb(53,102,129)')
					      .style('opacity', 0.5)
					      .style('cursor','pointer')
					      .style('display',function (d) {
					    if (!d[which] || ((d.employeeID === details.emp.employeeID) && (d.unitid === details.emp.unitid))) {return 'none';} else {return 'block';}
					      })
					      .on("mouseover", function(d) {
					      	d3.select(this).transition().duration(200).style({'opacity': 1});	
				          	div.style("display", 'block');	
				          	div.attr('class',function(d) {
			                	if ((($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width()) - 300) < d3.event.pageX) {
				                		return 'rightside_hover chart_over';
				                	} else{
				                		return 'chart_over';
				                	}
			                });	
			                div.html(getTooltip(d,which));
			                div.style("left", function(d) {	                	
				                	if ($('#' + which + '_chart').width() < 601) {
				                		if ((d3.event.pageX - 140) < 0) {
				                			return '5px';
				                		} else if (((d3.event.pageX - $('#ec_container').offset().left) + 140) > ($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width())) {
				                			return ($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width()) -260 + "px";
				                		} else {
				                			return ((d3.event.pageX - $('#ec_container').offset().left) - 140) + "px";
				                		}
				                	} else {
				                		if ((($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width()) - 300) < d3.event.pageX) {
					                		return ((d3.event.pageX - $('#ec_container').offset().left)- 300) + "px";
					                	} else{
					                		return ((d3.event.pageX - $('#ec_container').offset().left) + 30) + "px";
					                	}
					                }
				                })		
				                .style("top", function(d) {
				                	if ($('#' + which + '_chart').width() <= 601) {
				                		return ((d3.event.pageY - $('#ec_container').offset().top) + 30) + 'px';
				                	} else {
				                		return ((d3.event.pageY - $('#ec_container').offset().top) - 30) + "px";
				            		}
				            });
				        
				         })					
				        .on("mouseout", function(d) {	
				        	d3.select(this).transition().duration(200).style({'opacity': 0.6}).attr("r", 6);	
				        	div.style("display", 'none');	
				        })
				        .on("click", function (d) {
				        	var idyear = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? details.emp.calendarYear: details.emp.fiscalYear,
				        		control = details.emp.private === '1' ? 'private' : 'public';
				        	window.location = "#id="+d.employeeID + "_" + d.unitid + "_" + idyear + "_" + control;
			        	});
				         svg.append('rect')
							.attr('class', 'thisPage')
							.attr("x", x(+details.emp[which]))
							.attr("y", 0)
							.attr("width", 6)
							.attr("height", 40)
							.style("fill", 'orange')
							.on("mouseover", function(d) {
						      	d3.select(this).transition().duration(200).style({'opacity': 1});	
					          	div.style("display", 'block');	
					          	div.attr('class',function(d) {
				                	if ((($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width()) - 300) < d3.event.pageX) {
					                		return 'rightside_hover chart_over thisOrg_over';
					                	} else{
					                		return 'chart_over thisOrg_over';
					                	}
				                });	
				                div.html(getTooltip(details.emp,which));
				                div.style("left", function(d) {	                	
					                	if ($('#' + which + '_chart').width() < 601) {
					                		if ((d3.event.pageX - 140) < 0) {
					                			return '5px';
					                		} else if (((d3.event.pageX - $('#ec_container').offset().left) + 140) > ($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width())) {
					                			return ($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width()) -260 + "px";
					                		} else {
					                			return ((d3.event.pageX - $('#ec_container').offset().left) - 140) + "px";
					                		}
					                	} else {
					                		if ((($('#' + which + '_chart').offset().left + $('#' + which + '_chart').width()) - 300) < d3.event.pageX) {
						                		return ((d3.event.pageX - $('#ec_container').offset().left)- 300) + "px";
						                	} else{
						                		return ((d3.event.pageX - $('#ec_container').offset().left) + 30) + "px";
						                	}
						                }
					                })		
					                .style("top", function(d) {
					                	if ($('#' + which + '_chart').width() <= 601) {
					                		return ((d3.event.pageY - $('#ec_container').offset().top) + 30) + 'px';
					                	} else {
					                		return ((d3.event.pageY - $('#ec_container').offset().top) - 30) + "px";
					            		}
					            });
					        })
						.on("mouseout", function(d) {	
				        	d3.select(this).transition().duration(200).style({'opacity': 0.6}).attr("r", 6);	
				        	div.style("display", 'none');	
				        });
				        
				},
				formatter = {
					'tuitionTotalCompRatio': function (val) {
						return val ? +val >= 1 ? Math.round(+val).toString().addCommas() + ":1" : +val.toFixed(2) + ":1" : "N/A";
					},
					'totalCompExpendituresRatio': function (val) {
						return val ? "$" + Math.round(+val).toString().addCommas() : "N/A";
					}, 
					'totalComp': function (val) {
						return val ? "$" + val.toString().addCommas() : "N/A";
					}, 
					'fullProfSalaryTotalCompRatio': function (val) {
						return val ? +val >= 1 ? Math.round(+val).toString().addCommas() + ":1" : +val.toFixed(2) + ":1" : "N/A";
					},
					'fullProfSalary': function (val) {
						return val ? "$" + val.addCommas() : "N/A";
					},
					'instExpenditures': function (val) {
						return val ? "$" + val.addCommas() : "N/A";
					},
					'tuitionFees': function (val) {
						return val ? "$" + val.addCommas() : "N/A";
					}
				};
				$('#details_context').find('.context_chart').html('');
				makeBandChart('totalComp');
				if (details.emp.tuitionFees) {
					$("#tuitionTotalCompRatio_context").show();
					makeBandChart('tuitionTotalCompRatio');
				} else {
					$("#tuitionTotalCompRatio_context").hide();
				}
				if (details.emp.fullProfSalary) {
					$("#fullProfSalaryTotalCompRatio_context").show();
					makeBandChart('fullProfSalaryTotalCompRatio');
				} else {
					$("#fullProfSalaryTotalCompRatio_context").hide();
				}
				if (details.emp.instExpenditures) {
					$("#totalCompExpendituresRatio_context").show();
					makeBandChart('totalCompExpendituresRatio');
				} else {
					$("#totalCompExpendituresRatio_context").hide();
				}
				for ( i=0;i<json.length;i++) {
					for (var index in contextBlocks) {
						if (json[i][contextBlocks[index]]) {
							if ((json[i].employeeID === details.emp.employeeID) && (json[i].unitid === details.emp.unitid)) {
								$('#' + contextBlocks[index] + "_context").find('p').find('span').text(formatter[contextBlocks[index]](json[i][contextBlocks[index]]));
							}
						} else if ((json[i].employeeID === details.emp.employeeID) && (json[i].unitid === details.emp.unitid)) {
							$('#' + contextBlocks[index] + "_context").find('p').find('span').text("N/A");
						}
					}
				}
				
				$(window).unbind("resize").resize(function() {
    				if(this.resizeTO) clearTimeout(this.resizeTO);
    				this.resizeTO = setTimeout(function() {
        				$(this).trigger('resizeEnd');
    				}, 500);
				});
				$( window ).unbind("resizeEnd").bind('resizeEnd', function() {
    				if (details.contextWidth !== $("#details_context").width()) {
						details.processContext(details.contextBlob);
					}
				});
			},
			shortenNum: function(val) {
				var str = Number(val),
					final;
					if (val === null || !val) {
						final = "N/A";
					} else if (str >= 1000000000) {
					final = "$" + (str/1000000000).toFixed(1).toString() + "B";
				} else if (str >= 1000000) {
					final =  "$" + (str/1000000).toFixed(1).toString() + "M";
				} else {
					final = "$" + val.addCommas();
				}
				return final;
			},
			resetSettings: function() {
				details.params.max.employees = 0;
				details.params.max.compare = 0;
			},
			overtimeprocess: function (yearArray) {
				var isActive = '', lastYear = null, displayYear, bestPres, bestStart = 9999, yearDisplay, activeYear, selectPres = false;
				$('#overtime_key').html('');
				for (var index in yearArray) {
					if (yearArray[index].year !== lastYear && lastYear) {
						yearDisplay = ((+lastYear < 2018) &&( details.active.control === 'public')) ? (+lastYear - 1)+ "-" +(+lastYear - 2000): lastYear;
						$('#overtime_key').append('<li id="ot"' + lastYear + '_"' + isActive + '><a href="#id='+ bestPres + '_' + details.active.org + '_' + lastYear  + '_' + details.active.control + '">' + yearDisplay + '</a></li>');
						bestStart =9999;
						selectPres = false;
					}
					if (yearArray[index].prezs === details.active.employee) {
						bestPres = yearArray[index].prezs;
						selectPres = true;
					}
					if ((yearArray[index].prezStart < bestStart) && !selectPres) {
						bestPres = yearArray[index].prezs;
						bestStart = +yearArray[index].prezStart;
					}
					isActive = yearArray[index].year === details.active.year ? ' class="active"' : '';
					lastYear = yearArray[index].year;
					
				}
				$('#overtime_key').find('a').click(function(e) {
					window.location = $(this).attr('href');
				});
			},
			processEmp: function(json) {
				var that = this,
					targetNode,
					yearArray = [],
					yearMatch;
				for (var i=0, ii=json.length; i<ii; i++) {
					yearMatch =  +json[i].calendarYear > 2017 ? details.active.year === json[i].calendarYear : json[i][data.yearType[details.active.control]] === details.active.year;
					if (yearMatch && json[i].employeeID === details.active.employee) {
						targetNode = i;
					}
					tempYr = (json[i].private === '1') || (+json[i].calendarYear > 2017) ? json[i].calendarYear: json[i].fiscalYear;
					yearArray.push({'year':tempYr,'prezs':json[i].employeeID,'prezStart':json[i].startYear});
				}
				yearArray.sort(function(a,b) {
					x = +a.year;
					y = +b.year;
					if (x > y) {
						return -1;
					} else {
						return 1;
					}
				});
				$('#tableNotes').find('.flagable').hide();
				details.idnote = {};
				details.footnoteNum = 1;
				$('#note_custom').html('');
				details.raw[details.active.org] = json;
				details.emp = json[targetNode];
				details.makeSummary();
				details.overtimeprocess(yearArray);
				details.getContext();
				
				if ((details.active.control === 'private' && +details.active.year > 2010) || (details.active.control === 'public' && +details.active.year > 2012)) {
					$('#details_employees').show();
					details.getEmployees();
				} else {
					$('#details_employees').hide();
				}
				details.getSim();

			},
			getEmployees: function() {
				var that = this,
					tempYr = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? details.emp.calendarYear: details.emp.fiscalYear,
					yrType = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? "calendarYear" : "fiscalYear";
				var getSearchData = cheg.getData({
					name: 'detailsEmployees' + table.dataVersion,
					table: table.noun,
					sort: 'totalComp:dsc',
					url: '/find/' + yrType + ':'+tempYr+':eq|unitid:' + details.active.org,
					success: that.processEmployees
				});
			},
			getSim: function() {
				details.compare = [];
				var that = this,
					simset = details.emp.similar,
					tempYr = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? details.emp.calendarYear: details.emp.fiscalYear,
					yrType = (details.emp.private === '1') || (+details.emp.calendarYear > 2017) ? "calendarYear" : "fiscalYear",
					similars, similarString;
					$('#details_compare').hide();
				if (simset) {
					similars = simset.split('|');
					similarString = '[[unitid:' + details.emp.unitid + ':eq|employeeID:' + details.emp.employeeID + ':neq]';
					for (var i = 0, ii = similars.length; i < ii; i++) {
						similarString += '||unitid:';
						similarString += similars[i];
						similarString += ":eq";
					}
					var getSearchData = cheg.getData({
						name: 'detailsSimilar' + table.dataVersion,
						table: table.noun,
						sort: 'totalComp:dsc',
						url: '/find/' + yrType + ':' + tempYr + ':eq|positionCategory:1:eq|' + encodeURI(similarString) + ']',
						success: that.processSim
					});
				}
			},
			processEmployees: function(json) {
				details.employees = json;
				if (json.length > 1) {
					$('#details_employees').show();
					details.makeemployees();
				} else {
					$('#details_employees').hide();
				}
			},
			processSim: function(json) {
				var emp = details.emp;
				json.splice(0, 0, emp);
				details.compare = [];
				details.compare = json;
				$('#details_compare').show();
				details.makecompare();
			},
			makeemployees: function() {
				var emps = details.employees,
					employeesLength = emps.length,
					results = details.emp,
					presID = details.active.employee,
					maxTemp =0,
					maxComp = 0,
					presPos, presClass, otherHighest, lastPos, fnote = '', otherPos, highest, presComp = results.totalComp,
					otherComp, difference, prezLast = false;
					$('#details_employees').find('.ds_content').html('');
				for (var i = 0, ii = employeesLength; i < ii; i++) {
					maxTemp = Number(emps[i][ details.displayType.employees ]);
					maxComp = maxTemp > maxComp ? maxTemp : maxComp;
					if (emps[i].employeeID === presID) {
						presClass = " ec_bar_thisinst";
					} else {
						presClass = '';
					}
					lastPos = (i === (employeesLength -1)) ? ' last_row' : '';
					if (emps[i][ details.displayType.employees ]) {
						if (emps[i].footnoteFlag) {
							if(emps[i].footnote == '' && emps[i].footnoteFlag === '0' ) {} else {

								if (emps[i].footnoteFlag && (+emps[i].footnoteFlag > 0)) {
									fnote = '<sup>' + url.alpha[+emps[i].footnoteFlag] + '</sup>';
									$('#note_' + emps[i].footnoteFlag).show();
								} else if (emps[i].footnoteFlag) {
									if (details.idnote[emps[i].employeeID]) {
										fnote = '<sup>' + details.idnote[emps[i].employeeID] + '</sup>';
									} else {
										fnote = '<sup>' + details.footnoteNum + '</sup>';
										details.idnote[emps[i].employeeID] = details.footnoteNum;
										$('#note_custom').append('<p><sup>' + details.footnoteNum + '</sup> ' + emps[i].footnote + '</p>');
										details.footnoteNum += 1;
									}
								}
							}
						} else {
							fnote = '';
						}
						$('#details_employees').find('.ds_content').append('<div id="employees_' + i + '" class="ec_bar_row cat_' + emps[i].positionCategory + presClass + lastPos + '">' + '<div class="ec_bar_label"><div class="swatch"></div>' + emps[i].employeeName + details.partialCheck(emps[i].partialYear) + fnote + '<span>' + emps[i].employeeTitle + '</span></div><div class="ec_bar_container"><div class="ec_bar_actual" style="width:0%;"></div><div class="ec_bar_amount">$' + emps[i][ details.displayType.employees ].addCommas() +'</div></div></div>');
					} else if (emps[i].footnote) {
						$('#details_employees').find('.ds_content').append('<div id="employees_' + i + '" class="ec_bar_row cat_' + emps[i].positionCategory + presClass + lastPos + '">' + '<div class="ec_bar_label"><div class="swatch"></div>' + emps[i].employeeName + details.partialCheck(emps[i].partialYear) + '<span>' + emps[i].employeeTitle + '</span></div><div class="ec_bar_note">' + emps[i].footnote + '</div></div>');
					} else {
						$('#details_employees').find('.ds_content').append('<div id="employees_' + i + '" class="ec_bar_row cat_' + emps[i].positionCategory + presClass + lastPos + '">' + '<div class="ec_bar_label"><div class="swatch"></div>' + emps[i].employeeName + details.partialCheck(emps[i].partialYear) + '<span>' + emps[i].employeeTitle + '</span></div><div class="ec_bar_container"><div class="ec_bar_actual" style="width:0%;"></div><div class="ec_bar_amount">N/A</div></div></div>');
					}
				}
				details.params.max.employees = maxComp;
				details.activeBars('employees');
			},
			activeBars: function(set) {
				var theData = details[set],
					buttonSet = set === "custom" ? "compare":set,
					top = details.params.max[set],
					theWidth, theNum, theTotal, lyTotal, diff, oyWidth;
				for (var i = 0, ii = theData.length; i < ii; i++) {
					theTotal = 0;
					lyTotal = 0;
					theNum = +theData[i][ details.displayType[set] ];
					theWidth = (theNum / Number(top)) * 100;
					
					if (theNum > 0) {
						$('#' + set + '_' + i).find('.ec_bar_actual').animate({
						'width': theWidth + "%"
						}, 800);
					} else {
						$('#' + set + '_' + i).find('.ec_bar_actual').animate({
							'width': "0%"
						}, 400);
					}
				}
			},
			makecompare: function() {
				var emp = details.compare,
					employeesLength = emp.length,
					prezComp = Number(details.emp[ details.displayType.compare ]),
					prezID = details.emp.employeeID,
					highestID = emp[0].employeeID,
					highestComp = Number(emp[0][ details.displayType.compare  ]),
					maxTemp = 0,
					maxComp = 0,
					secondComp = Number(emp[1][ details.displayType.compare ]),
					secondID = emp[1].employeeID,
					difference, diffLang, simRank, presClass, otherComp, empPhoto, doCount = true,
					count = 0,
					fnote, lastPos,
					prezBar = $('#simsets_active_table').find('.details_bars'),
					thisBar = $('#details_compare').find('.ds_content'),
					tcArray = [],
					thisID;
				if (secondComp > highestComp) {
					highestID = secondID;
					highestComp = secondComp;
				}
				if (highestID === prezID) {
					otherComp = secondComp;
					diffLang = " more than the second ";
					doCount = false;
					difference = '$' + (prezComp - otherComp).toString().addCommas();
				} else {
					otherComp = highestComp;
					count = 0;
					difference = '$' + (otherComp - prezComp).toString().addCommas();
					diffLang = " less than the ";
				}
				thisBar.html('');
				for (var i = 0, ii = employeesLength; i < ii; i++) {
					thisID = i;
					maxTemp = Number(emp[i][ details.displayType.compare ]);
					maxComp = maxTemp > maxComp ? maxTemp : maxComp;
					if (doCount) {
						if (Number(emp[i][ details.displayType.compare ]) >= prezComp) {
							count += 1;
						} else {
							doCount = false;
						}
					}
					if (emp[i].employeeID === prezID && emp[i].unitid === details.active.org) {
						presClass = " ec_bar_thisinst";
					} else {
						presClass = '';
					}
					empPhoto = emp[i].photoURL ? emp[i].photoURL : "//chronicle.s3.amazonaws.com/DI/exec-comp/not_available.jpg";
					if (emp[i].partialYear !== "1") {
						tcArray.push(Number(emp[i][ details.displayType.compare ]));
					}
					lastPos = (i === (employeesLength -1)) ? ' last_row' : '';
					if (i !== 0 || !details.activePlaced) {
						if (emp[i][ details.displayType.compare ]) {
							if (emp[i].footnoteFlag) {
								if (emp[i].footnoteFlag && (+emp[i].footnoteFlag > 0)) {
									fnote = '<sup>' + url.alpha[+emp[i].footnoteFlag] + '</sup>';
									$('#note_' + emp[i].footnoteFlag).show();
								} else if (emp[i].footnoteFlag) {
									if (details.idnote[emp[i].employeeID]) {
										fnote = '<sup>' + details.idnote[emp[i].employeeID] + '</sup>';
									} else {
										fnote = '<sup>' + details.footnoteNum + '</sup>';
										details.idnote[emp[i].employeeID] = details.footnoteNum;
										$('#note_custom').append('<p><sup>' + details.footnoteNum + '</sup> ' + emp[i].footnote + '</p>');
										details.footnoteNum += 1;
									}
								}
							} else {fnote = '';}
							if (i === employeesLength -1) {
								presClass += " last_row";
							}
							thisBar.append('<div id="compare_' + thisID + '" data="' + emp[i].employeeID + '_' + emp[i].unitid + '_' + details.active.year + '_' + details.active.control + '" class="ec_bar_row' + presClass + lastPos + '"><div class="ec_bar_label">' + 
							emp[i].employeeName + details.partialCheck(emp[i].partialYear) + fnote + ' <span>' + emp[i].chronorgname + '</span></div><div class="ec_bar_container"><div class="ec_bar_actual"></div><div class="ec_bar_amount">$' + emp[i][ details.displayType.compare  ].addCommas() +'</div></div></div>');
						} else {
							thisBar.append('<div id="compare_' + thisID + '" data="' + emp[i].employeeID + '_' + emp[i].unitid + '_' + details.active.year + '_' + details.active.control + '" class="ec_bar_row' + presClass + lastPos + '"><div class="ec_bar_label">' + 
							emp[i].employeeName + details.partialCheck(emp[i].partialYear) + fnote + ' <span>' + emp[i].chronorgname + '</span></div><div class="ec_bar_note">' + emp[i].footnote + '</div></div>');
						} 
						$('#compare_' + thisID).click(function() {
							var theID = $(this).attr('data');
							window.location = "#id=" + theID;
						});
					}
				}
				details.params.max.compare = maxComp;
				details.activeBars('compare');
			}
		},
		tableFilter = {
			controlSwitch: function(control) {
				var yrID = control === "private" ? 'ecdropcy' : 'ecdropfy';
				data.filters.System = null;
				data.filters.Relaffil = null;
				data.filters.Ccbasic = null;
				systemTemp = control === "private" ? $('#ecdropcy_all') : $('#ecdropfy_all');
				$('#' +yrID + "_all").addClass('ecdrop_active');
				$('#System_select').find('.ecdrop_active').removeClass('ecdrop_active');
				$('#System_select > a').html(systemTemp.text());
				systemTemp.addClass('ecdrop_active');
				$('#Relaffil_select').find('.ecdrop_active').removeClass('ecdrop_active');
				$('#Relaffil_select > a').html($('#ecaffil_all').text());
				$('#ecaffil_all').addClass('ecdrop_active');
				$('#Ccbasic_select').find('.ecdrop_active').removeClass('ecdrop_active');
				$('#Ccbasic_select > a').html($('#eccc_all').text());
				$('#eccc_all').addClass('ecdrop_active');
			},
			init: function(set) {
				var optVal, setFilter, currVal, newText, yrID, systemTemp;
				$('#'+ set).find('li').find('a').unbind('click').click(function(e) {
					$('#'+ set).removeClass('opendrawer');
					$('#ec_filterlabel').removeClass('openmenu_label');
					$('#ec_selects').removeClass('openmenu');
					e.preventDefault();
					optVal = $(this).parent().attr('id').split('_')[1];
					setFilter = set.split('_')[0];
					currVal = data.filters[setFilter];
					newText = $(this).text();
					if (currVal !== optVal) {
						$('.interactive_table').find('tbody').html('<tr class="preloading"><td>Results are loading ...</td></tr>'); 						
						if (setFilter === 'order' || setFilter === 'column') {
							data.params[setFilter] = optVal;
							table.start = 0;
							data.fetch();
						} else {
							table.start = 0;
							if (optVal === "all") {
								data.filters[setFilter] = null;
							} else {
								if (setFilter === "control") {
									view.highestVal = 0;
									data.filters.year = optVal === "private" ? "2017" : "2018";
									$('#ec_container').removeClass(data.filters.control);
									tableFilter.controlSwitch(optVal);
								}
								data.filters[setFilter] = optVal;
							}
							if ((setFilter === "control") || (setFilter === "year")) {
								window.location = '#id=table_'+data.filters.control +'_'+data.filters.year;
							} else {
								table.start = 0;
								data.fetch();
							}
						}
						$('#' + set).find('li').removeClass('ecdrop_active');
						$(this).parent().addClass('ecdrop_active');
						$('#' + set + " > a").html(newText);

					}
				});
			}
		},
		tableSearch = {
				init: function() {
					var that = this,
						getSearchData = cheg.getData({
							name: 'searchData' + table.dataVersion,
							table: 'excomp20_spring_search',
							sort: 'chronorgname:asc',
							success: that.processData
						});
					$('#search_text').val(this.defaultVal);
				},
				exists: false,
				options: {
					shouldSort: true,
					threshold: 0.2,
					location: 0,
					distance: 100,
					maxPatternLength: 32,
					keys: [
					  "name",
					  "inst"
					]
				},
				processData: function(json) {
					var results = tableSearch.data, tempList = {}, i, resultObject = {};
					for (i = 0; i< json.length; i++) {
						resultObject = {
							name: json[i].employeeName,
							photo: json[i].photoURL,
							inst: json[i].chronorgname,
							value: json[i].employeeID,
							instId: json[i].unitid,
							year: json[i].latestYear,
							control: json[i].publicPrivate
						};
						results.push(resultObject);
					}
					tableSearch.loadSearch(results);
				},
				scanning: true,
				defaultVal: 'Search for a president or college',
				currentSearch: '',
				loadSearch: function(results) {
					var that = this,
						$searchField = $('#search_text'),
						lastKeyPressCode,
						fuse = new Fuse(results, tableSearch.options),
						timeoutID,
						slowAlert = function() {
							tableSearch.scanning = false;
							if ($searchField.val().length > 0) {
								that.currentSearch = $searchField.val();
								that.generateResultsList( fuse.search( $searchField.val() ) );
							} else {
								clearSearch();
							}
						},
						clearSearch = function () {
							table.start = 0;
							$searchField.val(that.defaultVal);
							$('#interactive_table').find('tbody').html('<tr class="preloading"><td colspan="5">Selected institutions are loading ...</td></tr>');
							that.currentSearch = '';
							data.params.search = '';
							table.start = 0;
							$('#table-main').find('.table_window').css('max-height',"708px" );
							data.fetch();
						};
						
					$searchField.focus(function() {
							if ($searchField.val() === that.defaultVal) {$searchField.val('');}
						}).blur(function(){
							if ($(this).val() === '') {
								$(this).val(that.defaultVal);
							}
					});
					$searchField.keyup(function(e) {
						lastKeyPressCode = e.keyCode;
						switch(e.keyCode) {
							case 13: // return
								if ($searchField.val().length >= 3) { 							
									that.instantResult( fuse.search( $searchField.val() ) ); 						
								}
								break;
							default:
								if ($searchField.val().length >= 3) { 
									that.generateResultsList( fuse.search( $searchField.val() ) );							
								}
								break;
						}
					});
				},
				generateResultsList: function (listData) {
					var resultsDiv = $('#ec_searchresults'), 			
						displayLength = listData.length > 5 ? 5 : listData.length, 			
						hasMore = listData.length > displayLength ? true : false,
						itemHtml; 			
					
					resultsDiv.html(''); 			
					resultsDiv.parent().addClass('opendrawer'); 	
					for (var i=0; i < displayLength; i++) { 
						itemHtml = '<img class="fl headshot" src="' + listData[i].photo + '" alt="' + listData[i].name + '" width="40" height="40"><span class="name">' + listData[i].name + '</span><span class="college">' + listData[i].inst + '</span>';				
						resultsDiv.append('<a href="#id=' + listData[i].value + '_' + listData[i].instId + '_'+ listData[i].year + '_' + listData[i].control + '" class="ecsr_item">' + itemHtml + '</a>' ); 			
					} 		
					if (hasMore) { 				
						resultsDiv.append('<p>More than 5 matches found, try to make your search more precise.</p>'); 			
					}
					$('.ecsr_item').unbind('click').click(function(e) {window.location = $(this).attr('href');});
				},
				instantResult: function (listData) {
					window.location = '#id=' + listData[0].value + '_' + listData[0].instId + '_'+ listData[0].year + '_' + listData[0].control;
				},
				raw: [],
				data: []
			};


			url.read();
			$(document).unbind('click').click(function(event) {
				if (!$(event.target).closest('.opendrawer').length) {
					$('.opendrawer').removeClass('opendrawer');
				}
			});
});