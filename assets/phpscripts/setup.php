<?php
require '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->load();

$response = array(
    "status" => "success",
    "error" => false,
    "TMDB_API" => $_ENV['TMDB_API_KEY'],
    "TMDB_ID" => $_ENV['TMDB_ACCOUNT_ID'],

);

echo json_encode($response);