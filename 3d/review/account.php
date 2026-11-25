<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}
function fail(string $message, int $status = 400): void {
    reply(['error' => $message], $status);
}
function query(PDO $db, string $sql, array $params = []): PDOStatement {
    $statement = $db->prepare($sql);
    $statement->execute($params);
    return $statement;
}
function accountName($value): string {
    return is_string($value) ? strtolower(trim($value)) : '';
}
function storage(): PDO {
    $root = realpath($_SERVER['DOCUMENT_ROOT']);
    if (!$root) fail('سرویس حساب در دسترس نیست.', 503);
    $dir = dirname($root) . '/.futurehawzah-data-' . substr(hash('sha256', $root), 0, 12);
    umask(0077);
    if ((is_link($dir) || !is_dir($dir)) && !@mkdir($dir, 0700) && !is_dir($dir)) {
        fail('سرویس حساب در دسترس نیست.', 503);
    }
    if (realpath($dir) !== $dir) fail('سرویس حساب در دسترس نیست.', 503);
    $db = new PDO('sqlite:' . $dir . '/atlas.sqlite', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA busy_timeout=5000');
    $db->exec("CREATE TABLE IF NOT EXISTS accounts (name TEXT PRIMARY KEY, pass TEXT NOT NULL);
               CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
               CREATE TABLE IF NOT EXISTS review (id TEXT PRIMARY KEY, author TEXT NOT NULL, topic TEXT NOT NULL, text TEXT NOT NULL, state INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL);
               CREATE TABLE IF NOT EXISTS limits (key TEXT PRIMARY KEY, hits INTEGER NOT NULL, until INTEGER NOT NULL)");
    return $db;
}
function throttle(PDO $db, string $bucket, int $max, int $period = 900): void {
    $now = time();
    $id = hash('sha256', $bucket . '|' . ($_SERVER['REMOTE_ADDR'] ?? ''));
    $db->beginTransaction();
    query($db, 'DELETE FROM limits WHERE until < ?', [$now]);
    query($db, 'INSERT OR IGNORE INTO limits VALUES (?, 0, ?)', [$id, $now + $period]);
    query($db, 'UPDATE limits SET hits = hits + 1 WHERE key = ?', [$id]);
    $hits = (int)query($db, 'SELECT hits FROM limits WHERE key = ?', [$id])->fetchColumn();
    $db->commit();
    if ($hits > $max) fail('لطفاً کمی بعد دوباره تلاش کنید.', 429);
}
function preferences($value): array {
    if (!is_array($value)) fail('تنظیمات معتبر نیست.');
    $hue = $value['hue'] ?? null;
    $all = $value['allPreviews'] ?? null;
    $sizes = $value['sizes'] ?? [];
    if (!is_int($hue) || $hue < 0 || $hue > 359 || !is_bool($all) || !is_array($sizes)) fail('تنظیمات معتبر نیست.');
    $clean = [];
    foreach (['infoPanel','presentationPanel','bookDrawer','decisionPanel','introPanel','recapPanel'] as $key) {
        if (!isset($sizes[$key]) || !is_array($sizes[$key])) continue;
        $w = $sizes[$key][0] ?? 0;
        $h = $sizes[$key][1] ?? 0;
        if (is_int($w) && $w >= 235 && $w <= 1500 && is_int($h) && $h >= 148 && $h <= 1400) $clean[$key] = [$w, $h];
    }
    return ['hue'=>$hue, 'allPreviews'=>$all, 'sizes'=>(object)$clean];
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method !== 'GET' && $method !== 'POST') fail('درخواست معتبر نیست.', 405);
    $db = storage();
    if ($method === 'GET' && ($_GET['view'] ?? '') === 'defaults') {
        $stored = query($db, "SELECT value FROM settings WHERE key = 'display'")->fetchColumn();
        reply(['defaults' => $stored ? json_decode($stored, true) : (object)[]]);
    }
    if ($method === 'GET' && ($_GET['view'] ?? '') === 'approved') {
        reply(['items' => query($db, "SELECT id, topic AS title, text FROM review WHERE state = 1 ORDER BY created DESC LIMIT 100")->fetchAll(PDO::FETCH_ASSOC)]);
    }
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    session_name('FHAtlas');
    session_set_cookie_params(['lifetime'=>0,'path'=>'/3d/','secure'=>true,'httponly'=>true,'samesite'=>'Strict']);
    session_start();
    if (isset($_SESSION['expires']) && $_SESSION['expires'] < time()) $_SESSION = [];
    if (!isset($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
    $role = $_SESSION['role'] ?? null;
    if ($method === 'GET') {
        if (($_GET['view'] ?? '') === 'pending') {
            if ($role !== 'admin') fail('ابتدا وارد حساب مدیر شوید.', 403);
            reply(['items' => query($db, "SELECT id, topic, text FROM review WHERE state = 0 ORDER BY created DESC LIMIT 60")->fetchAll(PDO::FETCH_ASSOC)]);
        }
        $activated = (bool)query($db, "SELECT 1 FROM accounts WHERE name = 'admin'")->fetchColumn();
        reply(['role'=>$role,'csrf'=>$_SESSION['csrf'],'activated'=>$activated]);
    }
    if (!hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_ATLAS_TOKEN'] ?? '')) fail('لطفاً صفحه را دوباره باز کنید.', 403);
    $raw = file_get_contents('php://input', false, null, 0, 12000);
    $body = json_decode($raw ?: '', true);
    if (!is_array($body)) fail('درخواست معتبر نیست.');
    $action = $body['action'] ?? '';
    if (in_array($action, ['signup','login','admin','activate'], true)) {
        throttle($db, 'auth', 20);
        $admin = in_array($action, ['admin','activate'], true);
        $name = $admin ? 'admin' : accountName($body['name'] ?? null);
        $pass = $body['password'] ?? null;
        if (!is_string($pass) || strlen($pass) > 72 || strlen($pass) < ($admin ? 12 : 8) ||
            !preg_match('/^[a-z0-9_-]{3,32}$/D', $name) || (!$admin && $name === 'admin')) {
            fail($admin ? 'گذرواژهٔ مدیر باید دست‌کم ۱۲ نویسه باشد.' : 'نام کاربری یا گذرواژه معتبر نیست.');
        }
        if ($action === 'activate') {
            $code = $body['code'] ?? null;
            if (!is_string($code) || !hash_equals('797f9d4dbdf52a56f6f6b189a2f57e599891b15cc880269364be829d553bb05a', hash('sha256', $code))) fail('کد فعال‌سازی درست نیست.', 403);
        }
        if ($action === 'signup' || $action === 'activate') {
            $created = query($db, 'INSERT OR IGNORE INTO accounts VALUES (?, ?)', [$name, password_hash($pass, PASSWORD_DEFAULT)]);
            if (!$created->rowCount()) fail($admin ? 'حساب مدیر فعال شده است.' : 'این نام کاربری در دسترس نیست.', 409);
        } else {
            $hash = query($db, 'SELECT pass FROM accounts WHERE name = ?', [$name])->fetchColumn();
            if (!password_verify($pass, $hash ?: '$2y$10$xlQ9XLC.PtlYHhNNhoNO0uQ.eBh8cACrA99XOlJ9xIDRi/jK1Wmgi') || !$hash) {
                fail('نام کاربری یا گذرواژه درست نیست.', 403);
            }
        }
        session_regenerate_id(true);
        $_SESSION = ['role'=>$admin?'admin':'member','user'=>$name,'expires'=>time()+($admin?14400:86400),'csrf'=>bin2hex(random_bytes(32))];
        reply(['role'=>$_SESSION['role'],'csrf'=>$_SESSION['csrf']]);
    }
    if ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        reply(['role'=>null]);
    }
    if (!$role) fail('برای ارسال نکته وارد حساب شوید.', 401);
    if ($action === 'submit') {
        throttle($db, 'submit', 12, 3600);
        $text = is_string($body['text'] ?? null) ? trim($body['text']) : '';
        $topic = is_string($body['topic'] ?? null) ? trim($body['topic']) : '';
        if ($text === '' || !preg_match('/^.{1,2000}$/suD', $text) || !preg_match('/^.{1,120}$/suD', $topic)) fail('موضوع و متن نکته را بررسی کنید.');
        query($db, 'INSERT INTO review (id,author,topic,text,created) VALUES (?,?,?,?,?)', [bin2hex(random_bytes(12)), $_SESSION['user'], $topic, $text, time()]);
        reply(['ok'=>true]);
    }
    if ($role !== 'admin') fail('این گزینه برای مدیر است.', 403);
    if ($action === 'defaults') {
        $prefs = preferences($body['defaults'] ?? null);
        query($db, "INSERT OR REPLACE INTO settings VALUES ('display', ?)", [json_encode($prefs)]);
        reply(['ok'=>true]);
    }
    if ($action === 'moderate') {
        $id = $body['id'] ?? '';
        $approve = $body['approve'] ?? null;
        if (!is_string($id) || !preg_match('/^[a-f0-9]{24}$/D', $id) || !is_bool($approve)) fail('درخواست معتبر نیست.');
        query($db, 'UPDATE review SET state = ? WHERE id = ? AND state = 0', [$approve?1:2, $id]);
        reply(['ok'=>true]);
    }
    fail('درخواست معتبر نیست.', 404);
} catch (Throwable $e) {
    error_log('FutureHawzah account: ' . get_class($e));
    fail('سرویس حساب در دسترس نیست. بعداً دوباره تلاش کنید.', 503);
}
