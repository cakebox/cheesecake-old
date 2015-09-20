<?php

namespace Cheesecake\Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Cheesecake\Entity\User;

class UserController
{
    public function loginAction(Request $request, Application $app)
    {
        $username   = $app->escape($request->get('username'));
        $password   = $app->escape($request->get('password'));
        $rememberMe = $app->escape($request->get('rememberMe'));

        if (!$username || !$password) {
            $app->abort(Response::HTTP_BAD_REQUEST, 'Missing parameters');
        }

        $user = $app['repository.user']->findByUsername($username);
        if (!$user) {
            $app->abort(Response::HTTP_NOT_FOUND, 'User not found');
        }

        if (password_verify($password, $user->getPassword())) {
            $user->setLastSeen(new \DateTime('now'));
            $user->setLastIP($request->headers->get('referer'));
            $user->setFailedLogins(0);
            $app['repository.user']->save($user);

            //$access_query = 'SELECT user_level FROM users_access WHERE user_id = ' . $account['id'];
            //$access       = $app['db']->fetchAssoc($access_query);
            $permissions = [];
            //foreach ($access as $accessLevel) {
            //    array_push($permissions, $app['api.accessLevels'][$accessLevel]);
            //}

            $exp = ($rememberMe) ? time() + 60 * 60 * 24 * 30 : time() + 60 * 60 * 24; // expire in 30 days or 24h
            $user = [
                'id'          => $user->getId(),
                'username'    => $user->getUsername(),
                'permissions' => $permissions,
                'rememberMe'  => $rememberMe
            ];

            $token = $app['jwt']->createToken($request, $exp, $user);
        }
        else {
            $user->setFailedLogins($user->getFailedLogins() + 1);
            $app['repository.user']->save($user);
            $app->abort(Response::HTTP_FORBIDDEN, 'Wrong password');
        }

        return json_encode(['token' => $token], JSON_NUMERIC_CHECK);
    }
}
