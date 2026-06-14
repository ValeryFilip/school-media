<?php

return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'cy90253_egehim',
        'username' => 'cy90253_egehim',
        'password' => 'PUT_DATABASE_PASSWORD_HERE',
        'charset' => 'utf8mb4',
    ],

    // Уведомления о заявках в Telegram (необязательная секция).
    // Если enabled=false или нет токена — заявки просто не дублируются в Telegram,
    // запись в БД и ответ формы при этом не меняются.
    'telegram' => [
        'enabled'   => true,
        'bot_token' => 'PUT_BOT_TOKEN_HERE', // токен от @BotFather, формат 12345:AA...
        'chat_id'   => 'PUT_CHAT_ID_HERE',   // личный ID, ID группы (отриц.) или @channelusername
    ],
];
