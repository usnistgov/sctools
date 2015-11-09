<?php
$inputdata = fopen("php://input", "r");
$s = "";
while ($data = fread($inputdata, 1024)) {
	$s .= $data;
}
fclose($inputdata);
$query = $_SERVER['QUERY_STRING'];
$result = array();
parse_str($query, $result);
$name = $result['name'];
$pwd = getcwd();
$dir = preg_replace('/\/[[:alnum:]_]+\.xml/', '', $name);
if (!file_exists($dir)) {
	mkdir($dir);
}
$outputdata = fopen($name, "w");
fwrite($outputdata, $s);
fclose($outputdata);
?>