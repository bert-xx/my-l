(function () {
    'use strict';

    var filterConfig = [
        { title: 'Японию (Аниме)', key: 'filter_japan',       codes: ['JP'],       langs: ['ja'] },
        { title: 'Россию',         key: 'filter_russia',       codes: ['RU', 'SU'], langs: ['ru'] },
        { title: 'Индию',          key: 'filter_india',        codes: ['IN'],       langs: ['hi', 'kn', 'ml', 'ta', 'te', 'pa', 'bn', 'mr', 'gu', 'as', 'or', 'ur', 'sd', 'sa', 'ne', 'ks', 'kok', 'doi', 'mai', 'mni'] },
        { title: 'Индонезию',      key: 'filter_indonesia',    codes: ['ID'],       langs: ['id'] },
        { title: 'Филиппины',      key: 'filter_philippines',  codes: ['PH'],       langs: ['tl', 'fil'] },
        { title: 'Болгарию',       key: 'filter_bulgaria',     codes: ['BG'],       langs: ['bg'] },
        { title: 'Испанию',        key: 'filter_spain',        codes: ['ES'],       langs: ['es'] },
        { title: 'Польшу',         key: 'filter_poland',       codes: ['PL'],       langs: ['pl'] },
        { title: 'Китай',          key: 'filter_china',        codes: ['CN'],       langs: ['zh'] }
    ];

    var dramaAdultCountries = ['KR', 'IT', 'FR', 'DE', 'HU', 'CZ', 'BR'];

    // Имена источников, которые нужно патчить (и .list, и main/category/search/full)
    var SOURCE_NAMES = ['tmdb', 'cub'];

    // Флаг на самом объекте источника — чтобы не патчить дважды при повторных вызовах patchApi()
    var PATCHED_FLAG = '__filterContentPatched';

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

    function isDramaCountryAdult(data) {
        if (Lampa.Storage.field('filter_drama_countries') === false) {
            var countries = data.origin_country || [];
            var genres    = getGenreIds(data);
            var isTarget  = countries.some(function(c) { return dramaAdultCountries.indexOf(c) !== -1; });
            var hasDramaOrRomance = genres.indexOf(18) !== -1 || genres.indexOf(10749) !== -1;
            if (isTarget && hasDramaOrRomance) return true;
        }
        return false;
    }

    // Единая функция проверки — используется всеми патчами
    function shouldHide(data) {
        if (!data) return false;

        var originCountries = data.origin_country || [];
        var prodCountries   = (data.production_countries || []).map(function(c) { return c.iso_3166_1; });
        var countries       = originCountries.concat(prodCountries);
        var lang            = data.original_language || '';

        for (var i = 0; i < filterConfig.length; i++) {
            var item = filterConfig[i];

            if (Lampa.Storage.field(item.key) === false) {
                var matchCountry = countries.some(function(c) { return item.codes.indexOf(c) !== -1; });
                var matchLang    = item.langs.indexOf(lang) !== -1;

                if (matchCountry || matchLang) return true;
            }
        }

        if (Lampa.Storage.field('filter_erotic') === false && isEroticContent(data)) return true;

        if (isDramaCountryAdult(data)) return true;

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

    // .list — используется прямыми списковыми запросами (в т.ч. discover / persons и т.д.)
    function patchList(sourceObj) {
        if (!sourceObj || typeof sourceObj.list !== 'function') return;

        var originalList = sourceObj.list;

        sourceObj.list = function(params, oncomplite, onerror) {
            originalList.call(sourceObj, params, function(json) {
                oncomplite(filterResults(json));
            }, onerror);
        };
    }

    // main/category — главная страница и категории.
    // oncomplite вызывается с МАССИВОМ рядов [{title, results:[...]}, ...],
    // а не с одним объектом {results:[...]} — поэтому фильтруем каждый элемент массива.
    function patchMainCategory(sourceObj) {
        if (!sourceObj) return;

        if (typeof sourceObj.main === 'function') {
            var originalMain = sourceObj.main;
            sourceObj.main = function(params, oncomplite, onerror) {
                return originalMain.call(sourceObj, params, function(data) {
                    if (Array.isArray(data)) {
                        data.forEach(function(row) { filterResults(row); });
                    } else if (data) {
                        filterResults(data);
                    }
                    oncomplite(data);
                }, onerror);
            };
        }

        if (typeof sourceObj.category === 'function') {
            var originalCategory = sourceObj.category;
            sourceObj.category = function(params, oncomplite, onerror) {
                return originalCategory.call(sourceObj, params, function(data) {
                    if (Array.isArray(data)) {
                        data.forEach(function(row) { filterResults(row); });
                    } else if (data) {
                        filterResults(data);
                    }
                    oncomplite(data);
                }, onerror);
            };
        }
    }

    // search — отдаёт массив блоков результатов
    function patchSearch(sourceObj) {
        if (!sourceObj || typeof sourceObj.search !== 'function') return;

        var originalSearch = sourceObj.search;
        sourceObj.search = function(params, oncomplite) {
            return originalSearch.call(sourceObj, params, function(items) {
                if (Array.isArray(items)) {
                    items.forEach(function(block) { filterResults(block); });
                }
                oncomplite(items);
            });
        };
    }

    // full — карточка фильма, содержит вложенные recomend/simular
    function patchFull(sourceObj) {
        if (!sourceObj || typeof sourceObj.full !== 'function') return;

        var originalFull = sourceObj.full;
        sourceObj.full = function(params, oncomplite, onerror) {
            return originalFull.call(sourceObj, params, function(result) {
                if (result) {
                    if (result.recomend) filterResults(result.recomend);
                    if (result.simular) filterResults(result.simular);
                }
                oncomplite(result);
            }, onerror);
        };
    }

    // Патчим один источник целиком (list + main + category + search + full)
    function patchSource(sourceObj) {
        if (!sourceObj || sourceObj[PATCHED_FLAG]) return;

        patchList(sourceObj);
        patchMainCategory(sourceObj);
        patchSearch(sourceObj);
        patchFull(sourceObj);

        sourceObj[PATCHED_FLAG] = true;
    }

    // Пытаемся пропатчить все нужные источники прямо сейчас.
    // Возвращает true, если ВСЕ источники из SOURCE_NAMES уже существуют и пропатчены.
    function tryPatchApi() {
        if (!Lampa.Api || !Lampa.Api.sources) return false;

        var allReady = true;

        SOURCE_NAMES.forEach(function(name) {
            var src = Lampa.Api.sources[name];
            if (src) {
                patchSource(src);
            } else {
                allReady = false;
            }
        });

        return allReady;
    }

    // Источники (особенно cub) могут создаваться лениво — не сразу при старте.
    // Поэтому пробуем сразу, а если не всё готово — опрашиваем ещё некоторое время.
    function patchApi() {
        if (tryPatchApi()) return;

        var attempts = 0;
        var maxAttempts = 40; // ~20 секунд при интервале 500мс

        var interval = setInterval(function() {
            attempts++;
            if (tryPatchApi() || attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 500);
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
            param: { name: 'filter_drama_countries', type: 'trigger', default: true },
            field: {
                name: 'Драма/Мелодрама по странам',
                description: 'Скрывать Драму и Мелодраму из Кореи, Италии, Франции, Германии, Венгрии, Чехии, Бразилии'
            }
        });
    }

    function start() {
        initSettings();
        patchApi();

        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                $("[data-action=anime], [data-action=indian]").remove();
                // На случай если источники создались уже после 'ready'
                patchApi();
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
