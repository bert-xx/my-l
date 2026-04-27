(function () {
    'use strict';

    // 1. КОНФИГУРАЦИЯ ФИЛЬТРА СТРАН
    var filterConfig = [
        { title: 'Японию (Аниме)', key: 'filter_japan', codes: ['JP'], langs: ['ja'] },
        { title: 'Россию',         key: 'filter_russia', codes: ['RU', 'SU'], langs: ['ru'] },
        { title: 'Индию',          key: 'filter_india',  codes: ['IN'], langs: ['hi', 'kn', 'ml', 'ta', 'te'] },
        { title: 'Индонезию',      key: 'filter_indonesia', codes: ['ID'], langs: ['id'] },
        { title: 'Польшу',         key: 'filter_poland', codes: ['PL'], langs: ['pl'] },
        { title: 'Китай',          key: 'filter_china',  codes: ['CN'], langs: ['zh'] }
    ];

    // 2. СПИСКИ ЖАНРОВ (TMDB ID)
    var movieGenres = [
        { title: 'Боевики', id: 28 },
        { title: 'Комедии', id: 35 },
        { title: 'Ужасы', id: 27 },
        { title: 'Триллеры', id: 53 },
        { title: 'Фантастика', id: 878 },
        { title: 'Мелодрамы', id: 10749 },
        { title: 'Криминал', id: 80 },
        { title: 'Фэнтези', id: 14 },
        { title: 'Приключения', id: 12 }
    ];

    var tvGenres = [
        { title: 'Боевики и Приключения', id: 10759 },
        { title: 'Комедии', id: 35 },
        { title: 'Драмы', id: 18 },
        { title: 'Криминал', id: 80 },
        { title: 'Фантастика и Фэнтези', id: 10765 },
        { title: 'Детективы', id: 9648 },
        { title: 'Мультсериалы', id: 16 }
    ];

    // Функция фильтрации (применяется ко всем карточкам в приложении)
    function applyFilter() {
        $('.card').each(function () {
            var card = $(this);
            var data = card[0].card_data;
            if (!data) return;

            var countries = data.origin_country || [];
            var lang = data.original_language || '';
            var hide = false;

            for (var i = 0; i < filterConfig.length; i++) {
                var item = filterConfig[i];
                if (Lampa.Storage.field(item.key) === false) {
                    var matchCountry = countries.some(function(c) { return item.codes.indexOf(c) !== -1; });
                    var matchLang = item.langs.indexOf(lang) !== -1;
                    if (matchCountry || matchLang) {
                        hide = true;
                        break;
                    }
                }
            }
            if (hide) card.remove();
        });
    }

    // Показ окна выбора жанров
    function showGenres(title, genres, type) {
        var items = genres.map(function(g) {
            return { title: g.title, id: g.id };
        });

        Lampa.Select.show({
            title: title,
            items: items,
            onSelect: function (a) {
                Lampa.Activity.push({
                    url: type,
                    title: a.title,
                    component: 'category',
                    id: a.id,
                    source: 'tmdb'
                });
            },
            onBack: function () {
                Lampa.Controller.toggle('menu');
            }
        });
    }

    // Регистрация настроек
    function initSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'filter_content',
            name: 'Фильтр контента',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
        });

        filterConfig.forEach(function (item) {
            Lampa.SettingsApi.addParam({
                component: 'filter_content',
                param: { name: item.key, type: 'trigger', default: true },
                field: { name: 'Показывать ' + item.title }
            });
        });
    }

    // Инициализация меню
    function initMenu() {
        var menu_movie = $('<li class="menu__item selector" data-action="movie_genres">' +
            '<div class="menu__ico"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg></div>' +
            '<div class="menu__text">Кино: Жанры</div>' +
        '</li>');

        var menu_tv = $('<li class="menu__item selector" data-action="tv_genres">' +
            '<div class="menu__ico"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg></div>' +
            '<div class="menu__text">Сериалы: Жанры</div>' +
        '</li>');

        menu_movie.on('hover:enter', function () {
            showGenres('Фильмы по жанрам', movieGenres, 'movie');
        });

        menu_tv.on('hover:enter', function () {
            showGenres('Сериалы по жанрам', tvGenres, 'tv');
        });

        // Добавляем в список меню после стандартных пунктов
        $('.menu .menu__list').eq(0).append(menu_movie);
        $('.menu .menu__list').eq(0).append(menu_tv);
    }

    function start() {
        initSettings();
        initMenu();
        
        // Запускаем фильтр
        setInterval(applyFilter, 1500);

        // Удаляем лишние кнопки Аниме/Индийские, если они есть
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                $("[data-action=anime], [data-action=indian]").remove();
            }
        });
    }

    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') start();
        });
    }
})();
