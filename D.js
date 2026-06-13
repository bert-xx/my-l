(function () {
    'use strict';

    // =============================================================
    // СПИСОК СТРАН ДЛЯ ФИЛЬТРАЦИИ
    // Чтобы добавить страну: добавь строчку { title: 'Имя', key: 'ключ', codes: ['КОД'], langs: ['яз'] }
    // Коды стран (ISO 3166-1 alpha-2): RU, JP, IN, ID, PL, CN и т.д.
    // пример { title: 'Францию', key: 'filter_france', codes: ['FR'], langs: ['fr'] },
    // =============================================================
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
    // =============================================================

    // =============================================================
    // ФИЛЬТР ЭРОТИКИ (TMDB)
    // Убираем только если adult:true И есть жанр Romance(10749) или Drama(18)
    // Только Драма без adult — не трогаем
    // =============================================================
    function isEroticContent(data) {
        var genres = data.genre_ids || (data.genres ? data.genres.map(function (g) { return g.id; }) : []);
        var isAdult = data.adult == true;
        var hasErotic = genres.indexOf(10749) !== -1;
        var hasDrama  = genres.indexOf(18) !== -1;

        if (isAdult && (hasErotic || hasDrama)) return true;

        // keywords fallback (если есть в объекте карточки)
        var keywords = data.keywords || [];
        var badWords = ['erotic', 'softcore', 'sex film', 'pornographic'];
        for (var i = 0; i < keywords.length; i++) {
            var kw = (keywords[i].name || keywords[i]).toLowerCase();
            for (var j = 0; j < badWords.length; j++) {
                if (kw.indexOf(badWords[j]) !== -1) return true;
            }
        }

        return false;
    }
    // =============================================================

    function applyFilter() {
        if (!$('.card').length) return;

        $('.card').each(function () {
            var card = $(this);
            var data = card[0].card_data;
            if (!data) return;

            var countries = data.origin_country || [];
            var lang = data.original_language || '';
            var hide = false;

            // Фильтр по странам
            for (var i = 0; i < filterConfig.length; i++) {
                var item = filterConfig[i];

                if (Lampa.Storage.field(item.key) === false) {
                    var matchCountry = countries.some(function (c) { return item.codes.indexOf(c) !== -1; });
                    var matchLang = item.langs.indexOf(lang) !== -1;

                    if (matchCountry || matchLang) {
                        hide = true;
                        break;
                    }
                }
            }

            // Фильтр эротики (если включён в настройках)
            if (!hide && Lampa.Storage.field('filter_erotic') === false) {
                if (isEroticContent(data)) hide = true;
            }

            if (hide) card.remove();
        });
    }

    function initSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'filter_content',
            name: 'Фильтр контента',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
        });

        // Пункты по странам
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

        // Пункт фильтра эротики
        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_erotic', type: 'trigger', default: true },
            field: {
                name: 'Показывать эротику',
                description: 'Скрывать фильмы с меткой adult + жанр Драма/Романтика'
            }
        });
    }

    function start() {
        initSettings();
        setInterval(applyFilter, 1500);

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
