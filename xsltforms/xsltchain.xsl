<?xml version="1.0" encoding="UTF-8"?>
<!--
Copyright (C) 2008-2012 agenceXML - Alain COUTHURES
Contact at : info@agencexml.com

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
	-->
<xsl:stylesheet xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dcterms="http://purl.org/dc/terms/" xmlns="http://www.w3.org/1999/xhtml" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" exclude-result-prefixes="xhtml"><rdf:RDF>
		<rdf:Description rdf:about="http://www.agencexml.com/xsltforms/xsltchain.xsl">
			<dcterms:title>XSLT 1.0 Stylesheet for chaining XSLT 1.0 transformations in browser</dcterms:title>
			<dcterms:hasVersion>1</dcterms:hasVersion>
			<dcterms:creator>Alain Couthures - agenceXML</dcterms:creator>
			<dcterms:conformsTo></dcterms:conformsTo>
			<dcterms:created>2012-10-09</dcterms:created>
			<dcterms:description>Processing instructions to be used: xml-stylesheet-chain instead of xml-stylesheet. Transformations are performed in the processing instructions order.</dcterms:description>
			<dcterms:format>text/xsl</dcterms:format>
		</rdf:Description>
	</rdf:RDF><xsl:output method="html" encoding="utf-8" omit-xml-declaration="yes" indent="no" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
		<xsl:template match="/">
			<html xmlns="http://www.w3.org/1999/xhtml">
				<xsl:comment>XSLT Chain - Copyright (C) 2012 &lt;agenceXML&gt; - Alain COUTHURES - http://www.agencexml.com</xsl:comment>
				<head>
					<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
					<script type="text/javascript">
						<![CDATA[
var ltchar = "&lt;";
var isEscaped = ltchar.length != 1;
var b = navigator.userAgent.match(/\bMSIE\b/);
if (b) {
	b = !navigator.userAgent.match(/\bOpera\b/);
}
if (b) {
	var MSXMLver = "3.0";
	try {
		var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
		xmlDoc = null;
		MSXMLver = "6.0";
	} catch(e) {
	}
	var transform = function(xml, xslt) {
		var xmlDoc = new ActiveXObject("MSXML2.DOMDocument." + MSXMLver);
		xmlDoc.setProperty("AllowDocumentFunction", true);
		xmlDoc.validateOnParse = false;
		xmlDoc.loadXML(xml);
		var xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument." + MSXMLver);
		xslDoc.setProperty("AllowDocumentFunction", true);
		xslDoc.validateOnParse = false;
		xslDoc.async = false;
		xslDoc.load(xslt.href);
		var xslTemplate = new ActiveXObject("MSXML2.XSLTemplate." + MSXMLver);
		xslTemplate.stylesheet = xslDoc;
		var xslProc = xslTemplate.createProcessor();
		xslProc.input = xmlDoc;
		for (var param in xslt) {
			if (param !== "type") {
				if (param !== "href") {
					xslProc.addParameter(param, xslt[param], "");
				}
			}
		}
		xslProc.transform();
		return xslProc.output;
	};
} else {
	var transform = function(xml, xslt) {
		var parser = new DOMParser();
		var serializer = new XMLSerializer();
		var xmlDoc = parser.parseFromString(xml, "text/xml");
		var xsltDoc;
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", xslt.href, false);
		xhttp.send("");
		var b = xhttp.responseXML != undefined;
		if (b) {
			b = xhttp.responseXML.xml !== "";
		}
		if (b) {
			xsltDoc = xhttp.responseXML;
		} else {
			var xsltContent = xhttp.responseText;
			xsltDoc = parser.parseFromString(xsltContent, "text/xml");
		}
		var xsltProcessor = new XSLTProcessor();
		for (var param in xslt) {
			if (param !== "type") {
				if (param !== "href") {
					xsltProcessor.setParameter(null, param, xslt[param]);
				}
			}
		}
		xsltProcessor.importStylesheet(xsltDoc);
		try {
			var resultDocument = xsltProcessor.transformToDocument(xmlDoc);
			var s = "";
			b = navigator.userAgent.match(/\bGecko\b/);
			if (b) {
				b = resultDocument.documentElement.nodeName === "transformiix:result";
			}
			if (b) {
				s = resultDocument.documentElement.textContent;
			} else {
				s = serializer.serializeToString(resultDocument);
			}
			return s;
		} catch (e2) {
			return "";
		}
	};
}
var unescape = function(xml) {
	if (!xml) {
		return "";
	}
	var regex_escapepb = new RegExp("^\s*"+String.fromCharCode(60));
	if (!xml.match(regex_escapepb)) {
		var regex_lt = new RegExp(String.fromCharCode(38)+"lt;", "g");
		var regex_gt = new RegExp(String.fromCharCode(38)+"gt;", "g");
		var regex_amp = new RegExp(String.fromCharCode(38)+"amp;", "g");
		xml = xml.replace(regex_lt, String.fromCharCode(60));
		xml = xml.replace(regex_gt, String.fromCharCode(62));
		xml = xml.replace(regex_amp, "&");
	}
	return xml;
};
						]]>
					</script>
					<script type="text/javascript">
var xslts = [];
<xsl:for-each select="/processing-instruction('xml-chain')">
xslts.push(<xsl:call-template name="pi2json"><xsl:with-param name="pi" select="."/></xsl:call-template>);
</xsl:for-each>
var s = '<xsl:apply-templates select="*" mode="xml2string"><xsl:with-param name="root" select="true()"/></xsl:apply-templates>';
if (isEscaped) {
	s = unescape(s);
}
					</script>
					<script type="text/javascript">
						<![CDATA[
function chain() {
	for (var i = 0, l = xslts.length; i != l; i++) {
		s = transform(s, xslts[i]);
	}
	if (s.indexOf(String.fromCharCode(60)+"?", 0) === 0) {
		s = s.substr(s.indexOf("?"+String.fromCharCode(62))+2);
	}
	if (document.write) {
		document.write(s);
		document.close();
	} else {
		document.documentElement.innerHTML = s;
	}
}
						]]>
					</script>
				</head>
				<body onload="chain()">
				</body>
			</html>
		</xsl:template>
		<xsl:template name="pi2json">
			<xsl:param name="pi"/>
			<xsl:param name="prev">{</xsl:param>
			<xsl:choose>
				<xsl:when test="normalize-space($pi) = ''">
					<xsl:value-of select="$prev"/>
					<xsl:text>}</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="contains($pi,'=')">
							<xsl:variable name="prev2">
								<xsl:choose>
									<xsl:when test="string-length($prev) = 1">
										<xsl:value-of select="$prev"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat($prev,', ')"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:variable>
							<xsl:variable name="val0" select="substring-after($pi, '=')"/>
							<xsl:variable name="sep" select="substring(normalize-space($val0), 1, 1)"/>
							<xsl:variable name="val" select="concat($sep,substring-before(substring-after($val0,$sep),$sep),$sep)"/>
							<xsl:call-template name="pi2json">
								<xsl:with-param name="pi" select="substring-after($pi, $val)"/>
								<xsl:with-param name="prev" select="concat($prev2,normalize-space(substring-before($pi,'=')),':',$val)"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:when test="contains($pi,' ')">
							<xsl:call-template name="pi2json">
								<xsl:with-param name="pi" select="substring-after($pi, ' ')"/>
								<xsl:with-param name="prev" select="$prev"/>
							</xsl:call-template>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="pi2json">
								<xsl:with-param name="prev" select="$prev"/>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:template>
		<xsl:template match="processing-instruction()" mode="xml2string">
			<xsl:if test="name() != 'xml-stylesheet-chain'">
				<xsl:text>&lt;?</xsl:text> 
				<xsl:value-of select="name()"/> 
				<xsl:text> </xsl:text> 
				<xsl:value-of select="."/> 
				<xsl:text>?&gt;</xsl:text>
			</xsl:if>
		</xsl:template>
		<xsl:template match="*" mode="xml2string">
			<xsl:param name="root"/>
			<xsl:text>&lt;</xsl:text>
			<xsl:value-of select="name()"/>
			<xsl:variable name="parent" select=".."/>
			<xsl:variable name="element" select="."/>
			<xsl:choose>
				<xsl:when test="namespace::*">
					<xsl:for-each select="(namespace::* | @*/namespace::*)[name()!='xml']">
						<xsl:variable name="prefix" select="name()"/>
						<xsl:variable name="uri" select="."/>
						<xsl:if test="(not($parent/namespace::*[name()=$prefix and . = $uri]) or $root) and (($element|$element//*|$element//@*)[namespace-uri()=$uri])"> xmlns<xsl:if test="$prefix">:<xsl:value-of select="$prefix"/></xsl:if>="<xsl:value-of select="$uri"/>"</xsl:if>
					</xsl:for-each>
				</xsl:when>
				<xsl:otherwise>
					<xsl:variable name="prefixes"><xsl:for-each select="(. | @*)[name() != local-name() and not(starts-with(name(), 'xml:'))]"><xsl:sort select="substring-before(name(),':')"/><xsl:value-of select="substring-before(name(),':')"/>:<xsl:value-of select="namespace-uri()"/>|</xsl:for-each></xsl:variable>
					<xsl:call-template name="nmdecls"><xsl:with-param name="pfs" select="$prefixes"/></xsl:call-template>
					<xsl:if test="name() = local-name() and ($root or namespace-uri() != namespace-uri($parent))"> xmlns="<xsl:value-of select="namespace-uri()"/>"</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:apply-templates select="@*" mode="xml2string"/>
			<xsl:choose>
				<xsl:when test="node()">&gt;<xsl:apply-templates select="node()" mode="xml2string"><xsl:with-param name="root" select="false()"/></xsl:apply-templates>&lt;/<xsl:value-of select="name()"/>&gt;</xsl:when>
				<xsl:otherwise>/&gt;</xsl:otherwise>
			</xsl:choose>
			<xsl:text/>
		</xsl:template>
		<xsl:template match="text()" mode="xml2string">
			<xsl:call-template name="escapeEntities"><xsl:with-param name="text" select="."/></xsl:call-template>
		</xsl:template>
		<xsl:template match="@*" mode="xml2string">
			<xsl:text> </xsl:text>
			<xsl:value-of select="name()"/>
			<xsl:text>="</xsl:text>
			<xsl:call-template name="escapeEntities"><xsl:with-param name="text" select="."/></xsl:call-template>
			<xsl:text>"</xsl:text>
		</xsl:template>
		<xsl:template name="escapeEntities">
			<xsl:param name="text"/>
			<xsl:param name="entities">&amp;.&amp;amp;.&apos;.&amp;apos;.&lt;.&amp;lt;.&gt;.&amp;gt;.&quot;.&amp;quot;.\.\\.&#xA;.\n.&#8232;.\n.&#xD;.\r.</xsl:param>
			<xsl:variable name="entity" select="substring-before($entities,'.')"/>
			<xsl:choose>
				<xsl:when test="contains($text, $entity)">
					<xsl:variable name="text2" select="substring-before($text,$entity)"/>
					<xsl:variable name="last" select="substring($text2, string-length($text2), 1)"/>
					<xsl:variable name="lastn" select="substring(normalize-space($text2), string-length(normalize-space($text2)), 1)"/>
					<xsl:variable name="text3"><xsl:choose><xsl:when test="$entity = '&#10;' and $last != $lastn and $last != ' ' and $last != '&#9;'"><xsl:value-of select="substring($text2,1,string-length($text2)-1)"/></xsl:when><xsl:otherwise><xsl:value-of select="$text2"/></xsl:otherwise></xsl:choose></xsl:variable>
					<xsl:call-template name="escapeEntities">
						<xsl:with-param name="text" select="$text3"/>
						<xsl:with-param name="entities" select="substring-after(substring-after($entities,'.'),'.')"/>
					</xsl:call-template>
					<xsl:value-of select="substring-before(substring-after($entities,'.'), '.')"/>
					<xsl:call-template name="escapeEntities">
						<xsl:with-param name="text" select="substring-after($text,$entity)"/>
						<xsl:with-param name="entities" select="$entities"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="substring-after(substring-after($entities,'.'),'.') != ''">
					<xsl:call-template name="escapeEntities">
						<xsl:with-param name="text" select="$text"/>
						<xsl:with-param name="entities" select="substring-after(substring-after($entities,'.'),'.')"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$text"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:template>
		<xsl:template name="nmdecls">
			<xsl:param name="prev"/>
			<xsl:param name="pfs"/>
			<xsl:if test="contains($pfs, '|')">
				<xsl:variable name="prev2" select="substring-before($pfs,':')"/>
				<xsl:if test="$prev2 != $prev"> xmlns:<xsl:value-of select="$prev2"/>="<xsl:value-of select="substring-before(substring-after($pfs,':'),'|')"/>"</xsl:if>
				<xsl:call-template name="nmdecls">
					<xsl:with-param name="prev" select="$prev2"/>
					<xsl:with-param name="pfs" select="substring-after($pfs, '|')"/>
				</xsl:call-template>
			</xsl:if>
		</xsl:template>
	</xsl:stylesheet>
