/*
XSLTForms 1.1 (649)
XForms 1.1+ with XPath 1.0+ Engine

Copyright (C) 2018 agenceXML - Alain Couthures
Contact at : xsltforms@agencexml.com

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

"use strict";
if (XsltForms_domEngine === "") {
	(function(Fleur) {
	Fleur.Node = function() {};
	Fleur.Node.ELEMENT_NODE = 1;
	Fleur.Node.ATTRIBUTE_NODE = 2;
	Fleur.Node.TEXT_NODE = 3;
	Fleur.Node.CDATA_NODE = 4;
	Fleur.Node.ENTITY_REFERENCE_NODE = 5;
	Fleur.Node.ENTITY_NODE = 6;
	Fleur.Node.PROCESSING_INSTRUCTION_NODE = 7;
	Fleur.Node.COMMENT_NODE = 8;
	Fleur.Node.DOCUMENT_NODE = 9;
	Fleur.Node.DOCUMENT_TYPE_NODE = 10;
	Fleur.Node.DOCUMENT_FRAGMENT_NODE = 11;
	Fleur.Node.NOTATION_NODE = 12;
	Fleur.Node.NAMESPACE_NODE = 129;
	Fleur.Node.ATOMIC_NODE = Fleur.Node.TEXT_NODE;
	Fleur.Node.SEQUENCE_NODE = 130;
	Fleur.Node.ARRAY_NODE = 131;
	Fleur.Node.MAP_NODE = 132;
	Fleur.Node.ENTRY_NODE = 133;
	Fleur.Serializer = function() {};
	Fleur.Serializer.escapeXML = function(s) {
		return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	};
	Fleur.Serializer.prototype._serializeXMLToString = function(node, indent, offset, cdataSectionElements) {
		var s, i, l;
		switch (node.nodeType) {
			case Fleur.Node.ELEMENT_NODE:
				s = (indent ? offset + "\x3C" : "\x3C") + node.nodeName;
				if (indent) {
					var names = [];
					for (i = 0, l = node.attributes.length; i < l; i++) {
						names.push(node.attributes[i].nodeName);
					}
					names.sort();
					for (i = 0, l = names.length; i < l; i++) {
						s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i])).replace('"', "&quot;") + "\"";
					}
				} else {
					for (i = 0, l = node.attributes.length; i < l; i++) {
						s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue).replace('"', "&quot;") + "\"";
					}
				}
				if (node.childNodes.length === 0) {
					return s + (indent ? "/\x3E\n" : "/\x3E");
				}
				s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? "\x3E\n" : "\x3E";
				if (cdataSectionElements.indexOf(" " + node.nodeName + " ") !== -1) {
					for (i = 0, l = node.childNodes.length; i < l; i++) {
						if (node.childNodes[i].nodeType === Fleur.Node.TEXT_NODE) {
							s += "\x3C![CDATA[";
							s += node.childNodes[i].data;
							s += "]]\x3E";
						} else {
							s += this._serializeXMLToString(node.childNodes[i], indent, offset + "  ", cdataSectionElements);
						}
					}
				} else {
					for (i = 0, l = node.childNodes.length; i < l; i++) {
						s += this._serializeXMLToString(node.childNodes[i], indent, offset + "  ", cdataSectionElements);
					}
				}
				return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "\x3C/" : "\x3C/") + node.nodeName + (indent ? "\x3E\n" : "\x3E");
			case Fleur.Node.TEXT_NODE:
				if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
					return "";
				}
				return Fleur.Serializer.escapeXML(node.data);
			case Fleur.Node.CDATA_NODE:
				return (indent ? offset + "\x3C![CDATA[" : "\x3C![CDATA[") + node.data + (indent ? "]]\x3E\n" : "]]\x3E");
			case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
				return (indent ? offset + "\x3C?" : "\x3C?") + node.nodeName + " " + node.nodeValue + (indent ? "?\x3E\n" : "?\x3E");
			case Fleur.Node.COMMENT_NODE:
				return (indent ? offset + "\x3C!--" : "\x3C!--") + node.data + (indent ? "--\x3E\n" : "--\x3E");
			case Fleur.Node.DOCUMENT_NODE:
				s = '\x3C?xml version="1.0" encoding="UTF-8"?\x3E\r\n';
				for (i = 0, l = node.childNodes.length; i < l; i++) {
					s += this._serializeXMLToString(node.childNodes[i], indent, offset, cdataSectionElements);
				}
				return s;
		}
	};
	Fleur.Serializer.prototype.serializeToString = function(node, mediatype, indent, cdataSectionElements) {
		var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, ser;
		while (i < l) {
			param = paramreg.exec(media[i]);
			config[param[1]] = param[2];
			i++;
		}
		switch (media[0].replace(/^\s+|\s+$/gm,'')) {
			case "text/xml":
			case "application/xml":
				ser = this._serializeXMLToString(node, indent, "", " " + cdataSectionElements + " ");
				if (indent && ser.charAt(ser.length - 1) === "\n") {
					ser = ser.substr(0, ser.length - 1);
				}
				return ser;
		}
	};
	Fleur.XMLSerializer = function() {};
	Fleur.XMLSerializer.prototype = new Fleur.Serializer();
	Fleur.XMLSerializer.prototype.serializeToString = function(node, indent, cdataSectionElements) {
		return Fleur.Serializer.prototype.serializeToString.call(this, node, "application/xml", indent, cdataSectionElements);
	};
	})(typeof exports === 'undefined'? this.Fleur = {}: exports);
}
var XsltForms_xpathAxis = {
	ANCESTOR_OR_SELF: 'ancestor-or-self',
	ANCESTOR: 'ancestor',
	ATTRIBUTE: 'attribute',
	CHILD: 'child',
	DESCENDANT_OR_SELF: 'descendant-or-self',
	DESCENDANT: 'descendant',
	ENTRY: 'entry',
	FOLLOWING_SIBLING: 'following-sibling',
	FOLLOWING: 'following',
	NAMESPACE: 'namespace',
	PARENT: 'parent',
	PRECEDING_SIBLING: 'preceding-sibling',
	PRECEDING: 'preceding',
	SELF: 'self'
};
var XsltForms_context;
var XsltForms_globals = {
	fileVersion: "1.1",
	fileVersionNumber: 649,
	language: "navigator",
	debugMode: false,
	debugButtons: [
		{label: "Profiler", name: "profiler"}
		,{label: "Trace Log", name: "tracelog"}
	],
	cont : 0,
	ready : false,
	body : null,
	models : [],
	changes : [],
	newChanges : [],
	building : false,
	posibleBlur : false,
	bindErrMsgs : [],		// binding-error messages gathered during refreshing
	transformtime: "unknown",
	htmltime: 0,
	creatingtime: 0,
	inittime: 0,
	refreshtime: 0,
	refreshcount: 0,
	validationError: true,
	counters: {
		component: 0,
		group: 0,
		input: 0,
		item: 0,
		itemset: 0,
		label: 0,
		output: 0,
		repeat: 0,
		select: 0,
		trigger: 0,
		upload: 0,
		xvar: 0
	},
	nbsubforms: 0,
	componentLoads: [],
	jslibraries: {},
	htmlversion: "4",
	debugging : function() {
		if (document.documentElement.childNodes[0].nodeType === 8 || (XsltForms_browser.isIE && document.documentElement.childNodes[0].childNodes[1] && document.documentElement.childNodes[0].childNodes[1].nodeType === 8)) {
			var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
			if (this.debugMode) {
				var dbg = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "div") : document.createElement("div");
				dbg.setAttribute("style", "border-bottom: thin solid #888888;");
				dbg.setAttribute("id", "xsltforms_debug");
				var img = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img.setAttribute("src", XsltForms_browser.imgROOT+"magnify.png");
				img.setAttribute("style", "vertical-align:middle;border:0;");
				dbg.appendChild(img);
				var spn = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn.setAttribute("style", "font-size:16pt");
				var txt = document.createTextNode(" Debug Mode");
				spn.appendChild(txt);
				dbg.appendChild(spn);
				var spn2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn2.setAttribute("style", "font-size:11pt");
				var txt2 = document.createTextNode(" ("+this.fileVersion+") \xA0\xA0\xA0");
				spn2.appendChild(txt2);
				dbg.appendChild(spn2);
				var a = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
				a.setAttribute("href", "http://www.w3.org/TR/xforms11/");
				a.setAttribute("style", "text-decoration:none;");
				var img2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img2.setAttribute("src", XsltForms_browser.imgROOT+"valid-xforms11.png");
				img2.setAttribute("style", "vertical-align:middle;border:0;");
				a.appendChild(img2);
				dbg.appendChild(a);
				var a2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
				a2.setAttribute("href", "http://www.agencexml.com/xsltforms");
				a2.setAttribute("style", "text-decoration:none;");
				var img3 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img3.setAttribute("src", XsltForms_browser.imgROOT+"poweredbyXSLTForms.png");
				img3.setAttribute("style", "vertical-align:middle;border:0;");
				a2.appendChild(img3);
				dbg.appendChild(a2);
				var spn3 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn3.setAttribute("style", "font-size:11pt");
				var txt3 = document.createTextNode(" Press ");
				spn3.appendChild(txt3);
				dbg.appendChild(spn3);
				var a3 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
				a3.setAttribute("onClick", "XsltForms_globals.debugMode=false;XsltForms_globals.debugging();return false;");
				a3.setAttribute("style", "text-decoration:none;");
				a3.setAttribute("href", "#");
				var img4 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
				img4.setAttribute("src", XsltForms_browser.imgROOT+"F1.png");
				img4.setAttribute("style", "vertical-align:middle;border:0;");
				a3.appendChild(img4);
				dbg.appendChild(a3);
				var spn4 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
				spn4.setAttribute("style", "font-size:11pt");
				var txt4 = document.createTextNode(" to toggle mode ");
				spn4.appendChild(txt4);
				dbg.appendChild(spn4);
				var br = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "br") : document.createElement("br");
				dbg.appendChild(br);
				var txt5 = document.createTextNode(" \xA0\xA0\xA0\xA0\xA0\xA0");
				dbg.appendChild(txt5);
				for (var i = 0, len = XsltForms_globals.debugButtons.length; i < len; i++) {
					if (XsltForms_globals.debugButtons[i].name) {
						var btn = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "button") : document.createElement("button");
						btn.setAttribute("type", "button");
						btn.setAttribute("onClick", "XsltForms_globals.opentab('" + XsltForms_globals.debugButtons[i].name + "');");
						var txt6 = document.createTextNode(" "+XsltForms_globals.debugButtons[i].label+" ");
						btn.appendChild(txt6);
						dbg.appendChild(btn);
					} else {
						var a4 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "a") : document.createElement("a");
						a4.setAttribute("href", "http://www.agencexml.com/xsltforms");
						var txt7 = document.createTextNode(" Debugging extensions can be downloaded! ");
						a4.appendChild(txt7);
						dbg.appendChild(a4);
						break;
					}
				}
				var br2 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "br") : document.createElement("br");
				dbg.appendChild(br2);
				var ifr = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "iframe") : document.createElement("iframe");
				ifr.setAttribute("src", "http://www.agencexml.com/direct/banner.htm");
				ifr.setAttribute("style", "width:100%;height:90px;border:none;margin:0;");
				ifr.setAttribute("frameborder", "0");
				var ids_seen = {};
				var nodes6 = document.getElementsByTagName('*');
				for (var i6 = 0, l6 = nodes6.length; i6 < l6; i6++) {
					var node6 = nodes6[i6];
					if (node6.id) {
						var id6 = node6.id;
						ids_seen[id6] = ids_seen[id6] ? ids_seen[id6]+1 : 1;
					}
				}
				var s6 = "";
				for (var id6b in ids_seen) {
					if (ids_seen[id6b] > 1) {
						s6 += id6b + " ";
					}
				}
				if (s6 !== "") {
					var txt6b = document.createTextNode("WARNING: Duplicate ids: " + s6);
					var spn6 = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
					spn6.setAttribute("style", "color:red; font-size: 22pt");
					spn6.appendChild(txt6b);
					dbg.appendChild(spn6);
				}
				dbg.appendChild(ifr);
				body.insertBefore(dbg, body.firstChild);
				if (!document.getElementById("xsltforms_console")) {
					var conselt = document.createElement("div");
					conselt.setAttribute("id", "xsltforms_console");
					document.getElementsByTagName("body")[0].appendChild(conselt);
				}
				document.getElementById("xsltforms_console").style.display = "block";
			} else {
				body.removeChild(document.getElementById("xsltforms_debug"));
				document.getElementById("xsltforms_console").style.display = "none";
			}
		}
	},
	xmlrequest : function(method, resource, ser) {
		if (typeof method !== "string") {
			return '<error xmlns="">Invalid method "'+method+'"</error>';
		}
		method = method.toLowerCase();
		var instance, modid;
		switch (method) {
			case "get":
				switch (resource) {
					case "xsltforms-profiler":
						return XsltForms_globals.profiling_data();
					case "xsltforms-tracelog":
						try  {
							return XsltForms_browser.saveDoc(XsltForms_browser.debugConsole.doc_, "application/xml", true);
						} catch (e) {
							XsltForms_browser.debugConsole.write("ERROR: Could not open xsltforms-tracelog " + e.message);
							return '<error xmlns="">Could not open xsltforms-tracelog "'+e.message+'"</error>';
						}
						break;
					default:
						var slash = resource.indexOf("/");
						if (slash === -1 ) {
							instance = document.getElementById(resource);
							if (!instance) {
								return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
							}
							return XsltForms_browser.saveDoc(instance.xfElement.doc, "application/xml", true);
						}
						var filename = resource.substr(slash+1);
						instance = document.getElementById(resource.substr(0, slash));
						if (!instance) {
							return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
						}
						var f = instance.xfElement.archive[filename];
						if (!f) {
							return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
						}
						if (!f.doc) {
							f.doc = XsltForms_browser.createXMLDocument("<dummy/>");
							modid = XsltForms_browser.getDocMeta(instance.xfElement.doc, "model");
							XsltForms_browser.loadDoc(f.doc, XsltForms_browser.utf8decode(zip_inflate(f.compressedFileData)));
							XsltForms_browser.setDocMeta(f.doc, "instance", idRef);
							XsltForms_browser.setDocMeta(f.doc, "model", modid);
						}
						return XsltForms_browser.saveDoc(f.doc, "application/xml", true);
				}
			case "put":
				instance = document.getElementById(resource);
				if (!instance) {
					return '<error xmlns="">Unknown resource "'+resource+'" for method "'+method+'"</error>';
				}
				instance.xfElement.setDoc(ser, false, true);
				modid = XsltForms_browser.getDocMeta(instance.xfElement.doc, "model");
				XsltForms_globals.addChange(modid);
				XsltForms_globals.closeChanges();
				return '<ok xmlns=""/>';
			default:
				return '<error xmlns="">Unknown method "'+method+'"</error>';
		}
	},
	countdesc : function(n) {
		var r = 0;
		if (n.attributes) {
			r = n.attributes.length;
		}
		if (n.childNodes) {
			r += n.childNodes.length;
			for (var i = 0, l = n.childNodes.length; i < l; i++) {
				r += XsltForms_globals.countdesc(n.childNodes[i]);
			}
		}
		return r;
	},
	profiling_data : function() {
		var s = '<xsltforms:dump xmlns:xsltforms="http://www.agencexml.com/xsltforms">';
		s += '<xsltforms:date>' + XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", true) + '</xsltforms:date>';
		s += '<xsltforms:location>' + XsltForms_browser.escape(window.location.href) + '</xsltforms:location>';
		s += '<xsltforms:appcodename>' + navigator.appCodeName + '</xsltforms:appcodename>';
		s += '<xsltforms:appname>' + navigator.appName + '</xsltforms:appname>';
		s += '<xsltforms:appversion>' + navigator.appVersion + '</xsltforms:appversion>';
		s += '<xsltforms:platform>' + navigator.platform + '</xsltforms:platform>';
		s += '<xsltforms:useragent>' + navigator.userAgent + '</xsltforms:useragent>';
		s += '<xsltforms:xsltengine>' + this.xsltEngine + '</xsltforms:xsltengine>';
		var xsltsrc = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt">';
		xsltsrc += '	<xsl:output method="xml"/>';
		xsltsrc += '	<xsl:template match="/">';
		xsltsrc += '		<xsl:variable name="version">';
		xsltsrc += '			<xsl:if test="system-property(\'xsl:vendor\')=\'Microsoft\'">';
		xsltsrc += '				<xsl:value-of select="system-property(\'msxsl:version\')"/>';
		xsltsrc += '			</xsl:if>';
		xsltsrc += '		</xsl:variable>';
		xsltsrc += '		<properties><xsl:value-of select="concat(\'|\',system-property(\'xsl:vendor\'),\' \',system-property(\'xsl:vendor-url\'),\' \',$version,\'|\')"/></properties>';
		xsltsrc += '	</xsl:template>';
		xsltsrc += '</xsl:stylesheet>';
		var res = XsltForms_browser.transformText("<dummy/>", xsltsrc, true);
		var spres = res.split("|");
		s += '<xsltforms:xsltengine2>' + spres[1] + '</xsltforms:xsltengine2>';
		s += '<xsltforms:version>' + this.fileVersion + '</xsltforms:version>';
		s += '<xsltforms:instances>';
		var pos = 0;
		for (var m = 0, mlen = XsltForms_globals.models.length; m < mlen; m++) {
			if (XsltForms_globals.models[m].element.id !== XsltForms_browser.idPf + "model-config") {
				for (var id in XsltForms_globals.models[m].instances) {
					if (XsltForms_globals.models[m].instances.hasOwnProperty(id)) {
						var count = 1 + XsltForms_globals.countdesc(XsltForms_globals.models[m].instances[id].doc);
						s += '<xsltforms:instance id="' + id + '">' + count + '</xsltforms:instance>';
						if (XsltForms_globals.models[m].instances[id].archive) {
							for (var fn in XsltForms_globals.models[m].instances[id].archive) {
								if (XsltForms_globals.models[m].instances[id].archive.hasOwnProperty(fn)) {
									if (!XsltForms_globals.models[m].instances[id].archive[fn].doc) {
										XsltForms_globals.models[m].instances[id].archive[fn].doc = XsltForms_browser.createXMLDocument("<dummy/>");
										XsltForms_browser.loadDoc(XsltForms_globals.models[m].instances[id].archive[fn].doc, XsltForms_browser.utf8decode(zip_inflate(XsltForms_globals.models[m].instances[id].archive[fn].compressedFileData)));
										XsltForms_browser.setDocMeta(XsltForms_globals.models[m].instances[id].archive[fn].doc, "instance", id);
										XsltForms_browser.setDocMeta(XsltForms_globals.models[m].instances[id].archive[fn].doc, "model", m);
									}
									count = 1 + XsltForms_globals.countdesc(XsltForms_globals.models[m].instances[id].archive[fn].doc);
									s += '<xsltforms:instance id="' + id + '/' + fn + '">' + count + '</xsltforms:instance>';
								}
							}
						}
						pos++;
					}
				}
			}
		}
		s += '</xsltforms:instances>';
		s += '<xsltforms:controls>';
		s += '<xsltforms:control type="group">' + XsltForms_globals.counters.group + '</xsltforms:control>';
		s += '<xsltforms:control type="input">' + XsltForms_globals.counters.input + '</xsltforms:control>';
		s += '<xsltforms:control type="item">' + XsltForms_globals.counters.item + '</xsltforms:control>';
		s += '<xsltforms:control type="itemset">' + XsltForms_globals.counters.itemset + '</xsltforms:control>';
		s += '<xsltforms:control type="output">' + XsltForms_globals.counters.output + '</xsltforms:control>';
		s += '<xsltforms:control type="repeat">' + XsltForms_globals.counters.repeat + '</xsltforms:control>';
		s += '<xsltforms:control type="select">' + XsltForms_globals.counters.select + '</xsltforms:control>';
		s += '<xsltforms:control type="trigger">' + XsltForms_globals.counters.trigger + '</xsltforms:control>';
		s += '</xsltforms:controls>';
		var re = /<\w/g;
		var hc = 0;
		var bhtml = document.documentElement.innerHTML;
		while (re.exec(bhtml)) {
			hc++;
		}
		s += '<xsltforms:htmlelements>' + hc + '</xsltforms:htmlelements>';
		s += '<xsltforms:transformtime>' + this.transformtime + '</xsltforms:transformtime>';
		s += '<xsltforms:htmltime>' + this.htmltime + '</xsltforms:htmltime>';
		s += '<xsltforms:creatingtime>' + this.creatingtime + '</xsltforms:creatingtime>';
		s += '<xsltforms:inittime>' + this.inittime + '</xsltforms:inittime>';
		s += '<xsltforms:refreshcount>' + this.refreshcount + '</xsltforms:refreshcount>';
		s += '<xsltforms:refreshtime>' + this.refreshtime + '</xsltforms:refreshtime>';
		var exprtab = [];
		for (var expr in XsltForms_xpath.expressions) {
			if (XsltForms_xpath.expressions.hasOwnProperty(expr) && XsltForms_xpath.expressions[expr]) {
				exprtab[exprtab.length] = {expr: expr, evaltime: XsltForms_xpath.expressions[expr].evaltime};
			}
		}
		exprtab.sort(function(a,b) { return b.evaltime - a.evaltime; });
		var topt = 0;
		s += '<xsltforms:xpaths>';
		if (exprtab.length > 0) {
			for (var i = 0; i < exprtab.length && i < 20; i++) {
				s += '<xsltforms:xpath expr="' + XsltForms_browser.escape(exprtab[i].expr).replace(/\"/g, "&quot;") + '">' + exprtab[i].evaltime + '</xsltforms:xpath>';
				topt += exprtab[i].evaltime;
			}
			if (exprtab.length > 20) {
				var others = 0;
				for (var j = 20; j < exprtab.length; j++) {
					others += exprtab[j].evaltime;
				}
				s += '<xsltforms:others count="' + (exprtab.length - 20) + '">' + others + '</xsltforms:others>';
				topt += others;
			}
			s += '<xsltforms:total>' + topt + '</xsltforms:total>';
		}
		s += '</xsltforms:xpaths>';
		s += '</xsltforms:dump>';
		return s;
	},
	opentab : function(tabname) {
		var req = XsltForms_browser.openRequest("GET", XsltForms_browser.debugROOT + "xsltforms_" + tabname + (XsltForms_browser.debugROOT === XsltForms_browser.ROOT ? ".xhtml" : ".xml"), false);
		if (req.overrideMimeType) {
			req.overrideMimeType("application/xml");
		}
		try {        
			req.send(null);
		} catch(e) {
			alert("File not found: " + XsltForms_browser.debugROOT + "xsltforms_" + tabname + (XsltForms_browser.debugROOT === XsltForms_browser.ROOT ? ".xhtml" : ".xml"));
		}
		if (req.status === 200 || req.status === 0) {
			var s = "";
			try {
				s = XsltForms_browser.transformText(req.responseText, XsltForms_browser.xslROOT + "xsltforms.xsl", false, "xsltforms_debug", "false", "baseuri", XsltForms_browser.xslROOT);
			} catch (e) {
				XsltForms_browser.debugConsole.write("ERROR: Could not get contents of xsltforms_debug - " + e.message);
			}			
			if (s.substring(0, 21) === '<?xml version="1.0"?>') {
				s = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + s.substring(21);
			}
			var prow = window.open("about:blank","_blank");
			prow.document.write(s);
			prow.document.close();
		} else {
			XsltForms_browser.debugConsole.write("File not found (" + req.status + "): " + XsltForms_browser.ROOT + "xsltforms_" + tabname + ".xhtml");
		}
	},
	init: function() {
		XsltForms_browser.setValue(document.getElementById("statusPanel"), XsltForms_browser.i18n.get("status"));
		XsltForms_globals.htmlversion = XsltForms_browser.i18n.get("html");
		var amval = XsltForms_browser.i18n.get("format.time.AM");
		var pmval = XsltForms_browser.i18n.get("format.time.PM");
		var now = !XsltForms_browser.isEdge && !XsltForms_browser.isIE && !XsltForms_browser.isChrome ?
			(new Date()).toLocaleTimeString(navigator.language) :
			(new Date()).toLocaleTimeString();
		XsltForms_globals.AMPM = amval !== "" && (now.indexOf(amval) !== -1 || now.indexOf(pmval) !== -1);
		var b = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
		XsltForms_globals.body = b;
		document.onhelp = function(){return false;};
		window.onhelp = function(){return false;};
		XsltForms_browser.events.attach(document, "keydown", function(evt) {
			if (evt.keyCode === 112) {
				XsltForms_globals.debugMode = !XsltForms_globals.debugMode;
				XsltForms_globals.debugging();
				if (evt.stopPropagation) {
					evt.stopPropagation();
					evt.preventDefault();
				} else {
					evt.cancelBubble = true;
				}
				return false;
			}
		}, false);
		XsltForms_browser.events.attach(b, "click", function(evt) {
			var target = XsltForms_browser.events.getTarget(evt);
			var parentElt = target;
			while (parentElt && parentElt.nodeType === Fleur.Node.ELEMENT_NODE) {
				if (XsltForms_browser.hasClass(parentElt, "xforms-repeat-item")) {
					XsltForms_repeat.selectItem(parentElt);
				}
				parentElt = parentElt.parentNode;
			}
			parentElt = target;
			while (parentElt && parentElt.nodeType === Fleur.Node.ELEMENT_NODE) {
				var xf = parentElt.xfElement;
				if (xf) {
					if(typeof parentElt.node !== "undefined" && parentElt.node && xf.focus && !XsltForms_browser.getBoolMeta(parentElt.node, "readonly")) {
						var tname = target.nodeName.toLowerCase();
						xf.focus(tname === "input" || tname === "textarea", evt);
					}
					if(xf.click && xf.input && !xf.input.disabled) {
						xf.click(target, evt);
						break;
					}
				}
				parentElt = parentElt.parentNode;
			}
		}, false);
		XsltForms_browser.events.onunload = function() {
			XsltForms_globals.close();
		};
		XsltForms_globals.openAction("XsltForms_globals.init");
		XsltForms_xmlevents.dispatchList(XsltForms_globals.models, "xforms-model-construct");
		for (var i = 0, l = XsltForms_globals.componentLoads.length; i < l; i++) {
			eval(XsltForms_globals.componentLoads[i]);
		}
		XsltForms_globals.refresh();
		XsltForms_globals.closeAction("XsltForms_globals.init");
		XsltForms_globals.ready = true;
		XsltForms_browser.dialog.hide("statusPanel", false);
	},
	close : function() {
		if (XsltForms_globals.body) {
			this.openAction("XsltForms_globals.close");
			for (var i = 0, len = XsltForms_listener.destructs.length; i < len; i++) {
				XsltForms_listener.destructs[i].callback({target: XsltForms_listener.destructs[i].observer});
			}
			this.closeAction("XsltForms_globals.close");
			XsltForms_idManager.clear();
			this.defaultModel = null;
			this.changes = [];
			this.models = [];
			this.body = null;
			this.cont = 0;
			this.dispose(document.documentElement);
			XsltForms_listener.destructs = [];
			XsltForms_schema.all = {};
			XsltForms_typeDefs.initAll();
			XsltForms_calendar.INSTANCE = null;
			this.ready = false;
			this.building = false;
			XsltForms_globals.posibleBlur = false;
		}
	},
	openActions : [],
	openAction : function(action) {
		this.openActions.push(action);
		if (this.cont++ === 0) {
			XsltForms_browser.debugConsole.clear();
		}
	},
	closeAction : function(action) {
		var lastaction = this.openActions.pop();
		if (lastaction !== action) {
		}
		if (this.cont === 1) {
			this.closeChanges();
		}
		this.cont--;
	},
	closeChanges : function(force) {
		var changes = this.changes;
		for (var i = 0, len = changes.length; i < len; i++) {
			var change = changes[i];
			if (change && change.instances) {//Model
				if (change.rebuilded) {
					XsltForms_xmlevents.dispatch(change, "xforms-rebuild");
				} else {
					XsltForms_xmlevents.dispatch(change, "xforms-recalculate");
				}
			}
		}
		if (changes.length > 0 || force) {
			this.refresh();
			if (this.changes.length > 0) {
				this.closeChanges();
			}
		}
	},
	error : function(element, evt, message, causeMessage) {
		XsltForms_browser.dialog.hide("statusPanel", false);
		XsltForms_browser.setValue(document.getElementById("statusPanel"), message);
		XsltForms_browser.dialog.show("statusPanel", null, false);
		if (element) {
			XsltForms_xmlevents.dispatch(element, evt);
		}
		if (causeMessage) {
			message += " : " + causeMessage;
		}
		XsltForms_browser.debugConsole.write("Error: " + message);
		throw evt;        
	},
	refresh : function() {
		var d1 = new Date();
		this.building = true;
		this.build(this.body, (this.defaultModel.getInstanceDocument() ? this.defaultModel.getInstanceDocument().documentElement : null), true);
		if (this.newChanges.length > 0) {
			this.changes = this.newChanges;
			this.newChanges = [];
		} else {
			this.changes.length = 0;
		}
		for (var i = 0, len = this.models.length; i < len; i++) {
			var model = this.models[i];
			if (model.newNodesChanged.length > 0 || model.newRebuilded) {
				model.nodesChanged = model.newNodesChanged;
				model.newNodesChanged = [];
				model.rebuilded = model.newRebuilded;
				model.newRebuilded = false;
			} else {
				model.nodesChanged.length = 0;
				model.rebuilded = false;
			}
		}
		this.building = false;
		if (this.bindErrMsgs.length) {
			this.error(this.defaultModel, "xforms-binding-exception", "Binding Errors: \n" + this.bindErrMsgs.join("\n  "));
			this.bindErrMsgs = [];
		}
		var d2 = new Date();
		this.refreshtime += d2 - d1;
		this.refreshcount++;
	},
	build : function(element, ctx, selected, varresolver) {
		if (element.nodeType !== Fleur.Node.ELEMENT_NODE || element.id === "xsltforms_console" || element.hasXFElement === false) {
			return {ctx: ctx, hasXFElement: false};
		}
		var xf = element.xfElement;
		var hasXFElement = Boolean(xf);
		if (element.getAttribute("mixedrepeat") === "true") {
			selected = element.selected;
		}
		if (xf) {
			if (xf instanceof Array) {
				for (var ixf = 0, lenxf = xf.length; ixf < lenxf; ixf++) {
					xf[ixf].build(ctx, varresolver);
				}
			} else {
				xf.build(ctx, varresolver);
				if (xf.isRepeat) {
					xf.refresh(selected);
				}
			}
		}
		var newctx = element.node || ctx;
		var childs = element.children || element.childNodes;
		var sel = element.selected;
		if (typeof sel !== "undefined") {
			selected = sel;
		}
		if (!xf || (xf instanceof Array) || !xf.isRepeat || xf.nodes.length > 0) {
			var nbsiblings = 1, isiblings = 1;
			var nodes = [], nbnodes = 0, inodes = 0;
			for (var i = 0; i < childs.length && this.building; i++) {
				if (childs[i].nodeType !== Fleur.Node.TEXT_NODE) {
					var curctx;
					if (isiblings !== 1) {
						curctx = nodes[inodes];
						isiblings--;
					} else if (nbnodes !== 0) {
						nbnodes--;
						inodes++;
						curctx = nodes[inodes];
						isiblings = nbsiblings;
					} else {
						curctx = newctx;
					}
					if (!childs[i].getAttribute("cloned")) {
						var samechild = childs[i];
						var br = this.build(childs[i], curctx, selected, varresolver);
						if (childs[i] !== samechild) {
							i--;
						} else {
							if (childs[i].xfElement && childs[i].xfElement.nbsiblings && childs[i].xfElement.nbsiblings > 1) {
								nbsiblings = childs[i].xfElement.nbsiblings;
								nodes = childs[i].xfElement.nodes;
								nbnodes = nodes.length;
								inodes = 0;
								isiblings = nbsiblings;
							}
							hasXFElement = br.hasXFElement || hasXFElement;
						}
					}
				}
			}
			element.varScope = null;
		}
		if(this.building) {
			if (xf instanceof Array) {
				for (var ixf2 = 0, lenxf2 = xf.length; ixf2 < lenxf2; ixf2++) {
					if (xf[ixf2] && xf[ixf2].changed) {
						xf[ixf2].refresh(selected);
						xf[ixf2].changed = false;
					}
				}
			} else {
				if (xf && xf.changed) {
					xf.refresh(selected);
					xf.changed = false;
				}
			}
			if (!element.hasXFElement) {
				element.hasXFElement = hasXFElement;
			}
		}
		return {ctx: newctx, hasXFElement: hasXFElement};
	},
	addChange : function(element) {
		var list = this.building? this.newChanges : this.changes;
		if (!XsltForms_browser.inArray(element, list)) {
			list.push(element);
		}
	},
	dispose : function(element) {
		if (element.nodeType !== Fleur.Node.ELEMENT_NODE || element.id === "xsltforms_console") {
			return;
		}
		var xf = element.xfElement;
		if (xf && xf.dispose !== undefined) {
			xf.dispose();
		}
		element.listeners = null;
		element.node = null;
		element.hasXFElement = null;
		var childs = element.childNodes;
		for (var i = 0; i < childs.length; i++) {
			this.dispose(childs[i]);
		}
	},
	blur : function(direct) {
		if ((direct || this.posibleBlur) && this.focus) {
			if (this.focus.element) {
				this.openAction("XsltForms_globals.blur");
				XsltForms_xmlevents.dispatch(this.focus, "DOMFocusOut");
				XsltForms_browser.setClass(this.focus.element, "xforms-focus", false);
				try {
					this.focus.blur();
				} catch (e){
				}
				this.closeAction("XsltForms_globals.blur");
			}
			this.posibleBlur = false;
			this.focus = null;
		}
	},
	add32 : function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		return ((((x >>> 16) + (y >>> 16) + (lsw >>> 16)) & 0xFFFF)<< 16) | (lsw & 0xFFFF);
	},
	str2msg : function(str) {
		var i, msg = {length: str.length, arr: []};
		for(i = 0; i < msg.length; i++){
			msg.arr[i >> 2] |= (str.charCodeAt(i) & 0xFF) << ((3 - i % 4) << 3);
		}
		return msg;
	},
	crypto : function(msg, algo) {
		var res, i, t, add32 = XsltForms_globals.add32;
		var a, b, c, d, e, f, g, h, T, l, bl, W;
		switch (algo) {
			case "SHA-1":
				bl = msg.length * 8;
				msg.arr[bl >> 5] |= 0x80 << (24 - bl % 32);
				msg.arr[((bl + 65 >> 9) << 4) + 15] = bl;
				l = msg.arr.length;
				W = [];
				res = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
				var rotl = function(x, n) {
					return (x <<  n) | (x >>> (32 - n));
				};
				for(i = 0; i < l; i += 16){
					a = res[0];
					b = res[1];
					c = res[2];
					d = res[3];
					e = res[4];
					for(t = 0; t<20; t++){
						T = add32(add32(add32(add32(rotl(a,5),(b & c)^(~b & d)),e),0x5a827999),W[t] = t<16 ? msg.arr[t+i] : rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					for(t = 20; t<40; t++){
						T = add32(add32(add32(add32(rotl(a,5),b^c^d),e),0x6ed9eba1),W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					for(t = 40; t<60; t++){
						T = add32(add32(add32(add32(rotl(a,5),(b & c)^(b & d)^(c & d)),e),0x8f1bbcdc),W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					for(t = 60; t<80; t++){
						T = add32(add32(add32(add32(rotl(a,5),b^c^d),e),0xca62c1d6),W[t] = rotl(W[t-3] ^ W[t-8] ^ W[t-14] ^ W[t-16],1));
						e = d;
						d = c;
						c = rotl(b,30);
						b = a;
						a = T;
					}
					res[0] = add32(a, res[0]);
					res[1] = add32(b, res[1]);
					res[2] = add32(c, res[2]);
					res[3] = add32(d, res[3]);
					res[4] = add32(e, res[4]);
				}
				return {length: 20, arr: res};
			case "MD5":
				var n = msg.length;
				var cmn = function(q, a, b, x, s, t) {
					a = add32(add32(a, q), add32(x, t));
					return add32((a << s) | (a >>> (32 - s)), b);
				};
				var f1 = function(a, b, c, d, x, s, t) {
					return cmn((b & c) | ((~b) & d), a, b, x, s, t);
				};
				var f2 = function(a, b, c, d, x, s, t) {
					return cmn((b & d) | (c & (~d)), a, b, x, s, t);
				};
				var f3 = function(a, b, c, d, x, s, t) {
					return cmn(b ^ c ^ d, a, b, x, s, t);
				};
				var f4 = function(a, b, c, d, x, s, t) {
					return cmn(c ^ (b | (~d)), a, b, x, s, t);
				};
				var cycle = function (w, t) {
					a = w[0];
					b = w[1];
					c = w[2];
					d = w[3];
					a = f1(a, b, c, d, t[0], 7, -680876936);
					d = f1(d, a, b, c, t[1], 12, -389564586);
					c = f1(c, d, a, b, t[2], 17,  606105819);
					b = f1(b, c, d, a, t[3], 22, -1044525330);
					a = f1(a, b, c, d, t[4], 7, -176418897);
					d = f1(d, a, b, c, t[5], 12,  1200080426);
					c = f1(c, d, a, b, t[6], 17, -1473231341);
					b = f1(b, c, d, a, t[7], 22, -45705983);
					a = f1(a, b, c, d, t[8], 7,  1770035416);
					d = f1(d, a, b, c, t[9], 12, -1958414417);
					c = f1(c, d, a, b, t[10], 17, -42063);
					b = f1(b, c, d, a, t[11], 22, -1990404162);
					a = f1(a, b, c, d, t[12], 7,  1804603682);
					d = f1(d, a, b, c, t[13], 12, -40341101);
					c = f1(c, d, a, b, t[14], 17, -1502002290);
					b = f1(b, c, d, a, t[15], 22,  1236535329);
					a = f2(a, b, c, d, t[1], 5, -165796510);
					d = f2(d, a, b, c, t[6], 9, -1069501632);
					c = f2(c, d, a, b, t[11], 14,  643717713);
					b = f2(b, c, d, a, t[0], 20, -373897302);
					a = f2(a, b, c, d, t[5], 5, -701558691);
					d = f2(d, a, b, c, t[10], 9,  38016083);
					c = f2(c, d, a, b, t[15], 14, -660478335);
					b = f2(b, c, d, a, t[4], 20, -405537848);
					a = f2(a, b, c, d, t[9], 5,  568446438);
					d = f2(d, a, b, c, t[14], 9, -1019803690);
					c = f2(c, d, a, b, t[3], 14, -187363961);
					b = f2(b, c, d, a, t[8], 20,  1163531501);
					a = f2(a, b, c, d, t[13], 5, -1444681467);
					d = f2(d, a, b, c, t[2], 9, -51403784);
					c = f2(c, d, a, b, t[7], 14,  1735328473);
					b = f2(b, c, d, a, t[12], 20, -1926607734);
					a = f3(a, b, c, d, t[5], 4, -378558);
					d = f3(d, a, b, c, t[8], 11, -2022574463);
					c = f3(c, d, a, b, t[11], 16,  1839030562);
					b = f3(b, c, d, a, t[14], 23, -35309556);
					a = f3(a, b, c, d, t[1], 4, -1530992060);
					d = f3(d, a, b, c, t[4], 11,  1272893353);
					c = f3(c, d, a, b, t[7], 16, -155497632);
					b = f3(b, c, d, a, t[10], 23, -1094730640);
					a = f3(a, b, c, d, t[13], 4,  681279174);
					d = f3(d, a, b, c, t[0], 11, -358537222);
					c = f3(c, d, a, b, t[3], 16, -722521979);
					b = f3(b, c, d, a, t[6], 23,  76029189);
					a = f3(a, b, c, d, t[9], 4, -640364487);
					d = f3(d, a, b, c, t[12], 11, -421815835);
					c = f3(c, d, a, b, t[15], 16,  530742520);
					b = f3(b, c, d, a, t[2], 23, -995338651);
					a = f4(a, b, c, d, t[0], 6, -198630844);
					d = f4(d, a, b, c, t[7], 10,  1126891415);
					c = f4(c, d, a, b, t[14], 15, -1416354905);
					b = f4(b, c, d, a, t[5], 21, -57434055);
					a = f4(a, b, c, d, t[12], 6,  1700485571);
					d = f4(d, a, b, c, t[3], 10, -1894986606);
					c = f4(c, d, a, b, t[10], 15, -1051523);
					b = f4(b, c, d, a, t[1], 21, -2054922799);
					a = f4(a, b, c, d, t[8], 6,  1873313359);
					d = f4(d, a, b, c, t[15], 10, -30611744);
					c = f4(c, d, a, b, t[6], 15, -1560198380);
					b = f4(b, c, d, a, t[13], 21,  1309151649);
					a = f4(a, b, c, d, t[4], 6, -145523070);
					d = f4(d, a, b, c, t[11], 10, -1120210379);
					c = f4(c, d, a, b, t[2], 15,  718787259);
					b = f4(b, c, d, a, t[9], 21, -343485551);
					w[0] = add32(a, w[0]);
					w[1] = add32(b, w[1]);
					w[2] = add32(c, w[2]);
					w[3] = add32(d, w[3]);
				};
				res = [1732584193, -271733879, -1732584194, 271733878];
				i = 0;
				while (i <= n - 64) {
					t = [];
					do {
						t.push(((msg.arr[i >> 2] & 0xFF000000) >>> 24) | ((msg.arr[i >> 2] & 0x00FF0000) >>> 8) | ((msg.arr[i >> 2] & 0x0000FF00) << 8) | ((msg.arr[i >> 2] & 0x000000FF) << 24));
						i += 4;
					} while ( i % 64 !== 0 );
					cycle(res, t);
				}
				t = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				var j = 0;
				while ( i < n ) {
					t[j >> 2] = ((msg.arr[i >> 2] & 0xFF000000) >>> 24) | ((msg.arr[i >> 2] & 0x00FF0000) >>> 8) | ((msg.arr[i >> 2] & 0x0000FF00) << 8) | ((msg.arr[i >> 2] & 0x000000FF) << 24);
					i++;
					j++;
				}
				t[j >> 2] |= 0x80 << ((j % 4) << 3);
				if (j > 55) {
					cycle(res, t);
					t = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				}
				t[14] = n * 8;
				cycle(res, t);
				var k;
				for (k = 0, l = res.length; k < l; k++) {
					res[k] = ((res[k] & 0xFF) << 24) | (((res[k] >> 8) & 0xFF) << 16) | (((res[k] >> 16) & 0xFF) << 8) | ((res[k] >> 24) & 0xFF);
				}
				return {length: 16, arr: res};
			case "SHA-256":
				bl = msg.length * 8;
				msg.arr[bl >> 5] |= 0x80 << (24 - bl % 32);
				msg.arr[((bl + 65 >> 9) << 4) + 15] = bl;
				var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
					0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
					0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
					0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
					0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
					0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
					0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
					0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
				W = [];
				res = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
				l = msg.arr.length;
				for(i = 0; i < l; i += 16){
					a = res[0];
					b = res[1];
					c = res[2];
					d = res[3];
					e = res[4];
					f = res[5];
					g = res[6];
					h = res[7];
					for(t = 0; t < 64; t++){
						if (t < 16) {
							W[t] = msg.arr[i + t];
						} else {
							var g0 = W[t - 15];
							var g1 = W[t - 2];
							W[t] = add32(add32(add32(((g0 << 25) | (g0 >>> 7)) ^ ((g0 << 14) | (g0 >>> 18)) ^ (g0 >>> 3), W[t - 7]), ((g1 << 15) | (g1 >>> 17)) ^ ((g1 << 13) | (g1 >>> 19)) ^ (g1 >>> 10)), W[t - 16]);
						}
						var a1 = add32(add32(add32(add32(h, ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7) | (e >>> 25))), (e & f) ^ (~e & g)), K[t]), W[t]);
						var a2 = add32(((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22)), (a & b) ^ (a & c) ^ (b & c));
						h = g;
						g = f;
						f = e;
						e = add32(d, a1);
						d = c;
						c = b;
						b = a;
						a = add32(a1, a2);
					}
					res[0] = add32(a, res[0]);
					res[1] = add32(b, res[1]);
					res[2] = add32(c, res[2]);
					res[3] = add32(d, res[3]);
					res[4] = add32(e, res[4]);
					res[5] = add32(f, res[5]);
					res[6] = add32(g, res[6]);
					res[7] = add32(h, res[7]);
				}
				return {length: 32, arr: res};
			case "BASE64":
				var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
				msg = msg.replace(/\r\n/g,"\n");
				var l2b = msg.length;
				var str = "";
				for (i = 0; i < l2b; i++) {
					var c0 = msg.charCodeAt(i);
					str += c0 < 128 ? msg.charAt(i) : c0 > 127 && c0 < 2048 ? String.fromCharCode(c0 >> 6 | 192, c0 & 63 | 128) : String.fromCharCode(c0 >> 12 | 224, c0 >> 6 & 63 | 128, c0 & 63 | 128);
				}
				l2b = str.length;
				res = "";
				for (i = 0; i < l2b; i += 3) {
					var c1b = str.charCodeAt(i);
					var c2b = i + 1 < l2b ? str.charCodeAt(i + 1) : 0;
					var c3b = i + 2 < l2b ? str.charCodeAt(i + 2) : 0;
					res += b64.charAt(c1b >> 2) + b64.charAt((c1b & 3) << 4 | c2b >> 4) + (i + 1 < l2b ? b64.charAt((c2b & 15) << 2 | c3b >> 6) : "=") + (i + 2 < l2b ? b64.charAt(c3b & 63) : "=");
				}
				return res;
		}
	},
	hex32 : function(v) {
		var h = v >>> 16;
		var l = v & 0xFFFF;
		return (h >= 0x1000 ? "" : h >= 0x100 ? "0" : h >= 0x10 ? "00" : "000") + h.toString(16) + (l >= 0x1000 ? "" : l >= 0x100 ? "0" : l >= 0x10 ? "00" : "000") + l.toString(16);
	},
	encode : function(msg, enco) {
		var str = "", l, i, c1, c2, c3, b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		if (enco === "base64") {
			for (i = 0, l = msg.length; i < l; i += 3) {
				c1 = (msg.arr[i >> 2] >> (24 - (i % 4) * 8)) & 0xFF;
				c2 = i + 1 < l ? (msg.arr[(i + 1) >> 2] >> (24 - ((i + 1) % 4) * 8))& 0xFF : 0;
				c3 = i + 2 < l ? (msg.arr[(i + 2) >> 2] >> (24 - ((i + 2) % 4) * 8))& 0xFF : 0;
				str += b64.charAt(c1 >> 2) + b64.charAt((c1 & 3) << 4 | c2 >> 4) + (i + 1 < l ? b64.charAt((c2 & 15) << 2 | c3 >> 6) : "=") + (i + 2 < l ? b64.charAt(c3 & 63) : "=");
			}
			return str;
		}
		str = "";
		for (i = 0, l = msg.length >> 2; i < l; i++) {
			str += XsltForms_globals.hex32(msg.arr[i]);
		}
		if (msg.length % 4 !== 0) {
			str += (msg.arr[msg.length >> 2] >>> (8 * (4 - msg.length % 4))).toString(16);
		}
		return str;
	}
};
var XsltForms_browser = {
	jsFileName : "xsltforms.js",
	isOpera: navigator.userAgent.match(/\bOpera\b/) !== null,
	isIE: navigator.userAgent.match(/\bMSIE\b/) !== null && navigator.userAgent.match(/\bOpera\b/) === null,
	isIE9: navigator.userAgent.match(/\bMSIE\b/) !== null && navigator.userAgent.match(/\bOpera\b/) === null && window.addEventListener,
	isIE6: navigator.userAgent.match(/\bMSIE 6\.0/) !== null,
	isIE11: navigator.userAgent.match(/\bTrident\/7\.0/) !== null,
	isMozilla: navigator.userAgent.match(/\bGecko\b/) !== null,
	isSafari: navigator.userAgent.match(/\bAppleWebKit/) !== null && navigator.userAgent.match(/\bEdge/) === null && !window.FileReader,
	isChrome: navigator.userAgent.match(/\bAppleWebKit/) !== null && navigator.userAgent.match(/\bEdge/) === null,
	isEdge: navigator.userAgent.match(/\bEdge/) !== null,
	isFF2: navigator.userAgent.match(/\bFirefox[\/\s]2\.\b/) !== null,
	isXhtml: false, // document.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml",
	setClass: function(element, className, value) {
		XsltForms_browser.assert(element && className);
		if (value) {
			if (!this.hasClass(element, className)) {
				if (typeof element.className === "string") {
					element.className += " " + className;
				} else {
					element.className.baseVal += " " + className;
				}
			}
		} else if (element.className) {
			if (typeof element.className === "string") {
				element.className = element.className.replace(className, "");
			} else {
				element.className.baseVal = element.className.baseVal.replace(className, "");
			}
		}
	},
	hasClass : function(element, className) {
		var cn = element.className;
		var cn2 = typeof cn === "string" ? cn : cn.baseVal;
		return XsltForms_browser.inArray(className, (cn2 && cn2.split(" ")) || []);
	},
	initHover : function(element) {
		XsltForms_browser.events.attach(element, "mouseover", function(evt) {
			XsltForms_browser.setClass(XsltForms_browser.events.getTarget(evt), "hover", true);
		} );
		XsltForms_browser.events.attach(element, "mouseout", function(evt) {
			XsltForms_browser.setClass(XsltForms_browser.events.getTarget(evt), "hover", false);
		} );
	},
	getEventPos : function(ev) {
		ev = ev || window.event;
		return { x : ev.pageX || ev.clientX + window.document.body.scrollLeft || 0,
			y : ev.pageY || ev.clientY + window.document.body.scrollTop || 0 };
	},
	getAbsolutePos : function(e) {
		var r = XsltForms_browser.getPos(e);
		if (e.offsetParent) {
			var tmp = XsltForms_browser.getAbsolutePos(e.offsetParent);
			r.x += tmp.x;
			r.y += tmp.y;
		}
		return r;
	},
	getPos : function(e) {
		var is_div = /^div$/i.test(e.tagName);
		var r = {
			x: e.offsetLeft - (is_div && e.scrollLeft? e.scrollLeft : 0),
			y: e.offsetTop - (is_div && e.scrollTop? e.scrollTop : 0)
		};
		return r;
	},
	setPos : function(element, left, topy) {
		if (element.offsetParent) {
			var tmp = XsltForms_browser.getAbsolutePos(element.offsetParent);
			left -= tmp.x;
			topy -= tmp.y;
		}
		element.style.top = topy + "px";
		element.style.left = left + "px";
	},
	loadProperties : function(fname, f) {
		var uri = this.ROOT + fname;
		var synchr = !f;
		var req = XsltForms_browser.openRequest("GET", uri, !synchr);
		var func = function() {
			if (!synchr && req.readyState !== 4) {
				return;
			}
			try {
				if (req.status === 1223) {
					req.status = 204;
					req.statusText = "No Content";
				}
				if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
					return;
				}
				var ndoc = XsltForms_browser.createXMLDocument(req.responseText);
				var n = ndoc.documentElement;
				while (n) {
					if (n.nodeName === "properties") {
						break;
					}
					if (n.firstChild) {
						n = n.firstChild;
					} else {
						while (n && !n.nextSibling) {
							n = n.parentNode;
						}
						if (n && n.nextSibling) {
							n = n.nextSibling;
						}
					}
				}
				var r = XsltForms_browser.config.ownerDocument.importNode(n, true);
				XsltForms_browser.config.parentNode.replaceChild(r, XsltForms_browser.config);
				var inst = document.getElementById(XsltForms_browser.idPf + "instance-config").xfElement;
				XsltForms_browser.config = inst.doc.documentElement;
				inst.srcDoc = XsltForms_browser.saveDoc(inst.doc, "application/xml");
				XsltForms_browser.setDocMeta(inst.doc, "instance", XsltForms_browser.idPf + "instance-config");
				XsltForms_browser.setDocMeta(inst.doc, "model", XsltForms_browser.idPf + "model-config");
				XsltForms_globals.language = XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config);
			} catch (e) {
			}
			if (!synchr) {
				f();
			}
		};
		if (!synchr) {
			req.onreadystatechange = func;
		}
		if (req.overrideMimeType) {
			req.overrideMimeType("application/xml");
		}
		try {        
			req.send(null);
			if (synchr) {
				func();
			}
		} catch(e) {
			alert("File not found: " + uri);
		}
	},
	constructURI : function(uri) {
		if (uri.match(/^[a-zA-Z0-9+\.\-]+:\/\//)) {
			return uri;
		}
		if (uri.charAt(0) === '/') {
			return document.location.href.substr(0, document.location.href.replace(/:\/\//, ":\\\\").indexOf("/")) + uri;
		}
		var href = document.location.href;
		var idx = href.indexOf("?");
		href =  idx === -1 ? href : href.substr(0, idx);
		idx = href.replace(/:\/\//, ":\\\\").lastIndexOf("/");
		if (href.length > idx + 1) {
			return (idx === -1 ? href : href.substr(0, idx)) + "/" + uri;
		}
		return href + uri;
	},
	createElement : function(type, parentElt, content, className) {
		var el = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", type) : document.createElement(type);
		if (className) {
			el.className = className;
		}
		if (parentElt) {
			parentElt.appendChild(el);
		}
		if (content) {
			el.appendChild(document.createTextNode(content));
		}
		return el;
	},
	getWindowSize : function() {
		var myWidth = 0, myHeight = 0, myOffsetX = 0, myOffsetY = 0, myScrollX = 0, myScrollY = 0;
		if (!(XsltForms_browser.isIE || XsltForms_browser.isIE11)) {
			myWidth = document.body ? document.body.clientWidth : document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
			myOffsetX = document.body ? Math.max(document.documentElement.clientWidth, document.body.clientWidth) : document.documentElement.clientWidth; // body margins ?
			myOffsetY = document.body ? Math.max(document.documentElement.clientHeight, document.body.clientHeight) : document.documentElement.clientHeight; // body margins ?
			myScrollX = window.scrollX;
			myScrollY = window.scrollY;
		} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
			myOffsetX = Math.max(document.documentElement.clientWidth, document.body.clientWidth); // body margins ?
			myOffsetY = Math.max(document.documentElement.clientHeight, document.body.clientHeight); // body margins ?
			myScrollX = document.body.parentNode.scrollLeft;
			myScrollY = document.body.parentNode.scrollTop;
		}
		return {
			height : myHeight,
			width : myWidth,
			offsetX : myOffsetX,
			offsetY : myOffsetY,
			scrollX : myScrollX,
			scrollY : myScrollY
		};
	}
};
if (XsltForms_browser.isIE || XsltForms_browser.isIE11) {
	try {
		var xmlDoc0 = new ActiveXObject("Msxml2.DOMDocument.6.0");
		if (xmlDoc0) {
			xmlDoc0 = null;
			XsltForms_browser.MSXMLver = "6.0";
		}
	} catch(e) {
		XsltForms_browser.MSXMLver = "3.0";
	}
    document.write("<script type='text/vbscript'>Function XsltForms_browser_BinaryToArray_ByteStr(Binary)\r\nXsltForms_browser_BinaryToArray_ByteStr = CStr(Binary)\r\nEnd Function\r\nFunction XsltForms_browser_BinaryToArray_ByteStr_Last(Binary)\r\nDim lastIndex\r\nlastIndex = LenB(Binary)\r\nif lastIndex mod 2 Then\r\nXsltForms_browser_BinaryToArray_ByteStr_Last = Chr(AscB(MidB(Binary,lastIndex,1)))\r\nElse\r\nXsltForms_browser_BinaryToArray_ByteStr_Last = "+'""'+"\r\nEnd If\r\nEnd Function\r\n</script>\r\n");
}
if (!XsltForms_browser.isIE) {
	XsltForms_browser.openRequest = function(method, uri, async) {
		var req = new XMLHttpRequest();
		try {
			req.open(method, XsltForms_browser.constructURI(uri), async);
		} catch (e) {
			throw new Error("This browser does not support XHRs(Ajax)! \n Cause: " + (e.message || e.description || e) + " \n Enable Javascript or ActiveX controls (on IE) or lower security restrictions.");
		}
		if (XsltForms_browser.isMozilla) {
			req.overrideMimeType("text/xml");
		}
		return req;
	};
} else if (window.ActiveXObject) {
	XsltForms_browser.openRequest = function(method, uri, async) {
		var req;
		try {
			req = new XMLHttpRequest();
		} catch (e0) {
			try {
				req = new ActiveXObject("Msxml2.XMLHTTP." + XsltForms_browser.MSXMLver); 
			} catch (e1) {
				try {
					req = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					throw new Error("This browser does not support XHRs(Ajax)! \n Cause: " + (e.message || e.description || e) + " \n Enable Javascript or ActiveX controls (on IE) or lower security restrictions.");
				}
			}
		}
		req.open(method, XsltForms_browser.constructURI(uri), async);
		return req;
	};
	XsltForms_browser.StringToBinary = function(s) {
		var b = function(v) {
			return String.fromCharCode(v > 9 ? v + 55 : v + 48); 
		};
		var s2 = "";
		for (var i = 0, l = s.length; i < l; i++) {
			s2 += b((s.charCodeAt(i) & 0xF0) >> 4) + b(s.charCodeAt(i) & 0xF);
		}
		var doc = new ActiveXObject("Msxml2.DOMDocument." + XsltForms_browser.MSXMLver);
		var elt = doc.createElement("dummy");
		elt.dataType = "bin.hex";
		elt.text = s2;
		return elt.nodeTypedValue;
	};
} else {
	throw new Error("This browser does not support XHRs(Ajax)! \n Enable Javascript or ActiveX controls (on IE) or lower security restrictions.");
}
if (XsltForms_browser.isIE || XsltForms_browser.isIE11) {
	XsltForms_browser.transformText = function(xml, xslt, inline) {
		var xmlDoc = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		xmlDoc.setProperty("AllowDocumentFunction", true);
		xmlDoc.preserveWhiteSpace = true;
		xmlDoc.validateOnParse = false;
		xmlDoc.setProperty("ProhibitDTD", false);
		xmlDoc.loadXML(xml);
		var xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument." + XsltForms_browser.MSXMLver);
		xslDoc.setProperty("AllowDocumentFunction", true);
		xslDoc.preserveWhiteSpace = true;
		xslDoc.validateOnParse = false;
		xslDoc.setProperty("ProhibitDTD", false);
		if (inline) {
			xslDoc.loadXML(xslt);
		} else {
			xslDoc.async = false;
			xslDoc.load(xslt);
		}
		var xslTemplate = new ActiveXObject("MSXML2.XSLTemplate." + XsltForms_browser.MSXMLver);
		xslTemplate.stylesheet = xslDoc;
		var xslProc = xslTemplate.createProcessor();
		xslProc.input = xmlDoc;
		for (var i = 3, len = arguments.length-1; i < len ; i += 2) {
			xslProc.addParameter(arguments[i], arguments[i+1], "");
		}
		xslProc.transform();
		return xslProc.output;
    };
} else {
    XsltForms_browser.transformText = function(xml, xslt, inline) {
			var parser = new DOMParser();
			var serializer = new XMLSerializer();
			var xmlDoc = parser.parseFromString(xml, "text/xml");
			var xsltDoc;
			if (inline) {
				xsltDoc = parser.parseFromString(xslt, "text/xml");
			} else {
				var xhttp = new XMLHttpRequest();
				xhttp.open("GET", xslt, false);
				xhttp.send("");
				if ( xhttp.responseXML && xhttp.responseXML.xml !== "") {
					xsltDoc = xhttp.responseXML;
				} else {
					xslt = xhttp.responseText;
					xsltDoc = parser.parseFromString(xslt, "text/xml");
				}
			}
			var xsltProcessor = new XSLTProcessor();
			if (!XsltForms_browser.isMozilla && !XsltForms_browser.isOpera) {
				xsltProcessor.setParameter(null, "xsltforms_caller", "true");
			}
			try {
				xsltProcessor.setParameter(null, "xsltforms_config", document.getElementById(XsltForms_browser.idPf + "instance-config").xfElement.srcDoc);
				xsltProcessor.setParameter(null, "xsltforms_lang", XsltForms_globals.language);
				xsltProcessor.setParameter(null, "xsltforms_domengine", XsltForms_fullDomEngine);
			} catch (e) {
			}
			for (var i = 3, len = arguments.length-1; i < len ; i += 2) {
				xsltProcessor.setParameter(null, arguments[i], arguments[i+1]);
			}
			try {
				xsltProcessor.importStylesheet(xsltDoc);
				var resultDocument = xsltProcessor.transformToDocument(xmlDoc);
				if (!resultDocument) {
					alert("transformToDocument: null return value");
					return "";
				}
				var s = "";
				if ((XsltForms_browser.isMozilla && resultDocument.documentElement.nodeName === "transformiix:result") ||
				     (XsltForms_browser.isOpera && resultDocument.documentElement.nodeName === "result")) {
					s = resultDocument.documentElement.textContent;
				} else if ((XsltForms_browser.isChrome || XsltForms_browser.isEdge) && resultDocument.documentElement.nodeName.toLowerCase() === "html" && resultDocument.documentElement.children[1].children[0].nodeName.toLowerCase() === "pre") {
					s = resultDocument.documentElement.children[1].children[0].textContent;
				} else {
					s = serializer.serializeToString(resultDocument);
				}
				return s;
			} catch (e2) {
				alert(e2);
				return "";
			}
	};
}
XsltForms_browser.scripts = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "script") : document.getElementsByTagName("script");
for (var __i = 0, __len = XsltForms_browser.scripts.length; __i < __len; __i++) {
	var __src = XsltForms_browser.scripts[__i].src;
	if (__src.indexOf(XsltForms_browser.jsFileName) !== -1) {
		XsltForms_browser.ROOT = __src.replace(XsltForms_browser.jsFileName, "");
		if (XsltForms_browser.ROOT.indexOf("?") !== -1) {
			XsltForms_browser.ROOT = XsltForms_browser.ROOT.substring(0, XsltForms_browser.ROOT.indexOf("?"));
		}
		XsltForms_browser.imgROOT = XsltForms_browser.ROOT.substr(XsltForms_browser.ROOT.length - 3, 3) === "js/" ? XsltForms_browser.ROOT + "../img/" : XsltForms_browser.ROOT;
		XsltForms_browser.xslROOT = XsltForms_browser.ROOT.substr(XsltForms_browser.ROOT.length - 3, 3) === "js/" ? XsltForms_browser.ROOT + "../xsl/" : XsltForms_browser.ROOT;
		XsltForms_browser.debugROOT = XsltForms_browser.ROOT.substr(XsltForms_browser.ROOT.length - 3, 3) === "js/" ? XsltForms_browser.ROOT + "../debug/" : XsltForms_browser.ROOT;
		break;
	}
}
XsltForms_browser.loadapplet = function() {
	var appelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "applet") : document.createElement("applet");
	appelt.setAttribute("style", "position:absolute;left:-1px");
	appelt.setAttribute("name", "xsltforms");
	appelt.setAttribute("id", "xsltforms_applet");
	appelt.setAttribute("code", "xsltforms.class");
	appelt.setAttribute("archive", XsltForms_browser.ROOT + "xsltforms.jar");
	appelt.setAttribute("width", "1");
	appelt.setAttribute("height", "1");
	var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
	body.insertBefore(appelt, body.firstChild);
};
XsltForms_browser.IEReadFile = function(fname, encoding, xsdtype, title) {
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	XsltForms_browser.loadapplet();
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	return "";
};
XsltForms_browser.javaReadFile = function(fname, encoding, xsdtype, title) {
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	if( document.getElementById("xsltforms_applet") ) {
		return document.getElementById("xsltforms_applet").readFile(fname, encoding, xsdtype, title) || "";
	}
	XsltForms_browser.loadapplet();
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	if( document.getElementById("xsltforms_applet") ) {
		return document.getElementById("xsltforms_applet").readFile(fname, encoding, xsdtype, title) || "";
	}
	return "";
};
XsltForms_browser.javaWriteFile = function(fname, encoding, xsdtype, title, content) {
	if (document.applets.xsltforms) {
		if (fname === "") {
			fname = document.applets.xsltforms.lastChosenFileName;
		}
		return document.applets.xsltforms.writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	if( document.getElementById("xsltforms_applet") ) {
		if (fname === "") {
			fname = document.getElementById("xsltforms_applet").xsltforms.lastChosenFileName;
		}
		return document.getElementById("xsltforms_applet").writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	XsltForms_browser.loadapplet();
	if (document.applets.xsltforms) {
		if (fname === "") {
			fname = document.applets.xsltforms.lastChosenFileName;
		}
		return document.applets.xsltforms.writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	if( document.getElementById("xsltforms_applet") ) {
		if (fname === "") {
			fname = document.getElementById("xsltforms_applet").xsltforms.lastChosenFileName;
		}
		return document.getElementById("xsltforms_applet").writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	return false;
};
XsltForms_browser.readFile = function(fname, encoding, xsdtype, title) {
	return XsltForms_browser.javaReadFile(fname, encoding, xsdtype, title);
};
XsltForms_browser.writeFile = function(fname, encoding, xsdtype, title, content) {
	return XsltForms_browser.javaWriteFile(fname, encoding, xsdtype, title, content);
};
XsltForms_browser.xsltsrc = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
XsltForms_browser.xsltsrc += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrc += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrc += '	<xsl:template match="@*|node()" priority="0">';
XsltForms_browser.xsltsrc += '		<xsl:copy>';
XsltForms_browser.xsltsrc += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrc += '		</xsl:copy>';
XsltForms_browser.xsltsrc += '	</xsl:template>';
XsltForms_browser.xsltsrc += '</xsl:stylesheet>';
XsltForms_browser.xsltsrcanyuri = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0">';
XsltForms_browser.xsltsrcanyuri += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="*[(substring-after(@xsltforms_type,\':\') = \'anyURI\' or substring-after(@xsi:type,\':\') = \'anyURI\') and . != \'\']" priority="2">';
XsltForms_browser.xsltsrcanyuri += '		<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:apply-templates select="@*"/>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '		</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '	</xsl:template>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcanyuri += '		<xsl:choose>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_type\') and substring-after(.,\':\') = \'anyURI\'] and . != \'\'">';
XsltForms_browser.xsltsrcanyuri += '				<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '				</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			</xsl:when>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:otherwise>';
XsltForms_browser.xsltsrcanyuri += '				<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcanyuri += '				</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			</xsl:otherwise>';
XsltForms_browser.xsltsrcanyuri += '		</xsl:choose>';
XsltForms_browser.xsltsrcanyuri += '	</xsl:template>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="node()" priority="0">';
XsltForms_browser.xsltsrcanyuri += '		<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrcanyuri += '		</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '	</xsl:template>';
XsltForms_browser.xsltsrcanyuri += '</xsl:stylesheet>';
XsltForms_browser.xsltsrcindent = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
XsltForms_browser.xsltsrcindent += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcindent += '		<xsl:copy/>';
XsltForms_browser.xsltsrcindent += '	</xsl:template>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="text()" priority="0">';
XsltForms_browser.xsltsrcindent += '		<xsl:value-of select="normalize-space(.)"/>';
XsltForms_browser.xsltsrcindent += '	</xsl:template>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="*" priority="0">';
XsltForms_browser.xsltsrcindent += '		<xsl:param name="offset"/>';
XsltForms_browser.xsltsrcindent += '		<xsl:text>&#10;</xsl:text>';
XsltForms_browser.xsltsrcindent += '		<xsl:value-of select="$offset"/>';
XsltForms_browser.xsltsrcindent += '		<xsl:copy>';
XsltForms_browser.xsltsrcindent += '			<xsl:apply-templates select="@*|node()">';
XsltForms_browser.xsltsrcindent += '				<xsl:with-param name="offset" select="concat($offset,\'    \')"/>';
XsltForms_browser.xsltsrcindent += '			</xsl:apply-templates>';
XsltForms_browser.xsltsrcindent += '		</xsl:copy>';
XsltForms_browser.xsltsrcindent += '		<xsl:if test="not(following-sibling::*)">';
XsltForms_browser.xsltsrcindent += '			<xsl:text>&#10;</xsl:text>';
XsltForms_browser.xsltsrcindent += '			<xsl:value-of select="substring($offset,5)"/>';
XsltForms_browser.xsltsrcindent += '		</xsl:if>';
XsltForms_browser.xsltsrcindent += '	</xsl:template>';
XsltForms_browser.xsltsrcindent += '</xsl:stylesheet>';
XsltForms_browser.xsltsrcrelevant = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
XsltForms_browser.xsltsrcrelevant += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="*[@xsltforms_notrelevant = \'true\']" priority="1"/>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcrelevant += '		<xsl:choose>';
XsltForms_browser.xsltsrcrelevant += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_notrelevant\')] = \'true\'"/>';
XsltForms_browser.xsltsrcrelevant += '			<xsl:otherwise>';
XsltForms_browser.xsltsrcrelevant += '				<xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevant += '				</xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '			</xsl:otherwise>';
XsltForms_browser.xsltsrcrelevant += '		</xsl:choose>';
XsltForms_browser.xsltsrcrelevant += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="node()" priority="0">';
XsltForms_browser.xsltsrcrelevant += '		<xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrcrelevant += '		</xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevant += '</xsl:stylesheet>';
XsltForms_browser.xsltsrcrelevany = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0">';
XsltForms_browser.xsltsrcrelevany += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="*[@xsltforms_notrelevant = \'true\']" priority="2"/>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="*[(substring-after(@xsltforms_type,\':\') = \'anyURI\' or substring-after(@xsi:type,\':\') = \'anyURI\') and . != \'\']" priority="2">';
XsltForms_browser.xsltsrcrelevany += '		<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:apply-templates select="@*"/>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '		</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcrelevany += '		<xsl:choose>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_notrelevant\')] = \'true\'"/>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_type\') and substring-after(.,\':\') = \'anyURI\'] and . != \'\'">';
XsltForms_browser.xsltsrcrelevany += '				<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '				</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			</xsl:when>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:otherwise>';
XsltForms_browser.xsltsrcrelevany += '				<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevany += '				</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			</xsl:otherwise>';
XsltForms_browser.xsltsrcrelevany += '		</xsl:choose>';
XsltForms_browser.xsltsrcrelevany += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="node()" priority="0">';
XsltForms_browser.xsltsrcrelevany += '		<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrcrelevany += '		</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevany += '</xsl:stylesheet>';
XsltForms_browser.loadTextNode = function(dest, txt) {
	if (dest.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
		dest.value = txt;
	} else {
		while (dest.firstChild) {
			dest.removeChild(dest.firstChild);
		}
		dest.appendChild(dest.ownerDocument.createTextNode(txt));
	}
};
if (XsltForms_domEngine === "" && (XsltForms_browser.isIE || XsltForms_browser.isIE11)) {
	XsltForms_browser.createXMLDocument = function(xml) {
		var d = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		d.setProperty("SelectionLanguage", "XPath");
		d.validateOnParse = false;
		d.setProperty("ProhibitDTD", false);
		d.loadXML(xml);
		return d;
	};
	XsltForms_browser.setAttributeNS = function(node, ns, attrname, value) {
		try {
			node.setAttributeNode(node.ownerDocument.createNode(Fleur.Node.ATTRIBUTE_NODE, attrname, ns));
			node.setAttribute(attrname, value);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: Could not set @" + (ns !== "" ? "Q{" + ns + "}" : "") + attrname + " with value " + value + " on " + XsltForms_browser.name2string(node));
		}
	};
	XsltForms_browser.selectSingleNode = function(xpath, node) {
		try {
			return node.selectSingleNode(xpath);
		} catch (e) {
			return null;
		}
	};
	XsltForms_browser.selectSingleNodeText = function(xpath, node, defvalue) {
		try {
			return node.selectSingleNode(xpath).text;
		} catch (e) {
			return defvalue || "";
		}
	};
	XsltForms_browser.selectNodesLength = function(xpath, node) {
		try {
			return node.selectNodes(xpath).length;
		} catch (e) {
			return 0;
		}
	};
	XsltForms_browser.xsltDoc = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDoc.loadXML(XsltForms_browser.xsltsrc);
	XsltForms_browser.xsltDocAnyURI = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocAnyURI.loadXML(XsltForms_browser.xsltsrcanyuri);
	XsltForms_browser.xsltDocRelevant = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocRelevant.loadXML(XsltForms_browser.xsltsrcrelevant);
	XsltForms_browser.xsltDocRelevantAnyURI = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocRelevantAnyURI.loadXML(XsltForms_browser.xsltsrcrelevany);
	XsltForms_browser.xsltDocIndent = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocIndent.loadXML(XsltForms_browser.xsltsrcindent);
	XsltForms_browser.loadNode = function(dest, xml) {
		var result = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		result.setProperty("SelectionLanguage", "XPath");
		result.setProperty("ProhibitDTD", false);
		result.validateOnParse = false;
		if (result.loadXML(xml)) {
			var r = result.documentElement.cloneNode(true);
			dest.parentNode.replaceChild(r, dest);
		} else {
			XsltForms_globals.error(document.getElementById(XsltForms_browser.getDocMeta(dest.ownerDocument, "model")).xfElement, "xforms-link-exception", "Unable to parse XML");
		}
	};
	XsltForms_browser.loadDoc = function(dest, xml) {
		XsltForms_browser.loadNode(dest.documentElement, xml);
	};
	XsltForms_browser.saveNode = function(node, mediatype, relevant, indent, related, cdataSectionElements) {
		if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) { 
			return node.nodeValue;
		}
		if (node.nodeType === Fleur.Node.TEXT_NODE) {
			var s = "";
			while (node && node.nodeType === Fleur.Node.TEXT_NODE) {
				s += node.nodeValue;
				node = node.nextSibling;
			}
			return s;
		}
		var xmlDoc = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		xmlDoc.setProperty("SelectionLanguage", "XPath"); 
		xmlDoc.appendChild(node.documentElement ? node.documentElement.cloneNode(true) : node.cloneNode(true));
		if (cdataSectionElements) {
			if (relevant) {
				var ns = xmlDoc.documentElement.selectNodes("descendant::*[@xsltforms_notrelevant = 'true']");
				for( var i = 0, l = ns.length; i < l ; i++) {
					var n = ns[i];
					try {
						n.parentNode.removeChild(n);
					} catch (e) {
					}
				}
			}
			var ns2 = xmlDoc.documentElement.selectNodes("descendant-or-self::*[@*[starts-with(name(),'xsltforms_')]]");
			for( var j = 0, l2 = ns2.length; j < l2 ; j++) {
				var n2 = ns2[j];
				var k = 0;
				while (k < n2.attributes.length) {
					if (n2.attributes[k].name.substring(0, 10) === "xsltforms_") {
						n2.removeAttribute(n2.attributes[k].name);
					} else {
						k++;
					}
				}
			}
			var ser = new Fleur.XMLSerializer();
			return ser.serializeToString(xmlDoc, indent, cdataSectionElements);
		}
		if (indent) {
			return xmlDoc.transformNode(XsltForms_browser.xsltDocIndent);
		}
		if (related) {
			var z = relevant ? xmlDoc.transformNode(XsltForms_browser.xsltDocRelevantAnyURI) : xmlDoc.transformNode(XsltForms_browser.xsltDocAnyURI);
			var cids = [];
			var m1 = z.indexOf("$!$!$!$!$!");
			while (m1 !== -1) {
				var m2 = z.indexOf("%!%!%!%!%!", m1 + 10);
				var fvalue = z.substring(m1 + 10, m2);
				if (fvalue !== "") {
					fvalue = fvalue.substr(fvalue.indexOf("?id=") + 4);
					cids.push(fvalue);
					fvalue = "cid:" + fvalue;
				}
				z = z.substr(0, m1) + fvalue + z.substr(m2 + 10);
				m1 = z.indexOf("$!$!$!$!$!");
			}
			var boundary = "xsltformsrev" + XsltForms_globals.fileVersionNumber;
			z = "--" + boundary + "\r\nContent-Type: application/xml; charset=UTF-8\r\nContent-ID: <xsltforms_main>\r\n\r\n" + z + "\r\n--" + boundary + "\r\n";
			for (var icid = 0, lcid = cids.length; icid < lcid; icid++) {
				z += "Content-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nContent-ID: <" + cids[icid] + ">\r\n\r\n";
				if (XsltForms_upload.contents[cids[icid]] instanceof ArrayBuffer) {
					var zc0 = new Uint8Array(XsltForms_upload.contents[cids[icid]]);
					for (var zci = 0, zcl = zc0.length; zci < zcl; zci++) {
						z += String.fromCharCode(zc0[zci]);
					}
				} else {
					z += XsltForms_upload.contents[cids[icid]];
				}
				z += "\r\n--" + boundary + (icid === lcid-1 ? "--\r\n" : "\r\n");
			}
			var data = [];
			for( var di = 0, dl = z.length; di < dl; di++) {
				data.push(z.charCodeAt(di) & 0xff);
			}
			try {
				var z2 = new Uint8Array(data);
				return z2.buffer;
			} catch (e) {
				return XsltForms_browser.StringToBinary(z);
			}
		}
		return relevant ? xmlDoc.transformNode(XsltForms_browser.xsltDocRelevant) : xmlDoc.transformNode(XsltForms_browser.xsltDoc);
	};
	XsltForms_browser.saveDoc = XsltForms_browser.saveNode;
} else {
	XsltForms_browser.createXMLDocument = function(xml) {
		return XsltForms_browser.parser.parseFromString(xml, "text/xml");
	};
	XsltForms_browser.setAttributeNS = function(node, ns, attrname, value) {
		try {
			node.setAttributeNS(ns, attrname, value);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: Could not set " + (ns !== "" ? "Q{" + ns + "}" : "") + attrname + " with value " + value + " on " + XsltForms_browser.name2string(node));
		}
	};
	XsltForms_browser.selectSingleNode = function(xpath, node) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.ANY_TYPE, null).iterateNext();
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.ANY_TYPE, null).iterateNext();
		} catch (e) {
			return null;
		}
	};
	XsltForms_browser.selectSingleNodeText = function(xpath, node, defvalue) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.ANY_TYPE, null).iterateNext().textContent;
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.ANY_TYPE, null).iterateNext().textContent;
		} catch (e) {
			if (node.nodeName === "properties") {
				for (var i = 0, l = node.childNodes.length; i < l; i++ ) {
					if (node.childNodes[i].nodeName === xpath) {
						return node.childNodes[i].textContent;
					}
				}
			}
			return defvalue || "";
		}
	};
	XsltForms_browser.selectNodesLength = function(xpath, node) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
		} catch (e) {
			var res = 0;
			switch (xpath) {
				case "preceding::* | ancestor::*":
					while (node) {
						if (node.previousSibling) {
							res += node.nodeType === Fleur.Node.ELEMENT_NODE ? 1 : 0;
							node = node.previousSibling;
						} else {
							if (node.parentNode) {
								res++;
								node = node.parentNode;
							} else {
								node = null;
							}
						}
					}
					break;
				case "descendant::node() | descendant::*/@*[not(starts-with(local-name(),'xsltforms_'))]":
					var n = node.firstChild;
					if (n) {
						while (n !== node) {
							res++;
							if (n.attributes) {
								for( var i = 0, l = n.attributes.length; i < l; i++) {
									res += n.attributes[i].name.substring(0, 10) !== "xsltforms_" ? 1 : 0;
								}
							}
							if (n.firstChild) {
								n = n.firstChild;
							} else {
								while (!n.nextSibling && n !== node) {
									n = n.parentNode;
								}
								if (n !== node) {
									n = n.nextSibling;
								}
							}
						}
					}
					break;
			}
			return res;
		}
	};
	XsltForms_browser.selectNodes = function(xpath, node) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		} catch (e) {
		}
	};
	try {
		XsltForms_browser.parser = XsltForms_domEngine === "http://www.agencexml.com/Fleur" ? new Fleur.DOMParser() : new DOMParser();
	} catch (xsltforms_e) {
	}
	if (XsltForms_domEngine === "") {
		XsltForms_browser.serializer = new XMLSerializer();
		XsltForms_browser.loadNode = function(dest, srcNode) {
			var result = XsltForms_browser.parser.parseFromString(srcNode, "text/xml");
			if (result.documentElement.localName !== "parsererror" && (!result.documentElement.textContent || result.documentElement.textContent.substring(0,40) !== "This page contains the following errors:")) {
				var r = dest.ownerDocument.importNode(result.documentElement, true);
				dest.parentNode.replaceChild(r, dest);
			} else {
				XsltForms_globals.error(document.getElementById(XsltForms_browser.getDocMeta(dest.ownerDocument, "model")).xfElement, "xforms-link-exception", "Unable to parse XML");
			}
		};
		XsltForms_browser.loadDoc = function(dest, srcDoc) {
			XsltForms_browser.loadNode(dest.documentElement, srcDoc);
		};
		XsltForms_browser.saveNode = function(node, mediatype, relevant, indent, related, cdataSectionElements) {
			if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) { 
				return node.nodeValue;
			}
			if (node.nodeType === Fleur.Node.TEXT_NODE) {
				var s = "";
				while (node && node.nodeType === Fleur.Node.TEXT_NODE) {
					s += node.nodeValue;
					node = node.nextSibling;
				}
				return s;
			}
			var resultDocument = XsltForms_browser.createXMLDocument(XsltForms_browser.serializer.serializeToString(node));
			if (relevant) {
				if (resultDocument.selectNodes) {
					var ns = resultDocument.selectNodes("descendant::*[@xsltforms_notrelevant = 'true']", false, resultDocument.documentElement);
					for( var i = 0, l = ns.length; i < l ; i++) {
						var n = ns[i];
						try {
							n.parentNode.removeChild(n);
						} catch (e) {
						}
					}
					ns = resultDocument.selectNodes("descendant::*[@*[. = 'true' and starts-with(local-name(),'xsltforms_') and substring(local-name(), string-length(local-name()) - 11, 12) = '_notrelevant']]", false, resultDocument.documentElement);
					for (i = 0, l = ns.length; i < l; i++) {
						n = ns[i];
						try {
							var nra = [];
							for (var j = 0, l2 = n.attributes.length; j < l2; j++) {
								var a = n.attributes[j];
								if (a.nodeValue === "true" && a.nodeName.startsWith("xsltforms_") && a.nodeName.endsWith("_notrelevant")) {
									var nrname = a.nodeName.substr(10);
									nrname = nrname.substr(0, nrname.indexOf("_notrelevant"));
									nra.push(nrname);
								}
							}
							for (j = 0, l2 = nra.length; j < l2; j++) {
								n.removeAttribute(nra[j]);
							}
						} catch (e) {
						}
					}
				}
			}
			if (related) {
				var ns3 = resultDocument.selectNodes("descendant::*[(substring-after(@xsltforms_type,':') = 'anyURI' or substring-after(@*[local-name() = 'type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance'],':') = 'anyURI') and . != '']", false, resultDocument.documentElement);
				for( var i3 = 0, l3 = ns3.length; i3 < l3 ; i3++) {
					var n3 = ns3[i3];
					try {
						n3.insertBefore(n3.ownerDocument.createTextNode("$!$!$!$!$!"), n3.firstChild);
						n3.appendChild(n3.ownerDocument.createTextNode("%!%!%!%!%!"));
					} catch (e3) {
					}
				}
				var ns4 = resultDocument.selectNodes("descendant::*[@*[starts-with(local-name(), 'xsltforms_') and substring(local-name(), string-length(local-name()) - 4, 5) = '_type' and local-name() != 'xsltforms_type' and substring-after(.,':') = 'anyURI']]", false, resultDocument.documentElement);
				for( var i4 = 0, l4 = ns4.length; i4 < l4 ; i4++) {
					var n4 = ns4[i4];
					var k4 = 0;
					while (k4 < n4.attributes.length) {
						var nn4 = n4.attributes[k4].name;
						var nn4v = n4.getAttribute(nn4);
						if (nn4.substring(0, 10) === "xsltforms_" && nn4.substr(nn4.length - 5, 5) === "_type" && nn4 !== "xsltforms_type" && nn4v.substr(nn4v.indexOf(':') + 1) === "anyURI") {
							try {
								var nn42 = nn4.substr(10, nn4.length - 15);
								if (n4.getAttribute(nn42) !== '') {
									n4.setAttribute(nn42, "$!$!$!$!$!" + n4.getAttribute(nn42) + "%!%!%!%!%!");
								}
							} catch (e4) {
							}
						} else {
							k4++;
						}
					}
				}
			}
			var ns2;
			if (resultDocument.selectNodes) {
				ns2 = resultDocument.selectNodes("descendant-or-self::*[@*[starts-with(name(),'xsltforms_')]]", false, resultDocument.documentElement);
			} else {
				ns2 = XsltForms_browser.selectMeta(resultDocument.documentElement, []);
			}
			for (var j = 0, l2 = ns2.length; j < l2 ; j++) {
				var n2 = ns2[j];
				var k = 0;
				while (k < n2.attributes.length) {
					if (n2.attributes[k].name.substring(0, 10) === "xsltforms_") {
						n2.removeAttribute(n2.attributes[k].name);
					} else {
						k++;
					}
				}
			}
			if (related) {
				var z = XsltForms_browser.serializer.serializeToString(resultDocument);
				var cids = [];
				var m1 = z.indexOf("$!$!$!$!$!");
				while (m1 !== -1) {
					var m2 = z.indexOf("%!%!%!%!%!", m1 + 10);
					var fvalue = z.substring(m1 + 10, m2);
					if (fvalue !== "") {
						fvalue = fvalue.substr(fvalue.indexOf("?id=") + 4);
						cids.push(fvalue);
						fvalue = "cid:" + fvalue;
					}
					z = z.substr(0, m1) + fvalue + z.substr(m2 + 10);
					m1 = z.indexOf("$!$!$!$!$!");
				}
				var boundary = "xsltformsrev" + XsltForms_globals.fileVersionNumber;
				z = "--" + boundary + "\r\nContent-Type: application/xml; charset=UTF-8\r\nContent-ID: <xsltforms_main>\r\n\r\n" + z + "\r\n--" + boundary + "\r\n";
				for (var icid = 0, lcid = cids.length; icid < lcid; icid++) {
					var zc = "";
					if (XsltForms_browser.isSafari) {
						var zc0 = XsltForms_upload.contents[cids[icid]];
						for (var zci = 0, zcl = zc0.length; zci < zcl; zci++) {
							var zcc = zc0.charCodeAt(zci);
							if (zcc < 128) {
								zc += String.fromCharCode(zcc);
							} else {
								if ((zcc > 191) && (zcc < 224)) {
									zc += String.fromCharCode(((zcc & 31) << 6) | (zc0.charCodeAt(++zci) & 63));
								} else {
									zc += String.fromCharCode(((zcc & 15) << 12) | ((zc0.charCodeAt(++zci) & 63) << 6) | (zc0.charCodeAt(++zci) & 63));
								}
							}
						}
					} else {
						var zc0b = new Uint8Array(XsltForms_upload.contents[cids[icid]]);
						for (var zcib = 0, zclb = zc0b.length; zcib < zclb; zcib++) {
							zc += String.fromCharCode(zc0b[zcib]);
						}
					}
					z += "Content-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nContent-ID: <" + cids[icid] + ">\r\n\r\n" + zc + "\r\n--" + boundary +  (icid === lcid-1 ? "--\r\n" : "\r\n");
				}
				var data = [];
				for( var di = 0, dl = z.length; di < dl; di++) {
					data.push(z.charCodeAt(di) & 0xff);
				}
				try {
					var z2 = new Uint8Array(data);
					return z2.buffer;
				} catch (e) {
					return XsltForms_browser.StringToBinary(z);
				}
			} else if (indent || cdataSectionElements) {
				var ser = new Fleur.XMLSerializer();
				return ser.serializeToString(resultDocument, indent, cdataSectionElements);
			}
			return XsltForms_browser.serializer.serializeToString(resultDocument);
		};
		XsltForms_browser.saveDoc = function(doc, mediatype, relevant, indent, related, cdataSectionElements) {
			return XsltForms_browser.saveNode(doc.documentElement, mediatype, relevant, indent, related, cdataSectionElements);
		};
		XsltForms_browser.selectMeta = function(node, selection) {
			var i, li;
			i = 0;
			li = node.attributes.length;
			while (i < li) {
				if (node.attributes[i].nodeName.indexOf("xsltforms_") === 0) {
					selection.push(node);
					break;
				}
				i++;
			}
			i = 0;
			li = node.children.length;
			while (i < li) {
				XsltForms_browser.selectMeta(node.children[i++], selection);
			}
			return selection;
		};
	} else {
		XsltForms_browser.serializer = new Fleur.Serializer();
		XsltForms_browser.loadNode = function(dest, srcNode, mediatype) {
			var i, l, r;
			try {
				var result = XsltForms_browser.parser.parseFromString(srcNode, mediatype);
				switch (dest.nodeType) {
					case Fleur.Node.ELEMENT_NODE:
						for (i = 0, l = result.childNodes.length; i < l; i++) {
							r = dest.ownerDocument.importNode(result.childNodes[i], true);
							dest.parentNode.insertBefore(r, dest);
						}
						dest.parentNode.removeChild(dest);
						break;
					case Fleur.Node.DOCUMENT_NODE:
						for (i = 0, l = dest.childNodes.length; i < l; i++) {
							dest.removeChild(dest.childNodes[0]);
						}
						for (i = 0, l = result.childNodes.length; i < l; i++) {
							r = dest.importNode(result.childNodes[i], true);
							dest.appendChild(r);
						}
						break;
				}
			} catch(e) {
				XsltForms_globals.error(document.getElementById(XsltForms_browser.getDocMeta(dest.ownerDocument, "model")).xfElement, "xforms-link-exception", "Unable to parse source");
			}
		};
		XsltForms_browser.loadDoc = XsltForms_browser.loadNode;
		XsltForms_browser.saveNode = function(node, mediatype, relevant, indent, related, cdataSectionElements) {
			return XsltForms_browser.serializer.serializeToString(node, mediatype, indent === "yes");
		};
		XsltForms_browser.saveDoc = XsltForms_browser.saveNode;
		XsltForms_browser.selectMeta = function(node, selection) {
			return selection;
		};
	}
}
XsltForms_browser.unescape = function(xml) {
	if (!xml) {
		return "";
	}
	var regex_escapepb = /^\s*</;
	if (!xml.match(regex_escapepb)) {
		xml = xml.replace(/&lt;/g, "<");
		xml = xml.replace(/&gt;/g, ">");
		xml = xml.replace(/&amp;/g, "&");
	}
	return xml;
};
XsltForms_browser.escape = function(text) {
	if (!text) {
		return "";
	}
	if (typeof(text) === "string") {
		text = text.replace(/&/g, "&amp;");
		text = text.replace(/</g, "&lt;");
		text = text.replace(/>/g, "&gt;");
	}
	return text;
};
XsltForms_browser.escapeJS = function(text) {
	if (!text) {
		return "";
	}
	if (typeof(text) === "string") {
		text = text.replace(/\\/gm, "\\\\");
		text = text.replace(/\t/gm, "\\t");
		text = text.replace(/\n/gm, "\\n");
		text = text.replace(/\r/gm, "\\r");
		text = text.replace(/\"/gm, "\\\"");
	}
	return text;
};
XsltForms_browser.utf8decode = function (s) {
	var r = "";
	for (var i = 0, l = s.length; i < l;) {
		var c = s.charCodeAt(i);
		if (c < 128) {
			r += String.fromCharCode(c);
			i++;
		} else {
			if((c > 191) && (c < 224)) {
				r += String.fromCharCode(((c & 31) << 6) | (s.charCodeAt(i+1) & 63));
				i += 2;
			} else {
				r += String.fromCharCode(((c & 15) << 12) | ((s.charCodeAt(i+1) & 63) << 6) | (s.charCodeAt(i+2) & 63));
				i += 3;
			}
		}
	}
	return r;
};
XsltForms_browser.utf8encode = function (s) {
	s = s.replace(/\r\n/g,"\n");
	var r = "";
	for (var i = 0, l = s.length; i < l; i++) {
		var c = s.charCodeAt(i);
		r += c < 128 ? String.fromCharCode(c) : c > 127 && c < 2048 ? String.fromCharCode((c >> 6) | 192) + String.fromCharCode((c & 63) | 128) : String.fromCharCode((c >> 12) | 224) + String.fromCharCode(((c >> 6) & 63) | 128) + String.fromCharCode((c & 63) | 128);
	}
	return r;
};
XsltForms_browser.crc32_arr = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
XsltForms_browser.crc32 = function (s) {
	var crc = -1;
	for (var i = 0, l = s.length; i < l; i++) {
		crc = (crc >>> 8) ^ XsltForms_browser.crc32_arr[(crc ^ s.charCodeAt(i)) & 0xFF];
	}
	return crc ^ (-1);
};
if (XsltForms_domEngine === "") {
	XsltForms_browser.getMeta = function(node, meta) {
		return node.nodeType && (node.nodeType === Fleur.Node.ELEMENT_NODE || node.nodeType === Fleur.Node.ATTRIBUTE_NODE) ? node.nodeType === Fleur.Node.ELEMENT_NODE ? node.getAttribute("xsltforms_"+meta) : node.ownerElement ? node.ownerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : node.oldOwnerElement ? node.oldOwnerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : node.selectSingleNode("..").getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : null;
	};
	XsltForms_browser.getDocMeta = function(doc, meta) {
		return XsltForms_browser.getMeta(doc.documentElement, meta);
	};
	XsltForms_browser.getBoolMeta = function(node, meta) {
		return Boolean(node.nodeType === Fleur.Node.ELEMENT_NODE ? node.getAttribute("xsltforms_"+meta) : node.nodeType === Fleur.Node.ATTRIBUTE_NODE ? node.ownerElement ? node.ownerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) :  node.selectSingleNode("..").getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : false);
	};
	XsltForms_browser.getType = function(node) {
		if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
			var t = node.getAttribute("xsltforms_type");
			if (t && t !== "") {
				return t;
			}
			if (node.getAttributeNS) {
				return node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type");
			}
			var att = node.selectSingleNode("@*[local-name()='type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']");
			if (att && att.value !== "") {
				return att.value;
			}
			return null;
		} else if (!node.nodeType || node.nodeType === Fleur.Node.DOCUMENT_NODE) {
			return null;
		}
		if (node.ownerElement) {
			return node.ownerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type");
		}
		try {
			return node.selectSingleNode("..").getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type");
		} catch (e) {
			return null;
		}
	};
	XsltForms_browser.setMeta = function(node, meta, value) {
		if (node && node.nodeType && (node.nodeType === Fleur.Node.ELEMENT_NODE || node.nodeType === Fleur.Node.ATTRIBUTE_NODE)) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.setAttribute("xsltforms_"+meta, value);
			} else {
				if (node.ownerElement) {
					node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, value);
				} else if (node.oldOwnerElement) {
					node.oldOwnerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, value);
				} else {
					node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, value);
				}
			}
		}
	};
	XsltForms_browser.setDocMeta = function(doc, meta, value) {
		XsltForms_browser.setMeta(doc.documentElement, meta, value);
	};
	XsltForms_browser.clearMeta = function(node) {
		var i = 0, n;
		if (node && node.nodeType && node.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (node.attributes) {
				while (node.attributes[i]) {
					n = node.attributes[i].localName ? node.attributes[i].localName : node.attributes[i].baseName;
					if (n.substr(0, 10) === "xsltforms_") {
						node.removeAttribute(n);
					} else {
						i++;
					}
				}
			}
			if (node.children) {
				for (var j = 0, l2 = node.children.length; j < l2; j++) {
					XsltForms_browser.clearMeta(node.children[j]);
				}
			}
		}
	};
	XsltForms_browser.setBoolMeta = function(node, meta, value) {
		if (node) {
			if (value) {
				if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
					node.setAttribute("xsltforms_"+meta, "true");
				} else {
					if (node.ownerElement) {
						node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
					} else {
						node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
					}
				}
			} else {
				if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
					node.removeAttribute("xsltforms_"+meta);
				} else {
					if (node.ownerElement) {
						node.ownerElement.removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
					} else {
						node.selectSingleNode("..").removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
					}
				}
			}
		}
	};
	XsltForms_browser.setTrueBoolMeta = function(node, meta) {
		if (node) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.setAttribute("xsltforms_"+meta, "true");
			} else {
				if (node.ownerElement) {
					node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
				} else {
					node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
				}
			}
		}
	};
	XsltForms_browser.setFalseBoolMeta = function(node, meta) {
		if (node) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.removeAttribute("xsltforms_"+meta);
			} else {
				if (node.ownerElement) {
					node.ownerElement.removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
				} else {
					node.selectSingleNode("..").removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
				}
			}
		}
	};
	XsltForms_browser.setType = function(node, value) {
		if (node) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.setAttribute("xsltforms_type", value);
			} else {
				if (node.ownerElement) {
					node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type", value);
				} else {
					node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type", value);
				}
			}
		}
	};
} else {
	XsltForms_browser.getMeta = function(node, meta) {
		return node.getUserData(meta);
	};
	XsltForms_browser.getDocMeta = XsltForms_browser.getMeta;
	XsltForms_browser.getBoolMeta = function(node, meta) {
		return Boolean(node.getUserData(meta));
	};
	XsltForms_browser.getType = function(node) {
		var t = node.getUserData("type");
		if (t && t !== "") {
			return t;
		}
		return node.getAttributeNS ? node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type") : null;
	};
	XsltForms_browser.setMeta = function(node, meta, value) {
		node.setUserData(meta, value);
	};
	XsltForms_browser.setDocMeta = XsltForms_browser.setMeta;
	XsltForms_browser.clearMeta = function(node) {
		node.clearUserData();
		if (node.attributes) {
			for (var i = 0, n = node.attributes.length; i < n; i++) {
				XsltForms_browser.clearMeta(node.attributes[i]);
			}
		}
		if (node.childNodes) {
			for (var i2 = 0, n2 = node.childNodes.length; i2 < n2; i2++) {
				XsltForms_browser.clearMeta(node.childNodes[i2]);
			}
		}
	};
	XsltForms_browser.setBoolMeta = function(node, meta, value) {
		if (node) {
			node.setUserData(meta, value);
		}
	};
	XsltForms_browser.setTrueBoolMeta = function(node, meta) {
		if (node) {
			node.setUserData(meta, true);
		}
	};
	XsltForms_browser.setFalseBoolMeta = function(node, meta) {
		if (node) {
			node.setUserData(meta, false);
		}
	};
	XsltForms_browser.setType = function(node, value) {
		if (node) {
			node.setUserData("type", value);
		}
	};
}
XsltForms_browser.getNil = function(node) {
	if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
		if (node.getAttributeNS) {
			return node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "nil") === "true";
		}
		var att = node.selectSingleNode("@*[local-name()='nil' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']");
		return att && att.value === "true";
	}
	return false;
};
XsltForms_browser.rmValueMeta = function(node, meta, value) {
	if (node) {
		var prev = XsltForms_browser.getMeta(node, meta);
		if (!prev) {
			prev = "";
		}
		var v = " " + value + " ";
		var pos = prev.indexOf(v);
		if (pos !== -1) {
			XsltForms_browser.setMeta(node, meta, prev.substring(0, pos) + prev.substring(pos + v.length));
		}
	}
};
XsltForms_browser.addValueMeta = function(node, meta, value) {
	if (node) {
		var prev = XsltForms_browser.getMeta(node, meta);
		if (!prev) {
			prev = "";
		}
		var v = " " + value + " ";
		var pos = prev.indexOf(v);
		if (pos === -1) {
			XsltForms_browser.setMeta(node, meta, prev + v);
		}
	}
};
XsltForms_browser.inValueMeta = function(node, meta, value) {
	if (node) {
		var prev = String(XsltForms_browser.getMeta(node, meta));
		var v = " " + value + " ";
		var pos = prev.indexOf(v);
		return pos !== -1;
	}
};
XsltForms_browser.name2string = function(node) {
	var s = "";
	if (!node.nodeType) {
		return "#notanode (" + node + ")";
	}
	switch (node.nodeType) {
		case Fleur.Node.ATTRIBUTE_NODE:
			s = "@";
		case Fleur.Node.ELEMENT_NODE:
			if (node.namespaceURI && node.namespaceURI !== "") {
				s += "Q{" + node.namespaceURI + "}";
			}
			return s + (node.baseName || node.localName);
		case Fleur.Node.ENTRY_NODE:
			return "?" + (node.baseName || node.localName);
		case Fleur.Node.TEXT_NODE:
			return "#text";
		case Fleur.Node.CDATA_NODE:
			return "#cdata";
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return "#processing-instruction";
		case Fleur.Node.COMMENT_NODE:
			return "#comment";
		case Fleur.Node.DOCUMENT_NODE:
			return "#document";
		case Fleur.Node.MAP_NODE:
			return "#map";
		case Fleur.Node.ARRAY_NODE:
			return "#array";
		case Fleur.Node.SEQUENCE_NODE:
			return "#sequence";
	}
};
if (!XsltForms_browser.isIE && !XsltForms_browser.isIE11) {
	if (typeof XMLDocument === "undefined") {
		var XMLDocument = Document;
	}
	XMLDocument.prototype.selectNodes = function(xpath, single, node) {
		var n;
		try {
			var r = this.evaluate(xpath, (node ? node : this), this.createNSResolver(this.documentElement), (single ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ORDERED_NODE_SNAPSHOT_TYPE), null);
			if (single) {
				return r.singleNodeValue ? r.singleNodeValue : null;
			}
			for (var i = 0, len = r.snapshotLength, r2 = []; i < len; i++) {
				r2.push(r.snapshotItem(i));
			}
			return r2;
		} catch (e) {
			var rx = [];
			switch (xpath) {
				case "@*[local-name()='type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']":
					for (var i2 = 0, l2 = node.attributes.length; i2 < l2; i2++ ) {
						if (node.attributes[i2].name === "type" && node.attributes[i2].namespaceURI === "http://www.w3.org/2001/XMLSchema-instance") {
							rx.push(node.attributes[i2]);
							break;
						}
					}
					break;
				case "@*[local-name()='nil' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']":
					for (var i3 = 0, l3 = node.attributes.length; i3 < l3; i3++ ) {
						if (node.attributes[i3].name === "nil" && node.attributes[i3].namespaceURI === "http://www.w3.org/2001/XMLSchema-instance") {
							rx.push(node.attributes[i3]);
							break;
						}
					}
					break;
				case "descendant::*[@xsltforms_notrelevant = 'true']":
					n = node.firstChild;
					if (n) {
						while (n !== node) {
							if (n.nodeType === Fleur.Node.ELEMENT_NODE && n.getAttribute("xsltforms_notrelevant") === "true") {
								rx.push(n);
							}
							if (n.firstChild) {
								n = n.firstChild;
							} else {
								while (!n.nextSibling && n !== node) {
									n = n.parentNode;
								}
								if (n !== node) {
									n = n.nextSibling;
								}
							}
						}
					}
					break;
				case "descendant-or-self::*[@*[starts-with(name(),'xsltforms_')]]":
					node = node.parentNode;
					n = node.firstChild;
					if (n) {
						while (n !== node) {
							if (n.nodeType === Fleur.Node.ELEMENT_NODE) {
								for (var i4 = 0, l4 = n.attributes.length; i4 < l4; i4++ ) {
									if (n.attributes[i4].name.substring(0,10) === "xsltforms_") {
										rx.push(n);
										break;
									}
								}
							}
							if (n.firstChild) {
								n = n.firstChild;
							} else {
								while (!n.nextSibling && n !== node) {
									n = n.parentNode;
								}
								if (n !== node) {
									n = n.nextSibling;
								}
							}
						}
					}
					break;
			}
			return rx;
		}
	};
	XMLDocument.prototype.selectSingleNode = function(xpath) {
		return this.selectNodes(xpath, true)[0];
	};
	XMLDocument.prototype.createNode = function(t, nodename, ns) {
		switch(t) {
			case Fleur.Node.ELEMENT_NODE:
				return this.createElementNS(ns, nodename);
			case Fleur.Node.ATTRIBUTE_NODE:
				return this.createAttributeNS(ns, nodename);
			default:
				return null;
		}
	};
	Node.prototype.selectNodes = function(xpath) {
		return this.ownerDocument.selectNodes(xpath, false, this);
	};
	Node.prototype.selectSingleNode = function(xpath) {	
		return this.ownerDocument.selectNodes(xpath, true, this);
	};
}
XsltForms_browser.debugConsole = {
	element_ : null,
	doc_ : null,
	isInit_ : false,
	time_ : 0,
	init_ : function() {
		this.element_ = document.getElementById("xsltforms_console");
		this.isInit_ = true;
		this.time_ = new Date().getTime();
    },
    write : function(text) {
		try {
			if (this.isOpen()) {
				var time = new Date().getTime();
				this.element_.appendChild(document.createTextNode(time - this.time_ + " -> " + text));
				XsltForms_browser.createElement("br", this.element_);
				this.time_ = time;
			}
			if (XsltForms_globals.debugMode) {
				if (!this.doc_) {
					this.doc_ = XsltForms_browser.createXMLDocument('<tracelog xmlns=""/>');
				}
				var elt = this.doc_.createElement("event");
				elt.appendChild(this.doc_.createTextNode(XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", true) + " -> " + text));
				this.doc_.documentElement.appendChild(elt);
			}
		} catch(e) {
		}
    },
	clear : function() {
		if (this.isOpen()) {
			while (this.element_.firstChild) {
				this.element_.removeChild(this.element_.firstChild);
			}
			this.time_ = new Date().getTime();
		}
	},
	isOpen : function() {
		if (!this.isInit_) {
			this.init_();
		}
		return this.element_;
	}
};
XsltForms_browser.dialog = {
	openPosition: {},
	dialogs : [],
	init : false,
	initzindex : 50,
	zindex: 0,
	selectstack : [],
	dialogDiv : function(id) {
		var div = null;
		if (typeof id !== "string") {
			var divid = id.getAttribute("id");
			if (divid && divid !== "") {
				div = XsltForms_idManager.find(divid);
			} else {
				div = id;
			}
		} else {
			div = XsltForms_idManager.find(id);
		}
		if (!div) {
			XsltForms_browser.debugConsole.write("Unknown dialog("+id+")!");
		}
		return div;
		},
	show : function(div, parentElt, modal) {
			if (!(div = this.dialogDiv(div))) {
				return;
			}
			if (this.dialogs[this.dialogs.length - 1] === div) {
				return;
			}
			this.dialogs = XsltForms_browser.removeArrayItem(this.dialogs, div);
			this.dialogs.push(div);
			var size;
			if (modal) {
				var surround = document.getElementById("xforms-dialog-surround");
				surround.style.display = "block";
				surround.style.zIndex = (this.zindex + this.initzindex)*2;
				this.zindex++;
				size = XsltForms_browser.getWindowSize();
				surround.style.height = size.height+"px";
				surround.style.width = size.width+"px";
				surround.style.top = size.scrollY+"px";
				surround.style.left = size.scrollX+"px";
				var surroundresize = function () {
					var surround2 = document.getElementById("xforms-dialog-surround");
					var size2 = XsltForms_browser.getWindowSize();
					surround2.style.height = size2.height+"px";
					surround2.style.width = size2.width+"px";
					surround2.style.top = size2.scrollY+"px";
					surround2.style.left = size2.scrollX+"px";
				};
				window.onscroll = surroundresize;
				window.onresize = surroundresize;
			}
			div.style.display = "block";
			div.style.zIndex = (this.zindex + this.initzindex)*2-1;
			this.showSelects(div, false, modal);
			if (parentElt) {
				var absPos = XsltForms_browser.getAbsolutePos(parentElt);
				XsltForms_browser.setPos(div, absPos.x, (absPos.y + parentElt.offsetHeight));
			} else {
				size = XsltForms_browser.getWindowSize();
				var h = size.scrollY + (size.height - div.offsetHeight) / 2;
				XsltForms_browser.setPos(div, (size.width - div.offsetWidth) / 2, h > 0 ? h : 100);
			}
		},
	hide : function(div, modal) {
		if (!(div = this.dialogDiv(div))) {
			return;
		}
		var oldlen = this.dialogs.length;
		this.dialogs = XsltForms_browser.removeArrayItem(this.dialogs, div);
		if (this.dialogs.length === oldlen) {
			return;
		}
		this.showSelects(div, true, modal);
		div.style.display = "none";
		if (modal) {
			if (!this.dialogs.length) {
				this.zindex = 0;
				document.getElementById('xforms-dialog-surround').style.display = "none";
				window.onscroll = null;
				window.onresize = null;
			} else {
				this.zindex--;
				document.getElementById('xforms-dialog-surround').style.zIndex = (this.zindex + this.initzindex)*2-2;
				if (this.dialogs.length) {
					this.dialogs[this.dialogs.length - 1].style.zIndex = (this.zindex + this.initzindex)*2-1;
				}
			}
		}
	},
	knownSelect : function(s) {
		if (XsltForms_browser.isIE6) {
			for (var i = 0, len = this.zindex; i < len; i++) {
				for (var j = 0, len1 = this.selectstack[i].length; j < len1; j++) {
					if (this.selectstack[i][j].select === s) {
						return true;
					}
				}
			}
		}
		return false;
	},
	showSelects : function(div, value, modal) {
		if (XsltForms_browser.isIE6) {
			var selects = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "select") : document.getElementsByTagName("select");
			var pos = XsltForms_browser.getAbsolutePos(div);
			var w = div.offsetWidth;
			var h = div.offsetHeight;
			var dis = [];
			for (var i = 0, len = selects.length; i < len; i++) {
				var s = selects[i];
				var p = s.parentNode;
				while (p && p !== div) {
					p = p.parentNode;
				}
				if (p !== div) {
					var ps = XsltForms_browser.getAbsolutePos(s);
					var ws = s.offsetWidth;
					var hs = s.offsetHeight;
					var under = ps.x + ws > pos.x && ps.x < pos.x + w && ps.y + hs > pos.y && ps.y < pos.y + h;
					if (modal) {
						if (value) {
							dis = this.selectstack[this.zindex];
							for (var j = 0, len1 = dis.length; j < len1; j++) {
								if (dis[j].select === s) {
									s.disabled = dis[j].disabled;
									s.style.visibility = dis[j].visibility;
									break;
								}
							}
						} else {
							var d = {"select": s, "disabled": s.disabled, "visibility": s.style.visibility};
							dis[dis.length] = d;
							if (under) {
								s.style.visibility = "hidden";
							} else {
								s.disabled = true;
							}
						}
					} else {
							if (under) {
								s.style.visibility = value? "" : "hidden";
							}
					}
				}
			}
			if (modal && !value) {
				this.selectstack[this.zindex - 1] = dis;
			}
		}
	}
};
XsltForms_browser.events = {};
if (XsltForms_browser.isIE && !XsltForms_browser.isIE9) {
	XsltForms_browser.events.attach = function(target, evtname, handler, phase) {
		var func = function(evt) { 
			handler.call(window.event.srcElement, evt);
		};
		target.attachEvent("on" + evtname, func);
	};
	XsltForms_browser.events.detach = function(target, evtname, handler, phase) {
		target.detachEvent("on" + evtname, handler);
	};
	XsltForms_browser.events.getTarget = function() {
		return window.event.srcElement;
	};
	XsltForms_browser.events.dispatch = function(target, evtname) {
		target.fireEvent("on" + evtname, document.createEventObject());
	};
} else {
	XsltForms_browser.events.attach = function(target, evtname, handler, phase) {
		if (target === window && !window.addEventListener) {
			target = document;
		}
		target.addEventListener(evtname, handler, phase);
	};
	XsltForms_browser.events.detach = function(target, evtname, handler, phase) {
		if (target === window && !window.addEventListener) {
			target = document;
		}
		target.removeEventListener(evtname, handler, phase);
	};
	XsltForms_browser.events.getTarget = function(ev) {
		return ev.target;
	};
	XsltForms_browser.events.dispatch = function(target, evtname) {
		var evt = document.createEvent("Event");
		evt.initEvent(evtname, true, true);
		target.dispatchEvent(evt);
	};
}
XsltForms_browser.i18n = {
	messages : null,
	lang : null,
	langs : ["cz", "de", "el", "en", "en_us", "es", "fr" , "gl", "ko", "it", "ja", "nb_no", "nl", "nn_no", "pl", "pt", "ro", "ru", "si", "sk", "zh", "zh_cn", "zh_tw"],
	asyncinit : function(f) {
		if (XsltForms_globals.language === "navigator" || XsltForms_globals.language !== XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config)) {
			var lan = XsltForms_globals.language === "navigator" ? (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || "undefined")) : XsltForms_globals.language;
			lan = lan.replace("-", "_").toLowerCase();
			var found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			if (!found) {
				var ind = lan.indexOf("_");
				if (ind !== -1) {
					lan = lan.substring(0, ind);
				}
				found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			}
			XsltForms_globals.language = "default";
			if (found) {
				XsltForms_browser.loadProperties("config_" + lan + ".xsl", f);
				return;
			}
		}
		f();
    },
	get : function(key, defvalue) {
		if (!XsltForms_browser.config || XsltForms_browser.config.nodeName === "dummy") {
			return "Initializing";
		}
		if (XsltForms_globals.language === "navigator" || XsltForms_globals.language !== XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config)) {
			var lan = XsltForms_globals.language === "navigator" ? (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || "undefined")) : XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config);
			lan = lan.replace("-", "_").toLowerCase();
			var found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			if (!found) {
				var ind = lan.indexOf("_");
				if (ind !== -1) {
					lan = lan.substring(0, ind);
				}
				found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			}
			if (found) {
				XsltForms_browser.loadProperties("config_" + lan + ".xsl");
				XsltForms_globals.language = XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config);
			} else {
				XsltForms_globals.language = "default";
			}
		}
		return XsltForms_browser.selectSingleNodeText(key, XsltForms_browser.config, defvalue);
    },
	parse : function(str, pattern, timeonly) {
		var ret = true;
		if (!str || str.match("^\\s*$")) {
			return null;
		}
		var pattern0 = pattern;
		if (!pattern) {
			if (!timeonly) {
				pattern = XsltForms_browser.i18n.get("format.datetime");
			} else {
				pattern = "hh:mm:ss";
			}
		}
		var d = new Date(2000, 0, 1);
		if (!timeonly) {
			ret &= XsltForms_browser.i18n._parse(d, "Year", str, pattern, "yyyy");
			ret &= XsltForms_browser.i18n._parse(d, "Month", str, pattern, "MM");
			ret &= XsltForms_browser.i18n._parse(d, "Date", str, pattern, "dd");
		}
		XsltForms_browser.i18n._parse(d, "Hours", str, pattern, "hh");
		XsltForms_browser.i18n._parse(d, "Minutes", str, pattern, "mm");
		XsltForms_browser.i18n._parse(d, "Seconds", str, pattern, "ss");
		if (!pattern0 && XsltForms_globals.AMPM) {
			var postfix = XsltForms_browser.i18n.get("format.time.AM").toLowerCase();
			if (str.substr(str.length - postfix.length).toLowerCase() === postfix) {
				if (d.getHours() === 12) {
					d.setHours(0);
				}
			} else {
				if (d.getHours() !== 12) {
					d.setHours(d.getHours() + 12);
				}
			}
		}
		return ret ? d : str;
	},
	format : function(date, pattern, loc, timeonly) {
		var hh, ss;
		if (!date) {
			return "";
		}
		if (typeof date === "string") {
			return date;
		}
		var str = pattern;
		if (!str) {
			if (!timeonly) {
				str = XsltForms_browser.i18n.get("format.datetime");
			} else {
				str = "hh:mm:ss";
			}
		}
		var str0 = str;
		if (!timeonly) {
			str = XsltForms_browser.i18n._format(str, (loc ? date.getDate() : date.getUTCDate()), "dd");
			str = XsltForms_browser.i18n._format(str, (loc ? date.getMonth() : date.getUTCMonth()) + 1, "MM");
			var y = (loc ? date.getFullYear() : date.getUTCFullYear());
			str = XsltForms_browser.i18n._format(str, y < 100 ? (y < (new Date().getFullYear()) % 100 + 20 ? 2000 : 1900) + y : y, "yyyy");
		}
		str = XsltForms_browser.i18n._format(str, ss = (loc ? date.getSeconds() : date.getUTCSeconds()), "ss");
		str = XsltForms_browser.i18n._format(str, (loc ? date.getMinutes() : date.getUTCMinutes()), "mm");
		str = XsltForms_browser.i18n._format(str, hh = (loc ? date.getHours() : date.getUTCHours()), "hh", !pattern);
		var o = date.getTimezoneOffset();
		str = XsltForms_browser.i18n._format(str, (loc ? (o < 0 ? "+" : "-") + XsltForms_browser.zeros(Math.floor(Math.abs(o)/60),2) + ":" + XsltForms_browser.zeros(Math.abs(o) % 60,2) : "Z"), "z");
		if (!pattern && XsltForms_globals.AMPM) {
			if (ss === 0 && str0.substr(str0.length - 3) === ":ss") {
				str = str.substr(0, str.length - 3);
			}
			str += " " + XsltForms_browser.i18n.get(hh < 12 ? "format.time.AM" : "format.time.PM");
		}
		return str;
	},
	parseDate : function(str) {
		return XsltForms_browser.i18n.parse(str, XsltForms_browser.i18n.get("format.date"));
	},
	formatDate : function(str) {
		return XsltForms_browser.i18n.format(str, XsltForms_browser.i18n.get("format.date"), true);
	},
	formatDateTime : function(str) {
		return XsltForms_browser.i18n.format(str, XsltForms_browser.i18n.get("format.datetime"), true);
	},
	formatNumber : function(number, decimals) {
		if (isNaN(number)) {
			return number;
		}
		var value = String(Math.abs(number));
		var index = value.indexOf(".");
		var integer = parseInt(index !== -1? value.substring(0, index) : value, 10);
		var decimal = index !== -1? value.substring(index + 1) : "";
		var decsep = XsltForms_browser.i18n.get("format.decimal");
		return (number < 0 ? "-":"") + integer + (decimals > 0? decsep + XsltForms_browser.zeros(decimal, decimals, true) : (decimal? decsep + decimal : ""));
	},
	parseNumber : function(value) {
		var decsep = XsltForms_browser.i18n.get("format.decimal");
		if(!value.match("^[\\-+]?([0-9]+(\\" + decsep + "[0-9]*)?|\\" + decsep + "[0-9]+)$")) {
			throw "Invalid number " + value;
		}
		var index = value.indexOf(decsep);
		var integer = Math.abs(parseInt(index !== -1? value.substring(0, index) : value, 10));
		var decimal = index !== -1? value.substring(index + 1) : null;
		return (value.substring(0,1) === "-" ? "-":"") + integer + (decimal? "." + decimal : "");
	},
	_format : function(returnValue, value, el, pattern) {
		var l = el.length;
		if (pattern && el === "hh" && XsltForms_globals.AMPM) {
			value %= 12;
			if (value === 0) {
				value = 12;
			}
			l = 1;
		}
		return returnValue.replace(el, XsltForms_browser.zeros(value, l));
	},
	_parse : function(date, prop, str, format, el) {
		var ret = false;
		var index = format.indexOf(el);
		if (index !== -1) {
			format = format.replace(new RegExp("\\.", "g"), "\\.");
			format = format.replace(new RegExp("\\(", "g"), "\\(");
			format = format.replace(new RegExp("\\)", "g"), "\\)");
			format = format.replace(new RegExp(el), "(" + el + ")!!!");
			format = format.replace(new RegExp("yyyy"), "[12][0-9]{3}");
			format = format.replace(new RegExp("MM"), "(?:0?[1-9](?![0-9])|1[0-2])");
			format = format.replace(new RegExp("dd"), "(?:0?[1-9](?![0-9])|[1-2][0-9]|30|31)");
			format = format.replace(new RegExp("hh"), "(?:0?[0-9](?![0-9])|1[0-9]|20|21|22|23)");
			format = format.replace(new RegExp("mm"), "[0-5][0-9]");
			format = format.replace(new RegExp("ss"), "[0-5][0-9]");
			format = "^" + format.substring(0, format.indexOf(")!!!") + 1) + "[^0-9]*.*";
			var r = new RegExp(format);
			var val = '00';
			if (r.test(str)) {
				val = str.replace(r, "$1");
				ret = true;
			}
			if (val.charAt(0) === '0') {
				val = val.substring(1);
			}
			val = parseInt(val, 10);
			if (isNaN(val)) {
				return false;
			}
			var n = new Date();
			n = n.getFullYear() - 2000;
			date["set" + prop](prop === "Month"? val - 1 : (prop === "Year" && val <= n+10 ? val+2000 : val));
			return ret;
		}
	}
};
function XsltForms_numberList(parentElt, className, input, min, max, minlengh) {
	this.element = XsltForms_browser.createElement("ul", parentElt, null, className);
	this.move = 0;
	this.input = input;
	this.min = min;
	this.max = max;
	this.minlength = minlengh || 1;
	var list = this;
	this.createChild("+", function() { list.start(1); }, function() { list.stop(); } );
	for (var i = 0; i < 7; i++) {
		this.createChild(" ", function(evt) {
			list.input.value = XsltForms_browser.events.getTarget(evt).childNodes[0].nodeValue;
			list.close();
			XsltForms_browser.events.dispatch(list.input, "change");
		} );
	}
	this.createChild("-", function() { list.start(-1); }, function() { list.stop(); } );
}
XsltForms_numberList.prototype.show = function() {
	var input = this.input;
	this.current = parseInt(input.value, 10);
	this.refresh();
	XsltForms_browser.dialog.show(this.element, input, false);
};
XsltForms_numberList.prototype.close = function() {
	XsltForms_browser.dialog.hide(this.element, false);
}; 
XsltForms_numberList.prototype.createChild = function(content, handler, handler2) {
	var child = XsltForms_browser.createElement("li", this.element, content);
	XsltForms_browser.initHover(child);
	if (handler2) {
		XsltForms_browser.events.attach(child, "mousedown", handler);
		XsltForms_browser.events.attach(child, "mouseup", handler2);
	} else {
		XsltForms_browser.events.attach(child, "click", handler);
	}
};
XsltForms_numberList.prototype.refresh = function()  {
	var childs = this.element.childNodes;
	var cur = this.current;
	if (cur >= this.max - 3) {
		cur = this.max - 3;
	} else if (cur <= this.min + 3) {
		cur = this.min + 3;
	}
	var topn = cur + 4;
	for (var i = 1; i < 8; i++) {
		XsltForms_browser.setClass(childs[i], "hover", false);
		var str = String(topn - i);
		while (str.length < this.minlength) {
			str = '0' + str;
		}
		childs[i].firstChild.nodeValue = str;
	}
};
XsltForms_numberList.prototype.start = function(value) {
	this.move = value;
	XsltForms_numberList.current = this;
	this.run();
};
XsltForms_numberList.prototype.stop = function() {
	this.move = 0;
};
XsltForms_numberList.prototype.run = function() {
	if ((this.move > 0 && this.current + 3 < this.max) || (this.move < 0 && this.current - 3> this.min)) {
		this.current += this.move;
		this.refresh();
		setTimeout(XsltForms_numberList.current.run, 60);
	}
};
XsltForms_numberList.current = null;
XsltForms_browser.forEach = function(object, block) {
	var args = [];
	for (var i = 0, len = arguments.length - 2; i < len; i++) {
		args[i] = arguments[i + 2];
	}
	if (object) {
		if (typeof object.length === "number") {
			for (var j = 0, len1 = object.length; j < len1; j++) {
				var obj = object[j];
				var func = typeof block === "string" ? obj[block] : block;
				func.apply(obj, args);
			}
		} else {
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					var obj2 = object[key];
					var func2 = typeof block === "string" ? obj2[block] : block;
					func2.apply(obj2, args);
				}
			}   
		}
	}
};
XsltForms_browser.assert = function(condition, message) {
	if (!condition && XsltForms_browser.debugConsole.isOpen()) {
		if (!XsltForms_globals.debugMode) {
			XsltForms_globals.debugMode = true;
			XsltForms_globals.debugging();
		}
		XsltForms_browser.debugConsole.write("Assertion failed: " + message);
		if (XsltForms_browser.isIE) { // Internet Explorer
			this.callstack = [];
			for (var caller = arguments.caller; caller; caller = caller.caller) {
				this.callstack.push(caller.name ? caller.name : "<anonymous>");
			}
		} else {
			try {
				XsltForms_undefined();
			} catch (e) {
				if (e.stack) {
					this.callstack = e.stack.split("\n");
					this.callstack.shift();
					this.callstack.shift();
				}
			}
		}
		if (this.callstack) {
			for (var i = 0, len = this.callstack.length; i < len; i++) {
				XsltForms_browser.debugConsole.write("> " + this.callstack[i]);
			}
		}
		throw new Error(message || "Assertion failed");
	}
};
XsltForms_browser.inArray = function(value, array) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (value === array[i]) {
			return true;
		}
	}
	return false;
};
XsltForms_browser.zeros = function(value, len, right) {
	var res = String(value);
	if (right) {
		while (res.length < len) {
			res = res + "0";
		}
	} else {
		while (res.length < len) {
			res = "0" + res;
		}
	}
	return res;
};
XsltForms_browser.getValue = function(node, format, serialize) {
	XsltForms_browser.assert(node);
	if (serialize) {
		return node.nodeType === Fleur.Node.ATTRIBUTE_NODE ? node.nodeValue : XsltForms_browser.saveNode(node, "application/xml");
	}
	var value = node.text !== undefined ? node.text : node.textContent;
	if (value && format) {
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
		if (schtyp.format && schtyp.validate(value)) {
			try { value = schtyp.format(value); } catch(e) { }
		}
	}
	return value;
};
XsltForms_browser.splitNode = function(node, separator, leftTrim, rightTrim) {
	XsltForms_browser.assert(node);
	var value = node.text !== undefined ? node.text : node.textContent;
	var values = value.split(separator);
	var arr = node.ownerDocument.createArray();
	for (var i = 0, l = values.length; i < l; i++) {
		if (leftTrim && rightTrim) {
			var m = values[i].replace(leftTrim, "").replace(rightTrim, "");
			if (m !== '') {
				arr.appendChild(node.ownerDocument.createTextNode(m));
			}
		} else {
			arr.appendChild(node.ownerDocument.createTextNode(values[i]));
		}
	}
	if (node.nodeType === Fleur.Node.TEXT_NODE) {
		node.parentNode.replaceChild(arr, node);
	} else {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		node.appendChild(arr);
	}
};
XsltForms_browser.getValueItemsetCopy = function(node) {
	XsltForms_browser.assert(node);
	var value = [];
	if (node.childNodes) {
		for (var i = 0, l = node.childNodes.length; i < l ; i++) {
			if (node.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE) {
				value.push(XsltForms_browser.saveNode(node.childNodes[i], "application/xml"));
			}
		}
	}
	return value;
};
XsltForms_browser.setValue = function(node, value) {
	XsltForms_browser.assert(node);
	if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
		node.nodeValue = value;
	} else if (XsltForms_browser.isIE && node.innerHTML && !(value instanceof Array)) {
		node.innerHTML = XsltForms_browser.escape(value);
	} else {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		if (value) {
			if (value instanceof Array) {
				for (var i = 0, l = value.length; i < l; i++) {
					var dummy = node.ownerDocument.createElement("dummy");
					node.appendChild(dummy);
					XsltForms_browser.loadNode(dummy, value[i], "application/xml");
				}
			} else {
				for (var j = 0, l2 = value.length; j < l2; j += 4096) {
					try {
						node.appendChild(node.ownerDocument.createTextNode(value.substr(j, 4096)));
					} catch (e) {
						XsltForms_browser.debugConsole.write("ERROR: Cannot set value " + value + " on " + XsltForms_browser.name2string(node) + "; " + e.message);
					}
				}
			}
		}
	}
};
XsltForms_browser.run = function(action, element, evt, synch, propagate) {
	XsltForms_xmlevents.EventContexts.push(evt);
	if (synch) {
		XsltForms_browser.dialog.show("statusPanel", null, false);
		setTimeout(function() { 
			XsltForms_globals.openAction("XsltForms_browser.run#1");
			action.execute(document.getElementById(element), null, evt);
			XsltForms_browser.dialog.hide("statusPanel", false);
			if (!propagate) {
				evt.stopPropagation();
			}
			XsltForms_globals.closeAction("XsltForms_browser.run#1");
		}, 1 );
	} else {
		XsltForms_globals.openAction("XsltForms_browser.run#2");
		action.execute(document.getElementById(element), null, evt);
		if (!propagate) {
			evt.stopPropagation();
		}
		XsltForms_globals.closeAction("XsltForms_browser.run#2");
	}
};
XsltForms_browser.getId = function(element) {
	if(element.id) {
		return element.id;
	}
	return element.parentNode.parentNode.parentNode.parentNode.id;
};
XsltForms_browser.show = function(el, type, value) {
	el.parentNode.lastChild.style.display = value? 'inline' : 'none';
};
XsltForms_browser.copyArray = function(source, dest) {
	if( dest ) {
		for (var i = 0, len = source.length; i < len; i++) {
			dest[i] = source[i];
		}
	}
};
XsltForms_browser.removeArrayItem = function(array, item) {
	var narr = [];
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] !== item ) {
			narr.push(array[i]);
		}
	}
	return narr;
};
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/, '');
};
String.prototype.addslashes = function() {
	return this.replace(/\\/g,"\\\\").replace(/\'/g,"\\'").replace(/\"/g,"\\\"");
};
function XsltForms_subform(subform, id, eltid) {
	this.subform = subform;
	this.id = id;
	this.eltid = eltid;
	if (eltid) {
		document.getElementById(eltid).xfSubform = this;
	} else {
		var b = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
		b.xfSubform = this;
	}
	this.models = [];
	this.schemas = [];
	this.instances = [];
	this.binds = [];
	this.xpaths = [];
	this.subforms = [];
	this.listeners = [];
	this.ready = false;
	if (subform) {
		subform.subforms.push(this);
	}
	XsltForms_subform.subforms[id] = this;
}
XsltForms_subform.subforms = {};
XsltForms_subform.prototype.construct = function() {
	for (var i = 0, len = this.instances.length; i < len; i++) {
		this.instances[i].construct(this);
	}
	XsltForms_browser.forEach(this.binds, "refresh");
	for (i = 0, len = this.instances.length; i < len; i++) {
		this.instances[i].revalidate();
	}
	XsltForms_xmlevents.dispatchList(this.models, "xforms-subform-ready");
	this.ready = true;
};
XsltForms_subform.prototype.dispose = function() {
	var scriptelt = document.getElementById(this.id + "-script");
	scriptelt.parentNode.removeChild(scriptelt);
	for (var h = 0, len0 = this.subforms.length; h < len0; h++) {
		this.subforms[0].dispose();
	}
	this.subforms = null;
	XsltForms_globals.dispose(document.getElementById(this.eltid));
	for (var i0 = 0, len00 = this.schemas.length; i0 < len00; i0++) {
		this.schemas[i0].dispose(this);
		this.schemas[i0] = null;
	}
	this.schemas = null;
	for (var j = 0, len2 = this.instances.length; j < len2; j++) {
		this.instances[j].dispose(this);
		this.instances[j] = null;
	}
	this.instances = null;
	for (var i = 0, len = this.models.length; i < len; i++) {
		this.models[i].dispose(this);
		this.models[i] = null;
	}
	this.models = null;
	for (var k = 0, len3 = this.xpaths.length; k < len3; k++) {
		this.xpaths[k].dispose(this);
		this.xpaths[k] = null;
	}
	this.xpaths = null;
	this.binds = null;
	XsltForms_subform.subforms[this.id] = null;
	var parentform = this.subform;
	if (parentform) {
		var parentsubforms = parentform.subforms;
		for (var l = 0, len4 = parentsubforms.length; l < len4; l++) {
			if (parentsubforms[l] === this) {
				if (l < len4 - 1) {
					parentsubforms[l] = parentsubforms[len4 - 1];
				}
				parentsubforms.pop();
				break;
			}
		}
	}
	for (var m = 0, len5 = this.listeners.length; m < len5; m++) {
		this.listeners[m].detach();
		this.listeners[m] = null;
	}
	this.listeners = null;
};
function XsltForms_binding(type, xpath, model, bind) {
	this.type = type;
	this.bind = bind? bind : null;
	this.xpath = xpath? XsltForms_xpath.get(xpath) : null;
	var modelelt = model;
	if( typeof model === "string" ) {
		modelelt = document.getElementById(model);
	}
	this.model = model? (modelelt ? modelelt.xfElement : model) : null;
	this.result = null;
}
XsltForms_binding.prototype.evaluate = function() {
	alert("Error");
};
XsltForms_binding.prototype.bind_evaluate = function(subform, ctx, varresolver, depsNodes, depsId, depsElements) {
	var result = null;
	if( typeof this.model === "string" ) {
		if (!document.getElementById(this.model)) {
			return null;
		}
		this.model = document.getElementById(this.model).xfElement;
	}
	if (this.bind) {
		if (typeof this.bind === "string") {
			var idel = document.getElementById(this.bind);
			if (!idel) {
				XsltForms_browser.debugConsole.write("Binding evaluation returned null for bind: " + this.bind); 
				return null;	// A 'null' signifies bind-ID not found.
			}
			this.bind = idel.xfElement;
		}
		result = this.bind.nodes;
		XsltForms_browser.copyArray(this.bind.depsNodes, depsNodes);
		XsltForms_browser.copyArray(this.bind.depsElements, depsElements);
	} else {
		var exprCtx = new XsltForms_exprContext(subform, !ctx || (this.model && this.model !== document.getElementById(XsltForms_browser.getDocMeta(ctx.ownerDocument, "model")).xfElement) ? this.model ? this.model.getInstanceDocument().documentElement : XsltForms_globals.defaultModel.getInstanceDocument().documentElement : ctx,
			null, null, null, null, ctx, varresolver, depsNodes, depsId, depsElements, this.model);
		result = this.xpath.xpath_evaluate(exprCtx);
	}
	XsltForms_browser.assert(this.type || !result || typeof result === "object", "Binding evaluation didn't returned a nodeset but '"+(typeof result === "object" ? "" : result)+"' for " + (this.bind ? "bind: " + this.bind : "XPath expression: " + this.xpath.expression));
	switch (this.type) {
		case "xsd:string": 
			result = XsltForms_globals.stringValue(result);
			break;
		case "xsd:boolean":
			result = XsltForms_globals.booleanValue(result);
			break;
	}
	this.result = result;
	return result;
};
function XsltForms_mipbinding(type, xpath, model) {
	this.binding = new XsltForms_binding(type, xpath, model, null);
	this.nodes = [];
	this.depsElements = [];
	this.depsNodes = [];
}
XsltForms_mipbinding.prototype.evaluate = function(ctx, node) {
	var deps = null;
	var depsN = null;
	var curn = this.nodes.length;
	for (var i0 = 0, len0 = this.nodes.length; i0 < len0; i0++ ) {
		if (node === this.nodes[i0].node) {
			deps = this.nodes[i0].deps;
			depsN = this.nodes[i0].depsN;
			curn = i0;
			break;
		}
	}
	if (!deps && !depsN) {
		this.nodes.push({node: node, deps: [], depsN: []});
		deps = depsN = [];
	}
	var build = !XsltForms_globals.ready || (deps.length === 0);
	var changes = XsltForms_globals.changes;
	for (var i1 = 0, len1 = depsN.length; !build && i1 < len1; i1++) {
		build = depsN[i1].nodeName === "";
	}
	for (var i = 0, len = deps.length; !build && i < len; i++) {
		var el = deps[i];
		for (var j = 0, len2 = changes.length; !build && j < len2; j++) {
			if (el === changes[j]) {
				if (el.instances) { //model
					if (el.rebuilded || el.newRebuilded) {
						build = true;
					} else {
						for (var k = 0, len3 = depsN.length; !build && k < len3; k++) {
							build = XsltForms_browser.inArray(depsN[k], el.nodesChanged);
						}
					}
				} else {
					build = true;
				}
			}
		}
	}
	if (build) {
		depsN.length = 0;
		deps.length = 0;
		this.nodes[curn].result = this.binding.bind_evaluate(ctx.subform, ctx.node, null, this.nodes[curn].depsN, null, this.nodes[curn].deps);
		return this.nodes[curn].result;
	} else {
		return this.nodes[curn].result;
	}
};
XsltForms_mipbinding.prototype.nodedispose_ = function(node) {
	for (var i = 0, len = this.nodes.length; i < len; i++ ) {
		if (node === this.nodes[i].node) {
			this.nodes[i] = this.nodes[len-1];
			this.nodes.pop();
			break;
		}
	}
};
XsltForms_mipbinding.nodedispose = function(node) {
	var bindids = XsltForms_browser.getMeta(node, "bind");
	if (bindids) {
		var binds = bindids.split(" ");
		for (var j = 0, len2 = binds.length; j < len2; j++) {
			var bind = document.getElementById(binds[j]).xfElement;
			if (bind.required) {
				bind.required.nodedispose_(node);
			}
			if (bind.relevant) {
				bind.relevant.nodedispose_(node);
			}
			if (bind.readonly) {
				bind.readonly.nodedispose_(node);
			}
			if (bind.constraint) {
				bind.constraint.nodedispose_(node);
			}
			if (bind.calculate) {
				bind.calculate.nodedispose_(node);
			}
		}
	}
	for (var n = node.firstChild; n; n = n.nextSibling) {
		if (n.nodeType === Fleur.Node.ELEMENT_NODE) {
			XsltForms_mipbinding.nodedispose(n);
		}
	}
};
var XsltForms_idManager = {
	cloneId : function(element) {
		XsltForms_browser.assert(element && element.id);
		var id = element.getAttribute("oldid") || element.id;
		var list = this.data[id];
		if (!list) {
			list = [];
			this.data[id] = list;
		}
		var newId = "clonedId" + this.index++;
		list.push(newId);
		element.setAttribute("oldid", id);
		element.id = newId;
	},
    find : function(id) {
		var ids = this.data[id];
		if (ids) {
			for (var i = 0, len = ids.length; i < len; i++) {
				var element = document.getElementById(ids[i]);
				if (element) {
					var parentElt = element.parentNode;
					while (parentElt.nodeType === Fleur.Node.ELEMENT_NODE) {
						if (XsltForms_browser.hasClass(parentElt, "xforms-repeat-item")) {
							if (XsltForms_browser.hasClass(parentElt, "xforms-repeat-item-selected")) {
								return element;
							}
							break;
						}
						parentElt = parentElt.parentNode;
					}
				}
			}
		}
		var res = document.getElementById(id);
		return res;
	},
	clear : function() {
		for (var i = 0, len = this.data.length; i < len; i++) {
			this.data[i] = null;
		}
		this.data = [];
		this.index = 0;
	},
	data : [],
	index : 0
};
function XsltForms_listener(subform, observer, evtTarget, evtname, phase, handler, defaultaction) {
	if (!observer) {
		return;
	}
	phase = phase || "default";
	if (phase !== "default" && phase !== "capture") {
		XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", 
			"Unknown event-phase(" + phase +") for event(" + evtname + ")"+(observer ? " on element(" + observer.id + ")":"") + "!");
		return;
	}
	this.subform = subform;
	this.observer = observer;
	this.evtTarget = evtTarget;
	this.name = evtname;
	this.evtName = document.addEventListener? evtname : "errorupdate";
	this.phase = phase;
	this.handler = handler;
	this.defaultaction = defaultaction;
	if (observer.listeners) {
		if (evtname === "xforms-subform-ready") {
			for (var i = 0, l = observer.listeners.length; i < l; i++) {
				if (observer.listeners[i].name === evtname) {
					return;
				}
			}
		}
	} else {
		observer.listeners = [];
	}
	observer.listeners.push(this);
	this.callback = function(evt) {
		if (!document.addEventListener) {
			evt = evt || window.event;
			evt.target = evt.srcElement;
			evt.currentTarget = observer;
			XsltForms_browser.debugConsole.write("observer:"+observer.id);
			XsltForms_browser.debugConsole.write("name:"+evtname);
			XsltForms_browser.debugConsole.write("target:"+evt.target.id);
			XsltForms_browser.debugConsole.write("trueName:"+evt.trueName);
			if (evt.trueName && evt.trueName !== evtname) {
				return;
			}
			if (!evt.phase) {
				if (phase === "capture") {
					return;
				}
			} else if (evt.phase !== phase) {
				return;
			}
			if (phase === "capture") {
				evt.cancelBubble = true;
			}
			evt.preventDefault = function() {
				this.returnValue = false;
			};
			evt.stopPropagation = function() {
				this.cancelBubble = true;
				this.stopped      = true;
			};
		}
		var effectiveTarget = true;
		if (evt.target && evt.target.nodeType === 3) {
			evt.target = evt.target.parentNode;
		}
		if (evt.currentTarget && evt.type === "DOMActivate" && (evt.target.nodeName.toUpperCase() === "BUTTON" || evt.target.nodeName.toUpperCase() === "A" || (XsltForms_browser.isChrome && (evt.eventPhase === 3 || evt instanceof UIEvent)  && this.xfElement  && this.xfElement.controlName === "trigger"))  && !XsltForms_browser.isFF2) {
			effectiveTarget = false;
		}
		if (evt.eventPhase === 3 && evt.target.xfElement && evt.target === evt.currentTarget && !XsltForms_browser.isFF2) {
			effectiveTarget = false;
		}
		if (evtTarget && evt.target !== evtTarget) {
			effectiveTarget = false;
		}
		XsltForms_browser.debugConsole.write("effectiveTarget:"+effectiveTarget);
		if (effectiveTarget) { // && !(typeof UIEvent !== 'undefined' && evt instanceof UIEvent)) {
			XsltForms_browser.debugConsole.write("Captured event " + evtname + " on <" + evt.target.nodeName +
				(evt.target.className? " class=\"" + (typeof evt.target.className === "string" ? evt.target.className : evt.target.className.baseVal) + "\"" : "") +
				(evt.target.id? " id=\"" + evt.target.id + "\"" : "") + "/>");
			handler.call(evt.target, evt);
		}
		if (!defaultaction) {
			evt.preventDefault();
		}
		if (!document.addEventListener) {
			try {
				evt.preventDefault = null;
				evt.stopPropagation = null;
			} catch (e) {}
		}
	};
	this.attach();
	if (subform) {
		subform.listeners.push(this);
	}
}
XsltForms_listener.destructs = [];
XsltForms_listener.prototype.attach = function() {
	XsltForms_browser.events.attach(this.observer, this.evtName, this.callback, this.phase === "capture");
	if (this.evtName === "xforms-model-destruct") {
		XsltForms_listener.destructs.push({observer: this.observer, callback: this.callback});
	}
};
XsltForms_listener.prototype.detach = function() {
	if( this.observer.listeners ) {
		for (var i = 0, l = this.observer.listeners.length; i < l; i++) {
			if (this.observer.listeners[i] === this) {
				this.observer.listeners.splice(i, 1);
				break;
			}
		}
	}
	XsltForms_browser.events.detach(this.observer, this.evtName, this.callback, this.phase === "capture");
};
XsltForms_listener.prototype.clone = function(element) {
	return new XsltForms_listener(this.subform, element, this.evtTarget, this.name, this.phase, this.handler);
};
var XsltForms_xmlevents = {
    REGISTRY : [],
	EventContexts : [],
	define : function(evtname, bubbles, cancelable, defaultAction) {
		XsltForms_xmlevents.REGISTRY[evtname] = {
			bubbles:       bubbles,
			cancelable:    cancelable,
			defaultAction: defaultAction? defaultAction : function() { }
		};
	},
	makeEventContext : function(evcontext, type, targetid, bubbles, cancelable) {
		if (!evcontext) {
			evcontext = {};
		}
		if (!evcontext.type) {
			evcontext.type = type;
		}
		try {
			evcontext.targetid = targetid;
			evcontext.bubbles = bubbles;
			evcontext.cancelable = cancelable;
		} catch (e) {
		}
		return evcontext;
	}
};
XsltForms_xmlevents.dispatchList = function(list, evtname) {
	for (var id = 0, len = list.length; id < len; id++) {
		XsltForms_xmlevents.dispatch(list[id], evtname);
	}
};
XsltForms_xmlevents.dispatch = function(target, evtname, type, bubbles, cancelable, defaultAction, evcontext) {
	if (!target) {
		XsltForms_browser.debugConsole.write("ERROR: Cannot dispatch event " + name + " as the target is null");
		return;
	}
	target = target.element || target;
	XsltForms_browser.assert(target && typeof(target.nodeName) !== "undefined");
	XsltForms_browser.debugConsole.write("Dispatching event " + evtname + " on <" + target.nodeName +
		(target.className? " class=\"" + (typeof target.className === "string" ? target.className : target.className.baseVal) + "\"" : "") +
		(target.id? " id=\"" + target.id + "\"" : "") + "/>");
	var reg = XsltForms_xmlevents.REGISTRY[evtname];
	if (reg) {
		bubbles = reg.bubbles;
		cancelable = reg.cancelable;
		defaultAction = reg.defaultAction;
	}
	if (!defaultAction) {
		defaultAction = function() { };
	}
	evcontext = XsltForms_xmlevents.makeEventContext(evcontext, evtname, target.id, bubbles, cancelable);
	XsltForms_xmlevents.EventContexts.push(evcontext);
	try {
		var evt, res;
		if (target.dispatchEvent) {
			evt = document.createEvent("Event");
			evt.initEvent(evtname, bubbles, cancelable);
			res = target.dispatchEvent(evt);
			if ((res && !evt.stopped) || !cancelable) {
				defaultAction.call(target.xfElement, evt);
			}
		} else {
			var canceler = null;
			var ancestors = [];
			for (var a = target.parentNode; a; a = a.parentNode) {
				ancestors.unshift(a);
			}
			for (var i = 0, len = ancestors.length; i < len; i++) {
				evt = document.createEventObject();
				evt.trueName = evtname;
				evt.phase = "capture";
				ancestors[i].fireEvent("onerrorupdate", evt);
				if (evt.stopped) {
					return;
				}
			}
			evt = document.createEventObject();
			evt.trueName = evtname;
			evt.phase = "capture";
			evt.target = target;
			target.fireEvent("onerrorupdate" , evt);
			if (!bubbles) {
				canceler = new XsltForms_listener(null, target, null, evtname, "default", function(evt) { evt.cancelBubble = true; });
			}
			evt = document.createEventObject();
			evt.trueName = evtname;
			evt.phase = "default";
			evt.target = target;
			res = target.fireEvent("onerrorupdate", evt);
			try {
				if ((res && !evt.stopped) || !cancelable) {
					defaultAction.call(target.xfElement, evt);
				}
				if (!bubbles) {
					canceler.detach();
				}
			} catch (e2) {
			}
		}
	} catch (e) {
		alert("XSLTForms Exception\n--------------------------\n\nError dispatching event '"+evtname+"' :\n\n"+(typeof(e.stack)==="undefined"?"":e.stack)+"\n\n"+(e.name?e.name+(e.message?"\n\n"+e.message:""):e));
	} finally {
		if (XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1].rheadsdoc) {
			XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1].rheadsdoc = null;
		}
		if (XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1]["response-body"]) {
			XsltForms_xmlevents.EventContexts[XsltForms_xmlevents.EventContexts.length - 1]["response-body"] = null;
		}
		XsltForms_xmlevents.EventContexts.pop();
	}
};
XsltForms_xmlevents.define("xforms-model-construct", true, false, function() { this.construct(); });
XsltForms_xmlevents.define("xforms-model-construct-done", true, false);
XsltForms_xmlevents.define("xforms-ready", true, false);
XsltForms_xmlevents.define("xforms-model-destruct", true, false);
XsltForms_xmlevents.define("xforms-rebuild", true, true, function() { this.rebuild(); });
XsltForms_xmlevents.define("xforms-recalculate", true, true, function() { this.recalculate(); });
XsltForms_xmlevents.define("xforms-revalidate", true, true, function() { this.revalidate(); });
XsltForms_xmlevents.define("xforms-reset", true, true, function() { this.reset(); });
XsltForms_xmlevents.define("xforms-submit", true, true, function() { this.submit(); });
XsltForms_xmlevents.define("xforms-submit-serialize", true, false);
XsltForms_xmlevents.define("xforms-refresh", true, true, function() { this.refresh(); });
XsltForms_xmlevents.define("xforms-focus", true, true, function() { this.focus ? this.focus() : this.element.focus(); } );
XsltForms_xmlevents.define("DOMActivate", true,  true);
XsltForms_xmlevents.define("DOMFocusIn", true, false);
XsltForms_xmlevents.define("DOMFocusOut", true, false);
XsltForms_xmlevents.define("xforms-select", true, false);
XsltForms_xmlevents.define("xforms-deselect", true, false);
XsltForms_xmlevents.define("xforms-value-changed", true, false);
XsltForms_xmlevents.define("xforms-insert", true, false);
XsltForms_xmlevents.define("xforms-delete", true, false);
XsltForms_xmlevents.define("xforms-valid", true, false);
XsltForms_xmlevents.define("xforms-invalid", true, false);
XsltForms_xmlevents.define("xforms-enabled", true, false);
XsltForms_xmlevents.define("xforms-disabled", true, false);
XsltForms_xmlevents.define("xforms-optional", true, false);
XsltForms_xmlevents.define("xforms-required", true, false);
XsltForms_xmlevents.define("xforms-readonly", true, false);
XsltForms_xmlevents.define("xforms-readwrite", true, false);
XsltForms_xmlevents.define("xforms-in-range", true, false);
XsltForms_xmlevents.define("xforms-out-of-range", true, false);
XsltForms_xmlevents.define("xforms-submit-done", true, false);
XsltForms_xmlevents.define("xforms-submit-error", true, false);
XsltForms_xmlevents.define("xforms-compute-exception", true, false);
XsltForms_xmlevents.define("xforms-binding-exception", true, false);
XsltForms_xmlevents.define("ajx-start", true, true, function(evt) { evt.target.xfElement.start(); });
XsltForms_xmlevents.define("ajx-stop", true, true, function(evt) { evt.target.xfElement.stop(); });
XsltForms_xmlevents.define("ajx-time", true, true);
XsltForms_xmlevents.define("xforms-dialog-open", true, true, function(evt) { XsltForms_browser.dialog.show(evt.target, null, true); });
XsltForms_xmlevents.define("xforms-dialog-close", true, true, function(evt) { XsltForms_browser.dialog.hide(evt.target, true); });
XsltForms_xmlevents.define("xforms-load-done", true, false);
XsltForms_xmlevents.define("xforms-load-error", true, false);
XsltForms_xmlevents.define("xforms-unload-done", true, false);
XsltForms_xmlevents.define("xforms-upload-done", true, false);
XsltForms_xmlevents.define("xforms-upload-error", true, false);
function ArrayExpr(exprs) {
	this.exprs = exprs;
}
ArrayExpr.prototype.evaluate = function(ctx) {
	var nodes = [];
	for (var i = 0, len = this.exprs.length; i < len; i++) {
		nodes[i] = this.exprs[i].evaluate(ctx);
	}
	return nodes;
};
function XsltForms_binaryExpr(expr1, op, expr2) {
	this.expr1 = expr1;
	this.expr2 = expr2;
	this.op = op.replace("&gt;", ">").replace("&lt;", "<");
}
XsltForms_binaryExpr.prototype.evaluate = function(ctx) {
	var v1 = this.expr1.evaluate(ctx);
	var v2 = this.expr2.evaluate(ctx);
	var n1;
	var n2;
	if (v1 && v2 && (((typeof v1) === "object" && v1.length > 1) || ((typeof v2) === "object" && v2.length > 1)) && 
		(this.op === "=" || this.op === "!=" || this.op === "<" || this.op === "<=" || this.op === ">" || this.op === ">=")) {
		if (typeof v1 !== "object") {
			v1 = [v1];
		}
		if (typeof v2 !== "object") {
			v2 = [v2];
		}
		for (var i = 0, len = v1.length; i < len; i++) {
			n1 = XsltForms_globals.numberValue([v1[i]]);
			if (isNaN(n1)) {
				n1 = XsltForms_globals.stringValue([v1[i]]);
			}
			for (var j = 0, len1 = v2.length; j < len1; j++) {
				n2 = XsltForms_globals.numberValue([v2[j]]);
				if (isNaN(n2)) {
					n2 = XsltForms_globals.stringValue([v2[j]]);
				}
				switch (this.op) {
					case '=':
						if (n1 == n2) {
							return true;
						}
						break;
					case '!=':
						if (n1 != n2) {
							return true;
						}
						break;
					case '<':
						if (n1 < n2) {
							return true;
						}
						break;
					case '<=':
						if (n1 <= n2) {
							return true;
						}
						break;
					case '>':
						if (n1 > n2) {
							return true;
						}
						break;
					case '>=':
						if (n1 >= n2) {
							return true;
						}
						break;
				}
			}
		}
		return false;
	}
	n1 = XsltForms_globals.numberValue(v1);
	n2 = XsltForms_globals.numberValue(v2);
	if (isNaN(n1) || isNaN(n2)) {
		n1 = XsltForms_globals.stringValue(v1);
		n2 = XsltForms_globals.stringValue(v2);
	}
	var res = 0;
	switch (this.op) {
		case 'or'  : res = XsltForms_globals.booleanValue(v1) || XsltForms_globals.booleanValue(v2); break;
		case 'and' : res = XsltForms_globals.booleanValue(v1) && XsltForms_globals.booleanValue(v2); break;
		case '+'   : res = n1 + n2; break;
		case '-'   : res = n1 - n2; break;
		case '*'   : res = n1 * n2; break;
		case 'mod' : res = n1 % n2; break;
		case 'div' : res = n1 / n2; break;
		case '='   : res = n1 === n2; break;
		case '!='  : res = n1 !== n2; break;
		case '<'   : res = n1 < n2; break;
		case '<='  : res = n1 <= n2; break;
		case '>'   : res = n1 > n2; break;
		case '>='  : res = n1 >= n2; break;
	}
	return typeof res === "number" ? Math.round(res*1000000)/1000000 : res;
};
function XsltForms_exprContext(subform, node, position, nodelist, parentNode, nsresolver, current, varresolver, depsNodes, depsId, depsElements) {
	this.subform = subform;
	this.node = node;
	this.current = current || node;
	if(!position) {
		var repeat = node && node.nodeType ? XsltForms_browser.getMeta(node, "repeat") : null;
		if(repeat) {
			var eltrepeat = document.getElementById(repeat);
			if (eltrepeat) {
				var xrepeat = eltrepeat.xfElement;
				var len;
				for(position = 1, len = xrepeat.nodes.length; position <= len; position++) {
					if(node === xrepeat.nodes[position-1]) {
						break;
					}
				}
			}
		}
	}
	this.position = position || 1;
	this.nodelist = nodelist || [ node ];
	this.parent = parentNode;
	this.root = parentNode ? parentNode.root : node ? node.ownerDocument : null;
	this.nsresolver = nsresolver;
	this.varresolver = varresolver;
	this.depsId = depsId;
	this.initDeps(depsNodes, depsElements);
}
XsltForms_exprContext.prototype.clone = function(node, position, nodelist) {
	return new XsltForms_exprContext(this.subform, node || this.node, 
		typeof position === "undefined" ? this.position : position,
		nodelist || this.nodelist, this, this.nsresolver, this.current, this.varresolver,
		this.depsNodes, this.depsId, this.depsElements);
};
XsltForms_exprContext.prototype.setNode = function(node, position) {
	this.node = node;
	this.position = position;
};
XsltForms_exprContext.prototype.initDeps = function(depsNodes, depsElements) {
	this.depsNodes = depsNodes;
	this.depsElements = depsElements;
};
XsltForms_exprContext.prototype.addDepNode = function(node) {
	var deps = this.depsNodes;
	if (deps && node.nodeType && node.nodeType !== Fleur.Node.DOCUMENT_NODE && (!this.depsId || !XsltForms_browser.inValueMeta(node, "depfor", this.depsId))) { // !inArray(node, deps)) {
		if (this.depsId) {
			XsltForms_browser.addValueMeta(node, "depfor", this.depsId);
		}
		deps.push(node);
	}
};
XsltForms_exprContext.prototype.addDepElement = function(element) {
	var deps = this.depsElements;
	if (deps && !XsltForms_browser.inArray(element, deps)) {
		deps.push(element);
	}
};
function XsltForms_tokenExpr(m) {
	this.value = m;
}
XsltForms_tokenExpr.prototype.evaluate = function() {
	return XsltForms_globals.stringValue(this.value);
};
function XsltForms_unaryMinusExpr(expr) {
	this.expr = expr;
}
XsltForms_unaryMinusExpr.prototype.evaluate = function(ctx) {
	return -XsltForms_globals.numberValue(this.expr.evaluate(ctx));
};
function XsltForms_cteExpr(value) {
	this.value = XsltForms_browser.isEscaped ? typeof value === "string" ? XsltForms_browser.unescape(value) : value : value;
}
XsltForms_cteExpr.prototype.evaluate = function() {
	return this.value;
};
function XsltForms_filterExpr(expr, predicate) {
	this.expr = expr;
	this.predicate = predicate;
}
XsltForms_filterExpr.prototype.evaluate = function(ctx) {
	var nodes = XsltForms_globals.nodeSetValue(this.expr.evaluate(ctx));
	for (var i = 0, len = this.predicate.length; i < len; ++i) {
		var nodes0 = nodes;
		nodes = [];
		for (var j = 0, len1 = nodes0.length; j < len1; ++j) {
			var n = nodes0[j];
			var newCtx = ctx.clone(n, j, nodes0);
			if (XsltForms_globals.booleanValue(this.predicate[i].evaluate(newCtx))) {
				nodes.push(n);
			}
		}
	}
	return nodes;
};
function XsltForms_locationExpr(absolute) {
	this.absolute = absolute;
	this.steps = [];
	for (var i = 1, len = arguments.length; i < len; i++) {
		this.steps.push(arguments[i]);
	}
}
XsltForms_locationExpr.prototype.evaluate = function(ctx) {
	var start = (this.absolute && ctx.root )|| !ctx.node ? ctx.root : ctx.node;
	var m = XsltForms_browser.getDocMeta((start.nodeType === Fleur.Node.DOCUMENT_NODE ? start : start.ownerDocument), "model");
	if (m) {
		ctx.addDepElement(document.getElementById(m).xfElement);
	}
	var nodes = [];
	if (this.steps[0]) {
		this.xPathStep(nodes, this.steps, 0, start, ctx);
	} else {
		nodes[0] = start;
	}
	return nodes;
};
XsltForms_locationExpr.prototype.xPathStep = function(nodes, steps, step, input, ctx) {
	var s = steps[step];
	var nodelist = s.evaluate(ctx.clone(input));
	for (var i = 0, len = nodelist.length; i < len; ++i) {
		var node = nodelist[i];
		if (step === steps.length - 1) {
			if (!XsltForms_browser.inArray(node, nodes)) {
				nodes.push(node);
			}
			ctx.addDepNode(node);
		} else {
			this.xPathStep(nodes, steps, step + 1, node, ctx);
		}
	}
};
function XsltForms_nodeTestAny() {
}
XsltForms_nodeTestAny.prototype.evaluate = function(node) {
	var n = node.localName || node.baseName;
    return !n || (n.substr(0, 10) !== "xsltforms_" && node.namespaceURI !== "http://www.w3.org/2000/xmlns/");
};
function XsltForms_nodeTestName(prefix, tname) {
    this.prefix = prefix;
    this.name = tname;
	this.uppercase = tname.toUpperCase();
	this.wildcard = tname === "*";
	this.notwildcard = tname !== "*";
	this.notwildcardprefix = prefix !== "*";
	this.hasprefix = prefix && this.notwildcardprefix;
}
XsltForms_nodeTestName.prototype.evaluate = function(node, nsresolver, csensitive) {
	var nodename = node.localName || node.baseName;
	if (this.notwildcard && (nodename !== this.name || (csensitive && nodename.toUpperCase() !== this.uppercase))) {
		return false;
	}
	if (this.wildcard) {
		return this.hasprefix ? node.namespaceURI === nsresolver.lookupNamespaceURI(this.prefix) : true;
	}
	var ns = node.namespaceURI;
	return this.hasprefix ? ns === nsresolver.lookupNamespaceURI(this.prefix) :
		(this.notwildcardprefix ? !ns || ns === "" || ns === nsresolver.lookupNamespaceURI("") : true);
};
function XsltForms_nodeTestPI(target) {
	this.target = target;
}
XsltForms_nodeTestPI.prototype.evaluate = function(node) {
	return node.nodeType === Fleur.Node.PROCESSING_INSTRUCTION_NODE &&
		(!this.target || node.nodeName === this.target);
};
function XsltForms_nodeTestType(type) {
	this.type = type;
}
XsltForms_nodeTestType.prototype.evaluate = function(node) {
	return node.nodeType === this.type;
};
function XsltForms_nsResolver() {
	this.map = {};
	this.notfound = false;
}
XsltForms_nsResolver.prototype.registerAll = function(resolver) {
	for (var prefix in resolver.map) {
		if (resolver.map.hasOwnProperty(prefix)) {
			this.map[prefix] = resolver.map[prefix];
		}
	}
};
XsltForms_nsResolver.prototype.register = function(prefix, uri) {
	this.map[prefix] = uri;
	if( uri === "notfound" ) {
		this.notfound = true;
	}
};
XsltForms_nsResolver.prototype.registerNotFound = function(prefix, uri) {
	if( this.map[prefix] === "notfound" ) {
		this.map[prefix] = uri;
		for (var p in this.map) {
			if (this.map.hasOwnProperty(p)) {
				if (this.map[p] === "notfound") {
					this.notfound = true;
				}
			}
		}
	}
};
XsltForms_nsResolver.prototype.lookupNamespaceURI = function(prefix) {
	return this.map[prefix];
};
function XsltForms_pathExpr(filter, rel) {
	this.filter = filter;
	this.rel = rel;
}
XsltForms_pathExpr.prototype.evaluate = function(ctx) {
	var nodes = XsltForms_globals.nodeSetValue(this.filter.evaluate(ctx));
	var nodes1 = [];
	for (var i = 0, len = nodes.length; i < len; i++) {
		var newCtx = ctx.clone(nodes[i], i, nodes);
		var nodes0 = XsltForms_globals.nodeSetValue(this.rel.evaluate(newCtx));
		for (var j = 0, len1 = nodes0.length; j < len1; j++) {
			nodes1.push(nodes0[j]);
		}
	}
	return nodes1;
};
function XsltForms_predicateExpr(expr) {
	this.expr = expr;
}
XsltForms_predicateExpr.prototype.evaluate = function(ctx) {
	var v = this.expr.evaluate(ctx);
	return typeof v === "number" ? ctx.position === v : XsltForms_globals.booleanValue(v);
};
function XsltForms_stepExpr(axis, nodetest) {
	this.axis = axis;
	this.nodetest = nodetest;
	this.predicates = [];
	for (var i = 2, len = arguments.length; i < len; i++) {
		this.predicates.push(arguments[i]);
	}
}
XsltForms_stepExpr.prototype.evaluate = function(ctx) {
	var input = ctx.node;
	var list = [];
	switch(this.axis) {
		case XsltForms_xpathAxis.ANCESTOR_OR_SELF :
			XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			if (input.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
				input = input.ownerElement ? input.ownerElement : input.selectSingleNode("..");
				XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			} else if (input.nodeType === Fleur.Node.ENTRY_NODE) {
				input = input.ownerMap;
				XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			}
			for (var pn = input.parentNode; pn.parentNode; pn = pn.parentNode) {
				XsltForms_stepExpr.push(ctx, list, pn, this.nodetest);
			}
			break;
		case XsltForms_xpathAxis.ANCESTOR :
			if (input.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
				input = input.ownerElement ? input.ownerElement : input.selectSingleNode("..");
				XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			} else if (input.nodeType === Fleur.Node.ENTRY_NODE) {
				input = input.ownerMap;
				XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			}
			for (var pn2 = input.parentNode; pn2.parentNode; pn2 = pn2.parentNode) {
				XsltForms_stepExpr.push(ctx, list, pn2, this.nodetest);
			}
			break;
		case XsltForms_xpathAxis.ATTRIBUTE :
			XsltForms_stepExpr.pushList(ctx, list, input.attributes, this.nodetest, !input.namespaceURI || input.namespaceURI === "http://www.w3.org/1999/xhtml");
			break;
		case XsltForms_xpathAxis.CHILD :
			XsltForms_stepExpr.pushList(ctx, list, input.childNodes, this.nodetest);
			break;
		case XsltForms_xpathAxis.DESCENDANT_OR_SELF :
			XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			XsltForms_stepExpr.pushDescendants(ctx, list, input, this.nodetest);
			break;
		case XsltForms_xpathAxis.DESCENDANT :
			XsltForms_stepExpr.pushDescendants(ctx, list, input, this.nodetest);
			break;
		case XsltForms_xpathAxis.ENTRY :
			XsltForms_stepExpr.pushList(ctx, list, input.entries, this.nodetest);
			break;
		case XsltForms_xpathAxis.FOLLOWING :
			var n = input.nodeType === Fleur.Node.ATTRIBUTE_NODE ? (input.ownerElement ? input.ownerElement : input.selectSingleNode("..")) : (input.nodeType === Fleur.Node.ENTRY_NODE ? input.ownerMap : input);
			while (n.nodeType !== Fleur.Node.DOCUMENT_NODE) {
				for (var nn = n.nextSibling; nn; nn = nn.nextSibling) {
					XsltForms_stepExpr.push(ctx, list, nn, this.nodetest);
					XsltForms_stepExpr.pushDescendants(ctx, list, nn, this.nodetest);
				}
				n = n.parentNode;
			}
			break;
		case XsltForms_xpathAxis.FOLLOWING_SIBLING :
			for (var ns = input.nextSibling; ns; ns = ns.nextSibling) {
				XsltForms_stepExpr.push(ctx, list, ns, this.nodetest);
			}
			break;
		case XsltForms_xpathAxis.NAMESPACE : 
			alert('not implemented: axis namespace');
			break;
		case XsltForms_xpathAxis.PARENT :
			if (input.parentNode) {
				XsltForms_stepExpr.push(ctx, list, input.parentNode, this.nodetest);
			} else {
				if (input.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
					XsltForms_stepExpr.push(ctx, list, input.ownerElement ? input.ownerElement : input.selectSingleNode(".."), this.nodetest);
				} else if (input.nodeType === Fleur.Node.ENTRY_NODE) {
					XsltForms_stepExpr.push(ctx, list, input.ownerMap, this.nodetest);
				}
			}
			break;
		case XsltForms_xpathAxis.PRECEDING :
			var p = input.nodeType === Fleur.Node.ATTRIBUTE_NODE ? (input.ownerElement ? input.ownerElement : input.selectSingleNode("..")) : (input.nodeType === Fleur.Node.ENTRY_NODE ? input.ownerMap : input);
			while (p.nodeType !== Fleur.Node.DOCUMENT_NODE) {
				for (var ps = p.previousSibling; ps; ps = ps.previousSibling) {
					XsltForms_stepExpr.pushDescendantsRev(ctx, list, ps, this.nodetest);
					XsltForms_stepExpr.push(ctx, list, ps, this.nodetest);
				}
				p = p.parentNode;
			}
			break;
		case XsltForms_xpathAxis.PRECEDING_SIBLING :
			for (var ps2 = input.previousSibling; ps2; ps2 = ps2.previousSibling) {
				XsltForms_stepExpr.push(ctx, list, ps2, this.nodetest);
			}
			break;
		case XsltForms_xpathAxis.SELF :
			XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
			break;
		default :
			throw new Error({name:'ERROR -- NO SUCH AXIS: ' + this.axis});
	}
	for (var i = 0, len = this.predicates.length; i < len; i++) {
		var pred = this.predicates[i];
		var newList = [];
		for (var j = 0, len1 = list.length; j < len1; j++) {
			var x = list[j];
			var newCtx = ctx.clone(x, j + 1, list);
			if (XsltForms_globals.booleanValue(pred.evaluate(newCtx))) {
				newList.push(x);
			}
		}
		list = newList;
	}
	return list;
};
XsltForms_stepExpr.push = function(ctx, list, node, test, csensitive) {
	if (test.evaluate(node, ctx.nsresolver, csensitive) && !XsltForms_browser.inArray(node, list)) {
		list[list.length] = node;
	}
};
XsltForms_stepExpr.pushList = function(ctx, list, l, test, csensitive) {
	for (var i = 0, len = l ? l.length : 0; i < len; i++) {
		XsltForms_stepExpr.push(ctx, list, l[i], test, csensitive);
	}
};
XsltForms_stepExpr.pushDescendants = function(ctx, list, node, test) {
	for (var n = node.firstChild; n; n = n.nextSibling) {
		XsltForms_stepExpr.push(ctx, list, n, test);
		XsltForms_stepExpr.pushDescendants(ctx, list, n, test);
	}
};
XsltForms_stepExpr.pushDescendantsRev = function(ctx, list, node, test) {
	for (var n = node.lastChild; n; n = n.previousSibling) {
		XsltForms_stepExpr.push(ctx, list, n, test);
		XsltForms_stepExpr.pushDescendantsRev(ctx, list, n, test);
	}
};
function XsltForms_unionExpr(expr1, expr2) {
	this.expr1 = expr1;
	this.expr2 = expr2;
}
XsltForms_unionExpr.prototype.evaluate = function(ctx) {
	var nodes1 = XsltForms_globals.nodeSetValue(this.expr1.evaluate(ctx));
	var nodes2 = XsltForms_globals.nodeSetValue(this.expr2.evaluate(ctx));
	var len1 = nodes1.length;
	for (var i2 = 0, len = nodes2.length; i2 < len; i2++) {
		var found = false;
		for (var i1 = 0; i1 < len1; i1++) {
			found = nodes1[i1] === nodes2[i2];
			if (found) {
				break;
			}
		}
		if (!found) {
			nodes1.push(nodes2[i2]);
		}
	}
	return nodes1;
};
function XsltForms_varRef(vname) {
	this.name = vname;
}
XsltForms_varRef.prototype.evaluate = function(ctx) {
		if (!ctx.varresolver || !ctx.varresolver[this.name]) {
			return "";
		}
		if (typeof ctx.varresolver[this.name] === "string") {
			var varxf = document.getElementById(ctx.varresolver[this.name]).xfElement;
			for (var i = 0, l = varxf.depsNodesRefresh.length; i < l ; i++) {
				ctx.addDepNode(varxf.depsNodesRefresh[i]);
			}
			for (var j = 0, l2 = varxf.depsElements.length; j < l2 ; j++) {
				ctx.addDepElement(varxf.depsElements[j]);
			}
			return varxf.boundnodes;
		}
		return ctx.varresolver[this.name][0];
};
XsltForms_globals.stringValue = function(value) {
	return typeof value !== "object"? "" + value : (!value || value.length === 0 ? "" : XsltForms_globals.xmlValue(value[0]));
};
XsltForms_globals.booleanValue = function(value) {
	return typeof value === "undefined" || !value ? false : (typeof value.length !== "undefined"? value.length > 0 : !!value);
};
XsltForms_globals.numberValue = function(value) {
	if (typeof value === "boolean") {
		return 'A' - 0;
	} else {
		var v = typeof value === "object"?  XsltForms_globals.stringValue(value) : value;
		return v === '' ? NaN : v - 0;
	}
};
XsltForms_globals.nodeSetValue = function(value) {
	return value;
};
if (XsltForms_browser.isIE) {
	XsltForms_globals.xmlValue = function(node) {
		if (typeof node !== "object") {
			return node;
		}
		var ret = node.text;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
		if (schtyp["eval"]) {
			try {
				ret = ret === "" ? 0 : eval(ret);
			} catch (e) {}
		}
		return ret;
	};
} else {
	XsltForms_globals.xmlValue = function(node) {
		if (typeof node !== "object") {
			return node;
		}
		var ret = typeof node.text !== "undefined" ? node.text : typeof node.textContent !== "undefined" ? node.textContent : typeof node.documentElement.text !== "undefined" ? node.documentElement.text : node.documentElement.textContent;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
		if (schtyp["eval"]) {
			try {
				ret = ret === "" ? 0 : eval(ret);
			} catch (e) {}
		}
		return ret;
	};
}
XsltForms_globals.xmlResolveEntities = function(s) {
	var parts = XsltForms_globals.stringSplit(s, '&');
	var ret = parts[0];
	for (var i = 1, len = parts.length; i < len; ++i) {
		var p = parts[i];
		var index = p.indexOf(";");
		if (index === -1) {
			ret += parts[i];
			continue;
		}
		var rp = p.substring(0, index);
		var ch;
		switch (rp) {
			case 'lt': ch = '<'; break;
			case 'gt': ch = '>'; break;
			case 'amp': ch = '&'; break;
			case 'quot': ch = '"'; break;
			case 'apos': ch = '\''; break;
			case 'nbsp': ch = String.fromCharCode(160); break;
			default:
				var span = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", 'span') : document.createElement('span');
				span.innerHTML = '&' + rp + '; ';
				ch = span.childNodes[0].nodeValue.charAt(0);
		}
		ret += ch + p.substring(index + 1);
	}
	return ret;
};
XsltForms_globals.stringSplit = function(s, c) {
	var a = s.indexOf(c);
	if (a === -1) {
		return [s];
	}
	var cl = c.length;
	var parts = [];
	parts.push(s.substr(0,a));
	while (a !== -1) {
		var a1 = s.indexOf(c, a + cl);
		if (a1 !== -1) {
			parts.push(s.substr(a + cl, a1 - a - cl));
		} else {
			parts.push(s.substr(a + cl));
		} 
		a = a1;
	}
	return parts;
};
function XsltForms_xpath(subform, expression, unordered, compiled, ns) {
	this.subforms = [];
	this.subforms[subform] = true;
	this.nbsubforms = 1;
	this.subform = subform;
	subform.xpaths.push(this);
	this.expression = expression;
	this.unordered = unordered;
	if (typeof compiled === "string") {
		alert("XSLTForms Exception\n--------------------------\n\nError parsing the following XPath expression :\n\n"+expression+"\n\n"+compiled);
		return;
	}
	this.compiled = compiled;
	this.compiled.isRoot = true;
	this.nsresolver = new XsltForms_nsResolver();
	XsltForms_xpath.expressions[expression] = this;
	for (var i = 0, len = ns.length; i < len; i += 2) {
		this.nsresolver.register(ns[i], ns[i + 1]);
	}
	if (this.nsresolver.notfound) {
		XsltForms_xpath.notfound = true;
	}
	this.evaltime = 0;
}
XsltForms_xpath.prototype.evaluate = function() {
	alert("XPath error");
};
XsltForms_xpath.prototype.xpath_evaluate = function(ctx, current, subform, varresolver) {
	var d1 = new Date();
	XsltForms_browser.assert(ctx);
	if (!ctx.node) {
		ctx = new XsltForms_exprContext(subform, ctx, null, null, null, this.nsresolver, current, varresolver);
	} else if (!ctx.nsresolver) {
		ctx.nsresolver = this.nsresolver;
	}
	try {
		var res = this.compiled.evaluate(ctx);
		if (this.unordered && (res instanceof Array) && res.length > 1) {
			var posres = [];
			for (var i = 0, len = res.length; i < len; i++) {
				posres.push({count: XsltForms_browser.selectNodesLength("preceding::* | ancestor::*", res[i]), node: res[i]});
			}
			posres.sort(function(a,b){return a.count - b.count;});
			for (var i2 = 0, len2 = posres.length; i2 < len2; i2++) {
				res[i2] = posres[i2].node;
			}
		}
		var d2 = new Date();
		this.evaltime += d2 - d1;
		return res;
	} catch(e) {
		alert("XSLTForms Exception\n--------------------------\n\nError evaluating the following XPath expression :\n\n"+this.expression+"\n\n"+(e.name?e.name+"\n\n"+e.message:e));
		return null;
	}
};
XsltForms_xpath.expressions = {};
XsltForms_xpath.notfound = false;
XsltForms_xpath.get = function(str) {
	return XsltForms_xpath.expressions[str];
};
XsltForms_xpath.create = function(subform, expression, unordered, compiled) {
	var xp = XsltForms_xpath.get(expression);
	if (xp) {
		compiled = null;
		if (!xp.subforms[subform]) {
			xp.subforms[subform] = true;
			xp.nbsubforms++;
			subform.xpaths.push(xp);
		}
	} else {
		var ns = [];
		for (var i = 4, len = arguments.length; i < len; i += 2) {
			ns[i-4] = arguments[i];
			ns[i-3] = arguments[i+1];
		}
		xp = new XsltForms_xpath(subform, expression, unordered, compiled, ns);
	}
};
XsltForms_xpath.prototype.dispose = function(subform) {
	if (subform && this.nbsubforms !== 1) {
		delete this.subforms[subform];
		this.nbsubforms--;
		return;
	}
	delete XsltForms_xpath.expressions[this.expression];
};
XsltForms_xpath.registerNS = function(prefix, uri) {
	if (XsltForms_xpath.notfound) {
		XsltForms_xpath.notfound = false;
		for (var exp in XsltForms_xpath.expressions) {
			if (XsltForms_xpath.expressions.hasOwnProperty(exp)) {
				XsltForms_xpath.expressions[exp].nsresolver.registerNotFound(prefix, uri);
				if (XsltForms_xpath.expressions[exp].nsresolver.notfound) {
					XsltForms_xpath.notfound = true;
				}
			}
		}
	}
};
function XsltForms_xpathFunction(acceptContext, defaultTo, returnNodes, body) {
	this.evaluate = body;
	this.defaultTo = defaultTo;
	this.acceptContext = acceptContext;
	this.returnNodes = returnNodes;
}
XsltForms_xpathFunction.DEFAULT_NONE = null;
XsltForms_xpathFunction.DEFAULT_NODE = 0;
XsltForms_xpathFunction.DEFAULT_NODESET = 1;
XsltForms_xpathFunction.DEFAULT_STRING = 2;
XsltForms_xpathFunction.prototype.call = function(context, arguments_) {
	if (arguments_.length === 0) {
		switch (this.defaultTo) {
		case XsltForms_xpathFunction.DEFAULT_NODE:
			if (context.node) {
				arguments_ = [context.node];
			}
			break;
		case XsltForms_xpathFunction.DEFAULT_NODESET:
			if (context.node) {
				arguments_ = [[context.node]];
			}
			break;
		case XsltForms_xpathFunction.DEFAULT_STRING:
			arguments_ = [XsltForms_xpathCoreFunctions.string.evaluate([context.node])];
			break;
		}
	}
	if (this.acceptContext) {
		arguments_.unshift(context);
	}
	return this.evaluate.apply(null, arguments_);
};
var XsltForms_mathConstants = {
	"PI":      "3.14159265358979323846264338327950288419716939937510582",
	"E":       "2.71828182845904523536028747135266249775724709369995958",
	"SQRT2":   "1.41421356237309504880168872420969807856967187537694807",
	"LN2":     "0.693147180559945309417232121458176568075500134360255254",
	"LN10":    "2.30258509299404568401799145468436420760110148862877298",
	"LOG2E":   "1.44269504088896340735992468100189213742664595415298594",
	"SQRT1_2": "0.707106781186547524400844362104849039284835937688474038"
};
var XsltForms_xpathFunctionExceptions = {
	lastInvalidArgumentsNumber : {
		name : "last() : Invalid number of arguments",
		message : "last() function has no argument"
	},
	positionInvalidArgumentsNumber : {
		name : "position() : Invalid number of arguments",
		message : "position() function has no argument"
	},
	countInvalidArgumentsNumber : {
		name : "count() : Invalid number of arguments",
		message : "count() function must have one argument exactly"
	},
	countInvalidArgumentType : {
		name : "count() : Invalid type of argument",
		message : "count() function must have a nodeset argument"
	},
	idInvalidArgumentsNumber : {
		name : "id() : Invalid number of arguments",
		message : "id() function must have one argument exactly"
	},
	idInvalidArgumentType : {
		name : "id() : Invalid type of argument",
		message : "id() function must have a nodeset or string argument"
	},
	localNameInvalidArgumentsNumber : {
		name : "local-name() : Invalid number of arguments",
		message : "local-name() function must have one argument at most"
	},
	localNameInvalidArgumentType : {
		name : "local-name() : Invalid type of argument",
		message : "local-name() function must have a nodeset argument"
	},
	localNameNoContext : {
		name : "local-name() : no context node",
		message : "local-name() function must have a nodeset argument"
	},
	namespaceUriInvalidArgumentsNumber : {
		name : "namespace-uri() : Invalid number of arguments",
		message : "namespace-uri() function must have one argument at most"
	},
	namespaceUriInvalidArgumentType : {
		name : "namespace-uri() : Invalid type of argument",
		message : "namespace-uri() function must have a nodeset argument"
	},
	nameInvalidArgumentsNumber : {
		name : "name() : Invalid number of arguments",
		message : "name() function must have one argument at most"
	},
	nameInvalidArgumentType : {
		name : "name() : Invalid type of argument",
		message : "name() function must have a nodeset argument"
	},
	stringInvalidArgumentsNumber : {
		name : "string() : Invalid number of arguments",
		message : "string() function must have one argument at most"
	},
	concatInvalidArgumentsNumber : {
		name : "concat() : Invalid number of arguments",
		message : "concat() function must have at least two arguments"
	},
	startsWithInvalidArgumentsNumber : {
		name : "starts-with() : Invalid number of arguments",
		message : "starts-with() function must have two arguments exactly"
	},
	endsWithInvalidArgumentsNumber : {
		name : "ends-with() : Invalid number of arguments",
		message : "ends-with() function must have two arguments exactly"
	},
	containsInvalidArgumentsNumber : {
		name : "contains() : Invalid number of arguments",
		message : "contains() function must have two arguments exactly"
	},
	substringBeforeInvalidArgumentsNumber : {
		name : "substring-before() : Invalid number of arguments",
		message : "substring-before() function must have two arguments exactly"
	},
	replaceInvalidArgumentsNumber : {
		name : "replace() : Invalid number of arguments",
		message : "replace() function must have three arguments exactly"
	},
	substringAfterInvalidArgumentsNumber : {
		name : "substring-after() : Invalid number of arguments",
		message : "substring-after() function must have two arguments exactly"
	},
	substringInvalidArgumentsNumber : {
		name : "substring() : Invalid number of arguments",
		message : "substring() function must have two or three arguments"
	},
	compareInvalidArgumentsNumber : {
		name : "compare() : Invalid number of arguments",
		message : "compare() function must have two arguments exactly"
	},
	stringLengthInvalidArgumentsNumber : {
		name : "string-length() : Invalid number of arguments",
		message : "string-length() function must have one argument at most"
	},
	normalizeSpaceInvalidArgumentsNumber : {
		name : "normalize-space() : Invalid number of arguments",
		message : "normalize-space() function must have one argument at most"
	},
	translateInvalidArgumentsNumber : {
		name : "translate() : Invalid number of arguments",
		message : "translate() function must have three argument exactly"
	},
	booleanInvalidArgumentsNumber : {
		name : "boolean() : Invalid number of arguments",
		message : "boolean() function must have one argument exactly"
	},
	notInvalidArgumentsNumber : {
		name : "not() : Invalid number of arguments",
		message : "not() function must have one argument exactly"
	},
	trueInvalidArgumentsNumber : {
		name : "true() : Invalid number of arguments",
		message : "true() function must have no argument"
	},
	falseInvalidArgumentsNumber : {
		name : "false() : Invalid number of arguments",
		message : "false() function must have no argument"
	},
	langInvalidArgumentsNumber : {
		name : "lang() : Invalid number of arguments",
		message : "lang() function must have one argument exactly"
	},
	numberInvalidArgumentsNumber : {
		name : "number() : Invalid number of arguments",
		message : "number() function must have one argument exactly"
	},
	sumInvalidArgumentsNumber : {
		name : "sum() : Invalid number of arguments",
		message : "sum() function must have one argument exactly"
	},
	sumInvalidArgumentType : {
		name : "sum() : Invalid type of argument",
		message : "sum() function must have a nodeset argument"
	},
	floorInvalidArgumentsNumber : {
		name : "floor() : Invalid number of arguments",
		message : "floor() function must have one argument exactly"
	},
	ceilingInvalidArgumentsNumber : {
		name : "ceiling() : Invalid number of arguments",
		message : "ceiling() function must have one argument exactly"
	},
	roundInvalidArgumentsNumber : {
		name : "round() : Invalid number of arguments",
		message : "round() function must have one argument exactly"
	},
	powerInvalidArgumentsNumber : {
		name : "power() : Invalid number of arguments",
		message : "power() function must have one argument exactly"
	},
	randomInvalidArgumentsNumber : {
		name : "random() : Invalid number of arguments",
		message : "random() function must have no argument"
	},
	booleanFromStringInvalidArgumentsNumber : {
		name : "boolean-from-string() : Invalid number of arguments",
		message : "boolean-from-string() function must have one argument exactly"
	},
	ifInvalidArgumentsNumber : {
		name : "if() : Invalid number of arguments",
		message : "if() function must have three argument exactly"
	},
	chooseInvalidArgumentsNumber : {
		name : "choose() : Invalid number of arguments",
		message : "choose() function must have three argument exactly"
	},
	digestInvalidArgumentsNumber : {
		name : "digest() : Invalid number of arguments",
		message : "digest() function must have two or three arguments"
	},
	hmacInvalidArgumentsNumber : {
		name : "choose() : Invalid number of arguments",
		message : "choose() function must have three or four arguments"
	},
	avgInvalidArgumentsNumber : {
		name : "avg() : Invalid number of arguments",
		message : "avg() function must have one argument exactly"
	},
	avgInvalidArgumentType : {
		name : "avg() : Invalid type of argument",
		message : "avg() function must have a nodeset argument"
	},
	minInvalidArgumentsNumber : {
		name : "min() : Invalid number of arguments",
		message : "min() function must have one argument exactly"
	},
	minInvalidArgumentType : {
		name : "min() : Invalid type of argument",
		message : "min() function must have a nodeset argument"
	},
	maxInvalidArgumentsNumber : {
		name : "max() : Invalid number of arguments",
		message : "max() function must have one argument exactly"
	},
	maxInvalidArgumentType : {
		name : "max() : Invalid type of argument",
		message : "max() function must have a nodeset argument"
	},
	serializeInvalidArgumentType : {
		name : "serialize() : Invalid type of argument",
		message : "serialize() function must have a nodeset argument"
	},
	countNonEmptyInvalidArgumentsNumber : {
		name : "count-non-empty() : Invalid number of arguments",
		message : "count-non-empty() function must have one argument exactly"
	},
	countNonEmptyInvalidArgumentType : {
		name : "count-non-empty() : Invalid type of argument",
		message : "count-non-empty() function must have a nodeset argument"
	},
	indexInvalidArgumentsNumber : {
		name : "index() : Invalid number of arguments",
		message : "index() function must have one argument exactly"
	},
	nodeIndexInvalidArgumentsNumber : {
		name : "nodeIndex() : Invalid number of arguments",
		message : "nodeIndex() function must have one argument exactly"
	},
	propertyInvalidArgumentsNumber : {
		name : "property() : Invalid number of arguments",
		message : "property() function must have one argument exactly"
	},
	propertyInvalidArgument : {
		name : "property() : Invalid argument",
		message : "Invalid property name"
	},
	secondsInvalidArgumentsNumber : {
		name : "seconds() : Invalid number of arguments",
		message : "seconds() function must have one argument exactly"
	},
	monthsInvalidArgumentsNumber : {
		name : "months() : Invalid number of arguments",
		message : "months() function must have one argument exactly"
	},
	instanceInvalidArgumentsNumber : {
		name : "instance() : Invalid number of arguments",
		message : "instance() function must have zero or one argument"
	},
	subformInstanceInvalidArgumentsNumber : {
		name : "subform-instance() : Invalid number of arguments",
		message : "subform-instance() function must have no argument"
	},
	subformContextInvalidArgumentsNumber : {
		name : "subform-context() : Invalid number of arguments",
		message : "subform-context() function must have no argument"
	},
	nowInvalidArgumentsNumber : {
		name : "now() : Invalid number of arguments",
		message : "now() function must have no argument"
	},
	localDateInvalidArgumentsNumber : {
		name : "local-date() : Invalid number of arguments",
		message : "local-date() function must have no argument"
	},
	localDateTimeInvalidArgumentsNumber : {
		name : "local-dateTime() : Invalid number of arguments",
		message : "local-dateTime() function must have no argument"
	},
	adjustDateTimeToTimezoneInvalidArgumentsNumber: {
		name : "adjust-dateTime-to-timezone() : Invalid number of arguments",
		message : "adjust-dateTime-to-timezone() function must have zero or one argument"
	},
	daysFromDateInvalidArgumentsNumber : {
		name : "days-from-date() : Invalid number of arguments",
		message : "days-from-date() function must have one argument exactly"
	},
	daysToDateInvalidArgumentsNumber : {
		name : "days-to-date() : Invalid number of arguments",
		message : "days-to-date() function must have one argument exactly"
	},
	secondsToDateTimeInvalidArgumentsNumber : {
		name : "seconds-to-dateTime() : Invalid number of arguments",
		message : "seconds-to-dateTime() function must have one argument exactly"
	},
	secondsFromDateTimeInvalidArgumentsNumber : {
		name : "seconds-from-dateTime() : Invalid number of arguments",
		message : "seconds-from-dateTime() function must have one argument exactly"
	},
	currentInvalidArgumentsNumber : {
		name : "current() : Invalid number of arguments",
		message : "current() function must have no argument"
	},
	isValidInvalidArgumentsNumber : {
		name : "is-valid() : Invalid number of arguments",
		message : "is-valid() function must have one argument exactly"
	},
	isValidInvalidArgumentType : {
		name : "is-valid() : Invalid type of argument",
		message : "is-valid() function must have a nodeset argument"
	},
	isNonEmptyArrayArgumentsNumber : {
		name : "is-non-empty-array() : Invalid number of arguments",
		message : "is-non-empty-array() function must have zero or one argument"
	},
	isNonEmptyArrayInvalidArgumentType : {
		name : "is-non-empty-array() : Invalid type of argument",
		message : "is-non-empty-array() function must have a node argument"
	},
	isCardNumberInvalidArgumentsNumber : {
		name : "is-card-number() : Invalid number of arguments",
		message : "is-card-number() function must have one argument exactly"
	},
	upperCaseInvalidArgumentsNumber : {
		name : "upper-case() : Invalid number of arguments",
		message : "upper-case() function must have one argument exactly"
	},
	lowerCaseInvalidArgumentsNumber : {
		name : "lower-case() : Invalid number of arguments",
		message : "lower-case() function must have one argument exactly"
	},
	formatNumberInvalidArgumentsNumber : {
		name : "format-number() : Invalid number of arguments",
		message : "format-number() function must have two arguments exactly"
	},
	distinctValuesInvalidArgumentsNumber : {
		name : "distinct-values() : Invalid number of arguments",
		message : "distinct-values() function must have one argument exactly"
	},
	transformInvalidArgumentsNumber : {
		name : "transform() : Invalid number of arguments",
		message : "transform() function must have two arguments exactly"
	},
	serializeNoContext : {
		name : "serialize() : no context node",
		message : "serialize() function must have a node argument"
	},
	serializeInvalidArgumentsNumber : {
		name : "serialize() : Invalid number of arguments",
		message : "serialize() function must have one argument exactly"
	},
	eventInvalidArgumentsNumber : {
		name : "event() : Invalid number of arguments",
		message : "event() function must have one argument exactly"
	},
	bindInvalidArgumentsNumber : {
		name : "bind() : Invalid number of arguments",
		message : "bind() function must have one argument exactly"
	},
	alertInvalidArgumentsNumber : {
		name : "alert() : Invalid number of arguments",
		message : "alert() function must have one argument exactly"
	},
	jsevalInvalidArgumentsNumber : {
		name : "js-eval() : Invalid number of arguments",
		message : "js-eval() function must have one argument exactly"
	},
	stringJoinInvalidArgumentsNumber : {
		name : "string-join() : Invalid number of arguments",
		message : "string-join() function must have one or two arguments"
	},
	stringJoinInvalidArgumentType : {
		name : "string-join() : Invalid type of argument",
		message : "string-join() function must have a nodeset argument"
	},
	itextInvalidArgumentsNumber : {
		name : "itext() : Invalid number of arguments",
		message : "itext() function must have one argument"
	},
	selectionInvalidArgumentsNumber : {
		name : "selection() : Invalid number of arguments",
		message : "selection() function must have one argument exactly"
	},
	controlPropertyInvalidArgumentsNumber : {
		name : "control-property() : Invalid number of arguments",
		message : "control-property() function must have two arguments exactly"
	},
	encodeForUriInvalidArgumentsNumber : {
		name : "encode-for-uri() : Invalid number of arguments",
		message : "encode-for-uri() function must have one argument exactly"
	},
	matchInvalidArgumentsNumber : {
		name : "match() : Invalid number of arguments",
		message : "match() function must have two or three arguments"
	},
	uuidInvalidArgumentsNumber : {
		name : "uuid() : Invalid number of arguments",
		message : "uuid() function must have no argument"
	}
};
var XsltForms_xpathCoreFunctions = {
	"http://www.w3.org/2005/xpath-functions node" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.nodeInvalidArgumentsNumber;
			}
			return ctx.current.childNodes;
		} ),
	"http://www.w3.org/2005/xpath-functions comment" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.commentInvalidArgumentsNumber;
			}
			var result = [];
			if (ctx.current.childNodes) {
				for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
					if (ctx.current.childNodes[i].nodeType === Fleur.Node.COMMENT_NODE) {
						result.push(ctx.current.childNodes[i]);
					}
				}
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions text" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
			}
			var result = [];
			if (ctx.current.childNodes) {
				for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
					if (ctx.current.childNodes[i].nodeType === Fleur.Node.TEXT_NODE) {
						result.push(ctx.current.childNodes[i]);
					}
				}
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions array" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
			}
			var result = [];
			if (ctx.current.childNodes) {
				for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
					if (ctx.current.childNodes[i].nodeType === Fleur.Node.ARRAY_NODE) {
						result.push(ctx.current.childNodes[i]);
					}
				}
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions map" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
			}
			var result = [];
			if (ctx.current.childNodes) {
				for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
					if (ctx.current.childNodes[i].nodeType === Fleur.Node.MAP_NODE) {
						result.push(ctx.current.childNodes[i]);
					}
				}
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions entry" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
			}
			var result = [];
			if (ctx.current.entries) {
				for (var i = 0, len = ctx.current.entries.length; i < len; i++) {
					result.push(ctx.current.entries[i]);
				}
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions last" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.lastInvalidArgumentsNumber;
			}
			return ctx.nodelist.length;
		} ),
	"http://www.w3.org/2005/xpath-functions position" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.positionInvalidArgumentsNumber;
			}
			return ctx.position;
		} ),
	"http://www.w3.org/2002/xforms context" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.positionInvalidArgumentsNumber;
			}
			return [ctx.current];
		} ),
	"http://www.w3.org/2005/xpath-functions count" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet) { 
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.countInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.countInvalidArgumentType;
			}
			return nodeSet.length;
		} ),
	"http://www.w3.org/2005/xpath-functions id" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NODE, false,
		function(context, object, ref) {
			if (arguments.length !== 2 && arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.idInvalidArgumentsNumber;
			}
			if (typeof object !== "object" && typeof object !== "string") {
				throw XsltForms_xpathFunctionExceptions.idInvalidArgumentType;
			}
			var result = [];
			if (!ref) {
				ref = context.node.ownerDocument ? [context.node.ownerDocument] : [context.node];
			}
			if (typeof object !== "string" && typeof(object.length) !== "undefined") {
				for (var i = 0, len = object.length; i < len; ++i) {
					var res = XsltForms_xpathCoreFunctions['http://www.w3.org/2005/xpath-functions id'].evaluate(context, object[i], ref);
					for (var j = 0, len1 = res.length; j < len1; j++) {
						result.push(res[j]);
					}
				}
			} else if (context.node) {
				var ids = XsltForms_globals.stringValue(object).split(/\s+/);
				var idattr = XsltForms_globals.IDstr ? XsltForms_globals.IDstr : "@xml:id";
				for (var k = 0, len2 = ids.length; k < len2; k++) {
					var n = XsltForms_browser.selectSingleNode("descendant-or-self::*[" + idattr + "='" + ids[k] + "']", ref[0]);
					if (n) {
						result.push(n);
					}
					n = XsltForms_browser.selectSingleNode("descendant-or-self::*[@*[local-name() = 'type'] = 'xsd:ID' and . = '" + ids[k] + "']", ref[0]);
					if (n) {
						result.push(n);
					}
				}
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions local-name" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(nodeSet) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.localNameInvalidArgumentsNumber;
			}
			if (arguments.length === 1 && typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.localNameInvalidArgumentType;
			}
			if (arguments.length === 0) {
				throw XsltForms_xpathFunctionExceptions.localNameNoContext;
			}
			return nodeSet.length === 0 ? "" : nodeSet[0].nodeName.replace(/^.*:/, "");
		} ),
	"http://www.w3.org/2005/xpath-functions namespace-uri" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(nodeSet) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.namespaceUriInvalidArgumentsNumber;
			}
			if (arguments.length === 1 && typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.namespaceUriInvalidArgumentType;
			}
			return nodeSet.length === 0? "" : nodeSet[0].namespaceURI || "";
		} ),
	"http://www.w3.org/2005/xpath-functions name" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(nodeSet) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.nameInvalidArgumentsNumber;
			}
			if (arguments.length === 1 && typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.nameInvalidArgumentType;
			}
			return nodeSet.length === 0? "" : nodeSet[0].nodeName;
		} ),
	"http://www.w3.org/2005/xpath-functions string" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(object) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.stringInvalidArgumentsNumber;
			}
			return XsltForms_globals.stringValue(object);
		} ),
	"http://www.w3.org/2005/xpath-functions concat" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length <2) {
				throw XsltForms_xpathFunctionExceptions.concatInvalidArgumentsNumber;
			}
			var string = "";
			for (var i = 0, len = arguments.length; i < len; ++i) {
				string += XsltForms_globals.stringValue(arguments[i]);
			}
			return string;
		} ),
	"http://www.w3.org/2005/xpath-functions starts-with" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, prefix) {   
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.startsWithInvalidArgumentsNumber;
			}
			return XsltForms_globals.stringValue(string).indexOf(XsltForms_globals.stringValue(prefix)) === 0;
		} ),
	"http://www.w3.org/2005/xpath-functions ends-with" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, postfix) {   
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.endsWithInvalidArgumentsNumber;
			}
			var s = XsltForms_globals.stringValue(string);
			var p = XsltForms_globals.stringValue(postfix);
			return s.substr(s.length - p.length, p.length) === p;
		} ),
	"http://www.w3.org/2005/xpath-functions contains" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, substring) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.containsInvalidArgumentsNumber;
			}
			return XsltForms_globals.stringValue(string).indexOf(XsltForms_globals.stringValue(substring)) !== -1;
		} ),
	"http://www.w3.org/2005/xpath-functions substring-before" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, substring) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.substringBeforeInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			return string.substring(0, string.indexOf(XsltForms_globals.stringValue(substring)));
		} ),
	"http://www.w3.org/2005/xpath-functions substring-after" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, substring) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.substringAfterInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			substring = XsltForms_globals.stringValue(substring);
			var index = string.indexOf(substring);
			return index === -1 ? "" : string.substring(index + substring.length);
		} ),
	"http://www.w3.org/2005/xpath-functions substring" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, index, len) {
			if (arguments.length !== 2 && arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.substringInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			index  = Math.round(XsltForms_globals.numberValue(index));
			if (isNaN(index)) {
				return "";
			}
			if (len) {
				len = Math.round(XsltForms_globals.numberValue(len));
				if (index <= 0) {
					return string.substr(0, index + len - 1);
				}
				return string.substr(index - 1, len);
			}
			return string.substr(Math.max(index - 1, 0));
		} ),
	"http://www.w3.org/2005/xpath-functions compare" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string1, string2) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.compareInvalidArgumentsNumber;
			}
			string1 = XsltForms_globals.stringValue(string1);
			string2 = XsltForms_globals.stringValue(string2);
			return (string1 === string2 ? 0 : (string1 > string2 ? 1 : -1));
		} ),
	"http://www.w3.org/2005/xpath-functions string-length" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_STRING, false,
		function(string) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.stringLengthInvalidArgumentsNumber;
			}
			return XsltForms_globals.stringValue(string).length;
		} ),
	"http://www.w3.org/2005/xpath-functions normalize-space" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_STRING, false,
		function(string) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.normalizeSpaceLengthInvalidArgumentsNumber;
			}
			return XsltForms_globals.stringValue(string).replace(/^\s+|\s+$/g, "")
				.replace(/\s+/, " ");
		} ),
	"http://www.w3.org/2005/xpath-functions translate" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, from, to) {
			if (arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.translateInvalidArgumentsNumber;
			}
			string =  XsltForms_globals.stringValue(string);
			from = XsltForms_globals.stringValue(from);
			to = XsltForms_globals.stringValue(to);
			var result = "";
			for (var i = 0, len = string.length; i < len; ++i) {
				var index = from.indexOf(string.charAt(i));
				result += index === -1? string.charAt(i) : to.charAt(index);
			}
			return result;
		} ),
	"http://www.w3.org/2005/xpath-functions replace" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, pattern, replacement) {
			if (arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.replaceInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			return string.replace(new RegExp(XsltForms_globals.stringValue(pattern), "g"), XsltForms_globals.stringValue(replacement));
		} ),
	"http://www.w3.org/2005/xpath-functions boolean" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(object) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.booleanInvalidArgumentsNumber;
			}
			return XsltForms_globals.booleanValue(object);
		} ),
	"http://www.w3.org/2005/xpath-functions not" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(condition) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.notInvalidArgumentsNumber;
			}
			return !XsltForms_globals.booleanValue(condition);
		} ),
	"http://www.w3.org/2005/xpath-functions true" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length !== 0) {
				throw XsltForms_xpathFunctionExceptions.trueInvalidArgumentsNumber;
			}
			return true;
		} ),
	"http://www.w3.org/2005/xpath-functions false" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length !== 0) {
				throw XsltForms_xpathFunctionExceptions.falseInvalidArgumentsNumber;
			}
			return false;
		} ),
	"http://www.w3.org/2005/xpath-functions lang" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(context, language) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.langInvalidArgumentsNumber;
			}
			language = XsltForms_globals.stringValue(language);
			for (var node = context.node; node; node = node.parentNode) {
				if (typeof(node.attributes) === "undefined") {
					continue;
				}
				var xmlLang = node.attributes.getNamedItemNS("http://www.w3.org/XML/1998/namespace", "lang");
				if (xmlLang) {
					xmlLang  = xmlLang.value.toLowerCase();
					language = language.toLowerCase();
					return xmlLang.indexOf(language) === 0 && (language.length === xmlLang.length || language.charAt(xmlLang.length) === '-');
				}
			}
			return false;
		} ),
	"http://www.w3.org/2005/xpath-functions number" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(object) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.numberInvalidArgumentsNumber;
			}
			return XsltForms_globals.numberValue(object);
		} ),
	"http://www.w3.org/2005/xpath-functions sum" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.sumInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.sumInvalidArgumentType;
			}
			var sum = 0;
			for (var i = 0, len = nodeSet.length; i < len; ++i) {
				sum += XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[i]));
			}
			return sum;
		} ),
	"http://www.w3.org/2005/xpath-functions floor" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.floorInvalidArgumentsNumber;
			}
			return Math.floor(XsltForms_globals.numberValue(number));
		} ),
	"http://www.w3.org/2005/xpath-functions ceiling" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.ceilingInvalidArgumentsNumber;
			}
			return Math.ceil(XsltForms_globals.numberValue(number));
		} ),
	"http://www.w3.org/2005/xpath-functions round" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.roundInvalidArgumentsNumber;
			}
			return Math.round(XsltForms_globals.numberValue(number));
		} ),
	"http://www.w3.org/2002/xforms power" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(x, y) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.powerInvalidArgumentsNumber;
			}
			return Math.pow(XsltForms_globals.numberValue(x), XsltForms_globals.numberValue(y));
		} ),
	"http://www.w3.org/2002/xforms random" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.randomInvalidArgumentsNumber;
			}
			return Math.random();
		} ),
	"http://www.w3.org/2002/xforms boolean-from-string" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.booleanFromStringInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			switch (string.toLowerCase()) {
				case "true":  case "1": return true;
				case "false": case "0": return false;
				default: return false;
			}
		} ),
	"http://www.w3.org/2002/xforms if" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, true,
		function(condition, onTrue, onFalse) {
			if (arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.ifInvalidArgumentsNumber;
			}
			return XsltForms_globals.booleanValue(condition)? onTrue : onFalse;
		} ),
	"http://www.w3.org/2002/xforms choose" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, true,
		function(condition, onTrue, onFalse) {
			if (arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.chooseInvalidArgumentsNumber;
			}
			return XsltForms_globals.booleanValue(condition)? onTrue : onFalse;
		} ),
	"http://www.w3.org/2005/xpath-functions avg" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.avgInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.avgInvalidArgumentType;
			}
			var sum = XsltForms_xpathCoreFunctions['http://www.w3.org/2005/xpath-functions sum'].evaluate(nodeSet);
			var quant = XsltForms_xpathCoreFunctions['http://www.w3.org/2005/xpath-functions count'].evaluate(nodeSet);
			return sum / quant;
		} ),
	"http://www.w3.org/2005/xpath-functions min" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function (nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.minInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.minInvalidArgumentType;
			}
			if (nodeSet.length === 0) {
				return NaN;
			}
			var minimum = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[0]));
			for (var i = 1, len = nodeSet.length; i < len; ++i) {
				var value = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[i]));
				if (isNaN(value)) {
					return NaN;
				}
				if (value < minimum) {
					minimum = value;
				}
			}
			return minimum;
		} ),
	"http://www.w3.org/2005/xpath-functions max" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function (nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.maxInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.maxInvalidArgumentType;
			}
			if (nodeSet.length === 0) {
				return NaN;
			}
			var maximum = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[0]));
			for (var i = 1, len = nodeSet.length; i < len; ++i) {
				var value = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[i]));
				if (isNaN(value)) {
					return NaN;
				}
				if (value > maximum) {
					maximum = value;
				}
			}
			return maximum;
		} ),
	"http://www.w3.org/2002/xforms count-non-empty" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.countNonEmptyInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.countNonEmptyInvalidArgumentType;
			}
			var count = 0;
			for (var i = 0, len = nodeSet.length; i < len; ++i) {
				if (XsltForms_globals.xmlValue(nodeSet[i]).length > 0) {
					count++;
				}
			}
			return count;
		} ),
	"http://www.w3.org/2002/xforms index" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx, id) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.indexInvalidArgumentsNumber;
			}
			var elt = XsltForms_idManager.find(XsltForms_globals.stringValue(id));
			if (!elt) {
				return NaN;
			}
			var xf = elt.xfElement;
			ctx.addDepElement(xf);
			return xf.index;
		} ),
	"http://www.w3.org/2002/xforms nodeindex" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx, id) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.nodeIndexInvalidArgumentsNumber;
			}
			var control = XsltForms_idManager.find(XsltForms_globals.stringValue(id));
			var node = control.node;
			ctx.addDepElement(control.xfElement);
			if (node) {
				ctx.addDepNode(node);
				ctx.addDepElement(document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "model")).xfElement);
			}
			return node? [ node ] : [];
		} ),
	"http://www.w3.org/2002/xforms property" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(pname) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.propertyInvalidArgumentsNumber;
			}
			pname = XsltForms_globals.stringValue(pname);
			switch (pname) {
				case "version": return "1.1";
				case "conformance-level": return "full";
				case "xsltforms:debug-mode": return XsltForms_globals.debugMode ? "on" : "off";
				case "xsltforms:version": return XsltForms_globals.fileVersion;
				case "xsltforms:version-number": return ""+XsltForms_globals.fileVersionNumber;
				default:
					if (pname.substring(0,4) === "xsl:") {
						var xslname = pname.substring(4);
						var xsltsrc = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt">' +
						'	<xsl:output method="xml"/>' +
						'	<xsl:template match="/">' +
						'		<xsl:variable name="version">' +
						'			<xsl:if test="system-property(\'xsl:vendor\')=\'Microsoft\'">' +
						'				<xsl:value-of select="system-property(\'msxsl:version\')"/>' +
						'			</xsl:if>' +
						'		</xsl:variable>' +
						'		<properties><xsl:value-of select="concat(\'|vendor=\',system-property(\'xsl:vendor\'),\'|vendor-url=\',system-property(\'xsl:vendor-url\'),\'|vendor-version=\',$version,\'|\')"/></properties>' +
						'	</xsl:template>' +
						'</xsl:stylesheet>';
						var res = XsltForms_browser.transformText("<dummy/>", xsltsrc, true);
						var spres = res.split("|");
						for (var i = 1, len = spres.length; i < len; i++) {
							var spprop = spres[i].split("=", 2);
							if (spprop[0] === xslname) {
								return spprop[1];
							}
						}
					}
					if (pname.match("^[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*$")) {
						XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-binding-exception", "Invalid NCNAME");
					}
			}
			return "";
		} ),
	"http://www.w3.org/2002/xforms seconds" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(duration) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.secondsInvalidArgumentsNumber;
			}
			duration = XsltForms_globals.stringValue(duration);
			var durarr = duration.match("^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$");
			if (durarr) {
				return (duration.charAt(0) === '-'? -1: 1)*(((parseFloat(durarr[3] || 0)*24 + parseFloat(durarr[5] || 0))*60 + parseFloat(durarr[6] || 0))*60 + parseFloat(durarr[7] || 0));
			}
			return NaN;
		} ),
	"http://www.w3.org/2002/xforms months" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(duration) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.monthsInvalidArgumentsNumber;
			}
			duration = XsltForms_globals.stringValue(duration);
			var durarr = duration.match("^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$");
			if (durarr) {
				return (duration.charAt(0) === '-'? -1: 1)*(parseFloat(durarr[1] || 0)*12 + parseFloat(durarr[2] || 0));
			}
			return NaN;
		} ),
	"http://www.w3.org/2002/xforms instance" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
		 function(ctx, idRef, filename, mediatype) {
			if (arguments.length > 4) {
				throw XsltForms_xpathFunctionExceptions.instanceInvalidArgumentsNumber;
			}
			var iname = idRef ? XsltForms_globals.stringValue(idRef) : "";
			var res;
			if (iname !== "") {
				var instance = document.getElementById(iname);
				if (!instance) {
					throw new Error({name: "instance " + iname + " not found"});
				}
				if (filename && instance.xfElement.archive) {
					filename = XsltForms_globals.stringValue(filename);
					var f = instance.xfElement.archive[filename];
					if (!f) {
						throw new Error({name: "file " + filename + " not found in instance " + iname});
					}
					if (!f.doc) {
						f.doc = XsltForms_browser.createXMLDocument("<dummy/>");
						var modid = XsltForms_browser.getDocMeta(instance.xfElement.doc, "model");
						XsltForms_browser.loadDoc(f.doc, XsltForms_browser.utf8decode(zip_inflate(f.compressedFileData)));
						XsltForms_browser.setDocMeta(f.doc, "instance", idRef);
						XsltForms_browser.setDocMeta(f.doc, "model", modid);
					}
					res = f.doc.documentElement;
				}
				res = instance.xfElement.doc.documentElement;
			} else {
				res = ctx.node.ownerDocument.documentElement;
			}
			ctx.addDepNode(res);
			return [res];
		} ),
	"http://www.w3.org/2005/xpath-functions subform-instance" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
		function(ctx) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.subformInstanceInvalidArgumentsNumber;
			}
			return [ctx.subform.instances[0].doc.documentElement];
		} ),
	"http://www.w3.org/2005/xpath-functions subform-context" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
		function(ctx) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.subformContextInvalidArgumentsNumber;
			}
			var b = document.getElementById(ctx.subform.eltid).xfElement.boundnodes;
			return b ? [b[0]] : [];
		} ),
	"http://www.w3.org/2002/xforms now" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length !== 0) {
				throw XsltForms_xpathFunctionExceptions.nowInvalidArgumentsNumber;
			}
			return XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", false);
		} ),
	"http://www.w3.org/2002/xforms local-date" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length !== 0) {
				throw XsltForms_xpathFunctionExceptions.localDateInvalidArgumentsNumber;
			}
			return XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddz", true);
		} ),
	"http://www.w3.org/2002/xforms local-dateTime" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length !== 0) {
				throw XsltForms_xpathFunctionExceptions.localDateTimeInvalidArgumentsNumber;
			}
			return XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", true);
		} ),
	"http://www.w3.org/2002/xforms adjust-dateTime-to-timezone" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string) {
			if (arguments.length === 0) {
				return "";
			}
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.adjustDateTimeToTimezoneInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			if( !XsltForms_schema.getType("xsd_:date").validate(string) && !XsltForms_schema.getType("xsd_:dateTime").validate(string)) {
				return "";
			}
			var p = /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+\-])?([01][0-9]|2[0-3])?:?([0-5][0-9])?/;
			var c = p.exec(string);
			var d;
			if (c[8]) {
				d = new Date(Date.UTC(c[1], c[2]-1, c[3], c[4], c[5], c[6]));
				if (c[8] !== "Z") {
					d.setUTCMinutes(d.getUTCMinutes() + (c[8] === "+" ? 1 : -1)*(c[9]*60 + c[10]));
				}
			} else {
				d = new Date(c[1], c[2]-1, c[3], c[4], c[5], c[6]);
			}
			return XsltForms_browser.i18n.format(d, "yyyy-MM-ddThh:mm:ssz", true);
		} ),
	"http://www.w3.org/2002/xforms days-from-date" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.daysFromDateInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			if( !XsltForms_schema.getType("xsd_:date").validate(string) && !XsltForms_schema.getType("xsd_:dateTime").validate(string)) {
				return "NaN";
			}
			var p = /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/;
			var c = p.exec(string);
			var d = new Date(Date.UTC(c[1], c[2]-1, c[3]));
			return Math.floor(d.getTime()/ 86400000 + 0.000001);
		} ),
	"http://www.w3.org/2002/xforms days-to-date" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.daysToDateInvalidArgumentsNumber;
			}
			number = XsltForms_globals.numberValue(number);
			if( isNaN(number) ) {
				return "";
			}
			var d = new Date();
			d.setTime(Math.floor(number + 0.000001) * 86400000);
			return XsltForms_browser.i18n.format(d, "yyyy-MM-dd", false);
		} ),
	"http://www.w3.org/2002/xforms seconds-from-dateTime" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.secondsFromDateTimeInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string);
			if( !XsltForms_schema.getType("xsd_:dateTime").validate(string)) {
				return "NaN";
			}
			var p = /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+\-])?([01][0-9]|2[0-3])?:?([0-5][0-9])?/;
			var c = p.exec(string);
			var d = new Date(Date.UTC(c[1], c[2]-1, c[3], c[4], c[5], c[6]));
			if (c[8] && c[8] !== "Z") {
				d.setUTCMinutes(d.getUTCMinutes() + (c[8] === "+" ? 1 : -1)*(c[9]*60 + c[10]));
			}
			return Math.floor(d.getTime() / 1000 + 0.000001) + (c[7]?c[7]:0);
		} ),
	"http://www.w3.org/2002/xforms seconds-to-dateTime" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.secondsToDateTimeInvalidArgumentsNumber;
			}
			number = XsltForms_globals.numberValue(number);
			if( isNaN(number) ) {
				return "";
			}
			var d = new Date();
			d.setTime(Math.floor(number + 0.000001) * 1000);
			return XsltForms_browser.i18n.format(d, "yyyy-MM-ddThh:mm:ssz", false);
		} ),
	"http://www.w3.org/2002/xforms current" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
		function(ctx) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.currentInvalidArgumentsNumber;
			}
			ctx.addDepNode(ctx.node);
			ctx.addDepElement(document.getElementById(XsltForms_browser.getDocMeta(ctx.node.nodeType === Fleur.Node.DOCUMENT_NODE ? ctx.node : ctx.node.ownerDocument, "model")).xfElement);
			return [ctx.current];
		} ),
	"http://www.w3.org/2002/xforms is-valid" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.isValidInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.isValidInvalidArgumentType;
			}
			var valid = true;
			for (var i = 0, len = nodeSet.length; valid && i < len; i++) {
				valid = valid && XsltForms_globals.validate_(nodeSet[i]);
			}
			return valid;
		} ),
	"http://www.w3.org/2002/xforms is-card-number" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(string) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.isCardNumberInvalidArgumentsNumber;
			}
			string = XsltForms_globals.stringValue(string).trim();
			var sum = 0;
			var tab = new Array(string.length);
			for (var i = 0, l = string.length; i < l; i++) {
				tab[i] = string.charAt(i) - '0';
				if( tab[i] < 0 || tab[i] > 9 ) {
					return false;
				}
			}
			for (var j = tab.length-2; j >= 0; j -= 2) {
				tab[j] *= 2;
				if( tab[j] > 9 ) {
					tab[j] -= 9;
				}
			}
			for (var k = 0, l2 = tab.length; k < l2; k++) {
				sum += tab[k];
			}
			return sum % 10 === 0;
		} ),
	"http://www.w3.org/2002/xforms digest" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(str, algo, enco) {
			if (arguments.length !== 2 && arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.digestInvalidArgumentsNumber;
			}
			algo = XsltForms_globals.stringValue(algo);
			if (algo !== "SHA-1" && algo !== "MD5" && algo !== "SHA-256" && algo !== "BASE64") {
				XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid crypting method");
				return "unsupported";
			}
			enco = enco ? XsltForms_globals.stringValue(enco) : "base64";
			if (enco !== "hex" && enco !== "base64") {
				XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid encoding method");
				return "unsupported";
			}
			str = XsltForms_globals.stringValue(str);
			return XsltForms_globals.encode(XsltForms_globals.crypto(XsltForms_globals.str2msg(str), algo), enco);
		} ),
	"http://www.w3.org/2002/xforms hmac" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(key, str, algo, enco) {
			if (arguments.length !== 3 && arguments.length !== 4) {
				throw XsltForms_xpathFunctionExceptions.hmacInvalidArgumentsNumber;
			}
			algo = XsltForms_globals.stringValue(algo);
			if (algo !== "SHA-1" && algo !== "MD5" && algo !== "SHA-256" && algo !== "BASE64") {
				XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid crypting method");
				return "unsupported";
			}
			enco = enco ? XsltForms_globals.stringValue(enco) : "base64";
			if (enco !== "hex" && enco !== "base64") {
				XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid encoding method");
				return "unsupported";
			}
			key = XsltForms_globals.stringValue(key);
			str = XsltForms_globals.stringValue(str);
			var i, ik = [], ok = [];
			var k = XsltForms_globals.str2msg(key);
			if (k.length > 64) {
				k = XsltForms_globals.crypto(k, algo);
			}
			for (i = (k.length + 3) >> 2; i < 16; i++) {
				k.arr[i] = 0;
			}
			for (i = 0; i < 16; i++) {
				ik[i] = k.arr[i] ^ 0x36363636;
				ok[i] = k.arr[i] ^ 0x5c5c5c5c;
			}
			var a1 = XsltForms_globals.str2msg(str);
			a1.length += 64;
			a1.arr = ik.concat(a1.arr);
			var a2 = XsltForms_globals.crypto(a1, algo);
			a2.length += 64;
			a2.arr = ok.concat(a2.arr);
			return XsltForms_globals.encode(XsltForms_globals.crypto(a2, algo), enco);
		} ),
	"http://www.w3.org/2005/xpath-functions upper-case" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(str) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.upperCaseInvalidArgumentsNumber;
			}
			str = XsltForms_globals.stringValue(str);
			return str.toUpperCase();
		} ),
	"http://www.w3.org/2005/xpath-functions lower-case" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(str) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.lowerCaseInvalidArgumentsNumber;
			}
			str = XsltForms_globals.stringValue(str);
			return str.toLowerCase();
		} ),
	"http://www.w3.org/2005/xpath-functions distinct-values" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.distinctValuesInvalidArgumentsNumber;
			}
			var nodeSet2 = [];
			var values = {};
			for (var i = 0, len = nodeSet.length; i < len; ++i) {
				var xvalue = XsltForms_globals.xmlValue(nodeSet[i]);
				if (!values[xvalue]) {
					nodeSet2.push(nodeSet[i]);
					values[xvalue] = true;
				}
			}
			return nodeSet2;
		} ),
	"http://www.w3.org/2005/xpath-functions format-number" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(value, picture) {
			var i, j, l, l2, pictures, dss, ess, ps, pms, ms, msbefore, psafter, pmsafter, signs, esigns, iipgp, ipgp, mips, prefix, fstart, fpgp, minfps, maxfps, mes, suffix, dsspos, evalue, esign, s0, s;
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.formatNumberInvalidArgumentsNumber;
			}
			value = XsltForms_globals.numberValue(value);
			if( isNaN(value) ) {
				return XsltForms_browser.i18n.get("format-number.NaN", "NaN");
			}
			pictures = picture.split(XsltForms_browser.i18n.get("format-number.pattern-separator-sign", ";"));
			picture = value < 0 && pictures[1] ? pictures[1] : pictures[0];
			signs = ".,-%\u2030#0123456789";
			esigns = ".,e-%\u2030#0123456789";
			i = 0;
			l = picture.length;
			while (i < l && signs.indexOf(picture.charAt(i)) === -1) {
				i++;
			}
			prefix = picture.substring(0, i);
			dss = ess = ps = pms = false;
			mips = 0;
			minfps = 0;
			maxfps = 0;
			mes = 0;
			iipgp = [];
			ipgp = [];
			fpgp = [];
			while (i < l && esigns.indexOf(picture.charAt(i)) !== -1) {
				switch (picture.charAt(i)) {
					case ".":
						dss = true;
						fstart = i + 1;
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
						break;
					case ",":
						if (dss) {
							fpgp.push(i - fstart);
						} else {
							iipgp.push(i);
						}
						break;
					case "e":
						ess = true;
						if (!dss) {
							j = 0;
							l2 = iipgp.length;
							while (j < l2) {
								ipgp[l2 - j - 1] = i - iipgp[j] - 1;
								j++;
							}
						}
						break;
					case "-":
						ms = true;
						msbefore = mips === 0;
						break;
					case "%":
						ps = true;
						psafter = mips !== 0;
						value *= 100;
						if (!dss) {
							j = 0;
							l2 = iipgp.length;
							while (j < l2) {
								ipgp[l2 - j - 1] = i - iipgp[j] - 1;
								j++;
							}
						}
						break;
					case "\u2030":
						pms = true;
						pmsafter = mips !== 0;
						value *= 1000;
						if (!dss) {
							j = 0;
							l2 = iipgp.length;
							while (j < l2) {
								ipgp[l2 - j - 1] = i - iipgp[j] - 1;
								j++;
							}
						}
						break;
					case "0":
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						if (ess) {
							mes++;
						} else if (dss) {
							minfps++;
							maxfps++;
						} else {
							mips++;
						}
						break;
					case "#":
						if (dss) {
							maxfps++;
						}
						break;
				}
				i++;
			}
			if (!dss) {
				if (iipgp.length !== ipgp.length) {
					j = 0;
					l2 = iipgp.length;
					while (j < l2) {
						ipgp[l2 - j - 1] = i - iipgp[j] - 1;
						j++;
					}
				}
				if (mips === 0) {
					mips = 1;
				}
			}
			if (ipgp.length > 1) {
				j = 1;
				l2 = ipgp.length;
				while (j < l2 && ipgp[j] % ipgp[0] === 0) {
					j++;
				}
				if (j === l2) {
					ipgp = [ipgp[0]];
				}
			}
			if (ipgp.length === 1) {
				j = 1;
				while (j < 30) {
					ipgp[j] = ipgp[j - 1] + ipgp[0];
					j++;
				}
			}
			suffix = picture.substring(i);
			if (value === Number.POSITIVE_INFINITY) {
				return prefix + XsltForms_browser.i18n.get("format-number.infinity", "Infinity") + suffix;
			} else if (value === Number.NEGATIVE_INFINITY) {
				return XsltForms_browser.i18n.get("format-number.minus-sign", "-") + prefix + XsltForms_browser.i18n.get("format-number.infinity", "Infinity") + suffix;
			}
			if (value < 0 && pictures.length === 1) {
				prefix = XsltForms_browser.i18n.get("format-number.minus-sign", "-") + prefix;
			}
			if (ess) {
				evalue = Math.floor(Math.log(value) / Math.LN10) + 1 - mips;
				value /= Math.pow(10, evalue);
				esign = evalue < 0 ? XsltForms_browser.i18n.get("format-number.minus-sign", "-") : "";
				evalue = "" + Math.abs(evalue);
				evalue = esign + ("000000000000000000000000000000").substr(0, Math.max(0, mes - evalue.length)) + evalue;
			}
			s0 = Math.abs(value).toFixed(maxfps);
			if (maxfps === 0 && dss) {
				s0 += ".";
			}
			dsspos = s0.indexOf(".") === -1 ? s0.length : s0.indexOf(".");
			if (dsspos < mips) {
				s0 = ("000000000000000000000000000000").substr(0, mips - dsspos) + s0;
				dsspos = mips;
			}
			j = dsspos - 1;
			s = "";
			i = 0;
			l2 = s0.length;
			while (j >= 0) {
				s = s0.charAt(j) + s;
				if (j !== 0 && ipgp[i] === dsspos - j) {
					s = XsltForms_browser.i18n.get("format-number.grouping-separator-sign", ",") + s;
					i++;
				}
				j--;
			}
			if (dss) {
				s += XsltForms_browser.i18n.get("format-number.decimal-separator-sign", ".");
				j = dsspos + 1;
				i = 0;
				while (j < l2) {
					s += s0.charAt(j);
					if (j !== l2 - 1 && fpgp[i] === j - dsspos) {
						s += XsltForms_browser.i18n.get("format-number.grouping-separator-sign", ",");
						i++;
					}
					j++;
				}
			}
			if (ps) {
				if (psafter) {
					s += XsltForms_browser.i18n.get("format-number.percent-sign", "%");
				} else {
					s = XsltForms_browser.i18n.get("format-number.percent-sign", "%") + s;
				}
			}
			if (pms) {
				if (pmsafter) {
					s += XsltForms_browser.i18n.get("format-number.per-mille-sign", "%");
				} else {
					s = XsltForms_browser.i18n.get("format-number.per-mille-sign", "%") + s;
				}
			}
			if (ess) {
				s += XsltForms_browser.i18n.get("format-number.exponent-separator-sign", "e") + evalue;
			}
			return prefix + s + suffix;
		} ),
	"http://www.w3.org/2002/xforms transform" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet, xslhref, inline) {
			if (arguments.length < 3) {
				throw XsltForms_xpathFunctionExceptions.transformInvalidArgumentsNumber;
			}
			if (nodeSet.length === 0) {
				return "";
			}
			var args = [];
			args.push(XsltForms_browser.saveNode(nodeSet[0], "application/xml"));
			args.push(XsltForms_globals.stringValue(xslhref));
			args.push(XsltForms_globals.booleanValue(inline));
			for (var i = 3, len = arguments.length; i < len; i++) {
				args.push(XsltForms_globals.stringValue(arguments[i]));
			}
			return XsltForms_browser.transformText.apply(null, args);
		} ),
	"http://www.w3.org/2002/xforms serialize" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODE, false,
		function(nodeSet, mediatype, indent) {
			if (arguments.length >= 1 && typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.serializeInvalidArgumentType;
			}
			if (arguments.length === 0) {
				throw XsltForms_xpathFunctionExceptions.serializeNoContext;
			}
			return nodeSet.length === 0 ? "" : XsltForms_browser.saveNode(nodeSet[0], mediatype ? XsltForms_globals.stringValue(mediatype) : "application/xml", null, indent === "yes" ? indent : null);
		} ),
	"http://www.w3.org/2002/xforms event" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(attribute) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.eventInvalidArgumentsNumber;
			}
			for (var i = XsltForms_xmlevents.EventContexts.length - 1; i >= 0 ; i--) {
				var context = XsltForms_xmlevents.EventContexts[i];
				if (context[attribute]) {
					return context[attribute];
				}
			}
			return null;
		} ),
	"http://www.w3.org/2005/xpath-functions bind" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx, bindid) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.bindInvalidArgumentsNumber;
			}
			var elt = XsltForms_idManager.find(XsltForms_globals.stringValue(bindid));
			if (!elt) {
				return null;
			}
			var xf = elt.xfElement;
			ctx.addDepElement(xf);
			return xf.nodes;
		} ),
	"http://www.w3.org/2005/xpath-functions is-non-empty-array" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
		function(nodeset) {
			if (arguments.length > 1) {
				throw XsltForms_xpathFunctionExceptions.isNonEmptyArrayInvalidArgumentsNumber;
			}
			if (typeof nodeset[0] !== "object") {
				throw XsltForms_xpathFunctionExceptions.isNonEmptyArrayInvalidArgumentType;
			}
			return nodeset[0].getAttribute("exsi:maxOccurs") && nodeset[0].getAttribute("xsi:nil") !== "true";
		} ),
	"http://exslt.org/math abs" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.abs(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math acos" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.acos(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math asin" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.asin(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math atan" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.atan(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math atan2" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number1, number2) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.math2InvalidArgumentsNumber;
			}
			return Math.atan2(XsltForms_globals.numberValue(number1), XsltForms_globals.numberValue(number2));
		} ),
	"http://exslt.org/math constant" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(string, number) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.math2InvalidArgumentsNumber;
			}
			var val = XsltForms_mathConstants[XsltForms_globals.stringValue(string)] || "0";
			return parseFloat(val.substr(0, XsltForms_globals.numberValue(number)+2));
		} ),
	"http://exslt.org/math cos" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.cos(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math exp" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.exp(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math log" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.log(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math power" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number1, number2) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.math2InvalidArgumentsNumber;
			}
			return Math.pow(XsltForms_globals.numberValue(number1), XsltForms_globals.numberValue(number2));
		} ),
	"http://exslt.org/math sin" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.sin(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math sqrt" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.sqrt(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/math tan" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(number) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
			}
			return Math.tan(XsltForms_globals.numberValue(number));
		} ),
	"http://exslt.org/regular-expressions match" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(str, pattern, flags) {
			if (arguments.length !== 2 && arguments.length !== 3) {
				throw XsltForms_xpathFunctionExceptions.matchInvalidArgumentsNumber;
			}
			str = XsltForms_globals.stringValue(str);
			pattern = XsltForms_globals.stringValue(pattern);
			if (flags) {
				flags = XsltForms_globals.stringValue(flags);
			} else {
				flags = "";
			}
			try {
				var re = new RegExp(pattern, flags);
				var mres = str.match(re);
				if (!mres) {
					return [];
				}
				var melts = "";
				for (var i = 0, l = mres.length; i < l; i++) {
					melts += "<match>" + mres[i] + "</match>";
				}
				var mdoc = XsltForms_browser.createXMLDocument("<matches>" + melts + "</matches>");
				var marr = [];
				for(i = 0, l = mdoc.documentElement.children.length; i <l; i++) {
					marr.push(mdoc.documentElement.children[i]);
				}
				return marr;
			} catch (e) {
				return [];
			}
		} ),
	"http://www.w3.org/2005/xpath-functions alert" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(arg) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.alertInvalidArgumentsNumber;
			}
			alert(XsltForms_globals.stringValue(arg));
			return arg;
		} ),
	"http://www.w3.org/2005/xpath-functions itext" : new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctx, id) {
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.itextInvalidArgumentsNumber;
			}
			var itext = document.getElementById(XsltForms_browser.getDocMeta(ctx.node.ownerDocument, "model")).xfElement.itext;
			var translation = itext[XsltForms_globals.language] || itext[itext.defaultlang];
			return translation[id];
		} ),
	"http://www.w3.org/2005/xpath-functions js-eval" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(arg) {
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.jsevalInvalidArgumentsNumber;
			}
			return eval(XsltForms_globals.stringValue(arg));
		} ),
	"http://www.w3.org/2005/xpath-functions string-join" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(nodeSet, joinString) { 
			if (arguments.length !== 1 && arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.stringJoinInvalidArgumentsNumber;
			}
			if (typeof nodeSet !== "object") {
				throw XsltForms_xpathFunctionExceptions.stringJoinInvalidArgumentType;
			}
			var strings = [];
			joinString = joinString || "";
			for (var i = 0, len = nodeSet.length; i < len; i++) {
				strings.push(XsltForms_globals.xmlValue(nodeSet[i]));
			}
			return strings.join(joinString);
		} ),
	"http://www.w3.org/2005/xpath-functions selection" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctrlid) { 
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.selectionInvalidArgumentsNumber;
			}
			var controlid = XsltForms_globals.stringValue(ctrlid);
			var control = XsltForms_idManager.find(controlid);
			if (control && control.xfElement) {
				control = control.xfElement;
				var input = control.input;
				return input.value.substring(input.selectionStart, input.selectionEnd);
			}
			return "";
		}),
	"http://www.w3.org/2005/xpath-functions control-property" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(ctrlid, property) { 
			if (arguments.length !== 2) {
				throw XsltForms_xpathFunctionExceptions.controlPropertyJoinInvalidArgumentsNumber;
			}
			var controlid = XsltForms_globals.stringValue(ctrlid);
			var control = XsltForms_idManager.find(controlid);
			if (control && control.xfElement) {
				control = control.xfElement;
				var input = control.input;
				property = XsltForms_globals.stringValue(property);
				if (input[property]) {
					return input[property];
				}
			}
			return "";
		}),
	"http://www.w3.org/2005/xpath-functions encode-for-uri" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(rawString) { 
			if (arguments.length !== 1) {
				throw XsltForms_xpathFunctionExceptions.encodeForUriInvalidArgumentsNumber;
			}
			return encodeURIComponent(XsltForms_globals.stringValue(rawString));
		}),
	"http://www.w3.org/2005/xpath-functions fromtostep" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(from, to, step) {
			var res = [];
			for (var i = from; i <= to; i += step) {
				res.push({nodeType:Fleur.Node.DOCUMENT_NODE,localName:"repeatitem",text:i+"",documentElement:"dummy",getUserData:function(){return "";}});
			}
			return res;
		}),
	"http://www.w3.org/2005/xpath-functions tokenize" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function(input, pattern) {
			var tokens = [];
			input = XsltForms_globals.stringValue(input);
			pattern = new RegExp(XsltForms_globals.stringValue(pattern.replace(/\\/g, "\\")));
			var res = input.split(pattern);
			for (var i = 0, l = res.length; i < l; i++) {
				tokens.push({localName:"#text",text:res[i],documentElement:"dummy"});
			}
			return tokens;
		}),
	"http://www.w3.org/2005/xpath-functions uuid" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			if (arguments.length !== 0) {
				throw XsltForms_xpathFunctionExceptions.uuidInvalidArgumentsNumber;
			}
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}),
	"http://www.w3.org/2005/xpath-functions invalid-id" : new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
		function() {
			return XsltForms_globals.invalid_id_(XsltForms_globals.body);
		})
};
XsltForms_globals.invalid_id_ = function(element) {
	if (element.nodeType !== Fleur.Node.ELEMENT_NODE || element.id === "xsltforms_console" || element.hasXFElement === false) {
		return "";
	}
	var xf = element.xfElement;
	if (xf && xf.controlName !== "group" && !(xf instanceof Array) && !xf.isRepeat) {
		return xf.notvalid && !xf.isOutput ? element.id : "";
	}
	var childs = element.children || element.childNodes;
	for (var i = 0, l = childs.length; i < l; i++) {
		var id = XsltForms_globals.invalid_id_(childs[i]);
		if (id !== "") {
			return id;
		}
	}
	return "";
};
XsltForms_globals.validate_ = function(node) {
	if (XsltForms_browser.getBoolMeta(node, "notvalid") || XsltForms_browser.getBoolMeta(node, "unsafe")) {
		return false;
	}
	var atts = node.attributes || [];
	for (var i = 0, len = atts.length; i < len; i++) {
		if (atts[i].nodeName.substr(0,10) !== "xsltforms_" && atts[i].nodeName.substr(0,5) !== "xmlns" && !XsltForms_globals.validate_(atts[i])) {
			return false;
		}
	}
	var childs = node.childNodes || [];
	for (var j = 0, len2 = childs.length; j < len2; j++) {
		if (!XsltForms_globals.validate_(childs[j])) {
			return false;
		}
	}
	return true;
};
function XsltForms_functionCallExpr(fname) {
	this.name = fname;
	this.func = XsltForms_xpathCoreFunctions[fname];
	this.xpathfunc = !!this.func;
	this.args = [];
	if (!this.xpathfunc) {
		try {
			this.func = eval(fname.split(" ")[1]);
		} catch (e) {
		 alert(e);
		}
	}
	if (!this.func) {
		XsltForms_globals.error(this, "xforms-compute-exception", "Function " + this.name + "() not found");
	}
	for (var i = 1, len = arguments.length; i < len; i++) {
		this.args.push(arguments[i]);
	}
}
XsltForms_functionCallExpr.prototype.evaluate = function(ctx) {
	var arguments_ = [];
	if (this.xpathfunc) {
		for (var i = 0, len = this.args.length; i < len; i++) {
			arguments_[i] = this.args[i].evaluate(ctx);
		}
		return this.func.call(ctx, arguments_);
	} else {
		for (var i2 = 0, len2 = this.args.length; i2 < len2; i2++) {
			arguments_[i2] = XsltForms_globals.stringValue(this.args[i2].evaluate(ctx));
		}
		XsltForms_context = {ctx: ctx};
		return this.func.apply(null,arguments_);
	}
};
function XsltForms_coreElement() {
}
XsltForms_coreElement.prototype.init = function(subform, id, parentElt, className) {
	this.subforms = [];
	this.subforms[subform] = true;
	this.nbsubforms = 1;
	this.subform = subform;
	parentElt = parentElt? parentElt.element : XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "head")[0]: document.getElementsByTagName("head")[0];
	this.element = XsltForms_browser.createElement("span", parentElt, null, className);
	this.element.id = id;
	this.element.xfElement = this;
};
XsltForms_coreElement.prototype.dispose = function() {
	this.element.xfElement = null;
	this.element.parentNode.removeChild(this.element);
	this.element = null;
	this.model = null;
};
function XsltForms_model(subform, id, schemas, functions, version) {
	var found;
	if (subform.id !== "xsltforms-mainform") {
		XsltForms_globals.addChange(this);
	}
	this.init(subform, id, null, "xforms-model");
	this.instances = {};
	this.binds = [];
	this.nodesChanged = [];
	this.newNodesChanged = [];
	this.schemas = [];
	this.defaultInstance = null;
	this.defaultSubmission = null;
	XsltForms_globals.models.push(this);
	subform.models.push(this);
	var elt = document.getElementById(id);
	XsltForms_globals.defaultModel = XsltForms_globals.defaultModel || this;
	if (elt) {
		elt.getInstanceDocument = function(modid) {
			return this.xfElement.getInstanceDocument(modid);
		};
		elt.rebuild = function() {
			return this.xfElement.rebuild();
		};
		elt.recalculate = function() {
			return this.xfElement.recalculate();
		};
		elt.revalidate = function() {
			return this.xfElement.revalidate();
		};
		elt.refresh = function() {
			return this.xfElement.refresh();
		};
		elt.reset = function() {
			return this.xfElement.reset();
		};
		elt.handleEvent = function(evtname, evcontext) {
			XsltForms_xmlevents.dispatch(elt, evtname, null, null, null, null, evcontext);
		};
	}
	if (schemas) {
		schemas = schemas.split(" ");
		for (var i = 0, len = schemas.length; i < len; i++) {
			found = false;
			for (var sid in XsltForms_schema.all) {
				if (XsltForms_schema.all.hasOwnProperty(sid)) {
					var schema = XsltForms_schema.all[sid];
					if (schema.name === schemas[i]) {
						this.schemas.push(schema);
						found = true;
						break;
					}
				}
			}
			if (!found) {
				XsltForms_globals.error(this, "xforms-link-exception", "Schema " + schemas[i] + " not found");
			}
		}
	}
	if (functions) {
		var fs = functions.split(" ");
		for (var j = 0, len2 = fs.length; j < len2; j++) {
			found = false;
			for (var k = 0, len3 = XsltForms_xpathCoreFunctions.length; k < len3; k++) {
				if (XsltForms_xpathCoreFunctions[k].split(" ")[1] === fs[j]) {
					found = true;
					break;
				}
			}
			if (!found) {
				try {
					i = eval(fs[j]);
				} catch (e) {
					XsltForms_globals.error(this, "xforms-compute-exception", "Function " + fs[j] + "() not found");
				}
			}
		}
	}
	if (version) {
		var vs = version.split(" ");
		for (var l = 0, len4 = vs.length; l < len4; l++) {
			if (vs[l] !== "1.0" && vs[l] !== "1.1") {
				XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-version-exception", "Version " + vs[l] + " not supported");
				break;
			}
		}
	}
}
XsltForms_model.prototype = new XsltForms_coreElement();
XsltForms_model.create = function(subform, id, schemas, functions, version) {
	var elt = document.getElementById(id);
	if (elt) {
		elt.xfElement.subforms[subform] = true;
		elt.xfElement.nbsubforms++;
		subform.models.push(elt.xfElement);
		XsltForms_globals.addChange(elt.xfElement);
		return elt.xfElement;
	} else {
		return new XsltForms_model(subform, id, schemas, functions, version);
	}
};
XsltForms_model.prototype.addInstance = function(instance) {
	this.instances[instance.element.id] = instance;
	this.defaultInstance = this.defaultInstance || instance;
};
XsltForms_model.prototype.addBind = function(bind) {
	this.binds.push(bind);
};
XsltForms_model.prototype.dispose = function(subform) {
	if (subform && this.nbsubforms !== 1) {
		this.subforms[subform] = null;
		this.nbsubforms--;
		return;
	}
	this.instances = null;
	this.binds = null;
	this.itext = null;
	this.defaultInstance = null;
	for (var i = 0, l = XsltForms_globals.models.length; i < l; i++) {
		if (XsltForms_globals.models[i] === this) {
			XsltForms_globals.models.splice(i, 1);
			break;
		}
	}
	XsltForms_coreElement.prototype.dispose.call(this);
};
XsltForms_model.prototype.getInstance = function(id) {
	return id ? this.instances[id] : this.defaultInstance;
};
XsltForms_model.prototype.getInstanceDocument = function(id) {
	var instance = this.getInstance(id);
	return instance? instance.doc : null;
};
XsltForms_model.prototype.findInstance = function(node) {
	var doc = node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument;
	for (var id in this.instances) {
		if (this.instances.hasOwnProperty(id)) {
			var inst = this.instances[id];
			if (doc === inst.doc) {
				return inst;
			}
			for (var fn in inst.archive) {
				if (inst.archive.hasOwnProperty(fn)) {
					if (doc === inst.archive[fn].doc) {
						return inst;
					}
				}
			}
		}
	}
	return null;
};
XsltForms_model.prototype.construct = function() {
	if (!XsltForms_globals.ready) {
		XsltForms_browser.forEach(this.instances, "construct");
	}
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-rebuild");
	} else {
		this.rebuild();
	}
	XsltForms_xmlevents.dispatch(this, "xforms-model-construct-done");
	if (this === XsltForms_globals.models[XsltForms_globals.models.length - 1]) {
		window.setTimeout("XsltForms_xmlevents.dispatchList(XsltForms_globals.models, \"xforms-ready\")", 1);
	}
};
XsltForms_model.prototype.reset = function() {
	XsltForms_browser.forEach(this.instances, "reset");
	this.setRebuilded(true);
	XsltForms_globals.addChange(this);
};
XsltForms_model.prototype.rebuild = function() {
	if (XsltForms_globals.ready) {
		this.setRebuilded(true);
	}
	XsltForms_browser.forEach(this.binds, "refresh");
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-recalculate");
	} else {
		this.recalculate();
	}
};
XsltForms_model.prototype.recalculate = function() { 
	XsltForms_browser.forEach(this.binds, "recalculate");
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-revalidate");
	} else {
		this.revalidate();
	}
};
XsltForms_model.prototype.revalidate = function() {
	XsltForms_browser.forEach(this.instances, "revalidate");
	if (XsltForms_globals.ready) {
		XsltForms_xmlevents.dispatch(this, "xforms-refresh");
	}
};
XsltForms_model.prototype.refresh = function() {
};
XsltForms_model.prototype.addChange = function(node) {
	var list = XsltForms_globals.building? this.newNodesChanged : this.nodesChanged;
	if (!XsltForms_browser.inArray(node, list)) {
		XsltForms_globals.addChange(this);
	}
	if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE && !XsltForms_browser.inArray(node, list)) {
		list.push(node);
		node = node.ownerElement ? node.ownerElement : node.selectSingleNode("..");
	}
	while (node && node.nodeType !== Fleur.Node.DOCUMENT_NODE && !XsltForms_browser.inArray(node, list)) {
		list.push(node);
		node = node.nodeType === Fleur.Node.ENTRY_NODE ? node.ownerMap : node.parentNode;
	}
};
XsltForms_model.prototype.setRebuilded = function(value) {
	if (XsltForms_globals.building) {
		this.newRebuilded = value;
	} else {
		this.rebuilded = value;
	}
};
XsltForms_model.prototype.additext = function(itext) {
	this.itext = itext;
	return this;
};
function XsltForms_instance(subform, id, model, readonly, mediatype, src, srcDoc) {
	if (XsltForms_domEngine === "") {
		this.init(subform, id, model, "xforms-instance");
		this.readonly = readonly;
		var lines = mediatype.split(";");
		this.mediatype = lines[0];
		for (var i = 1, len = lines.length; i < len; i++) {
			var vals = lines[i].split("=");
			switch (vals[0].replace(/^\s+/g,'').replace(/\s+$/g,'')) {
				case "header":
					this.header = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'') === "present";
					break;
				case "separator":
					this.separator = (decodeURI ? decodeURI : unescape)(vals[1].replace(/^\s+/g,'').replace(/\s+$/g,''));
					break;
				case "charset":
					this.charset = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
					break;
			}
		}
		this.src = XsltForms_browser.unescape(src);
		var newmediatype = this.mediatype;
		if (newmediatype.substr(newmediatype.length - 4) === "/xml" || newmediatype.substr(newmediatype.length - 4) === "/xsl" || newmediatype.substr(newmediatype.length - 4) === "+xml") {
			newmediatype = "application/xml";
		}
		switch(newmediatype) {
			case "application/xml":
				this.srcDoc = XsltForms_browser.unescape(srcDoc);
				if (this.srcDoc.substring(0, 1) === "&") {
					this.srcDoc = XsltForms_browser.unescape(this.srcDoc);
				}
				break;
			case "text/json":
			case "application/json":
				if (srcDoc) {
					var json;
					eval("json = " + XsltForms_browser.unescape(srcDoc));
					this.srcDoc = XsltForms_browser.json2xml("", json, true, false);
				} else {
					this.srcDoc = "";
				}
				break;
			case "text/csv":
				this.srcDoc = XsltForms_browser.csv2xml(XsltForms_browser.unescape(srcDoc), this.separator, this.header);
				break;
			case "text/vcard":
				this.srcDoc = XsltForms_browser.vcard2xcard(XsltForms_browser.unescape(srcDoc));
				break;
			case "application/zip":
			case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				this.srcDoc = "<dummy/>";
				break;
			default:
				alert("Unsupported mediatype '" + mediatype + "' for instance #" + id);
				return;
		}
		this.model = model;
		this.doc = XsltForms_browser.createXMLDocument("<dummy/>");
		XsltForms_browser.setDocMeta(this.doc, "instance", id);
		XsltForms_browser.setDocMeta(this.doc, "model", model.element.id);
		model.addInstance(this);
		subform.instances.push(this);
	} else {
		this.init(subform, id, model, "xforms-instance");
		this.readonly = readonly;
		this.mediatype = mediatype;
		this.src = XsltForms_browser.unescape(src);
		this.srcDoc = XsltForms_browser.unescape(srcDoc).replace(/^\s+|\s+$/gm,'');
		this.model = model;
		this.doc = XsltForms_browser.createXMLDocument("<dummy/>");
		XsltForms_browser.setDocMeta(this.doc, "instance", id);
		XsltForms_browser.setDocMeta(this.doc, "model", model.element.id);
		model.addInstance(this);
		subform.instances.push(this);
	}
}
XsltForms_instance.prototype = new XsltForms_coreElement();
XsltForms_instance.create = function(subform, id, model, readonly, mediatype, src, srcDoc) {
	var instelt = document.getElementById(id);
	if (instelt && instelt.xfElement) {
		instelt.xfElement.subforms[subform] = true;
		instelt.xfElement.nbsubforms++;
		subform.instances.push(instelt.xfElement);
		return instelt.xfElement;
	}
	return new XsltForms_instance(subform, id, model, readonly, mediatype, src, srcDoc);
};
XsltForms_instance.prototype.dispose = function(subform) {
	if (subform && this.nbsubforms !== 1) {
		this.subforms[subform] = null;
		this.nbsubforms--;
		return;
	}
	XsltForms_coreElement.prototype.dispose.call(this);
};
XsltForms_instance.prototype.construct = function(subform) {
	var ser;
	if (!XsltForms_globals.ready || (subform && !subform.ready && this.nbsubforms === 1)) {
		if (this.src) {
			if (this.src.substring(0, 8) === "local://") {
				try {
					if (typeof(localStorage) === 'undefined') {
						throw new Error({ message: "local:// not supported" });
					}
					this.setDoc(window.localStorage.getItem(this.src.substr(8)));
				} catch(e) {
					XsltForms_globals.error(this.element, "xforms-link-exception", "Fatal error loading " + this.src, e.toString());
				}
			} else if (this.src.substr(0, 9) === "opener://") {
				try {
					ser = window.opener.XsltForms_globals.xmlrequest('get', this.src.substr(9));
					this.setDoc(ser);
				} catch (e) {
					XsltForms_globals.error(this.element, "xforms-link-exception", "Fatal error loading " + this.src, e.toString());
				} 
			} else {
				if (this.src.substr(0, 11) === "javascript:") {
					try {
						eval("ser = (" + this.src.substr(11) + ");");
						this.setDoc(ser);
					} catch (e) {
						XsltForms_globals.error(this.element, "xforms-link-exception", "Error evaluating the following Javascript expression: "+this.src.substr(11));
					}
				} else {
					var cross = false;
					if (this.src.match(/^[a-zA-Z0-9+\.\-]+:\/\//)) {
						var domain = /^([a-zA-Z0-9+\.\-]+:\/\/[^\/]*)/;
						var sdom = domain.exec(this.src);
						var ldom = domain.exec(document.location.href);
						cross = sdom[0] !== ldom[0];
					}
					if (cross) {
						this.setDoc('<dummy xmlns=""/>');
						XsltForms_browser.jsoninstobj = this;
						var scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
						scriptelt.setAttribute("src", this.src+((this.src.indexOf("?") === -1) ? "?" : "&")+"callback=XsltForms_browser.jsoninst");
						scriptelt.setAttribute("id", "jsoninst");
						scriptelt.setAttribute("type", "text/javascript");
						var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
						body.insertBefore(scriptelt, body.firstChild);
					} else {
						try {
							var req = XsltForms_browser.openRequest("GET", this.src, false);
							XsltForms_browser.debugConsole.write("Loading " + this.src);
							if ((this.mediatype === "application/zip" || this.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" )&& req.overrideMimeType) {
								req.overrideMimeType('text/plain; charset=x-user-defined');
							} else if (this.mediatype === "text/csv") {
								req.overrideMimeType('text/csv');
							} else if (this.mediatype === "text/json" || this.mediatype === "application/json") {
								req.overrideMimeType('application/json; charset=x-user-defined');
							}
							req.send(null);
							if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
								throw new Error({ message: "Request error: " + req.status });
							}
							this.setDocFromReq(req);
						} catch(e) {
							XsltForms_globals.error(this.element, "xforms-link-exception", "Fatal error loading " + this.src, e.toString());
						}
					}
				}
			}
		} else {
			this.setDoc(this.srcDoc);
		}
	}
};
XsltForms_instance.prototype.reset = function() {
	this.setDoc(this.oldDoc, true);
};
XsltForms_instance.prototype.store = function(isReset) {
	if (this.oldDoc && !isReset) {
		this.oldDoc = null;
	}
	this.oldDoc = XsltForms_browser.saveDoc(this.doc, this.mediatype);
};
if (XsltForms_domEngine === "") {
	XsltForms_instance.prototype.setDoc = function(xml, isReset, preserveOld) {
		var instid = XsltForms_browser.getDocMeta(this.doc, "instance");
		var modid = XsltForms_browser.getDocMeta(this.doc, "model");
		XsltForms_browser.loadDoc(this.doc, xml);
		XsltForms_browser.setDocMeta(this.doc, "instance", instid);
		XsltForms_browser.setDocMeta(this.doc, "model", modid);
		if (!preserveOld) {
			this.store(isReset);
		}
		if (instid === XsltForms_browser.idPf + "instance-config") {
			XsltForms_browser.config = this.doc.documentElement;
			XsltForms_globals.htmlversion = XsltForms_browser.i18n.get("html");
		}
	};
} else {
	XsltForms_instance.prototype.setDoc = function(srcDoc, isReset, preserveOld) {
		var instid = XsltForms_browser.getDocMeta(this.doc, "instance");
		var modid = XsltForms_browser.getDocMeta(this.doc, "model");
		XsltForms_browser.loadDoc(this.doc, srcDoc, this.mediatype);
		XsltForms_browser.setDocMeta(this.doc, "instance", instid);
		XsltForms_browser.setDocMeta(this.doc, "model", modid);
		if (!preserveOld) {
			this.store(isReset);
		}
		if (instid === XsltForms_browser.idPf + "instance-config") {
			XsltForms_browser.config = this.doc.documentElement;
			XsltForms_globals.htmlversion = XsltForms_browser.i18n.get("html");
		}
	};
}
if (XsltForms_domEngine === "") {
	XsltForms_instance.prototype.setDocFromReq = function(req, isReset, preserveOld) {
		var srcDoc = req.responseText;
		var mediatype = req.getResponseHeader('Content-Type') ? req.getResponseHeader('Content-Type') : this.mediatype;
		var lines = mediatype.split(";");
		var i0, len;
		this.mediatype = lines[0];
		for (i0 = 1, len = lines.length; i0 < len; i0++) {
			var vals = lines[i0].split("=");
			switch (vals[0].replace(/^\s+/g,'').replace(/\s+$/g,'')) {
				case "header":
					this.header = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'') === "present";
					break;
				case "separator":
					this.separator = (decodeURI ? decodeURI : unescape)(vals[1].replace(/^\s+/g,'').replace(/\s+$/g,''));
					break;
				case "charset":
					this.charset = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
					break;
			}
		}
		if (XsltForms_browser.isChrome && this.mediatype === "text/plain") {
			switch(this.src.substr(this.src.indexOf("."))) {
				case ".xlsx":
					this.mediatype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					break;
				case ".docx":
					this.mediatype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					break;
				case ".csv":
					this.mediatype = "text/csv";
					break;
			}
		}
		var newmediatype = this.mediatype;
		if (newmediatype.substr(newmediatype.length - 4) === "/xml" || newmediatype.substr(newmediatype.length - 4) === "/xsl" || newmediatype.substr(newmediatype.length - 4) === "+xml") {
			newmediatype = "application/xml";
		}
		switch(newmediatype) {
			case "text/json":
			case "application/json":
				var json;
				eval("json = " + srcDoc);
				srcDoc = XsltForms_browser.json2xml("", json, true, false);
				break;
			case "text/csv":
				if (XsltForms_browser.isIE) {
					var convertResponseBodyToText = function (binary) {
						if (!XsltForms_browser.byteMapping) {
							var byteMapping = {};
							for (var i = 0; i < 256; i++) {
								for (var j = 0; j < 256; j++) {
									byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
								}
							}
							XsltForms_browser.byteMapping = byteMapping;
						}
						var rawBytes = XsltForms_browser_BinaryToArray_ByteStr(binary);
						var lastChr = XsltForms_browser_BinaryToArray_ByteStr_Last(binary);
						return rawBytes.replace(/[\s\S]/g, function (match) { return XsltForms_browser.byteMapping[match]; }) + lastChr;
					};
					srcDoc = XsltForms_browser.csv2xml(convertResponseBodyToText(req.responseBody), this.separator, this.header);
				} else {
					srcDoc = XsltForms_browser.csv2xml(srcDoc, this.separator, this.header);
				}
				break;
			case "text/vcard":
				srcDoc = XsltForms_browser.vcard2xcard(srcDoc);
				break;
			case "application/x-zip-compressed":
			case "application/zip":
			case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
			case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				var arch;
				if (XsltForms_browser.isIE) {
					var convertResponseBodyToTextb = function (binary) {
						if (!XsltForms_browser.byteMapping) {
							var byteMapping = {};
							for (var i = 0; i < 256; i++) {
								for (var j = 0; j < 256; j++) {
									byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
								}
							}
							XsltForms_browser.byteMapping = byteMapping;
						}
						var rawBytes = XsltForms_browser_BinaryToArray_ByteStr(binary);
						var lastChr = XsltForms_browser_BinaryToArray_ByteStr_Last(binary);
						return rawBytes.replace(/[\s\S]/g, function (match) { return XsltForms_browser.byteMapping[match]; }) + lastChr;
					};
					arch = XsltForms_browser.zip2xml(convertResponseBodyToTextb(req.responseBody), this.mediatype, this.element.id, this.model.element.id);
				} else {
					arch = XsltForms_browser.zip2xml(srcDoc, this.mediatype, this.element.id, this.model.element.id);
				}
				srcDoc = arch.srcDoc;
				delete arch.srcDoc;
				this.archive = arch;
				break;
			case "application/xml":
				break;
			default:
				alert("Unsupported mediatype '" + this.mediatype + "' for instance #" + this.element.id);
				return;
		}
		this.setDoc(srcDoc, isReset, preserveOld);
	};
} else {
	XsltForms_instance.prototype.setDocFromReq = function(req, isReset, preserveOld) {
		var srcDoc = req.responseText;
		if (XsltForms_browser.isChrome && this.mediatype === "text/plain") {
			switch(this.src.substr(this.src.indexOf("."))) {
				case ".xlsx":
					this.mediatype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
					break;
				case ".docx":
					this.mediatype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
					break;
				case ".csv":
					this.mediatype = "text/csv";
					break;
			}
		}
		this.mediatype = req.getResponseHeader('Content-Type') ? req.getResponseHeader('Content-Type') : this.mediatype;
		this.setDoc(srcDoc, isReset, preserveOld);
	};
}
XsltForms_instance.prototype.revalidate = function() {
	if (!this.readonly && this.doc.documentElement) {
		this.validation_(this.doc.documentElement);
	}
};
XsltForms_instance.prototype.validation_ = function(node, readonly, notrelevant) {
	if (!readonly) {
		readonly = false;
	}
	if (!notrelevant) {
		notrelevant = false;
	}
	this.validate_(node, readonly, notrelevant);
	readonly = XsltForms_browser.getBoolMeta(node, "readonly");
	notrelevant = XsltForms_browser.getBoolMeta(node, "notrelevant");
	var atts = node.attributes || [];
	if (atts) {
		var atts2 = [];
		for (var i = 0, len = atts.length; i < len; i++) {
			if (atts[i].nodeName.substr(0,10) !== "xsltforms_" && atts[i].nodeName.substr(0,5) !== "xmlns") {
				atts2[atts2.length] = atts[i];
			}
		}
		for (var i2 = 0, len2 = atts2.length; i2 < len2; i2++) {
			this.validation_(atts2[i2], readonly, notrelevant);
		}
	}
	if (node.childNodes) {
		for (var j = 0, len1 = node.childNodes.length; j < len1; j++) {
			var child = node.childNodes[j];
			if (child.nodeType === Fleur.Node.ELEMENT_NODE) {
				this.validation_(child, readonly, notrelevant);
			}
		}
	}
};
XsltForms_instance.prototype.validate_ = function(node, readonly, notrelevant) {
	var bindids = XsltForms_browser.getMeta(node, "bind");
	var value = XsltForms_globals.xmlValue(node);
	var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
	if (bindids) {
		var binds = bindids.split(" ");
		var relevantfound = false;
		var readonlyfound = false;
		for (var i = 0, len = binds.length; i < len; i++) {
			var bind = document.getElementById(binds[i]).xfElement;
			var nodes = bind.nodes;
			var i2 = 0;
			for (var len2 = nodes.length; i2 < len2; i2++) {
				if (nodes[i2] === node) {
					break;
				}
			}
			for (var j = 0, len3 = bind.depsNodes.length; j < len3; j++) {
				XsltForms_browser.rmValueMeta(bind.depsNodes[j], "depfor", bind.depsId);
			}
			bind.depsNodes.length = 0;
			var ctx = new XsltForms_exprContext(this.subform, node, i2, nodes, null, null, null, [], bind.depsId);
			if (bind.required) {
				this.setProperty_(node, "required", bind.required.evaluate(ctx, node));
			}
			if (notrelevant || !relevantfound || bind.relevant) {
				this.setProperty_(node, "notrelevant", notrelevant || !(bind.relevant? bind.relevant.evaluate(ctx, node) : true));
				relevantfound = relevantfound || bind.relevant;
			}
			if (readonly || !readonlyfound || bind.readonly) {
				this.setProperty_(node, "readonly", readonly || (bind.readonly? bind.readonly.evaluate(ctx, node) : bind.calculate ? true : false));
				readonlyfound = readonlyfound || bind.readonly;
			}
			this.setProperty_(node, "notvalid",
				!XsltForms_browser.getBoolMeta(node, "notrelevant") && !(!(XsltForms_browser.getBoolMeta(node, "required") && (!value || value === "")) &&
				(XsltForms_browser.getNil(node) ? value === "" : !schtyp || schtyp.validate(value) && !XsltForms_browser.getBoolMeta(node, "unsafe")) &&
				(!bind.constraint || bind.constraint.evaluate(ctx, node))));
			XsltForms_browser.copyArray(ctx.depsNodes, bind.depsNodes);
		}
	} else {
		this.setProperty_(node, "notrelevant", notrelevant);
		this.setProperty_(node, "readonly", readonly);
		this.setProperty_(node, "notvalid", schtyp && (!schtyp.validate(value) || XsltForms_browser.getBoolMeta(node, "unsafe")));
	}
};
XsltForms_instance.prototype.setProperty_ = function (node, property, value) {
	if (XsltForms_browser.getBoolMeta(node, property) !== value) {
		XsltForms_browser.setBoolMeta(node, property, value);
		this.model.addChange(node);   
	}
};
XsltForms_browser.json2xmlreg = new RegExp("^[A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\xFF][A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\xFF\-\.0-9\xB7]*$");
XsltForms_browser.json2xml = function(eltname, json, root, inarray) {
	var fullname = "";
	if (eltname === "________" || !(json instanceof Array) && eltname !== "" && !XsltForms_browser.json2xmlreg.test(eltname)) {
		fullname = " exml:fullname=\"" + XsltForms_browser.escape(eltname) + "\"";
		eltname = "________";
	}
	var ret = root ? "<exml:anonymous xmlns:exml=\"http://www.agencexml.com/exml\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:exsi=\"http://www.agencexml.com/exi\" xmlns=\"\">" : "";
	if (json instanceof Array) {
		if (inarray) {
			ret += "<exml:anonymous exsi:maxOccurs=\"unbounded\">";
		}
		if (json.length === 0) {
			ret += "<" + (eltname === "" ? "exml:anonymous" : eltname) + fullname + " exsi:maxOccurs=\"unbounded\" xsi:nil=\"true\"/>";
		} else {
			for (var i = 0, len = json.length; i < len; i++) {
				ret += XsltForms_browser.json2xml(eltname === "" ? "exml:anonymous" : eltname, json[i], false, true);
			}
		}
		if (inarray) {
			ret += "</exml:anonymous>";
		}
	} else {
		var xsdtype = "";
		switch(typeof(json)) {
			case "string":
				xsdtype = " xsi:type=\"xsd:string\"";
				break;
			case "number":
				xsdtype = " xsi:type=\"xsd:double\"";
				break;
			case "boolean":
				xsdtype = " xsi:type=\"xsd:boolean\"";
				break;
			case "object":
				if (json instanceof Date) {
					xsdtype = " xsi:type=\"xsd:dateTime\"";
				}
				break;
		}
		if (eltname === "") {
			if (root && xsdtype !== "") {
				ret = ret.substr(0, ret.length - 1) + xsdtype + ">";
			}
		} else {
			ret += "<"+eltname+fullname+(inarray?" exsi:maxOccurs=\"unbounded\"":"")+xsdtype+">";
		}
		if (typeof(json) === "object" && !(json instanceof Date)) {
			for (var m in json) {
				if (json.hasOwnProperty(m)) {
					ret += XsltForms_browser.json2xml(m, json[m], false, false);
				}
			}
		} else {
			if (json instanceof Date) {
				ret += json.getFullYear() + "-";
				ret += (json.getMonth() < 9 ? "0" : "") + (json.getMonth()+1) + "-";
				ret += (json.getDate() < 10 ? "0" : "") + json.getDate() + "T";
				ret += (json.getHours() < 10 ? "0" : "") + json.getHours() + ":";
				ret += (json.getMinutes() < 10 ? "0" : "") + json.getMinutes() + ":";
				ret += (json.getSeconds() < 10 ? "0" : "") + json.getSeconds() + "Z";
			} else {
				ret += XsltForms_browser.escape(json);
			}
		}
		ret += eltname === "" ? "" : "</"+eltname+">";
	}
	ret += root ? "</exml:anonymous>" : "";
	return ret;
};
XsltForms_browser.node2json = function(node, comma) {
	var xsdtype, inarray, att, lname, s = "", i, l, lc, t;
	if (node.nodeType !== Fleur.Node.ELEMENT_NODE) {
		return "";
	}
	lname = node.localName ? node.localName : node.baseName;
	if (node.getAttributeNS) {
		xsdtype = node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type");
		inarray = node.getAttributeNS("http://www.agencexml.com/exi", "maxOccurs") === "unbounded";
		if (lname === "________") {
			lname = node.getAttributeNS("http://www.agencexml.com/exml", "fullname");
		}
	} else {
		att = node.selectSingleNode("@*[local-name()='type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']");
		xsdtype = att ? att.value : "";
		att = node.selectSingleNode("@*[local-name()='maxOccurs' and namespace-uri()='http://www.agencexml.com/exi']");
		inarray = att ? att.value === "unbounded" : false;
		if (lname === "________") {
			att = node.selectSingleNode("@*[local-name()='fullname' and namespace-uri()='http://www.agencexml.com/exml']");
			lname = att ? att.value : "";
		}
	}
	s = "";
	if (lname !== "anonymous" || node.namespaceURI !== "http://www.agencexml.com/exml") {
		s += lname + ":";
	}
	if (inarray) {
		s = "[";
		lc = 0;
		for (i = 0, l = node.childNodes.length; i < l; i++) {
			if (node.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE) {
				lc = i;
			}
		}
		for (i = 0; i <= lc; i++) {
			s += XsltForms_browser.node2json(node.childNodes[i], (i === lc ? "" : ","));
		}
		return s + "]" + comma;
	}
	t = node.text || node.textContent;
	switch (xsdtype) {
		case "xsd:string":
			return s + '"' + XsltForms_browser.escapeJS(t) + '"' + comma;
		case "xsd:double":
		case "xsd:boolean":
			return s + t + comma;
		case "xsd:dateTime":
			return s + 'new Date("' + t + '")' + comma;
		default:
			s += "{";
			lc = 0;
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				if (node.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE) {
					lc = i;
				}
			}
			for (i = 0; i <= lc; i++) {
				s += XsltForms_browser.node2json(node.childNodes[i], (i === lc ? "" : ","));
			}
			return s + "}" + comma;
	}
};
XsltForms_browser.xml2json = function(s) {
	var d = XsltForms_browser.createXMLDocument(s);
	return XsltForms_browser.node2json(d.documentElement, "");
};
var jsoninst = function(json) {
	XsltForms_browser.jsoninstobj.submission.pending = false;
	XsltForms_browser.dialog.hide("statusPanel", false);
	XsltForms_browser.jsoninstobj.instance.setDoc(XsltForms_browser.json2xml("", json, true, false));
	XsltForms_globals.addChange(XsltForms_browser.jsoninstobj.instance.model);
	XsltForms_xmlevents.dispatch(XsltForms_browser.jsoninstobj.instance.model, "xforms-rebuild");
	XsltForms_globals.refresh();
	document.body.removeChild(document.getElementById("jsoninst"));
};
XsltForms_browser.vcard2xcard_data = {
	state: 0,
	version: "4.0",
	reg_date: /^(\d{8}|\d{4}-\d\d|--\d\d(\d\d)?|---\d\d)$/,
	reg_time: /^(\d\d(\d\d(\d\d)?)?|-\d\d(\d\d?)|--\d\d)(Z|[+\-]\d\d(\d\d)?)?$/,
	reg_date_time: /^(\d{8}|--\d{4}|---\d\d)T\d\d(\d\d(\d\d)?)?(Z|[+\-]\d\d(\d\d)?)?$/,
	reg_uri: /^(([^:\/?#]+):)?(\/\/([^\/\?#]*))?([^\?#]*)(\?([^#]*))?(#([^\:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?$/,
	reg_utc_offset: /^[+\-]\d\d(\d\d)?$/
};
XsltForms_browser.vcard2xcard_escape = function(s) {
	return s.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/\\;/gm,";");
};
XsltForms_browser.vcard2xcard_param = {
	"PREF":        {fparam: function(value) {return "<integer>" + value + "</integer>";}},
	"TYPE":        {fparam: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}}
};
XsltForms_browser.vcard2xcard_prop = {
	"BEGIN":       {state: 0, fvalue: function(value) {XsltForms_browser.vcard2xcard_data.state = 1; return value.toUpperCase() === "VCARD" ? "<vcard>" : "<'Invalid directive: BEGIN:" + value + "'>";}},
	"END":         {state: 1, fvalue: function(value) {XsltForms_browser.vcard2xcard_data.state = 0; return value.toUpperCase() === "VCARD" ? "</vcard>" : "<'Invalid directive: END:" + value + "'>";}},
	"SOURCE":      {state: 1, tag: "source", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"KIND":        {state: 1, tag: "kind", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"XML":         {state: 1, fvalue: function(value) {return value;}},
	"FN":          {state: 1, tag: "fn", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"N":           {state: 1, tag: "n", fvalue: function(value) {var n = value.split(";"); return "<surname>" + XsltForms_browser.vcard2xcard_escape(n[0]) + "</surname><given>" + XsltForms_browser.vcard2xcard_escape(n[1]) + "</given><additional>" + XsltForms_browser.vcard2xcard_escape(n[2]) + "</additional><prefix>" + XsltForms_browser.vcard2xcard_escape(n[3]) + "</prefix><suffix>" + XsltForms_browser.vcard2xcard_escape(n[4]) + "</suffix>";}},
	"NICKNAME":    {state: 1, tag: "nickname", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"PHOTO":       {state: 1, tag: "photo", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"BDAY":        {state: 1, tag: "bday", fvalue: function(value) {return (XsltForms_browser.vcard2xcard_data.reg_date_time.test(value) ? "<date-time>" + value + "</date-time>" : XsltForms_browser.vcard2xcard_data.reg_date.test(value) ? "<date>" + value + "</date>" : XsltForms_browser.vcard2xcard_data.reg_time.test(value) ? "<time>" + value + "</time>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>");}},
	"ANNIVERSARY": {state: 1, tag: "anniversary", fvalue: function(value) {return (XsltForms_browser.vcard2xcard_data.reg_date_time.test(value) ? "<date-time>" + value + "</date-time>" : XsltForms_browser.vcard2xcard_data.reg_date.test(value) ? "<date>" + value + "</date>" : XsltForms_browser.vcard2xcard_data.reg_time.test(value) ? "<time>" + value + "</time>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>");}},
	"GENDER":      {state: 1, tag: "gender", fvalue: function(value) {var gender = value.split(";"); return "<sex>" + gender[0] + "</sex>" + (value.indexOf(";") !== -1 ? "<identity>" + XsltForms_browser.vcard2xcard_escape(gender[1]) + "</identity>": "");}},
	"ADR":         {state: 1, tag: "adr", fvalue: function(value) {var adr = value.split(";"); return "<pobox>" + XsltForms_browser.vcard2xcard_escape(adr[0]) + "</pobox><ext>" + XsltForms_browser.vcard2xcard_escape(adr[1]) + "</ext><street>" + XsltForms_browser.vcard2xcard_escape(adr[2]) + "</street><locality>" + XsltForms_browser.vcard2xcard_escape(adr[3]) + "</locality><region>" + XsltForms_browser.vcard2xcard_escape(adr[4]) + "</region><code>" + XsltForms_browser.vcard2xcard_escape(adr[5]) + "</code><country>" + XsltForms_browser.vcard2xcard_escape(adr[6]) + "</country>";}},
	"TEL":         {state: 1, tag: "tel", fvalue: function(value) {return (XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>");}},
	"EMAIL":       {state: 1, tag: "email", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"IMPP":        {state: 1, tag: "impp", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"LANG":        {state: 1, tag: "lang", fvalue: function(value) {return "<language-tag>" + value + "</language-tag>";}},
	"TZ":          {state: 1, tag: "tz", fvalue: function(value) {return XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : XsltForms_browser.vcard2xcard_data.reg_utc_offset.test(value) ? "<utc-offset>" + value + "</utc-offset>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"GEO":         {state: 1, tag: "geo", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"TITLE":       {state: 1, tag: "title", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"ROLE":        {state: 1, tag: "role", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"LOGO":        {state: 1, tag: "logo", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"ORG":         {state: 1, tag: "org", fvalue: function(value) {var orgs = value.split(";"); var s = ""; for (var i = 0, len = orgs.length; i < len; i++) { s += "<text>" + XsltForms_browser.vcard2xcard_escape(orgs[i]) + "</text>";} return s;}},
	"MEMBER":      {state: 1, tag: "member", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"RELATED":     {state: 1, tag: "related", fvalue: function(value) {return XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"CATEGORIES":  {state: 1, tag: "categories", fvalue: function(value) {var cats = value.split(";"); var s = ""; for (var i = 0, len = cats.length; i < len; i++) { s += "<text>" + XsltForms_browser.vcard2xcard_escape(cats[i]) + "</text>";} return s;}},
	"NOTE":        {state: 1, tag: "note", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"X-LOTUS-BRIEFCASE":        {state: 1, tag: "x-lotus-briefcase", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"PRODID":      {state: 1, tag: "prodid", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"REV":         {state: 1, tag: "rev", fvalue: function(value) {return "<timestamp>" + value + "</timestamp>";}},
	"SOUND":       {state: 1, tag: "sound", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"UID":         {state: 1, tag: "uid", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"CLIENTPIDMAP":{state: 1, tag: "clientpidmap", fvalue: function(value) {var cmap = value.split(";"); return "<sourceid>" + cmap[0] + "</sourceid><value-uri>" + cmap[1] + "</value-uri>";}},
	"URL":         {state: 1, tag: "url", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"VERSION":     {state: 1, fvalue: function(value) {XsltForms_browser.vcard2xcard_data.version = value; return "";}},
	"KEY":         {state: 1, tag: "key", fvalue: function(value) {return XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
	"FBURL":       {state: 1, tag: "fburl", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"CALADRURI":   {state: 1, tag: "caladruri", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
	"CALURI":      {state: 1, tag: "caluri", fvalue: function(value) {return "<uri>" + value + "</uri>";}}
};
XsltForms_browser.vcard2xcard = function(v) {
	var s = '<vcards xmlns="urn:ietf:params:xml:ns:vcard-4.0">';
	var vcards = v.replace(/(\r\n|\n|\r) /gm,"").replace(/^\s+/,"").replace(/\s+$/,"").split("\n");
	for (var i = 0, len = vcards.length; i < len; i++) {
		var sep = vcards[i].indexOf(":");
		var before = vcards[i].substring(0, sep);
		var after = vcards[i].substring(sep + 1);
		var propnames = before.split(";");
		var p = XsltForms_browser.vcard2xcard_prop[propnames[0]];
		if (p && p.state === XsltForms_browser.vcard2xcard_data.state) {
			var val = after.replace(/\\n/gm,"\n").replace(/\\,/gm,",");
			if (p.tag) {
				s += "<" + p.tag + ">";
			}
			if (propnames.length > 1) {
				s += "<parameters>";
				propnames.shift();
				for (var j = 0, len2 = propnames.length; j < len2;) {
					var par = propnames[j].split("=");
					var parname = par[0];
					var parobj = XsltForms_browser.vcard2xcard_param[parname];
					if (parobj) {
						s += "<" + parname.toLowerCase() + ">";
						while (par[0] === parname) {
							s += parobj.fparam(par[1]);
							j++;
							if (j < len2) {
								par = propnames[j].split("=");
							} else {
								break;
							}
						}
						s += "</" + parname.toLowerCase() + ">";
					} else {
						j++;
					}
				}
				s += "</parameters>";
			}
			s += p.fvalue(val);
			if (p.tag) {
				s += "</" + p.tag + ">";
			}
		}
	}
	return s + "</vcards>";
};
XsltForms_browser.xml2csv = function(s, sep) {
	var d = XsltForms_browser.createXMLDocument(s);
	var n0 = d.documentElement.firstChild;
	while (n0 && n0.nodeType !== Fleur.Node.ELEMENT_NODE) {
		n0 = n0.nextSibling;
	}
	var h = n0.cloneNode(true);
	d.documentElement.insertBefore(h, n0);
	var n = h;
	var r = "";
	sep = sep || ",";
	var seps = sep.split(" ");
	var fsep = seps[0];
	var decsep = seps[1];
	while (n) {
		if (n.nodeType === Fleur.Node.ELEMENT_NODE) {
			var m = n.firstChild;
			var l = "";
			while (m) {
				if (m.nodeType === Fleur.Node.ELEMENT_NODE) {
					var v = n === h ? m.getAttribute("fullname") || m.localName : m.text !== undefined ? m.text : m.textContent;
					if (v.indexOf("\n") !== -1 || v.indexOf(fsep) !== -1) {
						v = '"' + v.replace(/"/gm, '""') + '"';
					} else if (decsep && v.match(/^[\-+]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/)) {
						v = v.replace(/\./, decsep);
					}
					l += fsep + v;
				}
				m = m.nextSibling;
			}
			r += l.substr(1) + "\n";
		}
		n = n.nextSibling;
	}
	return r;
};
XsltForms_browser.csv2xml = function(s, sep, head) {
	var r = "<exml:anonymous xmlns:exml=\"http://www.agencexml.com/exml\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\" xmlns:exsi=\"http://www.agencexml.com/exi\" xmlns=\"\">";
	s = s.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
	if (s.substr(s.length - 1, 1) !== "\n") {
		s += "\n";
	}
	var headers = [];
	var first = head;
	var col = 0;
	var rowcat = "";
	var row = "";
	for (var i = 0, l = s.length; i < l; ) {
		var v = "";
		if (s.substr(i, 1) === '"') {
			i++;
			do {
				if (s.substr(i, 1) !== '"') {
					v += s.substr(i, 1);
					i++;
				} else {
					if (s.substr(i, 2) === '""') {
						v += '"';
						i += 2;
					} else {
						i++;
						break;
					}
				}
			} while (i < l);
		} else {
			while (s.substr(i, sep.length) !== sep && s.substr(i, 1) !== "\n") {
				v += s.substr(i, 1);
				i++;
			}
		}
		if (first) {
			headers.push(v);
		} else {
			rowcat += v;
			row += "<" + (head ? headers[col] : "exml:anonymous") + ">" + XsltForms_browser.escape(v) + "</" + (head ? headers[col] : "exml:anonymous") + ">";
		}
		if (s.substr(i, 1) === "\n") {
			if (!first && rowcat !== "") {
				r += "<exml:anonymous>" + row + "</exml:anonymous>";
			}
			first = false;
			col = 0;
			row = "";
			rowcat = "";
		} else {
			col++;
		}
		i++;
	}
	return r + "</exml:anonymous>";
};
XsltForms_browser.xsltsharedsrc = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ss="http://schemas.openxmlformats.org/spreadsheetml/2006/main" version="1.0">';
XsltForms_browser.xsltsharedsrc += '	<xsl:output method="text"/>';
XsltForms_browser.xsltsharedsrc += '	<xsl:template match="ss:si">';
XsltForms_browser.xsltsharedsrc += '		<xsl:value-of select="concat(\'|\',position() - 1,\':\',ss:t)"/>';
XsltForms_browser.xsltsharedsrc += '	</xsl:template>';
XsltForms_browser.xsltsharedsrc += '</xsl:stylesheet>';
XsltForms_browser.xsltinlinesrc = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ss="http://schemas.openxmlformats.org/spreadsheetml/2006/main" version="1.0">';
XsltForms_browser.xsltinlinesrc += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltinlinesrc += '	<xsl:param name="shared"/>';
XsltForms_browser.xsltinlinesrc += '	<xsl:template match="ss:c[@t=\'s\']" priority="1">';
XsltForms_browser.xsltinlinesrc += '		<xsl:copy>';
XsltForms_browser.xsltinlinesrc += '			<xsl:attribute name="t">inlineStr</xsl:attribute>';
XsltForms_browser.xsltinlinesrc += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltinlinesrc += '			<ss:is><ss:t><xsl:value-of select="substring-before(substring-after($shared,concat(\'|\',ss:v,\':\')),\'|\')"/></ss:t></ss:is>';
XsltForms_browser.xsltinlinesrc += '		</xsl:copy>';
XsltForms_browser.xsltinlinesrc += '	</xsl:template>';
XsltForms_browser.xsltinlinesrc += '	<xsl:template match="@t[parent::ss:c and . = \'s\']" priority="1"/>';
XsltForms_browser.xsltinlinesrc += '	<xsl:template match="ss:v[parent::ss:c/@t = \'s\']" priority="1"/>';
XsltForms_browser.xsltinlinesrc += '	<xsl:template match="@*|node()" priority="0">';
XsltForms_browser.xsltinlinesrc += '		<xsl:copy>';
XsltForms_browser.xsltinlinesrc += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltinlinesrc += '		</xsl:copy>';
XsltForms_browser.xsltinlinesrc += '	</xsl:template>';
XsltForms_browser.xsltinlinesrc += '</xsl:stylesheet>';
XsltForms_browser.zip2xml = function(z, mediatype, instid, modid) {
	var arch = {};
	var f;
	var r = "<exml:archive xmlns:exml=\"http://www.agencexml.com/exml\">";
	var offset = z.lastIndexOf("PK\x05\x06")+16;
	var r2 = function(z, offset) {
		return ((z.charCodeAt(offset+1) & 0xFF)<< 8) | z.charCodeAt(offset) & 0xFF;
	};
	var r4 = function(z, offset) {
		return ((((((z.charCodeAt(offset+3) & 0xFF)<< 8) | z.charCodeAt(offset+2) & 0xFF)<< 8) | z.charCodeAt(offset+1) & 0xFF)<< 8) | z.charCodeAt(offset) & 0xFF;
	};
	offset = r4(z, offset);
	while (z.charCodeAt(offset) === 80 && z.charCodeAt(offset+1) === 75 && z.charCodeAt(offset+2) === 1 && z.charCodeAt(offset+3) === 2) {
		f = {};
		offset += 4;
		f.versionMadeBy = r2(z, offset);
		offset += 2;
		f.versionNeeded = r2(z, offset);
		offset += 2;
		f.bitFlag = r2(z, offset);
		offset += 2;
		f.compressionMethod = r2(z, offset);
		offset += 2;
		f.date = r4(z, offset);
		offset += 4;
		f.crc32 = r4(z, offset);
		offset += 4;
		f.compressedSize = r4(z, offset);
		offset += 4;
		f.uncompressedSize = r4(z, offset);
		offset += 4;
		f.fileNameLength = r2(z, offset);
		offset += 2;
		f.extraFieldsLength = r2(z, offset);
		offset += 2;
		f.fileCommentLength = r2(z, offset);
		offset += 2;
		f.diskNumber = r2(z, offset);
		offset += 2;
		f.internalFileAttributes = r2(z, offset);
		offset += 2;
		f.externalFileAttributes = r4(z, offset);
		offset += 4;
		f.localHeaderOffset = r4(z, offset);
		offset += 4;
		var fileName = z.substr(offset, f.fileNameLength);
		offset += f.fileNameLength;
		f.extraFields = z.substr(offset, f.extraFieldsLength);
		offset += f.extraFieldsLength;
		f.fileComment = z.substr(offset, f.fileCommentLength);
		offset += f.fileCommentLength;
		var loffset = f.localHeaderOffset + 28;
		f.lextraFieldsLength = r2(z, loffset);
		loffset += 2 + f.fileNameLength;
		f.lextraFields = z.substr(loffset, f.lextraFieldsLength);
		loffset += f.lextraFieldsLength;
		f.compressedFileData = z.substr(loffset, f.compressedSize);
		if (mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (fileName.substr(fileName.length - 4) === ".xml" || fileName.substr(fileName.length - 5) === ".rels")) {
			f.doc = XsltForms_browser.createXMLDocument("<dummy/>");
			XsltForms_browser.loadDoc(f.doc, XsltForms_browser.utf8decode(zip_inflate(f.compressedFileData)));
			XsltForms_browser.setDocMeta(f.doc, "instance", instid);
			XsltForms_browser.setDocMeta(f.doc, "model", modid);
		}
		r += '<exml:file name="' + fileName + '"/>';
		arch[fileName] = f;
	}
	r += "</exml:archive>";
	if (mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && arch.hasOwnProperty("xl/sharedStrings.xml")) {
		var shared = XsltForms_browser.transformText(XsltForms_browser.saveDoc(arch["xl/sharedStrings.xml"].doc, "application/xml"), XsltForms_browser.xsltsharedsrc, true) + "|";
		for (var fn in arch) {
			if (arch.hasOwnProperty(fn)) {
				f = arch[fn];
				if (f.doc && (f.doc.documentElement.localName ? f.doc.documentElement.localName : f.doc.documentElement.baseName) === "worksheet") {
					var inlineStr = XsltForms_browser.transformText(XsltForms_browser.saveDoc(f.doc, "application/xml"), XsltForms_browser.xsltinlinesrc, true, "shared", shared);
					XsltForms_browser.loadDoc(f.doc, inlineStr);
					XsltForms_browser.setDocMeta(f.doc, "instance", instid);
					XsltForms_browser.setDocMeta(f.doc, "model", modid);
				}
			}
		}
	}
	arch.srcDoc = r;
	return arch;
};
XsltForms_browser.xml2zip = function(arch, mediatype) {
	var z = "";
	var fn, f;
	var fcount = 0;
	var w2 = function(v) {
		return String.fromCharCode(v & 0xFF) + String.fromCharCode((v >>> 8) & 0xFF);
	};
	var w4 = function(v) {
		return String.fromCharCode(v & 0xFF) + String.fromCharCode((v >>> 8) & 0xFF) + String.fromCharCode((v >>> 16) & 0xFF) + String.fromCharCode((v >>> 24) & 0xFF);
	};
	for (fn in arch) {
		if (arch.hasOwnProperty(fn)) {
			f = arch[fn];
			f.localHeaderOffset = z.length;
			if (f.doc) {
				var ser = XsltForms_browser.utf8encode(XsltForms_browser.saveDoc(f.doc, "application/xml"));
				if (mediatype.indexOf("application/vnd.openxmlformats-officedocument.") === 0) {
					var x14ac = ser.indexOf(' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"');
					var rattr = f.doc.documentElement.attributes;
					for (var ri = 0, li = rattr.length; ri < li; ri++) {
						if (rattr[ri].localName === "Ignorable" && rattr[ri].namespaceURI === "http://schemas.openxmlformats.org/markup-compatibility/2006") {
							if (x14ac === -1 || x14ac > ser.indexOf("Ignorable")) {
								ser = ser.substr(0, ser.indexOf(" ")) + ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"' + ser.substr(ser.indexOf(" "));
								break;
							}
						}
					}
				}
				ser = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + ser;
				f.crc32 = XsltForms_browser.crc32(ser);
				f.uncompressedSize = ser.length;
				f.compressedFileData = zip_deflate(ser);
				f.compressedSize = f.compressedFileData.length;
			}
			z += "PK\x03\x04";
			z += w2(f.versionNeeded);
			z += w2(f.bitFlag);
			z += w2(f.compressionMethod);
			z += w4(f.date);
			z += w4(f.crc32);
			z += w4(f.compressedSize);
			z += w4(f.uncompressedSize);
			z += w2(f.fileNameLength);
			z += w2(f.lextraFieldsLength);
			z += fn;
			z += f.lextraFields;
			z += f.compressedFileData;
			fcount++;
		}
	}
	var diroffset = z.length;
	for (fn in arch) {
		if (arch.hasOwnProperty(fn)) {
			f = arch[fn];
			z += "PK\x01\x02";
			z += w2(f.versionMadeBy);
			z += w2(f.versionNeeded);
			z += w2(f.bitFlag);
			z += w2(f.compressionMethod);
			z += w4(f.date);
			z += w4(f.crc32);
			z += w4(f.compressedSize);
			z += w4(f.uncompressedSize);
			z += w2(f.fileNameLength);
			z += w2(f.extraFieldsLength);
			z += w2(f.fileCommentLength);
			z += w2(f.diskNumber);
			z += w2(f.internalFileAttributes);
			z += w4(f.externalFileAttributes);
			z += w4(f.localHeaderOffset);
			z += fn;
			z += f.extraFields;
			z += f.fileComment;
		}
	}
	var endoffset = z.length;
	z += "PK\x05\x06";
	z += w2(0);
	z += w2(0);
	z += w2(fcount);
	z += w2(fcount);
	z += w4(endoffset - diroffset);
	z += w4(diroffset);
	var comment = "generated by XSLTForms - http://www.agencexml.com";
	z += w2(comment.length);
	z += comment;
	var data = [];
	for( var di = 0, dl = z.length; di < dl; di++) {
		data.push(z.charCodeAt(di) & 0xff);
	}
	try {
		var z2 = new Uint8Array(data);
		return z2.buffer;
	} catch (e) {
		return XsltForms_browser.StringToBinary(z);
	}
};
function XsltForms_bind(subform, id, parentBind, nodeset, type, readonly, required, relevant, calculate, constraint, changed) {
	if (document.getElementById(id)) {
		return;
	}
	var model = parentBind.model || parentBind;
	if (type === "xsd:ID") {
		XsltForms_globals.IDstr = nodeset.split('/').pop();
	}
	this.init(subform, id, parentBind, "xforms-bind");
	this.model = model;
	this.type = type ? XsltForms_schema.getType(type) : null;
	this.nodeset = nodeset;
	this.readonly = readonly;
	this.required = required;
	this.relevant = relevant;
	this.calculate = calculate;
	this.constraint = constraint;
	this.changed = changed;
	this.depsNodes = [];
	this.depsElements = [];
	this.nodes = [];
	this.binds = [];
	this.binding = new XsltForms_binding(null, this.nodeset);
	parentBind.addBind(this);
	subform.binds.push(this);
	this.depsId = XsltForms_element.depsId++;
}
XsltForms_bind.prototype = new XsltForms_coreElement();
XsltForms_bind.prototype.addBind = function(bind) {
	this.binds.push(bind);
};
XsltForms_bind.prototype.clear = function() {
	this.depsNodes.length = 0;
	this.depsElements.length = 0;
	this.nodes.length = 0;
	XsltForms_browser.forEach(this.binds, "clear");
};
XsltForms_bind.prototype.refresh = function(ctx, index) {
	if (!index) {
		for (var i = 0, len = this.depsNodes.length; i < len; i++) {
			XsltForms_browser.rmValueMeta(this.depsNodes[i], "depfor", this.depsId);
		}
		this.clear();
	}
	ctx = ctx || (this.model ? this.model.getInstanceDocument() ? this.model.getInstanceDocument().documentElement : null : null);
	XsltForms_browser.copyArray(this.binding.bind_evaluate(this.subform, ctx, {}, this.depsNodes, this.depsId, this.depsElements), this.nodes);
	var el = this.element;
	for (var i2 = 0, len2 = this.nodes.length; i2 < len2; i2++) {
		var node = this.nodes[i2];
		var bindids = XsltForms_browser.getMeta(node, "bind");
		if (!bindids) {
			XsltForms_browser.setMeta(node, "bind", this.element.id);
		} else {
			var bindids2 = " "+bindids+" ";
			if (bindids2.indexOf(" "+this.element.id+" ") === -1) {
				XsltForms_browser.setMeta(node, "bind", bindids+" "+this.element.id);
			}
		}
		if (this.type) {
			if (XsltForms_browser.getMeta(node, "schemaType")) {
				XsltForms_globals.error(el, "xforms-binding-exception", "Type especified in xsi:type attribute");
			} else {
				var typename = this.type.name;
				var ns = this.type.nsuri;
				for (var key in XsltForms_schema.prefixes) {
					if (XsltForms_schema.prefixes.hasOwnProperty(key)) {
						if (XsltForms_schema.prefixes[key] === ns) {
							typename = key + ":" + typename;
							break;
						}
					}
				}
				XsltForms_browser.setType(node, typename);
			}
		}
		for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
			el.childNodes[j].xfElement.refresh(node, i2);
		}
	}
};
XsltForms_bind.prototype.recalculate = function() {
	var el = this.element;
	if (this.calculate) {
		for (var i = 0, len = this.nodes.length; i < len; i++) {
			var node = this.nodes[i];
			var ctx = new XsltForms_exprContext(this.subform, node, i + 1, this.nodes);
			var value = XsltForms_globals.stringValue(this.calculate.evaluate(ctx, node));
			value = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").normalize(value);
			XsltForms_browser.setValue(node, value);
			this.model.addChange(node);
			XsltForms_browser.debugConsole.write("Calculate " + node.nodeName + " " + value);
		}
	}
	for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		el.childNodes[j].xfElement.recalculate();
	}
};
XsltForms_bind.prototype.propagate = function() {
	var el = this.element;
	if (this.changed) {
		for (var i = 0, len = this.nodes.length; i < len; i++) {
			var node = this.nodes[i];
			var ctx = new XsltForms_exprContext(this.subform, node, i + 1, this.nodes);
			var value = XsltForms_globals.stringValue(this.changed.evaluate(ctx, node));
			value = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").normalize(value);
			XsltForms_browser.setValue(node, value);
			XsltForms_browser.debugConsole.write("Propagate " + node.nodeName + " " + value);
		}
	}
	for (var j = 0, len1 = el.childNodes.length; j < len1; j++) {
		el.childNodes[j].xfElement.propagate();
	}
};
function XsltForms_submission(subform, id, model, ref, value, bind, action, method, version, indent,
			mediatype, encoding, omitXmlDeclaration, cdataSectionElements,
			replace, targetref, instance, separator, includenamespaceprefixes, validate, relevant,
			synchr, show, serialization) {
	if (document.getElementById(id)) {
		return;
	}
	this.init(subform, id, model, "xforms-submission");
	this.model = model;
	if (!model.defaultSubmission) {
		model.defaultSubmission = this;
	}
	this.action = action;
	if (action.substr && (action.substr(0, 7) === "file://" || (window.location.href.substr(0, 7) === "file://" && action.substr(0, 7) !== "http://")) && !(document.applets.xsltforms || document.getElementById("xsltforms_applet")) ) {
		XsltForms_browser.loadapplet();
	}
	this.method = method;
	this.replace = replace;
	this.targetref = targetref;
	this.version = version;
	this.indent = indent;
	this.validate = validate;
	this.relevant = relevant;
	this.synchr = synchr;
	this.show = show;
	this.serialization = serialization;
	if (mediatype) {
		var lines = mediatype.split(";");
		this.mediatype = lines[0];
		for (var i = 1, len = lines.length; i < len; i++) {
			var vals = lines[i].split("=");
			switch (vals[0].replace(/^\s+/g,'').replace(/\s+$/g,'')) {
				case "action":
					this.soapAction = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
					break;
				case "charset":
					this.charset = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
					break;
			}
		}
		if (this.mediatype === "application/zip" || this.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
			this.charset = "x-user-defined-binary";
		}
	}
	this.encoding = encoding || "UTF-8";
	this.omitXmlDeclaration = omitXmlDeclaration;
	this.cdataSectionElements = cdataSectionElements;
	this.instance = instance;
	this.separator = separator === "&amp;"? "&" : separator;
	this.includenamespaceprefixes = includenamespaceprefixes;
	this.headers = [];
	if (ref || bind || value) {
		this.binding = new XsltForms_binding(value ? "xsd:string" : null, value ? value : ref, model.element, bind);
		this.eval_ = function() {
			var res = this.binding.bind_evaluate();
			return typeof res === "string" ? res : res[0];
		};
	} else {
		this.eval_ = function() {
			return this.model.getInstanceDocument();
		};
	}
	this.pending = false;
}
XsltForms_submission.prototype = new XsltForms_coreElement();
XsltForms_submission.prototype.header = function(nodeset, combine, hname, values) {
	this.headers.push({nodeset: nodeset, combine: combine, name: hname, values: values});
	return this;
};
XsltForms_submission.prototype.xml2data = function(node, method) {
	if (this.mediatype === "application/zip" ||
	    this.mediatype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
		this.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
		var instance = document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement;
		if (!instance.archive) {
			alert("Not an archive!");
		}
		return XsltForms_browser.xml2zip(instance.archive, this.mediatype);
	}
	var ser = node ? typeof node === "string" ? node : method === "urlencoded-post" ? XsltForms_submission.toUrl_(node, this.separator) : XsltForms_browser.saveNode(node, "application/xml", this.relevant, false, method === "multipart-post", this.cdataSectionElements) : "";
	if (this.mediatype === "text/csv" && typeof node !== "string") { 
		return XsltForms_browser.xml2csv(ser, this.separator);
	}
	if ((this.mediatype === "application/json" || this.mediatype === "text/json") && typeof node !== "string") {
		return XsltForms_browser.xml2json(ser);
	}
	return ser;
};
XsltForms_submission.prototype.submit = function() {
	if (this.pending) {
		XsltForms_globals.openAction("XsltForms_submission.prototype.submit");
		this.issueSubmitException_({"error-type": "submission-in-progress"});
		XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
		return;
	}
	this.pending = true;
	var ctxnode, targetnode, inst, body, scriptelt;
	XsltForms_globals.openAction("XsltForms_submission.prototype.submit");
	var node = this.eval_();
	var action = "error";
	if(this.action.bind_evaluate) {
		action = XsltForms_globals.stringValue(this.action.bind_evaluate(this.subform));
	} else {
		action = this.action;
	}
	var method = "post";
	var subm = this;
	if (this.method.bind_evaluate) {
		method = XsltForms_globals.stringValue(this.method.bind_evaluate(this.subform));
	} else {
		method = this.method;
	}
	var evcontext = {"method": method, "resource-uri": action};
	if (action.substr && action.substr(0, 8) === "local://" && (typeof(localStorage) === 'undefined')) {
		evcontext["error-type"] = "validation-error";
		this.issueSubmitException_(evcontext, null, {message: "local:// submission not supported"});
		XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
		this.pending = false;
		return;
	}
	if (node) {
		if (this.validate && !XsltForms_globals.validate_(node)) {
			XsltForms_globals.validationError = true;
			XsltForms_globals.addChange(subm.model);
			XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
			XsltForms_globals.refresh();
			evcontext["error-type"] = "validation-error";
			this.issueSubmitException_(evcontext, null, null);
			XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
			this.pending = false;
			return;
		}
		if ((method === "get" || method === "delete") && this.serialization !== "none" && action.substr(0, 9) !== "opener://" && action.substr(0, 8) !== "local://" && action.substr(0, 11) !== "javascript:") {
			var tourl = XsltForms_submission.toUrl_(node, this.separator);
			if (tourl.length > 0) {
				action += (action.indexOf('?') === -1? '?' : this.separator) + tourl.substr(0, tourl.length - this.separator.length);
			}
		}
	}
	var ser = "";
	if (this.serialization !== "none") {
		XsltForms_xmlevents.dispatch(this, "xforms-submit-serialize");
		ser = this.xml2data(node, method);
	}
	var instance = this.instance;
	if (instance && !document.getElementById(instance)) {
		XsltForms_xmlevents.dispatch(this, "xforms-binding-exception");
		XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
		this.pending = false;
		return;
	}
	if ((window.location.href.substr(0, 7) === "file://" && action.substr(0, 7) !== "http://" && method !== "get") || (action.substr(0, 7) === "file://" && (window.location.href.substr(0, 7) !== "file://" || method !== "get")) || action.substr(0, 9) === "opener://" || action.substr(0, 8) === "local://") {
		if ((window.location.href.substr(0, 7) === "file://" || action.substr(0, 7) === "file://") && method === "put") {
			if (!XsltForms_browser.writeFile(window.location.href.substr(0, 7) === "file://" ? action : action.substr(7), subm.encoding, "string", "XSLTForms Java Saver", ser)) {
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
			}
			XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
		} else if (window.location.href.substr(0, 7) === "file://" && method === "get") {
			scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
			scriptelt.setAttribute("src", action);
			scriptelt.setAttribute("id", "xsltforms-filereader");
			scriptelt.setAttribute("type", "application/xml");
			var scriptLoaded = function() {
				alert(document.getElementById("xsltforms-filereader").textContent);
			};
			scriptelt.onreadystatechange = function () {
				if (this.readyState === 'complete' || this.readyState === 'loaded') {
					scriptLoaded();
				}
			};
			scriptelt.onload = scriptLoaded;
			body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
			body.insertBefore(scriptelt, body.firstChild);
		} else if (action.substr(0, 9) === "opener://" && method === "put") {
			try {
				window.opener.XsltForms_globals.xmlrequest('put', action.substr(9), ser);
			} catch (e) {
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
				XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
				this.pending = false;
				return;
			}
			XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
		} else if (action.substr(0, 8) === "local://" && method === "put") {
			try {
				window.localStorage.setItem(action.substr(8), ser);
			} catch (e) {
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
				XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
				this.pending = false;
				return;
			}
			XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
		} else if (action.substr(0, 8) === "local://" && method === "delete") {
			try {
				window.localStorage.removeItem(action.substr(8));
			} catch (e) {
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
				XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
				this.pending = false;
				return;
			}
			XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
		} else if (method === "get") {
			if (action.substr(0, 7) === "file://") {
				ser =  XsltForms_browser.readFile(action.substr(7), subm.encoding, "string", "XSLTForms Java Loader");
			} else if (action.substr(0, 8) === "local://") {
				try {
					ser = window.localStorage.getItem(action.substr(8));
				} catch (e) {
					XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
					XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
					this.pending = false;
					return;
				} 
			} else if (action.substr(0, 9) === "opener://") {
				try {
					ser = window.opener.XsltForms_globals.xmlrequest('get', action.substr(9));
				} catch (e) {
					XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
					XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
					this.pending = false;
					return;
				} 
			} else {
				eval("ser = (" + action.substr(11) + ");");
			}
			if (ser !== "" && (subm.replace === "instance" || (subm.targetref && subm.replace === "text"))) {
				ctxnode = !instance ? (node ? (node.documentElement ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
				if (subm.targetref) {
					targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
					if (targetnode && targetnode[0]) {
						if (subm.replace === "instance") {
							XsltForms_browser.loadNode(targetnode[0], ser, "application/xml");
						} else {
							XsltForms_browser.loadTextNode(targetnode[0], ser);
						}
					}
				} else {
					inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
					inst.setDoc(ser, false, true);
				}
				XsltForms_globals.addChange(subm.model);
				XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
				XsltForms_globals.refresh();
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
			} else {
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
			}
		}
		XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
		this.pending = false;
		return;
	}
	if (action.substr(0,11) === "javascript:") {
		if (method === "get") {
			eval("ser = (" + action.substr(11) + ");");
			if (ser !== "" && (subm.replace === "instance" || (subm.targetref && subm.replace === "text"))) {
				ctxnode = !instance ? (node ? (node.documentElement ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
				if (subm.targetref) {
					targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
					if (targetnode && targetnode[0]) {
						if (subm.replace === "instance") {
							XsltForms_browser.loadNode(targetnode[0], ser, "application/xml");
						} else {
							XsltForms_browser.loadTextNode(targetnode[0], ser);
						}
					}
				} else {
					inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
					inst.setDoc(ser, false, true);
				}
				XsltForms_globals.addChange(subm.model);
				XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
				XsltForms_globals.refresh();
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-done");
			} else {
				XsltForms_xmlevents.dispatch(subm, "xforms-submit-error");
			}
		}
		XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
		this.pending = false;
		return;
	}
	var synchr = this.synchr;
	if (synchr) {
		XsltForms_browser.dialog.show("statusPanel", null, false);
	}
	if(method === "xml-urlencoded-post") {
		var outForm = document.getElementById("xsltforms_form");
		if(outForm) {
			outForm.firstChild.value = ser;
		} else {
			outForm = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "form") : document.createElement("form");
			outForm.setAttribute("method", "post");
			outForm.setAttribute("action", action);
			outForm.setAttribute("id", "xsltforms_form");
			var txt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "input") : document.createElement("input");
			txt.setAttribute("type", "hidden");
			txt.setAttribute("name", "postdata");
			txt.setAttribute("value", ser);
			outForm.appendChild(txt);
			body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
			body.insertBefore(outForm, body.firstChild);
		}
		outForm.submit();
		XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
	} else {
		if (this.mediatype === "text/jsonp") {
			XsltForms_browser.jsoninstobj = {instance: !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : this.model.getInstance()) : document.getElementById(instance).xfElement, submission: this};
			scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
			scriptelt.setAttribute("src", action.replace(/&amp;/g, "&")+((action.indexOf("?") === -1) ? "?" : "&")+"callback=jsoninst");
			scriptelt.setAttribute("id", "jsoninst");
			scriptelt.setAttribute("type", "text/javascript");
			body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
			body.insertBefore(scriptelt, body.firstChild);
			XsltForms_xmlevents.dispatch(this, "xforms-submit-done");
			XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
		} else {
			if (!node && (method !== "get" || method !== "delete")) {
				evcontext["error-type"] = "no-data";
				this.issueSubmitException_(evcontext, null, null);
				this.pending = false;
				return;
			}
			var req = null;
			try {
				evcontext["resource-uri"] = action;
				req = XsltForms_browser.openRequest(method.split("-").pop(), action, !synchr);
				var func = function() {
					if (!synchr && req.readyState !== 4) {
						return;
					}
					try {
						if (req.status === 1223) {
							req.status = 204;
							req.statusText = "No Content";
						}
						if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
							evcontext["error-type"] = "resource-error";
							subm.issueSubmitException_(evcontext, req, null);
							XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
							subm.pending = false;
							return;
						}
						if (subm.replace === "instance" || (subm.targetref && subm.replace === "text")) {
							if (subm.targetref) {
								ctxnode = !instance ? (node ? (node.nodeType === Fleur.Node.DOCUMENT_NODE ? node.documentElement : node.ownerDocument.documentElement) : subm.model.getInstance().documentElement) : document.getElementById(instance).xfElement.doc.documentElement;
								targetnode = subm.targetref.bind_evaluate(subm.subform, ctxnode);
								if (targetnode && targetnode[0]) {
									if (subm.replace === "instance") {
										XsltForms_browser.loadNode(targetnode[0], req.responseText, "application/xml");
									} else {
										XsltForms_browser.loadTextNode(targetnode[0], req.responseText);
									}
								}
							} else {
								inst = !instance ? (node ? document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node : node.ownerDocument, "instance")).xfElement : subm.model.getInstance()) : document.getElementById(instance).xfElement;
								inst.setDocFromReq(req, false, true);
							}
							XsltForms_globals.addChange(subm.model);
							XsltForms_xmlevents.dispatch(subm.model, "xforms-rebuild");
							XsltForms_globals.refresh();
						}
						XsltForms_submission.requesteventlog(evcontext, req);
						XsltForms_xmlevents.dispatch(subm, "xforms-submit-done", null, null, null, null, evcontext);
						XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
						if (subm.replace === "all") {
							var resp = req.responseText;
							var piindex = resp.indexOf("<?xml-stylesheet", 0);
							while ( piindex !== -1) {
								var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
								resp = XsltForms_browser.transformText(resp, xslhref, false);
								piindex = resp.indexOf("<?xml-stylesheet", 0);
							}
							if( subm.show === "new" ) {
								if (req.getResponseHeader("Content-Type") === "application/octet-stream;base64") {
									location.href ="data:application/octet-stream;base64," + resp;
								} else {
									var w = window.open("about:blank","_blank");
									w.document.write(resp);
									w.document.close();
								}
							} else {
								XsltForms_browser.dialog.hide("statusPanel", false);
								XsltForms_globals.close();
								if(document.write) {
									document.write(resp);
									document.close();
								} else {
									if (resp.indexOf("<?", 0) === 0) {
										resp = resp.substr(resp.indexOf("?>")+2);
									}                       
									document.documentElement.innerHTML = resp;
								}
							}
						}
					} catch(e) {
						XsltForms_browser.debugConsole.write(e || e.message);
						evcontext["error-type"] = "parse-error";
						subm.issueSubmitException_(evcontext, req, e);
						XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
					}
					subm.pending = false;
				};
				if (!synchr) {
					req.onreadystatechange = func;
				}
				var media = this.mediatype;
				var mt;
				if (method === "multipart-post") {
					mt = "multipart/related; boundary=xsltformsrev" + XsltForms_globals.fileVersionNumber + '; type="application/xml"; start="<xsltforms_main>"';
				} else {
					mt = (media || "application/xml") + (this.charset? ";charset=" + this.charset : "");
				}
				XsltForms_browser.debugConsole.write("Submit " + this.method + " - " + mt + " - " + action + " - " + synchr);
				var len = this.headers.length;
				var acceptValue = "";
				if (len !== 0) {
					var headers = [];
					for (var i = 0, len0 = this.headers.length; i < len0; i++) {
						var nodes = [];
						if (this.headers[i].nodeset) {
							nodes = this.headers[i].nodeset.bind_evaluate(this.subform);
						} else {
							nodes = [subm.model.getInstanceDocument().documentElement];
						}
						var hname;
						for (var n = 0, lenn = nodes.length; n < lenn; n++) {
							if (this.headers[i].name.bind_evaluate) {
								hname = XsltForms_globals.stringValue(this.headers[i].name.bind_evaluate(nodes[n]));
							} else {
								hname = this.headers[i].name;
							}
							if (hname !== "") {
								var hvalue = "";
								var j;
								var len2;
								for (j = 0, len2 = this.headers[i].values.length; j < len2; j++) {
									var hv = this.headers[i].values[j];
									var hv2;
									if (hv.bind_evaluate) {
										hv2 = XsltForms_globals.stringValue(hv.bind_evaluate(nodes[n]));
									} else {
										hv2 = hv;
									}
									hvalue += hv2;
									if (j < len2 - 1) {
										hvalue += ",";
									}
								}
								var len3;
								for (j = 0, len3 = headers.length; j < len3; j++) {
									if (headers[j].name === hname) {
										switch (this.headers[i].combine) {
											case "prepend":
												headers[j].value = hvalue + "," + headers[j].value;
												break;
											case "replace":
												headers[j].value = hvalue;
												break;
											default:
												headers[j].value += "," + hvalue;
												break;
										}
										break;
									}
								}
								if (j === len3) {
									headers.push({name: hname, value: hvalue});
								}
							}
						}
					}
					for (var k = 0, len4 = headers.length; k < len4; k++) {
						req.setRequestHeader(headers[k].name, headers[k].value);
						if (headers[k].name.toLowerCase() === "accept") {
							acceptValue = headers[k].value;
						}
					}
				}
				if (method === "get" || method === "delete") {
					if (acceptValue === "") {
						if (media === XsltForms_submission.SOAP_) {
							req.setRequestHeader("Accept", mt);
							acceptValue = mt;
						} else {
							if (subm.replace === "instance") {
								req.setRequestHeader("Accept", "application/xml,text/xml");
								acceptValue = "application/xml,text/xml";
							} else {
								req.setRequestHeader("Accept", "text/plain");
								acceptValue = "text/plain";
							}
						}
					}
					if (req.overrideMimeType) {
						req.overrideMimeType(acceptValue.split(",")[0].split(";")[0]);
					}
					req.send(null);
				} else {
					if (method === "urlencoded-post") {
						mt = "application/x-www-form-urlencoded";
					}
					req.setRequestHeader("Content-Type", mt);
					if (media === XsltForms_submission.SOAP_) {
						if (this.soapAction) {
							req.setRequestHeader("SOAPAction", this.soapAction);
						}
					} else {
						if (subm.replace === "instance") {
							req.setRequestHeader("Accept", "application/xml,text/xml");
						}
					}
					req.send(ser);
				}
				if (synchr) {
					func();
					XsltForms_browser.dialog.hide("statusPanel", null, false);
				}
			} catch(e) {
				XsltForms_browser.dialog.hide("statusPanel", null, false);
				XsltForms_browser.debugConsole.write(e.message || e);
				evcontext["error-type"] = "resource-error";
				subm.issueSubmitException_(evcontext, req, e);
				XsltForms_globals.closeAction("XsltForms_submission.prototype.submit");
				subm.pending = false;
			}
		}
	}
};
XsltForms_submission.SOAP_ = "application/soap+xml";
XsltForms_submission.requesteventlog = function(evcontext, req) {
	try {
		evcontext["response-status-code"] = req.status;
		evcontext["response-reason-phrase"] = req.statusText;
		evcontext["response-headers"] = [];
		var rheads = req.getAllResponseHeaders();
		var rheaderselts = "";
		if (rheads) {
			rheads = rheads.replace(/\r/, "").split("\n");
			for (var i = 0, len = rheads.length; i < len; i++) {
				var colon = rheads[i].indexOf(":");
				if (colon !== -1) {
					var hname = rheads[i].substring(0, colon).replace(/^\s+|\s+$/, "");
					var value = rheads[i].substring(colon+1).replace(/^\s+|\s+$/, "");
					rheaderselts += "<header><name>"+XsltForms_browser.escape(hname)+"</name><value>"+XsltForms_browser.escape(value)+"</value></header>";
				}
			}
		}
		evcontext.rheadsdoc = XsltForms_browser.createXMLDocument("<data>"+rheaderselts+"</data>");
		if (evcontext.rheadsdoc.documentElement.firstChild) {
			var rh = evcontext.rheadsdoc.documentElement.firstChild;
			evcontext["response-headers"] = [rh];
			while (rh.nextSibling) {
				rh = rh.nextSibling;
				evcontext["response-headers"].push(rh);
			}
		}
		if (req.responseXML) {
			evcontext["response-body"] = [XsltForms_browser.createXMLDocument(req.responseText).documentElement];
		} else {
			evcontext["response-body"] = req.responseText || "";
		}
	} catch (e) {
	}
};
XsltForms_submission.prototype.issueSubmitException_ = function(evcontext, req, ex) {
	if (ex) {
		evcontext.message = ex.message || ex;
		evcontext["stack-trace"] = ex.stack;
	}
	if (req) {
		XsltForms_submission.requesteventlog(evcontext, req);
	}
	XsltForms_xmlevents.dispatch(this, "xforms-submit-error", null, null, null, null, evcontext);
};
XsltForms_submission.toUrl_ = function(node, separator) {
	var url = "";
	var val = "";
	var hasChilds = false;
	for(var i = 0, len = node.childNodes.length; i < len; i++) {
		var child = node.childNodes[i];
		switch (child.nodeType) {
			case Fleur.Node.ELEMENT_NODE:
				hasChilds = true;
				url += this.toUrl_(child, separator);
				break;
			case Fleur.Node.TEXT_NODE:
				val += child.nodeValue;
				break;
		}
	}
	if (!hasChilds && val.length > 0) {
		url += node.nodeName + '=' + encodeURIComponent(val) + separator;
	}
	return url;
};
function XsltForms_timer(subform, id, time) {
	if (document.getElementById(id)) {
		return;
	}
	this.init(subform, id, null, "xforms-timer");
	this.running = false;
	this.time = time;
}
XsltForms_timer.prototype = new XsltForms_coreElement();
XsltForms_timer.prototype.start = function() {
	this.running = true;
	var timer = this;
	setTimeout(function() { timer.run(); }, this.time);
};
XsltForms_timer.prototype.stop = function() {
	this.running = false;
};
XsltForms_timer.prototype.run = function() {
	if (this.running) {
		var timer = this;
		XsltForms_globals.openAction();
		XsltForms_xmlevents.dispatch(timer.element, "ajx-time");
		XsltForms_globals.closeAction();
		setTimeout(function() { timer.run(); }, this.time);
	}
};
function XsltForms_confirm(subform, id, binding, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.id = id;
	this.binding = binding;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_confirm.prototype = new XsltForms_abstractAction();
XsltForms_confirm.prototype.run = function(element, ctx, evt) {
	var text;
	if (this.binding) {
		var node = this.binding.bind_evaluate(ctx)[0];
		if (node) {
			text = XsltForms_browser.getValue(node);
		}
	} else {
		var e = XsltForms_idManager.find(this.id);
		XsltForms_globals.build(e, ctx);
		text = e.textContent || e.innerText;
	}
	if (text) {
		var res = XsltForms_browser.confirm(text.trim());
		if (!res) {
			evt.stopPropagation();
			evt.stopped = true;
		}
	}
};
function XsltForms_setproperty(subform, pname, value, literal, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.name = pname;
	this.value = value;
	this.literal = literal;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_setproperty.prototype = new XsltForms_abstractAction();
XsltForms_setproperty.prototype.run = function(element, ctx) {
	var value = this.literal;
	if (this.value) {
		if (typeof(value) !== "string" && typeof(value.length) !== "undefined") {
			value = value.length > 0? XsltForms_browser.getValue(value[0]) : "";
		}
	}
	if (value) {
		XsltForms_browser.i18n.lang = value;
		XsltForms_browser.debugConsole.write("setproperty " + name + " = " + value);
	}
};
function XsltForms_abstractAction() {
}
XsltForms_abstractAction.prototype.init = function(ifexpr, whileexpr, iterateexpr) {
	this.ifexpr = XsltForms_xpath.get(ifexpr);
	this.whileexpr = XsltForms_xpath.get(whileexpr);
	this.iterateexpr = XsltForms_xpath.get(iterateexpr);
};
XsltForms_abstractAction.prototype.execute = function(element, ctx, evt) {
	if (evt.stopped) { return; }
	if (!ctx) {
		ctx = element.node || (XsltForms_globals.defaultModel.getInstanceDocument() ? XsltForms_globals.defaultModel.getInstanceDocument().documentElement : null);
	}
	if (this.iterateexpr) {
		if (this.whileexpr) {
			XsltForms_globals.error(this.element, "xforms-compute-exception", "@iterate cannot be used with @while");
		}
		var nodes = this.iterateexpr.xpath_evaluate(ctx);
		for (var i = 0, len = nodes.length; i < len; i++) {
			this.exec_(element, nodes[i], evt);
		}
	} else if (this.whileexpr) {
		while (XsltForms_globals.booleanValue(this.whileexpr.xpath_evaluate(ctx))) {
			if (!this.exec_(element, ctx, evt)) {
				break;
			}
		}
	} else {
		this.exec_(element, ctx, evt);
	}
};
XsltForms_abstractAction.prototype.exec_ = function(element, ctx, evt) {
	if (this.ifexpr) {
		if (XsltForms_globals.booleanValue(this.ifexpr.xpath_evaluate(ctx))) {
			this.run(element, ctx, evt);
		} else {
			return false;
		}
	} else {
		this.run(element, ctx, evt);
	}
	return true;
};
XsltForms_abstractAction.prototype.run = function() { };
function XsltForms_action(subform, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.init(ifexpr, whileexpr, iterateexpr);
	this.childs = [];
}
XsltForms_action.prototype = new XsltForms_abstractAction();
XsltForms_action.prototype.add = function(action) {
	this.childs.push(action);
	action.parentAction = this;
	return this;
};
XsltForms_action.prototype.run = function(element, ctx, evt) {
	var p = element;
	while (p) {
		if (p.xfElement) {
			if (p.xfElement.varResolver) {
				this.varResolver = {};
				for (var v in p.xfElement.varResolver) {
					this.varResolver[v] = p.xfElement.varResolver[v];
				}
			}
			break;
		}
		p = p.parentNode;
	}
	XsltForms_browser.forEach(this.childs, "execute", element, ctx, evt);
};
function XsltForms_delete(subform, nodeset, model, bind, at, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = new XsltForms_binding(null, nodeset, model, bind);
	this.at = XsltForms_xpath.get(at);
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_delete.prototype = new XsltForms_abstractAction();
XsltForms_delete.prototype.run = function(element, ctx) {
	var i, len;
	if (this.context) {
		ctx = this.context.xpath_evaluate(ctx, null, this.subform)[0];
	}
	if (!ctx) {
		return;
	}
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	var nodes = this.binding.bind_evaluate(this.subform, ctx, varresolver);
	for (i = 0; i < nodes.length; i++) {
		if (!nodes[i].ownerDocument || nodes[i].ownerDocument.documentElement === nodes[i]) {
			nodes.splice(i, 1);
			i--;
		}
	}
	if(this.at) {
		var index = XsltForms_globals.numberValue(this.at.xpath_evaluate(new XsltForms_exprContext(this.subform, ctx, 1, nodes, null, null, null, varresolver)));
		if(!nodes[index - 1]) {
			return;
		}
		nodes = [nodes[index - 1]];
	}
	var model;
	var instance;
	if (nodes.length > 0) {
		model = document.getElementById(XsltForms_browser.getDocMeta(nodes[0].nodeType === Fleur.Node.DOCUMENT_NODE ? nodes[0] : nodes[0].ownerDocument, "model")).xfElement;
		instance = model.findInstance(nodes[0]);
	}
	var deletedNodes = [];
	for (i = 0, len = nodes.length; i < len; i++) {
		var node = nodes[i];
		XsltForms_mipbinding.nodedispose(node);
		var repeat = XsltForms_browser.getMeta(node, "repeat");
		if (repeat) {
			document.getElementById(repeat).xfElement.deleteNode(node);
		}
		if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			var oldOwnerElement = node.ownerElement? node.ownerElement: node.selectSingleNode("..");
			if (oldOwnerElement.removeAttributeNS) {
				oldOwnerElement.removeAttributeNS(node.namespaceURI, node.nodeName);
			} else {
				oldOwnerElement.removeAttributeNode(node);
			}
			if (!XsltForms_browser.isIE && !XsltForms_browser.isIE11) {
				node.oldOwnerElement = oldOwnerElement;
			}
		} else {
			node.parentNode.removeChild(node);
		}
		deletedNodes.push(node);
	}
	if (deletedNodes.length > 0) {
		XsltForms_globals.addChange(model);
		model.setRebuilded(true);
		var evcontext = {"deleted-nodes": deletedNodes, "delete-location": index};
		XsltForms_xmlevents.dispatch(instance, "xforms-delete", null, null, null, null, evcontext);
	}
};
function XsltForms_dispatch(subform, evname, target, properties, ifexpr, whileexpr, iterateexpr, delay) {
	this.subform = subform;
	this.name = evname;
	this.target = target;
	this.properties = properties;
	this.init(ifexpr, whileexpr, iterateexpr);
	this.delay = delay;
}
XsltForms_dispatch.prototype = new XsltForms_abstractAction();
XsltForms_dispatch.prototype.run = function(element, ctx, evt) {
	var evname = this.name;
	if (evname.bind_evaluate) {
		evname = XsltForms_globals.stringValue(evname.bind_evaluate(this.subform));
	}
	var target = this.target;
	if (target && target.bind_evaluate) {
		target = XsltForms_globals.stringValue(target.bind_evaluate(this.subform));
	}
	if (!target) {
		switch (evname) {
			case "xforms-submit":
				target = document.getElementById(XsltForms_browser.getDocMeta(ctx.ownerDocument, "model")).xfElement.defaultSubmission;
				break;
			case "xforms-rebuild":
			case "xforms-recalculate":
			case "xforms-refresh":
			case "xforms-reset":
			case "xforms-revalidate":
				target = document.getElementById(XsltForms_browser.getDocMeta(ctx.ownerDocument, "model")).xfElement;
				break;
		}
	} else {
		target = typeof target === "string"? document.getElementById(target) : target;
		if (!target && evname.indexOf("xforms-") === 0) {
			evname = "xforms-binding-exception";
			target = element;
		}
	}
	var evtctx = {};
	for (var prop in this.properties) {
		if (prop !== "" && this.properties.hasOwnProperty(prop)) {
			evtctx[prop] = this.properties[prop].bind_evaluate ? this.properties[prop].bind_evaluate(this.subform) : this.properties[prop];
		}
	}
	var delay = 0;
	if (this.delay) {
		if (this.delay.bind_evaluate) {
			delay = XsltForms_globals.numberValue(this.delay.bind_evaluate(this.subform));
		} else {
			delay = XsltForms_globals.numberValue(this.delay);
		}
	}
	if (delay > 0 ) {
		window.setTimeout("XsltForms_xmlevents.dispatch(document.getElementById('"+target.id+"'),'"+evname+"')", delay);
	} else {
		XsltForms_xmlevents.dispatch(target, evname, null, null, null, null, evtctx);
	}
};
function XsltForms_insert(subform, nodeset, model, bind, at, position, origin, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = new XsltForms_binding(null, nodeset, model, bind);
	this.origin = XsltForms_xpath.get(origin);
	this.context = XsltForms_xpath.get(context);
	this.at = XsltForms_xpath.get(at);
	this.position = position;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_insert.prototype = new XsltForms_abstractAction();
XsltForms_insert.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	if (this.context) {
		ctx = this.context.xpath_evaluate(ctx)[0];
	}
	if (!ctx) {
		return;
	}
	var nodes = [];
	if( this.binding.bind || this.binding.xpath ) {
		nodes = this.binding.bind_evaluate(this.subform, ctx, varresolver);
	}
	var index = 0;
	var node = null;
	var originNodes = [];
	var parentNode = null;
	var pos = this.position === "after"? 1 : 0;
	var res = 0;
	if (this.origin) {
		originNodes = this.origin.xpath_evaluate(ctx);
	}
	if (originNodes.length === 0) {
		if (nodes.length === 0) {
			return;
		}
		originNodes.push(nodes[nodes.length - 1]);
	}
	for(var i = 0, len = originNodes.length; i < len; i += 1) {
		node = originNodes[i];
		if (nodes.length === 0) {
			parentNode = ctx;
		} else {
			parentNode = nodes[0].nodeType === Fleur.Node.DOCUMENT_NODE? nodes[0] : nodes[0].nodeType === Fleur.Node.ATTRIBUTE_NODE? nodes[0].ownerDocument ? nodes[0].ownerDocument : nodes[0].selectSingleNode("..") : nodes[0].parentNode;
			if (parentNode.nodeType !== Fleur.Node.DOCUMENT_NODE && node.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
				res = this.at ? Math.round(XsltForms_globals.numberValue(this.at.xpath_evaluate(new XsltForms_exprContext(this.subform, ctx, 1, nodes, null, null, null, varresolver)))) + i - 1: nodes.length - 1;
				index = isNaN(res)? nodes.length : res + pos;
			}
		}
		XsltForms_browser.debugConsole.write("insert " + node.nodeName + " in " + parentNode.nodeName + " at " + index + " - " + ctx.nodeName);
		var clone = parentNode.ownerDocument ? parentNode.ownerDocument.importNode(node, true) : parentNode.importNode(node, true);
		XsltForms_browser.clearMeta(clone);
		if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			XsltForms_browser.setAttributeNS(parentNode, node.namespaceURI, node.nodeName, node.nodeValue);
		} else {
			if (parentNode.nodeType === Fleur.Node.DOCUMENT_NODE) {
				var first = parentNode.documentElement;
				var prevmodel = XsltForms_browser.getDocMeta(parentNode, "model");
				var previnst = XsltForms_browser.getDocMeta(parentNode, "instance");
				parentNode.removeChild(first);
				first = null;
				parentNode.appendChild(clone);
				XsltForms_browser.setDocMeta(parentNode, "instance", previnst);
				XsltForms_browser.setDocMeta(parentNode, "model", prevmodel);
			} else {
				var nodeAfter;
				if (index >= nodes.length && nodes.length !== 0) {
					nodeAfter = nodes[nodes.length - 1].nextSibling;
				} else {
					nodeAfter = nodes[index];
				}
				if (nodeAfter) {
					nodeAfter.parentNode.insertBefore(clone, nodeAfter);
				} else if (nodes.length === 0 && parentNode.firstChild) {
					parentNode.insertBefore(clone, parentNode.firstChild);
				} else {
					parentNode.appendChild(clone);
				}
				var repeat = nodes.length > 0? XsltForms_browser.getMeta(nodes[0], "repeat") : null;
				nodes.push(clone);
				if (repeat) {
					document.getElementById(repeat).xfElement.insertNode(clone, nodeAfter);
				}
			}
		}
	}
	var model = document.getElementById(XsltForms_browser.getDocMeta(parentNode.nodeType === Fleur.Node.DOCUMENT_NODE ? parentNode : parentNode.ownerDocument, "model")).xfElement;
	XsltForms_globals.addChange(model);
	model.setRebuilded(true);
	var evcontext = {"inserted-nodes": [clone], "origin-nodes": originNodes, "insert-location-node": index, position: this.position};
	XsltForms_xmlevents.dispatch(model.findInstance(parentNode), "xforms-insert", null, null, null, null, evcontext);
};
function XsltForms_load(subform, binding, resource, show, targetid, instance, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.resource = resource;
	this.show = show;
	this.targetid = targetid || "_self";
	this.instance = instance;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_load.prototype = new XsltForms_abstractAction();
XsltForms_load.prototype.run = function(element, ctx) {
	var href = this.resource;
	var node;
	if (this.binding) {
		var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
		node = this.binding.bind_evaluate(this.subform, ctx, varresolver)[0];
		if (node) {
			var t = XsltForms_schema.getType(XsltForms_browser.getType(node));
			if (!t.hasBase("xf:HTMLFragment")) {
				href = XsltForms_browser.getValue(node);
			}
		}
	} else {
		if (href && typeof href === 'object') {
			href = XsltForms_globals.stringValue(this.resource.xpath.xpath_evaluate(ctx));
		} else {
			if (typeof href === 'string') {
				href = XsltForms_browser.unescape(href); 
			}
		}
	}
	if (href) {
		if(href.substr(0, 11) === "javascript:") {
			try {
				eval("{XsltForms_context={elementId:\""+element.getAttribute("id")+"\"};"+href.substr(11)+"}");
			} catch (e) {
				alert("XSLTForms Exception\n--------------------------\n\nError evaluating the following Javascript expression :\n\n"+href.substr(11)+"\n\n"+e);
			}
		} else if (this.show === "new" || this.targetid === "_blank") {
			window.open(href);
		} else if (this.show === "embed" || (this.targetid !== "" && this.targetid !== "_blank" && this.targetid !== "_self")) {
			XsltForms_globals.openAction("XsltForms_load.prototype.run");
			var req = null;
			var method = "get";
			var evcontext = {"method": method, "resource-uri": href};
			var subformidx = XsltForms_globals.nbsubforms++;
			try {
				req = XsltForms_browser.openRequest(method, href, false);
				XsltForms_browser.debugConsole.write("Load " + href);
				req.send(null);
				if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
					evcontext["error-type"] = "resource-error";
					this.issueLoadException_(evcontext, req, null);
					XsltForms_globals.closeAction("XsltForms_load.prototype.run");
					return;
				}
				XsltForms_submission.requesteventlog(evcontext, req);
				XsltForms_globals.closeAction("XsltForms_load.prototype.run");
				var resp = req.responseText;
				var piindex = resp.indexOf("<?xml-stylesheet", 0);
				while ( piindex !== -1) {
					var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
					resp = XsltForms_browser.transformText(resp, xslhref, false);
					piindex = resp.indexOf("<?xml-stylesheet", 0);
				}
				XsltForms_browser.dialog.hide("statusPanel", false);
				var sp = XsltForms_globals.stringSplit(resp, "XsltForms_MagicSeparator");
				var subbody, subjs;
				var targetelt = XsltForms_idManager.find(this.targetid);
				if (sp.length === 1) {
					subbody = resp;
				} else {
					subjs = "/\* xsltforms-subform-" + subformidx + " " + sp[2] + " xsltforms-subform-" + subformidx + " *\/";
					var imain = subjs.indexOf('"xsltforms-mainform"');
					var targetsubform = targetelt.xfSubform;
					if (targetsubform) {
						targetsubform.dispose();
					}
					subjs = '(function(){var xsltforms_subform_eltid = "' + targetelt.id + '";var xsltforms_parentform = XsltForms_subform.subforms["' + this.subform.id + '"];' + subjs.substring(0, imain) + '"xsltforms-subform-' + subformidx + '"' + subjs.substring(imain + 20) + "})();";
					subbody = "<!-- xsltforms-subform-" + subformidx + " " + sp[4] + " xsltforms-subform-" + subformidx + " -->";
					imain = subbody.indexOf(' id="xsltforms-mainform');
					while (imain !== -1) {
						subbody = subbody.substring(0, imain) + ' id="xsltforms-subform-' + subformidx + subbody.substring(imain + 23);
						imain = subbody.indexOf(' id="xsltforms-mainform');
					}
				}
				var targetxf = targetelt.xfElement;
				if (targetelt.xfElement) {
					targetelt = targetelt.children[targetelt.children.length - 1];
				}
				targetelt.innerHTML = subbody;
				targetelt.hasXFElement = null;
				var parentNode = targetelt.parentNode;
				while (parentNode) {
					if (parentNode.hasXFElement !== false) {
						break;
					}
					parentNode.hasXFElement = null;
					parentNode = parentNode.parentNode;
				}
				if (sp.length !== 1) {
					var scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
					scriptelt.setAttribute("id", "xsltforms-subform-" + subformidx + "-script");
					scriptelt.setAttribute("type", "text/javascript");
					if (subjs.indexOf('XsltForms_globals.ltchar = "&lt;"; XsltForms_browser.isEscaped = XsltForms_globals.ltchar.length != 1;') !== -1) {
						subjs = XsltForms_browser.unescape(subjs);
					}
					subjs = subjs.replace('XsltForms_browser.isEscaped = XsltForms_globals.ltchar.length != 1;', "");
					if (XsltForms_browser.isIE) {
						scriptelt.text = subjs;
					} else {
						scriptelt.appendChild(document.createTextNode(subjs));
					}
					var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
					body.insertBefore(scriptelt, body.firstChild);
				}
				XsltForms_browser.setClass(targetelt, "xforms-subform-loaded", true);
				if (targetxf) {
					XsltForms_xmlevents.dispatch(targetxf, "xforms-load-done", null, null, null, null, evcontext);
				}
			} catch(e2) {
				XsltForms_browser.debugConsole.write(e2.message || e2);
				evcontext["error-type"] = "resource-error";
				this.issueLoadException_(evcontext, req, e2);
				XsltForms_globals.closeAction("XsltForms_load.prototype.run");
			}
		} else {
			location.href = href;
		}
	} else {
		if (node) {
			try {
				var v = XsltForms_browser.getValue(node).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
				var lw;
				if (this.show === "new" || this.targetid === "_blank") {
					lw = window.open("about:blank","_blank");
					lw.document.write(v);
					lw.document.close();
				} else {
					lw = window.open("about:blank", "_self");
					lw.document.write(v);
					lw.document.close();
				}
			} catch (e) {
				XsltForms_browser.debugConsole.write("ERROR: Load:" + e.message);
			}
		}
	}
};
XsltForms_load.prototype.issueLoadException_ = function(evcontext, req, ex) {
	if (ex) {
		evcontext.message = ex.message || ex;
		evcontext["stack-trace"] = ex.stack;
	}
	if (req) {
		XsltForms_submission.requesteventlog(evcontext, req);
	}
	XsltForms_xmlevents.dispatch(document.getElementById(this.targetid), "xforms-link-exception", null, null, null, null, evcontext);
};
XsltForms_load.subform = function(resource, targetid, ref) {
	if (ref) {
		var parentNode = ref;
		while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (XsltForms_browser.hasClass(parentNode, "xforms-repeat-item")) {
				XsltForms_repeat.selectItem(parentNode);
			}
			parentNode = parentNode.parentNode;
		}
	}
	var targetelt = XsltForms_idManager.find(targetid);
	var subform = null;
	parentNode = targetelt;
	while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
		if (parentNode.xfSubform) {
			subform = parentNode.xfSubform;
			break;
		}
		parentNode = parentNode.parentNode;
	}
	var a = new XsltForms_load(subform, null, resource, "embed", targetid);
	a.run();
};
function XsltForms_message(subform, id, binding, level, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.id = id;
	this.level = level;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_message.prototype = new XsltForms_abstractAction();
XsltForms_message.prototype.run = function(element, ctx) {
	var text;
	if (this.binding) {
		var node = this.binding.bind_evaluate(this.subform, ctx, this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver)[0];
		if (node) {
			text = XsltForms_browser.getValue(node);
		}
	} else {
		var e = XsltForms_idManager.find(this.id);
		var building = XsltForms_globals.building;
		XsltForms_globals.building = true;
		XsltForms_globals.build(e, ctx, null, this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver);
		XsltForms_globals.building = building;
		text = e.textContent || e.innerText;
	}
	if (text) {
		alert(text.trim());
	}
};
function XsltForms_script(subform, binding, stype, script, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.stype = stype;
	this.script = script;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_script.prototype = new XsltForms_abstractAction();
XsltForms_script.prototype.run = function(element, ctx) {
	var script = this.script;
	switch (this.stype) {
		case "text/javascript":
			if (this.binding) {
				var node = this.binding.bind_evaluate(this.subform, ctx)[0];
				if (node) {
					script = XsltForms_browser.getValue(node);
				}
			} else {
				if (typeof script === 'object') {
					script = XsltForms_globals.stringValue(this.script.xpath.xpath_evaluate(ctx));
				} else {
					if (typeof script === 'string') {
						script = XsltForms_browser.unescape(script); 
					}
				}
			}
			if (script) {
				try {
					eval("{XsltForms_context={elementId:\""+element.getAttribute("id")+"\"};"+script+"}");
				} catch (e) {
					alert("XSLTForms Exception\n--------------------------\n\nError evaluating the following Javascript expression :\n\n"+script+"\n\n"+e);
				}
			}
			break;
		case "application/xquery":
			this.script.xpath.xpath_evaluate(ctx);
			break;
	}
};
function XsltForms_setindex(subform, repeat, index, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.repeat = repeat;
	this.index = XsltForms_xpath.get(index);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_setindex.prototype = new XsltForms_abstractAction();
XsltForms_setindex.prototype.run = function(element, ctx) {
	var repeat = XsltForms_idManager.find(this.repeat);
	var index = XsltForms_globals.numberValue(this.index.xpath_evaluate(ctx));
	XsltForms_browser.debugConsole.write("setIndex " + index);
	if (!isNaN(index)) {
		if (index < 1) {
			index = 1;
			XsltForms_xmlevents.dispatch(repeat.xfElement, "xforms-scroll-first");
		} else if (index > repeat.xfElement.nodes.length) {
			index = repeat.xfElement.nodes.length;
			XsltForms_xmlevents.dispatch(repeat.xfElement, "xforms-scroll-last");
		}
		repeat.xfElement.setIndex(index);
	}
};
function XsltForms_setnode(subform, binding, value, inout, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.value = value? XsltForms_xpath.get(value) : null;
	this.inout = inout;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_setnode.prototype = new XsltForms_abstractAction();
XsltForms_setnode.prototype.run = function(element, ctx) {
	var node = this.binding.bind_evaluate(this.subform, ctx)[0];
	if (node) {
		if (this.context) {
			ctx = this.context.xpath_evaluate(ctx)[0];
		}
		var value = this.value? XsltForms_globals.stringValue(this.context ? this.value.xpath_evaluate(ctx, ctx) : this.value.xpath_evaluate(node, ctx)) : this.literal;
		var modelid = XsltForms_browser.getDocMeta(node.ownerDocument, "model");
		var instanceid = XsltForms_browser.getDocMeta(node.ownerDocument, "instance");
		XsltForms_globals.openAction("XsltForms_setnode.prototype.run");
		if (this.inout) {
			while (node.firstChild) {
				node.removeChild(node.firstChild);
			}
			var tempnode = node.ownerDocument.createTextNode("temp");
			node.appendChild(tempnode);
			XsltForms_browser.loadNode(tempnode, value || "", "application/xml");
		} else {
			XsltForms_browser.loadNode(node, value || "", "application/xml");
			XsltForms_browser.setDocMeta(node.ownerDocument, "model", modelid);
			XsltForms_browser.setDocMeta(node.ownerDocument, "instance", instanceid);
		}
		var model = document.getElementById(modelid).xfElement;
		XsltForms_globals.addChange(model);
		XsltForms_browser.debugConsole.write("Setnode " + node.nodeName + (this.inout ? " inner" : " outer") + " = " + value); 
		XsltForms_xmlevents.dispatch(model, "xforms-rebuild");
		XsltForms_globals.refresh();
		XsltForms_globals.closeAction("XsltForms_setnode.prototype.run");
	}
};
function XsltForms_setselection(subform, control, value, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.control = control;
	this.value = value? XsltForms_xpath.get(value) : null;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_setselection.prototype = new XsltForms_abstractAction();
XsltForms_setselection.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	if (this.context) {
		ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
	}
	var controlid = this.control;
	if (controlid && controlid.bind_evaluate) {
		controlid = XsltForms_globals.stringValue(controlid.bind_evaluate(this.subform, ctx, varresolver));
	}
	var control = XsltForms_idManager.find(controlid).xfElement;
	var input = control.input;
	var value = XsltForms_globals.stringValue(this.value.xpath_evaluate(ctx, ctx, element.xfElement.subform, varresolver));
	var start = input.selectionStart;
	var end = input.selectionEnd;
	var newvalue = input.value.substring(0, start) + value + input.value.substring(end);
	XsltForms_globals.openAction("XsltForms_setselection.prototype.run");
	try {
		XsltForms_browser.setValue(control.boundnodes[0], newvalue);
		input.value = newvalue;
		if (!XsltForms_browser.isChrome) {
			input.focus();
		}
		input.setSelectionRange(start, start + value.length);
		document.getElementById(XsltForms_browser.getDocMeta(control.boundnodes[0].ownerDocument, "model")).xfElement.addChange(control.boundnodes[0]);
		XsltForms_browser.debugConsole.write("Set selection " + controlid + " = " + newvalue);
	} catch (e) {
		XsltForms_browser.debugConsole.write("ERROR: cannot set selection on " + controlid + " = " + newvalue + "(context " + XsltForms_browser.name2string(ctx) + ")");
	}
	XsltForms_globals.closeAction("XsltForms_setselection.prototype.run");
};
function XsltForms_setvalue(subform, binding, value, literal, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.value = value? XsltForms_xpath.get(value) : null;
	this.literal = literal || "";
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_setvalue.prototype = new XsltForms_abstractAction();
XsltForms_setvalue.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	var nodeset = this.binding.bind_evaluate(element.xfElement.subform, ctx, varresolver);
	if (nodeset.length !== 0 && this.context) {
		ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
	}
	for (var i = 0, l = nodeset.length; i < l; i++) {
		var node = nodeset[i];
		if (node) {
			var value = this.value? XsltForms_globals.stringValue(this.context ? this.value.xpath_evaluate(ctx, ctx, element.xfElement.subform, varresolver) : this.value.xpath_evaluate(node, ctx, element.xfElement.subform, varresolver)) : this.literal;
			XsltForms_globals.openAction("XsltForms_setvalue.prototype.run");
			try {
				XsltForms_browser.setValue(node, value || "");
				document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement.addChange(node);
				XsltForms_browser.debugConsole.write("Setvalue " + XsltForms_browser.name2string(node) + " = " + value);
			} catch (e) {
				XsltForms_browser.debugConsole.write("ERROR: cannot setvalue on " + XsltForms_browser.name2string(node) + " = " + value + "(context " + XsltForms_browser.name2string(ctx) + ")");
			}
			XsltForms_globals.closeAction("XsltForms_setvalue.prototype.run");
		}
	}
};
function XsltForms_split(subform, binding, separator, leftTrim, rightTrim, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.binding = binding;
	this.separator = separator;
	this.leftTrim = leftTrim && leftTrim !== "" ? new RegExp(leftTrim) : null;
	this.rightTrim = rightTrim && rightTrim !== "" ? new RegExp(rightTrim) : null;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_split.prototype = new XsltForms_abstractAction();
XsltForms_split.prototype.run = function(element, ctx) {
	var node;
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	var nodes = this.binding.bind_evaluate(element.xfElement.subform, ctx, varresolver);
	if (nodes.length !== 0) {
		if (this.context) {
			ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
		}
		XsltForms_globals.openAction("XsltForms_split.prototype.run");
		try {
			for (var i = 0, l = nodes.length; i < l; i++) {
				node = nodes[i];
				XsltForms_browser.splitNode(node, this.separator || ",", this.leftTrim, this.rightTrim);
				document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement.addChange(node);
				XsltForms_browser.debugConsole.write("Split " + XsltForms_browser.name2string(node) + " = '" + XsltForms_browser.getValue(node) + "' with " + this.separator);
			}
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: cannot split on " + XsltForms_browser.name2string(node) + " with " + this.separator + "(context " + XsltForms_browser.name2string(ctx) + ")");
		}
		XsltForms_globals.closeAction("XsltForms_split.prototype.run");
	}
};
function XsltForms_toggle(subform, caseId, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.caseId = caseId;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_toggle.prototype = new XsltForms_abstractAction();
XsltForms_toggle.prototype.run = function(element, ctx) {
	XsltForms_toggle.toggle(this.caseId, ctx);
};
XsltForms_toggle.toggle = function(caseId, ctx) {
	XsltForms_globals.openAction("XsltForms_toggle.toggle");
	if (typeof caseId === 'object') {
		if (!ctx) {
			ctx = XsltForms_globals.defaultModel.getInstanceDocument() ? XsltForms_globals.defaultModel.getInstanceDocument().documentElement : null;
		}
		caseId = XsltForms_globals.stringValue(caseId.xpath.xpath_evaluate(ctx));
	}
	var element = XsltForms_idManager.find(caseId);
	var childs = element ? element.parentNode.childNodes : [];
	var ul;
	var index = -1;
	if (childs.length > 0 && childs[0].nodeName.toLowerCase() === "ul") {
		ul = childs[0];
	}
	for (var i = ul ? 1 : 0, len = childs.length; i < len; i++) {
		var child = childs[i];
		if (child === element) {
			index = i - 1;
		} else {
			if (child.style && child.style.display !== "none") {
				child.style.display = "none";
				if (ul) {
					XsltForms_browser.setClass(ul.childNodes[i - 1], "ajx-tab-selected", false);
				}
			}
			XsltForms_xmlevents.dispatch(child, "xforms-deselect");
		}
	}
	if (element && element.style.display === "none") {
		element.style.display = "block";
		if (ul) {
			XsltForms_browser.setClass(ul.childNodes[index], "ajx-tab-selected", true);
		}
	}
	if (element) {
		XsltForms_xmlevents.dispatch(element, "xforms-select");
	}
	XsltForms_globals.closeAction("XsltForms_toggle.toggle");
};
function XsltForms_unload(subform, targetid, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.targetid = targetid;
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_unload.prototype = new XsltForms_abstractAction();
XsltForms_unload.prototype.run = function(element, ctx) {
	var targetid = this.targetid || this.subform.eltid;
	var targetelt = XsltForms_idManager.find(targetid);
	if (targetelt.xfSubform) {
		targetelt.xfSubform.dispose();
	}
	targetelt.xfSubform = null;
	var targetxf = targetelt.xfElement;
	if (targetxf) {
		targetelt = targetelt.children[targetelt.children.length - 1];
	}
	targetelt.innerHTML = "";
	targetelt.hasXFElement = null;
	XsltForms_browser.setClass(targetelt, "xforms-subform-loaded", false);
	if (targetxf) {
		XsltForms_xmlevents.dispatch(targetxf, "xforms-unload-done");
	}
	XsltForms_browser.debugConsole.write("unload-done");
};
XsltForms_unload.subform = function(targetid, ref) {
	if (ref) {
		var parentNode = ref;
		while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (XsltForms_browser.hasClass(parentNode, "xforms-repeat-item")) {
				XsltForms_repeat.selectItem(parentNode);
			}
			parentNode = parentNode.parentNode;
		}
	}
	var targetelt = XsltForms_idManager.find(targetid);
	var subform = null;
	parentNode = targetelt;
	while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
		if (parentNode.xfSubform) {
			subform = parentNode.xfSubform;
			break;
		}
		parentNode = parentNode.parentNode;
	}
	var a = new XsltForms_unload(subform, targetid);
	a.run();
};
function XsltForms_wrap(subform, control, prevalue, postvalue, context, ifexpr, whileexpr, iterateexpr) {
	this.subform = subform;
	this.control = control;
	this.prevalue = prevalue;
	this.postvalue = postvalue;
	this.context = XsltForms_xpath.get(context);
	this.init(ifexpr, whileexpr, iterateexpr);
}
XsltForms_wrap.prototype = new XsltForms_abstractAction();
XsltForms_wrap.prototype.run = function(element, ctx) {
	var varresolver = this.parentAction ? this.parentAction.varResolver : element.xfElement.varResolver;
	if (this.context) {
		ctx = this.context.xpath_evaluate(element.xfElement.subform, ctx, null, varresolver)[0];
	}
	var controlid = this.control;
	if (controlid && controlid.bind_evaluate) {
		controlid = XsltForms_globals.stringValue(controlid.bind_evaluate(this.subform, ctx, varresolver));
	}
	var control = XsltForms_idManager.find(controlid).xfElement;
	var input = control.input;
	var prevalue = this.prevalue;
	if (prevalue && prevalue.bind_evaluate) {
		prevalue = XsltForms_globals.stringValue(prevalue.bind_evaluate(this.subform, ctx, varresolver));
	}
	var postvalue = this.postvalue;
	if (postvalue && postvalue.bind_evaluate) {
		postvalue = XsltForms_globals.stringValue(postvalue.bind_evaluate(this.subform, ctx, varresolver));
	}
	if (prevalue + postvalue !== "") {
		var start = input.selectionStart;
		var end = input.selectionEnd;
		var wrapvalue = input.value.substring(0, start) + prevalue + input.value.substring(start, end) + postvalue + input.value.substring(end);
		XsltForms_globals.openAction("XsltForms_wrap.prototype.run");
		try {
			XsltForms_browser.setValue(control.boundnodes[0], wrapvalue || "");
			input.value = wrapvalue || "";
			if (!XsltForms_browser.isChrome) {
				input.focus();
			}
			input.setSelectionRange(start, end + prevalue.length + postvalue.length);
			document.getElementById(XsltForms_browser.getDocMeta(control.boundnodes[0].ownerDocument, "model")).xfElement.addChange(control.boundnodes[0]);
			XsltForms_browser.debugConsole.write("Wrap " + controlid + " = " + wrapvalue);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: cannot wrap on " + controlid + " = " + wrapvalue + "(context " + XsltForms_browser.name2string(ctx) + ")");
		}
		XsltForms_globals.closeAction("XsltForms_wrap.prototype.run");
	}
};
function XsltForms_tree(subform, id, binding) {
	this.init(subform, id);
	this.binding = binding;
	this.hasBinding = true;
	this.root = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "ul")[0] : this.element.getElementsByTagName("ul")[0];
	this.label = this.root.firstChild.cloneNode(true);
}
XsltForms_tree.prototype = new XsltForms_element();
XsltForms_tree.prototype.dispose = function() {
	this.root = null;
	this.selected = null;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_tree.prototype.build_ = function(ctx) {
	var node = this.evaluateBinding(this.binding, ctx)[0];
	if (node) {
		var nodes = [];
		this.buildTree(this.root, 0, node, nodes);
		if (!this.selected || !XsltForms_browser.inArray(this.selected, nodes)) {
			this.select(this.root.firstChild);
		}
	}
};
XsltForms_tree.prototype.select = function(item) {
	var changed = true;
	var init = !!this.selected;
	if (init) {
		if (this.selected === item) {
			changed = false;
		} else {
			XsltForms_browser.setClass(this.selected, "xforms-tree-item-selected", false);
			XsltForms_browser.setClass(this.selected.childNodes[1], "xforms-tree-item-label-selected", false);
		}
	}
	if (changed) {
		this.element.node = item.node;
		this.selected = item;
		XsltForms_browser.setClass(item, "xforms-tree-item-selected", true);
		XsltForms_browser.setClass(item.childNodes[1], "xforms-tree-item-label-selected", true);
		XsltForms_globals.openAction();
		XsltForms_globals.addChange(this);
		XsltForms_globals.addChange(document.getElementById(XsltForms_browser.getDocMeta(item.node.ownerDocument, "model")).xfElement);
		XsltForms_globals.closeAction();
	}
};
XsltForms_tree.prototype.click = function(target) {
	if (target.className === "xforms-tree-item-button") {
		var ul = target.nextSibling.nextSibling;
		if (ul) {
			ul.style.display = ul.style.display !== "none"? "none" : "block";
		}
	} else if (XsltForms_browser.hasClass(target, "xforms-tree-item-label")) {
		this.select(target.parentNode);
	}
};
XsltForms_tree.prototype.buildTree = function(parentNode, index, node, nodes) {
	var li = null;
	var ul = null;
	var childs = node.childNodes;
	var nochild = childs.length === 0;
	nodes.push(node);
	if (parentNode.childNodes.length < index + 1) {
		li = this.label.cloneNode(true);
		parentNode.appendChild(li);
		XsltForms_repeat.initClone(li);
	} else {
		li = parentNode.childNodes[index];
		var last = li.lastChild;
		if (last.nodeName.toLowerCase() === "ul") {
			ul = last;
			if (nochild) {
				XsltForms_globals.dispose(ul);
				li.removeChild(ul);
			}
		}
	}
	li.node = node;
	XsltForms_browser.setClass(li, "xforms-tree-item-fork", !nochild);
	XsltForms_browser.setClass(li, "xforms-tree-item-leaf", nochild);
	for (var i = 0, len = childs.length; i < len; i++) {
		var child = childs[i];
		if (child.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (!ul) {
				ul = XsltForms_browser.createElement("ul", li);
			}
			this.buildTree(ul, i, child, nodes);
		}
	}
	if (ul) {
		for (var j = ul.childNodes.length, len1 = childs.length; j > len1; j--) {
			XsltForms_globals.dispose(ul.lastChild);
			ul.removeChild(ul.lastChild);
		}
	}
};
XsltForms_tree.prototype.refresh = function() {
};
function XsltForms_element() {
}
XsltForms_element.depsId = 0;
XsltForms_element.prototype.init = function(subform, id) {
	this.subform = subform;
	this.element = document.getElementById(id);
	if (this.element.xfElement) {
		if (!(this.element.xfElement instanceof Array)) {
			this.element.xfElement = [this.element.xfElement];
		}
		this.element.xfElement.push(this);
	} else {
		this.element.xfElement = this;
	}
	this.depsElements = [];
	this.depsNodesBuild = [];
	this.depsNodesRefresh = [];
	this.depsIdB = XsltForms_element.depsId++;
	this.depsIdR = XsltForms_element.depsId++;
	var p = this.element.parentNode;
	while (p) {
		if (p.varScope) {
			for (var v in p.varScope) {
				if (!this.varResolver) {
					this.varResolver = {};
				}
				this.varResolver[v] = p.varScope[v];
			}
		}
		p = p.parentNode;
	}
};
XsltForms_element.prototype.dispose = function() {
	if(this.element) {
		this.element.xfElement = null;
		this.element.hasXFElement = null;
		this.element = null;
	}
	this.depsElements = null;
	if (this.depsNodesBuild) {
		for (var i = 0, len = this.depsNodesBuild.length; i < len; i++) {
			XsltForms_browser.rmValueMeta(this.depsNodesBuild[i], "depfor", this.depsIdB);
		}
	}
	this.depsNodesBuild = null;
	if (this.depsNodesRefresh) {
		for (var i2 = 0, len2 = this.depsNodesRefresh.length; i2 < len2; i2++) {
			XsltForms_browser.rmValueMeta(this.depsNodesRefresh[i2], "depfor", this.depsIdR);
		}
	}
	this.depsNodesRefresh = null;
	for (var key in this) {
		if (this.hasOwnProperty(key)) {
			this[key] = null;
			delete this[key];
		}
	}   
};
XsltForms_element.prototype.build = function(ctx, varresolver) {
	if (this.hasBinding) {
		var deps = this.depsElements;
		var depsN = this.depsNodesBuild;
		var depsR = this.depsNodesRefresh;
		var build = !XsltForms_globals.ready || (deps.length === 0) || ctx !== this.ctx;
		var refresh = false;
		var changes = XsltForms_globals.changes;
		for (var i0 = 0, len0 = depsN.length; !build && i0 < len0; i0++) {
			build = depsN[i0].nodeName === "";
		}
		for (var i = 0, len = deps.length; !build && i < len; i++) {
			var el = deps[i];
			for (var j = 0, len1 = changes.length; !build && j < len1; j++) {
				if (el === changes[j]) {
					if (el.instances) { //model
						if (el.rebuilded || el.newRebuilded) {
							build = true;
						} else {
							for (var k = 0, len2 = depsN.length; !build && k < len2; k++) {
								build = XsltForms_browser.inArray(depsN[k], el.nodesChanged);
							}
							if (!build) {
								for (var n = 0, len3 = depsR.length; n < len3; n++) {
									refresh = XsltForms_browser.inArray(depsR[n], el.nodesChanged);
								}
							}
						}
					} else {
						build = true;
					}
				}
			}
		}
		this.changed = build || refresh;
		if (build) {
			for (var i4 = 0, len4 = depsN.length; i4 < len4; i4++) {
				XsltForms_browser.rmValueMeta(depsN[i4], "depfor", this.depsIdB);
			}
			depsN.length = 0;
			for (var i5 = 0, len5 = depsR.length; i5 < len5; i5++) {
				XsltForms_browser.rmValueMeta(depsR[i5], "depfor", this.depsIdR);
			}
			depsR.length = 0;
			deps.length = 0;
			this.ctx = ctx;
			this.build_(ctx, varresolver);
		}
	} else {
		this.element.node = ctx;
	}
};
XsltForms_element.prototype.evaluateBinding = function(binding, ctx, varresolver) {
	this.boundnodes = null;
	var errmsg = null;
	if (binding) {
		if (this.varResolver) {
			for (var v in this.varResolver) {
				if (!varresolver) {
					varresolver = {};
				}
				varresolver[v] = this.varResolver[v];
			}
		}
		this.boundnodes = binding.bind_evaluate(this.subform, ctx, varresolver, this.depsNodesBuild, this.depsIdB, this.depsElements);
		if (this.boundnodes || this.boundnodes === "" || this.boundnodes === 0) {
			return this.boundnodes;
		}
		errmsg = "non-existent bind-ID("+ binding.bind + ") on element(" + this.element.id + ")!";
	} else {
		errmsg = "no binding defined for element("+ this.element.id + ")!";
	}
	XsltForms_browser.assert(errmsg);
	if (XsltForms_globals.building && XsltForms_globals.debugMode) {
		XsltForms_globals.bindErrMsgs.push(errmsg);
		XsltForms_xmlevents.dispatch(this.element, "xforms-binding-exception");
		this.nodes = [];
	} else {
		XsltForms_globals.error(this.element, "xforms-binding-exception", errmsg);
	}
	return this.boundnodes;
};
function XsltForms_control() {
	this.isControl = true;
}
XsltForms_control.prototype = new XsltForms_element();
XsltForms_control.prototype.initFocus = function(element, principal) {
	if (principal) {
		this.focusControl = element;
	}
	XsltForms_browser.events.attach(element, "focus", XsltForms_control.focusHandler);
	XsltForms_browser.events.attach(element, "blur", XsltForms_control.blurHandler);
};
XsltForms_control.prototype.dispose = function() {
	this.focusControl = null;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_control.prototype.focus = function(focusEvent, evcontext) {
	if (this.isOutput) {
		return;
	}
	if (XsltForms_globals.focus !== this) {
		XsltForms_globals.openAction("XsltForms_control.prototype.focus");
		XsltForms_globals.blur(true);
		XsltForms_globals.focus = this;
		XsltForms_browser.setClass(this.element, "xforms-focus", true);
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
		var parentNode = this.element.parentNode;
		while (parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (typeof parentNode.node !== "undefined" && XsltForms_browser.hasClass(parentNode, "xforms-repeat-item")) {
				XsltForms_repeat.selectItem(parentNode);
			}
			parentNode = parentNode.parentNode;
		}
		XsltForms_xmlevents.dispatch(XsltForms_globals.focus, "DOMFocusIn", null, null, null, null, evcontext);
		XsltForms_globals.closeAction("XsltForms_control.prototype.focus");
		if (this.full && !focusEvent) { // select full
			this.focusFirst();
		}
	}
	var fcontrol = this.focusControl;
	XsltForms_globals.posibleBlur = false;
	if (fcontrol && !focusEvent) {
		var control = this.focusControl;
		var cname = control.nodeName.toLowerCase();
		try {
			control.focus();
			control.focus();
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: Could not focus on element " + control);
		}
		if (cname === "input" || cname === "textarea") {
			try {
				control.select();
			} catch (e) {
			}
		}
	}
};
XsltForms_control.prototype.build_ = function(ctx, varresolver) {
	var result = this.evaluateBinding(this.binding, ctx, varresolver);
	if (typeof result === "object") {
		var node = result[0];
		var element = this.element;
		var old = element.node;
		if (old !== node || !XsltForms_globals.ready) {
			element.node = node;
			this.nodeChanged = true;
		}
		if (node) {
			this.depsNodesRefresh.push(node);
		}
	} else {
		this.outputValue = result;
	}
};
XsltForms_control.prototype.refresh = function() {
	if (this.controlName === "var") {
		return;
	}
	var element = this.element;
	var node = element.node;
	if (this.outputValue !== undefined) {
		if (this.controlName !== "var") {
			this.setValue(this.outputValue);
			this.eventDispatch("xforms-disabled", "xforms-enabled", false);
		}
	} else if (node) {
		if (!this.value) {
			this.value = this.hasCopy ? [] : "";
		}
		var value = this.value instanceof Array ? XsltForms_browser.getValueItemsetCopy(node) : XsltForms_browser.getValue(node, true, this.complex);
		XsltForms_globals.openAction("XsltForms_control.prototype.refresh");
		var changed;
		if (this.currentValue instanceof Array) {
			changed = false;
			if (this.currentValue.length !== value.length) {
				changed = true;
			} else {
				for (var i = 0, l = this.currentValue.length; i < l; i++) {
					if (this.currentValue[i] !== value[i]) {
						changed = true;
						break;
					}
				}
			}
			changed = changed || this.nodeChanged;
		} else {
			changed = value !== this.currentValue || this.nodeChanged;
		}
		if (this.relevant) {
			XsltForms_browser.setClass(element, "xforms-disabled", false);
		}
		this.changeProp(node, "required", "xforms-required", "xforms-optional", changed, value);
		this.changeProp(node, "notrelevant", "xforms-disabled", "xforms-enabled", changed, value);
		this.changeProp(node, "readonly", "xforms-readonly", "xforms-readwrite", changed, value);
		this.changeProp(node, "notvalid", "xforms-invalid", "xforms-valid", changed, value);
		this.currentValue = value instanceof Array ? value.slice(0) : value;
		if (changed) {
			this.setValue(value);
			if (!this.nodeChanged && !this.isTrigger) {
				XsltForms_xmlevents.dispatch(element, "xforms-value-changed");
			}
		}
		XsltForms_globals.closeAction("XsltForms_control.prototype.refresh");
	} else {
		this.eventDispatch("xforms-disabled", "xforms-enabled", !this.hasValue);
	}
	this.nodeChanged = false;
};
XsltForms_control.prototype.eventDispatch = function(onTrue, onFalse, value) {
	if ((!this.nodeChanged || XsltForms_globals.ready) && !this.isTrigger) {
		XsltForms_xmlevents.dispatch(this.element, (value? onTrue : onFalse));
	}
	XsltForms_browser.setClass(this.element, onTrue, value);
	XsltForms_browser.setClass(this.element, onFalse, !value);
};
XsltForms_control.prototype.changeProp = function(node, prop, onTrue, onFalse, changed, nvalue) {
	var value = (prop === "notvalid" && nvalue === "" && !XsltForms_globals.validationError) ? false : XsltForms_browser.getBoolMeta(node, prop);
	if (changed || value !== this[prop]) {
		this.eventDispatch(onTrue, onFalse, value);
		this[prop] = value;
		if(prop === "readonly" && this.changeReadonly) {
			this.changeReadonly();
		}
	}
};
XsltForms_control.prototype.valueChanged = function(value, force) {
	var node = this.element.node;
	var model = document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement;
	var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
	if (value && !(value instanceof Array) && value.length > 0 && schtyp.parse) {
		try { value = schtyp.parse(value); } catch(e) { }
	}
	var changed;
	if (value instanceof Array) {
		var prevvalue = XsltForms_browser.getValueItemsetCopy(node);
		changed = true;
		var i = 0, l = value.length;
		if (prevvalue.length === l) {
			changed = false;
			for (; i < l; i++) {
				if (prevvalue[i] !== value[i]) {
					changed = true;
					break;
				}
			}
		}
	} else {
		changed = value !== XsltForms_browser.getValue(node);
	}
	if (changed || force) {
		if (value instanceof Array || this.currentValue instanceof Array) {
			XsltForms_browser.setValue(node, value);
			model.addChange(node);
			XsltForms_globals.addChange(model);
			model.setRebuilded(true);
		} else {
			XsltForms_globals.openAction("XsltForms_control.prototype.valueChanged");
			XsltForms_browser.setValue(node, value);
			model.addChange(node);
			XsltForms_xmlevents.dispatch(model, "xforms-recalculate");
			XsltForms_globals.refresh();
			XsltForms_globals.closeAction("XsltForms_control.prototype.valueChanged");
		}
	}
};
XsltForms_control.getXFElement = function(element) {
	var xf = null;
	while (!xf && element) {
		xf = element.xfElement;
		if (xf && !xf.isControl) {
			xf = null;
		}
		element = element.parentNode;
	}
	return xf;
};
XsltForms_control.focusHandler = function() {
	var xf = XsltForms_control.getXFElement(this);
	if (XsltForms_globals.focus !== xf) {
		xf.focus(true);
	} else {
		XsltForms_globals.posibleBlur = false;
	}
};
XsltForms_control.blurHandler = function() {
	if (XsltForms_control.getXFElement(this) === XsltForms_globals.focus) {
		XsltForms_globals.posibleBlur = true;
		XsltForms_globals.blur();
	}
};
function XsltForms_avt(subform, id, attrname, binding) {
	this.init(subform, id);
	this.controlName = "avt";
	this.attrname = attrname;
	this.binding = binding;
	this.hasBinding = true;
	this.isOutput = true;
	if (attrname.toLowerCase() === "id") {
		var calcid = "xsltforms-id-";
		var elt = this.element;
		var prev = 1;
		while (elt.nodeType === Fleur.Node.ELEMENT_NODE) {
			while (elt.previousSibling) {
				if (elt.nodeType === Fleur.Node.ELEMENT_NODE) {
					prev++;
				}
				elt = elt.previousSibling;
			}
			calcid += prev + "_";
			elt = elt.parentNode;
			prev = 1;
		}
		this.element.setAttribute("id", calcid);
	} else if (this.binding && this.binding.type) {
		this.element.setAttribute(this.attrname, "");
	}
}
XsltForms_avt.prototype = new XsltForms_control();
XsltForms_avt.prototype.clone = function(id) { 
	return new XsltForms_avt(this.subform, id, this.attrname, this.binding);
};
XsltForms_avt.prototype.dispose = function() {
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_avt.prototype.setValue = function(value) {
	if (this.attrname === "id" && this.element.id === this.element.getAttribute("oldid")) {
		if (!XsltForms_globals.idalt) {
			XsltForms_globals.idalt = {};
		}
		XsltForms_globals.idalt[this.element.id] = this.element;
	}
	this.element.setAttribute(this.attrname, value);
};
XsltForms_avt.prototype.getValue = function(value) {
	return this.element.getAttribute(this.attrname);
};
function XsltForms_component(subform, id, valoff, binding, href) {
	XsltForms_globals.counters.component++;
	this.init(subform, id);
	this.valoff = valoff;
	var children = this.element.children || this.element.childNodes;
	if (children.length !== 0) {
		var cells = children;
		this.valueElement = cells[valoff];
	} else {
		this.valueElement = this.element;
	}
	this.hasBinding = true;
	this.binding = binding;
	this.resource = href;
	this.isComponent = true;
	if (this.binding && this.binding.type) {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	var req = null;
	var method = "get";
	try {
		req = XsltForms_browser.openRequest(method, href, false);
		XsltForms_browser.debugConsole.write("Load Component " + href);
		req.send(null);
		if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
			return;
		}
		var resp = req.responseText;
		var piindex = resp.indexOf("<?xml-stylesheet", 0);
		while ( piindex !== -1) {
			var xslhref = resp.substr(piindex, resp.substr(piindex).indexOf("?>")).replace(/^.*href=\"([^\"]*)\".*$/, "$1");
			resp = XsltForms_browser.transformText(resp, xslhref, false);
			piindex = resp.indexOf("<?xml-stylesheet", 0);
		}
		var sp = XsltForms_globals.stringSplit(resp, "XsltForms_MagicSeparator");
		var subbody, subjs;
		var targetelt = this.valueElement;
		if (sp.length === 1) {
			subbody = resp;
		} else {
			subjs = "";
			var imain = subjs.indexOf('"xsltforms-mainform"');
			var targetsubform = targetelt.xfSubform;
			if (targetsubform) {
				targetsubform.dispose();
			}
			subjs = '(function(){var xsltforms_subform_eltid = "' + id + '";var xsltforms_parentform = XsltForms_subform.subforms["' + this.subform.id + '"];' + subjs.substring(0, imain) + '"xsltforms-subform-' + XsltForms_globals.nbsubforms + '"' + subjs.substring(imain + 20) + "})();";
			imain = subjs.indexOf('"xsltforms-mainform-instance-default"');
			while (imain !== -1) {
				subjs = subjs.substring(0, imain) + '"xsltforms-subform-' + XsltForms_globals.nbsubforms + '-instance-default"' + subjs.substring(imain + 37);
				imain = subjs.indexOf('"xsltforms-mainform-instance-default"');
			}
			subbody = "<!-- xsltforms-subform-" + XsltForms_globals.nbsubforms + " " + sp[4] + " xsltforms-subform-" + XsltForms_globals.nbsubforms + " -->";
			imain = subbody.indexOf(' id="xsltforms-mainform');
			while (imain !== -1) {
				subbody = subbody.substring(0, imain) + ' id="xsltforms-subform-' + XsltForms_globals.nbsubforms + subbody.substring(imain + 23);
				imain = subbody.indexOf(' id="xsltforms-mainform');
			}
		}
		targetelt.innerHTML = subbody;
		targetelt.hasXFElement = null;
		var parentNode = targetelt.parentNode;
		while (parentNode) {
			if (parentNode.hasXFElement !== false) {
				break;
			}
			parentNode.hasXFElement = null;
			parentNode = parentNode.parentNode;
		}
		if (sp.length !== 1) {
			XsltForms_globals.componentLoads.push(subjs);
			this.subjs = subjs;
			this.evaljs = true;
		}
		XsltForms_browser.setClass(targetelt, "xforms-subform-loaded", true);
		XsltForms_globals.nbsubforms++;
	} catch(e2) {
		XsltForms_browser.debugConsole.write(e2.message || e2);
	}
}
XsltForms_component.prototype = new XsltForms_control();
XsltForms_component.prototype.clone = function(id) { 
	return new XsltForms_component(this.subform, id, this.valoff, this.binding, this.resource);
};
XsltForms_component.prototype.dispose = function() {
	this.valueElement = null;
	XsltForms_globals.counters.component--;
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_component.prototype.blur = function () { };
XsltForms_component.prototype.setValue = function(value) {
	XsltForms_browser.forEach(this.valueElement.children[0].xfElement.subform.binds, "propagate");
};
function XsltForms_group(subform, id, binding, casebinding) {
	XsltForms_globals.counters.group++;
	this.init(subform, id);
	this.controlName = "group";
	if (binding) {
		this.hasBinding = true;
		this.binding = binding;
	} else {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	this.casebinding = casebinding;
}
XsltForms_group.prototype = new XsltForms_element();
XsltForms_group.prototype.dispose = function() {
	XsltForms_globals.counters.group--;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_group.prototype.clone = function(id) { 
	return new XsltForms_group(this.subform, id, this.binding, this.casebinding);
};
XsltForms_group.prototype.build_ = function(ctx) {
	var nodes = this.evaluateBinding(this.binding, ctx);
	this.element.node = nodes[0];
	this.depsNodesRefresh.push(nodes[0]);
	if (this.casebinding) {
		var caseref = this.evaluateBinding(this.casebinding, nodes[0]);
		if (caseref) {
			XsltForms_toggle.toggle(XsltForms_globals.stringValue(caseref));
		}
	}
};
XsltForms_group.prototype.refresh = function() {
	var element = this.element;
	var disabled = !element.node || XsltForms_browser.getBoolMeta(element.node, "notrelevant");
	XsltForms_browser.setClass(element, "xforms-disabled", disabled);
	var ul = element.parentNode.children ? element.parentNode.children[0] : element.parentNode.childNodes[0];
	if (ul.nodeName.toLowerCase() === "ul") {
		var childs = element.parentNode.children || element.parentNode.childNodes;
		var tab;
		for (var i = 1, len = childs.length; i < len; i++) {
			if (childs[i] === element) {
				tab = ul.childNodes[i - 1];
			}
		}
		XsltForms_browser.setClass(tab, "xforms-disabled", disabled);
	}
};
function XsltForms_input(subform, id, valoff, itype, binding, inputmode, incremental, delay, mediatype, aidButton, clone) {
	XsltForms_globals.counters.input++;
	this.init(subform, id);
	this.controlName = "input";
	this.binding = binding;
	this.inputmode = typeof inputmode === "string"? XsltForms_input.InputMode[inputmode] : inputmode;
	this.incremental = incremental;
	this.delay = delay;
	this.timer = null;
	var cells = this.element.children;
	this.valoff = valoff;
	this.cell = cells[valoff];
	if (!this.cell) {
		XsltForms_browser.debugConsole.write("ERROR: Could not create input id " + id + ", with binding " + binding + " on subform " + subform);
		return;
	}
	this.isClone = clone;
	this.hasBinding = true;
	this.itype = itype;
	this.bolAidButton = aidButton;
	this.mediatype = mediatype;
	this.initFocus(this.cell.children[0], true);
	if (aidButton) {
		this.aidButton = cells[valoff + 1].children[0];
		this.initFocus(this.aidButton);
	}
}
XsltForms_input.prototype = new XsltForms_control();
XsltForms_input.prototype.clone = function(id) { 
	return new XsltForms_input(this.subform, id, this.valoff, this.itype, this.binding, this.inputmode, this.incremental, this.delay, this.mediatype, this.bolAidButton, true);
};
XsltForms_input.prototype.dispose = function() {
	if (this.mediatype === "application/xhtml+xml" && this.type.rte) {
		switch(this.type.rte.toLowerCase()) {
			case "tinymce":
				try {
					if (XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.") {
						tinyMCE.execCommand("mceFocus", false, this.cell.children[0].id);
						tinyMCE.execCommand("mceRemoveControl", false, this.cell.children[0].id);
					} else {
						tinyMCE.editors[this.cell.children[1].id].remove();
					}
				} catch(e) {
				}
				break;
			case "ckeditor":
				if (this.rte) {
					this.rte.destroy();
					this.rte = null;
				}
		}
	}
	this.cell = null;
	this.calendarButton = null;
	XsltForms_globals.counters.input--;
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_input.prototype.initInput = function(type) {
	var cell = this.cell;
	var input = cell.children[0];
	var tclass = type["class"];
	var initinfo;
	if (input.type === "password") {
		this.type = XsltForms_schema.getType("xsd_:string");
		this.initEvents(input, true);
	} else if (input.nodeName.toLowerCase() === "textarea") {
		this.type = type;
		if (this.mediatype === "application/xhtml+xml" && type.rte) {
			switch(type.rte.toLowerCase()) {
				case "tinymce":
					input.id = this.element.id + "_textarea";
					XsltForms_browser.debugConsole.write(input.id+": init="+XsltForms_globals.tinyMCEinit);
					if (!XsltForms_globals.tinyMCEinit || XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) !== "3.") {
						eval("initinfo = " + (type.appinfo ? type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") : "{}"));
						initinfo.mode = "none";
						initinfo.Xsltforms_usersetup = initinfo.setup || function() {};
						if (!XsltForms_globals.jslibraries["http://www.tinymce.com"] || XsltForms_globals.jslibraries["http://www.tinymce.com"].substr(0, 2) === "3.") {
							initinfo.setup = function(ed) {
								initinfo.Xsltforms_usersetup(ed);
								ed.onKeyUp.add(function(ed) {
									XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
								});
								ed.onChange.add(function(ed) {
									XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
								});
								ed.onUndo.add(function(ed) {
									XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
								});
								ed.onRedo.add(function(ed) {
									XsltForms_control.getXFElement(document.getElementById(ed.id)).valueChanged(ed.getContent() || "");
								});
							};
						} else {
							initinfo.setup = function(ed) {
								initinfo.Xsltforms_usersetup(ed);
								ed.on("KeyUp", function() {
									XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(this.getContent() || "");
								});
								ed.on("Change", function(ed) {
									XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(ed.target.getContent() || "");
								});
								ed.on("Undo", function(ed) {
									XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(ed.target.getContent() || "");
								});
								ed.on("Redo", function(ed) {
									XsltForms_control.getXFElement(document.getElementById(this.id)).valueChanged(ed.target.getContent() || "");
								});
							};
							initinfo.selector = "#" + input.id;
						}
						XsltForms_browser.debugConsole.write(input.id+": initinfo="+initinfo);
						tinyMCE.init(initinfo);
						XsltForms_globals.tinyMCEinit = true;
					}
					tinyMCE.execCommand("mceAddEditor", true, input.id);
					break;
				case "ckeditor":
					input.id = this.element.id + "_textarea";
					if (!CKEDITOR.replace) {
						alert("CKEditor is not compatible with XHTML mode.");
					}
					initinfo = "";
					eval("initinfo = " + (type.appinfo ? type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") : "{}"));
					this.rte = CKEDITOR.replace(input.id, initinfo);
					var eltRefresh = function(evt) {
						var data = evt.editor.getData();
						if (data.substr(data.length - 1) === "\n") {
							data = data.substr(0, data.length - 1);
						}
						var ctl = XsltForms_control.getXFElement(document.getElementById(evt.editor.name));
						XsltForms_browser.setBoolMeta(ctl.element.node, "unsafe", evt.editor.mode === "source");
						ctl.valueChanged(data || "", true);
					};
					this.rte.on("change", eltRefresh);
					this.rte.on("blur", eltRefresh);
					this.rte.on("mode", eltRefresh);
			}
		}
		this.initEvents(input, false);
	} else if (type !== this.type) {
		var inputid = input.id;
		this.type = type;
		if (tclass === "boolean" || this.itype !== input.type) {
			while (cell.firstChild) {
				cell.removeChild(cell.firstChild);
			}
		} else {
			while (cell.firstChild.nodeType === Fleur.Node.TEXT_NODE) {
				cell.removeChild(cell.firstChild);
			}
			for (var i = cell.childNodes.length - 1; i >= 1; i--) {
				cell.removeChild(cell.childNodes[i]);
			}
		}
		if (tclass === "boolean") {
			input = XsltForms_browser.createElement("input");
			input.type = "checkbox";
			input.id = inputid;
			cell.appendChild(input);
		} else {
			if(this.itype !== input.type) {
				input = XsltForms_browser.createElement("input", cell, null, "xforms-value");
			}
			input.id = inputid;
			this.initEvents(input, (this.itype === "text"));
			if (tclass === "time") {
				if (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isEdge)) {
					input.type = "time";
				}
			} else if (tclass === "date" || tclass === "datetime") {
				if (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari)) {
					if (tclass === "date") {
						input.type = "date";
					} else if (tclass === "datetime"){
						input.type = "datetime-local";
					}
			    } else {
					this.calendarButton = XsltForms_browser.createElement("button", cell, XsltForms_browser.selectSingleNode("calendar.label", XsltForms_browser.config) ? XsltForms_browser.i18n.get("calendar.label") : "...", "aid-button");
					this.calendarButton.setAttribute("type", "button");
					this.initFocus(this.calendarButton);
				}
			} else if (tclass === "number"){
				if (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari)) {
					input.type = "number";
					if (typeof type.fractionDigits === "number") {
						input.step = String(Math.pow(1, -parseInt(type.fractionDigits, 10)));
					} else {
						input.step = "any";
					}
				}
				input.style.textAlign = "right";
			} else {
				input.style.textAlign = "left";
			}
			var max = type.getMaxLength();
			if (max) {
				input.maxLength = max;
			} else {
				input.removeAttribute("maxLength");
			}
			var tlength = type.getDisplayLength();
			if (tlength) { 
				input.size = tlength;
			} else { 
				input.removeAttribute("size");
			}
		}
	}
	this.initFocus(input, true);
	this.input = input;
};
XsltForms_input.prototype.setValue = function(value) {
	var newvalue;
	var node = this.element.node;
	var type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
	if (!this.input || type !== this.type) {
		this.initInput(type);
		this.changeReadonly();
	}
	if (type["class"] === "boolean") {
		this.input.checked = value === "true";
	} else if (this.type.rte && this.type.rte.toLowerCase() === "tinymce" && tinymce.get(this.input.id)) {
		try {
			var editor = tinymce.get(this.input.id);
			var prevalue = editor.getContent ? editor.getContent() : editor.contentDocument.body.innerHTML;
			if (prevalue !== value) {
				this.input.value = value || "";
				editor.setContent(value);
				newvalue = editor.contentDocument ? editor.contentDocument.body.innerHTML : editor.getContent();
				this.input.value = newvalue || "";
				XsltForms_browser.debugConsole.write(this.input.id+": getContent() ="+newvalue);
				XsltForms_browser.debugConsole.write(this.input.id+".value ="+this.input.value);
			}
		} catch (e) {
			this.input.value = value;
		}
	} else if (this.type.rte && this.type.rte.toLowerCase() === "ckeditor" && this.rte) {
		var data = this.rte.getData();
		if (data.substr(data.length - 1) === "\n") {
			data = data.substr(0, data.length - 1);
		}
		if (data !== value) {
			XsltForms_browser.debugConsole.write("value = '"+value+"'");
			XsltForms_browser.debugConsole.write(this.input.id+": getData() = '"+this.rte.getData()+"'");
			XsltForms_browser.debugConsole.write(this.input.id+".value = '"+this.input.value+"'");
			this.input.value = value || "";
			this.rte.setData(value);
		}
	} else if (this.input.type.substr(0, 4) === "date") {
		if (this.input.value !== XsltForms_browser.getValue(node).substr(0, 15)) {
			this.input.value = XsltForms_browser.getValue(node).substr(0, 15);
		}
	} else {
		var inputvalue = this.input.value;
		newvalue = value;
		if (type.parse) {
			if (inputvalue && inputvalue.length > 0) {
				try { inputvalue = type.parse(inputvalue); } catch(e) { }
			}
			if (newvalue && newvalue.length > 0) {
				try { newvalue = type.parse(newvalue); } catch(e) { }
			}
		}
		if (this.input.type === "time" || this.input.type === "date" || this.input.type === "datetime-local") {
			if (inputvalue !== newvalue) { // && this !== XsltForms_globals.focus) {
				this.input.value = newvalue;
			}
		} else if (inputvalue !== value) {
			this.input.value = value || "";
		}
	}
};
XsltForms_input.prototype.changeReadonly = function() {
	var node = this.element.node;
	var type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
	if (this.input) {
		if (type["class"] === "boolean") {
			this.input.disabled = this.readonly;
		}
		this.input.readOnly = this.readonly;
		if (this.calendarButton) {
			this.calendarButton.style.display = this.readonly ? "none" : "";
		}
	}
};
XsltForms_input.prototype.initEvents = function(input, canActivate) {
	var changeEventName = "keyup";
	if (XsltForms_browser.isEdge || XsltForms_browser.isIE11 || (XsltForms_globals.htmlversion === "5" && (XsltForms_browser.isChrome || XsltForms_browser.isOpera || XsltForms_browser.isSafari))) {
		changeEventName = "input";
	}
	if (this.inputmode) {
		XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpInputMode);
	}
	if (canActivate) {
		XsltForms_browser.events.attach(input, "keydown", XsltForms_input.keyDownActivate);
		XsltForms_browser.events.attach(input, "keypress", XsltForms_input.keyPressActivate);
		if (this.incremental) {
			XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpIncrementalActivate);
		} else {
			XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpActivate);
		}
	} else {
		if (this.incremental) {
			XsltForms_browser.events.attach(input, changeEventName, XsltForms_input.keyUpIncremental);
		}
	}
};
XsltForms_input.prototype.blur = function(target) {
	XsltForms_globals.focus = null;
	var input = this.input;
	var value;
	if (!this.incremental) {
		XsltForms_browser.assert(input, this.element.id);
		if (input.type === "checkbox") {
			value = input.checked ? "true" : "false";
		} else if (input.nodeName.toLowerCase() !== "textarea") {
			value = input.value;
			if (input.type === "time" && value && value.length === 5) {
				value += ":00";
			}
		} else if (this.type.rte && this.type.rte.toLowerCase() === "tinymce") {
			value = tinyMCE.get(input.id).getContent();
		} else {
			value = input.value;
		}
		this.valueChanged(value);
	} else {
		var node = this.element.node;
		value = input.value;
		if (value && value.length > 0 && input.type !== "time" && input.type.substr(0, 4) !== "date" && XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").format) {
			try { input.value = XsltForms_browser.getValue(node, true); } catch(e) { }
		}
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null;
			this.valueChanged(value);
		}
	}
};
XsltForms_input.prototype.click = function(target) {
	if (target === this.aidButton) {
		XsltForms_globals.openAction("XsltForms_input.prototype.click#1");
		XsltForms_xmlevents.dispatch(this, "ajx-aid");
		XsltForms_globals.closeAction("XsltForms_input.prototype.click#1");
	} else if (target === this.input && this.type["class"] === "boolean") {
		XsltForms_globals.openAction("XsltForms_input.prototype.click#2");
		this.valueChanged(target.checked? "true" : "false");
		XsltForms_xmlevents.dispatch(this, "DOMActivate");
		XsltForms_globals.closeAction("XsltForms_input.prototype.click#2");
	} else if (target === this.calendarButton) {
		XsltForms_calendar.show(target.previousSibling, this.type["class"] === "datetime"? XsltForms_calendar.SECONDS : XsltForms_calendar.ONLY_DATE);
	}
};
XsltForms_input.keyUpInputMode = function() {
	var xf = XsltForms_control.getXFElement(this);
	this.value = xf.inputmode(this.value);
};
XsltForms_input.keyDownActivate = function(a) {
	this.keyDownCode = a.keyCode;
};
XsltForms_input.keyPressActivate = function(a) {
	this.keyPressCode = a.keyCode;
	if (a.keyCode === 13) {
		if (a.stopPropagation) {
			a.stopPropagation();
			a.preventDefault();
		} else {
			a.cancelBubble = true;
		}
	}
};
XsltForms_input.keyUpActivate = function(a) {
	var xf = XsltForms_control.getXFElement(this);
	if (a.keyCode === 13 && (this.keyDownCode === 13 || this.keyPressCode === 13)) {
		XsltForms_globals.openAction("XsltForms_input.keyUpActivate");
		xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
		XsltForms_xmlevents.dispatch(xf, "DOMActivate");
		XsltForms_globals.closeAction("XsltForms_input.keyUpActivate");
	}
	this.keyDownCode = this.keyPressCode = null;
};
XsltForms_input.keyUpIncrementalActivate = function(a) {
	var xf = XsltForms_control.getXFElement(this);
	if (a.keyCode === 13 && (this.keyDownCode === 13 || this.keyPressCode === 13)) {
		XsltForms_globals.openAction("XsltForms_input.keyUpIncrementalActivate#1");
		xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
		XsltForms_xmlevents.dispatch(xf, "DOMActivate");
		XsltForms_globals.closeAction("XsltForms_input.keyUpIncrementalActivate#1");
	} else {
		if (xf.delay && xf.delay > 0) {
			if (xf.timer) {
				window.clearTimeout(xf.timer);
			}
			var _self = this;
			xf.timer = window.setTimeout(
				function () {
					XsltForms_globals.openAction('XsltForms_input.keyUpIncrementalActivate#2');
					xf.valueChanged((_self.type === "time" && _self.value && _self.value.length === 5 ? _self.value + ":00" : _self.value) || "");
					XsltForms_globals.closeAction('XsltForms_input.keyUpIncrementalActivate#2');
				}, xf.delay);
		} else {
			XsltForms_globals.openAction("XsltForms_input.keyUpIncrementalActivate#3");
			xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
			XsltForms_globals.closeAction("XsltForms_input.keyUpIncrementalActivate#3");
		}
	}
	this.keyDownCode = this.keyPressCode = null;
};
XsltForms_input.inputActivate = function(a) {
	var xf = XsltForms_control.getXFElement(this);
	XsltForms_globals.openAction("XsltForms_input.inputActivate#1");
	xf.valueChanged(this.value || "");
	XsltForms_globals.closeAction("XsltForms_input.inputActivate#1");
};
XsltForms_input.keyUpIncremental = function() {
	var xf = XsltForms_control.getXFElement(this);
	if (xf.delay && xf.delay > 0) {
		if (xf.timer) {
			window.clearTimeout(xf.timer);
		}
		var _self = this;
		xf.timer = window.setTimeout(
			function () {
				XsltForms_globals.openAction('XsltForms_input.keyUpIncremental#1');
				xf.valueChanged((_self.type === "time" && _self.value && _self.value.length === 5 ? _self.value + ":00" : _self.value) || "");
				XsltForms_globals.closeAction('XsltForms_input.keyUpIncremental#1');
			}, xf.delay);
	} else {
		XsltForms_globals.openAction("XsltForms_input.keyUpIncremental#2");
		xf.valueChanged((this.type === "time" && this.value && this.value.length === 5 ? this.value + ":00" : this.value) || "");
		XsltForms_globals.closeAction("XsltForms_input.keyUpIncremental#2");
	}
};
XsltForms_input.InputMode = {
	lowerCase : function(value) { return value.toLowerCase(); },
	upperCase : function(value) { return value.toUpperCase(); },
	titleCase : function(value) { return value.charAt(0).toUpperCase() + value.substring(1).toLowerCase(); },
	digits : function(value) {
		if (/^[0-9]*$/.exec(value)) {
			return value;
		}
		alert("Character not valid");
		var digits = "1234567890";
		var newValue = "";
		for (var i = 0, len = value.length; i < len; i++) {
			if (digits.indexOf(value.charAt(i)) !== -1) {
				newValue += value.charAt(i);
			}
		}
		return newValue;
	}
};
function XsltForms_item(subform, id, bindingL, bindingV, copyBinding) {
	XsltForms_globals.counters.item++;
	this.init(subform, id);
	this.controlName = "item";
	if (bindingL || bindingV) {
		this.hasBinding = true;
		this.bindingL = bindingL;
		this.bindingV = bindingV;
		this.copyBinding = copyBinding;
	} else {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	var element = this.element;
	if (element.nodeName.toLowerCase() !== "option") {
		this.input = XsltForms_browser.isXhtml ? element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input")[0] : element.getElementsByTagName("input")[0];
		this.input.name = XsltForms_control.getXFElement(this.element).element.id;
		XsltForms_browser.events.attach(this.input, "focus", XsltForms_control.focusHandler);
		XsltForms_browser.events.attach(this.input, "blur", XsltForms_control.blurHandler);
		this.label = XsltForms_browser.isXhtml ? element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "label")[0] : element.getElementsByTagName("label")[0];
	}
}
XsltForms_item.prototype = new XsltForms_element();
XsltForms_item.prototype.clone = function(id) { 
	return new XsltForms_item(this.subform, id, this.bindingL, this.bindingV, this.copyBinding);
};
XsltForms_item.prototype.dispose = function() {
	this.input = null;
	this.label = null;
	XsltForms_globals.counters.item--;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_item.prototype.build_ = function(ctx) {
	var result, element = this.element;
	var xf = element.parentNode.xfElement;
	if (xf && xf.isRepeat) {
		this.ctx = ctx = element.node;
	} else {
		element.node = ctx;
	}
	if (this.bindingL) {
		result = this.evaluateBinding(this.bindingL, ctx);
		if (typeof result === "object") {
			element.nodeL = result[0];
			element.valueL = null;
			this.depsNodesRefresh.push(element.nodeL);
		} else {
			element.nodeL = null;
			element.valueL = result;
		}
	}
	if (this.bindingV) {
		result = this.evaluateBinding(this.bindingV, ctx);
		if (typeof result === "object") {
			element.nodeV = result[0];
			element.valueV = null;
			this.depsNodesRefresh.push(element.nodeV);
		} else {
			element.nodeV = null;
			element.valueV = result;
		}
	}
	var nodeCopy = this.copyBinding ? this.evaluateBinding(this.copyBinding, ctx)[0] : null;
	if (this.copyBinding && nodeCopy) {
		element.parentNode.parentNode.parentNode.parentNode.xfElement.hasCopy = true;
		this.depsNodesRefresh.push(nodeCopy);
		try {
			element.copy = XsltForms_browser.saveNode(nodeCopy, "application/xml");
		} catch(e3) {
		}
	}
};
XsltForms_item.prototype.refresh = function() {
	var element = this.element;
	XsltForms_browser.setClass(element, "xforms-disabled", false);
	if (element.nodeName.toLowerCase() === "option") {
		if (element.nodeL) {
			try { 
				element.text = XsltForms_browser.getValue(element.nodeL, true);
			} catch(e) {
			}
		} else if (element.valueL) {
			element.text = element.valueL;
		}
		if (element.nodeV) {
			try {
				element.value = XsltForms_browser.getValue(element.nodeV);
			} catch(e2) {
			}
		} else if (element.valueV) {
			element.value = element.valueV;
		}
	} else {
		if (element.nodeL) {
			XsltForms_browser.setValue(this.label, XsltForms_browser.getValue(element.nodeL, true));
		} else if (element.valueL) {
			XsltForms_browser.setValue(this.label, element.valueL);
		}
		if (element.nodeV) {
			this.input.value = XsltForms_browser.getValue(element.nodeV);
		} else if (element.valueV) {
			this.input.value = element.valueV;
		} else if (element.copy) {
			this.input.value = this.input.copy = element.copy;
		}
	}
};
XsltForms_item.prototype.click = function (target) {
	var input = this.input;
	if (input) {
		var xf = XsltForms_control.getXFElement(this.element);
		if (!xf.element.node.readonly && target === input) {
			xf.itemClick(input.value);
		}
	}
};
function XsltForms_itemset(subform, id, nodesetBinding, labelBinding, valueBinding, copyBinding) {
	XsltForms_globals.counters.itemset++;
	this.init(subform, id);
	this.controlName = "itemset";
	this.nodesetBinding = nodesetBinding;
	this.labelBinding = labelBinding;
	this.valueBinding = valueBinding;
	this.copyBinding = copyBinding;
	this.hasBinding = true;
}
XsltForms_itemset.prototype = new XsltForms_element();
XsltForms_itemset.prototype.build_ = function(ctx) {
	if (this.element.getAttribute("cloned")) {
		return;
	}
	this.nodes = this.evaluateBinding(this.nodesetBinding, ctx);
	var next = this.element;
	var parentNode = next.parentNode;
	var l = this.nodes.length;
	var oldNode = next;
	var listeners = next.listeners;
	var cont = 1;
	while (next) {
		next = next.nextSibling;
		if (next) {
			if (next.nodeType === Fleur.Node.ELEMENT_NODE) {
				if (next.getAttribute("cloned")) {
					if (cont >= l) {
						next.listeners = null;
						parentNode.removeChild(next);
						next = oldNode;
					} else {
						next.node = this.nodes[cont];
						this.refresh_(next, cont++);
						oldNode = next;
					}
				}
			} else {
				var n = next.previousSibling;
				next.parentNode.removeChild(next);
				next = n;
			}
		} else {
			for (var i = cont; i < l; i++) {
				var node = this.element.cloneNode(true);
				node.setAttribute("cloned", "true");
				XsltForms_idManager.cloneId(node);
				node.node = this.nodes[i];
				parentNode.appendChild(node);
				this.refresh_(node, i);
				if (listeners && !XsltForms_browser.isIE) {
					for (var j = 0, len = listeners.length; j < len; j++) {
						listeners[j].clone(node);
					}
				}
			}
			break;
		}
	}
	if (l > 0) {
		this.element.node = this.nodes[0];
		this.refresh_(this.element, 0);
	} else {
		this.element.value = "\xA0";
		this.element.text = "\xA0";
	}
};
XsltForms_itemset.prototype.refresh = function() {
	var parentNode = this.element.parentNode;
	var i = 0;
	while (parentNode.childNodes[i] !== this.element) {
		i++;
	}
	for (var j = 0, len = this.nodes.length; j < len || j === 0; j++) {
		XsltForms_browser.setClass(parentNode.childNodes[i+j], "xforms-disabled", this.nodes.length === 0);
	}
};
XsltForms_itemset.prototype.clone = function(id) {
	return new XsltForms_itemset(this.subform, id, this.nodesetBinding, this.labelBinding, this.valueBinding, this.copyBinding);
};
XsltForms_itemset.prototype.dispose = function() {
	XsltForms_globals.counters.itemset--;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_itemset.prototype.refresh_ = function(element, cont) {
	var result, ctx = this.nodes[cont], nodeLabel, nodeValue;
	result = this.evaluateBinding(this.labelBinding, ctx);
	if (typeof result === "object") {
		nodeLabel = result[0];
		this.depsNodesRefresh.push(nodeLabel);
		try {
			element.text = XsltForms_browser.getValue(nodeLabel, true);
		} catch(e) {
		}
	} else {
		element.text = result;
	}
	result = this.valueBinding ? this.evaluateBinding(this.valueBinding, ctx) : null;
	if (this.valueBinding && result) {
		if (typeof result === "object") {
			nodeValue = result[0];
			this.depsNodesRefresh.push(nodeValue);
			try {
				element.value = XsltForms_browser.getValue(nodeValue);
			} catch(e2) {
			}
		} else {
			element.value = result;
		}
	}
	var nodeCopy = this.copyBinding ? this.evaluateBinding(this.copyBinding, ctx)[0] : null;
	if (this.copyBinding && nodeCopy) {
		element.parentNode.parentNode.parentNode.xfElement.hasCopy = true;
		this.depsNodesRefresh.push(nodeCopy);
		try {
			element.value = element.copy = XsltForms_browser.saveNode(nodeCopy, "application/xml");
		} catch(e3) {
		}
	}
};
function XsltForms_label(subform, id, binding) {
	XsltForms_globals.counters.label++;
	this.init(subform, id);
	this.controlName = "label";
	if (binding) {
		this.hasBinding = true;
		this.binding = binding;
	}
}
XsltForms_label.prototype = new XsltForms_element();
XsltForms_label.prototype.clone = function(id) { 
	return new XsltForms_label(this.subform, id, this.binding);
};
XsltForms_label.prototype.dispose = function() {
	XsltForms_globals.counters.label--;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_label.prototype.build_ = function(ctx) {
	var nodes = this.evaluateBinding(this.binding, ctx);
	this.element.node = nodes[0];
	this.depsNodesRefresh.push(nodes[0]);
};
XsltForms_label.prototype.refresh = function() {
	var node = this.element.node;
	var value = node? XsltForms_browser.getValue(node, true) : "";
	XsltForms_browser.setValue(this.element.getAttributeNode("label") ? this.element.getAttributeNode("label") : this.element, value);
};
function XsltForms_output(subform, id, valoff, binding, mediatype) {
	XsltForms_globals.counters.output++;
	this.init(subform, id);
	this.controlName = "output";
	this.valoff = valoff;
	var children = this.element.children || this.element.childNodes;
	if (children.length !== 0) {
		var cells = children;
		this.valueElement = cells[valoff];
	} else {
		this.valueElement = this.element;
	}
	var valuechildren = this.valueElement.children || this.valueElement.childNodes;
	if (valuechildren.length !== 0) {
		this.valueElement = valuechildren[0];
	}
	this.hasBinding = true;
	this.binding = binding;
	this.mediatype = mediatype;
	this.complex = mediatype === "application/xhtml+xml";
	this.isOutput = true;
	if (this.binding && this.binding.type) {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
}
XsltForms_output.prototype = new XsltForms_control();
XsltForms_output.prototype.clone = function(id) { 
	return new XsltForms_output(this.subform, id, this.valoff, this.binding, this.mediatype);
};
XsltForms_output.prototype.dispose = function() {
	this.valueElement = null;
	XsltForms_globals.counters.output--;
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_output.prototype.setValue = function(value) {
	var element = this.valueElement;
	var mediatype = this.mediatype;
	var i, li;
	if (mediatype && mediatype.bind_evaluate) {
		mediatype = XsltForms_globals.stringValue(mediatype.bind_evaluate(this.subform, this.boundnodes[0]));
	}
	if (!mediatype || mediatype.indexOf("image/") !== 0 || mediatype === "image/svg+xml") {
		if (element.nodeName.toLowerCase() === "img") {
			var spanelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "span") : document.createElement("span");
			i = 0;
			li = element.attributes.length;
			while (i < li) {
				spanelt.setAttribute(element.attributes[i].name, element.attributes[i].value);
				i++;
			}
			element.parentNode.replaceChild(spanelt, element);
			element = spanelt;
		}
		if (element.nodeName.toLowerCase() === "span" || element.nodeName.toLowerCase() === "tspan" || element.nodeName.toLowerCase() === "label") {
			if (mediatype === "application/xhtml+xml") {
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
				if (value) {
					element.innerHTML = value;
				}
			} else if (mediatype === "image/svg+xml") {
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
				if (XsltForms_browser.isIE && !XsltForms_browser.isIE9) {
					var xamlScript = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
					xamlScript.setAttribute("type", "text/xaml");
					xamlScript.setAttribute("id", this.element.id+"-xaml");
					xamlScript.text = XsltForms_browser.transformText(value, XsltForms_browser.ROOT + "svg2xaml.xsl", false, "width", element.currentStyle.width, "height", element.currentStyle.height);
					element.appendChild(xamlScript);
					var xamlObject = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "object") : document.createElement("object");
					xamlObject.setAttribute("width", element.currentStyle.width+"px");
					xamlObject.setAttribute("height", element.currentStyle.height+"px");
					xamlObject.setAttribute("type", "application/x-silverlight");
					xamlObject.setAttribute("style", "min-width: " + element.currentStyle.width+"px");
					var xamlParamSource = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "param") : document.createElement("param");
					xamlParamSource.setAttribute("name", "source");
					xamlParamSource.setAttribute("value", "#"+this.element.id+"-xaml");
					xamlObject.appendChild(xamlParamSource);
					var xamlParamOnload = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "param") : document.createElement("param");
					xamlParamOnload.setAttribute("name", "onload");
					xamlParamOnload.setAttribute("value", "onLoaded");
					xamlObject.appendChild(xamlParamOnload);
					var xamlParamIswindowless = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "param") : document.createElement("param");
					xamlParamIswindowless.setAttribute("name", "iswindowless");
					xamlParamIswindowless.setAttribute("value", "true");
					xamlObject.appendChild(xamlParamIswindowless);
					element.appendChild(xamlObject);
				} else if (XsltForms_browser.isXhtml) {
					var cs = window.getComputedStyle(element, null);
					XDocument.parse(value, element);
					element.firstChild.setAttribute("width", cs.getPropertyValue("min-width"));
					element.firstChild.setAttribute("height", cs.getPropertyValue("min-height"));
				} else {
					var svgObject = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "object") : document.createElement("object");
					svgObject.setAttribute("type", "image/svg+xml");
					svgObject.setAttribute("data", "data:image/svg+xml,"+ value);
					element.appendChild(svgObject);
				}
			} else {
				XsltForms_browser.setValue(element, value);
			}
		} else {
			XsltForms_browser.setValue(element, value);
		}
	} else {
		if (element.nodeName.toLowerCase() === "span" || element.nodeName.toLowerCase() === "tspan" || element.nodeName.toLowerCase() === "label") {
			var imgelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "img") : document.createElement("img");
			i = 0;
			li = element.attributes.length;
			while (i < li) {
				imgelt.setAttribute(element.attributes[i].name, element.attributes[i].value);
				i++;
			}
			element.parentNode.replaceChild(imgelt, element);
			element = imgelt;
		}
		element.src = value;
	}
};
XsltForms_output.prototype.getValue = function(format) {
	var element = this.valueElement;
	if (element.nodeName.toLowerCase() === "span") {
		return XsltForms_browser.getValue(element, format);
	}
	var value = element.src;
	if (value && format && element.type.format) {
		try { 
			value = element.type.format(value);
		} catch(e) { 
		}
	}
	return value;
};
function XsltForms_range(subform, id, valoff, binding, incremental, start, end, step, aidButton, clone) {
	XsltForms_globals.counters.upload++;
	this.init(subform, id);
	this.controlName = "range";
	this.binding = binding;
	this.incremental = incremental;
	var cells = this.element.children;
	this.valoff = valoff;
	this.cell = cells[valoff];
	this.rail = this.cell.children[0].children[0];
	this.cursor = this.rail.children[0];
	this.outputvalue = this.cell.children[0].children[1];
	this.isClone = clone;
	this.hasBinding = true;
	this.bolAidButton = aidButton;
	this.start = parseFloat(start);
	this.end = parseFloat(end);
	this.step = parseFloat(step);
	this.value = "";
	this.initFocus(this.cell.children[0], true);
	XsltForms_browser.events.attach(this.rail, "focus", function(evt) {
		var target = XsltForms_browser.events.getTarget(evt);
		var parentNode = target;
		while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			var xf = parentNode.xfElement;
			if (xf) {
				alert("rail_focus "+xf.element.id);
				break;
			}
			parentNode = parentNode.parentNode;
		}
	} );
	XsltForms_browser.events.attach(this.rail, "mousedown", function(evt) {
		var target = XsltForms_browser.events.getTarget(evt);
		var parentNode = target;
		while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
			var xf = parent.xfElement;
			if (xf) {
				var newPos = XsltForms_browser.getEventPos(evt).x + (window.pageLeft !== undefined ? window.pageLeft : (document.documentElement && document.documentElement.scrollLeft !== undefined) ? document.documentElement.scrollLeft : document.body.scrollLeft);
				parentNode = xf.rail;
				while (parentNode) {
					newPos -= parentNode.offsetLeft;
					parentNode = parentNode.offsetParent;
				}
				var node = xf.element.node;
				var value = Math.round(newPos / xf.rail.clientWidth * (xf.end - xf.start) / xf.step) * xf.step + xf.start;
				var f = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").format;
				if (f) {
					value = f(value);
				}
				xf.setValue(value);
				if (xf.incremental) {
					XsltForms_globals.openAction("XsltForms_range#1");
					xf.valueChanged(xf.value + "");
					XsltForms_globals.closeAction("XsltForms_range#1");
				}
				if (!document.activeElement || !document.activeElement !== xf.cursor) {
					xf.cursor.focus();
				}
				break;
			}
			parentNode = parentNode.parentNode;
		}
	} );
	XsltForms_browser.events.attach(this.cursor, "mousedown", function(evt) {
		var target0 = XsltForms_browser.events.getTarget(evt);
		var parentNode0 = target0;
		while (parentNode0 && parentNode0.nodeType === Fleur.Node.ELEMENT_NODE) {
			var xf0 = parentNode0.xfElement;
			if (xf0) {
				xf0.offset = XsltForms_browser.getEventPos(evt).x + (window.pageLeft !== undefined ? window.pageLeft : (document.documentElement && document.documentElement.scrollLeft !== undefined) ? document.documentElement.scrollLeft : document.body.scrollLeft);
				parentNode0 = xf0.cursor;
				while (parentNode0) {
					xf0.offset -= parentNode0.offsetLeft;
					parentNode0 = parentNode0.offsetParent;
				}
				document.onmousemove = function(evt) {
					var target = XsltForms_browser.isIE ? document.activeElement : XsltForms_browser.events.getTarget(evt);
					var parentNode = target;
					while (parentNode && parentNode.nodeType === Fleur.Node.ELEMENT_NODE) {
						var xf = parentNode.xfElement;
						if (xf) {
							var newPos = XsltForms_browser.getEventPos(evt).x - xf.offset + (window.pageLeft !== undefined ? window.pageLeft : (document.documentElement && document.documentElement.scrollLeft !== undefined) ? document.documentElement.scrollLeft : document.body.scrollLeft);
							parentNode = xf.rail;
							while (parentNode) {
								newPos -= parentNode.offsetLeft;
								parentNode = parentNode.offsetParent;
							}
							var node = xf.element.node;
							var value = Math.round(newPos / xf.rail.clientWidth * (xf.end - xf.start) / xf.step) * xf.step + xf.start;
							value = Math.min(Math.max(value, xf.start), xf.end);
							var f = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").format;
							if (f) {
								value = f(value);
							}
							xf.setValue(value);
							if (xf.incremental) {
								XsltForms_globals.openAction("XsltForms_range#2");
								xf.valueChanged(xf.value + "");
								XsltForms_globals.closeAction("XsltForms_range#2");
							}
							if (!document.activeElement || !document.activeElement !== xf.cursor) {
								xf.cursor.focus();
							}
							break;
						}
						parentNode = parentNode.parentNode;
					}
				};
				document.onmouseup = function() {
					document.onmousemove = null;
					document.onmouseup = null;
				};
				if (!document.activeElement || !document.activeElement !== xf0.cursor) {
					xf0.cursor.focus();
				}
				break;
			}
			parentNode0 = parentNode0.parentNode;
		}
		if (typeof evt.stopPropagation === "function") {
			evt.stopPropagation();
		}
		else if (typeof evt.cancelBubble !== "undefined") {
			evt.cancelBubble = true;	
		}
		if (evt.preventDefault) {
			evt.preventDefault();
		}
	} );
	if (aidButton) {
		this.aidButton = cells[valoff + 1].children[0];
		this.initFocus(this.aidButton);
	}
}
XsltForms_range.prototype = new XsltForms_control();
XsltForms_range.prototype.clone = function(id) { 
	return new XsltForms_range(this.subform, id, this.valoff, this.binding, this.incremental, this.start, this.end, this.step, this.bolAidButton, true);
};
XsltForms_range.prototype.dispose = function() {
	this.cell = null;
	XsltForms_globals.counters.range--;
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_range.prototype.setValue = function(value) {
	this.outputvalue.innerHTML = value;
	var node = this.element.node;
	var f = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string").parse;
	if (f) {
		value = f(value);
	}
	if (this.value !== value) {
		this.value = value;
		this.cursor.style.left = Math.round(this.rail.clientWidth * (this.value - this.start) / (this.end - this.start)) + "px";
	}
};
XsltForms_range.prototype.blur = function(target) {
	XsltForms_globals.focus = null;
	if (!this.incremental) {
		XsltForms_browser.assert(this.input, this.element.id);
		this.valueChanged(this.value);
	}
};
function XsltForms_repeat(subform, id, nbsiblings, binding) {
	XsltForms_globals.counters.repeat++;
	this.init(subform, id);
	this.controlName = "repeat";
	this.nbsiblings = nbsiblings;
	this.binding = binding;
	this.index = 1;
	var el = this.element;
	this.isRepeat = true;
	this.hasBinding = true;
	this.root = XsltForms_browser.hasClass(el, "xforms-control")? el.lastChild : el;
	this.isItemset = XsltForms_browser.hasClass(el, "xforms-itemset");
}
XsltForms_repeat.prototype = new XsltForms_element();
XsltForms_repeat.prototype.dispose = function() {
	this.root = null;
	XsltForms_globals.counters.repeat--;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_repeat.prototype.setIndex = function(index) {
	if (this.nodes.length === 0) {
		this.index = 0;
	} else if (this.index !== index) {
		var node = this.nodes[index - 1];
		if (node) {    
			XsltForms_globals.openAction("XsltForms_repeat.prototype.setIndex");
			this.index = index;
			this.element.node = node;
			XsltForms_globals.addChange(this);
			XsltForms_globals.addChange(document.getElementById(XsltForms_browser.getDocMeta(node.ownerDocument, "model")).xfElement);
			XsltForms_globals.closeAction("XsltForms_repeat.prototype.setIndex");
		}
	}
};
XsltForms_repeat.prototype.deleteNode = function(node) {
	var newNodes = [];
	var nodes = this.nodes;
	for (var i = 0, len = nodes.length; i < len; i++) {
		if (node !== nodes[i]) {
			newNodes.push(nodes[i]);
		}
	}
	this.nodes = newNodes;
	this.setIndex(this.index === nodes.length? this.index - 1 : this.index);
};
XsltForms_repeat.prototype.insertNode = function(node, nodeAfter) {
	var nodes = this.nodes;
	if (nodeAfter) {
		var newNodes = [];
		var index = 1;
		for (var i = 0, len = nodes.length; i < len; i++) {
			if (nodeAfter === nodes[i]) {
				newNodes.push(node);
				index = i + 1;
			}
			newNodes.push(nodes[i]);
		}
		this.nodes = newNodes;
		this.setIndex(index);
	} else {
		nodes.push(node);
		this.setIndex(nodes.length);
	}
};
XsltForms_repeat.prototype.build_ = function(ctx) {
	var nodes0 = this.evaluateBinding(this.binding, ctx);
	var nodes = [];
	var r0, r, l, child;
	for (var n = 0, ln = nodes0.length; n < ln; n++) {
		if (!XsltForms_browser.getBoolMeta(nodes0[n], "notrelevant")) {
			nodes.push(nodes0[n]);
		}
	}
	var inputids = {ids: {}, fors: {}};
	this.nodes = nodes;
	n = nodes.length;
	if (this.nbsiblings === 0) {
		r = this.root;
		while (r.firstChild.nodeType === Fleur.Node.TEXT_NODE) {
			r.removeChild(r.firstChild);
		}
		r0 = r.children ? r.children[0] : r.childNodes[0];
		XsltForms_repeat.forceOldId(r0);
		l = r.children ? r.children.length : r.childNodes.length;
		for (var i = l; i < n; i++) {
			child = r0.cloneNode(true);
			r.appendChild(child);
			XsltForms_repeat.initClone(child, inputids);
		}
		for (var j = n; j < l && r.childNodes.length > 1; j++) {
			XsltForms_globals.dispose(r.lastChild);
			r.removeChild(r.lastChild);
		}
		for (var k = 0; k < n; k++) {
			XsltForms_browser.setMeta(nodes[k], "repeat", this.element.id);
			if (r.children) {
				r.children[k].node = nodes[k];
			} else {
				r.childNodes[k].node = nodes[k];
			}
		}
	} else {
		r0 = this.root;
		XsltForms_repeat.forceOldId(r0);
		r = r0.parentNode;
		var cc = r.firstChild;
		var i0 = 0;
		while (cc) {
			if (cc === r0) {
				break;
			}
			i0++;
			cc = cc.nextSibling;
		}
		l = 1;
		var rl = r.childNodes[i0 + this.nbsiblings];
		while (rl && (rl.id === this.element.id || rl.attributes.oldid.value === this.element.id)) {
			l++;
			rl = r.childNodes[i0 + l*this.nbsiblings];
		}
		for (var ib = l; ib < n; ib++) {
			child = r0.cloneNode(true);
			r.insertBefore(child, rl);
			XsltForms_repeat.initClone(child, inputids);
			delete child.xfElement;
			var r0s = r0.nextSibling;
			for (var isb = 1; isb < this.nbsiblings; isb++, r0s = r0s.nextSibling) {
				child = r0s.cloneNode(true);
				r.insertBefore(child, rl);
				XsltForms_repeat.initClone(child, inputids);
			}
		}
		for (var jb = n; jb < l; jb++) {
			var rj = r.childNodes[i0 + (n+1)*this.nbsiblings];
			if (!(rj && (rj.id === this.element.id || rj.attributes.oldid.value === this.element.id))) {
				break;
			}
			for (var jsb = 0; jsb < this.nbsiblings; jsb++) {
				XsltForms_globals.dispose(r.children[i0 + n*this.nbsiblings]);
				r.removeChild(r.children[i0 + n*this.nbsiblings]);
			}
		}
		for (var kb = 0; kb < n; kb++) {
			XsltForms_browser.setMeta(nodes[k], "repeat", this.element.id);
			if (r.children) {
				r.children[i0 + kb*this.nbsiblings].node = nodes[kb];
			} else {
				r.childNodes[i0 + kb*this.nbsiblings].node = nodes[kb];
			}
		}
	}
	for (var ii = 0; ii < n; ii++) {
		if (this.element.node === nodes[ii]) {
			if (this.index !== ii + 1) {
				this.index = ii + 1;
				XsltForms_globals.addChange(this);
				XsltForms_globals.addChange(this.element.node.ownerDocument.model);
			}
			return;
		}
	}
	this.element.node = nodes[0];
	if (this.element.node) {
		if (this.index !== 1) {
			this.index = 1;
			XsltForms_globals.addChange(this);
			XsltForms_globals.addChange(this.element.node.ownerDocument.model);
		}
	} else {
		this.index = 0;
		if (XsltForms_globals.ready) {
			XsltForms_globals.addChange(this);
		}
	}
};
XsltForms_repeat.prototype.refresh = function(selected) {
	var empty = this.nodes.length === 0;
	if (this.nbsiblings !== 0) {
		var n0 = this.element;
		for (var i0 = 0, l0 = this.nodes.length; i0 < l0; i0++) {
			XsltForms_browser.setClass(n0, "xforms-disabled", empty);
			for (var i1 = 0, l1 = this.nbsiblings; i1 < l1; i1++) {
				n0 = n0.nextSibling;
			}
		}
	}
	XsltForms_browser.setClass(this.element, "xforms-disabled", empty);
	if (!empty && !this.isItemset) {
		if (this.nbsiblings === 0) {
			var childs = this.root.children || this.root.childNodes;
			for (var i = 0, len = childs.length; i < len; i++) {
				var sel = selected && (this.index === i + 1);
				childs[i].selected = sel;
				XsltForms_browser.setClass(childs[i], "xforms-repeat-item-selected", sel);
			}
		}
	}
};
XsltForms_repeat.prototype.clone = function(id) { 
	return new XsltForms_repeat(this.subform, id, this.nbsiblings, this.binding, true);
};
XsltForms_repeat.initClone = function(element, inputids) {
	if ("LABEL" === element.nodeName.toUpperCase() && element.getAttribute("for") !== "") {
		if (inputids.ids[element.getAttribute("for")]) {
			element.setAttribute("for", inputids.ids[element.getAttribute("for")]);
		} else {
			inputids.fors[element.getAttribute("for")] = element;
		}
	}
	var id = element.id;
	if (id) {
		XsltForms_idManager.cloneId(element);
		if ("INPUT" === element.nodeName.toUpperCase()) {
			if (inputids.fors[id]) {
				inputids.fors[id].setAttribute("for", element.id);
				delete inputids.ids[id];
			} else {
				inputids.ids[id] = element.id;
			}
		}
		element.xfElement = null;
		var oldid = element.getAttribute("oldid");
		var original = document.getElementById(oldid);
		if (!original) {
			original = XsltForms_globals.idalt[oldid];
		}
		var xf = original.xfElement;
		if (xf) {
			if (xf instanceof Array) {
				for (var ixf = 0, lenxf = xf.length; ixf < lenxf; ixf++) {
					xf[ixf].clone(element.id);
				}
			} else {
				xf.clone(element.id);
			}
		}
		var listeners = original.listeners;
		if (listeners && (!XsltForms_browser.isIE || XsltForms_browser.isIE9)) {
			for (var i = 0, len = listeners.length; i < len; i++) {
				listeners[i].clone(element);
			}
		}
	}
	var parentXF = element.parentNode.xfElement;
	if (parentXF && parentXF.isComponent && parentXF.valueElement === element) {
		if (parentXF.evaljs) {
			eval(parentXF.subjs);
			parentXF.evaljs = false;
		}
		return;
	}
	var next = element.firstChild;
	while (next) {
		var child = next;
		next = next.nextSibling;
		if (child.id && child.getAttribute("cloned")) {
			element.removeChild(child);
		} else {
			XsltForms_repeat.initClone(child, inputids);
		}
	}
};
XsltForms_repeat.forceOldId = function(element) {
	var id = element.id;
	if (id) {
		if (id.substr(0, 8) === "clonedId") {
			return;
		}
		element.setAttribute("oldid", id);
	}
	var next = element.firstChild;
	while (next) {
		var child = next;
		next = next.nextSibling;
		XsltForms_repeat.forceOldId(child);
	}
};
XsltForms_repeat.selectItem = function(element) {
	var par = element.parentNode;
	if (par) {
		var repeat = par.xfElement? par : par.parentNode;
		if (repeat.xfElement) {
			var childs = par.children;
			XsltForms_browser.assert(repeat.xfElement, element.nodeName +  " - " + repeat.nodeName);
			for (var i = 0, len = childs.length; i < len; i++) {
				if (childs[i] === element) {
					repeat.xfElement.setIndex(i + 1);
					break;
				}
			}
		} else {
			var n = element;
			var d = 1;
			while (n && !n.xfElement) {
				n = n.previousSibling;
				d++;
			}
			if (n && n.xfElement && n.xfElement.nbsiblings > 0) {
				n.xfElement.setIndex(d / n.xfElement.nbsiblings);
			}
		}
	}
};
function XsltForms_select(subform, id, min, max, full, binding, incremental, clone) {
	XsltForms_globals.counters.select++;
	this.init(subform, id);
	this.controlName = max === 1 ? "select1": "select";
	this.binding = binding;
	this.min = min;
	this.max = max;
	this.full = full;
	this.incremental = incremental;
	this.isClone = clone;
	this.hasBinding = true;
	this.outRange = false;
	if (!this.full) {
		this.select = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "select")[0] : this.element.getElementsByTagName("select")[0];
		this.initFocus(this.select);
		if (incremental) {
			XsltForms_browser.events.attach(this.select, "change", XsltForms_select.incrementalChange);
			XsltForms_browser.events.attach(this.select, "keyup", XsltForms_select.incrementalChangeKeyup);
		} else {
			XsltForms_browser.events.attach(this.select, "change", XsltForms_select.normalChange);
		}
	}
}
XsltForms_select.prototype = new XsltForms_control();
XsltForms_select.prototype.clone = function(id) { 
	return new XsltForms_select(this.subform, id, this.min, this.max, this.full, this.binding, this.incremental, true);
};
XsltForms_select.prototype.dispose = function() {
	this.select = null;
	this.selectedOptions = null;
	XsltForms_globals.counters.select--;
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_select.prototype.focusFirst = function() {
	var input = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input")[0] : this.element.getElementsByTagName("input")[0];
	input.focus();
	if (XsltForms_browser.isOpera) {
		input.focus();
	}
};
XsltForms_select.prototype.setValue = function(value) {
	var optvalue, empty;
	if (this.select && this.select.options.length === 1 && this.select.options[0] && this.select.options[0].value === "\xA0") {
		this.currentValue = null;
	}
	if (!this.full && (!value || value === "")) {
		this.selectedOptions = [];
		if (this.select.options[0] && this.select.options[0].value !== "\xA0") {
			empty = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "option") : document.createElement("option");
			empty.value = "\xA0";
			empty.text = "\xA0";
			empty.id = "";
			if (this.select.children[0]) {
				this.select.insertBefore(empty, this.select.children[0]);
			} else {
				this.select.appendChild(empty);
			}
			this.select.selectedIndex = 0;
		}
	} else {
		if (!this.full && this.min === 0 && this.select.options[0] && this.select.options[0].value !== "\xA0") {
			empty = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "option") : document.createElement("option");
			empty.value = "\xA0";
			empty.text = "\xA0";
			empty.id = "";
			if (this.select.children[0]) {
				this.select.insertBefore(empty, this.select.children[0]);
			} else {
				this.select.appendChild(empty);
			}
		}
		if (!this.full && this.select.firstChild && this.select.firstChild.value === "\xA0" && !(this.min === 0 && this.max === 1)) {
			this.select.remove(0);
		}
		var vals = value ? value instanceof Array ? value : (this.max !== 1? value.split(XsltForms_globals.valuesSeparator) : [value]) : [""];
		var list = this.full ? (XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input") : this.element.getElementsByTagName("input")) : this.select.options;
		var well = true;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(this.element.node) || "xsd_:string");
		for (var i = 0, len = vals.length; well && i < len; i++) {
			var val = vals[i];
			var found = false;
			for (var j = 0, len1 = list.length; !found && j < len1; j++) {
				optvalue = list[j].value;
				if (schtyp.format) {
					try { optvalue = schtyp.format(optvalue); } catch(e) { }
				}
				if (optvalue === val) {
					found = true;
				}
			}
			well = found;
		}
		if (well || (this.max !== 1 && !value)) {
			if (this.outRange) {
				this.outRange = false;
				XsltForms_xmlevents.dispatch(this, "xforms-in-range");
			}
		} else if ((this.max === 1 || value) && !this.outRange) {
			this.outRange = true;
			XsltForms_xmlevents.dispatch(this, "xforms-out-of-range");
		}
		vals = this.max !== 1? vals : [vals[0]];
		var item;
		if (this.full) {
			for (var n = 0, len2 = list.length; n < len2; n++) {
				item = list[n];
				item.checked = item.value !== "" ? XsltForms_browser.inArray(item.value, vals) : false;
			}
		} else {
			this.selectedOptions = [];
			for (var k = 0, len3 = list.length; k < len3; k++) {
				item = list[k];
				optvalue = item.value;
				if (schtyp.format) {
					try { optvalue = schtyp.format(optvalue); } catch(e) { }
				}
				var b = XsltForms_browser.inArray(optvalue, vals);
				if (b) {
					this.selectedOptions.push(item);
				}
				try {
					item.selected = b;
				} catch(e) {
				}
			}
		}
	}
};
XsltForms_select.prototype.changeReadonly = function() {
	if (this.full) {
		var list = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input") : this.element.getElementsByTagName("input");
		for (var i = 0, len = list.length; i < len; i++) {
			list[i].disabled = this.readonly;
		}
	} else {
		if (!XsltForms_browser.dialog.knownSelect(this.select)) {
			this.select.disabled = this.readonly;
		}
	}
};
XsltForms_select.prototype.itemClick = function(value) {
	var inputs = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "input") : this.element.getElementsByTagName("input");
	var input;
	XsltForms_globals.openAction("XsltForms_select.prototype.itemClick");
	var newValue = "";
	if (this.max !== 1) {
		for (var i = 0, len = inputs.length; i < len; i++) {
			input = inputs[i];
			if (input.copy && newValue === "") {
				newValue = [];
			}
			if (input.value === value) {
				XsltForms_xmlevents.dispatch(input.parentNode, input.checked? "xforms-select" : "xforms-deselect");
			}
			if (input.checked) {
				if (input.copy) {
					newValue.push(input.value);
				} else {
					newValue = (newValue !== "" ? newValue + XsltForms_globals.valuesSeparator : "") + input.value;
				}
			}
		}
	} else {
		var old = this.value;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(this.element.node) || "xsd_:string");
		if (!old) {
			old = XsltForms_browser.getValue(this.element.node);
			if (schtyp.format) {
				try { old = schtyp.format(old); } catch(e) { }
			}
		}
		var inputSelected = null;
		if (old === value && this.min !== 0) {
			XsltForms_globals.closeAction("XsltForms_select.prototype.itemClick");
			return;
		}
		for (var j = 0, len1 = inputs.length; j < len1; j++) {
			input = inputs[j];
			var input_controlvalue = input.value;
			if (schtyp.format) {
				try { input_controlvalue = schtyp.format(input_controlvalue); } catch(e) { }
			}
			input.checked = input_controlvalue === value;
			if (input_controlvalue === old) {
				if (input.checked && this.min === 0) {
					input.checked = false;
					newValue = input.copy ? [] : "";
				}
				XsltForms_xmlevents.dispatch(input.parentNode, "xforms-deselect");
			} else if (input_controlvalue === value) {
				inputSelected = input;
				newValue = input.copy ? [value] : value;
			}
		}
		if (inputSelected) {
			XsltForms_xmlevents.dispatch(inputSelected.parentNode, "xforms-select");
		}
	}
	value = newValue;
	if (this.incremental) {
		this.valueChanged(this.value = value || "");
	} else {
		this.value = value || "";
	}
	XsltForms_globals.closeAction("XsltForms_select.prototype.itemClick");
};
XsltForms_select.prototype.blur = function(evt) {
	if (this.value) {
		XsltForms_globals.openAction("XsltForms_select.prototype.blur");
		this.valueChanged(this.value);
		XsltForms_globals.closeAction("XsltForms_select.prototype.blur");
		this.value = null;
	}
};
XsltForms_select.normalChange = function(evt) {
	var xf = XsltForms_control.getXFElement(this);
	var news = [];
	var value = "";
	var copy = [];
	var old = xf.getSelected();
	var opts = this.options;
	XsltForms_globals.openAction("XsltForms_select.normalChange");
	for (var i = 0, len = old.length; i < len; i++) {
		if (old[i].selected) {
			news.push(old[i]);
		} else {
			XsltForms_xmlevents.dispatch(old[i], "xforms-deselect");
		}
	}
	var opt;
	for (var j = 0, len1 = opts.length; j < len1; j++) {
		opt = opts[j];
		if (opt.selected) {
			if (opt.copy) {
				copy.push(opt.copy);
			} else if (opt.value !== "\xA0") {
				value = value? value + XsltForms_globals.valuesSeparator + opt.value : opt.value;
			}
		}
	}
	for (var k = 0, len2 = opts.length; k < len2; k++) {
		opt = opts[k];
		if (opt.selected && opt.value !== "\xA0") {
			if (!XsltForms_browser.inArray(opt, news)) {
				news.push(opt);
				XsltForms_xmlevents.dispatch(opt, "xforms-select");
			}
		}
	}
	if (copy.length === 0) {
		xf.value = value;
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(xf.element.node) || "xsd_:string");
		if (schtyp.format) {
			try { xf.value = schtyp.format(value); } catch(e) { }
		}
	} else {
		xf.value = copy;
	}
	xf.selectedOptions = news;
	XsltForms_globals.closeAction("XsltForms_select.normalChange");
};
XsltForms_select.incrementalChange = function(evt) {
	var xf = XsltForms_control.getXFElement(this);
	XsltForms_globals.openAction("XsltForms_select.incrementalChange");
	XsltForms_select.normalChange.call(this, evt);
	xf.valueChanged(xf.value);
	XsltForms_globals.closeAction("XsltForms_select.incrementalChange");
};
XsltForms_select.incrementalChangeKeyup = function(evt) {
	if (evt.keyCode !== 9 && evt.keyCode !== 17) {
		var xf = XsltForms_control.getXFElement(this);
		XsltForms_globals.openAction("XsltForms_select.incrementalChangeKeyup");
		XsltForms_select.normalChange.call(this, evt);
		xf.valueChanged(xf.value);
		XsltForms_globals.closeAction("XsltForms_select.incrementalChangeKeyup");
	}
};
XsltForms_select.prototype.getSelected = function() {
	var s = this.selectedOptions;
	if (!s) {
		s = [];
		var opts = this.select.options;
		for (var i = 0, len = opts.length; i < len; i++) {
			if (opts[i].selected) {
				s.push(opts[i]);
			}
		}
	}
	return s;
};
function XsltForms_trigger(subform, id, binding) {
	XsltForms_globals.counters.trigger++;
	this.init(subform, id);
	this.controlName = "trigger";
	this.binding = binding;
	this.hasBinding = !!binding;
	if(!this.hasBinding) {
		XsltForms_browser.setClass(this.element, "xforms-disabled", false);
	}
	this.isTrigger = true;
	var anchor = XsltForms_browser.isXhtml ? this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "a")[0] : this.element.getElementsByTagName("a")[0];
	if (anchor !== null && typeof anchor !== "undefined") {
		if (!anchor.hasAttribute("href")) {
			anchor.setAttribute("href", "#/");
		}
	}
	var button = XsltForms_browser.isXhtml ? (this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "a")[0] || this.element.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "button")[0]) : (this.element.getElementsByTagName("a")[0] || this.element.getElementsByTagName("button")[0]);
	this.input = button;
	this.initFocus(button);
}
XsltForms_trigger.prototype = new XsltForms_control();
XsltForms_trigger.prototype.setValue = function () { };
XsltForms_trigger.prototype.changeReadonly = function() {
	this.input.disabled = this.readonly;
};
XsltForms_trigger.prototype.clone = function (id) {
	return new XsltForms_trigger(this.subform, id, this.binding, true);
};
XsltForms_trigger.prototype.dispose = function() {
	XsltForms_globals.counters.trigger--;
	XsltForms_element.prototype.dispose.call(this);
};
XsltForms_trigger.prototype.click = function (target, evcontext) {
	XsltForms_globals.openAction("XsltForms_trigger.prototype.click");
	XsltForms_xmlevents.dispatch(this, "DOMActivate", null, null, null, null, evcontext);
	XsltForms_globals.closeAction("XsltForms_trigger.prototype.click");
};
XsltForms_trigger.prototype.blur = function () { };
function XsltForms_upload(subform, id, valoff, binding, incremental, filename, mediatype, aidButton, clone) {
	XsltForms_globals.counters.upload++;
	this.init(subform, id);
	this.controlName = "upload";
	this.binding = binding;
	this.incremental = incremental;
	this.filename = filename;
	var cells = this.element.children;
	this.valoff = valoff;
	this.cell = cells[valoff];
	this.input = this.cell.children[0];
	this.isClone = clone;
	this.hasBinding = true;
	this.bolAidButton = aidButton;
	this.mediatype = mediatype;
	this.value = "";
	this.headers = [];
	this.initFocus(this.input, true);
	if (!window.FileReader && !(document.applets.xsltforms || document.getElementById("xsltforms_applet"))) {
		XsltForms_browser.loadapplet();
	}
	if (aidButton) {
		this.aidButton = cells[valoff + 1].children[0];
		this.initFocus(this.aidButton);
	}
}
XsltForms_upload.prototype = new XsltForms_control();
XsltForms_upload.contents = {};
XsltForms_upload.prototype.resource = function(resource) {
	this.resource = resource;
	return this;
};
XsltForms_upload.prototype.header = function(nodeset, combine, fname, values) {
	this.headers.push({nodeset: nodeset, combine: combine, name: fname, values: values});
	return this;
};
XsltForms_upload.prototype.clone = function(id) { 
	return new XsltForms_upload(this.subform, id, this.valoff, this.binding, this.incremental, this.filename, this.mediatype, this.bolAidButton, true);
};
XsltForms_upload.prototype.dispose = function() {
	this.cell = null;
	XsltForms_globals.counters.upload--;
	XsltForms_control.prototype.dispose.call(this);
};
XsltForms_upload.prototype.setValue = function(value) {
	var node = this.element.node;
	this.type = node ? XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string") : XsltForms_schema.getType("xsd_:string");
	if (this.value !== value) {
		this.value = value || "";
		if (this.input.parentElement.nodeName.toLowerCase() === "form") {
			this.input.form.reset();
		}
	}
	if (this.resource && typeof plupload !== "undefined") {
		if (!this.uploader) {
			var upsettings = {};
			eval("upsettings = " + (this.type.appinfo ? this.type.appinfo.replace(/(\r\n|\n|\r)/gm, " ") : "{}"));
			upsettings.url = "dummy";
			upsettings.init = {
				PostInit: function() {
					var uploadctl = XsltForms_control.getXFElement(this.getOption("browse_button")[0]);
					if (uploadctl.uploadbtn) {
						uploadctl.uploadbtn.disabled = true;
						uploadctl.uploadbtn.onclick = function() {
							var uploadctl1 = XsltForms_control.getXFElement(this);
							uploadctl1.uploader.start();
							return false;
						};
					}
				},
				FileFiltered: function(up, file) {
					var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
					if ((" " + uploadctl.value + " ").indexOf(" " + file.name + " ") === -1) {
						if (uploadctl.value !== "") {
							uploadctl.value = uploadctl.value + " " + file.name;
						} else {
							uploadctl.value = file.name;
						}
						if (uploadctl.incremental) {
							uploadctl.valueChanged(uploadctl.value);
						}
					}
					if (uploadctl.uploadbtn) {
						uploadctl.uploadbtn.disabled = false;
					}
				},
				BeforeUpload: function(up) {
					var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
					var resource;
					if (uploadctl.resource.bind_evaluate) {
						resource = XsltForms_globals.stringValue(uploadctl.resource.bind_evaluate(uploadctl.subform, uploadctl.boundnodes[0]));
					} else {
						resource = uploadctl.resource;
					}
					up.setOption("url", resource);
					var len = uploadctl.headers.length;
					if (len !== 0) {
						var upheaders = {};
						for (var i = 0, len0 = uploadctl.headers.length; i < len0; i++) {
							var nodes = [];
							if (uploadctl.headers[i].nodeset) {
								nodes = uploadctl.headers[i].nodeset.bind_evaluate(uploadctl.subform, uploadctl.boundnodes[0]);
							} else {
								nodes = uploadctl.boundnodes;
							}
							var hname;
							for (var n = 0, lenn = nodes.length; n < lenn; n++) {
								if (uploadctl.headers[i].name.bind_evaluate) {
									hname = XsltForms_globals.stringValue(uploadctl.headers[i].name.bind_evaluate(uploadctl.subform, nodes[n]));
								} else {
									hname = uploadctl.headers[i].name;
								}
								if (hname !== "") {
									var hvalue = "";
									var j;
									var len2;
									for (j = 0, len2 = uploadctl.headers[i].values.length; j < len2; j++) {
										var hv = uploadctl.headers[i].values[j];
										var hv2;
										if (hv.bind_evaluate) {
											hv2 = XsltForms_globals.stringValue(hv.bind_evaluate(uploadctl.subform, nodes[n]));
										} else {
											hv2 = hv;
										}
										hvalue += hv2;
										if (j < len2 - 1) {
											hvalue += ",";
										}
									}
									upheaders[hname] = hvalue;
								}
							}
						}
						up.setOption("headers", upheaders);
					}
				},
				UploadComplete: function(up) {
					var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
					if (uploadctl.uploadbtn) {
						uploadctl.uploadbtn.disabled = true;
					}
					if (uploadctl.error) {
						uploadctl.error = null;
					} else {
						XsltForms_xmlevents.dispatch(uploadctl, "xforms-upload-done");
					}
				},
				Error: function(up, err) {
					var evcontext = {
						"method": "POST",
						"resource-uri": up.getOption("url"),
						"error-type": "resource-error",
						"response-body": err.response,
						"response-status-code": err.code,
						"response-reason-phrase": err.message
					};
					var uploadctl = XsltForms_control.getXFElement(up.getOption("browse_button")[0]);
					uploadctl.error = true;
					XsltForms_xmlevents.dispatch(uploadctl, "xforms-upload-error", null, null, null, null, evcontext);
				}
			};
			if (XsltForms_globals.jslibraries["http://www.plupload.com/jquery.ui.plupload"]) {
				var $jQuery = jQuery.noConflict();
				$jQuery(this.element.children[this.valoff].firstChild).plupload(upsettings);
			} else {
				this.uploadbtn = this.element.children[this.valoff].firstChild.children[1];
				upsettings.browse_button = this.element.children[this.valoff].firstChild.firstChild;
				this.uploader = new plupload.Uploader(upsettings);
				this.uploader.init();
			}
		}
	}
};
XsltForms_upload.prototype.blur = function(target) {
	XsltForms_globals.focus = null;
	if (!this.incremental) {
		XsltForms_browser.assert(this.input, this.element.id);
		this.valueChanged(this.value);
	}
};
XsltForms_upload.prototype.directclick = function() {
	if (window.FileReader) {
		return true;
	}
	if (this.type.nsuri !== "http://www.w3.org/2001/XMLSchema" || (this.type.name !== "anyURI" && this.type.name !== "string" && this.type.name !== "base64Binary" && this.type.name !== "hexBinary")) {
		alert("Unexpected type for upload control: " + this.type.nsuri + " " + this.type.name);
		throw new Error("Error");
	} else {
		var filename = "unselected";
		var content = XsltForms_browser.readFile("", "ISO-8859-1", this.type.name, "XSLTForms Java Upload");
		if (document.applets.xsltforms) {
			filename = document.applets.xsltforms.lastChosenFileName;
		} else {
			if( document.getElementById("xsltforms_applet") ) {
				filename = document.getElementById("xsltforms_applet").xsltforms.lastChosenFileName;
			}
		}
		filename = filename.split('\\').pop();
		if (this.type.name === "anyURI") {
			this.value = "file://" + filename + "?id=" + this.element.id;
			XsltForms_upload.contents[this.element.id] = content;
		} else {
			this.value = content;
		}
		this.input.value = filename;
		if (this.incremental) {
			this.valueChanged(this.value);
		}
		if(this.filename && this.filename.bind_evaluate) {
			var filenameref = this.filename.bind_evaluate(this.element.node)[0];
			if (filenameref) {
				XsltForms_globals.openAction("XsltForms_upload.prototype.directclick");
				XsltForms_browser.setValue(filenameref, filename || "");
				var model = document.getElementById(XsltForms_browser.getDocMeta(filenameref.ownerDocument, "model")).xfElement;
				model.addChange(filenameref);
				XsltForms_xmlevents.dispatch(model, "xforms-recalculate");
				XsltForms_globals.refresh();
				XsltForms_globals.closeAction("XsltForms_upload.prototype.directclick");
			}
		}
	}
	return false;
};
XsltForms_upload.prototype.change = function() {
	if (this.type.nsuri !== "http://www.w3.org/2001/XMLSchema" || (this.type.name !== "anyURI" && this.type.name !== "string" && this.type.name !== "base64Binary" && this.type.name !== "hexBinary")) {
		alert("Unexpected type for upload control: " + this.type.nsuri + " " + this.type.name);
		throw new Error("Error");
	} else {
		var filename = "unselected";
		var content = "";
		var xf = this;
		try {
			var fr = new FileReader();
			var file = xf.input.files[0];
			if (!file) {
				xf.value = "";
				if (xf.incremental) {
					xf.valueChanged("");
				}
			} else {
				filename = file.name;
				if (xf.type.name === "string") {
					fr.onload = function(e) {
						var bytes = new Uint8Array(e.target.result);
						for( var i = 0, len = bytes.length; i < len; i++) {
							content += String.fromCharCode(bytes[i]);
						}
						xf.value = content;
						if (xf.incremental) {
							xf.valueChanged(content);
						}
					};
				} else if (xf.type.name === "hexBinary") {
					fr.onload = function(e) {
						var bytes = new Uint8Array(e.target.result);
						for( var i = 0, len = bytes.length; i < len; i++) {
							var c = bytes[i] >> 4;
							var d = bytes[i] & 0xF;
							content += String.fromCharCode(c > 9 ? c + 55 : c + 48, d > 9 ? d + 55 : d + 48);
						}
						xf.value = content;
						if (xf.incremental) {
							xf.valueChanged(content);
						}
					};
				} else if (xf.type.name === "base64Binary") {
					fr.onload = function(e) {
						var bytes = new Uint8Array(e.target.result);
						var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
						var len = bytes.length;
						bytes[len] = bytes[len+1] = 0;
						for( var i = 0; i < len; i += 3) {
							var c1 = bytes[i] >> 2;
							var c2 = ((bytes[i] & 3) << 4) | (bytes[i+1] >> 4);
							var c3 = ((bytes[i+1] & 15) << 2) | (bytes[i+2] >> 6);
							var c4 = bytes[i+2] & 63;
							if( i === len - 1) {
								c3 = c4 = 64;
							} else if( i === len -2) {
								c4 = 64;
							}
							content += b64.charAt(c1) + b64.charAt(c2) + b64.charAt(c3) + b64.charAt(c4);
						}
						xf.value = content;
						if (xf.incremental) {
							xf.valueChanged(content);
						}
					};
				} else {
					fr.onload = function(e) {
						XsltForms_upload.contents[xf.element.id] = e.target.result;
						xf.value = "file://" + filename + "?id=" + xf.element.id;
						if (xf.incremental) {
							xf.valueChanged(xf.value);
						}
					};
				}
				fr.readAsArrayBuffer(file);
			}
		} catch (e) {
			content = XsltForms_browser.readFile(xf.input.value, "ISO-8859-1", xf.type.name, "");
			if (xf.type.name === "anyURI") {
				xf.value = "file://" + filename + "?id=" + xf.element.id;
				XsltForms_upload.contents[xf.element.id] = content;
			} else {
				xf.value = content;
			}
			if (xf.incremental) {
				xf.valueChanged(xf.value);
			}
		}
		if(this.filename && this.filename.bind_evaluate) {
			var filenameref = this.filename.bind_evaluate(this.element.node)[0];
			if (filenameref) {
				XsltForms_globals.openAction("XsltForms_upload.prototype.change");
				XsltForms_browser.setValue(filenameref, filename || "");
				var model = document.getElementById(XsltForms_browser.getDocMeta(filenameref.ownerDocument, "model")).xfElement;
				model.addChange(filenameref);
				XsltForms_xmlevents.dispatch(model, "xforms-recalculate");
				XsltForms_globals.refresh();
				XsltForms_globals.closeAction("XsltForms_upload.prototype.change");
			}
		}
	}
};
function XsltForms_var(subform, id, vname, binding) {
	XsltForms_globals.counters.xvar++;
	this.init(subform, id);
	if (!this.element.parentNode.varScope) {
		this.element.parentNode.varScope = {};
	}
	this.element.parentNode.varScope[vname] = id;
	this.controlName = "var";
	this.name = vname;
	this.hasBinding = true;
	this.binding = binding;
	this.isOutput = true;
}
XsltForms_var.prototype = new XsltForms_control();
XsltForms_var.prototype.clone = function(id) { 
	return new XsltForms_var(this.subform, id, this.name, this.binding);
};
XsltForms_var.prototype.dispose = function() {
	XsltForms_globals.counters.xvar--;
	XsltForms_control.prototype.dispose.call(this);
};
function XsltForms_calendar() {
	var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
	this.element = XsltForms_browser.createElement("table", body, null, "calendar");
	var tHead = XsltForms_browser.createElement("thead", this.element);
	var trTitle = XsltForms_browser.createElement("tr", tHead);
	var title = XsltForms_browser.createElement("td", trTitle, null, "title");
	title.colSpan = 7;
	this.selectMonth = XsltForms_browser.createElement("select", title);
	XsltForms_browser.events.attach(this.selectMonth, "change", function() {
		XsltForms_calendar.INSTANCE.refresh();
	} );
	for (var i = 0; i < 12; i++) {
		var o = XsltForms_browser.createElement("option", this.selectMonth, XsltForms_browser.i18n.get("calendar.month" + i));
		o.setAttribute("value", i);
	}
	this.inputYear = XsltForms_browser.createElement("input", title);
	this.inputYear.readOnly = true;
	XsltForms_browser.events.attach(this.inputYear, "mouseup", function() {
		var cal = XsltForms_calendar.INSTANCE;
		cal.yearList.show();
	} );
	XsltForms_browser.events.attach(this.inputYear, "change", function() {
		XsltForms_calendar.INSTANCE.refresh();
	} );
	var closeElt = XsltForms_browser.createElement("button", title, "X");
	closeElt.setAttribute("type", "button");
	closeElt.setAttribute("title", XsltForms_browser.i18n.get("calendar.close", "Close"));
	XsltForms_browser.events.attach(closeElt, "click", function() {
		XsltForms_calendar.close();
	} );
	var trDays = XsltForms_browser.createElement("tr", tHead, null, "names");
	var ini = parseInt(XsltForms_browser.i18n.get("calendar.initDay"), 10);
	for (var j = 0; j < 7; j++) {
		var ind = (j + ini) % 7;
		this.createElement(trDays, "name", XsltForms_browser.i18n.get("calendar.day" + ind));
	}
	this.tBody = XsltForms_browser.createElement("tbody", this.element);
	var handler = function(evt) {
		var value = XsltForms_browser.events.getTarget(evt).childNodes[0].nodeValue;
		var cal = XsltForms_calendar.INSTANCE;
		if (value !== "") {
			cal.day = value;
			var date = new Date(cal.inputYear.value,cal.selectMonth.value,cal.day);
			if (cal.isTimestamp) {
				date.setSeconds(cal.inputSec.value);
				date.setMinutes(cal.inputMin.value);
				date.setHours(cal.inputHour.value);
				cal.input.value = XsltForms_browser.i18n.format(date, null, true);
			} else {
				cal.input.value = XsltForms_browser.i18n.formatDate(date);
			}
			XsltForms_calendar.close();
			XsltForms_browser.events.dispatch(cal.input, "keyup");
			cal.input.focus();
		}
	};
	for (var dtr = 0; dtr < 6; dtr++) {
		var trLine = XsltForms_browser.createElement("tr", this.tBody);
		for (var day = 0; day < 7; day++) {
			this.createElement(trLine, "day", " ", 1, handler);
		}
	}
	var tFoot = XsltForms_browser.createElement("tfoot", this.element);
	var trFoot = XsltForms_browser.createElement("tr", tFoot);
	var tdFoot = XsltForms_browser.createElement("td", trFoot);
	tdFoot.colSpan = 7;
	this.inputHour = XsltForms_browser.createElement("input", tdFoot);
	this.inputHour.readOnly = true;
	XsltForms_browser.events.attach(this.inputHour, "mouseup", function() {
		XsltForms_calendar.INSTANCE.hourList.show();
	} );
	tdFoot.appendChild(document.createTextNode(":"));
	this.inputMin = XsltForms_browser.createElement("input", tdFoot);
	this.inputMin.readOnly = true;
	XsltForms_browser.events.attach(this.inputMin, "mouseup", function() {
		XsltForms_calendar.INSTANCE.minList.show();
	} );
	tdFoot.appendChild(document.createTextNode(":"));
	this.inputSec = XsltForms_browser.createElement("input", tdFoot);
	this.inputSec.readOnly = true;
	XsltForms_browser.events.attach(this.inputSec, "mouseup", function() {
		if (XsltForms_calendar.INSTANCE.type >= XsltForms_calendar.SECONDS) {
			XsltForms_calendar.INSTANCE.secList.show();
		}
	} );
	this.yearList = new XsltForms_numberList(title, "calendarList", this.inputYear, 1900, 2050);
	this.hourList = new XsltForms_numberList(tdFoot, "calendarList", this.inputHour, 0, 23, 2);
	this.minList = new XsltForms_numberList(tdFoot, "calendarList", this.inputMin, 0, 59, 2);
	this.secList = new XsltForms_numberList(tdFoot, "calendarList", this.inputSec, 0, 59, 2);
}
XsltForms_calendar.prototype.today = function() {
	this.refreshControls(new Date());
};
XsltForms_calendar.prototype.refreshControls = function(date) {
	this.day = date.getDate();
	this.selectMonth.value = date.getMonth();
	this.inputYear.value = date.getYear() < 1000 ? 1900 + date.getYear() : date.getYear();
	if (this.isTimestamp) {
		this.inputHour.value = XsltForms_browser.zeros(date.getHours(), 2);
		this.inputMin.value = this.type >= XsltForms_calendar.MINUTES ? XsltForms_browser.zeros(date.getMinutes(), 2) : "00";
		this.inputSec.value = this.type >= XsltForms_calendar.SECONDS ? XsltForms_browser.zeros(date.getSeconds(), 2) : "00";
	}
	this.refresh();
};
XsltForms_calendar.prototype.refresh = function() {
	var firstDay = this.getFirstDay();
	var daysOfMonth = this.getDaysOfMonth();
	var ini = parseInt(XsltForms_browser.i18n.get("calendar.initDay"), 10);
	var cont = 0;
	var day = 1;
	var currentMonthYear = this.selectMonth.value === this.currentMonth && this.inputYear.value === this.currentYear;
	for (var i = 0; i < 6; i++) {
		var trLine = this.tBody.childNodes[i];
		for (var j = 0; j < 7; j++, cont++) {
			var cell = trLine.childNodes[j];
			var dayInMonth = (cont >= firstDay && cont < firstDay + daysOfMonth);
			XsltForms_browser.setClass(cell, "hover", false);
			XsltForms_browser.setClass(cell, "today", currentMonthYear && day === this.currentDay);
			XsltForms_browser.setClass(cell, "selected", dayInMonth && day === this.day);
			XsltForms_browser.setClass(cell, "weekend", (j+ini)%7 > 4);
			cell.firstChild.nodeValue = dayInMonth ? day++ : "";
		}
	}
};
XsltForms_calendar.prototype.getFirstDay = function() {
	var date = new Date();
	date.setDate(1);
	date.setMonth(this.selectMonth.value);
	date.setYear(this.inputYear.value);
	var ini = parseInt(XsltForms_browser.i18n.get("calendar.initDay"), 10);
	var d = date.getDay();
	return (d + (6 - ini)) % 7;
};
XsltForms_calendar.prototype.getDaysOfMonth = function() {
	var year = parseInt(this.inputYear.value, 10);
	var month = parseInt(this.selectMonth.value, 10);
	if (month === 1 && ((0 === (year % 4)) && ((0 !== (year % 100)) || (0 === (year % 400))))) {
		return 29;
	}
	return XsltForms_calendar.daysOfMonth[this.selectMonth.value];
};
XsltForms_calendar.prototype.createElement = function(parent, className, text, colspan, handler) {
	var element = XsltForms_browser.createElement("td", parent, text, className);
	if (colspan > 1) {
		element.colSpan = colspan;
	}
	if (handler) {
		XsltForms_browser.events.attach(element, "click", handler);
		XsltForms_browser.initHover(element);
	}
	return element;
};
XsltForms_calendar.daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
XsltForms_calendar.ONLY_DATE = 0;
XsltForms_calendar.HOURS = 1;
XsltForms_calendar.MINUTES = 2;
XsltForms_calendar.SECONDS = 3;
XsltForms_calendar.show = function(input, type) {
	var cal = XsltForms_calendar.INSTANCE;
	if (!cal) {
		cal = new XsltForms_calendar();
		XsltForms_calendar.INSTANCE = cal;
	}
	if (!type) {
		type = XsltForms_calendar.ONLY_DATE;
	}
	cal.input = input;
	cal.type = type;
	cal.isTimestamp = type !== XsltForms_calendar.ONLY_DATE;
	XsltForms_browser.setClass(cal.element, "date", !cal.isTimestamp);
	var date;
	try {
		date = cal.isTimestamp? XsltForms_browser.i18n.parse(input.value) : XsltForms_browser.i18n.parseDate(input.value);
	} catch (e) {
		date = new Date();
	}
	if (date) {
		cal.refreshControls(date);
	} else {
		cal.today();
	}
	XsltForms_browser.dialog.show(cal.element, input, false);
};
XsltForms_calendar.close = function() {
	var cal = XsltForms_calendar.INSTANCE;
	cal.yearList.close();
	XsltForms_browser.dialog.hide(cal.element, false);
};
function XsltForms_type() {
}
XsltForms_type.prototype.setSchema = function(schema) {
	this.schema = schema;
	return this;
};
XsltForms_type.prototype.setName = function(tname) {
	this.name = tname;
	this.nsuri = this.schema.ns;
	this.schema.types[tname] = this;
	return this;
};
XsltForms_type.prototype.canonicalValue = function(value) {
	value = value.toString();
	switch (this.whiteSpace) {
		case "replace":
			value = value.replace(/[\t\r\n]/g, " ");
			break;
		case "collapse":
			value = value.replace(/[\t\r\n ]+/g, " ").replace(/^\s+|\s+$/g, "");
			break;
	}
	return value;
};
XsltForms_type.prototype.getMaxLength = function() {
	return this.maxLength ? this.maxLength : (this.length ? this.length : (this.totalDigits ? this.totalDigits + 1 : null));
};
XsltForms_type.prototype.getDisplayLength = function() {
	return this.displayLength;
};
function XsltForms_schema(subform, ns, sname, prefixes) {
	if (XsltForms_schema.all[ns]) {
		XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-link-exception", "More than one schema with the same namespace declaration");
		return;
	}
	if (ns === "") {
		return XsltForms_schema.all["http://www.w3.org/2002/xforms"];
	}
	this.subform = subform;
	this.name = sname;
	this.ns = ns;
	this.types = {};
	this.prefixes = prefixes || {};
	XsltForms_schema.all[ns] = this;
	if (subform) {
		subform.schemas.push(this);
	}
}
XsltForms_schema.prototype.dispose = function(subform) {
	XsltForms_schema.all[this.ns] = null;
	this.types = null;
	this.prefixes = null;
};
XsltForms_schema.all = {};
XsltForms_schema.prototype.getType = function(tname) {
	if (tname.indexOf(":") !== -1) {
		var res = tname.split(":");
		var prefix = res[0];
		var ns = this.prefixes[prefix];
		if (ns) {
			return XsltForms_schema.getTypeNS(ns, res[1]);
		}
		return XsltForms_schema.getType(tname);
	}
	var type = this.types[tname];
	if (!type) {
		alert("Type " + tname + " not defined");
		throw new Error("Error");
	}
	return type;
};
XsltForms_schema.getType = function(tname) {
	tname = tname || "xsd:string";
	var res = tname.split(":");
	if (typeof(res[1]) === "undefined") {
		return XsltForms_schema.getTypeNS(XsltForms_schema.prefixes.xforms, res[0]);
	} else {
		return XsltForms_schema.getTypeNS(XsltForms_schema.prefixes[res[0]], res[1]);
	}
};
XsltForms_schema.getTypeNS = function(ns, tname) {
	var schema = XsltForms_schema.all[ns];
	if (!schema) {
		alert("Schema for namespace " + ns + " not defined for type " + tname);
		throw new Error("Error");
	}
	var type = schema.types[tname];	
	if (!type) {
		if (XsltForms_globals.debugMode) {
			alert("Type " + tname + " not defined in namespace " + ns);
		}
		type = XsltForms_schema.getTypeNS("http://www.w3.org/2001/XMLSchema", "string");
	}
	return type;
};
XsltForms_schema.get = function(subform, ns) {
	var schema = XsltForms_schema.all[ns];
	if (!schema) {
		schema = new XsltForms_schema(subform, ns);
	}
	return schema;
};
XsltForms_schema.prefixes = {
	"xsd_" : "http://www.w3.org/2001/XMLSchema",
	"xsd" : "http://www.w3.org/2001/XMLSchema",
	"xs" : "http://www.w3.org/2001/XMLSchema",
	"xf" : "http://www.w3.org/2002/xforms",
	"xform" : "http://www.w3.org/2002/xforms",
	"xforms" : "http://www.w3.org/2002/xforms",
	"xsltforms" : "http://www.agencexml.com/xsltforms",
	"rte" : "http://www.agencexml.com/xsltforms/rte",
	"dcterms" : "http://purl.org/dc/terms/"
};
XsltForms_schema.registerPrefix = function(prefix, namespace) {
	this.prefixes[prefix] = namespace;
};
function XsltForms_atomicType() {
	this.patterns = [];
}
XsltForms_atomicType.prototype = new XsltForms_type();
XsltForms_atomicType.prototype.setBase = function(base) {
	var baseType = typeof base === "string"? this.schema.getType(base) : base;
	for (var id in baseType)  {
		if (baseType.hasOwnProperty(id)) {
			var value = baseType[id];
			if (id === "patterns") {
				XsltForms_browser.copyArray(value, this.patterns);
			} else if (id !== "name" && id !== "nsuri" && id !== "base") {
				this[id] = value;
			}
		}
	}
	this.basensuri = baseType.nsuri;
	this.basename = baseType.name;
	return this;
};
XsltForms_atomicType.prototype.hasBase = function(base) {
	var baseType = XsltForms_schema.getType(base);
	var curType = this;
	while( curType !== baseType ){
		if (!curType.basename) {
			return false;
		}
		curType = XsltForms_schema.getTypeNS(curType.basensuri, curType.basename);
		if (!curType) {
			return false;
		}
	}
	return true;
};
XsltForms_atomicType.prototype.put = function(tname, value) {
	if (tname === "base") {
		this.setBase(value);
	} else if (tname === "pattern") {
		XsltForms_browser.copyArray([value], this.patterns);
	} else if (tname === "enumeration") {
		if (!this.enumeration) {
			this.enumeration = [];
		}
		this.enumeration.push(value);
	} else {
		if (tname === "length" || tname === "minLength" || tname === "maxLength" || tname === "fractionDigits" || tname === "totalDigits") {
			value = parseInt(value, 10);
		} else if (tname === "minInclusive" || tname === "maxInclusive") {
			value = parseFloat(value);
		}
		this[tname] = value;
	}
	return this;
};
XsltForms_atomicType.prototype.validate = function (value) {
	value = this.canonicalValue(value);
	for (var i = 0, len = this.patterns.length; i < len; i++) {
		if (!value.match(this.patterns[i])) {
			return false;
		}
	}
	if (this.enumeration) {
		var matched = false;
		for (var j = 0, len1 = this.enumeration.length; j < len1; j++) {
			if (value === this.canonicalValue(this.enumeration[j])) {
				matched = true;
				break;
			}
		}
		if (!matched) {
			return false;
		}
	}
	var l = value.length;
	var value_i = parseInt(value, 10);
	if ( (typeof this.length === "number" && this.length !== l) ||
		(typeof this.minLength === "number" && l < this.minLength) ||
		(typeof this.maxLength === "number" && l > this.maxLength) ||
		(typeof this.maxInclusive === "number" && value_i > this.maxInclusive) ||
		(typeof this.maxExclusive === "number" && value_i >= this.maxExclusive) ||
		(typeof this.minInclusive === "number" && value_i < this.minInclusive) ||
		(typeof this.minExclusive === "number" && value_i <= this.minExclusive) ) {
		return false;
	}
	if (typeof this.totalDigits === "number" || typeof this.fractionDigits === "number") {
		var index = value.indexOf(".");
		var integer = "" + Math.abs(parseInt(index !== -1? value.substring(0, index) : value, 10));
		var decimal = index !== -1? value.substring(index + 1) : "";
		if (index !== -1) {
			if (this.fractionDigits === 0) {
				return false;
			}
			var dl = decimal.length - 1;
			while (dl >= 0 && decimal.charAt(dl) === 0) {
				dl--;
			}
			decimal = decimal.substring(0, dl + 1);
		}
		if ( (typeof this.totalDigits === "number" && integer.length + decimal.length > this.totalDigits) ||
			(typeof this.fractionDigits === "number" && decimal.length > this.fractionDigits)) {
			return false;
		}
	}
	return true;
};
XsltForms_atomicType.prototype.normalize = function (value) {
	if (typeof this.fractionDigits === "number") {
		var number = parseFloat(value);
		var num;
		if (isNaN(number)) {
			return "NaN";
		}
		if (number === 0) {
			num = XsltForms_browser.zeros(0, this.fractionDigits + 1, true);
		} else {
			var mult = XsltForms_browser.zeros(1, this.fractionDigits + 1, true);
			num = "" + Math.round(number * mult);
		}
		if (this.fractionDigits !== 0) {
			var index = num.length - this.fractionDigits;
			return (index === 0 ? "0" : num.substring(0, index)) + "." + num.substring(index);
		}
		return num;
	}
	return value;
};
function XsltForms_listType() {
	this.whiteSpace = "collapse";
}
XsltForms_listType.prototype = new XsltForms_type();
XsltForms_listType.prototype.setItemType = function(itemType) {
	this.itemType = typeof itemType === "string"? this.schema.getType(itemType) : itemType;
	return this;
};
XsltForms_listType.prototype.validate = function(value) {
	var l = 0, items = this.itemType.canonicalValue.call(this, value).split(" ");
	for (var i = 0, len = items.length; i < len; i++) {
		if (items[i] !== "") {
			l++;
			var item = this.itemType.validate(items[i]);
			if (!item) {
				return false;
			}
		}
	}
	if ( (this.minLength && l < this.minLength) ||
		(this.maxLength && l > this.maxLength)) {
		return false;
	}
	return true;
};
XsltForms_listType.prototype.canonicalValue = function(value) {
	var items = this.itemType.canonicalValue(value).split(" ");
	var cvalue = "";
	for (var i = 0, len = items.length; i < len; i++) {
		var item = this.itemType.canonicalValue(items[i]);
		cvalue += (cvalue.length === 0 ? "" : " ") + item;
	}
	return cvalue;
};
function XsltForms_unionType(memberTypes) {
	this.baseTypes = [];
	this.memberTypes = memberTypes ? memberTypes.split(" ") : [];
}
XsltForms_unionType.prototype = new XsltForms_type();
XsltForms_unionType.prototype.addType = function(type) {
	this.baseTypes.push(typeof type === "string"? this.schema.getType(type) : type);
	return this;
};
XsltForms_unionType.prototype.addTypes = function() {
	for (var i = 0, len = this.memberTypes.length; i < len; i++ ) {
		this.baseTypes.push(this.schema.getType(this.memberTypes[i]));
	}
	return this;
};
XsltForms_unionType.prototype.validate = function (value) {
	for (var i = 0, len = this.baseTypes.length; i < len; ++i) {
		if (this.baseTypes[i].validate(value)) {
			return true;
		}
	}
	return false;
};
var XsltForms_typeDefs = {
	initAll : function() {
		this.init("http://www.w3.org/2001/XMLSchema", this.Default);
		this.init("http://www.w3.org/2002/xforms", this.XForms);
		this.init("http://www.agencexml.com/xsltforms", this.XSLTForms);
		this.init("http://purl.org/dc/terms/", this.DublinCore);
	},
	init : function(ns, list) {
		var schema = XsltForms_schema.get(null, ns);
		for (var id in list) {
			if (list.hasOwnProperty(id)) {
				var type = new XsltForms_atomicType();
				type.setSchema(schema);
				type.setName(id);
				var props = list[id];
				var base = props.base;
				if (base) {
					type.setBase(base);
				}
				for (var prop in props) {
					if (prop !== "base") {
						type[prop] = props[prop];
					}
				}
			}
		}
	},
	ctes : {
		i : "A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF",
		c : "A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7"
	}
};
XsltForms_typeDefs.Default = {
	"string" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "preserve"
	},
	"boolean" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^(true|false|0|1)$" ],
		"class" : "boolean"
	},
	"decimal" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[\\-+]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)$" ],
		"class" : "number",
		"format" : function(value) {
			return XsltForms_browser.i18n.formatNumber(value, this.fractionDigits);
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.parseNumber(value);
		}
	},
	"float" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^(([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][\\-+]?[0-9]+)?|-?INF|NaN)$" ],
		"class" : "number"
	},
	"double" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^(([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)$" ],
		"class" : "number"
	},
	"dateTime" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$" ],
		"class" : "datetime",
		"displayLength" : 20,
		"format" : function(value) {
			var reg = new RegExp("^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDateTime(XsltForms_browser.i18n.parse(value, "yyyy-MM-ddThh:mm:ss"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value), "yyyy-MM-ddThh:mm:ss", true);
		}
	},
	"date" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$" ],
		"class" : "date",
		"displayLength" : 10,
		"format" : function(value) {
			var reg = new RegExp("^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDate(XsltForms_browser.i18n.parse(value, "yyyy-MM-dd"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parseDate(value), "yyyy-MM-dd", true);
		}
	},
	"time" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?$" ],
		"class" : "time",
		"displayLength" : 8,
		"format" : function(value) {
			var reg = new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, "hh:mm:ss", true), null, true, true);
			}
			return value;
		},
		"parse" : function(value) {
			var reg = new RegExp(XsltForms_globals.AMPM ?
				"^(?:0?[1-9](?![0-9])|1[0-2]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)? ?(" + XsltForms_browser.i18n.get("format.time.AM") + "|" + XsltForms_browser.i18n.get("format.time.PM") + ")$" :
				"^(?:0?[0-9](?![0-9])|1[0-9]|20|21|22|23):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$", "i");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, null, true), "hh:mm:ss", true, true);
			}
			return value;
		}
	},
	"duration" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$" ]
	},
	"gDay" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^---(0[1-9]|[12][0-9]|3[01])$" ]
	},
	"gMonth" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^--(0[1-9]|1[012])$" ]
	},
	"gMonthDay" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$" ]
	},
	"gYear" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([\\-+]?([0-9]{4}|[1-9][0-9]{4,}))?$" ]
	},
	"gYearMonth" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^([12][0-9]{3})-(0[1-9]|1[012])$" ]
	},
	"integer" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:decimal",
		"fractionDigits" : 0
	},
	"nonPositiveInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^(-[0-9]+|0)$" ]
	},
	"nonNegativeInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^\\+?[0-9]+$" ]
	},
	"negativeInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^-0*[1-9][0-9]*$" ]
	},
	"positiveInteger" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"patterns" : [ "^\\+?0*[1-9][0-9]*$" ]
	},
	"byte" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -128,
		"maxInclusive" : 127
	},
	"short" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -32768,
		"maxInclusive" : 32767
	},
	"int" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -2147483648,
		"maxInclusive" : 2147483647
},
	"long" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:integer",
		"minInclusive" : -9223372036854775808,
		"maxInclusive" : 9223372036854775807
},
	"unsignedByte" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 255
	},
	"unsignedShort" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 65535
	},
	"unsignedInt" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 4294967295
	},
	"unsignedLong" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:nonNegativeInteger",
		"maxInclusive" : 18446744073709551615
},
	"normalizedString" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "replace"
	},
	"token" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "collapse"
	},
	"language" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$" ]
	},
	"anyURI" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^(([^ :\\/?#]+):\\/\\/)?[^ \\/\\?#]+([^ \\?#]*)(\\?([^ #]*))?(#([^ \\:#\\[\\]\\@\\!\\$\\&\\\\'\\(\\)\\*\\+\\,\\;\\=]*))?$" ]
	},
	"Name" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.i + ":][" + XsltForms_typeDefs.ctes.c + ":]*$" ]
	},
	"NCName" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*$" ]
	},
	"QName" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:token",
		"patterns" : [ "^(([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\>> -_!~*'()%]+)?(>> #[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?:[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*$" ]
	},
	"ID" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:NCName"
	},
	"IDREF" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"base" : "xsd_:NCName"
	},
	"IDREFS" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*( +[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)*$" ]
	},
	"NMTOKEN" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.c + "]+$" ]
	},
	"NMTOKENS" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.c + "]+( [" + XsltForms_typeDefs.ctes.c + "]+)*$" ]
	},
	"base64Binary" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[a-zA-Z0-9+/=]+$" ]
	},
	"hexBinary" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"patterns" : [ "^[0-9A-Fa-f]+$" ],
		"format" : function(value) {
			return value.toUpperCase();
		},
		"parse" : function(value) {
			return value.toUpperCase();
		}
	},
	"select1" : {
		"nsuri" : "http://www.w3.org/2001/XMLSchema",
		"whiteSpace" : "preserve"
	}
};
XsltForms_typeDefs.XForms = {
	"string" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"whiteSpace" : "preserve"
	},
	"boolean" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(true|false|0|1)?$" ],
		"class" : "boolean"
	},
	"decimal" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([\\-+]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+))?$" ],
		"class" : "number",
		"format" : function(value) {
			return XsltForms_browser.i18n.formatNumber(value, this.fractionDigits);
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.parseNumber(value);
		}
	},
	"float" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^((([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][\\-+]?[0-9]+)?|-?INF|NaN))?$" ],
		"class" : "number"
	},
	"double" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^((([\\-+]?([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN))?$" ],
		"class" : "number"
	},
	"dateTime" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$" ],
		"class" : "datetime",
		"displayLength" : 20,
		"format" : function(value) {
			var reg = new RegExp("^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDateTime(XsltForms_browser.i18n.parse(value, "yyyy-MM-ddThh:mm:ss"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value), "yyyy-MM-ddThh:mm:ss", true);
		}
	},
	"date" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$" ],
		"class" : "date",
		"displayLength" : 10,
		"format" : function(value) {
			var reg = new RegExp("^(([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.formatDate(XsltForms_browser.i18n.parse(value, "yyyy-MM-dd"), null, true);
			}
			return value;
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parseDate(value), "yyyy-MM-dd", true);
		}
	},
	"time" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$" ],
		"class" : "time",
		"displayLength" : 8,
		"format" : function(value) {
			var reg = new RegExp("^(([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?)?$");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, "hh:mm:ss", true), null, true, true);
			}
			return value;
		},
		"parse" : function(value) {
			var reg = new RegExp(XsltForms_globals.AMPM ?
				"^((?:0?[1-9](?![0-9])|1[0-2]):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)? ?(" + XsltForms_browser.i18n.get("format.time.AM") + "|" + XsltForms_browser.i18n.get("format.time.PM") + "))?$" :
				"^((?:0?[0-9](?![0-9])|1[0-9]|20|21|22|23):[0-5][0-9](:[0-5][0-9](\\.[0-9]+)?(Z|[+\\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?)?$", "i");
			if (reg.test(value)) {
				return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, null, true), "hh:mm:ss", true, true);
			}
			return value;
		}
	},
	"duration" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?)?$" ]
	},
	"dayTimeDuration" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(-?P([0-9]+D(T([0-9]+(H([0-9]+(M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|(\\.[0-9]*)?S)?|M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|\\.[0-9]+S))?|T([0-9]+(H([0-9]+(M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|(\\.[0-9]*)?S)?|M([0-9]+(\\.[0-9]*)?S|\\.[0-9]+S)?|(\\.[0-9]*)?S)|\\.[0-9]+S)))?$" ]
	},
	"yearMonthDuration" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(-?P[0-9]+(Y([0-9]+M)?|M))?$" ]
	},
	"gDay" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(---(0[1-9]|[12][0-9]|3[01]))?$" ]
	},
	"gMonth" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(--(0[1-9]|1[012]))?$" ]
	},
	"gMonthDay" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))?$" ]
	},
	"gYear" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([\\-+]?([0-9]{4}|[1-9][0-9]{4,}))?$" ]
	},
	"gYearMonth" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^(([12][0-9]{3})-(0[1-9]|1[012]))?$" ]
	},
	"integer" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:decimal",
		"fractionDigits" : 0
	},
	"nonPositiveInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^((-[0-9]+|0))?$" ]
	},
	"nonNegativeInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^(\\+?[0-9]+)?$" ]
	},
	"negativeInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^(-[0-9]+)?$" ]
	},
	"positiveInteger" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"patterns" : [ "^(\\+?0*[1-9][0-9]*)?$" ]
	},
	"byte" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -128,
		"maxInclusive" : 127
	},
	"short" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -32768,
		"maxInclusive" : 32767
	},
	"int" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -2147483648,
		"maxInclusive" : 2147483647
	},
	"long" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:integer",
		"minInclusive" : -9223372036854775808,
		"maxInclusive" : 9223372036854775807
	},
	"unsignedByte" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 255
	},
	"unsignedShort" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 65535
	},
	"unsignedInt" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 4294967295
	},
	"unsignedLong" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:nonNegativeInteger",
		"maxInclusive" : 18446744073709551615
	},
	"normalizedString" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"whiteSpace" : "replace"
	},
	"token" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"whiteSpace" : "collapse"
	},
	"language" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^([a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*)?$" ]
	},
	"anyURI" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^((([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\>> -_!~*'()%]+)?(>> #[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?)?$" ]
	},
	"Name" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.i + ":][" + XsltForms_typeDefs.ctes.c + ":]*)?$" ]
	},
	"NCName" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)?$" ]
	},
	"QName" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:token",
		"patterns" : [ "^((([a-zA-Z][0-9a-zA-Z+\\-\\.]*:)?/{0,2}[0-9a-zA-Z;/?:@&=+$\\.\\>> -_!~*'()%]+)?(>> #[0-9a-zA-Z;/?:@&=+$\\.\\-_!~*'()%]+)?:[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)?$" ]
	},
	"ID" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:NCName"
	},
	"IDREF" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:NCName"
	},
	"IDREFS" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]+( +[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*)*)?$" ]
	},
	"NMTOKEN" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^[" + XsltForms_typeDefs.ctes.c + "]*$" ]
	},
	"NMTOKENS" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^([" + XsltForms_typeDefs.ctes.c + "]+( [" + XsltForms_typeDefs.ctes.c + "]+)*)?$" ]
	},
	"base64Binary" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^[a-zA-Z0-9+/]*$" ]
	},
	"hexBinary" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"patterns" : [ "^[0-9A-Fa-f]*$" ],
		"format" : function(value) {
			return value.toUpperCase();
		},
		"parse" : function(value) {
			return value.toUpperCase();
		}
	},
	"email" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"whiteSpace" : "collapse",
		"patterns" : [ "^([A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+(\\.[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+)*@[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+(\\.[A-Za-z0-9!#-'\\*\\+\\-/=\\?\\^_`\\{-~]+)*)?$" ]
	},
	"card-number" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"patterns" : [ "^[0-9]*$" ]
	},
	"url" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"whiteSpace" : "collapse",
		"patterns" : [ "^(ht|f)tp(s?)://([a-z0-9]*:[a-z0-9]*@)?([a-z0-9.]*\\.[a-z]{2,7})$" ]
	},
	"amount" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xforms:decimal",
		"format" : function(value) {
			return XsltForms_browser.i18n.formatNumber(value, 2);
		}
	},
	"HTMLFragment" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string"
	},
	"trimmed" : {
		"nsuri" : "http://www.w3.org/2002/xforms",
		"base" : "xsd_:string",
		"format" : function(value) {
			return value.replace(/^\s+|\s+$/gm, "");
		},
		"parse" : function(value) {
			return value.replace(/^\s+|\s+$/gm, "");
		}
	}
};
XsltForms_typeDefs.XSLTForms = {
	"shortDate" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"patterns" : [ "^(([12][0-9]{3})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01]))?$" ],
		"class" : "date",
		"displayLength" : 10,
		"format" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value, "yyyyMMdd"), null, true);
		},
		"parse" : function(value) {
			return XsltForms_browser.i18n.format(XsltForms_browser.i18n.parse(value), "yyyyMMdd", true);
		}
	},
	"decimal" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"patterns" : [ "^[\\-+]?\\(*[\\-+]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)(([+-/]|\\*)\\(*([0-9]+(\\.[0-9]*)?|\\.[0-9]+)\\)*)*$" ],
		"class" : "number",
		"eval" : "xsd:decimal"
	},
	"float" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:float"
	},
	"double" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:double"
	},
	"integer" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:integer"
	},
	"nonPositiveInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:nonPositiveInteger"
	},
	"nonNegativeInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:nonNegativeInteger"
	},
	"negativeInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:negativeInteger"
	},
	"positiveInteger" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:positiveInteger"
	},
	"byte" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:byte"
	},
	"short" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:short"
	},
	"int" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:int"
	},
	"long" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:long"
	},
	"unsignedByte" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedByte"
	},
	"unsignedShort" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedShort"
	},
	"unsignedInt" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedInt"
	},
	"unsignedLong" : {
		"nsuri" : "http://www.agencexml.com/xsltforms",
		"base" : "xsltforms:decimal",
		"eval" : "xsd:unsignedLong"
	}
};
XsltForms_typeDefs.DublinCore = {
	"W3CDTF" : {
		"nsuri" : "http://purl.org/dc/terms/",
		"base" : "xsd_:dateTime"
	}
};
XsltForms_typeDefs.initAll();
if (typeof xsltforms_d0 === "undefined") {
	(function () {
		var initelts = document.getElementsByTagName("script");
		var elts = [];
		var i, l;
		for (i = 0, l = initelts.length; i < l; i++) {
			elts[i] = initelts[i];
		}
		initelts = null;
		var root;
		for (i = 0, l = elts.length; i < l; i++) {
			if (elts[i].src.indexOf("xsltforms.js") !== -1) {
				root = elts[i].src.replace("xsltforms.js", "");
			}
		}
		var newelt;
		newelt = document.createElement("link");
		newelt.setAttribute("rel", "stylesheet");
		newelt.setAttribute("type", "text/css");
		newelt.setAttribute("href", root + "xsltforms.css");
		document.getElementsByTagName("head")[0].appendChild(newelt);
		var addLoadListener = function(func) {
			if (window.addEventListener) {
				window.addEventListener("load", func, false);
			} else if (document.addEventListener) {
				document.addEventListener("load", func, false);
			} else if (window.attachEvent) {
				window.attachEvent("onload", func);
			} else if (typeof window.onload !== "function") {
				window.onload = func;
			} else {
				var oldonload = window.onload;
				window.onload = function() {
					oldonload();
					func();
				};
			}
		};
		var xftrans = function () {
			var conselt = document.createElement("div");
			conselt.setAttribute("id", "xsltforms_console");
			document.getElementsByTagName("body")[0].appendChild(conselt);
			conselt = document.createElement("div");
			conselt.setAttribute("id", "statusPanel");
			conselt.setAttribute("style", "display: none; z-index: 99; top: 294.5px; left: 490px;");
			conselt.innerHTML = "... Loading ...";
			document.getElementsByTagName("body")[0].appendChild(conselt);
			XsltForms_browser.dialog.show('statusPanel');
			if (!(document.documentElement.childNodes[0].nodeType === 8 || (XsltForms_browser.isIE && document.documentElement.childNodes[0].childNodes[1] && document.documentElement.childNodes[0].childNodes[1].nodeType === 8))) {
				var comment = document.createComment("HTML elements and Javascript instructions generated by XSLTForms 1.1 (649) - Copyright (C) 2018 <agenceXML> - Alain COUTHURES - http://www.agencexml.com");
				document.documentElement.insertBefore(comment, document.documentElement.firstChild);
			}
			var initelts2 = document.getElementsByTagName("script");
			var elts2 = [];
			var i2, l2;
			for (i2 = 0, l2 = initelts2.length; i2 < l2; i2++) {
				elts2[i2] = initelts2[i2];
			}
			initelts2 = null;
			var res;
			for (i2 = 0, l2 = elts2.length; i2 < l2; i2++) {
				if (elts2[i].type === "text/xforms") {
					var dbefore = new Date();
					res = XsltForms_browser.transformText('<html xmlns="http://www.w3.org/1999/xhtml"><body>' + elts2[i2].text + '</body></html>', root + "xsltforms.xsl", false);
					var dafter = new Date();
					XsltForms_globals.transformtime = dafter - dbefore;
					var sp = XsltForms_globals.stringSplit(res, "XsltForms_MagicSeparator");
					var mainjs = "xsltforms_d0 = new Date();  }";
					newelt = document.createElement("script");
					newelt.setAttribute("id", "xsltforms-generated-script");
					newelt.setAttribute("type", "text/javascript");
					if (XsltForms_browser.isIE) {
						newelt.text = mainjs;
					} else {
						var scripttxt = document.createTextNode(mainjs);
						newelt.appendChild(scripttxt);
					}
					document.getElementsByTagName("body")[0].appendChild(newelt);
					var subbody = "<!-- xsltforms-mainform " + sp[4] + " xsltforms-mainform -->";
					elts2[i2].outerHTML = subbody;
				}
			}
		};
		var xsltforms_init = function () {
			try {
				xftrans();
				xsltforms_initImpl();
			} catch(e) {
				alert("XSLTForms Exception\n--------------------------\n\nIncorrect Javascript code generation:\n\n"+(typeof(e.stack)==="undefined"?"":e.stack)+"\n\n"+(e.name?e.name+(e.message?"\n\n"+e.message:""):e));
			}
		};
		if (document.readyState === "complete") {
			xsltforms_init();
		} else {
			addLoadListener(xsltforms_init);
		}
	})();
}
