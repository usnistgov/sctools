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
    <xsl:param name="destdir"/>
    
    <xsl:function name="nist:filename" as="xs:string">
        <xsl:param name="compid" as="xs:string"/>
        <xsl:variable name="href" select="fn:substring-after($compid, '_comp_')"/>
        <xsl:choose>
            <xsl:when test="fn:ends-with($href, '.xml')">
                <xsl:sequence select="$href"/>                
            </xsl:when>
            <xsl:otherwise>
                <xsl:sequence select="fn:concat($href, '.xml')"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:function>
    
    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="*[contains(
        @class, 
        ' map/map ')]">
        <xsl:message>Entering map</xsl:message>
        <xsl:apply-templates select="*[contains(
            @class,
            ' map/topicref ')]"/>
    </xsl:template>

    <xsl:template match="*[contains(
        @class,
        ' map/topicref ')]">
        <xsl:message>Entering topicref</xsl:message>
        <xsl:apply-templates select="document(@href)"/>
    </xsl:template>
    
    <xsl:template match="sds:data-stream-collection">
        <xsl:message>Entering sds:data-stream-collection</xsl:message>
        <xsl:apply-templates select="sds:component"/>
    </xsl:template>
        
    <xsl:template match="sds:component">
        <xsl:message>Entering sds:component</xsl:message>
        <xsl:message>destdir=</xsl:message>
        <xsl:message select="$destdir"/>
        <xsl:message>@id=</xsl:message>
        <xsl:message select="@id"/>
        <xsl:message>nist:filename(@id)=</xsl:message>
        <xsl:message select="nist:filename(@id)"/>
        <xsl:result-document href="fn:concat($destdir, '/', nist:filename(@id))">
            <xsl:message>Creating result document</xsl:message>
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