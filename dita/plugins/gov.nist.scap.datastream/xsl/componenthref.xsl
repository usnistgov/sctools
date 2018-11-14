<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    <xsl:param name="componentkey" as="xs:string"/>
    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="*[contains(@class, 
        ' scapDataStreamCollection/scapDataStreamCollection ')]">
        <root>
            <properties>
                <xsl:choose>
                    <xsl:when test="*[contains(@class, 
                        ' scapDataStreamCollection/scapComponent ') and 
                        @keys=$componentkey]">
                        <xsl:apply-templates select="*[contains(@class, 
                            ' scapDataStreamCollection/scapComponent ') and 
                            @keys=$componentkey]"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:message terminate="yes">
                            <xsl:text>No SCAP component with key '</xsl:text>
                            <xsl:value-of select="$componentkey"/>
                            <xsl:text>'</xsl:text>
                        </xsl:message>
                    </xsl:otherwise>
                </xsl:choose>
            </properties>
        </root>
    </xsl:template>
    
    <xsl:template match="*[contains(@class, 
        ' scapDataStreamCollection/scapComponent ') and 
        @keys=$componentkey]">
        <scapcomponenthref>
            <xsl:value-of select="@href"/>
        </scapcomponenthref>
    </xsl:template>
    
</xsl:stylesheet>