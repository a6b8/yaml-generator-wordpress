# Visual YAML Generator for creating a Wordpress Stack with Docker
This **Visual Generator** create a `docker-compose.yml`, `rancher-compose.yml` and a `secrets.txt` file. It helps to setup fast and secure a Wordpress Stack.

## The Generator uses 3 diffrent Docker Images:
- [x] Wordpress | [github.com](https://github.com/docker-library/wordpress) | [hub.docker.com](https://hub.docker.com/_/wordpress/)
- [x] MySql | [github.com](https://github.com/docker-library/mysql) | [hub.docker.com](https://hub.docker.com/_/mysql/)
- [x] PhpMyAdmin | [github.com](https://github.com/phpmyadmin/docker) | [hub.docker.com](https://hub.docker.com/r/phpmyadmin/phpmyadmin/)

## Features
- [x] Create Passwords, Names & internal Links
- [x] Ready for Production, with the secret feature
- [x] Use no "latest" tags by default for better version control.

## Libraries
- [x] P5js - Html Dom
- [x] JSZip - Creates a Zip Files
- [x] FileServer.js - Helps download the yaml files

## Quickstart
Visual Generator : [a6b8/yaml-generator-loadbalancer](http://htmlpreview.github.io/?https://github.com/a6b8/yaml-generator-wordpress/blob/master/index.html)

## For Production use:
```
git clone https://github.com/a6b8/yaml-generator-wordpress.git && cd yaml-generator-wordpress
http-server
```
