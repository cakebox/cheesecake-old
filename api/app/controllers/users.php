<?php

namespace CoLabSubs\Controllers\Users;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;


// Check token integrity
function check_token(Request $request, Application $app) {

    // Authorization shouldn't being able to be retrieve here, but rewrite magic happen in vhost configuration
    $authorizationHeader = $request->headers->get("Authorization");
    if ($authorizationHeader == null) {
        $app->abort(401, "No authorization header sent");
    }

    // $authorizationHeader should be in that form: Bearer THE_TOKEN
    $token = explode(' ', $authorizationHeader)[1];
    try {
        $decoded_token = \JWT::decode($token, $app["api.secretKey"]);
    }
    catch(UnexpectedValueException $ex) {
        $app->abort(401, "Invalid token");
    }

    return $decoded_token;
};


$app->post("/users",                  __NAMESPACE__ . "\\register");
$app->get("/users/{username}",        __NAMESPACE__ . "\\check_availability");
$app->post("/users/login",            __NAMESPACE__ . "\\login");
$app->post("/users/{id}/renew_token", __NAMESPACE__ . "\\renew_token")
    ->assert('id', '\d+');
$app->get("/users/{id}",              __NAMESPACE__ . "\\user_informations")
    ->assert('id', '\d+');


function register(Application $app, Request $request) {

    $username   = $request->get('username');
    $email      = $request->get('email');
    $password   = $request->get('password');

    if (!$username || !$email || !$password) {
        $app->abort(400, "Missing parameters.");
    }

    $app['db']->insert('users', [
        'username' => $username,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'email'    => $email,
        'last_ip'  => $request->getClientIp()
        ]
    );

    return json_encode(["response" => "ok"], JSON_NUMERIC_CHECK);
}

function check_availability(Application $app, $username) {

    $username_query = "SELECT id FROM users WHERE username = '{$username}'";
    $username       = $app['db']->fetchAssoc($username_query);

    $isAvailable = (!$username) ? true : false;

    return json_encode(["isAvailable" => $isAvailable], JSON_NUMERIC_CHECK);
}

function login(Application $app, Request $request) {

    $username   = $request->get('username');
    $password   = $request->get('password');
    $rememberMe = $request->get('rememberMe');

    if (!$username || !$password) {
        $app->abort(400, "Missing parameters.");
    }

    $account_query = "SELECT id, password, failed_logins FROM users WHERE username = '{$username}'";
    $account       = $app['db']->fetchAssoc($account_query);

    if (password_verify($password, $account["password"])) {

        $app['db']->update('users', [
            'last_seen'     => date('Y-m-d G:i:s'),
            'failed_logins' => 0
        ], ['id' => $account["id"]]);

        $payload = array(
            "iss" => $request->headers->get('referer'),
            "iat" => time(),
            "exp" => ($rememberMe) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24, // expire in 1year or 24h
            "user" => [
                "id" => $account["id"],
                "username" => $username,
                "isAdmin" => false,
            ]
        );

        $jwt = \JWT::encode($payload, $app["api.secretKey"]);
    }
    else {
        $app['db']->update('users', ['failed_logins' => $account["failed_logins"] + 1], ['id' => $account["id"]]);
    }

    return json_encode(["token" => $jwt], JSON_NUMERIC_CHECK);
}

function renew_token(Application $app, Request $request, $id) {

    $token = check_token($request, $app);

    // the user is trying to renew his token with a different id ?
    if ($id !== $token["user"]["id"])
        $id = $token["user"]["id"];

    $payload = array(
        "iss" => "http://example.org",
        "iat" => time(),
        "exp" => time() + 60 * 60 * 24, // expire in 24h
        "user" => [
            "id" => $id,
            "username" => "test",
            "isAdmin" => false,
            ]
        );

    $jwt = \JWT::encode($payload, $app["api.secretKey"]);

    return json_encode(["token" => $jwt], JSON_NUMERIC_CHECK);
}

function user_informations(Application $app, Request $request, $id) {

    return json_encode([""=>""], JSON_NUMERIC_CHECK);
}
