import Vue from 'vue';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var vueDebounce_min = createCommonjsModule(function (module, exports) {
!function(e,t){t(exports);}(commonjsGlobal,(function(e){function t(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function n(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==n)return;var r,i,o=[],u=!0,a=!1;try{for(n=n.call(e);!(u=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);u=!0);}catch(e){a=!0,i=e;}finally{try{u||null==n.return||n.return();}finally{if(a)throw i}}return o}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return r(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t){var r,i,o,u,a=null,l="number"==typeof t?t:(r=n(String(t).split(/(ms|s)/i),2),i=r[0],o=r[1],u=void 0===o?"ms":o,Number(i)*{ms:1,s:1e3}[u]),c=function(){for(var t=this,n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];var o=function(){a=null,e.apply(t,r);};clearTimeout(a),(a=setTimeout(o,l))||e.apply(this,r);};return c.cancel=function(){clearTimeout(a),a=null;},c}function o(e){return e.map((function(e){return e.toLowerCase()}))}function u(e,t){var n=(e.getNamedItem("debounce-events")||{}).value,r=void 0!==n&&n;return o(r?r.split(","):function(e){return Array.isArray(e)?e:null==e?[]:[e]}(t))}function a(e){return ""===e}function l(e,t){return "Enter"===e&&(!t.lock||t.unlock)}function c(e,t,n){return a(e)&&n.fireonempty&&("Enter"===t||" "===t)}function f(e){var t=n(String(e).split("."),1)[0];return Number(t)>=3?"mounted":"bind"}function s(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"2",n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.lock,o=void 0!==r&&r,s=n.listenTo,d=void 0===s?"keyup":s,v=n.defaultTime,m=void 0===v?"300ms":v,y=n.fireOnEmpty,p=void 0!==y&&y,b=n.cancelOnEmpty,g=void 0!==b&&b,h=n.trim,A=void 0!==h&&h;return t({},f(e),(function(e,t){var n=t.value,r=t.arg,f=void 0===r?m:r,s=t.modifiers,v=Object.assign({lock:o,trim:A,fireonempty:p,cancelonempty:g},s),y=u(e.attributes,d),b=i((function(e){n(e.target.value,e);}),f);function h(e){var t=v.trim?e.target.value.trim():e.target.value;a(t)&&v.cancelonempty?b.cancel():l(e.key,v)||c(t,e.key,v)?(b.cancel(),n(e.target.value,e)):b(e);}y.forEach((function(t){e.addEventListener(t,h);}));}))}s();var d={install:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.directive("debounce",s(e.version,t));}};e.debounce=i,e.default=d,e.getDirective=s,Object.defineProperty(e,"__esModule",{value:!0});}));
});

Vue.use(vueDebounce_min);
var script = {
  data() {
    return {
      query: ''
    };
  },

  directives: {
    // Please see above for arguments you can pass to this function
    debounce: vueDebounce_min.getDirective()
  },
  emits: ['receiveResponse'],
  props: ['form', 'options'],
  methods: {
    validateData: function (form) {
      //console.log(this.options);
      const emptyInputError = this.options.emptyInputError || false;
      form.app_id = this.options.app_id;
      let mandatory_fields = ['collection', 'page', 'count', 'app_id'];

      if (emptyInputError) {
        mandatory_fields.push('query');
      }

      let errors = [];
      let is_valid = true;
      mandatory_fields.forEach(function (field) {
        if (!form[field]) {
          errors.push(field);
          is_valid = false;
        }
      });
      return {
        status: is_valid,
        fields: errors.join(', ')
      };
    },

    async onSearch() {
      this.form.query = this.query;
      let validate = this.validateData(this.form);

      if (!validate.status) {
        this.$emit('receiveResponse', {
          success: false,
          message: 'The following values are mandatory :' + validate.fields
        });
        return;
      } //Preparing requests & calculating response time


      try {
        const searchOpts = this.getOptions();
        const start = Date.now(); //start time

        let searchResp = await fetch(searchOpts.url, searchOpts.options).then(response => {
          return response.json();
        }).then(data => {
          //search request
          const totalTimeTaken = Date.now() - start; //end time
          // Work with JSON data here

          console.log("Search Response emitted"); ///console.log(data.query);

          this.$emit('receiveResponse', data); //emit for response handling
          //catching response and working on it

          if (data.success) {
            // sending data to the kartmax search analytics
            //console.log("Received response time",data.responseTime);
            //console.log("Computed response time", totalTimeTaken);
            data.responseTime = totalTimeTaken;
            this.saveAnalytics(data);
          } else {
            console.error("No response received from search service");
          }
        }).catch(err => {
          console.error("Something went wrong while making the fetch data call.");
          console.log(err);
        });
      } catch (e) {
        console.error("Something went wrong while making the search call.");
        console.log(e.stackTrace);
      }
    },

    saveAnalytics(response) {
      let searchAnalytics = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryData: response.query,
          responseData: {
            responseTime: response.responseTime,
            totalHits: response.totalHits,
            uniqueId: response.uniqueId
          },
          collection: this.form.collection
        })
      };

      if (response.success) {
        fetch(`https://search.kartmax.in/api/` + this.options.app_id + `/search/v1/analytics-record-plp`, searchAnalytics).then(res => {
          console.log('%c Kartmax Search Analytics was saved', 'background: #222; color: #bada55');
        }).catch(err => {
          console.error("Kartmax Search Analytics not saved");
        });
      } else {
        console.error("Kartmax Search Analytics not saved");
      }
    },

    getOptions() {
      return {
        url: `https://ai.kartmax.in/api/` + this.options.app_id + `/search-get/v1/plp-special?` + new URLSearchParams(this.form).toString(),
        options: {
          headers: {
            "Content-Type": "application/json"
          },
          method: "GET"
        }
      };
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.query,
      expression: "query"
    }, {
      name: "debounce",
      rawName: "v-debounce",
      value: _vm.onSearch,
      expression: "onSearch"
    }],
    attrs: {
      "type": "text",
      "placeholder": "Search"
    },
    domProps: {
      "value": _vm.query
    },
    on: {
      "input": function ($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.query = $event.target.value;
      }
    }
  });
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = undefined;
/* scoped */

const __vue_scope_id__ = undefined;
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

var component = __vue_component__;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = component; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('KartmaxSearchClient', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
