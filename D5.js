(function () {
    'use strict';

    var filterConfig = [
        { title: 'Японию (Аниме)', key: 'filter_japan',       codes: ['JP'],       langs: ['ja'] },
        { title: 'Россию',         key: 'filter_russia',       codes: ['RU', 'SU'], langs: ['ru'] },
        { title: 'Индию',          key: 'filter_india',        codes: ['IN'],       langs: ['hi', 'kn', 'ml', 'ta', 'te'] },
        { title: 'Индонезию',      key: 'filter_indonesia',    codes: ['ID'],       langs: ['id'] },
        { title: 'Филиппины',      key: 'filter_philippines',  codes: ['PH'],       langs: ['tl', 'fil'] },
        { title: 'Болгарию',       key: 'filter_bulgaria',     codes: ['BG'],       langs: ['bg'] },
        { title: 'Испанию',        key: 'filter_spain',        codes: ['ES'],       langs: ['es'] },
        { title: 'Польшу',         key: 'filter_poland',       codes: ['PL'],       langs: ['pl'] },
        { title: 'Китай',          key: 'filter_china',        codes: ['CN'],       langs: ['zh'] }
    ];

    // Вспомогательная функция для получения ID жанров
    function getGenreIds(data) {
        if (Array.isArray(data.genre_ids)) return data.genre_ids;
        if (Array.isArray(data.genres)) return data.genres.map(function(g) { return g.id; });
        return [];
    }

    // Логика проверки: нужно ли скрыть контент
    function shouldHide(data) {
        if (!data) return false;

        var countries = data.origin_country || [];
        var lang      = data.original_language || '';
        var genres    = getGenreIds(data);

        // 1. Проверка по странам из конфига
        for (var i = 0; i < filterConfig.length; i++) {
            var item = filterConfig[i];
            if (Lampa.Storage.field(item.key) === false) {
                var matchCountry = countries.some(function(c) { return item.codes.indexOf(c) !== -1; });
                var matchLang    = item.langs.indexOf(lang) !== -1;
                if (matchCountry || matchLang) return true;
            }
        }

        // 2. Проверка Adult + Драма/Мелодрама
        if (Lampa.Storage.field('filter_erotic') === false) {
            var isAdult = data.adult === true;
            var hasDramaOrRomance = genres.indexOf(18) !== -1 || genres.indexOf(10749) !== -1;
            if (isAdult && hasDramaOrRomance) return true;
        }

        // 3. Проверка Южная Корея + Драма/Мелодрама
        if (Lampa.Storage.field('filter_korea_adult') === false) {
            var isKorea = countries.indexOf('KR') !== -1 || lang === 'ko';
            var hasDramaOrRomanceKR = genres.indexOf(18) !== -1 || genres.indexOf(10749) !== -1;
            if (isKorea && hasDramaOrRomanceKR) return true;
        }

        return false;
    }

    // Перехват шаблонизатора (Основная магия)
    function interceptRender() {
        var originalPrepare = Lampa.Tmpl.prepare;
        Lampa.Tmpl.prepare = function (name, data, params) {
            var card = originalPrepare.apply(this, arguments);
            
            // Если это карточка и она должна быть скрыта
            if (name === 'card' && shouldHide(data)) {
                card.addClass('filter-hidden').css('display', 'none');
            }
            
            return card;
        };
    }

    // Скрытие элементов меню через CSS
    function injectStyles() {
        var style = `
            <style id="filter-content-styles">
                .navigation-item[data-action="anime"], 
                .navigation-item[data-action="indian"] { 
                    display: none !important; 
                }
            </style>
        `;
        if (!$('#filter-content-styles').length) $('head').append(style);
    }

    function initSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'filter_content',
            name: 'Фильтр контента',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
        });

        filterConfig.forEach(function(item) {
            Lampa.SettingsApi.addParam({
                component: 'filter_content',
                param: { name: item.key, type: 'trigger', default: true },
                field: {
                    name: 'Показывать ' + item.title,
                    description: 'Скрывать контент, если страна ' + item.codes.join(', ')
                }
            });
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_erotic', type: 'trigger', default: true },
            field: {
                name: 'Adult + Драма / Adult + Мелодрама',
                description: 'Скрывать фильмы с меткой adult + жанр Драма или Мелодрама'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_korea_adult', type: 'trigger', default: true },
            field: {
                name: 'Южная Корея + Драма / + Мелодрама',
                description: 'Скрывать дорамы с возрастным цензом в жанрах Драма/Мелодрама'
            }
        });
    }

    function start() {
        injectStyles();
        initSettings();
        interceptRender();
    }

    // Ожидание готовности приложения
    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') start();
        });
    }
})();
