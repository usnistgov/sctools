<?xml version="1.0" encoding="iso-8859-1"?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY fID "substring-after(substring-before(f:COL[1]/f:DATA,')'),'(')">
<!ENTITY fName "normalize-space(substring-before(f:COL[1]/f:DATA,'('))">
<!ENTITY cID "concat(&fID;,'.',substring-after(substring-before(f:COL[2]/f:DATA,')'),'.'))">
<!ENTITY cName "normalize-space(substring-before(f:COL[2]/f:DATA,'('))">
<!ENTITY cDesc "normalize-space(substring-after(f:COL[2]/f:DATA,':'))">
<!ENTITY subCatID "substring-before(f:COL[3]/f:DATA,':')">
<!ENTITY subCatDesc "normalize-space(substring-after(f:COL[3]/f:DATA,':'))">

<!-- handle PR.IP-10 CSF typo -->
<!ENTITY sp800-53 "normalize-space
(substring-after(
substring-after(f:COL[4]/f:DATA,'NIST SP 800-53 Rev.'),
'4'))">
]>
<xsl:stylesheet 
    version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fn="http://www.w3.org/2005/xpath-functions"
    exclude-result-prefixes="f"
    xmlns:f="http://www.filemaker.com/fmpxmlresult">

  <xsl:output method="xml" indent="yes"/>

  <xsl:key name="functions" match="f:ROW" use="&fID;"/>
  <xsl:key name="categories" match="f:ROW" use="&cID;"/>
  <xsl:key name="subcategories" match="f:ROW" use="&subCatID;"/>

  <xsl:template match="/">
    <core>
      <xsl:for-each select="//f:ROW[generate-id() = 
generate-id(key('functions', &fID;)[1])]">
	<xsl:variable name="fID" select="&fID;"/>
	<function id="{$fID}">
	  <name>
	    <xsl:value-of select="&fName;"/>
	  </name>
	  <xsl:for-each select="//f:ROW[&fID; = $fID and
generate-id() = generate-id(key('categories', &cID;)[1])]">
	    <xsl:variable name="cID" select="&cID;"/>
	    <category id="{$cID}">
	      <name>
		<xsl:value-of select="&cName;"/>
	      </name>
	      <description>
		<xsl:value-of select="&cDesc;"/>
	      </description>
	      <xsl:for-each select="//f:ROW[&fID; = $fID and &cID; = $cID]">
		<xsl:sort select="&subCatID;"/>
		<subCategory id="{&subCatID;}">
		  <description>
		    <xsl:value-of select="&subCatDesc;"/>
		  </description>
		  <xsl:call-template name="sp800-53"/>
		</subCategory>
	      </xsl:for-each>
	    </category>
	  </xsl:for-each>
	</function>
      </xsl:for-each>
    </core>
  </xsl:template>

  <xsl:template name="sp800-53">
    <xsl:variable name="sp800-53" select="&sp800-53;"/>
    <xsl:element name="sp800-53">
      <xsl:choose>
	<xsl:when test="contains($sp800-53, 'controls from all families')">
	  <xsl:attribute name="all">
	    <xsl:value-of select="true()"/>
	  </xsl:attribute>
	  <xsl:if test="contains($sp800-53, '(except ')">
	    <except>
	      <xsl:value-of select="normalize-space(substring-before((substring-after($sp800-53, '(except')),')'))"/>
	    </except>
	  </xsl:if>
	</xsl:when>
	<xsl:otherwise>
	  <xsl:for-each select="fn:tokenize($sp800-53, '(,)')">
	    <xsl:choose>
	      <xsl:when test="contains(., 'Family')">
		<family>
		  <xsl:value-of 
select="normalize-space(substring-before(., 'Family'))"/>
		</family>
	      </xsl:when>
	      <xsl:otherwise>
		<control>
		  <xsl:value-of select="normalize-space(.)"/>
		</control>
	      </xsl:otherwise>
	    </xsl:choose>
	  </xsl:for-each>
	</xsl:otherwise>
      </xsl:choose>
    </xsl:element>
  </xsl:template>

</xsl:stylesheet>
