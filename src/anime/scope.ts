import { doc, win } from "./consts";

import { globals } from "./globals";

import { isFnc, mergeObjects } from "./helpers";

import { parseTargets } from "./targets";

export class Scope {
  /** @param {ScopeParams} [parameters] */
  constructor(parameters = {}) {
    if (globals.scope) globals.scope.revertibles.push(this);
    const parsedRoot = parseTargets(parameters.root);
    const scopeDefaults = parameters.defaults;
    const globalDefault = globals.defaults;
    const mediaQueries = parameters.mediaQueries;
    /** @type {DefaultsParams} */
    this.defaults = scopeDefaults
      ? mergeObjects(scopeDefaults, globalDefault)
      : globalDefault;
    /** @type {Document|DOMTarget} */
    this.root = /** @type {Document|DOMTarget} */ parsedRoot
      ? parsedRoot[0]
      : doc;
    /** @type {Array<Function>} */
    this.constructors = [];
    /** @type {Array<Function>} */
    this.revertConstructors = [];
    /** @type {Array<Tickable|Scroller|Draggable|Scope>} */
    this.revertibles = [];
    /** @type {Record<String, Function>} */
    this.methods = {};
    /** @type {Record<String, Boolean>} */
    this.matches = {};
    /** @type {Record<String, MediaQueryList>} */
    this.mediaQueryLists = {};
    if (mediaQueries) {
      for (let mq in mediaQueries) {
        const _mq = win.matchMedia(mediaQueries[mq]);
        this.mediaQueryLists[mq] = _mq;
        _mq.addEventListener("change", this);
      }
    }
  }

  /**
   * @callback ScoppedCallback
   * @param {this} scope
   * @return {any}
   *
   * @param {ScoppedCallback} cb
   * @return {this}
   */
  execute(cb) {
    let activeScope = globals.scope;
    let activeRoot = globals.root;
    let activeDefaults = globals.defaults;
    globals.scope = this;
    globals.root = this.root;
    globals.defaults = this.defaults;
    const mqs = this.mediaQueryLists;
    for (let mq in mqs) this.matches[mq] = mqs[mq].matches;
    cb(this);
    globals.scope = activeScope;
    globals.root = activeRoot;
    globals.defaults = activeDefaults;
    return this;
  }

  /**
   * @return {this}
   */
  refresh() {
    this.execute(() => {
      let i = this.revertibles.length;
      let y = this.revertConstructors.length;
      while (i--) this.revertibles[i].revert();
      while (y--) this.revertConstructors[y](this);
      this.revertibles.length = 0;
      this.revertConstructors.length = 0;
      this.constructors.forEach((constructor) => {
        const revertConstructor = constructor(this);
        if (revertConstructor) {
          this.revertConstructors.push(revertConstructor);
        }
      });
    });
    return this;
  }

  /**
   * @callback contructorCallback
   * @param {Scope} [self]
   *
   * @overload
   * @param {String} a1
   * @param {Function} a2
   * @return {this}
   *
   * @overload
   * @param {contructorCallback} a1
   * @return {this}
   *
   * @param {String|contructorCallback} a1
   * @param {Function} [a2]
   */
  add(a1, a2) {
    if (isFnc(a1)) {
      const constructor = /** @type {contructorCallback} */ a1;
      this.constructors.push(constructor);
      this.execute(() => {
        const revertConstructor = constructor(this);
        if (revertConstructor) {
          this.revertConstructors.push(revertConstructor);
        }
      });
    } else {
      this.methods[/** @type {String} */ a1] = (/** @type {any} */ ...args) => {
        this.execute(() => a2(...args));
      };
    }
    return this;
  }

  /**
   * @param {Event} e
   */
  handleEvent(e) {
    switch (e.type) {
      case "change":
        this.refresh();
        break;
    }
  }

  revert() {
    const revertibles = this.revertibles;
    const reverts = this.revertConstructors;
    const mqs = this.mediaQueryLists;
    let i = revertibles.length;
    let y = reverts.length;
    while (i--) revertibles[i].revert();
    while (y--) reverts[y](this);
    for (let mq in mqs) mqs[mq].removeEventListener("change", this);
    revertibles.length = 0;
    reverts.length = 0;
    this.constructors.length = 0;
    this.matches = {};
    this.methods = {};
    this.mediaQueryLists = {};
  }
}
