<?php

function sanitizeFileName($fileName)
{
    // Define a list of characters to remove or replace
    $unsafeChars = array('\\', '/', ':', '*', '?', '"', '<', '>', '|');

    // Remove unsafe characters
    $sanitizedFileName = str_replace($unsafeChars, '', $fileName);

    // Remove any leading or trailing whitespace
    $sanitizedFileName = trim($sanitizedFileName);

    // Return the sanitized file name
    return $sanitizedFileName;
}


// Retrieve the JSON data from the request
$jsonData = file_get_contents('php://input');
$fileName = $_GET['fileName'];

$sanitizedFileName = sanitizeFileName($fileName);

// Use the sanitized file name for file operations
$filePath = '../json/' . $sanitizedFileName . '.json';

file_put_contents($filePath, $jsonData);

header('Content-Type: application/json');
echo $jsonData;