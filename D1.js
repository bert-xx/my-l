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

    function isEroticContent(data) {
        if (Lampa.Storage.field('filter_erotic') === false) {
            var genres = getGenreIds(data);
            var keywords = getKeywords(data).map(function(k) { return (k.name || k).toLowerCase(); });
            var overview = (data.overview || '').toLowerCase();
            var title = (data.title || data.name || '').toLowerCase();
            var countries = data.origin_country || [];

            var eroticCountries = Lampa.Storage.field('filter_erotic_countries') || 'DE,FR,KR,IT,JP,ES';
            var suspiciousCountries = eroticCountries.split(',').map(function(s) { return s.trim(); });

            // 1. Явный флаг adult от TMDB
            if (data.adult === true) return true;

            // 2. Расширенный список ключевых слов
            var eroticKeywords = [
                'erotic', 'erotica', 'softcore', 'sex film', 'pornographic',
                'pink film', 'pinku eiga', 'sex comedy', 'erotic thriller',
                'erotic drama', 'nudity', 'sexuality', 'bdsm', 'hentai',
                'ecchi', 'nunsploitation', 'women in prison', 'soft porn'
            ];

            for (var i = 0; i < keywords.length; i++) {
                if (eroticKeywords.some(function(bad) { return keywords[i].indexOf(bad)!== -1; })) return true;
            }

            // 3. Проверка по описанию и названию
            if (eroticKeywords.some(function(bad) { return overview.indexOf(bad)!== -1; })) return true;
            if (eroticKeywords.some(function(bad) { return title.indexOf(bad)!== -1; })) return true;

            // 4. Универсальное правило для подозрительных стран
            var hasDramaOrRomance = genres.indexOf(18)!== -1 || genres.indexOf(10749)!== -1;
            var isSuspiciousCountry = countries.some(function(c) { return suspiciousCountries.indexOf(c)!== -1; });

            // Драма/Мелодрама из подозрительной страны + мало голосов = часто эротика
            if (hasDramaOrRomance && isSuspiciousCountry) {
                if (data.vote_count < 30 && data.popularity < 15) return true;
            }

            // 5. Пустые жанры у подозрительных стран
            if (genres.length === 0 && isSuspiciousCountry && data.vote_count < 50) {
                return true;
            }
        }
        return false;
    }

    function isKoreaAdult(data) {
        if (Lampa.Storage.field('filter_korea_adult') === false) {
            var countries = data.origin_country || [];
            var lang = data.original_language || '';
            var genres = getGenreIds(data);
            var isKorea = countries.indexOf('KR')!== -1 || lang === 'ko';
            var hasDramaOrRomance = genres.indexOf(18)!== -1 || genres.indexOf(10749)!== -1;
            if (isKorea && hasDramaOrRomance) return true;
        }
        return false;
    }

    var filterTimeout;
    function applyFilter() {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(function() {
            $('.card').each(function () {
                var card = $(this);
                var data = card[0].card_data;
                if (!data) return;

                var countries = data.origin_country || [];
                var lang = data.original_language || '';
                var hide = false;

                // 1. Фильтр по странам
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

                // 2. Универсальный фильтр эротики
                if (!hide && isEroticContent(data)) hide = true;

                // 3. Старый фильтр по Корее
                if (!hide && isKoreaAdult(data)) hide = true;

                // Скрываем вместо удаления, чтобы не ломать пагинацию
                if (hide) {
                    card.hide().addClass('content-filter-hidden');
                } else {
                    card.show().removeClass('content-filter-hidden');
                }
            });
        }, 150);
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
                name: 'Умный фильтр эротики',
                description: 'Скрывать эротику по adult-флагу, ключевым словам и эвристике для DE, FR, KR, IT, JP'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_erotic_countries', type: 'input', default: 'DE,FR,KR,IT,JP,ES' },
            field: {
                name: 'Страны для жесткого фильтра',
                description: 'Через запятую. Для этих стран Драма + низкий рейтинг = скрыть'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_korea_adult', type: 'trigger', default: true },
            field: {
                name: 'Южная Корея + Драма / + Мелодрама',
                description: 'Старый фильтр. Можно отключить, т.к. умный фильтр уже покрывает'
            }
        });
    }

    function start() {
        initSettings();

        // Запускаем фильтр при отрисовке контента, а не по интервалу
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
