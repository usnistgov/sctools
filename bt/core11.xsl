<?xml version="1.0" encoding="iso-8859-1"?>

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:nist="http://www.nist.gov"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs"
  xmlns:fn="http://www.w3.org/2005/xpath-functions">

  <xsl:output method="xml" indent="yes"/>
  
  <xsl:function name="nist:fID" as="xs:NMTOKEN">
    <xsl:param name="cell" as="element(functionCol)"/>
    <xsl:value-of select="substring-after(substring-before($cell,')'),'(')"/>
  </xsl:function>
  
  <xsl:function name="nist:fName" as="xs:NMTOKEN">
    <xsl:param name="cell" as="element(functionCol)"/>
    <xsl:value-of select="normalize-space(substring-before($cell,'('))"/>
  </xsl:function>
  
  <xsl:function name="nist:cID" as="xs:NMTOKEN">
    <xsl:param name="row" as="element(row)"/>
    <xsl:value-of select=
      "concat(nist:fID($row/functionCol),'.',
      substring-after(substring-before($row/catCol,')'),'.'))"/>
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
    <xsl:value-of select="substring-before($cell,':')"/>
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
  
  
  <xsl:template match="/">
    <core>
      <xsl:for-each select="//row[generate-id() = 
generate-id(key('functions', nist:fID(functionCol))[1])]">
        <xsl:variable name="fID" select="nist:fID(functionCol)"/>
        <function id="{$fID}">
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
      </xsl:for-each>
    </core>
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
