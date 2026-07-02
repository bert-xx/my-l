(function () {
    'use strict';

    var filterConfig = [
        { title: 'Японию (Аниме)', key: 'filter_japan',       codes: ['JP'],       langs: ['ja'] },
        { title: 'Россию',         key: 'filter_russia',       codes: ['RU', 'SU'], langs: ['ru'] },
        { title: 'Индию',          key: 'filter_india',        codes: ['IN'],       langs: ['hi', 'kn', 'ml', 'ta', 'te', 'pa', 'bn', 'mr', 'gu'] },
        { title: 'Индонезию',      key: 'filter_indonesia',    codes: ['ID'],       langs: ['id'] },
        { title: 'Филиппины',      key: 'filter_philippines',  codes: ['PH'],       langs: ['tl', 'fil'] },
        { title: 'Болгарию',       key: 'filter_bulgaria',     codes: ['BG'],       langs: ['bg'] },
        { title: 'Испанию',        key: 'filter_spain',        codes: ['ES'],       langs: ['es'] },
        { title: 'Польшу',         key: 'filter_poland',       codes: ['PL'],       langs: ['pl'] },
        { title: 'Китай',          key: 'filter_china',        codes: ['CN'],       langs: ['zh'] }
    ];

    function getGenreIds(data) {
        if (data.genre_ids) return data.genre_ids;
        if (data.genres) return data.genres.map(function(g) { return g.id; });
        return [];
    }

    function getKeywords(data) {
        if (Array.isArray(data.keywords)) return data.keywords;
        if (data.keywords && Array.isArray(data.keywords.keywords)) return data.keywords.keywords;
        return [];
    }

    function isEroticContent(data) {
        var genres    = getGenreIds(data);
        var isAdult   = data.adult == true;
        var hasErotic = genres.indexOf(10749) !== -1;
        var hasDrama  = genres.indexOf(18) !== -1;

        if (isAdult && (hasErotic || hasDrama)) return true;

        var keywords = getKeywords(data);
        var badWords = ['erotic', 'softcore', 'sex film', 'pornographic'];
        for (var i = 0; i < keywords.length; i++) {
            var kw = (keywords[i].name || keywords[i]).toLowerCase();
            for (var j = 0; j < badWords.length; j++) {
                if (kw.indexOf(badWords[j]) !== -1) return true;
            }
        }

        return false;
    }

    function isKoreaAdult(data) {
        if (Lampa.Storage.field('filter_korea_adult') === false) {
            var countries = data.origin_country || [];
            var lang      = data.original_language || '';
            var genres    = getGenreIds(data);
            var isKorea   = countries.indexOf('KR') !== -1 || lang === 'ko';
            var hasDramaOrRomance = genres.indexOf(18) !== -1 || genres.indexOf(10749) !== -1;
            if (isKorea && hasDramaOrRomance) return true;
        }
        return false;
    }

    // Единая функция проверки — используется API-патчем
    function shouldHide(data) {
        if (!data) return false;

        var countries = data.origin_country || [];
        var lang      = data.original_language || '';

        for (var i = 0; i < filterConfig.length; i++) {
            var item = filterConfig[i];

            if (Lampa.Storage.field(item.key) === false) {
                var matchCountry = countries.some(function(c) { return item.codes.indexOf(c) !== -1; });
                var matchLang    = item.langs.indexOf(lang) !== -1;

                if (matchCountry || matchLang) return true;
            }
        }

        if (Lampa.Storage.field('filter_erotic') === false && isEroticContent(data)) return true;

        if (isKoreaAdult(data)) return true;

        return false;
    }

    function filterResults(json) {
        if (json && Array.isArray(json.results)) {
            json.results = json.results.filter(function(item) {
                return !shouldHide(item);
            });
        }
        return json;
    }

    function patchApiSource(sourceObj) {
        if (!sourceObj || typeof sourceObj.list !== 'function') return;

        var originalList = sourceObj.list;

        sourceObj.list = function(params, oncomplite, onerror) {
            originalList.call(sourceObj, params, function(json) {
                oncomplite(filterResults(json));
            }, onerror);
        };
    }

    function patchApi() {
        if (Lampa.Api && Lampa.Api.sources) {
            patchApiSource(Lampa.Api.sources.tmdb);
            patchApiSource(Lampa.Api.sources.cub);
        }
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
                description: 'Скрывать фильмы с меткой adult + жанр Драма, adult + Мелодрама, adult + Драма/Мелодрама'
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_korea_adult', type: 'trigger', default: true },
            field: {
                name: 'Южная Корея + Драма / + Мелодрама',
                description: 'Скрывать: Южная Корея + Драма, Южная Корея + Мелодрама, Южная Корея + Драма/Мелодрама'
            }
        });
    }

    function start() {
        initSettings();
        patchApi();

        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                $("[data-action=anime], [data-action=indian]").remove();
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
