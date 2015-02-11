<?xml version="1.0" encoding="iso-8859-1"?>
<!-- $Id: flag.xsl,v 1.1 2015/01/08 22:23:55 lubell Exp $-->
<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="rationale[@flag='false']">
    <rationale flag="false"/>
  </xsl:template>

  <xsl:template match="guidance[@flag='false']">
    <guidance flag="false"/>
  </xsl:template>

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>
