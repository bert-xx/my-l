(function () {
    'use strict';

    // 1. КОНФИГУРАЦИЯ ФИЛЬТРА
    var filterConfig = [
        { title: 'Японию (Аниме)', key: 'filter_japan', codes: ['JP'], langs: ['ja'] },
        { title: 'Россию',         key: 'filter_russia', codes: ['RU', 'SU'], langs: ['ru'] },
        { title: 'Индию',          key: 'filter_india',  codes: ['IN'], langs: ['hi', 'kn', 'ml', 'ta', 'te'] },
        { title: 'Индонезию',      key: 'filter_indonesia', codes: ['ID'], langs: ['id'] },
        { title: 'Польшу',         key: 'filter_poland', codes: ['PL'], langs: ['pl'] },
        { title: 'Китай',          key: 'filter_china',  codes: ['CN'], langs: ['zh'] }
    ];

    var movieGenres = [
        { title: 'Боевики', id: 28 }, { title: 'Комедии', id: 35 }, { title: 'Ужасы', id: 27 },
        { title: 'Триллеры', id: 53 }, { title: 'Фантастика', id: 878 }, { title: 'Криминал', id: 80 }
    ];

    var tvGenres = [
        { title: 'Боевики/Приключения', id: 10759 }, { title: 'Комедии', id: 35 },
        { title: 'Драмы', id: 18 }, { title: 'Мультсериалы', id: 16 }
    ];

    // 2. ФУНКЦИЯ ФИЛЬТРАЦИИ (Без использования ES6 функций)
    function applyFilter() {
        var cards = $('.card');
        if (!cards.length) return;

        cards.each(function () {
            var card = $(this);
            var data = card[0].card_data;
            if (!data) return;

            var countries = data.origin_country || [];
            var lang = data.original_language || '';
            var hide = false;

            for (var i = 0; i < filterConfig.length; i++) {
                var conf = filterConfig[i];
                // Если в настройках выключено (false)
                if (Lampa.Storage.get(conf.key) === 'false' || Lampa.Storage.field(conf.key) === false) {
                    // Проверка страны
                    for (var j = 0; j < countries.length; j++) {
                        if (conf.codes.indexOf(countries[j]) !== -1) { hide = true; break; }
                    }
                    // Проверка языка
                    if (!hide && conf.langs.indexOf(lang) !== -1) hide = true;
                }
                if (hide) break;
            }

            if (hide) card.remove();
        });
    }

    // 3. ПОКАЗ ВЫБОРА ЖАНРОВ
    function showGenres(title, genres, type) {
        var items = genres.map(function(g) { return { title: g.title, id: g.id }; });
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
            onBack: function () { Lampa.Controller.toggle('menu'); }
        });
    }

    // 4. ДОБАВЛЕНИЕ В МЕНЮ (С проверкой отрисовки)
    function injectMenu() {
        if ($('.menu__list').length > 0) {
            if ($('.menu__item[data-action="movie_genres"]').length > 0) return;

            var mMovie = $('<li class="menu__item selector" data-action="movie_genres"><div class="menu__ico"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line></svg></div><div class="menu__text">Кино: Жанры</div></li>');
            var mTV = $('<li class="menu__item selector" data-action="tv_genres"><div class="menu__ico"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg></div><div class="menu__text">Сериалы: Жанры</div></li>');

            mMovie.on('hover:enter', function() { showGenres('Фильмы по жанрам', movieGenres, 'movie'); });
            mTV.on('hover:enter', function() { showGenres('Сериалы по жанрам', tvGenres, 'tv'); });

            $('.menu .menu__list').eq(0).append(mMovie);
            $('.menu .menu__list').eq(0).append(mTV);
        } else {
            setTimeout(injectMenu, 500);
        }
    }

    // 5. НАСТРОЙКИ
    function initSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'filter_content',
            name: 'Фильтр контента',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" fill="none" stroke="white" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
        });

        filterConfig.forEach(function (item) {
            Lampa.SettingsApi.addParam({
                component: 'filter_content',
                param: { name: item.key, type: 'trigger', default: true },
                field: { name: 'Показывать ' + item.title }
            });
        });
    }

    function startPlugin() {
        initSettings();
        injectMenu();
        setInterval(applyFilter, 1500);
    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
