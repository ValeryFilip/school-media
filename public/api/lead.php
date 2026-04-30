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
    respond(['ok' => false, 'error' => 'Lead config file is missing'], 500);
}

$config = require $configPath;
if (!is_array($config) || !isset($config['db']) || !is_array($config['db'])) {
    respond(['ok' => false, 'error' => 'Lead config is invalid'], 500);
}

try {
    $raw = parse_payload();
    $payload = normalize_payload($raw);
    validate_payload($payload);

    $payload['ip_address'] = get_client_ip();
    $payload['user_agent'] = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 2000);
    $payload['raw_json'] = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $pdo = create_pdo($config['db']);
    insert_lead($pdo, $payload);

    respond(['ok' => true, 'submission_id' => $payload['submission_id']]);
} catch (PDOException $error) {
    if ($error->getCode() === '23000') {
        respond(['ok' => true, 'dedup' => true]);
    }

    error_log('Lead DB error: ' . $error->getMessage());
    respond(['ok' => false, 'error' => 'Database write failed'], 500);
} catch (Throwable $error) {
    error_log('Lead endpoint error: ' . $error->getMessage());
    $status = $error instanceof InvalidArgumentException ? 400 : 500;
    respond(['ok' => false, 'error' => $error->getMessage()], $status);
}

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function parse_payload(): array
{
    $contentType = strtolower((string)($_SERVER['CONTENT_TYPE'] ?? ''));
    $rawBody = file_get_contents('php://input') ?: '';

    if (strpos($contentType, 'application/json') !== false) {
        $json = json_decode($rawBody, true);
        return is_array($json) ? $json : [];
    }

    if (!empty($_POST)) {
        $data = $_POST;
        if (isset($data['payload']) && is_string($data['payload'])) {
            $json = json_decode($data['payload'], true);
            if (is_array($json)) return $json;
        }
        if (isset($data['raw_json']) && is_string($data['raw_json'])) {
            $json = json_decode($data['raw_json'], true);
            if (is_array($json)) return array_merge($json, $data);
        }
        return $data;
    }

    parse_str($rawBody, $parsed);
    return is_array($parsed) ? $parsed : [];
}

function normalize_payload(array $source): array
{
    $safe = static function ($value, int $limit = 0): string {
        $value = trim((string)($value ?? ''));
        return $limit > 0 ? mb_substr($value, 0, $limit, 'UTF-8') : $value;
    };

    $checkbox = static function ($value): int {
        $normalized = strtolower(trim((string)($value ?? '')));
        return in_array($normalized, ['true', '1', 'on', 'yes'], true) ? 1 : 0;
    };

    $submissionId = $safe($source['submission_id'] ?? '', 128);
    if ($submissionId === '') {
        $submissionId = bin2hex(random_bytes(16));
    }

    return [
        'form_type' => $safe($source['form_type'] ?? 'lead', 64),
        'form_id' => $safe($source['form_id'] ?? 'form', 128),
        'name' => $safe($source['name'] ?? $source['fullName'] ?? $source['full_name'] ?? '', 255),
        'phone' => $safe($source['phone'] ?? '', 64),
        'telegram' => ltrim($safe($source['telegram'] ?? '', 128), '@'),
        'email' => $safe($source['email'] ?? '', 255),
        'message' => $safe($source['message'] ?? ''),
        'consent_privacy' => $checkbox($source['consent_privacy'] ?? ''),
        'consent_personal_data' => $checkbox($source['consent_personal_data'] ?? ''),
        'consent_marketing' => $checkbox($source['consent_marketing'] ?? ''),
        'page' => $safe($source['page'] ?? ''),
        'page_title' => $safe($source['page_title'] ?? '', 512),
        'referrer' => $safe($source['referrer'] ?? ''),
        'session_id' => $safe($source['session_id'] ?? '', 128),
        'submission_id' => $submissionId,
        'ga_client_id' => $safe($source['ga_client_id'] ?? '', 128),
        'popup_id' => $safe($source['popup_id'] ?? '', 128),
        'trigger_id' => $safe($source['trigger_id'] ?? '', 128),
        'trigger_text' => $safe($source['trigger_text'] ?? '', 512),
        'trigger_source' => $safe($source['trigger_source'] ?? '', 128),
        'trigger_variant' => $safe($source['trigger_variant'] ?? '', 128),
        'trigger_campaign' => $safe($source['trigger_campaign'] ?? '', 255),
        'lt_source' => $safe($source['lt_source'] ?? '', 255),
        'lt_medium' => $safe($source['lt_medium'] ?? '', 255),
        'lt_campaign' => $safe($source['lt_campaign'] ?? '', 255),
        'lt_content' => $safe($source['lt_content'] ?? '', 255),
        'lt_term' => $safe($source['lt_term'] ?? '', 255),
        'ft_source' => $safe($source['ft_source'] ?? '', 255),
        'ft_medium' => $safe($source['ft_medium'] ?? '', 255),
        'ft_campaign' => $safe($source['ft_campaign'] ?? '', 255),
        'ft_content' => $safe($source['ft_content'] ?? '', 255),
        'ft_term' => $safe($source['ft_term'] ?? '', 255),
        'ref_code' => $safe($source['ref_code'] ?? $source['ref'] ?? $source['ref_slug'] ?? $source['partner'] ?? $source['partner_code'] ?? $source['partner_slug'] ?? '', 255),
        'ref_first_code' => $safe($source['ref_first_code'] ?? '', 255),
        'ref_last_code' => $safe($source['ref_last_code'] ?? '', 255),
        'raw_json' => '',
        'ip_address' => '',
        'user_agent' => '',
    ];
}

function validate_payload(array $payload): void
{
    if ($payload['phone'] === '' && $payload['telegram'] === '' && $payload['email'] === '') {
        throw new InvalidArgumentException('At least one contact field is required');
    }

    if ($payload['consent_privacy'] !== 1 || $payload['consent_personal_data'] !== 1) {
        throw new InvalidArgumentException('Required consents are missing');
    }
}

function create_pdo(array $db): PDO
{
    $host = (string)($db['host'] ?? 'localhost');
    $port = (int)($db['port'] ?? 3306);
    $database = (string)($db['database'] ?? '');
    $charset = (string)($db['charset'] ?? 'utf8mb4');
    $username = (string)($db['username'] ?? '');
    $password = (string)($db['password'] ?? '');

    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset={$charset}";

    return new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function insert_lead(PDO $pdo, array $data): void
{
    $columns = [
        'form_type',
        'form_id',
        'name',
        'phone',
        'telegram',
        'email',
        'message',
        'consent_privacy',
        'consent_personal_data',
        'consent_marketing',
        'page',
        'page_title',
        'referrer',
        'session_id',
        'submission_id',
        'ga_client_id',
        'popup_id',
        'trigger_id',
        'trigger_text',
        'trigger_source',
        'trigger_variant',
        'trigger_campaign',
        'lt_source',
        'lt_medium',
        'lt_campaign',
        'lt_content',
        'lt_term',
        'ft_source',
        'ft_medium',
        'ft_campaign',
        'ft_content',
        'ft_term',
        'ref_code',
        'ref_first_code',
        'ref_last_code',
        'raw_json',
        'ip_address',
        'user_agent',
    ];

    $placeholders = array_map(static fn($column) => ':' . $column, $columns);
    $sql = 'INSERT INTO leads (' . implode(', ', $columns) . ') VALUES (' . implode(', ', $placeholders) . ')';
    $stmt = $pdo->prepare($sql);

    foreach ($columns as $column) {
        $stmt->bindValue(':' . $column, $data[$column]);
    }

    $stmt->execute();
}

function get_client_ip(): string
{
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        $_SERVER['HTTP_X_REAL_IP'] ?? '',
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];

    foreach ($candidates as $candidate) {
        $ip = trim(explode(',', (string)$candidate)[0]);
        if ($ip !== '' && filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }

    return '';
}

