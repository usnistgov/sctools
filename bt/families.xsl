<!-- $Id: families.xsl,v 1.1 2014/12/12 18:08:54 lubell Exp $-->
<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:c="http://scap.nist.gov/schema/sp800-53/2.0"
    xmlns:controls="http://scap.nist.gov/schema/sp800-53/feed/2.0">

  <xsl:output method="xml" indent="yes"/>

  <xsl:key name="families"
	   match="controls:control"
	   use="c:family"/>

  <xsl:template match="/">
    <families>
    <xsl:for-each 
	select="//controls:control
		[generate-id() =
		generate-id(key('families',c:family)[1])]">
      <xsl:variable name="fam" select="c:family"/>
    <family>
      <xsl:attribute name="name">
	<xsl:apply-templates select="$fam"/>
      </xsl:attribute>
      <xsl:apply-templates select="//controls:control[c:family=$fam]"/>
    </family>
    </xsl:for-each>
    </families>
  </xsl:template>

  <xsl:template match="controls:control">
    <xsl:if test="not(c:withdrawn)">
      <xsl:variable name="controlID" select="c:number"/>
      <control number="{$controlID}">
	<title>
	  <xsl:apply-templates select="c:title"/>
	</title>
	<dropDownLabel>
	  <xsl:value-of select="c:number"/>
	  <xsl:text> - </xsl:text>
	  <xsl:value-of select="c:title"/>
	</dropDownLabel>
	<default>
	  <xsl:choose>
	    <xsl:when test="c:baseline-impact = 'LOW'">1</xsl:when>
	    <xsl:when test="c:baseline-impact = 'MODERATE'">2</xsl:when>
	    <xsl:when test="c:baseline-impact = 'HIGH'">3</xsl:when>
	    <xsl:otherwise>4</xsl:otherwise>
	  </xsl:choose>
	</default>
	<priority>
	  <xsl:choose>
	    <xsl:when test="c:priority = 'P0'">4</xsl:when>
	    <xsl:when test="c:priority = 'P1'">1</xsl:when>
	    <xsl:when test="c:priority = 'P2'">2</xsl:when>
	    <xsl:when test="c:priority = 'P3'">3</xsl:when>
	    <xsl:otherwise/>
	  </xsl:choose>
	</priority>
	<xsl:for-each select="document('bt-model/core.xml')//sp800-53">
	  <xsl:if test="control = $controlID or family= substring-before($controlID, '-')">
	    <subcategory number="{../@id}"/>
	  </xsl:if>
	</xsl:for-each>
      </control>
    </xsl:if>
  </xsl:template>

  <xsl:template match="text()">
    <xsl:copy/>
  </xsl:template>

</xsl:stylesheet>
