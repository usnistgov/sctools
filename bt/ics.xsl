<!DOCTYPE xsl:stylesheet [
<!ENTITY colonExpr "\s*:\s*">
<!ENTITY commaExpr "\s*,\s*">
<!ENTITY ptExpr "[\-0-9\.]+pt">
<!ENTITY semicolonExpr "\s*;">
<!ENTITY colonPtSemicolonExpr "&colonExpr;&ptExpr;&semicolonExpr;">
<!--<!ENTITY times-new-roman "font-family&colonExpr;.Times New Roman.&commaExpr;serif&semicolonExpr;">
<!ENTITY arial "font-family: Arial, sans-serif;">-->
<!ENTITY font-size "font-size&colonPtSemicolonExpr;">
<!ENTITY text-indent "text-indent&colonPtSemicolonExpr;">
<!ENTITY text-decoration "text-decoration&colonExpr;[a-z]+&semicolonExpr;">
<!ENTITY line-height "line-height&colonPtSemicolonExpr;">
<!-- <!ENTITY width "^width&colonPtSemicolonExpr;"> -->
<!ENTITY width "^width&colonPtSemicolonExpr;">
]>
<xsl:stylesheet 
    version="2.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:c="http://www.nist.gov/sp800-53"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output indent="yes"/>

  <xsl:template match="/">
    <xsl:result-document method="text" href="ics/ics.css">
      <xsl:value-of select="fn:replace(/h:html/h:head/h:style, '(&text-decoration;)|(&font-size;)', '')"/>
<!--      <xsl:value-of select="fn:replace(fn:replace(/h:html/h:head/h:style, '(&text-decoration;)|(&font-size;)', ''), '&times-new-roman;', '&arial;')"/>-->
    </xsl:result-document>
    <xsl:for-each select="/h:html/h:body/c:control">
      <xsl:variable name="cname" select="substring-before(h:p[1], ' ')"/>
      <xsl:variable name="filename" select="concat($cname, '.html')"/>
      <xsl:result-document method="xhtml" href="ics/{$filename}">
	<html>
	  <head>
	    <title>
	      <xsl:text>ICS: </xsl:text>
	      <xsl:value-of select="$cname"/>
	    </title>
	    <link href="ics.css" rel="stylesheet" type="text/css"/>
	  </head>
	  <body>
	    <xsl:apply-templates/>
	  </body>
	</html>
      </xsl:result-document>
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="@style">
    <xsl:attribute name="style">
      <xsl:value-of select="fn:replace(., '(&text-indent;)|(&line-height;)|(&width;)', '')"/>
    </xsl:attribute>
  </xsl:template>

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
