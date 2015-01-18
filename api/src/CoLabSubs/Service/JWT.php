<?php

namespace CoLabSubs\Service;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

    public function __construct(Application $app, $secretKey)
    {
        $this->app = $app;
        $this->secretKey = $secretKey;
    }

    public function createToken($referer, $exp, $user)
    {
        $payload = [
            'iss' => $referer,
            'iat' => time(),
            'exp' => $exp,
            'user' => $user
        ];

        $token = \JWT::encode($payload, $this->secretKey);

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
            $decoded_token = \JWT::decode($token, $this->secretKey);
        }
        catch(UnexpectedValueException $ex) {
            $this->app->abort(Response::HTTP_UNAUTHORIZED, 'Invalid token');
        }

        return $decoded_token;
    }
}
