(function (window) {
	"use strict";
	function CTA(options) {
		/**
		 * @type {sessionStorage}
		 */
		this.ss = sessionStorage;
		/**
		 * @type String
		 */
		this.prefix = "cta_cache_";
	}
	CTA.prototype.setItem = function (key, value) {
		return this.ss.setItem(this.prefix + key, value);
	};
	CTA.prototype.hasItem = function (key) {
		return this.ss.getItem(this.prefix + key) !== null;
	};
	CTA.prototype.getItem = function (key) {
		return this.ss.getItem(this.prefix + key);
	};
	CTA.prototype.require = function (obj) {
		if (obj.url === undefined) {
			throw new Error("Url required!");
		}
		if (obj.key === undefined) {
			obj.key = obj.url;
		}
		if (this.hasItem(obj.key)) {
			return this.getItem(obj.key);
		}
	};
	window.CTA = CTA();
})(window);
