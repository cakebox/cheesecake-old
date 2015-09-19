<?php

/**
 * User routes
 */
$app->post('/users/login',       'Cheesecake\Controller\UserController::loginAction');
$app->post('/users/renew_token', 'Cheesecake\Controller\UserController::renewTokenAction');
