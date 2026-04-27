(function () {
    'use strict';

    // Список жанров для Фильмов (ID взяты из базы TMDB)
    var movieGenres = [
        { title: 'Боевики', id: 28 },
        { title: 'Комедии', id: 35 },
        { title: 'Ужасы', id: 27 },
        { title: 'Триллеры', id: 53 },
        { title: 'Фантастика', id: 878 },
        { title: 'Мелодрамы', id: 10749 },
        { title: 'Криминал', id: 80 },
        { title: 'Документальные', id: 99 },
        { title: 'Фэнтези', id: 14 }
    ];

    // Список жанров для Сериалов
    var tvGenres = [
        { title: 'Боевики и Приключения', id: 10759 },
        { title: 'Комедии', id: 35 },
        { title: 'Драмы', id: 18 },
        { title: 'Криминал', id: 80 },
        { title: 'Фантастика и Фэнтези', id: 10765 },
        { title: 'Детективы', id: 9648 },
        { title: 'Мультсериалы', id: 16 }
    ];

    function showGenres(title, genres, type) {
        var items = genres.map(function(g) {
            return {
                title: g.title,
                id: g.id
            };
        });

        Lampa.Select.show({
            title: title,
            items: items,
            onSelect: function (a) {
                // Открываем встроенный в Лампу каталог по выбранному жанру
                Lampa.Activity.push({
                    url: type, // movie или tv
                    title: a.title,
                    component: 'category',
                    id: a.id, // ID жанра
                    source: 'tmdb' // или другой источник по умолчанию
                });
            },
            onBack: function () {
                Lampa.Controller.toggle('menu');
            }
        });
    }

    function start() {
        // Добавляем пункт меню для Фильмов
        var menu_movie = {
            id: 'movie_cats',
            title: 'Кино: Жанры',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>',
            onSelect: function () {
                showGenres('Фильмы по жанрам', movieGenres, 'movie');
            }
        };

        // Добавляем пункт меню для Сериалов
        var menu_tv = {
            id: 'tv_cats',
            title: 'Сериалы: Жанры',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>',
            onSelect: function () {
                showGenres('Сериалы по жанрам', tvGenres, 'tv');
            }
        };

        // Вставляем пункты в меню Лампы
        Lampa.Menu.add(menu_movie);
        Lampa.Menu.add(menu_tv);
    }

    // Запуск
    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') start();
        });
    }
})();
