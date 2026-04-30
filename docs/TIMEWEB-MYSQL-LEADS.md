# Timeweb MySQL leads setup

## Database

- Host: `localhost`
- Database: `cy90253_egehim`
- User: `cy90253_egehim`
- Table: `leads`
- PHP: `7.4.33`

The `leads` table mirrors the previous Google Sheets lead structure and adds:

- `id`
- `ip_address`
- `user_agent`

## Server config

After deploying the site to Timeweb, create this file manually:

```text
/api/lead.config.php
```

Use `public/api/lead.config.example.php` as the template and replace only the password:

```php
<?php

return [
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'cy90253_egehim',
        'username' => 'cy90253_egehim',
        'password' => 'YOUR_REAL_DATABASE_PASSWORD',
        'charset' => 'utf8mb4',
    ],
];
```

Do not commit `lead.config.php`. It is ignored by Git.

## Endpoint

Lead forms submit to:

```text
/api/lead.php
```

The endpoint writes one row to `leads` and returns JSON:

```json
{ "ok": true }
```

## Smoke test

After deployment:

1. Open the site.
2. Submit a test lead form.
3. Check phpMyAdmin: table `leads` should receive a new row.
4. Verify these fields are filled:
   - `created_at`
   - `form_type`
   - `form_id`
   - contact field: `phone`, `telegram`, or `email`
   - `consent_privacy`
   - `consent_personal_data`
   - `consent_marketing`
   - `page`
   - `submission_id`
   - `ip_address`
   - `user_agent`

