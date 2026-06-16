<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Method not allowed'], 405);
}

$configPath = __DIR__ . '/lead.config.php';
if (!is_file($configPath)) {
    respond(['error' => 'Config file is missing'], 500);
}

$config = require $configPath;
if (!is_array($config) || !isset($config['db']) || !is_array($config['db'])) {
    respond(['error' => 'Config is invalid'], 500);
}

try {
    $telegram = ltrim(trim((string)($_GET['telegram'] ?? '')), '@');

    if ($telegram === '') {
        respond(['error' => 'Telegram is required'], 400);
    }
    if (!preg_match('/^[A-Za-z0-9_]{3,64}$/', $telegram)) {
        respond(['error' => 'Invalid Telegram username'], 400);
    }

    $pdo = create_pdo($config['db']);
    $columns = get_table_columns($pdo, 'refs');
    if (!isset($columns['telegram'])) {
        respond(['error' => 'Telegram column is missing'], 500);
    }
    $select = [
        column_expr($columns, 'name', "''"),
        column_expr($columns, 'family', "''"),
        column_expr($columns, 'telegram', "''"),
        column_expr($columns, 'students', '0'),
        column_expr($columns, 'stepik', '0'),
        column_expr($columns, 'total', '0'),
        column_expr($columns, 'paid', '0'),
        first_existing_column_expr($columns, ['ref_link', 'ref_url', 'referral_link', 'partner_link', 'link'], "''", 'ref_link'),
    ];

    $stmt = $pdo->prepare(
        'SELECT ' . implode(', ', $select) . ' FROM refs WHERE LOWER(telegram) = LOWER(?) LIMIT 1'
    );
    $stmt->execute([$telegram]);
    $row = $stmt->fetch();

    if ($row === false) {
        respond(['error' => 'Not found'], 404);
    }

    respond([
        'ok' => true,
        'name' => (string)($row['name'] ?? ''),
        'family' => (string)($row['family'] ?? ''),
        'telegram' => (string)($row['telegram'] ?? $telegram),
        'students' => (int)($row['students'] ?? 0),
        'stepik' => (float)($row['stepik'] ?? 0),
        'total' => (float)($row['total'] ?? 0),
        'paid' => (float)($row['paid'] ?? 0),
        'ref_link' => (string)($row['ref_link'] ?? ''),
    ]);

} catch (Throwable $e) {
    error_log('TgChecker error: ' . $e->getMessage());
    respond(['error' => 'Server error'], 500);
}

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
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

function get_table_columns(PDO $pdo, string $table): array
{
    $stmt = $pdo->query('SHOW COLUMNS FROM `' . str_replace('`', '``', $table) . '`');
    $columns = [];
    foreach ($stmt->fetchAll() as $row) {
        $name = (string)($row['Field'] ?? '');
        if ($name !== '') {
            $columns[$name] = true;
        }
    }
    return $columns;
}

function column_expr(array $columns, string $name, string $fallback): string
{
    $alias = '`' . str_replace('`', '``', $name) . '`';
    if (isset($columns[$name])) {
        return $alias;
    }
    return $fallback . ' AS ' . $alias;
}

function first_existing_column_expr(array $columns, array $names, string $fallback, string $alias): string
{
    foreach ($names as $name) {
        if (isset($columns[$name])) {
            return '`' . str_replace('`', '``', $name) . '` AS `' . str_replace('`', '``', $alias) . '`';
        }
    }
    return $fallback . ' AS `' . str_replace('`', '``', $alias) . '`';
}
