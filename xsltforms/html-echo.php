<?php
	header("Content-Type: text/html");
	header("Access-control: allow <*>");
	$posteddata = file_get_contents("php://input");
	echo $posteddata;
?>
