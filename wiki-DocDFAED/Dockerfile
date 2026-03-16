FROM php:7.4-apache

# Enable rewrite module
RUN a2enmod rewrite

# Install system dependencies (+ jq pour patcher le composer.json de MW)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libicu-dev \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    jq \
    git \
    curl \
    unzip \
    && docker-php-ext-configure gd --with-jpeg \
    && docker-php-ext-install mysqli gd intl opcache mbstring xml zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer 2
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Download and extract MediaWiki 1.31.16
RUN curl -fSL "https://releases.wikimedia.org/mediawiki/1.31/mediawiki-1.31.16.tar.gz" -o mediawiki.tar.gz \
    && tar -xzf mediawiki.tar.gz -C /var/www/html --strip-components=1 \
    && rm mediawiki.tar.gz

WORKDIR /var/www/html

# Patch le composer.json de MW 1.31 pour Composer 2 :
#   - supprime wikimedia/composer-merge-plugin (incompatible avec Composer 2 API)
#   - supprime la contrainte composer-plugin-api ^1.1
#   - désactive le blocage des security advisories (packages anciens)
#   - injecte Semantic MediaWiki ~3.2
RUN jq 'del(.require["wikimedia/composer-merge-plugin"]) | del(.require["composer-plugin-api"]) | del(."require-dev") | .config["audit"] = {"block-insecure": false} | .require["mediawiki/semantic-media-wiki"] = "~3.2"' composer.json > /tmp/composer.json && mv /tmp/composer.json composer.json

RUN COMPOSER_ALLOW_SUPERUSER=1 composer update --no-dev --no-plugins --no-scripts --no-audit

# Patch du script SMW : corrige le chemin de Maintenance.php (bug connu quand SMW est dans vendor/)
RUN sed -i "s|require_once __DIR__ . '/../../../maintenance/Maintenance.php';|require_once '/var/www/html/maintenance/Maintenance.php';|" \
    /var/www/html/vendor/mediawiki/semantic-media-wiki/maintenance/populateHashField.php

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# PHP settings for MediaWiki
RUN printf "file_uploads = On\nupload_max_filesize = 100M\npost_max_size = 100M\nmemory_limit = 256M\n" \
    > /usr/local/etc/php/conf.d/mediawiki.ini
