<xsl:stylesheet 
    version="2.0"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:c="http://www.nist.gov/sp800-53"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml"/>

  <xsl:template match="/">
    <xsl:for-each select="//c:control">
      <xsl:variable name="filename" select="concat(substring-before(p, ' '), '.xml')"/>
      <xsl:message>
	<xsl:value-of select="$filename"/>
      </xsl:message>
<!--      <xsl:result-document method="xml" href="../ics/{fn:substring-before(p[1], ' ')}.xml">
	<foo/>
      </xsl:result-document>-->
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="p">
    <xsl:message>foo</xsl:message>
  </xsl:template>

</xsl:stylesheet>
