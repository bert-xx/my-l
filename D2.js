(function () {
    'use strict';

    var filterConfig = [
        { title: 'Японию (Аниме)', key: 'filter_japan', codes: ['JP'], langs: ['ja'] },
        { title: 'Россию', key: 'filter_russia', codes: ['RU', 'SU'], langs: ['ru'] },
        { title: 'Индию', key: 'filter_india', codes: ['IN'], langs: ['hi', 'kn', 'ml', 'ta', 'te'] },
        { title: 'Индонезию', key: 'filter_indonesia', codes: ['ID'], langs: ['id'] },
        { title: 'Филиппины', key: 'filter_philippines', codes: ['PH'], langs: ['tl', 'fil'] },
        { title: 'Болгарию', key: 'filter_bulgaria', codes: ['BG'], langs: ['bg'] },
        { title: 'Испанию', key: 'filter_spain', codes: ['ES'], langs: ['es'] },
        { title: 'Польшу', key: 'filter_poland', codes: ['PL'], langs: ['pl'] },
        { title: 'Китай', key: 'filter_china', codes: ['CN'], langs: ['zh'] }
    ];

    function getGenreIds(data) {
        if (data.genre_ids) return data.genre_ids;
        if (data.genres) return data.genres.map(function(g) { return g.id; });
        return [];
    }

    function getKeywords(data) {
        if (Array.isArray(data.keywords)) return data.keywords;
        if (data.keywords && Array.isArray(data.keywords.keywords)) return data.keywords.keywords;
        if (data.keywords && Array.isArray(data.keywords.results)) return data.keywords.results;
        return [];
    }

    // Белый список для Adult Swim и подобного. По названию или студии.
    function isAdultSwimContent(data) {
        var title = (data.title || data.name || '').toLowerCase();
        var networks = data.networks || [];
        var production = data.production_companies || [];

        var adultSwimShows = [
            'south park', 'южный парк', 'rick and morty', 'рик и морти',
            'mr. pickles', 'мистер пиклз', 'robot chicken', 'aqua teen',
            'metalocalypse', 'the venture bros', 'smiling friends',
            'твое милое личико', 'mr. pickles', 'ballmastrz', 'genndy tartakovsky'
        ];

        // Проверка по названию
        if (adultSwimShows.some(function(show) { return title.indexOf(show)!== -1; })) return true;

        // Проверка по студии Adult Swim
        var isAdultSwimNetwork = networks.some(function(n) { return (n.name || '').toLowerCase().indexOf('adult swim')!== -1; });
        var isWilliamsStreet = production.some(function(p) { return (p.name || '').toLowerCase().indexOf('williams street')!== -1; });

        return isAdultSwimNetwork || isWilliamsStreet;
    }

    function isEroticContent(data) {
        if (Lampa.Storage.field('filter_erotic') === false) return false;

        // Правило 0: Если это Adult Swim - сразу пропускаем. Флаг adult у них тоже есть.
        if (isAdultSwimContent(data)) return false;

        var genres = getGenreIds(data);
        var keywords = getKeywords(data).map(function(k) { return (k.name || k).toLowerCase(); });
        var overview = (data.overview || '').toLowerCase();
        var title = (data.title || data.name || '').toLowerCase();
        var countries = data.origin_country || [];
        var original_language = data.original_language || '';

        var hasDrama = genres.indexOf(18)!== -1;
        var hasRomance = genres.indexOf(10749)!== -1;
        var hasAnimation = genres.indexOf(16)!== -1;
        var hasDramaOrRomance = hasDrama || hasRomance;
        var isKorea = countries.indexOf('KR')!== -1 || original_language === 'ko';

        // Правило 1: Связка ADULT + Драма/Мелодрама. Флаг adult тут важен.
        // Это ловит твой корейский фильм со скрина.
        if (data.adult === true && hasDramaOrRomance) return true;

        // Правило 2: Корея + Драма/Мелодрама = эротика. Флаг adult не важен.
        if (isKorea && hasDramaOrRomance) return true;

        // Правило 3: Эротические ключевые слова. Для фильмов и для мультиков.
        var eroticKeywords = [
            'erotic', 'erotica', 'softcore', 'soft porn', 'sex film', 'pornographic',
            'pink film', 'pinku eiga', 'sex comedy', 'erotic thriller', 'erotic drama',
            'nudity', 'sexuality', 'bdsm', 'hentai', 'ecchi', 'nunsploitation',
            'women in prison', 'affair', 'seduce', 'seduction', 'infidelity',
            'brother-in-law', 'sister-in-law', 'mistress', 'lover', 'lust', 'sexual'
        ];

        for (var i = 0; i < keywords.length; i++) {
            if (eroticKeywords.some(function(bad) { return keywords[i].indexOf(bad)!== -1; })) return true;
        }
        if (eroticKeywords.some(function(bad) { return overview.indexOf(bad)!== -1; })) return true;
        if (eroticKeywords.some(function(bad) { return title.indexOf(bad)!== -1; })) return true;

        // Правило 4: Хентай. Это Animation + adult + страна JP. Без драмы.
        if (data.adult === true && hasAnimation && countries.indexOf('JP')!== -1) {
             if (keywords.indexOf('hentai')!== -1 || keywords.indexOf('ecchi')!== -1) return true;
        }

        // Правило 5: Для остальных подозрительных стран. Драма + мало голосов.
        var eroticCountries = Lampa.Storage.field('filter_erotic_countries') || 'DE,FR,IT,JP,ES,TH';
        var suspiciousCountries = eroticCountries.split(',').map(function(s) { return s.trim(); });
        var isSuspiciousCountry = countries.some(function(c) { return suspiciousCountries.indexOf(c)!== -1; });

        if (hasDramaOrRomance && isSuspiciousCountry &&!hasAnimation) {
            if (data.vote_count < 100 && data.popularity < 25) return true;
        }

        return false;
    }

    var filterTimeout;
    function applyFilter() {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(function() {
            if (!$('.card').length) return;

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
                        var matchCountry = countries.some(function(c) { return item.codes.indexOf(c)!== -1; });
                        var matchLang = item.langs.indexOf(lang)!== -1;
                        if (matchCountry || matchLang) {
                            hide = true;
                            break;
                        }
                    }
                }

                if (!hide && isEroticContent(data)) hide = true;

                if (hide) {
                    card.hide().addClass('content-filter-hidden');
                } else {
                    card.show().removeClass('content-filter-hidden');
                }
            });
        }, 200);
    }

    function initSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'filter_content',
            name: 'Фильтр контента',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
        });

        filterConfig.forEach(function(item) {
            Lampa.SettingsApi.addParam({
                component: 'filter_content',
                param: { name: item.key, type: 'trigger', default: true },
                field: {
                    name: 'Показывать ' + item.title,
                    description: 'Если выключено, скрывает контент из ' + item.codes.join(', ')
                }
            });
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_erotic', type: 'trigger', default: true },
            field: {
                name: 'Фильтр эротики',
                description: 'Скрывает эротику в фильмах и мультиках. Adult Swim не трогает'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_erotic_countries', type: 'input', default: 'DE,FR,IT,JP,ES,TH' },
            field: {
                name: 'Страны для жесткого фильтра',
                description: 'Для этих стран Драма + низкая популярность = скрыть'
            }
        });
    }

    function start() {
        initSettings();

        Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') applyFilter();
        });

        Lampa.Listener.follow('content', function(e) {
            if (e.type == 'complite') applyFilter();
        });

        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                $("[data-action=anime], [data-action=indian]").remove();
                applyFilter();
            }
        });
    }

    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') start();
        });
    }
})();
