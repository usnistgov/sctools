<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
    xmlns:cat="urn:oasis:names:tc:entity:xmlns:xml:catalog"
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    exclude-result-prefixes="xs fn"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    
    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="sds:data-stream-collection">
        <xsl:apply-templates select="sds:component"/>
    </xsl:template>
        
    <xsl:template match="sds:component">
        <xsl:result-document href="{fn:substring-after(@id, '_comp_')}.xml">
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