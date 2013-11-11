<?php

$xml = $_POST['field_xml'];

$file = 'backup.jff';



// Open the file to get existing content
$current = file_get_contents($file);

// Append a new person to the file
$current .= $xml;

// Write the contents back to the file
file_put_contents($file, $current);

header('Content-type: text/xml');
header('"Content-Type: application/force-download\n"');

header('Content-Disposition: attachment; filename="'+$file+'"');

echo($xml);
exit();



?>