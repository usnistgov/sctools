<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    <xsl:template match="/processing-instruction()"/>
    
    <xsl:template match="*[contains(@class, 
        ' scapDataStreamCollection/scapDataStreamCollection ')]">
        <project>
            <target name="dita2sds.scapval-components">
                <xsl:apply-templates select="//*[contains(@class, 
                    ' scapDataStream-d/scapBenchmarkRef ')]"/>
                <xsl:apply-templates select="//*[contains(@class, 
                    ' scapDataStream-d/scapOvalRef ')]"/>
                <xsl:apply-templates select="//*[contains(@class, 
                    ' scapDataStream-d/scapOcilRef ')]"/>
            </target>
        </project>
    </xsl:template>
    
    <xsl:template match="*[contains(@class, 
        ' scapDataStream-d/scapBenchmarkRef ') or
        contains(@class, 
        ' scapDataStream-d/scapOvalRef ') or
        contains(@class, 
        ' scapDataStream-d/scapOcilRef ')]">
        <java jar="${{sds.scapval}}" fork="true" dir="${{dita.output.dir}}">
            <arg line="-componentfile {@href}"/>
        </java>
    </xsl:template>
       
</xsl:stylesheet>