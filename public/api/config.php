<?php 

if (basename($_SERVER['PHP_SELF']) === 'config.php') {
    http_response_code(403);
    exit(json_encode(['success' => false, 'error' => 'Direct access forbidden']));
}

ini_set('display_errors', 0);
error_reporting(E_ALL);

define('API_BASE_URL', 'https://open.er-api.com/v6/latest/');
define('CACHE_LIFETIME', 300); 

define('SUPPORTED_CURRENCIES', ['USD', 'GBP', 'INR', 'AED', 'EUR', 'CAD', 'AUD', 'SGD', 'JPY']);

function send_json_response(array $data, int $status_code = 200): void {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    http_response_code($status_code);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}
