<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:nist="http://www.nist.gov"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="#all"
  xmlns:fn="http://www.w3.org/2005/xpath-functions">

  <xsl:output method="xml" indent="yes"/>
  
  <xsl:param name="sp800-53-uri-prefix" select="xs:anyURI('https://nvd.nist.gov/800-53/Rev4/control')"/>
  <xsl:param name="output-directory" select="xs:anyURI('core')"/>
  
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
  
  <xsl:function name="nist:cSuffix" as="xs:NMTOKEN">
    <xsl:param name="cell" as="element(catCol)"/>
    <xsl:sequence select="xs:NMTOKEN(fn:substring-after(fn:substring-before($cell, ')'), '.'))"/>
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
  
  <xsl:function name="nist:subcatNumber" as="xs:positiveInteger">
    <xsl:param name="cell" as="element(subcatCol)"/>
    <xsl:sequence select=
      "xs:positiveInteger(substring-after(substring-before($cell,':'),'-'))"/>
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
    
    <!-- Generate root map -->
    <xsl:result-document doctype-public="-//OASIS//DTD DITA Map//EN" doctype-system="map.dtd"
      href="{$output-directory}/core.ditamap">
      <map>
        <title>Cybersecurity Framework Profile</title>
        <ditavalref href="profile.ditaval"/>
        <!--<mapref href="ReusableComponents/keys.ditamap"/>-->
        <topicref format="ditamap" href="coreSubjectScheme.ditamap"/>
        <topicref format="ditamap" href="coreTaxonomy.ditamap"/>
      </map>      
    </xsl:result-document>
    
    <!-- Generate stub ditaval provile -->
    <xsl:result-document href="{$output-directory}/profile.ditaval">
      <val/>
    </xsl:result-document>
    
    <!-- Generate subject scheme map -->
    <xsl:result-document doctype-public="-//OASIS//DTD DITA Subject Scheme Map//EN" doctype-system="subjectScheme.dtd" 
      href="{$output-directory}/coreSubjectScheme.ditamap">
      <subjectScheme>
        <subjectdef keys="coreKey" navtitle="Cybersecurity Framework Profile">
          <xsl:for-each select="//row[generate-id() = 
            generate-id(key('functions', nist:fID(functionCol))[1])]">
            <xsl:variable name="fID" select="nist:fID(functionCol)"/>
            <subjectdef keys="{$fID}" navtitle="{functionCol}">
              <xsl:for-each
                select="//row[nist:fID(functionCol) = $fID and 
                generate-id() = generate-id(key('categories', nist:cID(.))[1])]">
                <xsl:variable name="cID" select="nist:cID(.)"/>
                <subjectdef keys="{$cID}" navtitle="{nist:cName(catCol)}">
                  <xsl:for-each
                    select="//row[nist:fID(functionCol) = $fID and nist:cID(.) = $cID and 
                    generate-id() = generate-id(key('subcategories', nist:subcatID(subcatCol))[1])]">
                    <!--<xsl:sort select="nist:subcatID(subcatCol)"/>-->
                    <xsl:sort select="nist:subcatNumber(subcatCol)" data-type="number"/>
                    <xsl:variable name="subcatID" select="nist:subcatID(subcatCol)"/>
                    <subjectdef keys="{$subcatID}" navtitle="{$subcatID}"/>
                  </xsl:for-each>
                </subjectdef>
              </xsl:for-each>
            </subjectdef>
          </xsl:for-each>
        </subjectdef>
        <enumerationdef outputclass="single_value">
          <attributedef name="platform"/>
          <subjectdef keyref="coreKey"/>
        </enumerationdef>
        <enumerationdef>
          <attributedef name="audience"/>
          <subjectdef/>
        </enumerationdef>
        <enumerationdef>
          <attributedef name="props"/>
          <subjectdef/>
        </enumerationdef>
        <enumerationdef>
          <attributedef name="otherprops"/>
          <subjectdef/>
        </enumerationdef>
      </subjectScheme>
    </xsl:result-document>
    
    <!--    Generate core taxonomy map -->
    <xsl:result-document doctype-public="-//OASIS//DTD DITA Map//EN" doctype-system="map.dtd" 
      href="{$output-directory}/coreTaxonomy.ditamap">
      <map>
        <title>Cybersecurity Framework Core Taxonomy</title>
        <topicref href="FrameworkCore.dita">
        <xsl:for-each select="//row[generate-id() = 
          generate-id(key('functions', nist:fID(functionCol))[1])]">
          <xsl:variable name="fID" select="nist:fID(functionCol)"/>
          <topicref platform="{$fID}" href="{$fID}.dita">
            <xsl:for-each
              select="//row[nist:fID(functionCol) = $fID and 
              generate-id() = generate-id(key('categories', nist:cID(.))[1])]">
              <xsl:variable name="cID" select="nist:cID(.)"/>
              <topicref platform="{$cID}" href="{fn:replace($cID, '\.', '/')}.dita">
                <xsl:for-each
                  select="//row[nist:fID(functionCol) = $fID and nist:cID(.) = $cID and 
                  generate-id() = generate-id(key('subcategories', nist:subcatID(subcatCol))[1])]">
                  <xsl:sort select="nist:subcatNumber(subcatCol)"/>
                  <xsl:variable name="subcatID" select="nist:subcatID(subcatCol)"/>
                  <topicref platform="{$subcatID}" href="{fn:replace($subcatID, '\.|-', '/')}.dita"/>
                </xsl:for-each>
              </topicref>
            </xsl:for-each>
          </topicref>
        </xsl:for-each>
        </topicref>
      </map>
    </xsl:result-document>
    
    <!-- Generate framework core topic file -->
    <xsl:result-document doctype-public="-//OASIS//DTD DITA Topic//EN" doctype-system="topic.dtd"
      href="{$output-directory}/FrameworkCore.dita">
      <topic id="{generate-id()}">
        <title>Framework Core</title>
        <shortdesc>A set of cybersecurity activities, desired outcomes,
          and applicable references that are common across critical infrastructure sectors.</shortdesc>
        <body>
          <p>The Core presents industry standards, guidelines, and practices in a manner that 
            allows for communication of cybersecurity activities and outcomes across the 
            organization from the executive level to the implementation/operations level. The 
            Framework Core consists of five concurrent and continuous Functions. When considered 
            together, these Functions provide a high-level, strategic view of the lifecycle of 
            an organization's management of cybersecurity risk. The Framework Core then 
            identifies underlying key Categories and Subcategories — which are discrete outcomes — 
            for each Function, and matches them with example Informative References such as 
            existing standards, guidelines, and practices for each Subcategory.</p>
        </body>
      </topic>      
    </xsl:result-document>
    
      <!--    Generate function, category, and subcategory topic files -->    
      <xsl:for-each select="//row[generate-id() = 
generate-id(key('functions', nist:fID(functionCol))[1])]">
        <xsl:variable name="fID" select="nist:fID(functionCol)"/>
        
        <!-- Generate function topic file -->
        <xsl:result-document doctype-public="-//OASIS//DTD DITA Topic//EN" doctype-system="topic.dtd" 
          href="{$output-directory}/{$fID}.dita">
          <xsl:call-template name="function-topic">
            <xsl:with-param name="fID" select="$fID"/>
          </xsl:call-template>
        </xsl:result-document>
        <xsl:for-each
          select="//row[nist:fID(functionCol) = $fID and 
          generate-id() = generate-id(key('categories', nist:cID(.))[1])]">
          <xsl:variable name="cID" select="nist:cID(.)"/>
          <xsl:variable name="cSuffix" select="nist:cSuffix(catCol)"/>
          
          <!-- Generate category topic file -->
<!--          <xsl:message>
            <xsl:text>Output directory: </xsl:text>
            <xsl:value-of select="$output-directory"/>
          </xsl:message>
          <xsl:message>
            <xsl:text>fID: </xsl:text>
            <xsl:value-of select="$fID"/>
          </xsl:message>
          <xsl:message>
            <xsl:text>cID: </xsl:text>
            <xsl:value-of select="$cID"/>
          </xsl:message>
-->          <xsl:result-document doctype-public="-//OASIS//DTD DITA Topic//EN" doctype-system="topic.dtd"
            href="{$output-directory}/{$fID}/{$cSuffix}.dita">
            <xsl:call-template name="category-topic">
              <xsl:with-param name="cID" select="$cID"/>
            </xsl:call-template>
          </xsl:result-document>
          <xsl:for-each
            select="//row[nist:fID(functionCol) = $fID and nist:cID(.) = $cID and 
            generate-id() = generate-id(key('subcategories', nist:subcatID(subcatCol))[1])]">
            <xsl:sort select="nist:subcatNumber(subcatCol)"/>
            <xsl:variable name="subcatID" select="nist:subcatID(subcatCol)"/>
            <xsl:variable name="subcatNumber" select="nist:subcatNumber(subcatCol)"/>
            
            <!-- Generate subcategory topic file -->
            <xsl:result-document doctype-public="-//OASIS//DTD DITA Topic//EN" doctype-system="topic.dtd"
              href="{$output-directory}/{$fID}/{$cSuffix}/{$subcatNumber}.dita">
              <xsl:call-template name="subcategory-topic">
                <xsl:with-param name="fID" select="$fID"/>
                <xsl:with-param name="cID" select="$cID"/>
                <xsl:with-param name="subcatID" select="$subcatID"/>
              </xsl:call-template>
            </xsl:result-document>
          </xsl:for-each>
        </xsl:for-each>
      </xsl:for-each>
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
  
  <xsl:template name="category-topic">
    <xsl:param name="cID" as="xs:NMTOKEN"/>
    <topic id="{generate-id()}" xsl:exclude-result-prefixes="#all">
      <title>
        <xsl:value-of select="nist:cName(catCol)"/>
      </title>
      <shortdesc>
        <xsl:value-of select="nist:cDesc(catCol)"/>
      </shortdesc>
    </topic>
  </xsl:template>
  
  <xsl:template name="subcategory-topic">
    <xsl:param name="fID" as="xs:NMTOKEN"/>
    <xsl:param name="cID" as="xs:NMTOKEN"/>
    <xsl:param name="subcatID" as="xs:NMTOKEN"/>
    <topic id="{generate-id()}" xsl:exclude-result-prefixes="#all">
      <title>
        <xsl:value-of select="$subcatID"/>
      </title>
      <shortdesc>
        <xsl:value-of select="nist:subcatDesc(subcatCol)"/>
      </shortdesc>
      <related-links>
        <xsl:for-each
          select="//row[nist:fID(functionCol) = $fID and nist:cID(.) = $cID 
          and nist:subcatID(subcatCol) = $subcatID]">
          <xsl:call-template name="sp800-53">
            <xsl:with-param name="subcatID" select="$subcatID"/>
          </xsl:call-template>
        </xsl:for-each>        
      </related-links>
    </topic>
  </xsl:template>
  
  <xsl:template name="sp800-53">
    <xsl:param name="subcatID" as="xs:NMTOKEN"/>
    <xsl:if test="fn:matches(refsCol, concat('.*', nist:sp800-53-rev4-regexp(), '.*'))">
      <xsl:variable name="sp800-53-list" select="nist:sp800-53-list(refsCol)"/>
        <xsl:choose>

          <!-- special cases -->
          <xsl:when test="contains($sp800-53-list, '-1 controls')">
            <xsl:for-each select=
              "fn:tokenize('AC AU AT CM CP IA IR MA MP PS PE PL PM RA CA SC SI SA', '\s+')">
              <xsl:variable name="controlID">
                <xsl:value-of select="."/>
                <xsl:text>-1</xsl:text>                
              </xsl:variable>
              <link format="html" scope="external" href="{$sp800-53-uri-prefix}/{$controlID}">
                <linktext>
                  <xsl:value-of select="$controlID"/>
                </linktext>
              </link>
            </xsl:for-each>
          </xsl:when>
          <xsl:when test="contains($sp800-53-list, 'AU Family')">
            <xsl:for-each select="1 to 16">
              <xsl:variable name="controlID">
                <xsl:value-of select="."/>
                <xsl:text>-1</xsl:text>                
              </xsl:variable>
              <link format="html" scope="external" href="{$sp800-53-uri-prefix}/{$controlID}">
                <linktext>
                  <xsl:value-of select="$controlID"/>
                </linktext>
              </link>
            </xsl:for-each>
          </xsl:when>

          <xsl:otherwise>
            <xsl:for-each select="fn:tokenize($sp800-53-list, '(,)|(\.)')">
              <xsl:variable name="controlID">
                <xsl:choose>
                  <!-- test for screwed up dash character for AC-17 in CSF Excel -->
                  <xsl:when test="contains(., 'AC&#x2011;17')">
                    <xsl:text>AC-17</xsl:text>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:value-of select="normalize-space(.)"/>
                  </xsl:otherwise>
                </xsl:choose>                
              </xsl:variable>
              <link format="html" scope="external" href="{$sp800-53-uri-prefix}/{$controlID}">
                <linktext>
                  <xsl:value-of select="$controlID"/>
                </linktext>
              </link>
            </xsl:for-each>
          </xsl:otherwise>
        </xsl:choose>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
