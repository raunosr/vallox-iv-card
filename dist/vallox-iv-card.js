const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=/* @__PURE__ */Symbol(),i=/* @__PURE__ */new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const o=this.t;if(e&&void 0===t){const e=void 0!==o&&1===o.length;e&&(t=i.get(o)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(o,t))}return t}toString(){return this.cssText}};const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new r(i,t,o)},a=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:d}=Object,u=globalThis,f=u.trustedTypes,_=f?f.emptyScript:"",m=u.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(i){o=null}}return o}},g=(t,e)=>!n(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:g};Symbol.metadata??=/* @__PURE__ */Symbol("metadata"),u.litPropertyMetadata??=/* @__PURE__ */new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=/* @__PURE__ */Symbol(),i=this.getPropertyDescriptor(t,o,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const s=i?.call(this);r?.call(this,e),this.requestUpdate(t,s,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...p(t),...h(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=/* @__PURE__ */new Map;for(const[e,o]of this.elementProperties){const t=this._$Eu(e,o);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=/* @__PURE__ */new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=/* @__PURE__ */new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=/* @__PURE__ */new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const o=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((o,i)=>{if(e)o.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),r=t.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=e.cssText,o.appendChild(i)}})(o,this.constructor.elementStyles),o}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(void 0!==i&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:y).toAttribute(e,o.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=o.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const s=r.fromAttribute(e,t.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(t,e,o,i=!1,r){if(void 0!==t){const s=this.constructor;if(!1===i&&(r=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??g)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:r},s){o&&!(this._$Ej??=/* @__PURE__ */new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==r||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=/* @__PURE__ */new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,o,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=/* @__PURE__ */new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[v("elementProperties")]=/* @__PURE__ */new Map,b[v("finalized")]=/* @__PURE__ */new Map,m?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,C=w.trustedTypes,A=C?C.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,k="?"+E,T=`<${k}>`,P=document,O=()=>P.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,L="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,I=/>/g,N=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,R=/"/g,j=/^(?:script|style|textarea|title)$/i,D=t=>(e,...o)=>({_$litType$:t,strings:e,values:o}),B=D(1),V=D(2),q=/* @__PURE__ */Symbol.for("lit-noChange"),W=/* @__PURE__ */Symbol.for("lit-nothing"),G=/* @__PURE__ */new WeakMap,Z=P.createTreeWalker(P,129);function J(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}class K{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let r=0,s=0;const a=t.length-1,n=this.parts,[l,c]=((t,e)=>{const o=t.length-1,i=[];let r,s=2===e?"<svg>":3===e?"<math>":"",a=U;for(let n=0;n<o;n++){const e=t[n];let o,l,c=-1,p=0;for(;p<e.length&&(a.lastIndex=p,l=a.exec(e),null!==l);)p=a.lastIndex,a===U?"!--"===l[1]?a=z:void 0!==l[1]?a=I:void 0!==l[2]?(j.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=N):void 0!==l[3]&&(a=N):a===N?">"===l[0]?(a=r??U,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?N:'"'===l[3]?R:F):a===R||a===F?a=N:a===z||a===I?a=U:(a=N,r=void 0);const h=a===N&&t[n+1].startsWith("/>")?" ":"";s+=a===U?e+T:c>=0?(i.push(o),e.slice(0,c)+S+e.slice(c)+E+h):e+E+(-2===c?n:h)}return[J(t,s+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]})(t,e);if(this.el=K.createElement(l,o),Z.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=Z.nextNode())&&n.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[s++],o=i.getAttribute(t).split(E),a=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:a[2],strings:o,ctor:"."===a[1]?et:"?"===a[1]?ot:"@"===a[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:r}),i.removeAttribute(t));if(j.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=C?C.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],O()),Z.nextNode(),n.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===k)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)n.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const o=P.createElement("template");return o.innerHTML=t,o}}function X(t,e,o=t,i){if(e===q)return e;let r=void 0!==i?o._$Co?.[i]:o._$Cl;const s=H(e)?void 0:e._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(t),r._$AT(t,o,i)),void 0!==i?(o._$Co??=[])[i]=r:o._$Cl=r),void 0!==r&&(e=X(t,r._$AS(t,e.values),r,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);Z.currentNode=i;let r=Z.nextNode(),s=0,a=0,n=o[0];for(;void 0!==n;){if(s===n.index){let e;2===n.type?e=new Y(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new rt(r,this,t)),this._$AV.push(e),n=o[++a]}s!==n?.index&&(r=Z.nextNode(),s++)}return Z.currentNode=P,i}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),H(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&H(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=K.createElement(J(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new K(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const r of t)i===e.length?e.push(o=new Y(this.O(O()),this.O(O()),this,this.options)):o=e[i],o._$AI(r),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}let tt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=W}_$AI(t,e=this,o,i){const r=this.strings;let s=!1;if(void 0===r)t=X(this,t,e,0),s=!H(t)||t!==this._$AH&&t!==q,s&&(this._$AH=t);else{const i=t;let a,n;for(t=r[0],a=0;a<r.length-1;a++)n=X(this,i[o+a],e,a),n===q&&(n=this._$AH[a]),s||=!H(n)||n!==this._$AH[a],n===W?t=W:t!==W&&(t+=(n??"")+r[a+1]),this._$AH[a]=n}s&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}};class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class ot extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends tt{constructor(t,e,o,i,r){super(t,e,o,i,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??W)===q)return;const o=this._$AH,i=t===W&&o!==W||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==W&&(o===W||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(K,Y),(w.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;class nt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const i=o?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=o?.renderBefore??null;i._$litPart$=r=new Y(e.insertBefore(O(),t),t,void 0,o??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}nt._$litElement$=!0,nt.finalized=!0,at.litElementHydrateSupport?.({LitElement:nt});const lt=at.litElementPolyfillSupport;lt?.({LitElement:nt}),(at.litElementVersions??=[]).push("4.2.2");const ct=t=>(e,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:g},ht=(t=pt,e,o)=>{const{kind:i,metadata:r}=o;let s=globalThis.litPropertyMetadata.get(r);if(void 0===s&&globalThis.litPropertyMetadata.set(r,s=/* @__PURE__ */new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),s.set(o.name,t),"accessor"===i){const{name:i}=o;return{set(o){const r=e.get.call(this);e.set.call(this,o),this.requestUpdate(i,r,t,!0,o)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=o;return function(o){const r=this[i];e.call(this,o),this.requestUpdate(i,r,t,!0,o)}}throw Error("Unsupported decorator location: "+i)};function dt(t){return(e,o)=>"object"==typeof o?ht(t,e,o):((t,e,o)=>{const i=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),i?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}function ut(t){return dt({...t,state:!0,attribute:!1})}const ft={show_efficiency:!0,show_profile:!0,show_fan_speed:!0,show_cell_state:!0,show_co2:!0,show_humidity:!0,show_post_heater:!0,enable_temp_colors:!0,co2_limit:1e3,co2_alert_color:"#ff4444",enable_co2_blink:!0,value_font_size:48,unit_opacity:.6,font_weight:500};const _t=["unavailable","unknown","none"];function mt(t,e){if(!t||!e)return null;const o=t.states[e];if(!o)return null;const i=o.state;return _t.includes(i.toLowerCase())?null:i}function vt(t,e){const o=mt(t,e);if(null===o)return null;const i=parseFloat(o);return isNaN(i)||!isFinite(i)?null:i}function yt(t,e){if(!t||!e)return"";const o=t.states[e];return o?.attributes&&o.attributes.unit_of_measurement||""}function gt(t){if(!t||"—"===t)return{value:t,unit:""};const e=t.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);return e?{value:e[1],unit:e[2]}:{value:t,unit:""}}function $t(t,e="°C",o=1){return null===t?"—":`${t.toFixed(o)}${e}`}function bt(t,e=0,o=!0){if(null===t)return"—";return`${(o?t:100*t).toFixed(e)}%`}function wt(t){return null===t?"—":`${Math.round(t)} ppm`}function xt(t){return t?t.charAt(0).toUpperCase()+t.slice(1).toLowerCase():"—"}function Ct(t){if(!t)return"—";return{heat_recovery:"Heat Recovery",cool_recovery:"Cool Recovery",bypass:"Bypass",defrost:"Defrost"}[t.toLowerCase()]||xt(t)}function At(t){if(!t)return"—";return{home:"Home",away:"Away",boost:"Boost",fireplace:"Fireplace",extra:"Extra"}[t.toLowerCase()]||xt(t)}const St="#0000FF",Et="#00FFFF",kt="#8892E3",Tt="#FFA500",Pt="#FF4500",Ot=-10,Ht=0,Mt=22,Lt=25;function Ut(t){const e=t.replace("#",""),o=3===e.length?e.split("").map(t=>t+t).join(""):e,i=parseInt(o,16);return{r:i>>16&255,g:i>>8&255,b:255&i}}function zt(t,e,o){const i=t=>Math.round(Math.max(0,Math.min(255,t))).toString(16).padStart(2,"0");return`#${i(t)}${i(e)}${i(o)}`}function It(t){if(t)return"string"==typeof t?t:Array.isArray(t)&&3===t.length?zt(t[0],t[1],t[2]):void 0}function Nt(t,e,o){const i=Ut(t),r=Ut(e),s=Math.max(0,Math.min(1,o));return zt(i.r+(r.r-i.r)*s,i.g+(r.g-i.g)*s,i.b+(r.b-i.b)*s)}function Ft(t,e="°C",o){if(null===t)return;const i="°F"===e?5*(t-32)/9:t,r={cold:It(o?.cold)||St,freeze:It(o?.freeze)||Et,neutral:It(o?.neutral)||kt,warm:It(o?.warm)||Tt,hot:It(o?.hot)||Pt};if(i<=Ot)return r.cold;if(i<Ht){return Nt(r.cold,r.freeze,(i-Ot)/(Ht-Ot))}if(i<Mt){return Nt(r.freeze,r.neutral,(i-Ht)/(Mt-Ht))}if(i<Lt){return Nt(r.neutral,r.warm,(i-Mt)/(Lt-Mt))}if(i>=30)return r.hot;return Nt(r.warm,r.hot,(i-Lt)/(30-Lt))}function Rt(t,e,o,i,r){if(!t)return B``;const s=gt(t),a=Boolean(e&&o),n=i?`color: ${i}`:"",l=["value",a?"clickable":"",""].filter(Boolean).join(" "),c=s.unit?B`<span class="num">${s.value}</span><span class="unit">${s.unit}</span>`:B`${t}`;return a&&e&&o?B`
      <span
        class="${l}"
        style="${n}"
        role="button"
        tabindex="0"
        aria-label="View ${e} details"
        @click=${()=>o(e)}
        @keydown=${t=>"Enter"===t.key&&o(e)}
      >
        ${c}
      </span>
    `:B`<span class="${l}" style="${n}">${c}</span>`}function jt(t,e,o,i,r,s,a){if(!e)return B``;const n=gt(e),l=Boolean(o&&i),c=r?`color: ${r}`:"",p=["label-value",l?"clickable":"",s||""].filter(Boolean).join(" ");let h;h="humidity"===a?B`${B`<ha-icon icon="mdi:water-percent" class="sensor-icon humidity-icon"></ha-icon>`}`:"co2"===a?B`${B`<ha-icon icon="mdi:molecule-co2" class="sensor-icon co2-icon"></ha-icon>`}`:t?B`<span class="label">${t}: </span>`:"";const d=B`
    ${h}
    <span class="value" style="${c}">
      <span class="num">${n.value}</span>${n.unit?B`<span class="unit">${n.unit}</span>`:""}
    </span>
  `;return l&&o&&i?B`
      <div
        class="${p}"
        role="button"
        tabindex="0"
        aria-label="View ${o} details"
        @click=${()=>i(o)}
        @keydown=${t=>"Enter"===t.key&&i(o)}
      >
        ${d}
      </div>
    `:B`<div class="${p}">${d}</div>`}function Dt(t){const{position:e,title:o,temp:i,tempEntityId:r,tempColor:s,humidity:a,humidityLabel:n,humidityEntityId:l,co2:c,co2Label:p,co2EntityId:h,co2Color:d,co2ClassName:u,onEntityClick:f}=t;return B`
    <div class="temp-block ${e}">
      <div class="title">${o}</div>
      ${Rt(i,r,f,s)}
      ${a?jt(n||"",a,l,f,void 0,void 0,"humidity"):""}
      ${c?jt(p||"",c,h,f,d,u,"co2"):""}
    </div>
  `}function Bt(t,e,o,i,r,s){const{cellState:a,profile:n,fanSpeed:l,efficiency:c,extractTemp:p,humidity:h,co2:d,supplyTemp:u,supplyCellTemp:f,outdoorTemp:_,exhaustTemp:m,postHeaterActive:v}=t;return B`
    <div class="text-overlay" style="${r?`--vallox-value-color: ${r}`:""}">
      <!-- Cell State Header -->
      ${e.cellStateTitle||a?B`
            <div class="cell-state-block">
              ${e.cellStateTitle?B`<div class="cell-state-title">${e.cellStateTitle}</div>`:""}
              ${a?B`
                    <div
                      class="cell-state-value ${o.cellState&&s?"clickable":""}"
                      @click=${o.cellState&&s?()=>s(o.cellState):W}
                    >
                      ${a}
                    </div>
                  `:""}
            </div>
          `:""}

      <!-- Efficiency Badge (center) -->
      <div class="efficiency-block">
        ${Rt(c,o.efficiency,s)}
      </div>

      <!-- Post-Heater & Supply Cell Temp (on supply arrow, between efficiency and supply label) -->
      ${f||void 0!==v?B`
            <div class="supply-cell-block">
              ${void 0!==v?B`
                    <span
                      class="post-heater ${o.postHeater&&s?"clickable":""}"
                      @click=${o.postHeater&&s?()=>s(o.postHeater):W}
                    >
                      ${y=v,B`<ha-icon icon="mdi:radiator" class="post-heater-icon ${y?"active":"inactive"}"></ha-icon>`}
                    </span>
                  `:""}
              ${f?B`
                    <div
                      class="supply-cell-temp ${o.supplyCellTemp&&s?"clickable":""}"
                      style="${i.supplyCellTempColor?`color: ${i.supplyCellTempColor}`:""}"
                      @click=${o.supplyCellTemp&&s?()=>s(o.supplyCellTemp):W}
                    >
                      ${f}
                    </div>
                  `:""}
            </div>
          `:""}

      <!-- Extract Air (left top) -->
      ${Dt({position:"extract",title:e.extractAir,temp:p,tempEntityId:o.extractTemp,tempColor:i.extractTempColor,humidity:h,humidityLabel:e.humidity,humidityEntityId:o.humidity,co2:d,co2Label:e.co2,co2EntityId:o.co2,co2Color:i.co2Color,co2ClassName:i.co2ClassName,onEntityClick:s})}

      <!-- Supply Air (left bottom) -->
      ${Dt({position:"supply",title:e.supplyAir,temp:u,tempEntityId:o.supplyTemp,tempColor:i.supplyTempColor,onEntityClick:s})}

      <!-- Outdoor Air (right top) -->
      ${Dt({position:"outdoor",title:e.outdoorAir,temp:_,tempEntityId:o.outdoorTemp,tempColor:i.outdoorTempColor,onEntityClick:s})}

      <!-- Exhaust Air (right bottom) -->
      ${Dt({position:"exhaust",title:e.exhaustAir,temp:m,tempEntityId:o.exhaustTemp,tempColor:i.exhaustTempColor,onEntityClick:s})}

      <!-- Profile & Fan Speed (bottom center) -->
      ${n||l?B`
            <div class="profile-fan-block">
              ${n?B`
                    <span
                      class="profile ${o.profile&&s?"clickable":""}"
                      @click=${o.profile&&s?()=>s(o.profile):W}
                    >
                      ${n}
                    </span>
                  `:""}
              ${l?B`
                    <span
                      class="fan-speed ${o.fanSpeed&&s?"clickable":""}"
                      @click=${o.fanSpeed&&s?()=>s(o.fanSpeed):W}
                    >
                      (${B`<ha-icon icon="mdi:fan" class="fan-icon"></ha-icon>`}${l})
                    </span>
                  `:""}
            </div>
          `:""}
    </div>
  `;var y}const Vt=s`
  :host {
    display: block;
    --vallox-value-color: var(--primary-text-color, #2a7ebf);
    --vallox-label-color: var(--secondary-text-color, #2c5e8c);
    --vallox-unit-opacity: 0.6;
  }

  ha-card {
    height: 100%;
    box-sizing: border-box;
    padding: 0;
    display: flex;
    flex-direction: column;
    background: transparent;
  }

  .card-header {
    font-size: var(--ha-card-header-font-size, 24px);
    font-weight: normal;
    line-height: 1.2;
    color: var(--ha-card-header-color, var(--primary-text-color));
    padding: 8px 12px 4px;
  }

  .card-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 0;
  }

  /* SVG + Overlay Container */
  .diagram-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    aspect-ratio: 800 / 500;
    height: 100%;
  }

  .diagram-container svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  /* ==========================================
     Airflow Animation
     ========================================== */
  @keyframes airflow {
    from { stroke-dashoffset: 30; }
    to { stroke-dashoffset: 0; }
  }

  .diagram-container svg.airflow-active .airflow-path {
    stroke-dasharray: 10, 20;
    animation: airflow var(--flow-duration, 2s) linear infinite;
  }

  .diagram-container svg.airflow-stopped .airflow-path {
    stroke-dasharray: none;
    animation: none;
  }

  /* ==========================================
     HTML Text Overlay
     ========================================== */
  .text-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    font-family: var(--ha-card-header-font-family, inherit);
    color: var(--vallox-label-color);
  }

  .text-overlay .clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .text-overlay .clickable:hover {
    text-decoration: underline;
  }

  /* Value styling - number + unit separation */
  .text-overlay .value {
    color: var(--vallox-value-color);
    font-weight: 500;
    font-size: 28px;
  }

  .text-overlay .value .num {
    font-weight: 400;
  }

  .text-overlay .value .unit {
    font-size: 16px;
    font-weight: 400;
    opacity: var(--vallox-unit-opacity);
  }

  .text-overlay .label {
    color: var(--vallox-label-color);
    font-weight: 400;
    font-size: 16px;
  }

  /* Cell State Header - top center */
  .cell-state-block {
    position: absolute;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .cell-state-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--vallox-label-color);
  }

  .cell-state-value {
    font-size: 16px;
    color: var(--vallox-label-color);
    margin-top: 2px;
  }

  /* Efficiency Badge - center */
  .efficiency-block {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .efficiency-block .value {
    font-size: 28px;
    font-weight: 500;
  }

  /* Temperature Blocks - positioned in corners */
  .temp-block {
    position: absolute;
    text-align: center;
    width: 20%;
  }

  .temp-block .title {
    font-size: 16px;
    font-weight: 700;
    color: var(--vallox-label-color);
    margin-bottom: 0;
    line-height: 1.3;
  }

  .temp-block .value {
    display: block;
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 0;
    line-height: 1.2;
  }

  .temp-block .label-value {
    font-size: 14px;
    margin-top: 0;
    line-height: 1.3;
    text-align: center;
  }

  .temp-block .label-value .sensor-icon {
    --mdc-icon-size: 14px;
    vertical-align: -0.15em;
    margin-right: 2px;
    color: var(--vallox-label-color);
  }

  .temp-block .label-value .value {
    font-size: 14px;
    display: inline;
  }

  .temp-block .label-value .value .unit {
    font-size: 14px;
  }

  /* Extract air - left top */
  .temp-block.extract {
    top: 18%;
    left: 5%;
  }

  /* Supply air - left bottom */
  .temp-block.supply {
    top: 64%;
    left: 5%;
  }

  /* Outdoor air - right top */
  .temp-block.outdoor {
    top: 18%;
    right: 5%;
  }

  /* Exhaust air - right bottom */
  .temp-block.exhaust {
    top: 64%;
    right: 5%;
  }

  /* Supply Cell Temperature & Post-Heater - on supply arrow path */
  /* SVG path: M 490,165 C 440,165 360,335 310,335 
     Position: between efficiency badge (center) and Tuloilma label (bottom-left) */
  .supply-cell-block {
    position: absolute;
    top: 62%;
    left: 28%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .supply-cell-block .supply-cell-temp {
    font-size: 14px;
    font-weight: 500;
    color: var(--vallox-value-color);
    white-space: nowrap;
    background: color-mix(in srgb, var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, #ffffff))) 50%, transparent);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .supply-cell-block .supply-cell-temp.clickable {
    pointer-events: auto;
    cursor: pointer;
  }

  .supply-cell-block .supply-cell-temp.clickable:hover {
    background: color-mix(in srgb, var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, #ffffff))) 70%, transparent);
  }

  .supply-cell-block .post-heater {
    display: flex;
    align-items: center;
  }

  .post-heater-icon {
    --mdc-icon-size: 20px;
  }

  .post-heater-icon.active {
    color: var(--success-color, #4CAF50);
  }

  .post-heater-icon.inactive {
    color: var(--disabled-color, #9E9E9E);
  }

  /* Profile & Fan Speed - bottom center */
  .profile-fan-block {
    position: absolute;
    bottom: 4%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-size: 16px;
    font-weight: 700;
    color: var(--vallox-value-color);
  }

  .profile-fan-block .profile,
  .profile-fan-block .fan-speed {
    display: inline-flex;
    align-items: center;
    gap: 0.15em;
  }

  .profile-fan-block .fan-speed {
    font-weight: 400;
  }

  .profile-fan-block .fan-icon {
    --mdc-icon-size: 0.9em;
    vertical-align: middle;
  }

  /* CO2 Alert Animation */
  @keyframes co2-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .text-overlay .co2-alert {
    animation: co2-pulse 1s ease-in-out infinite;
  }

  .text-overlay .co2-alert-static {
    /* No animation, just static alert styling */
  }

  /* Compact mode */
  :host([compact]) ha-card {
    padding: 0;
  }

  :host([compact]) .card-header {
    font-size: 16px;
    padding: 6px 8px 2px;
  }
`;s`
  .diagram-container {
    aspect-ratio: 800 / 450;
  }
`;var qt=Object.defineProperty,Wt=Object.getOwnPropertyDescriptor,Gt=(t,e,o,i)=>{for(var r,s=i>1?void 0:i?Wt(e,o):e,a=t.length-1;a>=0;a--)(r=t[a])&&(s=(i?r(e,o,s):r(s))||s);return i&&s&&qt(e,o,s),s};let Zt=class extends nt{setConfig(t){this._config={...t}}_renderEntitySelector(t,e,o){const i=(this._config||{})[e]||"";return B`
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{entity:{domain:o}}}
          .value=${i}
          .label=${t}
          @value-changed=${t=>this._valueChanged(e,t.detail.value)}
        ></ha-selector>
      </div>
    `}_renderLabelInput(t,e,o){const i=(this._config||{})[e]||"";return B`
      <div class="form-row">
        <ha-textfield
          .label=${t}
          .value=${i}
          .placeholder=${o}
          @input=${t=>this._valueChanged(e,t.target.value)}
        ></ha-textfield>
      </div>
    `}_renderColorSelector(t,e,o){const i=(this._config||{})[e];let r="";if("string"==typeof i)r=i;else if(Array.isArray(i)&&3===i.length){const t=t=>Math.round(Math.max(0,Math.min(255,t))).toString(16).padStart(2,"0");r=`#${t(i[0])}${t(i[1])}${t(i[2])}`}return B`
      <div class="form-row color-row">
        <ha-textfield
          .label=${t}
          .value=${r}
          .placeholder=${o}
          @input=${t=>this._valueChanged(e,t.target.value)}
        ></ha-textfield>
        <input
          type="color"
          class="color-picker"
          .value=${r||o}
          @input=${t=>this._valueChanged(e,t.target.value)}
        />
      </div>
    `}_renderNumberInput(t,e,o){const i=(this._config||{})[e],r=void 0!==i?String(i):"";return B`
      <div class="form-row">
        <ha-textfield
          .label=${t}
          .value=${r}
          .placeholder=${String(o)}
          type="number"
          @input=${t=>{const o=t.target.value,i=o?Number(o):void 0;this._valueChanged(e,i)}}
        ></ha-textfield>
      </div>
    `}render(){if(!this.hass)return B`<div>Loading...</div>`;const t=this._config||{};return B`
      <div class="form-row">
        <ha-textfield
          label="Card Title"
          .value=${t.title||""}
          @input=${t=>this._valueChanged("title",t.target.value)}
        ></ha-textfield>
      </div>

      <div class="section-title">Temperature Sensors</div>
      ${this._renderEntitySelector("Outdoor Air Temperature","outdoor_air_temp",["sensor"])}
      ${this._renderEntitySelector("Supply Air Temperature","supply_air_temp",["sensor"])}
      ${this._renderEntitySelector("Extract Air Temperature","extract_air_temp",["sensor"])}
      ${this._renderEntitySelector("Exhaust Air Temperature","exhaust_air_temp",["sensor"])}

      <div class="section-title">Heat Recovery</div>
      ${this._renderEntitySelector("Efficiency Sensor","efficiency",["sensor"])}
      ${this._renderEntitySelector("Cell State","cell_state",["sensor","select"])}
      ${this._renderEntitySelector("Supply Cell Temperature","supply_cell_temp",["sensor"])}
      ${this._renderEntitySelector("Post-Heater","post_heater",["binary_sensor","sensor","switch"])}

      <div class="section-title">Additional Sensors</div>
      ${this._renderEntitySelector("Ventilation Profile","profile",["sensor","select"])}
      ${this._renderEntitySelector("Fan Speed","fan_speed",["sensor"])}
      ${this._renderEntitySelector("CO₂ Sensor","co2",["sensor"])}
      ${this._renderEntitySelector("Humidity Sensor","humidity",["sensor"])}

      <div class="section-title">Labels (optional)</div>
      ${this._renderLabelInput("Cell State Title","label_cell_state_title","LTO-Cell State")}
      ${this._renderLabelInput("Extract Air Label","label_extract_air","Extract air")}
      ${this._renderLabelInput("Supply Air Label","label_supply_air","Supply air")}
      ${this._renderLabelInput("Outdoor Air Label","label_outdoor_air","Outdoor air")}
      ${this._renderLabelInput("Exhaust Air Label","label_exhaust_air","Exhaust air")}
      ${this._renderLabelInput("Efficiency Label","label_efficiency","Efficiency")}
      ${this._renderLabelInput("Profile Label","label_profile","Profile")}
      ${this._renderLabelInput("Fan Speed Label","label_fan_speed","Fan speed")}

      <div class="section-title">Colors (optional)</div>

      <div class="toggle-row">
        <span>Enable Temperature Color Scaling</span>
        <ha-switch
          .checked=${!1!==t.enable_temp_colors}
          @change=${t=>this._valueChanged("enable_temp_colors",t.target.checked)}
        ></ha-switch>
      </div>

      ${!1!==t.enable_temp_colors?B`
        ${this._renderColorSelector("Cold (≤-10°C)","temp_color_cold","#0000FF")}
        ${this._renderColorSelector("Freeze (0°C)","temp_color_freeze","#00FFFF")}
        ${this._renderColorSelector("Neutral (22°C)","temp_color_neutral","#8892E3")}
        ${this._renderColorSelector("Warm (25°C)","temp_color_warm","#FFA500")}
        ${this._renderColorSelector("Hot (≥25°C)","temp_color_hot","#FF4500")}
      `:""}

      <div class="section-title">Alert Settings</div>

      ${this._renderNumberInput("CO₂ Alert Threshold (ppm)","co2_limit",1e3)}
      ${this._renderColorSelector("CO₂ Alert Color","co2_alert_color","#ff4444")}

      <div class="toggle-row">
        <span>Enable CO₂ Alert Animation</span>
        <ha-switch
          .checked=${!1!==t.enable_co2_blink}
          @change=${t=>this._valueChanged("enable_co2_blink",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="section-title">Display Options</div>

      <div class="toggle-row">
        <span>Show Efficiency</span>
        <ha-switch
          .checked=${!1!==t.show_efficiency}
          @change=${t=>this._valueChanged("show_efficiency",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Profile</span>
        <ha-switch
          .checked=${!1!==t.show_profile}
          @change=${t=>this._valueChanged("show_profile",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Fan Speed</span>
        <ha-switch
          .checked=${!1!==t.show_fan_speed}
          @change=${t=>this._valueChanged("show_fan_speed",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show CO₂</span>
        <ha-switch
          .checked=${!1!==t.show_co2}
          @change=${t=>this._valueChanged("show_co2",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Humidity</span>
        <ha-switch
          .checked=${!1!==t.show_humidity}
          @change=${t=>this._valueChanged("show_humidity",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Cell State</span>
        <ha-switch
          .checked=${!1!==t.show_cell_state}
          @change=${t=>this._valueChanged("show_cell_state",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Supply Cell Temperature</span>
        <ha-switch
          .checked=${!1!==t.show_supply_cell_temp}
          @change=${t=>this._valueChanged("show_supply_cell_temp",t.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Post-Heater</span>
        <ha-switch
          .checked=${!1!==t.show_post_heater}
          @change=${t=>this._valueChanged("show_post_heater",t.target.checked)}
        ></ha-switch>
      </div>
    `}_valueChanged(t,e){const o={...this._config||{type:"custom:vallox-iv-card"},[t]:e};""!==e&&void 0!==e||delete o[t],this._config=o;const i=new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0});this.dispatchEvent(i)}};Zt.styles=s`
    .form-row {
      margin-bottom: 16px;
    }
    .form-row ha-selector {
      width: 100%;
    }
    ha-textfield {
      width: 100%;
    }
    ha-select {
      width: 100%;
    }
    .section-title {
      font-weight: 500;
      margin: 16px 0 8px 0;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color);
      padding-bottom: 4px;
    }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    .toggle-row span {
      flex: 1;
    }
    .color-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .color-row ha-textfield {
      flex: 1;
    }
    .color-picker {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      cursor: pointer;
      background: transparent;
    }
    .color-picker::-webkit-color-swatch-wrapper {
      padding: 2px;
    }
    .color-picker::-webkit-color-swatch {
      border-radius: 4px;
      border: none;
    }
  `,Gt([dt({attribute:!1})],Zt.prototype,"hass",2),Gt([ut()],Zt.prototype,"_config",2),Zt=Gt([ct("vallox-iv-card-editor")],Zt);var Jt=Object.defineProperty,Kt=Object.getOwnPropertyDescriptor,Xt=(t,e,o,i)=>{for(var r,s=i>1?void 0:i?Kt(e,o):e,a=t.length-1;a>=0;a--)(r=t[a])&&(s=(i?r(e,o,s):r(s))||s);return i&&s&&Jt(e,o,s),s};const Qt="Vallox IV Card";let Yt=class extends nt{setConfig(t){try{this._config=function(t){if(!t||"object"!=typeof t)throw new Error("Invalid configuration: config must be an object");const e=t;if(!e.type)throw new Error("Invalid configuration: type is required");const o={...ft,...e,type:e.type},i=["outdoor_air_temp","supply_air_temp","supply_cell_temp","extract_air_temp","exhaust_air_temp","efficiency","cell_state","profile","fan_speed","co2","humidity","post_heater"];for(const r of i){const t=e[r];if(void 0!==t&&"string"!=typeof t)throw new Error(`Invalid configuration: ${r} must be a string`);if("string"==typeof t&&t.length>0&&!t.includes("."))throw new Error(`Invalid configuration: ${r} must be a valid entity ID (e.g., sensor.xxx)`)}if(void 0!==e.value_color&&"string"!=typeof e.value_color)throw new Error("Invalid configuration: value_color must be a string");if(void 0!==e.co2_limit&&("number"!=typeof e.co2_limit||e.co2_limit<0))throw new Error("Invalid configuration: co2_limit must be a positive number");if(void 0!==e.co2_alert_color&&"string"!=typeof e.co2_alert_color)throw new Error("Invalid configuration: co2_alert_color must be a string");if(void 0!==e.enable_co2_blink&&"boolean"!=typeof e.enable_co2_blink)throw new Error("Invalid configuration: enable_co2_blink must be a boolean");if(void 0!==e.enable_temp_colors&&"boolean"!=typeof e.enable_temp_colors)throw new Error("Invalid configuration: enable_temp_colors must be a boolean");if(void 0!==e.value_font_size&&("number"!=typeof e.value_font_size||e.value_font_size<10||e.value_font_size>100))throw new Error("Invalid configuration: value_font_size must be a number between 10 and 100");if(void 0!==e.unit_opacity&&("number"!=typeof e.unit_opacity||e.unit_opacity<0||e.unit_opacity>1))throw new Error("Invalid configuration: unit_opacity must be a number between 0 and 1");if(void 0!==e.font_weight&&("number"!=typeof e.font_weight||![400,500,600,700].includes(e.font_weight)))throw new Error("Invalid configuration: font_weight must be 400, 500, 600, or 700");return o}(t),this._error=void 0}catch(e){throw this._error=e instanceof Error?e.message:"Unknown configuration error",e}}getGridOptions(){return{columns:4,rows:3,min_columns:2,min_rows:2}}static getConfigElement(){return document.createElement("vallox-iv-card-editor")}static getStubConfig(){return{type:"custom:vallox-iv-card",title:"Vallox Ventilation",show_efficiency:!0,show_profile:!0,show_fan_speed:!0,show_cell_state:!0,show_co2:!0,show_post_heater:!0}}willUpdate(t){super.willUpdate(t),(t.has("hass")||t.has("_config"))&&this._config&&this.hass&&(this._cardState=function(t,e){const o=vt(t,e.outdoor_air_temp),i=vt(t,e.supply_air_temp),r=vt(t,e.supply_cell_temp),s=vt(t,e.extract_air_temp),a=vt(t,e.exhaust_air_temp);let n=vt(t,e.efficiency);null!==n&&(n>=0&&n<=1&&(n*=100),n=Math.max(0,Math.min(100,n)));const l=mt(t,e.cell_state),c=mt(t,e.profile),p=vt(t,e.fan_speed),h=vt(t,e.co2),d=vt(t,e.humidity),u=mt(t,e.post_heater);return{outdoorTemp:o,supplyTemp:i,supplyCellTemp:r,extractTemp:s,exhaustTemp:a,efficiency:n,cellState:l,profile:c,fanSpeed:p,co2:h,humidity:d,postHeaterActive:null!==u&&["on","true","1","active","heating"].includes(u.toLowerCase()),tempUnit:yt(t,e.outdoor_air_temp)||yt(t,e.supply_air_temp)||yt(t,e.extract_air_temp)||yt(t,e.exhaust_air_temp)||"°C"}}(this.hass,this._config))}render(){if(this._error)return B`
        <ha-card>
          <div class="card-content">
            <ha-alert alert-type="error">${this._error}</ha-alert>
          </div>
        </ha-card>
      `;if(!this._config)return B`
        <ha-card>
          <div class="card-content">
            <p>Card not configured</p>
          </div>
        </ha-card>
      `;if(!this.hass||!this._cardState)return B`
        <ha-card>
          <div class="card-content">
            <p>Loading...</p>
          </div>
        </ha-card>
      `;const{model:t,labels:e,entities:o,dynamicColors:i,valueColor:r}=function(t,e){const o=t.tempUnit||"°C",i={cellState:e.cell_state,profile:e.profile,fanSpeed:e.fan_speed,efficiency:e.efficiency,extractTemp:e.extract_air_temp,supplyTemp:e.supply_air_temp,supplyCellTemp:e.supply_cell_temp,outdoorTemp:e.outdoor_air_temp,exhaustTemp:e.exhaust_air_temp,humidity:e.humidity,co2:e.co2,postHeater:e.post_heater},r={cellState:!1!==e.show_cell_state&&i.cellState?Ct(t.cellState):"",profile:!1!==e.show_profile&&i.profile?At(t.profile):"",fanSpeed:!1!==e.show_fan_speed&&i.fanSpeed?bt(t.fanSpeed):"",efficiency:!1!==e.show_efficiency&&i.efficiency?bt(t.efficiency):"",extractTemp:i.extractTemp?$t(t.extractTemp,o):"",humidity:!1!==e.show_humidity&&i.humidity?(s=t.humidity,null===s?"—":`${Math.round(s)}%`):"",co2:!1!==e.show_co2&&i.co2?wt(t.co2):"",supplyTemp:i.supplyTemp?$t(t.supplyTemp,o):"",supplyCellTemp:!1!==e.show_supply_cell_temp&&i.supplyCellTemp?$t(t.supplyCellTemp,o):"",outdoorTemp:i.outdoorTemp?$t(t.outdoorTemp,o):"",exhaustTemp:i.exhaustTemp?$t(t.exhaustTemp,o):"",postHeaterActive:!1!==e.show_post_heater&&i.postHeater?t.postHeaterActive:void 0};var s;const a=function(t){return{cellStateTitle:t.label_cell_state_title||"LTO-Cell State",extractAir:t.label_extract_air||"Extract air",supplyAir:t.label_supply_air||"Supply air",outdoorAir:t.label_outdoor_air||"Outdoor air",exhaustAir:t.label_exhaust_air||"Exhaust air",efficiency:t.label_efficiency||"Efficiency",profile:t.label_profile||"Profile",fanSpeed:t.label_fan_speed||"Fan speed",humidity:t.label_humidity||"Humidity",co2:t.label_co2||"CO₂"}}(e),n={};if(!1!==e.enable_temp_colors){const i={cold:e.temp_color_cold,freeze:e.temp_color_freeze,neutral:e.temp_color_neutral,warm:e.temp_color_warm,hot:e.temp_color_hot};n.extractTempColor=Ft(t.extractTemp,o,i),n.supplyTempColor=Ft(t.supplyTemp,o,i),n.supplyCellTempColor=Ft(t.supplyCellTemp,o,i),n.outdoorTempColor=Ft(t.outdoorTemp,o,i),n.exhaustTempColor=Ft(t.exhaustTemp,o,i)}const l=(c=t.co2,p=e.co2_limit,h=e.co2_alert_color,d=e.enable_co2_blink,null===c||void 0===p?{isAlert:!1}:c>p?{isAlert:!0,color:h||"#ff4444",className:!1!==d?"co2-alert":"co2-alert-static"}:{isAlert:!1});var c,p,h,d;return l.isAlert&&(n.co2Color=l.color,n.co2ClassName=l.className),{model:r,labels:{...a,cellStateTitle:!1===e.show_cell_state?"":a.cellStateTitle,humidity:!1!==e.show_humidity&&i.humidity?a.humidity:"",co2:!1!==e.show_co2&&i.co2?a.co2:""},entities:i,dynamicColors:n,valueColor:e.value_color}}(this._cardState,this._config);return B`
      <ha-card>
        ${this._config.title?B`<div class="card-header">${this._config.title}</div>`:""}
        <div class="card-content">
          <div class="diagram-container">
            ${function(t){const e="var(--vallox-glow-start, #e1f0ff)",o="var(--vallox-arrow-dark, #2a7ebf)",i="var(--vallox-arrow-light, #5cb8ff)",r=null!=t&&t>0,s=r?Math.max(.5,4-t/100*3.5):0;return V`
    <svg
      viewBox="0 0 ${800} ${500}"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style="${r?`--flow-duration: ${s}s;`:""}"
      class="${r?"airflow-active":"airflow-stopped"}"
    >
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${e}" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="${e}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Center glow -->
      <circle cx="${400}" cy="${250}" r="200" fill="url(#centerGlow)"/>

      <!-- Rotated square rings -->
      <g transform="translate(${400}, ${250}) rotate(45)">
        <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="${"var(--vallox-ring-stroke, #dcdcdc)"}" stroke-width="7" rx="2"/>
        <rect x="-82" y="-82" width="164" height="164" fill="none" stroke="${"var(--vallox-ring-stroke-inner, #e6e6e6)"}" stroke-width="4" rx="1"/>
      </g>

      <!-- Dark arrow base (extract to exhaust) -->
      <path d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${o}" stroke-width="15" stroke-linecap="round" opacity="0.3"/>
      <!-- Dark arrow animated flow -->
      <path class="airflow-path airflow-extract" d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${o}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 490,325 L 520,335 L 490,345 Z" fill="${o}" />

      <!-- Light arrow base (outdoor to supply) -->
      <path d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${i}" stroke-width="15" stroke-linecap="round" opacity="0.3"/>
      <!-- Light arrow animated flow -->
      <path class="airflow-path airflow-supply" d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${i}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 310,325 L 280,335 L 310,345 Z" fill="${i}" />

      <!-- Efficiency badge box -->
      <g transform="translate(${400}, ${250})">
        <rect x="-60" y="-28" width="120" height="56" rx="10" fill="${"var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.72))))"}" fill-opacity="0.5" stroke="${"var(--vallox-badge-stroke, var(--divider-color, #d1e8ff))"}" stroke-width="2"/>
      </g>
    </svg>
  `}(this._cardState.fanSpeed)}
            ${Bt(t,e,o,i,r,t=>{this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))})}
          </div>
        </div>
      </ha-card>
    `}getCardSize(){return 4}};Yt.styles=Vt,Xt([dt({attribute:!1})],Yt.prototype,"hass",2),Xt([ut()],Yt.prototype,"_config",2),Xt([ut()],Yt.prototype,"_cardState",2),Xt([ut()],Yt.prototype,"_error",2),Yt=Xt([ct("vallox-iv-card")],Yt),window.customCards=window.customCards||[],window.customCards.push({type:"vallox-iv-card",name:Qt,description:"Visualizes Vallox IV airflow, temperatures, and heat recovery",preview:!0,documentationURL:"https://github.com/your-repo/vallox-iv-card"}),console.info(`%c ${Qt} %c v1.0.0 `,"color: white; background: #039be5; font-weight: 700;","color: #039be5; background: white; font-weight: 700;");export{Yt as ValloxIvCard,Zt as ValloxIvCardEditor};
