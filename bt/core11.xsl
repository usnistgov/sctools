<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE xsl:stylesheet [
<!--<!ENTITY fID "substring-after(substring-before(functionCol,')'),'(')">-->
<!ENTITY fName "normalize-space(substring-before(functionCol,'('))">
<!ENTITY cID "concat(nist:fID(functionCol),'.',substring-after(substring-before(catCol,')'),'.'))">
<!ENTITY cName "normalize-space(substring-before(catCol,'('))">
<!ENTITY cDesc "normalize-space(substring-after(catCol,':'))">
<!ENTITY subcatID "substring-before(subcatCol,':')">
<!ENTITY subcatDesc "normalize-space(substring-after(subcatCol,':'))">

<!-- handle CSF typos -->
<!ENTITY sp800-53-rev4-regexp ".*NIST\s+SP\s+800-53\s+Rev.\s*4,?\s*(.*)">
<!ENTITY sp800-53-list "normalize-space(fn:replace(refsCol, '&sp800-53-rev4-regexp;', '$1'))">
]>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:nist="http://www.nist.gov"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs"
  xmlns:fn="http://www.w3.org/2005/xpath-functions">

  <xsl:output method="xml" indent="yes"/>
  
  <xsl:function name="nist:fID" as="xs:NMTOKEN">
    <xsl:param name="cell" as="xs:string"/>
    <xsl:value-of select="substring-after(substring-before($cell,')'),'(')"/>
  </xsl:function>

  <xsl:key name="functions" match="row" use="nist:fID(functionCol)"/>
  <xsl:key name="categories" match="row" use="&cID;"/>
  <xsl:key name="subcategories" match="row" use="&subcatID;"/>

  <xsl:template match="/">
    <core>
      <xsl:for-each select="//row[generate-id() = 
generate-id(key('functions', nist:fID(functionCol))[1])]">
        <xsl:variable name="fID" select="nist:fID(functionCol)"/>
        <function id="{$fID}">
          <name>
            <xsl:value-of select="&fName;"/>
          </name>
          <xsl:for-each
            select="//row[nist:fID(functionCol) = $fID and 
            generate-id() = generate-id(key('categories', &cID;)[1])]">
            <xsl:variable name="cID" select="&cID;"/>
            <category id="{$cID}">
              <name>
                <xsl:value-of select="&cName;"/>
              </name>
              <description>
                <xsl:value-of select="&cDesc;"/>
              </description>
              <xsl:for-each
                select="//row[nist:fID(functionCol) = $fID and &cID; = $cID and 
                generate-id() = generate-id(key('subcategories', &subcatID;)[1])]">
                <xsl:sort select="&subcatID;"/>
                <xsl:variable name="subcatID" select="&subcatID;"/>
                <subCategory id="{$subcatID}">
                  <description>
                    <xsl:value-of select="&subcatDesc;"/>
                  </description>
                  <xsl:for-each
                    select="//row[nist:fID(functionCol) = $fID and &cID; = $cID and &subcatID; = $subcatID]">
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
    <xsl:if test="fn:matches(refsCol, '.*&sp800-53-rev4-regexp;.*')">
      <xsl:variable name="sp800-53-list" select="&sp800-53-list;"/>
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
            <!--<xsl:attribute name="all">
              <xsl:value-of select="true()"/>
            </xsl:attribute>-->
            <!-- No longer needed for CSF 1.1
              <xsl:if test="contains($sp800-53-list, '(except ')">
              <except>
                <xsl:value-of
                  select="normalize-space(substring-before((substring-after($sp800-53-list, '(except')), ')'))"
                />
              </except>
            </xsl:if>-->
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
