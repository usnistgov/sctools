<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
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
                <scapcomponenthref>
                    <xsl:value-of 
                        select="*[contains(@class, 
                        ' scapDataStream-d/scapComponent ') and 
                        @keys=$componentkey]/@href"/>
                </scapcomponenthref>
            </properties>
        </root>
    </xsl:template>
    
    <!--<xsl:template match="*[contains(@class, 
        ' scapDataStream-d/scapBenchmarkRef ') or
        contains(@class, 
        ' scapDataStream-d/scapOvalRef ') or
        contains(@class, 
        ' scapDataStream-d/scapOcilRef ')]">
        <java jar="${{sds.scapval}}" fork="true" dir="${{dita.output.dir}}">
            <arg line="-componentfile {@href}"/>
        </java>
    </xsl:template>-->
       
</xsl:stylesheet>