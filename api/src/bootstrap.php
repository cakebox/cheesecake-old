<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Silex\Application;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\MonologServiceProvider;
use Symfony\Component\HttpFoundation\JsonResponse;

define('APPLICATION_ENV', getenv('APPLICATION_ENV') ?: 'production');

$app = new Application();

if (APPLICATION_ENV != 'production') {
    $app['debug'] = true;
    ini_set('display_error', 1);
    error_reporting(E_ALL);
} else {
    $app['controllers']->requireHttps();
}

require_once __DIR__ . '/../config/colabsubs.php';

/**
 * Register service providers
 */
$app->register(new DoctrineServiceProvider(), [
    'db.options' => [
        'dbname'   => $app['database.dbname'],
        'host'     => $app['database.host'],
        'user'     => $app['database.user'],
        'password' => $app['database.passwd'],
    ],
]);

$app->register(new MonologServiceProvider(), [
    'monolog.logfile' => $app['log.location'],
    'monolog.level'   => $app['log.level'],
    'monolog.name'    => 'api'
]);

/**
 * Register repositories
 */
$app['repository.user'] = $app->share(function ($app) {
    return new CoLabSubs\Repository\UserRepository($app['db']);
});

/**
 * Register custom services
 */
$app['jwt'] = $app->share(function ($app) {
    return new CoLabSubs\Service\JWT($app, $app['api.secretKey']);
});

/**
 * Register error handler
 */
$app->error(function (\Exception $e, $code) use ($app) {
    if ($app['debug'])
        return;

    $app['monolog']->addError($e->getMessage());
    $app['monolog']->addError($e->getTraceAsString());

    return new JsonResponse(['error' => ['code' => $code, 'message' => $e->getMessage()]]);
});

// Black magic to handle OPTIONS with the API
$app->match('{url}', function($url) use ($app) { return 'OK'; })->assert('url', '.*')->method('OPTIONS');

require_once __DIR__ . '/routing.php';

return $app;
