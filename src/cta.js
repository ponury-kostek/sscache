(function (win) {
	var doc = win.document;
	"use strict";

	/**
	 * Catch them all
	 */
	function CTA(options) {
		console.log('CTA');
		/**
		 * @type {sessionStorage}
		 */
		this.ss = sessionStorage;
		/**
		 * @type String
		 */
		this.prefix = "cta_cache_";
		console.log(this);
	}

	/**
	 * Stores item in sessionStorage
	 */
	CTA.prototype.setItem = function setItem(key, value) {
		console.log('setItem');
		return this.ss.setItem(this.prefix + key, value);
	};

	/**
	 * Checks that item exists in sessionStorage
	 */
	CTA.prototype.hasItem = function hasItem(key) {
		console.log('hasItem');
		return (this.ss.getItem(this.prefix + key) !== null);
	};

	/**
	 * Gets item from sessionStorage
	 */
	CTA.prototype.getItem = function getItem(key) {
		console.log('getItem');
		return JSON.parse(this.ss.getItem(this.prefix + key));
	};

	/**
	 * Insert a resource into document
	 */
	CTA.prototype.inject = function inject(key, type, data, attributes) {
		key = key.replace('.', '-');
		console.log('inject');
		console.log('#' + this.prefix + key);
		console.log(doc.querySelector('#' + this.prefix + key));
		if (!doc.querySelector('#' + this.prefix + key)) {
			var elm = null;
			switch (type) {
				case 'js':
					elm = doc.createElement('script');
					elm.setAttribute('type', 'text/javascript');
					break;
				case 'css':
					elm = doc.createElement('style');
					elm.setAttribute('type', 'text/css');
					break;
				default:
					break;
			}
			if (elm !== null) {
				elm.setAttribute('id', this.prefix + key);
				if (attributes) {
					attributes.forEach(function (k, v) {
						elm.setAttribute(k, v);
					});
				}
				console.log("responseDATA", data);
				elm.textContent = data;
				doc.querySelector('body').appendChild(elm);
			}
		}
	};

	/**
	 * Tries to load resource
	 */
	CTA.prototype.require = function require(obj) {
		console.log('require');
		if (obj.url === undefined) {
			throw new Error("Url required!");
		}
		if (obj.key === undefined) {
			obj.key = obj.url;
		}
		obj.key = obj.key.replace('.', '-');
		if (this.hasItem(obj.key)) {
			var cacheData = this.getItem(obj.key);
			this.inject(cacheData.key, cacheData.type, cacheData.data, cacheData.attributes || []);
		} else {
			var that = this;
			$.ajax(obj.url, { processData: false, dataType: "text" }).done(function (data, textStatus, jqXHR) {
				console.log("response", data);
				obj.data = data;
				if (textStatus.match(/200/)) {
					//console.log();
					if (!obj.type) {
						jqXHR.getAllResponseHeaders().split("\r\n").forEach(function (v) {
							var match = v.match(/^content\-type: (.*)/i);
							//console.log(match);
							if (match) {
								obj.type = match[1];
							}
						});
					}
					that.ss.setItem(that.prefix + obj.key, JSON.stringify(obj));
					that.inject(obj.key, obj.type, obj.data, obj.attributes || []);
				}
			});
		}
	};
	win.CTA = new CTA();
})(window);
