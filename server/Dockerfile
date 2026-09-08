FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        nginx \
        bash \
        curl \
        unzip \
        oniguruma-dev \
        libzip-dev \
        freetype-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        postgresql-dev \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        bcmath \
        zip \
        mbstring \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install \
        --no-dev \
        --optimize-autoloader \
        --no-interaction \
        --prefer-dist \
    && chown -R www-data:www-data /var/www/html \
    && chmod +x docker/start.sh

COPY docker/nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80

CMD ["bash", "docker/start.sh"]
