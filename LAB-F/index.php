<?php

require_once __DIR__ . '/autoload.php';

use App\Serializer;
use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;

// serializer creation w/ encoders
$serializer = new Serializer([
    new CsvEncoder(),
    new JsonEncoder(),
    new YamlEncoder()
]);

// cookie values
$inputData = $_COOKIE['converter_input_data'] ?? '';
$inputFormat = $_COOKIE['converter_input_format'] ?? 'csv';
$outputFormat = $_COOKIE['converter_output_format'] ?? 'json';
$outputData = $_COOKIE['converter_output_data'] ?? '';

// form handling
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = $_POST['input_data'] ?? '';
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'json';

    if (!empty(trim($inputData))) {
        try {
            $decodedData = $serializer->decode($inputData, $inputFormat);
            $outputData = $serializer->encode($decodedData, $outputFormat);
        } catch (\Exception $e) {
            $outputData = "Błąd przetwarzania: " . $e->getMessage();
        }
    }

    $cookieExpire = time() + (86400 * 30);
    setcookie('converter_input_data', $inputData, $cookieExpire, "/");
    setcookie('converter_input_format', $inputFormat, $cookieExpire, "/");
    setcookie('converter_output_format', $outputFormat, $cookieExpire, "/");
    setcookie('converter_output_data', $outputData, $cookieExpire, "/");
}

// template rendering
require_once __DIR__ . '/templates/layout.php';