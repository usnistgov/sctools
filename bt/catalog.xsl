<?xml version="1.0" encoding="iso-8859-1"?>
<!-- $Id: catalog.xsl,v 1.2 2014/12/12 20:25:52 lubell Exp $-->
<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:c="http://scap.nist.gov/schema/sp800-53/2.0"
    xmlns:controls="http://scap.nist.gov/schema/sp800-53/feed/2.0">

  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="controls:controls">
    <controls>
      <xsl:apply-templates/>
    </controls>
  </xsl:template>

  <xsl:template match="controls:control">
    <xsl:if test="not(c:withdrawn)">
      <control>
	<xsl:attribute name="number">
	  <xsl:apply-templates select="c:number"/>
	</xsl:attribute>
	<title>
	  <xsl:apply-templates select="c:title"/>
	</title>
	<default>
	  <xsl:choose>
	    <xsl:when test="c:baseline-impact">
	      <xsl:apply-templates select="c:baseline-impact"/>
	    </xsl:when>
	    <xsl:otherwise>4</xsl:otherwise>
	  </xsl:choose>
	</default>
	<xsl:apply-templates select="c:control-enhancements"/>
      </control>
    </xsl:if>
  </xsl:template>

  <xsl:template match="c:baseline-impact">
    <xsl:choose>
      <xsl:when test=". = 'LOW'">1</xsl:when>
      <xsl:when test=". = 'MODERATE'">2</xsl:when>
      <xsl:when test=". = 'HIGH'">3</xsl:when>
      <xsl:otherwise>4</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
 
  <xsl:template match="c:control-enhancements">
    <xsl:apply-templates select="c:control-enhancement"/>
  </xsl:template>

  <xsl:template match="c:control-enhancement">
    <xsl:if test="not(c:withdrawn)">
      <enhancement>
	<xsl:attribute name="number">
	  <xsl:apply-templates select="c:number"/>
	</xsl:attribute>
	<title>
	  <xsl:apply-templates select="c:title"/>
	</title>
	<default>
	  <xsl:choose>
	    <xsl:when test="c:baseline-impact">
	      <xsl:apply-templates select="c:baseline-impact"/>
	    </xsl:when>
	    <xsl:otherwise>4</xsl:otherwise>
	  </xsl:choose>
	</default>
      </enhancement>
    </xsl:if>
  </xsl:template>

  <xsl:template match="c:control-enhancement/c:number">
    <xsl:value-of select="substring-before(substring-after(.,'('),')')"/>
  </xsl:template>

  <xsl:template match="text()">
    <xsl:copy/>
  </xsl:template>

</xsl:stylesheet>
