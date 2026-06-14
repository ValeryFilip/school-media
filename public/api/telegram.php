<?php

declare(strict_types=1);

/**
 * Отправка уведомления о заявке в Telegram-бота.
 *
 * Никогда не бросает исключений наружу — любые ошибки пишутся в error_log,
 * чтобы недоступность Telegram не ломала приём заявки.
 *
 * Конфигурация берётся из секции 'telegram' в lead.config.php:
 *   'telegram' => ['enabled' => true, 'bot_token' => '...', 'chat_id' => '...']
 */
function tg_notify(array $config, string $text): void
{
    $tg = $config['telegram'] ?? null;
    if (!is_array($tg) || empty($tg['enabled']) || empty($tg['bot_token']) || empty($tg['chat_id'])) {
        return;
    }

    try {
        $url = 'https://api.telegram.org/bot' . $tg['bot_token'] . '/sendMessage';
        $body = http_build_query([
            'chat_id' => (string)$tg['chat_id'],
            'text' => $text,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => 'true',
        ]);
        tg_transport($url, $body);
    } catch (Throwable $e) {
        error_log('Telegram notify failed: ' . $e->getMessage());
    }
}

/**
 * HTTP POST в Telegram API. Сначала cURL, при отсутствии — stream-context.
 */
function tg_transport(string $url, string $body): void
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ]);
        $resp = curl_exec($ch);
        $errno = curl_errno($ch);
        $err = curl_error($ch);
        curl_close($ch);
        if ($resp === false || $errno !== 0) {
            throw new RuntimeException('cURL error: ' . $err);
        }
        return;
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 5,
            'ignore_errors' => true,
        ],
    ]);
    $resp = @file_get_contents($url, false, $context);
    if ($resp === false) {
        throw new RuntimeException('file_get_contents transport failed');
    }
}

/**
 * Экранирование значений для parse_mode=HTML.
 */
function tg_escape($value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
