<?php

// Retrieve the JSON data from the request
$jsonData = file_get_contents('php://input');

file_put_contents('../json/movies.json', $jsonData);

header('Content-Type: application/json');
echo $jsonData;