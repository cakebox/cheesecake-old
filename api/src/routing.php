<?php

/**
 * User routes
 */
$app->post('/users/login',       'CoLabSubs\Controller\UserController::loginAction');
$app->post('/users/renew_token', 'CoLabSubs\Controller\UserController::renewTokenAction');
