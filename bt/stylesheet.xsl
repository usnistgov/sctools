<!-- $Id: stylesheet.xsl,v 1.12 2015/01/09 15:17:16 lubell Exp $-->
 <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:output indent="yes" method="text"/>

   <xsl:template match="/">
     <xsl:apply-templates/>
   </xsl:template>

   <xsl:template match="@*" xml:space="default">
     <xsl:text>&#160;</xsl:text>
     <xsl:value-of select="name()"/>
     <xsl:text>="</xsl:text>
     <xsl:value-of select="."/>
     <xsl:text>"</xsl:text>
   </xsl:template>

   <xsl:template match="text()">
     <xsl:value-of select="."/>
   </xsl:template>

   <xsl:template match="xRefLabel | gFlag | l | m | h | @label" priority="1"/>

   <xsl:template match="rationale" priority="1">
     <xsl:text>&#160;&#160;&lt;rationale flag="</xsl:text>
     <xsl:value-of select="@flag"/>
     <xsl:text>"</xsl:text>
     <xsl:choose>
       <xsl:when test="@flag='true'">
	 <xsl:text>&gt;</xsl:text>
	 <xsl:value-of select="."/>
	 <xsl:text>&lt;/rationale&gt;
</xsl:text>
       </xsl:when>
       <xsl:otherwise>
	 <xsl:text>/&gt;
</xsl:text>
       </xsl:otherwise>
     </xsl:choose>
   </xsl:template>

   <xsl:template match="guidance" priority="1">
     <xsl:text>&#160;&#160;&#160;&#160;&lt;guidance flag="</xsl:text>
     <xsl:value-of select="../gFlag"/>
     <xsl:text>"</xsl:text>
     <xsl:choose>
       <xsl:when test="../gFlag='true'">
	 <xsl:text>&gt;</xsl:text>
	 <xsl:value-of select="."/>
	 <xsl:text>&lt;/guidance&gt;
</xsl:text>
       </xsl:when>
       <xsl:otherwise>
	 <xsl:text>/&gt;
</xsl:text>
       </xsl:otherwise>
     </xsl:choose>
   </xsl:template>

   <xsl:template match="default" priority="1">
     <xsl:text>&#160;&#160;&#160;&#160;&lt;default value="</xsl:text>
     <xsl:value-of select="."/>
     <xsl:text>"/&gt;
</xsl:text>
   </xsl:template>

  <xsl:template match="enhancement" priority="1">
    <xsl:if test="impact[@value &lt; '4']">
      <xsl:text>&#160;&#160;</xsl:text>
      <xsl:text>&lt;enhancement</xsl:text>
      <xsl:apply-templates select="@*"/>
      <xsl:text>&gt;
</xsl:text>
      <xsl:apply-templates/>
      <xsl:text>&#160;&#160;</xsl:text>
      <xsl:text>&lt;/enhancement</xsl:text>
      <xsl:text>&gt;
</xsl:text>
    </xsl:if>
  </xsl:template>

   <xsl:template match="*">
     <xsl:if test="ancestor::tailoredControl">
       <xsl:text>&#160;&#160;</xsl:text>
       <xsl:if test="ancestor::control or ancestor::enhancement">
	 <xsl:text>&#160;&#160;</xsl:text>
       </xsl:if>
     </xsl:if>
     <xsl:text>&lt;</xsl:text>
     <xsl:value-of select="name()"/>
     <xsl:apply-templates select="@*"/>
     <xsl:text>/&gt;
</xsl:text>
   </xsl:template>

   <xsl:template match="*[text() and not(comment() | processing-instruction())]">
     <xsl:if test="ancestor::tailoredControl">
       <xsl:text>&#160;&#160;</xsl:text>
       <xsl:if test="ancestor::control or ancestor::enhancement">
	 <xsl:text>&#160;&#160;</xsl:text>
       </xsl:if>
     </xsl:if>
     <xsl:text>&lt;</xsl:text>
     <xsl:value-of select="name()"/>
     <xsl:apply-templates select="@*"/>
    <xsl:text>&gt;</xsl:text>
    <xsl:value-of select="."/>
    <xsl:text>&lt;/</xsl:text>
    <xsl:value-of select="name()"/>
    <xsl:text>&gt;
</xsl:text>
  </xsl:template>

  <xsl:template match="*[*]">
    <xsl:if test="ancestor::tailoredControl">
      <xsl:text>&#160;&#160;</xsl:text>
    </xsl:if>
    <xsl:text>&lt;</xsl:text>
    <xsl:value-of select="name()"/>
    <xsl:apply-templates select="@*"/>
    <xsl:text>&gt;
</xsl:text>
    <xsl:apply-templates/>
    <xsl:if test="ancestor::tailoredControl">
      <xsl:text>&#160;&#160;</xsl:text>
    </xsl:if>
    <xsl:text>&lt;/</xsl:text>
    <xsl:value-of select="name()"/>
    <xsl:text>&gt;
</xsl:text>
  </xsl:template>

</xsl:stylesheet>
