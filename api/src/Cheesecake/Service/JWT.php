<?php

namespace Cheesecake\Service;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use \Firebase\JWT\JWT;

/**
 * Provides a way to handle JWT a bit more properly
 */
class JWT
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * Secret Key.
     *
     * @var string
     */
    protected $secretKey;

    protected $decodedToken;

    public function __construct(Application $app, $secretKey)
    {
        $this->app = $app;
        $this->secretKey = $secretKey;
    }

    public function createToken(Request $request, $exp, $user)
    {
        $rand_val = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6);

        $payload = [
            'iss' => $request->getClientIp(),
            'sub' => '',
            'aud' => 'http://sheaker.com',
            'exp' => $exp,
            'nbf' => time(),
            'iat' => time(),
            'jti' => hash('sha256', time() . $rand_val),
            'user' => $user
        ];

        $token = JWT::encode($payload, $this->secretKey);

        return $token;
    }

    public function checkIfTokenIsPresentAndLikeAVirgin(Request $request)
    {
        // Authorization shouldn't being able to be retrieve here, but rewrite magic happen in vhost configuration
        $authorizationHeader = $request->headers->get('Authorization');
        if ($authorizationHeader == null) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'No authorization header sent');
        }

        // $authorizationHeader should be in that form: Bearer THE_TOKEN
        $token = explode(' ', $authorizationHeader)[1];
        try {
            $this->decodedToke = JWT::decode($token, $this->secretKey, array('HS256'));
        }
        catch(UnexpectedValueException $ex) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'Invalid token');
        }

        return $decoded_token;
    }

    public function getDecodedToken()
    {
        return $this->decodedToken;
    }
}
