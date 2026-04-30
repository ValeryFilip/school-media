<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

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

    $pdo  = create_pdo($config['db']);
    $stmt = $pdo->prepare(
        'SELECT name, family, telegram, students, stepik, total, paid FROM refs WHERE telegram = ? LIMIT 1'
    );
    $stmt->execute([$telegram]);
    $row = $stmt->fetch();

    if ($row === false) {
        respond(['error' => 'Not found'], 404);
    }

    respond($row);

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
