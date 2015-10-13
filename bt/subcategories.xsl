<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="core">
    <subCategories>
      <xsl:apply-templates select="function"/>
    </subCategories>
  </xsl:template>

  <xsl:template match="function">
    <xsl:apply-templates select="category"/>
  </xsl:template>

  <xsl:template match="category">
    <xsl:apply-templates select="subCategory"/>
  </xsl:template>

  <xsl:template match="subCategory">
    <id>
      <xsl:value-of select="@id"/>
    </id>
  </xsl:template>

</xsl:stylesheet>
