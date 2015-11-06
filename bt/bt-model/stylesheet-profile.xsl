<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:output indent="yes" method="text"/>

   <xsl:template match="profile" xml:space="default">
     <xsl:text>&lt;frameworkProfile&gt;</xsl:text>
     <xsl:call-template name="subcategories">
       <xsl:with-param name="id-list" select="normalize-space(.)"/>
     </xsl:call-template>
     <xsl:text>
&lt;/frameworkProfile&gt;</xsl:text>
   </xsl:template>

   <xsl:template name="subcategories">
     <xsl:param name="id-list"/>
     <xsl:variable name="subcat" select="substring-before($id-list, ' ')"/>
     <xsl:if test="$id-list != ''">
       <xsl:text>
  &lt;id&gt;</xsl:text>
       <xsl:choose>
	 <xsl:when test="$subcat = ''">
	   <xsl:value-of select="$id-list"/>
	 </xsl:when>
	 <xsl:otherwise>
	   <xsl:value-of select="$subcat"/>
	 </xsl:otherwise>
       </xsl:choose>
       <xsl:text>&lt;/id&gt;</xsl:text>
       <xsl:call-template name="subcategories">
	 <xsl:with-param name="id-list" select="substring-after($id-list, ' ')"/>
       </xsl:call-template>
     </xsl:if>
   </xsl:template>
</xsl:stylesheet>
