
## Installation for devs

Simply run this following command in the api directory

```shell
composer install
```

Edit the /etc/hosts an add this line

```
127.0.0.1 api.cheesecake.io
```

Create a new file something like /etc/apache2/site-avalaible/api.cheesecake.io and adapt the configuration (paths...)

```
<VirtualHost api.cheesecake.io:80>
    ServerAdmin mail@mail.fr
    ServerName api.cheesecake.io

    SetEnv APPLICATION_ENV development
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Headers X-Requested-With,Content-Type,Authorization
    #Header set Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS

    DocumentRoot "/home/myuser/mywebsites/cheesecake/api/public/"
    <Directory "/home/myuser/mywebsites/cheesecake/api/public/">
        Options Indexes MultiViews FollowSymLinks
        Require all granted

        RewriteEngine On
        RewriteBase /
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.php [L]
        RewriteCond %{HTTP:Authorization} ^(.*)
        RewriteRule .* - [e=HTTP_AUTHORIZATION:%1]
    </Directory>

    #LogLevel debug
    ErrorLog "/var/log/apache2/api.cheesecake.io-error.log"
    CustomLog "/var/log/apache2/api.cheesecake.io-access.log" common
</VirtualHost>
```

Note: you may have to install some modules like rewrite
