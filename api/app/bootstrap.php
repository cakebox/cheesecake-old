<?php

namespace CoLabSubs;

require_once __DIR__ . "/../tmp/composer/autoload.php";

use Silex\Application;
use Silex\Provider\DoctrineServiceProvider;
use Silex\Provider\MonologServiceProvider;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

define("APPLICATION_ENV", getenv("APPLICATION_ENV") ?: "production");

$app = new Application();

if (APPLICATION_ENV != "production") {
    $app["debug"] = true;
    ini_set('display_error', 1);
    error_reporting(E_ALL);
} else {
    $app['controllers']->requireHttps();
}

require_once __DIR__ . "/config/colabsubs.php";

$app->register(new DoctrineServiceProvider(), [
    "db.options" => [
        "dbname"   => $app["database.dbname"],
        "host"     => $app["database.host"],
        "user"     => $app["database.user"],
        "password" => $app["database.passwd"],
    ],
]);

$app->register(new MonologServiceProvider(), [
    "monolog.logfile" => $app["log.location"],
    "monolog.level"   => $app["log.level"],
    "monolog.name"    => "api"
]);

foreach (glob(__DIR__ . "/{models,controllers}/*.php", GLOB_BRACE) as $file) {
    require_once $file;
}

$app->before(function (Request $request) {
    if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
        $data = json_decode($request->getContent(), true);
        $request->request->replace(is_array($data) ? $data : array());
    }
});

$app->error(function (\Exception $e, $code) use ($app) {
    $app['monolog']->addError($e->getMessage());
    $app['monolog']->addError($e->getTraceAsString());
    return new JsonResponse(["status_code" => $code, "message" => $e->getMessage()]);
});

// Black magic to handle OPTIONS with the API
$app->match("{url}", function($url) use ($app) { return "OK"; })->assert('url', '.*')->method("OPTIONS");

return $app;
