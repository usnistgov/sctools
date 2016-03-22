<?xml version="1.0" encoding="UTF-8"?>
<schema xmlns="http://purl.oclc.org/dsdl/schematron"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <title>Tailoring Rules</title>
  <pattern >

    <rule context="rationale">
      <let name="label" value="concat('Control ', ../control/@number, ' (', ../control/title, ')')"/>
      <report test="@flag='false' and .!=''"><value-of select="$label"/>: rationale provided, but flag value is false.</report>
      <report test="@flag='true' and .=''"><value-of select="$label"/>: rationale not provided , but flag value is true.</report>
    </rule>

    <rule context="control/guidance">
      <let name="label" value="concat('Control ', ../@number, ' (', ../title, ')')"/>
      <report test="@flag='false' and .!=''"><value-of select="$label"/>: additional supplemental guidance provided, but flag value is false.</report>
      <report test="@flag='true' and .=''"><value-of select="$label"/>: additional supplemental guidance not provided, but flag value is true.</report>
    </rule>

    <rule context="enhancement/guidance">
      <let name="gFlag" value="string(@flag)"/>
      <let name="ceRef" value="../../enhancement[@number=$gFlag]"/>
      <let name="label" value="concat('Control ', ../../control/@number, ' (', ../../control/title, '), enhancement ', ../../control/@number, '(', ../@number, ') (', ../title, ')')"/>
      <report test="@flag='false' and .!=''"><value-of select="$label"/>: additional supplemental guidance provided, but flag value is false.</report>
      <report test="@flag='true' and @flag!='1' and .=''"><value-of select="$label"/>: additional supplemental guidance not provided, but flag value is true.</report>
      <report test="not($ceRef) and @flag&gt;'0' and @flag!='false'"><value-of select="$label"/>: invalid additional supplemental guidance cross-reference "<value-of select="@flag"/>".</report>
      <report test="$ceRef and $ceRef/guidance=''"><value-of select="$label"/>: cross-reference to enhancement <value-of select="../../control/@number"/>(<value-of select="$ceRef/@number"/>) (<value-of select="$ceRef/title"/>), which provides no additional supplemental guidance.</report>
    </rule>

  </pattern>
</schema>
