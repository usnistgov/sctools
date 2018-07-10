<?xml version="1.0" encoding="UTF-8"?>
<!-- Prunes unreferenced tests, objects, and states from an OVAL definitions file. -->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns="http://oval.mitre.org/XMLSchema/oval-definitions-5"
    xmlns:ovaldef="http://oval.mitre.org/XMLSchema/oval-definitions-5"
    xmlns:ind-def="http://oval.mitre.org/XMLSchema/oval-definitions-5#independent"
    xmlns:oval="http://oval.mitre.org/XMLSchema/oval-common-5"
    xmlns:unix-def="http://oval.mitre.org/XMLSchema/oval-definitions-5#unix"
    xmlns:linux-def="http://oval.mitre.org/XMLSchema/oval-definitions-5#linux"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    xmlns:nist="http://www.nist.gov"
    xsi:schemaLocation="http://oval.mitre.org/XMLSchema/oval-common-5 oval-common-schema.xsd   http://oval.mitre.org/XMLSchema/oval-definitions-5 oval-definitions-schema.xsd   http://oval.mitre.org/XMLSchema/oval-definitions-5#independent independent-definitions-schema.xsd   http://oval.mitre.org/XMLSchema/oval-definitions-5#unix unix-definitions-schema.xsd   http://oval.mitre.org/XMLSchema/oval-definitions-5#macos linux-definitions-schema.xsd"
    exclude-result-prefixes="xs ovaldef fn nist"
    version="2.0">
    
    <xsl:output method="xml" indent="yes"/>
    
    <xsl:key name="definition" match="ovaldef:definition" use="@id"/>
    <xsl:key name="test" match="ovaldef:tests/*" use="@id"/>
    <xsl:key name="object" match="ovaldef:objects/*" use="@id"/>
    <xsl:key name="state" match="ovaldef:states/*" use="@id"/>
    
    <xsl:template match="ovaldef:tests">
        <tests>
            <xsl:apply-templates select="key('test', //ovaldef:criterion/@test_ref)"/>
        </tests>
    </xsl:template>
    
    <xsl:template match="ovaldef:objects">
        <objects>
            <xsl:apply-templates select="key('object', 
                key('test', //ovaldef:criterion/@test_ref)//@object_ref)"/>
        </objects>
    </xsl:template>
    
    <xsl:template match="ovaldef:states">
        <states>
            <xsl:apply-templates select="key('state',
                key('test', //ovaldef:criterion/@test_ref)//@state_ref)"/>
        </states>
    </xsl:template>
    
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>