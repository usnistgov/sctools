<?xml version="1.0" encoding="iso-8859-1"?>

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:nist="http://www.nist.gov"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs"
  xmlns:fn="http://www.w3.org/2005/xpath-functions">

  <xsl:output method="xml" indent="yes"/>
  
  <xsl:function name="nist:fID" as="xs:NMTOKEN">
    <xsl:param name="cell" as="element(functionCol)"/>
    <xsl:sequence select="xs:NMTOKEN(substring-after(substring-before($cell,')'),'('))"/>
  </xsl:function>
  
  <xsl:function name="nist:fName" as="xs:NMTOKEN">
    <xsl:param name="cell" as="element(functionCol)"/>
    <xsl:sequence select="xs:NMTOKEN(normalize-space(substring-before($cell,'(')))"/>
  </xsl:function>
  
  <xsl:function name="nist:cID" as="xs:NMTOKEN">
    <xsl:param name="row" as="element(row)"/>
    <xsl:sequence select=
      "xs:NMTOKEN(concat(nist:fID($row/functionCol),'.',
      substring-after(substring-before($row/catCol,')'),'.')))"/>
  </xsl:function>
  
  <xsl:function name="nist:cName" as="xs:string">
    <xsl:param name="cell" as="element(catCol)"/>
    <xsl:value-of select="normalize-space(substring-before($cell,'('))"/>
  </xsl:function>
  
  <xsl:function name="nist:cDesc" as="xs:string">
    <xsl:param name="cell" as="element(catCol)"/>
    <xsl:value-of select="normalize-space(substring-after($cell,':'))"/>
  </xsl:function>
  
  <xsl:function name="nist:subcatID" as="xs:NMTOKEN">
    <xsl:param name="cell" as="element(subcatCol)"/>
    <xsl:sequence select="xs:NMTOKEN(substring-before($cell,':'))"/>
  </xsl:function>
  
  <xsl:function name="nist:subcatDesc" as="xs:string">
    <xsl:param name="cell" as="element(subcatCol)"/>
    <xsl:value-of select="normalize-space(substring-after($cell,':'))"/>
  </xsl:function>
  
  <xsl:key name="functions" match="row" use="nist:fID(functionCol)"/>
  <xsl:key name="categories" match="row" use="nist:cID(.)"/>
  <xsl:key name="subcategories" match="row" use="nist:subcatID(subcatCol)"/>

  <!-- handle CSF typos -->
  <xsl:function name="nist:sp800-53-rev4-regexp" as="xs:string">
    <xsl:text>.*NIST\s+SP\s+800-53\s+Rev.\s*4,?\s*(.*)</xsl:text>
  </xsl:function>  
  <xsl:function name="nist:sp800-53-list" as="xs:string">
    <xsl:param name="cell" as="element(refsCol)"/>
    <xsl:value-of select=
      "normalize-space(fn:replace($cell, nist:sp800-53-rev4-regexp(), '$1'))"/>
  </xsl:function>

  <xsl:key name="functions" match="row" use="nist:fID(functionCol)"/>
  <xsl:key name="categories" match="row" use="nist:cID(.)"/>
  <xsl:key name="subcategories" match="row" use="nist:subcatID(subcatCol)"/>

  <xsl:template match="/">
    
<!--    Generate subject scheme map -->
    
<!--    Generate core taxonomy map -->
    
<!--    Generate core topic files -->
    
      <xsl:for-each select="//row[generate-id() = 
generate-id(key('functions', nist:fID(functionCol))[1])]">
        <xsl:variable name="fID" select="nist:fID(functionCol)"/>
        
        <!-- Generate function topic file -->
        <xsl:result-document doctype-public="-//OASIS//DTD DITA Topic//EN" doctype-system="topic.dtd" 
          href="{$fID}.dita">
          <xsl:call-template name="function-topic">
            <xsl:with-param name="fID" select="$fID"/>
          </xsl:call-template>
        </xsl:result-document>
        
<!--        <function id="{$fID}">
          <name>
            <xsl:value-of select="nist:fName(functionCol)"/>
          </name>
          <xsl:for-each
            select="//row[nist:fID(functionCol) = $fID and 
            generate-id() = generate-id(key('categories', nist:cID(.))[1])]">
            <xsl:variable name="cID" select="nist:cID(.)"/>
            <category id="{$cID}">
              <name>
                <xsl:value-of select="nist:cName(catCol)"/>
              </name>
              <description>
                <xsl:value-of select="nist:cDesc(catCol)"/>
              </description>
              <xsl:for-each
                select="//row[nist:fID(functionCol) = $fID and nist:cID(.) = $cID and 
                generate-id() = generate-id(key('subcategories', nist:subcatID(subcatCol))[1])]">
                <xsl:sort select="nist:subcatID(subcatCol)"/>
                <xsl:variable name="subcatID" select="nist:subcatID(subcatCol)"/>
                <subCategory id="{$subcatID}">
                  <description>
                    <xsl:value-of select="nist:subcatDesc(subcatCol)"/>
                  </description>
                  <xsl:for-each
                    select="//row[nist:fID(functionCol) = $fID and nist:cID(.) = $cID 
                    and nist:subcatID(subcatCol) = $subcatID]">
                    <xsl:call-template name="sp800-53"/>
                  </xsl:for-each>
                </subCategory>
              </xsl:for-each>
            </category>
          </xsl:for-each>
        </function>
-->      </xsl:for-each>
  </xsl:template>
  
  <xsl:template name="function-topic">
    <xsl:param name="fID" as="xs:NMTOKEN"/>
    <topic id="{generate-id()}" xsl:exclude-result-prefixes="#all">
      <title>
        <xsl:value-of select="functionCol"/>
      </title>
      <xsl:choose>
        <xsl:when test="$fID='ID'">
          <shortdesc>Develop an organizational understanding to manage cybersecurity risk to systems, 
            people, assets, data, and capabilities.</shortdesc>
        </xsl:when>
        <xsl:when test="$fID='PR'">
          <shortdesc>Develop and implement appropriate safeguards to ensure delivery of critical 
            services.</shortdesc>
        </xsl:when>
        <xsl:when test="$fID='DE'">
          <shortdesc>Develop and implement appropriate activities to identify the occurrence of a 
            cybersecurity event.</shortdesc>
        </xsl:when>
        <xsl:when test="$fID='RS'">
          <shortdesc>Develop and implement appropriate activities to take action regarding a detected 
            cybersecurity incident.</shortdesc>
        </xsl:when>
        <xsl:when test="$fID='RC'">
          <shortdesc>Develop and implement appropriate activities to maintain plans for 
            resilience and to restore any capabilities or services that were impaired due 
            to a cybersecurity incident.</shortdesc>
        </xsl:when>
      </xsl:choose>
      <body>
        <xsl:choose>
          <xsl:when test="$fID='ID'">
            <p>The activities in the Identify Function are foundational for effective use of the Framework. 
              Understanding the business context, the resources that support critical functions, and the related 
              cybersecurity risks enables an organization to focus and prioritize its efforts, consistent with 
              its risk management strategy and business needs.</p>
          </xsl:when>
          <xsl:when test="$fID='PR'">
            <p>The Protect Function supports the ability to limit or contain the impact of a potential 
              cybersecurity event.</p>
          </xsl:when>
          <xsl:when test="$fID='DE'">
            <p>The Detect Function enables timely discovery of cybersecurity events.</p>
          </xsl:when>
          <xsl:when test="$fID='RS'">
            <p>The Respond Function supports the ability to contain the impact of a potential 
              cybersecurity incident.</p>
          </xsl:when>
          <xsl:when test="$fID='RC'">
            <p>The Recover Function supports timely recovery to normal operations to reduce the 
              impact from a cybersecurity incident.</p>
          </xsl:when>
        </xsl:choose>
      </body>
    </topic>    
  </xsl:template>

  <xsl:template name="sp800-53">
    <xsl:if test="fn:matches(refsCol, concat('.*', nist:sp800-53-rev4-regexp(), '.*'))">
      <xsl:variable name="sp800-53-list" select="nist:sp800-53-list(refsCol)"/>
      <xsl:element name="sp800-53">
        <xsl:choose>

          <!-- special cases -->
          <xsl:when test="contains($sp800-53-list, '-1 controls')">
            <xsl:for-each select=
              "fn:tokenize('AC AU AT CM CP IA IR MA MP PS PE PL PM RA CA SC SI SA', '\s+')">
              <control>
                <xsl:value-of select="."/>
                <xsl:text>-1</xsl:text>
              </control>
            </xsl:for-each>
          </xsl:when>
          <xsl:when test="contains($sp800-53-list, 'AU Family')">
            <xsl:for-each select="1 to 16">
              <control>
                <xsl:text>AU-</xsl:text>
                <xsl:value-of select="."/>
              </control>
            </xsl:for-each>
          </xsl:when>

          <xsl:otherwise>
            <xsl:for-each select="fn:tokenize($sp800-53-list, '(,)|(\.)')">
              <control>
                <xsl:choose>
                  <!-- test for screwed up dash character for AC-17 in CSF Excel -->
                  <xsl:when test="contains(., 'AC&#x2011;17')">
                    <xsl:text>AC-17</xsl:text>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="normalize-space(.)"/>
                  </xsl:otherwise>
                </xsl:choose>
              </control>
            </xsl:for-each>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:element>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
