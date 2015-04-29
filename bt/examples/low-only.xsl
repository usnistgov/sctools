<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs"
  version="1.0">
  <xsl:output indent="yes" method="xml"/>
  <xsl:strip-space elements="tailoredBaseline tailoredControl control enhancement"/>
  <xsl:template priority="1" match="enhancement">
    <xsl:if test="impact[@value='1']">
      <xsl:copy>
        <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>      
    </xsl:if>
  </xsl:template>
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>