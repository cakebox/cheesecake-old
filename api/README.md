
## Installation for devs

Simply run this following command in the api directory

```shell
composer install
```

Edit the /etc/hosts an add this line

```
127.0.0.1 api.colabsubs.perso.dev
```

Create a new file something like /etc/apache2/site-avalaible/api.colabsubs.perso.dev and adapt the configuration (paths...)

```
<VirtualHost api.colabsubs.perso.dev:80>
    ServerAdmin mail@mail.fr
    ServerName api.colabsubs.perso.dev

    SetEnv APPLICATION_ENV development
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Headers X-Requested-With,Content-Type,Authorization
    #Header set Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS

    DocumentRoot "/home/myuser/mywebsites/colabsubs/api/public/"
    <Directory "/home/myuser/mywebsites/colabsubs/api/public/">
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
    ErrorLog "/var/log/apache2/perso.dev-error.log"
    CustomLog "/var/log/apache2/perso.dev-access.log" common
</VirtualHost>
```

Note: you may have to install some modules like rewrite
