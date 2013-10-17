<?php

$mysql_host = "127.0.0.1";
$mysql_user = "kantia";
$mysql_pass = "spells";
$mysql_db = "kantia";

$conn = mysqli_connect($mysql_host,$mysql_user,$mysql_pass,$mysql_db);

if(mysqli_connect_errno($conn)) {
	echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$query = "SELECT spell_id,name FROM kantia.spell ORDER BY name;";

$result = mysqli_query($conn,$query);

$spells = array();
while($row = mysqli_fetch_array($result)) {
	$obj = array("id"=>$row["spell_id"],"name"=>$row["name"]);
	$spells[] = $obj;
}

echo(json_encode($spells));

mysqli_close($conn);
?>