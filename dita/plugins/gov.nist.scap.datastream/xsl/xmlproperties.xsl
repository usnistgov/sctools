<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
    exclude-result-prefixes="sds"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    
    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="sds:data-stream-collection">
        <xsl:result-document href="scapversion.xml">
            <root>
                <properties>
                    <scapversion>
                        <xsl:value-of select="sds:data-stream[1]/@scap-version"/>
                    </scapversion>
                </properties>
            </root>
        </xsl:result-document>
    </xsl:template>
       
</xsl:stylesheet>