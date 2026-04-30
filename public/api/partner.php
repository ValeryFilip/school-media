<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$configPath = __DIR__ . '/lead.config.php';
if (!is_file($configPath)) {
    respond(['ok' => false, 'error' => 'Config file is missing'], 500);
}

$config = require $configPath;
if (!is_array($config) || !isset($config['db']) || !is_array($config['db'])) {
    respond(['ok' => false, 'error' => 'Config is invalid'], 500);
}

try {
    $body = parse_body();
    verify_captcha($body['captcha_token'] ?? '', get_client_ip(), $config);

    $safe = static fn($v, int $n = 0): string => $n > 0
        ? mb_substr(trim((string)($v ?? '')), 0, $n, 'UTF-8')
        : trim((string)($v ?? ''));

    $checkbox = static fn($v): int => in_array(
        strtolower(trim((string)($v ?? ''))),
        ['true', '1', 'on', 'yes'],
        true
    ) ? 1 : 0;

    $telegram = ltrim($safe($body['telegram'] ?? '', 128), '@');
    $name     = $safe($body['name'] ?? '', 255);
    $family   = $safe($body['family'] ?? '', 255);
    $phone    = $safe($body['phone'] ?? '', 64);

    if ($telegram === '') {
        throw new InvalidArgumentException('Telegram is required');
    }
    if ($name === '' || $family === '') {
        throw new InvalidArgumentException('Name is required');
    }
    if (!$checkbox($body['consent_privacy'] ?? '') || !$checkbox($body['consent_personal_data'] ?? '')) {
        throw new InvalidArgumentException('Required consents are missing');
    }

    $data = [
        'name'                 => $name,
        'family'               => $family,
        'telegram'             => $telegram,
        'phone'                => $phone,
        'utm'                  => $safe($body['utm'] ?? ''),
        'consent_privacy'      => $checkbox($body['consent_privacy'] ?? ''),
        'consent_personal_data'=> $checkbox($body['consent_personal_data'] ?? ''),
        'consent_marketing'    => $checkbox($body['consent_marketing'] ?? ''),
        'ip_address'           => get_client_ip(),
        'user_agent'           => mb_substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 2000, 'UTF-8'),
    ];

    $pdo  = create_pdo($config['db']);
    $cols = array_keys($data);
    $sql  = 'INSERT INTO refs (' . implode(', ', $cols) . ') VALUES (:' . implode(', :', $cols) . ')';
    $stmt = $pdo->prepare($sql);
    foreach ($data as $k => $v) {
        $stmt->bindValue(':' . $k, $v);
    }
    $stmt->execute();

    respond(['ok' => true]);

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        respond(['ok' => true, 'dedup' => true]);
    }
    error_log('Partner DB error: ' . $e->getMessage());
    respond(['ok' => false, 'error' => 'Database write failed'], 500);
} catch (Throwable $e) {
    $status = $e instanceof InvalidArgumentException ? 400 : 500;
    respond(['ok' => false, 'error' => $e->getMessage()], $status);
}

function verify_captcha(string $token, string $ip, array $config): void
{
    $secret = (string)($config['captcha']['secret'] ?? '');
    if ($secret === '') return;
    if ($token === '') return; // скрипт не загрузился — пропускаем

    $url = 'https://smartcaptcha.yandexcloud.net/validate?' . http_build_query([
        'secret' => $secret,
        'token'  => $token,
        'ip'     => $ip,
    ]);

    $ctx = stream_context_create(['http' => ['timeout' => 5, 'ignore_errors' => true]]);
    $response = @file_get_contents($url, false, $ctx);
    if ($response === false) return;

    $data = json_decode($response, true);
    if (!isset($data['status']) || $data['status'] !== 'ok') {
        respond(['ok' => false, 'error' => 'Captcha failed'], 403);
    }
}

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function parse_body(): array
{
    $ct = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
    $raw = file_get_contents('php://input') ?: '';

    if (strpos($ct, 'application/json') !== false) {
        $json = json_decode($raw, true);
        return is_array($json) ? $json : [];
    }

    if (!empty($_POST)) {
        return $_POST;
    }

    parse_str($raw, $parsed);
    return is_array($parsed) ? $parsed : [];
}

function create_pdo(array $db): PDO
{
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'] ?? 'localhost',
        (int)($db['port'] ?? 3306),
        $db['database'] ?? '',
        $db['charset'] ?? 'utf8mb4'
    );
    return new PDO($dsn, $db['username'] ?? '', $db['password'] ?? '', [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
}

function get_client_ip(): string
{
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_REAL_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'] as $key) {
        $ip = trim(explode(',', (string)($_SERVER[$key] ?? ''))[0]);
        if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }
    return '';
}
