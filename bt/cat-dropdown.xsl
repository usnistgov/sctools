<?xml version="1.0" encoding="iso-8859-1"?>
<xsl:stylesheet 
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output method="xml" indent="yes"/>

  <xsl:template match="/">
    <categoryDropdowns>
      <xsl:for-each select="//category">
	<cat>
	  <id>
	    <xsl:value-of select="@id"/>
	  </id>
	  <label>
	    <xsl:value-of select="concat(name, ' (', @id, ')')"/>
	  </label>
	</cat>
      </xsl:for-each>
    </categoryDropdowns>
  </xsl:template>

</xsl:stylesheet>
