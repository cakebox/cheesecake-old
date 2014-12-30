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


$app->post("/users",                  __NAMESPACE__ . "\\login");
$app->post("/users/{id}/renew_token", __NAMESPACE__ . "\\renew_token")
    ->assert('id', '\d+');
$app->get("/users/{id}",              __NAMESPACE__ . "\\user_informations")
    ->assert('id', '\d+');


function login(Application $app, Request $request) {

    $email      = $request->get('email');
    $password   = $request->get('password');
    $rememberMe = $request->get('rememberMe');

    if (!$email || !$password) {
        $app->abort(400, "Missing parameters.");
    }

    if ($email == "test@test.com" && $password == "test")
    {
        $payload = array(
            "iss" => "http://example.org",
            "iat" => time(),
            "exp" => ($rememberMe) ? time() + 60 * 60 * 24 * 360 : time() + 60 * 60 * 24, // expire in 1year or 24h
            "user" => [
                "id" => 1,
                "username" => "test",
                "isAdmin" => false,
            ]
        );

        $jwt = \JWT::encode($payload, $app["api.secretKey"]);
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
