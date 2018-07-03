<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:template name="config">
		<options>
		</options>
		<properties> <!--  accessible at run time -->
			<html>4</html>
			<language>pl</language>
			<calendar.label>...</calendar.label>
			<calendar.day0>Pon</calendar.day0>
			<calendar.day1>Wt</calendar.day1>
			<calendar.day2>Śr</calendar.day2>
			<calendar.day3>Czw</calendar.day3>
			<calendar.day4>Pt</calendar.day4>
			<calendar.day5>Sob</calendar.day5>
			<calendar.day6>Niedz</calendar.day6>
			<calendar.initDay>0</calendar.initDay>
			<calendar.month0>Styczeń</calendar.month0>
			<calendar.month1>Luty</calendar.month1>
			<calendar.month2>Marzec</calendar.month2>
			<calendar.month3>Kwiecień</calendar.month3>
			<calendar.month4>Maj</calendar.month4>
			<calendar.month5>Czerwiec</calendar.month5>
			<calendar.month6>Lipiec</calendar.month6>
			<calendar.month7>Sierpień</calendar.month7>
			<calendar.month8>Wrzesień</calendar.month8>
			<calendar.month9>Październik</calendar.month9>
			<calendar.month10>Listopad</calendar.month10>
			<calendar.month11>Grudzień</calendar.month11>
			<calendar.close>Blisko</calendar.close>
			<format.date>yyyy-MM-dd</format.date>
			<format.datetime>yyyy-MM-dd hh:mm:ss</format.datetime>
			<format.decimal>.</format.decimal>
			<status>... Wczytywanie ...</status>
		</properties>
		<extensions/> <!-- HTML elements to be added just after xsltforms.js and xsltforms.css loading -->
	</xsl:template>
</xsl:stylesheet>