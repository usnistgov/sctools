<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:html="http://www.w3.org/1999/xhtml"
    xmlns:xf="http://www.w3.org/2002/xforms"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:ev="http://www.w3.org/2001/xml-events"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:param name="updated"/>
    
    <xsl:template match="html:head">
        <xsl:copy>
            <xsl:apply-templates select="html:title"/>
            <html:link xmlns="http://www.w3.org/1999/xhtml" rel="stylesheet" href="nist_github_header.css" type="text/css"/>
            <xsl:apply-templates select="html:link"/>
            <xsl:apply-templates select="document('analytics.xml')"/>
            <xsl:apply-templates select="xf:model"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="html:body">
        <xsl:copy>
            <xsl:apply-templates select="document('insert/nist-header.xml')"/>
            <xsl:apply-templates/>
            <xsl:apply-templates select="document('insert/nist-footer.xml')"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="xf:instance">
        <xf:instance>
            <xsl:if test="@id">
                <xsl:attribute name="id" select="@id"/>
            </xsl:if>
            <xsl:choose>
                <xsl:when test="@src">
                    <xsl:apply-templates select="document(@src)"/>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:apply-templates/>
                </xsl:otherwise>
            </xsl:choose>
        </xf:instance>
    </xsl:template>
    
    <xsl:template match="//updated">
        <xsl:copy>
            <xsl:value-of select="$updated"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="//xf:textarea[@class='Guidance']">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:attribute name="delay">500</xsl:attribute>
            <xsl:apply-templates/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    
</xsl:stylesheet>