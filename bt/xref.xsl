<!-- Takes families.xml as input. Using core.xml, adds cyber framework subcategories referencing each control. Strips all irrelevant info. -->

<xsl:stylesheet 
    version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="families">
    <families>
      <xsl:apply-templates select="family"/>
    </families>
  </xsl:template>

  <xsl:template match="family">
    <family name="{@name}">
      <xsl:apply-templates select="control"/>
    </family>
  </xsl:template>

  <xsl:template match="control">
    <xsl:variable name="controlID" select="@number"/>
    <control number="{$controlID}">
      <xsl:for-each select="document('core.xml')//sp800-53">
	<xsl:if test="control = $controlID or family= substring-before($controlID, '-')">
	  <subcategory number="{../@id}"/>
	</xsl:if>
      </xsl:for-each>
    </control>
  </xsl:template>

</xsl:stylesheet>
