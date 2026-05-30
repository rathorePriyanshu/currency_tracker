<?php

require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json_response(['success' => false, 'error' => 'Method not allowed'], 405);
}

$base = isset($_GET['base']) ? strtoupper(trim($_GET['base'])) : 'USD';


if (!in_array($base, SUPPORTED_CURRENCIES, true)) {
    send_json_response(['success' => false, 'error' => 'Unsupported base currency'], 400);
}


$cache_dir = __DIR__ . '/.cache';
$cache_file = $cache_dir . "/rates_{$base}.json";

if (!is_dir($cache_dir)) {
    if (!mkdir($cache_dir, 0755, true) && !is_dir($cache_dir)) {
      error_log('Failed to create cache directory');
}
}

$cache_valid = false;
$cache_exists = file_exists($cache_file);


if ($cache_exists) {
    $cache_time = filemtime($cache_file);
    if ((time() - $cache_time) < CACHE_LIFETIME) {
        $cache_valid = true;
    }
}


function format_rates_response(array $api_data, bool $success, ?string $error_msg = null, bool $is_cached = false): array {
    $base = $api_data['base_code'] ?? 'USD';
    
    $updated_at_unix = $api_data['time_last_update_unix'] ?? time();
    $updated_at = gmdate('Y-m-d H:i:s', $updated_at_unix);

    $formatted_rates = [];
    $raw_rates = $api_data['rates'] ?? [];
    
    foreach (SUPPORTED_CURRENCIES as $currency) {
        if ($currency === $base) {
            continue;
        }
        
        if (isset($raw_rates[$currency])) {
            $formatted_rates[$currency] = round((float)$raw_rates[$currency], 2);
        }
    }
    
    $response = [
        'success' => $success,
        'base' => $base,
        'updated_at' => $updated_at,
        'rates' => $formatted_rates
    ];
    
    if ($error_msg !== null) {
        $response['error'] = $error_msg;
    }
    
    if ($is_cached) {
        $response['cached'] = true;
    }
    
    return $response;
}

if ($cache_valid && $cache_exists) {
    $cached_content = file_get_contents($cache_file);
    $decoded_cache = json_decode($cached_content, true);
    
    if ($decoded_cache && isset($decoded_cache['rates'])) {
        $response = format_rates_response($decoded_cache, true);
        send_json_response($response);
    }
}

$external_url = API_BASE_URL . $base;
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $external_url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5,
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_HTTPHEADER => [
        'User-Agent: Payflo Currency Tracker/1.0'
    ],
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
]);

$api_response = curl_exec($curl);
$http_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curl_error = curl_error($curl);


$fetch_success = ($http_code === 200 && $api_response !== false);

if ($fetch_success) {
    $decoded_response = json_decode($api_response, true);
    
    if ($decoded_response && isset($decoded_response['result']) && $decoded_response['result'] === 'success') {
        file_put_contents($cache_file, $api_response, LOCK_EX);
        $response = format_rates_response($decoded_response, true);
        send_json_response($response);
    }
}

if ($cache_exists) {
    $cached_content = file_get_contents($cache_file);
    $decoded_cache = json_decode($cached_content, true);
    
    if ($decoded_cache && isset($decoded_cache['rates'])) {
        $error_detail = !empty($curl_error) ? $curl_error : "HTTP status {$http_code}";
        $response = format_rates_response(
            $decoded_cache,
            false,
            "External API failed ({$error_detail}). Serving stale cache.",
            true
        );
        send_json_response($response);
    }
}

send_json_response([
    'success' => false,
    'error' => 'Service unavailable'
], 503);
