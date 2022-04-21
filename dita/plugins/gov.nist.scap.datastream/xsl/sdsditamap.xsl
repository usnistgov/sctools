<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"
        doctype-public="-//OASIS//DTD DITA Map//EN"
        doctype-system="map.dtd"/>
    <xsl:param name="sdsuri"/>
    
    <xsl:template match="*[contains(
        @class, 
        ' scapDataStreamCollection/scapDataStreamCollection ')]">
        <map>
            <topicref 
                format="xml"
                scope="local"
                processing-role="resource-only"
                href="{$sdsuri}"/>
        </map>
    </xsl:template>
    
</xsl:stylesheet>