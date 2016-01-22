<xsl:stylesheet 
    version="2.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:h="http://www.w3.org/1999/xhtml"
    xmlns:c="http://www.nist.gov/sp800-53"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output indent="yes"/>

  <xsl:template match="/">
    <xsl:result-document method="text" href="ics/ics.css">
      <xsl:value-of select="/h:html/h:head/h:style"/>
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

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
