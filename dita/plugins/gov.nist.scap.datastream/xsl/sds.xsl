<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:nist="http://www.nist.gov"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:sds="http://scap.nist.gov/schema/scap/source/1.2" 
    xmlns:cat="urn:oasis:names:tc:entity:xmlns:xml:catalog"
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    exclude-result-prefixes="xs nist fn"
    version="2.0">
    
    <xsl:output indent="yes" method="xml"/>
    
    <xsl:variable name="reverse-dns" select="//@reverseDNS"/>
    
    <xsl:function name="nist:scap-id" as="xs:string">
        <xsl:param name="type" as="xs:string"/>
        <xsl:param name="short-id" as="xs:string"/>
        <xsl:value-of select="fn:string-join(('scap', $reverse-dns, $type, $short-id), '_')"/>
    </xsl:function>
    
    <!-- DataStreamCollection -->
    <xsl:template match="*[contains(
        @class, 
        ' scapDataStreamCollection/scapDataStreamCollection ')]">
        <sds:data-stream-collection 
            id="{nist:scap-id('collection', @scapName)}"
            schematron-version="{@schematronVersion}">
            <xsl:apply-templates select="*[contains(
                @class,
                ' scapDataStream-d/scapDataStream ')]"/>
            <xsl:apply-templates select="*[contains(
                @class,
                ' scapDataStreamCollection/scapComponent ') and @format='xml']"/>
        </sds:data-stream-collection>
    </xsl:template>
    
    <!-- DataStream -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapDataStream ')]">
        <sds:data-stream 
            id="{nist:scap-id('datastream', @scapName)}"
            scap-version="{@scapVersion}" 
            timestamp="{fn:current-dateTime()}" 
            use-case="{@useCase}">
            <xsl:apply-templates/>
        </sds:data-stream>
    </xsl:template>
    
    <!-- Dictionaries -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapDictionaries ')]">
        <sds:dictionaries> 
            <xsl:apply-templates/>
        </sds:dictionaries>
    </xsl:template>
    
    <!-- Checklists -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapChecklists ')]">
        <sds:checklists> 
            <xsl:apply-templates/>
        </sds:checklists>
    </xsl:template>

    <!-- Checks -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapChecks ')]">
        <sds:checks> 
            <xsl:apply-templates/>
        </sds:checks>
    </xsl:template>
    
    <!-- Named template for component references -->
    <xsl:template name="cref">
        <sds:component-ref 
            id="{nist:scap-id('cref', @keyref)}" 
            xlink:href="#{nist:scap-id('comp', @keyref)}">
            <xsl:apply-templates select="*[contains(
                @class,
                ' scapDataStream-d/scapExternalLinks ')]"/>
        </sds:component-ref>
    </xsl:template>
    
    <!-- CpeListRef -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapCpeListRef ')]">
        <xsl:call-template name="cref"/>
    </xsl:template>
    
    <!-- BenchmarkRef -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapBenchmarkRef ')]">
        <xsl:call-template name="cref"/>
    </xsl:template>
    
    <!-- TailoringRef -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapTailoringRef ')]">
        <xsl:call-template name="cref"/>
    </xsl:template>
    
    <!-- OvalRef or OcilRef -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapOvalRef ') or contains(
        @class,
        ' scapDataStream-d/scapOcilRef ')]">
        <xsl:call-template name="cref"/>
    </xsl:template>
    
    <!-- ExternalLinks -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapExternalLinks ')]">
        <cat:catalog>
            <xsl:apply-templates/>
        </cat:catalog>
    </xsl:template>
    
    <!-- Uri -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStream-d/scapUri ')]">
        <xsl:element name="cat:uri">
            <xsl:attribute name="name">
                <xsl:choose>
                    <xsl:when test="@localUri">
                        <xsl:value-of select="@localUri"/>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="@href"/>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            <xsl:attribute name="uri">
                <xsl:value-of select="fn:concat('#', nist:scap-id('cref', @keyref))"/>
            </xsl:attribute>
        </xsl:element>
        <!--<cat:uri 
            name="{@href}" 
            uri="#{nist:scap-id('cref', @keyref)}"/>-->
    </xsl:template>
    
    <!-- Component -->
    <xsl:template match="*[contains(
        @class,
        ' scapDataStreamCollection/scapComponent ') and @format='xml']">
        <sds:component 
            id="{nist:scap-id('comp', @keys)}" 
            timestamp="{fn:current-dateTime()}">
             <xsl:apply-templates select="document(@href)"/>
        </sds:component>
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