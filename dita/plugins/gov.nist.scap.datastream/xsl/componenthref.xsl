<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs sds"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    <xsl:param name="componentkey" as="xs:string"/>
    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="*[contains(@class, 
        ' scapDataStreamCollection/scapDataStreamCollection ')]">
        <xsl:choose>
            <xsl:when test="not(*[contains(@class, 
                ' scapDataStreamCollection/scapComponent ') and
                @keys=$componentkey])">
                <xsl:message terminate="yes">
                    <xsl:text>Component key '</xsl:text>
                    <xsl:value-of select="$componentkey"/>
                    <xsl:text>' does not exist.</xsl:text>
                </xsl:message>
            </xsl:when>
            <xsl:otherwise>
                <root>
                    <properties>
                        <xsl:apply-templates select="*[contains(@class, 
                            ' scapDataStreamCollection/scapComponent ')]"/>
                    </properties>
                </root>                
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <xsl:template match="*[contains(@class, 
        ' scapDataStreamCollection/scapComponent ')]">
        <xsl:if test="@keys=$componentkey">
            <scapcomponenthref>
                <xsl:value-of select="@href"/>
            </scapcomponenthref>           
        </xsl:if>        
    </xsl:template>
       
</xsl:stylesheet>