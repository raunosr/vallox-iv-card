/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    var _a2;
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ?? (i2 = r2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = (t2) => t2, s$1 = t$1.trustedTypes, e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$2, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b = x(1), w = x(2), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i2) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e ? e.createHTML(i2) : i2;
}
const N = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$2 + x2) : s3 + o$2 + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$2), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H$1 }), r2.removeAttribute(t3);
        } else t3.startsWith(o$2) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$2), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$2, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$2.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = a(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? l).importNode(i2, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== (r2 == null ? void 0 : r2.index) && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class k {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$1(t2).nextSibling;
      i$1(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
let H$1 = class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i2, n3), r2 === E && (r2 = this._$AH[n3]), o2 || (o2 = !a(r2) || r2 !== this._$AH[n3]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
};
class I extends H$1 {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H$1 {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H$1 {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B == null ? void 0 : B(S, k), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.2");
const D = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return E;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
const DEFAULT_CONFIG = {
  show_efficiency: true,
  show_profile: true,
  show_fan_speed: true,
  show_cell_state: true,
  show_co2: true,
  show_humidity: false,
  show_post_heater: true,
  // Alert & dynamic color defaults
  enable_temp_colors: true,
  co2_limit: 1e3,
  co2_alert_color: "#ff4444",
  enable_co2_blink: true,
  // Typography defaults
  value_font_size: 48,
  unit_opacity: 0.6,
  font_weight: 500
};
function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid configuration: config must be an object");
  }
  const cfg = config;
  if (!cfg.type) {
    throw new Error("Invalid configuration: type is required");
  }
  const validatedConfig = {
    ...DEFAULT_CONFIG,
    ...cfg,
    type: cfg.type
  };
  const entityFields = [
    "outdoor_air_temp",
    "supply_air_temp",
    "extract_air_temp",
    "exhaust_air_temp",
    "efficiency",
    "cell_state",
    "profile",
    "fan_speed",
    "co2",
    "humidity",
    "post_heater"
  ];
  for (const field of entityFields) {
    const value = cfg[field];
    if (value !== void 0 && typeof value !== "string") {
      throw new Error(`Invalid configuration: ${field} must be a string`);
    }
    if (typeof value === "string" && value.length > 0 && !value.includes(".")) {
      throw new Error(`Invalid configuration: ${field} must be a valid entity ID (e.g., sensor.xxx)`);
    }
  }
  if (cfg.value_color !== void 0 && typeof cfg.value_color !== "string") {
    throw new Error("Invalid configuration: value_color must be a string");
  }
  if (cfg.co2_limit !== void 0 && (typeof cfg.co2_limit !== "number" || cfg.co2_limit < 0)) {
    throw new Error("Invalid configuration: co2_limit must be a positive number");
  }
  if (cfg.co2_alert_color !== void 0 && typeof cfg.co2_alert_color !== "string") {
    throw new Error("Invalid configuration: co2_alert_color must be a string");
  }
  if (cfg.enable_co2_blink !== void 0 && typeof cfg.enable_co2_blink !== "boolean") {
    throw new Error("Invalid configuration: enable_co2_blink must be a boolean");
  }
  if (cfg.enable_temp_colors !== void 0 && typeof cfg.enable_temp_colors !== "boolean") {
    throw new Error("Invalid configuration: enable_temp_colors must be a boolean");
  }
  if (cfg.value_font_size !== void 0 && (typeof cfg.value_font_size !== "number" || cfg.value_font_size < 10 || cfg.value_font_size > 100)) {
    throw new Error("Invalid configuration: value_font_size must be a number between 10 and 100");
  }
  if (cfg.unit_opacity !== void 0 && (typeof cfg.unit_opacity !== "number" || cfg.unit_opacity < 0 || cfg.unit_opacity > 1)) {
    throw new Error("Invalid configuration: unit_opacity must be a number between 0 and 1");
  }
  if (cfg.font_weight !== void 0 && (typeof cfg.font_weight !== "number" || ![400, 500, 600, 700].includes(cfg.font_weight))) {
    throw new Error("Invalid configuration: font_weight must be 400, 500, 600, or 700");
  }
  return validatedConfig;
}
const UNAVAILABLE_STATES = ["unavailable", "unknown", "none"];
function getState(hass, entityId) {
  if (!hass || !entityId) {
    return null;
  }
  const entity = hass.states[entityId];
  if (!entity) {
    return null;
  }
  const state = entity.state;
  if (UNAVAILABLE_STATES.includes(state.toLowerCase())) {
    return null;
  }
  return state;
}
function getNumericState(hass, entityId) {
  const state = getState(hass, entityId);
  if (state === null) {
    return null;
  }
  const num = parseFloat(state);
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  return num;
}
function getUnit(hass, entityId) {
  if (!hass || !entityId) {
    return "";
  }
  const entity = hass.states[entityId];
  if (!(entity == null ? void 0 : entity.attributes)) {
    return "";
  }
  return entity.attributes.unit_of_measurement || "";
}
function deriveCardState(hass, config) {
  const outdoorTemp = getNumericState(hass, config.outdoor_air_temp);
  const supplyTemp = getNumericState(hass, config.supply_air_temp);
  const supplyCellTemp = getNumericState(hass, config.supply_cell_temp);
  const extractTemp = getNumericState(hass, config.extract_air_temp);
  const exhaustTemp = getNumericState(hass, config.exhaust_air_temp);
  let efficiency = getNumericState(hass, config.efficiency);
  if (efficiency !== null) {
    if (efficiency >= 0 && efficiency <= 1) {
      efficiency = efficiency * 100;
    }
    efficiency = Math.max(0, Math.min(100, efficiency));
  }
  const cellState = getState(hass, config.cell_state);
  const profile = getState(hass, config.profile);
  const fanSpeed = getNumericState(hass, config.fan_speed);
  const co2 = getNumericState(hass, config.co2);
  const humidity = getNumericState(hass, config.humidity);
  const postHeaterState = getState(hass, config.post_heater);
  const postHeaterActive = postHeaterState !== null && ["on", "true", "1", "active", "heating"].includes(postHeaterState.toLowerCase());
  const tempUnit = getUnit(hass, config.outdoor_air_temp) || getUnit(hass, config.supply_air_temp) || getUnit(hass, config.extract_air_temp) || getUnit(hass, config.exhaust_air_temp) || "°C";
  return {
    outdoorTemp,
    supplyTemp,
    supplyCellTemp,
    extractTemp,
    exhaustTemp,
    efficiency,
    cellState,
    profile,
    fanSpeed,
    co2,
    humidity,
    postHeaterActive,
    tempUnit
  };
}
function formatTemperature(value, unit = "°C", decimals = 1) {
  if (value === null) {
    return "—";
  }
  return `${value.toFixed(decimals)}${unit}`;
}
function formatPercentage(value, decimals = 0) {
  if (value === null) {
    return "—";
  }
  const normalized = value <= 1 && value >= 0 ? value * 100 : value;
  return `${normalized.toFixed(decimals)}%`;
}
function formatCO2(value) {
  if (value === null) {
    return "—";
  }
  return `${Math.round(value)} ppm`;
}
function formatHumidity(value) {
  if (value === null) {
    return "—";
  }
  return `${Math.round(value)}%`;
}
function capitalize(str) {
  if (!str) {
    return "—";
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function formatCellState(state) {
  if (!state) {
    return "—";
  }
  const stateMap = {
    "heat_recovery": "Heat Recovery",
    "cool_recovery": "Cool Recovery",
    "bypass": "Bypass",
    "defrost": "Defrost"
  };
  return stateMap[state.toLowerCase()] || capitalize(state);
}
function formatProfile(profile) {
  if (!profile) {
    return "—";
  }
  const profileMap = {
    "home": "Home",
    "away": "Away",
    "boost": "Boost",
    "fireplace": "Fireplace",
    "extra": "Extra"
  };
  return profileMap[profile.toLowerCase()] || capitalize(profile);
}
const DEFAULT_TEMP_COLORS = {
  cold: "#0000FF",
  // ≤-10°C: Deep Blue
  freeze: "#00FFFF",
  // 0°C: Cyan
  neutral: "#8892E3",
  // 22°C: Theme Default / Lavender
  warm: "#FFA500",
  // 25°C: Orange
  hot: "#FF4500"
  // ≥25°C: Soft Red (OrangeRed)
};
const TEMP_THRESHOLDS = {
  cold: -10,
  // Below this: solid cold color
  freeze: 0,
  // Freeze point
  neutral: 22,
  // Comfortable room temp
  warm: 25
  // Getting warm
};
function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  const fullHex = cleanHex.length === 3 ? cleanHex.split("").map((c2) => c2 + c2).join("") : cleanHex;
  const num = parseInt(fullHex, 16);
  return {
    r: num >> 16 & 255,
    g: num >> 8 & 255,
    b: num & 255
  };
}
function rgbToHex(r2, g2, b2) {
  const toHex = (n3) => Math.round(Math.max(0, Math.min(255, n3))).toString(16).padStart(2, "0");
  return `#${toHex(r2)}${toHex(g2)}${toHex(b2)}`;
}
function normalizeColor(color) {
  if (!color) return void 0;
  if (typeof color === "string") return color;
  if (Array.isArray(color) && color.length === 3) {
    return rgbToHex(color[0], color[1], color[2]);
  }
  return void 0;
}
function interpolateColor(color1, color2, ratio) {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  const t2 = Math.max(0, Math.min(1, ratio));
  const r2 = c1.r + (c2.r - c1.r) * t2;
  const g2 = c1.g + (c2.g - c1.g) * t2;
  const b2 = c1.b + (c2.b - c1.b) * t2;
  return rgbToHex(r2, g2, b2);
}
function getTemperatureColor(temp, unit = "°C", colors) {
  if (temp === null) return void 0;
  const celsius = unit === "°F" ? (temp - 32) * 5 / 9 : temp;
  const c2 = {
    cold: normalizeColor(colors == null ? void 0 : colors.cold) || DEFAULT_TEMP_COLORS.cold,
    freeze: normalizeColor(colors == null ? void 0 : colors.freeze) || DEFAULT_TEMP_COLORS.freeze,
    neutral: normalizeColor(colors == null ? void 0 : colors.neutral) || DEFAULT_TEMP_COLORS.neutral,
    warm: normalizeColor(colors == null ? void 0 : colors.warm) || DEFAULT_TEMP_COLORS.warm,
    hot: normalizeColor(colors == null ? void 0 : colors.hot) || DEFAULT_TEMP_COLORS.hot
  };
  if (celsius <= TEMP_THRESHOLDS.cold) {
    return c2.cold;
  }
  if (celsius < TEMP_THRESHOLDS.freeze) {
    const ratio2 = (celsius - TEMP_THRESHOLDS.cold) / (TEMP_THRESHOLDS.freeze - TEMP_THRESHOLDS.cold);
    return interpolateColor(c2.cold, c2.freeze, ratio2);
  }
  if (celsius < TEMP_THRESHOLDS.neutral) {
    const ratio2 = (celsius - TEMP_THRESHOLDS.freeze) / (TEMP_THRESHOLDS.neutral - TEMP_THRESHOLDS.freeze);
    return interpolateColor(c2.freeze, c2.neutral, ratio2);
  }
  if (celsius < TEMP_THRESHOLDS.warm) {
    const ratio2 = (celsius - TEMP_THRESHOLDS.neutral) / (TEMP_THRESHOLDS.warm - TEMP_THRESHOLDS.neutral);
    return interpolateColor(c2.neutral, c2.warm, ratio2);
  }
  const hotCap = 30;
  if (celsius >= hotCap) {
    return c2.hot;
  }
  const ratio = (celsius - TEMP_THRESHOLDS.warm) / (hotCap - TEMP_THRESHOLDS.warm);
  return interpolateColor(c2.warm, c2.hot, ratio);
}
function getCO2AlertState(co2, limit, alertColor, enableBlink) {
  if (co2 === null || limit === void 0) {
    return { isAlert: false };
  }
  const isAlert = co2 > limit;
  if (!isAlert) {
    return { isAlert: false };
  }
  return {
    isAlert: true,
    color: alertColor || "#ff4444",
    className: enableBlink !== false ? "co2-alert" : "co2-alert-static"
  };
}
const W = 800;
const H2 = 500;
const CX = 400;
const CY = 250;
function prepareRenderData(state, config) {
  const tempUnit = state.tempUnit || "°C";
  const entities = {
    cellState: config.cell_state,
    profile: config.profile,
    fanSpeed: config.fan_speed,
    efficiency: config.efficiency,
    extractTemp: config.extract_air_temp,
    supplyTemp: config.supply_air_temp,
    supplyCellTemp: config.supply_cell_temp,
    outdoorTemp: config.outdoor_air_temp,
    exhaustTemp: config.exhaust_air_temp,
    humidity: config.humidity,
    co2: config.co2,
    postHeater: config.post_heater
  };
  const model = {
    cellState: config.show_cell_state === false || !entities.cellState ? "" : formatCellState(state.cellState),
    profile: config.show_profile === false || !entities.profile ? "" : formatProfile(state.profile),
    fanSpeed: config.show_fan_speed === false || !entities.fanSpeed ? "" : formatPercentage(state.fanSpeed),
    efficiency: config.show_efficiency === false || !entities.efficiency ? "" : formatPercentage(state.efficiency),
    extractTemp: entities.extractTemp ? formatTemperature(state.extractTemp, tempUnit) : "",
    humidity: config.show_humidity === false || !entities.humidity ? "" : formatHumidity(state.humidity),
    co2: config.show_co2 === false || !entities.co2 ? "" : formatCO2(state.co2),
    supplyTemp: entities.supplyTemp ? formatTemperature(state.supplyTemp, tempUnit) : "",
    supplyCellTemp: config.show_supply_cell_temp === false || !entities.supplyCellTemp ? "" : formatTemperature(state.supplyCellTemp, tempUnit),
    outdoorTemp: entities.outdoorTemp ? formatTemperature(state.outdoorTemp, tempUnit) : "",
    exhaustTemp: entities.exhaustTemp ? formatTemperature(state.exhaustTemp, tempUnit) : "",
    postHeaterActive: config.show_post_heater === false || !entities.postHeater ? void 0 : state.postHeaterActive
  };
  const labels = getLabels(config);
  const enableTempColors = config.enable_temp_colors !== false;
  const dynamicColors = {};
  if (enableTempColors) {
    const colorOptions = {
      cold: config.temp_color_cold,
      freeze: config.temp_color_freeze,
      neutral: config.temp_color_neutral,
      warm: config.temp_color_warm,
      hot: config.temp_color_hot
    };
    dynamicColors.extractTempColor = getTemperatureColor(state.extractTemp, tempUnit, colorOptions);
    dynamicColors.supplyTempColor = getTemperatureColor(state.supplyTemp, tempUnit, colorOptions);
    dynamicColors.supplyCellTempColor = getTemperatureColor(state.supplyCellTemp, tempUnit, colorOptions);
    dynamicColors.outdoorTempColor = getTemperatureColor(state.outdoorTemp, tempUnit, colorOptions);
    dynamicColors.exhaustTempColor = getTemperatureColor(state.exhaustTemp, tempUnit, colorOptions);
  }
  const co2Alert = getCO2AlertState(
    state.co2,
    config.co2_limit,
    config.co2_alert_color,
    config.enable_co2_blink
  );
  if (co2Alert.isAlert) {
    dynamicColors.co2Color = co2Alert.color;
    dynamicColors.co2ClassName = co2Alert.className;
  }
  return {
    model,
    labels: {
      ...labels,
      cellStateTitle: config.show_cell_state === false ? "" : labels.cellStateTitle,
      humidity: config.show_humidity === false || !entities.humidity ? "" : labels.humidity,
      co2: config.show_co2 === false || !entities.co2 ? "" : labels.co2
    },
    entities,
    dynamicColors,
    valueColor: config.value_color
  };
}
function getLabels(config) {
  return {
    cellStateTitle: config.label_cell_state_title || "LTO-Cell State",
    extractAir: config.label_extract_air || "Extract air",
    supplyAir: config.label_supply_air || "Supply air",
    outdoorAir: config.label_outdoor_air || "Outdoor air",
    exhaustAir: config.label_exhaust_air || "Exhaust air",
    efficiency: config.label_efficiency || "Efficiency",
    profile: config.label_profile || "Profile",
    fanSpeed: config.label_fan_speed || "Fan speed",
    humidity: config.label_humidity || "Humidity",
    co2: config.label_co2 || "CO₂"
  };
}
function renderBackgroundSvg(fanSpeed) {
  const glowStart = "var(--vallox-glow-start, #e1f0ff)";
  const ringStroke = "var(--vallox-ring-stroke, #dcdcdc)";
  const ringStrokeInner = "var(--vallox-ring-stroke-inner, #e6e6e6)";
  const arrowDark = "var(--vallox-arrow-dark, #2a7ebf)";
  const arrowLight = "var(--vallox-arrow-light, #5cb8ff)";
  const badgeStroke = "var(--vallox-badge-stroke, var(--divider-color, #d1e8ff))";
  const badgeFill = "var(--vallox-badge-fill, var(--ha-card-background, var(--card-background-color, rgba(255,255,255,0.72))))";
  const isRunning = fanSpeed !== null && fanSpeed !== void 0 && fanSpeed > 0;
  const animationDuration = isRunning ? Math.max(0.5, 4 - fanSpeed / 100 * 3.5) : 0;
  const flowStyle = isRunning ? `--flow-duration: ${animationDuration}s;` : "";
  return w`
    <svg
      viewBox="0 0 ${W} ${H2}"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style="${flowStyle}"
      class="${isRunning ? "airflow-active" : "airflow-stopped"}"
    >
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${glowStart}" stop-opacity="0.45"/>
          <stop offset="60%" stop-color="${glowStart}" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- Center glow -->
      <circle cx="${CX}" cy="${CY}" r="200" fill="url(#centerGlow)"/>

      <!-- Rotated square rings -->
      <g transform="translate(${CX}, ${CY}) rotate(45)">
        <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="${ringStroke}" stroke-width="7" rx="2"/>
        <rect x="-82" y="-82" width="164" height="164" fill="none" stroke="${ringStrokeInner}" stroke-width="4" rx="1"/>
      </g>

      <!-- Dark arrow base (extract to exhaust) -->
      <path d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${arrowDark}" stroke-width="15" stroke-linecap="round" opacity="0.3"/>
      <!-- Dark arrow animated flow -->
      <path class="airflow-path airflow-extract" d="M 310,165 C 360,165 440,335 490,335" fill="none" stroke="${arrowDark}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 490,325 L 520,335 L 490,345 Z" fill="${arrowDark}" />

      <!-- Light arrow base (outdoor to supply) -->
      <path d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${arrowLight}" stroke-width="15" stroke-linecap="round" opacity="0.3"/>
      <!-- Light arrow animated flow -->
      <path class="airflow-path airflow-supply" d="M 490,165 C 440,165 360,335 310,335" fill="none" stroke="${arrowLight}" stroke-width="15" stroke-linecap="round"/>
      <path d="M 310,325 L 280,335 L 310,345 Z" fill="${arrowLight}" />

      <!-- Efficiency badge box -->
      <g transform="translate(${CX}, ${CY})">
        <rect x="-60" y="-28" width="120" height="56" rx="10" fill="${badgeFill}" fill-opacity="0.5" stroke="${badgeStroke}" stroke-width="2"/>
      </g>
    </svg>
  `;
}
function parseValueAndUnit(formatted) {
  if (!formatted || formatted === "—") {
    return { value: formatted, unit: "" };
  }
  const match = formatted.match(/^(-?\d+(?:\.\d+)?)\s*(.*)$/);
  if (match) {
    return { value: match[1], unit: match[2] };
  }
  return { value: formatted, unit: "" };
}
function renderValue(value, entityId, onEntityClick, colorOverride, className) {
  if (!value) return b``;
  const parsed = parseValueAndUnit(value);
  const clickable = Boolean(entityId && onEntityClick);
  const style = colorOverride ? `color: ${colorOverride}` : "";
  const classes = ["value", clickable ? "clickable" : "", ""].filter(Boolean).join(" ");
  const content = parsed.unit ? b`<span class="num">${parsed.value}</span><span class="unit">${parsed.unit}</span>` : b`${value}`;
  if (clickable && entityId && onEntityClick) {
    return b`
      <span class="${classes}" style="${style}" @click=${() => onEntityClick(entityId)}>
        ${content}
      </span>
    `;
  }
  return b`<span class="${classes}" style="${style}">${content}</span>`;
}
function renderHumidityIcon() {
  return b`<ha-icon icon="mdi:water-percent" class="sensor-icon humidity-icon"></ha-icon>`;
}
function renderCO2Icon() {
  return b`<ha-icon icon="mdi:molecule-co2" class="sensor-icon co2-icon"></ha-icon>`;
}
function renderLabelValue(label, value, entityId, onEntityClick, colorOverride, className, useIcon) {
  if (!value) return b``;
  const parsed = parseValueAndUnit(value);
  const clickable = Boolean(entityId && onEntityClick);
  const valueStyle = colorOverride ? `color: ${colorOverride}` : "";
  const classes = ["label-value", clickable ? "clickable" : "", className || ""].filter(Boolean).join(" ");
  let labelContent;
  if (useIcon === "humidity") {
    labelContent = b`${renderHumidityIcon()}`;
  } else if (useIcon === "co2") {
    labelContent = b`${renderCO2Icon()}`;
  } else {
    labelContent = label ? b`<span class="label">${label}: </span>` : "";
  }
  const content = b`
    ${labelContent}
    <span class="value" style="${valueStyle}">
      <span class="num">${parsed.value}</span>${parsed.unit ? b`<span class="unit">${parsed.unit}</span>` : ""}
    </span>
  `;
  if (clickable && entityId && onEntityClick) {
    return b`
      <div class="${classes}" @click=${() => onEntityClick(entityId)}>
        ${content}
      </div>
    `;
  }
  return b`<div class="${classes}">${content}</div>`;
}
function renderTempBlock(args) {
  const {
    position,
    title,
    temp,
    tempEntityId,
    tempColor,
    humidity,
    humidityLabel,
    humidityEntityId,
    co2,
    co2Label,
    co2EntityId,
    co2Color,
    co2ClassName,
    onEntityClick
  } = args;
  return b`
    <div class="temp-block ${position}">
      <div class="title">${title}</div>
      ${renderValue(temp, tempEntityId, onEntityClick, tempColor)}
      ${humidity ? renderLabelValue(humidityLabel || "", humidity, humidityEntityId, onEntityClick, void 0, void 0, "humidity") : ""}
      ${co2 ? renderLabelValue(co2Label || "", co2, co2EntityId, onEntityClick, co2Color, co2ClassName, "co2") : ""}
    </div>
  `;
}
function renderFanIcon() {
  return b`<ha-icon icon="mdi:fan" class="fan-icon"></ha-icon>`;
}
function renderPostHeaterIcon(active) {
  const colorClass = active ? "active" : "inactive";
  return b`<ha-icon icon="mdi:radiator" class="post-heater-icon ${colorClass}"></ha-icon>`;
}
function renderTextOverlay(model, labels, entities, dynamicColors, valueColor, onEntityClick) {
  const {
    cellState,
    profile,
    fanSpeed,
    efficiency,
    extractTemp,
    humidity,
    co2,
    supplyTemp,
    supplyCellTemp,
    outdoorTemp,
    exhaustTemp,
    postHeaterActive
  } = model;
  const valueStyle = valueColor ? `--vallox-value-color: ${valueColor}` : "";
  return b`
    <div class="text-overlay" style="${valueStyle}">
      <!-- Cell State Header -->
      ${labels.cellStateTitle || cellState ? b`
            <div class="cell-state-block">
              ${labels.cellStateTitle ? b`<div class="cell-state-title">${labels.cellStateTitle}</div>` : ""}
              ${cellState ? b`
                    <div
                      class="cell-state-value ${entities.cellState && onEntityClick ? "clickable" : ""}"
                      @click=${entities.cellState && onEntityClick ? () => onEntityClick(entities.cellState) : A}
                    >
                      ${cellState}
                    </div>
                  ` : ""}
            </div>
          ` : ""}

      <!-- Efficiency Badge (center) -->
      <div class="efficiency-block">
        ${renderValue(efficiency, entities.efficiency, onEntityClick)}
      </div>

      <!-- Post-Heater & Supply Cell Temp (on supply arrow, between efficiency and supply label) -->
      ${supplyCellTemp || postHeaterActive !== void 0 ? b`
            <div class="supply-cell-block">
              ${postHeaterActive !== void 0 ? b`
                    <span
                      class="post-heater ${entities.postHeater && onEntityClick ? "clickable" : ""}"
                      @click=${entities.postHeater && onEntityClick ? () => onEntityClick(entities.postHeater) : A}
                    >
                      ${renderPostHeaterIcon(postHeaterActive)}
                    </span>
                  ` : ""}
              ${supplyCellTemp ? b`
                    <div
                      class="supply-cell-temp ${entities.supplyCellTemp && onEntityClick ? "clickable" : ""}"
                      style="${dynamicColors.supplyCellTempColor ? `color: ${dynamicColors.supplyCellTempColor}` : ""}"
                      @click=${entities.supplyCellTemp && onEntityClick ? () => onEntityClick(entities.supplyCellTemp) : A}
                    >
                      ${supplyCellTemp}
                    </div>
                  ` : ""}
            </div>
          ` : ""}

      <!-- Extract Air (left top) -->
      ${renderTempBlock({
    position: "extract",
    title: labels.extractAir,
    temp: extractTemp,
    tempEntityId: entities.extractTemp,
    tempColor: dynamicColors.extractTempColor,
    humidity,
    humidityLabel: labels.humidity,
    humidityEntityId: entities.humidity,
    co2,
    co2Label: labels.co2,
    co2EntityId: entities.co2,
    co2Color: dynamicColors.co2Color,
    co2ClassName: dynamicColors.co2ClassName,
    onEntityClick
  })}

      <!-- Supply Air (left bottom) -->
      ${renderTempBlock({
    position: "supply",
    title: labels.supplyAir,
    temp: supplyTemp,
    tempEntityId: entities.supplyTemp,
    tempColor: dynamicColors.supplyTempColor,
    onEntityClick
  })}

      <!-- Outdoor Air (right top) -->
      ${renderTempBlock({
    position: "outdoor",
    title: labels.outdoorAir,
    temp: outdoorTemp,
    tempEntityId: entities.outdoorTemp,
    tempColor: dynamicColors.outdoorTempColor,
    onEntityClick
  })}

      <!-- Exhaust Air (right bottom) -->
      ${renderTempBlock({
    position: "exhaust",
    title: labels.exhaustAir,
    temp: exhaustTemp,
    tempEntityId: entities.exhaustTemp,
    tempColor: dynamicColors.exhaustTempColor,
    onEntityClick
  })}

      <!-- Profile & Fan Speed (bottom center) -->
      ${profile || fanSpeed ? b`
            <div class="profile-fan-block">
              ${profile ? b`
                    <span
                      class="profile ${entities.profile && onEntityClick ? "clickable" : ""}"
                      @click=${entities.profile && onEntityClick ? () => onEntityClick(entities.profile) : A}
                    >
                      ${profile}
                    </span>
                  ` : ""}
              ${fanSpeed ? b`
                    <span
                      class="fan-speed ${entities.fanSpeed && onEntityClick ? "clickable" : ""}"
                      @click=${entities.fanSpeed && onEntityClick ? () => onEntityClick(entities.fanSpeed) : A}
                    >
                      (${renderFanIcon()}${fanSpeed})
                    </span>
                  ` : ""}
            </div>
          ` : ""}
    </div>
  `;
}
const cardStyles = i$3`
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
    font-size: 16px;
    margin-top: 0;
    line-height: 1.3;
    text-align: center;
  }

  .temp-block .label-value .sensor-icon {
    --mdc-icon-size: 16px;
    vertical-align: -0.15em;
    margin-right: 2px;
    color: var(--vallox-label-color);
  }

  .temp-block .label-value .value {
    font-size: 16px;
    display: inline;
  }

  .temp-block .label-value .value .unit {
    font-size: 16px;
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
    z-index: 10;
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
`;
i$3`
  .diagram-container {
    aspect-ratio: 800 / 450;
  }
`;
function getStubConfig() {
  return {
    type: "custom:vallox-iv-card",
    title: "Vallox Ventilation",
    show_efficiency: true,
    show_profile: true,
    show_fan_speed: true,
    show_cell_state: true,
    show_co2: true,
    show_post_heater: true
  };
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
let ValloxIvCardEditor = class extends i {
  setConfig(config) {
    this._config = { ...config };
  }
  _renderEntitySelector(label, configKey, domains) {
    const config = this._config || {};
    const value = config[configKey] || "";
    return b`
      <div class="form-row">
        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: { domain: domains } }}
          .value=${value}
          .label=${label}
          @value-changed=${(e2) => this._valueChanged(configKey, e2.detail.value)}
        ></ha-selector>
      </div>
    `;
  }
  _renderLabelInput(label, configKey, placeholder) {
    const config = this._config || {};
    const value = config[configKey] || "";
    return b`
      <div class="form-row">
        <ha-textfield
          .label=${label}
          .value=${value}
          .placeholder=${placeholder}
          @input=${(e2) => this._valueChanged(configKey, e2.target.value)}
        ></ha-textfield>
      </div>
    `;
  }
  _renderColorSelector(label, configKey, placeholder) {
    const config = this._config || {};
    const rawValue = config[configKey];
    let value = "";
    if (typeof rawValue === "string") {
      value = rawValue;
    } else if (Array.isArray(rawValue) && rawValue.length === 3) {
      const toHex = (n3) => Math.round(Math.max(0, Math.min(255, n3))).toString(16).padStart(2, "0");
      value = `#${toHex(rawValue[0])}${toHex(rawValue[1])}${toHex(rawValue[2])}`;
    }
    const swatch = value || placeholder;
    return b`
      <div class="form-row color-row">
        <ha-textfield
          .label=${label}
          .value=${value}
          .placeholder=${placeholder}
          @input=${(e2) => this._valueChanged(configKey, e2.target.value)}
        ></ha-textfield>
        <input
          type="color"
          class="color-picker"
          .value=${swatch}
          @input=${(e2) => this._valueChanged(configKey, e2.target.value)}
        />
      </div>
    `;
  }
  _renderNumberInput(label, configKey, defaultValue) {
    const config = this._config || {};
    const value = config[configKey];
    const displayValue = value !== void 0 ? String(value) : "";
    return b`
      <div class="form-row">
        <ha-textfield
          .label=${label}
          .value=${displayValue}
          .placeholder=${String(defaultValue)}
          type="number"
          @input=${(e2) => {
      const inputValue = e2.target.value;
      const numValue = inputValue ? Number(inputValue) : void 0;
      this._valueChanged(configKey, numValue);
    }}
        ></ha-textfield>
      </div>
    `;
  }
  render() {
    if (!this.hass) {
      return b`<div>Loading...</div>`;
    }
    const config = this._config || {};
    return b`
      <div class="form-row">
        <ha-textfield
          label="Card Title"
          .value=${config.title || ""}
          @input=${(e2) => this._valueChanged("title", e2.target.value)}
        ></ha-textfield>
      </div>

      <div class="section-title">Temperature Sensors</div>
      ${this._renderEntitySelector("Outdoor Air Temperature", "outdoor_air_temp", ["sensor"])}
      ${this._renderEntitySelector("Supply Air Temperature", "supply_air_temp", ["sensor"])}
      ${this._renderEntitySelector("Extract Air Temperature", "extract_air_temp", ["sensor"])}
      ${this._renderEntitySelector("Exhaust Air Temperature", "exhaust_air_temp", ["sensor"])}

      <div class="section-title">Heat Recovery</div>
      ${this._renderEntitySelector("Efficiency Sensor", "efficiency", ["sensor"])}
      ${this._renderEntitySelector("Cell State", "cell_state", ["sensor", "select"])}
      ${this._renderEntitySelector("Supply Cell Temperature", "supply_cell_temp", ["sensor"])}
      ${this._renderEntitySelector("Post-Heater", "post_heater", ["binary_sensor", "sensor", "switch"])}

      <div class="section-title">Additional Sensors</div>
      ${this._renderEntitySelector("Ventilation Profile", "profile", ["sensor", "select"])}
      ${this._renderEntitySelector("Fan Speed", "fan_speed", ["sensor"])}
      ${this._renderEntitySelector("CO₂ Sensor", "co2", ["sensor"])}
      ${this._renderEntitySelector("Humidity Sensor", "humidity", ["sensor"])}

      <div class="section-title">Labels (optional)</div>
      ${this._renderLabelInput("Cell State Title", "label_cell_state_title", "LTO-Cell State")}
      ${this._renderLabelInput("Extract Air Label", "label_extract_air", "Extract air")}
      ${this._renderLabelInput("Supply Air Label", "label_supply_air", "Supply air")}
      ${this._renderLabelInput("Outdoor Air Label", "label_outdoor_air", "Outdoor air")}
      ${this._renderLabelInput("Exhaust Air Label", "label_exhaust_air", "Exhaust air")}
      ${this._renderLabelInput("Efficiency Label", "label_efficiency", "Efficiency")}
      ${this._renderLabelInput("Profile Label", "label_profile", "Profile")}
      ${this._renderLabelInput("Fan Speed Label", "label_fan_speed", "Fan speed")}

      <div class="section-title">Colors (optional)</div>

      <div class="toggle-row">
        <span>Enable Temperature Color Scaling</span>
        <ha-switch
          .checked=${config.enable_temp_colors !== false}
          @change=${(e2) => this._valueChanged("enable_temp_colors", e2.target.checked)}
        ></ha-switch>
      </div>

      ${config.enable_temp_colors !== false ? b`
        ${this._renderColorSelector("Cold (≤-10°C)", "temp_color_cold", "#0000FF")}
        ${this._renderColorSelector("Freeze (0°C)", "temp_color_freeze", "#00FFFF")}
        ${this._renderColorSelector("Neutral (22°C)", "temp_color_neutral", "#8892E3")}
        ${this._renderColorSelector("Warm (25°C)", "temp_color_warm", "#FFA500")}
        ${this._renderColorSelector("Hot (≥25°C)", "temp_color_hot", "#FF4500")}
      ` : ""}

      <div class="section-title">Alert Settings</div>

      ${this._renderNumberInput("CO₂ Alert Threshold (ppm)", "co2_limit", 1e3)}
      ${this._renderColorSelector("CO₂ Alert Color", "co2_alert_color", "#ff4444")}

      <div class="toggle-row">
        <span>Enable CO₂ Alert Animation</span>
        <ha-switch
          .checked=${config.enable_co2_blink !== false}
          @change=${(e2) => this._valueChanged("enable_co2_blink", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="section-title">Display Options</div>

      <div class="toggle-row">
        <span>Show Efficiency</span>
        <ha-switch
          .checked=${config.show_efficiency !== false}
          @change=${(e2) => this._valueChanged("show_efficiency", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Profile</span>
        <ha-switch
          .checked=${config.show_profile !== false}
          @change=${(e2) => this._valueChanged("show_profile", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Fan Speed</span>
        <ha-switch
          .checked=${config.show_fan_speed !== false}
          @change=${(e2) => this._valueChanged("show_fan_speed", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show CO₂</span>
        <ha-switch
          .checked=${config.show_co2 !== false}
          @change=${(e2) => this._valueChanged("show_co2", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Humidity</span>
        <ha-switch
          .checked=${config.show_humidity !== false}
          @change=${(e2) => this._valueChanged("show_humidity", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Cell State</span>
        <ha-switch
          .checked=${config.show_cell_state !== false}
          @change=${(e2) => this._valueChanged("show_cell_state", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Supply Cell Temperature</span>
        <ha-switch
          .checked=${config.show_supply_cell_temp !== false}
          @change=${(e2) => this._valueChanged("show_supply_cell_temp", e2.target.checked)}
        ></ha-switch>
      </div>

      <div class="toggle-row">
        <span>Show Post-Heater</span>
        <ha-switch
          .checked=${config.show_post_heater !== false}
          @change=${(e2) => this._valueChanged("show_post_heater", e2.target.checked)}
        ></ha-switch>
      </div>
    `;
  }
  _valueChanged(key, value) {
    const config = this._config || { type: "custom:vallox-iv-card" };
    const newConfig = {
      ...config,
      [key]: value
    };
    if (value === "" || value === void 0) {
      delete newConfig[key];
    }
    this._config = newConfig;
    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
};
ValloxIvCardEditor.styles = i$3`
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
  `;
__decorateClass$1([
  n2({ attribute: false })
], ValloxIvCardEditor.prototype, "hass", 2);
__decorateClass$1([
  r()
], ValloxIvCardEditor.prototype, "_config", 2);
ValloxIvCardEditor = __decorateClass$1([
  t("vallox-iv-card-editor")
], ValloxIvCardEditor);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
const CARD_VERSION = "1.0.0";
const CARD_NAME = "Vallox IV Card";
const CARD_DESCRIPTION = "Visualizes Vallox IV airflow, temperatures, and heat recovery";
let ValloxIvCard = class extends i {
  /**
   * Set card configuration - called by Home Assistant
   */
  setConfig(config) {
    try {
      this._config = validateConfig(config);
      this._error = void 0;
    } catch (e2) {
      this._error = e2 instanceof Error ? e2.message : "Unknown configuration error";
      throw e2;
    }
  }
  /**
   * Grid options for Sections view support
   */
  getGridOptions() {
    return {
      columns: 4,
      rows: 3,
      min_columns: 2,
      min_rows: 2
    };
  }
  /**
   * Return custom editor element
   */
  static getConfigElement() {
    return document.createElement("vallox-iv-card-editor");
  }
  /**
   * Stub config for card picker
   */
  static getStubConfig() {
    return getStubConfig();
  }
  /**
   * React to property changes
   */
  willUpdate(changedProps) {
    super.willUpdate(changedProps);
    if (changedProps.has("hass") || changedProps.has("_config")) {
      if (this._config && this.hass) {
        this._cardState = deriveCardState(this.hass, this._config);
      }
    }
  }
  /**
   * Main render method
   */
  render() {
    if (this._error) {
      return b`
        <ha-card>
          <div class="card-content">
            <ha-alert alert-type="error">${this._error}</ha-alert>
          </div>
        </ha-card>
      `;
    }
    if (!this._config) {
      return b`
        <ha-card>
          <div class="card-content">
            <p>Card not configured</p>
          </div>
        </ha-card>
      `;
    }
    if (!this.hass || !this._cardState) {
      return b`
        <ha-card>
          <div class="card-content">
            <p>Loading...</p>
          </div>
        </ha-card>
      `;
    }
    const { model, labels, entities, dynamicColors, valueColor } = prepareRenderData(this._cardState, this._config);
    const handleEntityClick = (entityId) => {
      this.dispatchEvent(
        new CustomEvent("hass-more-info", {
          detail: { entityId },
          bubbles: true,
          composed: true
        })
      );
    };
    return b`
      <ha-card>
        ${this._config.title ? b`<div class="card-header">${this._config.title}</div>` : ""}
        <div class="card-content">
          <div class="diagram-container">
            ${renderBackgroundSvg(this._cardState.fanSpeed)}
            ${renderTextOverlay(model, labels, entities, dynamicColors, valueColor, handleEntityClick)}
          </div>
        </div>
      </ha-card>
    `;
  }
  /**
   * Return card size for legacy Lovelace layout
   */
  getCardSize() {
    return 4;
  }
};
ValloxIvCard.styles = cardStyles;
__decorateClass([
  n2({ attribute: false })
], ValloxIvCard.prototype, "hass", 2);
__decorateClass([
  r()
], ValloxIvCard.prototype, "_config", 2);
__decorateClass([
  r()
], ValloxIvCard.prototype, "_cardState", 2);
__decorateClass([
  r()
], ValloxIvCard.prototype, "_error", 2);
ValloxIvCard = __decorateClass([
  t("vallox-iv-card")
], ValloxIvCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "vallox-iv-card",
  name: CARD_NAME,
  description: CARD_DESCRIPTION,
  preview: true,
  documentationURL: "https://github.com/your-repo/vallox-iv-card"
});
console.info(
  `%c ${CARD_NAME} %c v${CARD_VERSION} `,
  "color: white; background: #039be5; font-weight: 700;",
  "color: #039be5; background: white; font-weight: 700;"
);
export {
  ValloxIvCard,
  ValloxIvCardEditor
};
