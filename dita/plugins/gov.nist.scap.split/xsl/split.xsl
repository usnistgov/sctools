<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:nist="http://www.nist.gov"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
    xmlns:cat="urn:oasis:names:tc:entity:xmlns:xml:catalog"
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    exclude-result-prefixes="xs fn nist"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    
    <xsl:function name="nist:filename" as="xs:string">
        <xsl:param name="compid" as="xs:string"/>
        <xsl:variable name="href" select="fn:substring-after($compid, '_comp_')"/>
        <xsl:choose>
            <xsl:when test="fn:ends-with($href, '.xml')">
                <xsl:value-of select="$href"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select="fn:concat($href, '.xml')"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>

    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="*[contains(
        @class, 
        ' map/map ')]">
        <xsl:message>Matching DITA map</xsl:message>
        <xsl:apply-templates select="*[contains(
            @class,
            ' map/topicref ')]"/>
    </xsl:template>

    <xsl:template match="*[contains(
        @class,
        ' map/topicref ')]">
        <xsl:message>Matching topicref</xsl:message>
        <xsl:apply-templates select="document(@href)"/>
    </xsl:template>
    
    <xsl:template match="sds:data-stream-collection">
        <xsl:message>
            <xsl:text>Matching data stream collection id=</xsl:text>
            <xsl:value-of select="@id"/>
        </xsl:message>
        <xsl:apply-templates select="sds:component"/>
    </xsl:template>
        
    <xsl:template match="sds:component">
        <xsl:message>
            <xsl:text>Matching component id=</xsl:text>
            <xsl:value-of select="@id"/>
        </xsl:message>
        <xsl:variable name="filename" select="nist:filename(@id)" as="xs:string"/>
        <xsl:result-document href="{$filename}">
            <xsl:message>
                <xsl:text>Creating file </xsl:text>
                <xsl:value-of select="$filename"/>
            </xsl:message>
            <xsl:apply-templates select="*"/>            
        </xsl:result-document>
    </xsl:template>
       
    <!-- Identity transform -->
    <xsl:template match="*">
        <xsl:copy>
            <xsl:copy-of select="@*" />
            <xsl:apply-templates />
        </xsl:copy>
    </xsl:template>    
    <xsl:template match="comment()|processing-instruction()">
        <xsl:copy />
    </xsl:template>

</xsl:stylesheet>