<?php
$inputdata = fopen("php://input", "r");
$s = "";
$k = 0;
while ($data = fread($inputdata, 1024)) {
	$s .= $data;
	$k++;
	if ($k == 200) {
		header("HTTP/1.0 403 Forbidden");
		exit();
	}
}
fclose($inputdata);
$dir = opendir("c:/www/zip");
$files = array();
while ($file = readdir($dir)) {
	if ($file != "." && $file !="..") {
		$files[filemtime($file)] = $file;
	}
}
closedir($dir);
krsort($files);
$fnum = 0;
foreach($files as $file) {
	if ($fnum > 10) {
		unlink($file);
	}
	$fnum++;
}
$param = array();
parse_str($_SERVER['QUERY_STRING'], $param);
$sname = uniqid()."-".$param['filename'];
$name = "/zip/".$sname;
$outputdata = fopen("c:/www".$name, "w");
fwrite($outputdata, $s);
fclose($outputdata);
?>
<html>
	<body>
		<p>Thank you for posting a file which has been named "<?php echo $sname; ?>"</p>
		<a href="<?php echo $name; ?>">Your file</a>
	</body>
</html>