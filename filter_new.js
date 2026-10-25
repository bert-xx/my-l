(function () {
    'use strict';
    if (window.filter_content_loaded) return;
    window.filter_content_loaded = true;

    var DEBUG = false; // true — писать в консоль, что и каким уровнем скрыто

    // ── Языковые фильтры (как было) ─────────────────────────────────────
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

    // ── «Эротические» страны: правь список здесь ────────────────────────
    var ADULT_COUNTRIES = ['JP', 'KR', 'IT', 'FR', 'DE', 'HU', 'CZ', 'BR', 'TH', 'SE', 'DK', 'NL'];

    // Язык → страна: запасной вариант, если в данных нет стран
    var LANG_TO_COUNTRY = {
        ja: 'JP', ko: 'KR', it: 'IT', fr: 'FR', de: 'DE', hu: 'HU',
        cs: 'CZ', pt: 'BR', th: 'TH', sv: 'SE', da: 'DK', nl: 'NL'
    };

    var BAD_WORDS = ['erotic', 'softcore', 'sex film', 'pornographic'];

    var ADULT_KEY = 'filter_erotic';
    var DRAMA_KEY = 'filter_drama_countries';
    var FLAG      = '__fc_patched';

    window.filter_content_stats = { hidden: 0 };

    function log() {
        if (DEBUG && window.console) console.log.apply(console, ['[filter_content]'].concat([].slice.call(arguments)));
    }

    function field(key) {
        try { return Lampa.Storage.field(key); } catch (e) { return true; }
    }

    // ── Правила ─────────────────────────────────────────────────────────
    function genreIds(item) {
        if (Array.isArray(item.genre_ids)) return item.genre_ids;
        if (Array.isArray(item.genres)) return item.genres.map(function (g) { return g && g.id; });
        return [];
    }

    function getKeywords(item) {
        if (Array.isArray(item.keywords)) return item.keywords;
        if (item.keywords && Array.isArray(item.keywords.keywords)) return item.keywords.keywords;
        return [];
    }

    function actualCountries(item) {
        var origin = Array.isArray(item.origin_country) ? item.origin_country : [];
        var prod   = Array.isArray(item.production_countries)
            ? item.production_countries.map(function (c) { return c && c.iso_3166_1; })
            : [];
        return origin.concat(prod).filter(Boolean);
    }

    function inAdultCountries(item, countries) {
        if (countries.length) {
            return countries.some(function (c) { return ADULT_COUNTRIES.indexOf(c) !== -1; });
        }
        var c = LANG_TO_COUNTRY[item.original_language || ''];
        return !!c && ADULT_COUNTRIES.indexOf(c) !== -1;
    }

    function hasBadKeyword(item) {
        var kws = getKeywords(item);
        for (var i = 0; i < kws.length; i++) {
            var kw = String((kws[i] && kws[i].name) || kws[i] || '').toLowerCase();
            for (var j = 0; j < BAD_WORDS.length; j++) {
                if (kw.indexOf(BAD_WORDS[j]) !== -1) return true;
            }
        }
        return false;
    }

    function shouldHide(item) {
        var lang      = item.original_language || '';
        var countries = actualCountries(item);

        for (var i = 0; i < filterConfig.length; i++) {
            var f = filterConfig[i];
            if (field(f.key) === false) {
                var matchCountry = countries.some(function (c) { return f.codes.indexOf(c) !== -1; });
                if (matchCountry || f.langs.indexOf(lang) !== -1) return true;
            }
        }

        var genres  = genreIds(item);
        var isAnim  = genres.indexOf(16) !== -1;
        var hasDM   = genres.indexOf(18) !== -1 || genres.indexOf(10749) !== -1;
        var isAdult = item.adult == true;
        var inList  = inAdultCountries(item, countries);

        // Драма/Мелодрама из «эротических» стран; анимация — только с adult
        if (field(DRAMA_KEY) === false && inList && hasDM && (!isAnim || isAdult)) return true;

        // Adult + Драма/Мелодрама и ключевые слова; анимация — только из «эротических» стран
        if (field(ADULT_KEY) === false) {
            var allowed = !isAnim || inList;
            if (allowed && isAdult && hasDM) return true;
            if (allowed && hasBadKeyword(item)) return true;
        }

        return false;
    }

    function isMedia(it) {
        return it && typeof it === 'object' && !Array.isArray(it) && it.id !== undefined &&
               (it.original_language !== undefined || it.genre_ids || it.origin_country || it.production_countries);
    }

    // Фильтрует массивы карточек в любом месте данных (на месте)
    function filterTree(node, depth, tag) {
        if (!node || typeof node !== 'object' || depth > 4) return false;
        var changed = false;

        if (Array.isArray(node)) {
            for (var i = node.length - 1; i >= 0; i--) {
                var it = node[i];
                if (isMedia(it) && shouldHide(it)) {
                    log('скрыто (' + tag + '):', it.title || it.name || it.original_title || it.id);
                    window.filter_content_stats.hidden++;
                    node.splice(i, 1);
                    changed = true;
                } else if (it && typeof it === 'object') {
                    if (filterTree(it, depth + 1, tag)) changed = true;
                }
            }
            return changed;
        }

        Object.keys(node).forEach(function (k) {
            var v = node[k];
            if (v && typeof v === 'object' && filterTree(v, depth + 1, tag)) changed = true;
        });
        return changed;
    }

    // ── Уровни 1–2: источники Lampa.Api.sources ─────────────────────────
    function wrapCb(cb, tag) {
        if (cb[FLAG + '_cb']) return cb;
        var w = function (data) {
            try { processData(data, tag); } catch (e) {}
            return cb.apply(this, arguments);
        };
        w[FLAG + '_cb'] = true;
        return w;
    }

    // main/category у tmdb отдают массив функций-загрузчиков рядов — оборачиваем каждую
    function wrapLoader(fn, tag) {
        if (fn[FLAG + '_ld']) return fn;
        var w = function () {
            var args = [].slice.call(arguments);
            if (typeof args[0] === 'function') args[0] = wrapCb(args[0], tag + ':ряд');
            return fn.apply(this, args);
        };
        w[FLAG + '_ld'] = true;
        return w;
    }

    function processData(data, tag) {
        if (!data || typeof data !== 'object') return;
        if (Array.isArray(data)) {
            for (var i = 0; i < data.length; i++) {
                if (typeof data[i] === 'function') data[i] = wrapLoader(data[i], tag);
            }
        }
        filterTree(data, 0, tag);
    }

    function patchMethod(src, name, srcName) {
        if (typeof src[name] !== 'function') return;
        var orig = src[name];
        src[name] = function () {
            var args = [].slice.call(arguments);
            for (var i = 1; i < args.length; i++) {
                if (typeof args[i] === 'function') args[i] = wrapCb(args[i], srcName + '.' + name);
            }
            return orig.apply(this, args);
        };
    }

    var METHODS = ['list', 'main', 'category', 'search', 'full'];

    function tryPatchApi() {
        if (!window.Lampa || !Lampa.Api || !Lampa.Api.sources) return false;
        var sources = Lampa.Api.sources;
        var hasCub = false, hasTmdb = false;

        Object.keys(sources).forEach(function (name) {
            var src = sources[name];
            if (!src || typeof src !== 'object') return;
            if (name === 'cub') hasCub = true;
            if (name === 'tmdb') hasTmdb = true;
            if (src[FLAG]) return;
            METHODS.forEach(function (m) { patchMethod(src, m, name); });
            try { src[FLAG] = true; } catch (e) {}
            log('источник пропатчен:', name);
        });

        return hasCub && hasTmdb;
    }

    function patchApi() {
        if (tryPatchApi()) return;
        var attempts = 0;
        var timer = setInterval(function () {
            attempts++;
            if (tryPatchApi() || attempts >= 60) clearInterval(timer);
        }, 500);
    }

    // ── Уровень 3: сеть (любые адреса) ──────────────────────────────────
    var MARK = '"original_language"';

    function processXhr(xhr) {
        try {
            var rt = xhr.responseType;

            if (rt === '' || rt === 'text') {
                var txt = xhr.responseText;
                if (!txt || txt.length > 6000000 || txt.indexOf(MARK) === -1) return;
                var c = txt.charAt(0);
                if (c !== '{' && c !== '[') return;
                var obj = JSON.parse(txt);
                if (!filterTree(obj, 0, 'xhr')) return;
                var out = JSON.stringify(obj);
                Object.defineProperty(xhr, 'responseText', { configurable: true, value: out });
                Object.defineProperty(xhr, 'response',     { configurable: true, value: out });
            } else if (rt === 'json') {
                filterTree(xhr.response, 0, 'xhr');
            }
        } catch (e) {}
    }

    var xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        try {
            var xhr = this;
            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState !== 4 || xhr.__fc_done) return;
                xhr.__fc_done = true;
                processXhr(xhr);
            });
        } catch (e) {}
        return xhrOpen.apply(this, arguments);
    };

    var nativeFetch = window.fetch;
    if (nativeFetch) {
        window.fetch = function () {
            var p = nativeFetch.apply(this, arguments);
            return p.then(function (res) {
                try {
                    if (!res || !res.ok) return res;
                    var ct = res.headers.get('content-type') || '';
                    if (ct.indexOf('json') === -1) return res;

                    return res.clone().text().then(function (t) {
                        try {
                            if (!t || t.length > 6000000 || t.indexOf(MARK) === -1) return res;
                            var o = JSON.parse(t);
                            if (filterTree(o, 0, 'fetch')) {
                                return new Response(JSON.stringify(o), {
                                    status: res.status,
                                    statusText: res.statusText,
                                    headers: res.headers
                                });
                            }
                        } catch (e) {}
                        return res;
                    });
                } catch (e) {
                    return res;
                }
            });
        };
    }

    // ── Настройки (ключи и названия как были) ───────────────────────────
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
                field: {
                    name: 'Показывать ' + item.title,
                    description: 'Скрывать контент, если страна ' + item.codes.join(', ')
                }
            });
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: ADULT_KEY, type: 'trigger', default: true },
            field: {
                name: 'Adult + Драма / Adult + Мелодрама',
                description: 'Скрывать adult + Драма / Мелодрама. Анимация скрывается только из стран: ' + ADULT_COUNTRIES.join(', ')
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: DRAMA_KEY, type: 'trigger', default: true },
            field: {
                name: 'Драма/Мелодрама по странам',
                description: 'Скрывать Драму и Мелодраму из стран: ' + ADULT_COUNTRIES.join(', ') + '. Анимация — только с adult'
            }
        });
    }

    function start() {
        if (window.filter_content_inited) return;
        window.filter_content_inited = true;

        initSettings();
        patchApi();

        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                $('[data-action=anime], [data-action=indian]').remove();
                patchApi();
            }
        });
        $('[data-action=anime], [data-action=indian]').remove();
    }

    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') start();
        });
    }
})();
