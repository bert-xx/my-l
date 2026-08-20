(function () {
    'use strict';

    // Основной объект плагина
    var InterFaceMod = {
        name: 'interface_mod',
        version: '2.2.0',
        debug: false,
        settings: {
            enabled: true,
            buttons_mode: 'default',
            show_movie_type: true,
            theme: 'default',
            colored_ratings: true,
            seasons_info_mode: 'aired',
            show_episodes_on_main: false,
            label_position: 'top-right',
            show_buttons: true,
            colored_elements: true,
            lumio_skin_enabled: false // НОВАЯ НАСТРОЙКА
        }
    };

    // ═══════════════════════════════════════════════════════════
    // НОВАЯ ФУНКЦИЯ: Lumio Skin
    // ═══════════════════════════════════════════════════════════
    
    function applyLumioSkin() {
        // Удаляем предыдущие стили Lumio
        $('#lumio-skin-css').remove();
        
        if (!InterFaceMod.settings.lumio_skin_enabled) return;

        // Создаем CSS стили Lumio
        var lumioCSS = `
/* ═══ LUMIO SKIN для Lampac ═══ */

/* Базовая карточка */
.online-prestige {
    position: relative !important;
    overflow: hidden !important;
    border-radius: .55em !important;
    background: linear-gradient(110deg, rgba(15,23,42,.78), rgba(7,11,22,.52)) !important;
    border: 1px solid rgba(255,255,255,.12) !important;
    box-shadow: 0 .45em 1.2em rgba(0,0,0,.28) !important;
    transition: background .22s ease, transform .22s ease, box-shadow .22s ease !important;
}

/* Эффект свечения */
.online-prestige__glow {
    position: absolute;
    inset: -45% -10% auto auto;
    width: 12em;
    height: 12em;
    background: radial-gradient(circle, rgba(18,214,223,.22), rgba(155,92,255,0) 68%);
    pointer-events: none;
    z-index: 0;
}

/* Тело карточки */
.online-prestige__body {
    position: relative !important;
    z-index: 1 !important;
    padding: 1.05em 1.15em !important;
}

/* Постер */
.online-prestige__img {
    position: relative !important;
    overflow: hidden !important;
    border-radius: .45em !important;
    transition: transform .3s ease;
}

.online-prestige__img::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(0,0,0,0), rgba(5,8,16,.35));
    pointer-events: none;
}

/* Заголовок */
.online-prestige__title {
    font-size: 1.45em !important;
    font-weight: 600 !important;
    letter-spacing: -.01em;
    text-shadow: 0 1px 4px rgba(0,0,0,.35) !important;
}

/* Инфо-строка */
.online-prestige__info {
    color: rgba(255,255,255,.72) !important;
    font-size: 1.02em !important;
}

/* Время */
.online-prestige__time {
    font-size: .82em !important;
    padding: .32em .6em !important;
    border-radius: .45em !important;
    background: rgba(18,214,223,.18) !important;
    color: #bdfaff !important;
    font-weight: 600 !important;
    letter-spacing: .02em;
    white-space: nowrap !important;
}

/* Качество */
.online-prestige__quality {
    font-size: .8em !important;
    padding: .3em .58em !important;
    border-radius: .45em !important;
    font-weight: 700 !important;
    letter-spacing: .04em;
    background: rgba(34,197,94,.22) !important;
    color: #9dffc0 !important;
    text-shadow: 0 0 .6em rgba(34,197,94,.4) !important;
}

/* Цветные тона качества */
.online-prestige__quality.lumio-quality--4k,
.online-prestige__quality.lumio-quality--2k {
    background: rgba(155,92,255,.25) !important;
    color: #e4d4ff !important;
    text-shadow: 0 0 .6em rgba(155,92,255,.4) !important;
}

.online-prestige__quality.lumio-quality--1080 {
    background: rgba(34,197,94,.22) !important;
    color: #9dffc0 !important;
}

.online-prestige__quality.lumio-quality--720 {
    background: rgba(18,214,223,.2) !important;
    color: #bdfaff !important;
}

.online-prestige__quality.lumio-quality--sd {
    background: rgba(234,179,8,.22) !important;
    color: #ffe58a !important;
}

/* Цветные тона озвучек */
.online-prestige__img.lumio-voice-tone-0 {
    box-shadow: inset 0 0 0 9999px rgba(18,214,223,.18), inset 0 0 3em rgba(155,92,255,.22) !important;
}
.online-prestige__img.lumio-voice-tone-1 {
    box-shadow: inset 0 0 0 9999px rgba(34,197,94,.18), inset 0 0 3em rgba(18,214,223,.2) !important;
}
.online-prestige__img.lumio-voice-tone-2 {
    box-shadow: inset 0 0 0 9999px rgba(244,114,182,.18), inset 0 0 3em rgba(155,92,255,.22) !important;
}
.online-prestige__img.lumio-voice-tone-3 {
    box-shadow: inset 0 0 0 9999px rgba(250,204,21,.18), inset 0 0 3em rgba(34,197,94,.2) !important;
}
.online-prestige__img.lumio-voice-tone-4 {
    box-shadow: inset 0 0 0 9999px rgba(96,165,250,.18), inset 0 0 3em rgba(18,214,223,.2) !important;
}
.online-prestige__img.lumio-voice-tone-5 {
    box-shadow: inset 0 0 0 9999px rgba(248,113,113,.18), inset 0 0 3em rgba(250,204,21,.2) !important;
}

/* Цветные тона эпизодов */
.online-prestige__img.lumio-episode-tone-1 {
    box-shadow: inset 0 0 0 9999px rgba(34,197,94,.22), inset 0 0 3em rgba(18,214,223,.18) !important;
}
.online-prestige__img.lumio-episode-tone-2 {
    box-shadow: inset 0 0 0 9999px rgba(155,92,255,.24), inset 0 0 3em rgba(244,114,182,.18) !important;
}
.online-prestige__img.lumio-episode-tone-3 {
    box-shadow: inset 0 0 0 9999px rgba(250,204,21,.22), inset 0 0 3em rgba(249,115,22,.18) !important;
}
.online-prestige__img.lumio-episode-tone-4 {
    box-shadow: inset 0 0 0 9999px rgba(18,214,223,.22), inset 0 0 3em rgba(79,70,229,.18) !important;
}

/* Номер эпизода */
.online-prestige__episode-number {
    font-size: 2.4em !important;
    font-weight: 700 !important;
    letter-spacing: -.02em;
    text-shadow: 0 2px 12px rgba(0,0,0,.6), 0 0 2em rgba(18,214,223,.35) !important;
    color: #fff !important;
}

/* Бейдж просмотра */
.online-prestige__viewed {
    background: rgba(34,197,94,.85) !important;
    box-shadow: 0 2px 8px rgba(34,197,94,.4) !important;
}

.online-prestige__viewed svg {
    color: #fff !important;
    fill: #fff !important;
}

/* Прогресс-бар */
.online-prestige .time-line {
    height: .28em !important;
    border-radius: 2em !important;
    background: rgba(255,255,255,.13) !important;
    overflow: hidden !important;
}

.online-prestige .time-line > div {
    background: linear-gradient(90deg, #12d6df, #9b5cff) !important;
    box-shadow: 0 0 .6em rgba(18,214,223,.5) !important;
    border-radius: 2em !important;
}

/* Состояние фокуса */
.online-prestige.focus {
    background: linear-gradient(110deg, rgba(18,214,223,.2), rgba(155,92,255,.22)), rgba(7,11,22,.82) !important;
    box-shadow: 0 .6em 1.8em rgba(18,214,223,.25), 0 0 0 .18em rgba(255,255,255,.3) !important;
    transform: translateY(-2px) !important;
}

.online-prestige.focus::after {
    content: "" !important;
    position: absolute;
    top: -.28em;
    left: -.28em;
    right: -.28em;
    bottom: -.28em;
    border-radius: .72em;
    border: solid .2em #fff;
    z-index: -1;
    pointer-events: none;
}

/* Мобильная адаптация */
@media screen and (max-width: 480px) {
    .online-prestige__body {
        padding: .85em 1em !important;
    }
    .online-prestige__title {
        font-size: 1.25em !important;
    }
}
`;

        // Добавляем стили
        var styleEl = document.createElement('style');
        styleEl.id = 'lumio-skin-css';
        styleEl.textContent = lumioCSS;
        document.head.appendChild(styleEl);

        // Функция обработки карточки
        function processLumioCard(card) {
            if (!card || card.nodeType !== 1) return;
            if (card.getAttribute('data-lumio-processed')) return;
            card.setAttribute('data-lumio-processed', '1');

            // Добавляем glow
            if (!card.querySelector('.online-prestige__glow')) {
                var glow = document.createElement('div');
                glow.className = 'online-prestige__glow';
                card.insertBefore(glow, card.firstChild);
            }

            var img = card.querySelector('.online-prestige__img');
            var info = card.querySelector('.online-prestige__info');
            var quality = card.querySelector('.online-prestige__quality');
            var epNum = card.querySelector('.online-prestige__episode-number');

            // Хэш-функция для стабильных цветов
            function stableIndex(value, max) {
                var str = String(value || '');
                var hash = 0;
                for (var i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0;
                }
                return Math.abs(hash) % Math.max(1, max);
            }

            // Цветной тон озвучки
            if (img && info) {
                var infoText = info.textContent || '';
                var isEpisode = !!epNum;

                // Удаляем предыдущие тона
                for (var i = 0; i < 6; i++) img.classList.remove('lumio-voice-tone-' + i);
                for (var j = 1; j <= 4; j++) img.classList.remove('lumio-episode-tone-' + j);

                if (isEpisode) {
                    var seasonMatch = infoText.match(/(\d+)\s*(?:сезон|season)/i);
                    var season = seasonMatch ? parseInt(seasonMatch[1], 10) : 1;
                    img.classList.add('lumio-episode-tone-' + ((season % 4) + 1));
                } else {
                    var key = infoText.slice(0, 40);
                    img.classList.add('lumio-voice-tone-' + stableIndex(key, 6));
                }
            }

            // Цветной бейдж качества
            if (quality) {
                var qText = quality.textContent || '';
                quality.classList.remove(
                    'lumio-quality--4k', 'lumio-quality--2k', 'lumio-quality--1080',
                    'lumio-quality--720', 'lumio-quality--sd'
                );

                if (/2160|4k|uhd/i.test(qText)) {
                    quality.classList.add('lumio-quality--4k');
                } else if (/1440|2k/i.test(qText)) {
                    quality.classList.add('lumio-quality--2k');
                } else if (/1080|fhd/i.test(qText)) {
                    quality.classList.add('lumio-quality--1080');
                } else if (/720|hd/i.test(qText)) {
                    quality.classList.add('lumio-quality--720');
                } else if (/480|360|sd/i.test(qText)) {
                    quality.classList.add('lumio-quality--sd');
                }
            }
        }

        // Обработка всех существующих карточек
        function processAllLumioCards() {
            var cards = document.querySelectorAll('.online-prestige:not([data-lumio-processed])');
            for (var i = 0; i < cards.length; i++) {
                processLumioCard(cards[i]);
            }
        }

        // Запускаем обработку
        processAllLumioCards();

        // MutationObserver для новых карточек
        if (window.lumioObserver) {
            window.lumioObserver.disconnect();
        }

        window.lumioObserver = new MutationObserver(function(mutations) {
            var needProcess = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    needProcess = true;
                }
            });
            if (needProcess) {
                setTimeout(processAllLumioCards, 100);
            }
        });

        window.lumioObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[Lumio Skin] Активирован');
    }

    function removeLumioSkin() {
        // Удаляем CSS
        $('#lumio-skin-css').remove();

        // Отключаем observer
        if (window.lumioObserver) {
            window.lumioObserver.disconnect();
            window.lumioObserver = null;
        }

        // Удаляем атрибуты обработки
        $('.online-prestige').removeAttr('data-lumio-processed');

        console.log('[Lumio Skin] Деактивирован');
    }

    // ═══════════════════════════════════════════════════════════
    // Остальные функции плагина (без изменений)
    // ═══════════════════════════════════════════════════════════

    // [Вставьте сюда все существующие функции: addSeasonInfo, showAllButtons, 
    // changeMovieTypeLabels, applyTheme, updateVoteColors и т.д.]

    // Функция инициализации плагина
    function startPlugin() {
        // Регистрируем плагин
        Lampa.SettingsApi.addComponent({
            component: 'season_info',
            name: 'Интерфейс мод',
            icon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7V5Z" fill="currentColor"/><path d="M4 11C4 10.4477 4.44772 10 5 10H19C19.5523 10 20 10.4477 20 11V13C20 13.5523 19.5523 14 19 14H5C4.44772 14 4 13.5523 4 13V11Z" fill="currentColor"/><path d="M4 17C4 16.4477 4.44772 16 5 16H19C19.5523 16 20 16.4477 20 17V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V17Z" fill="currentColor"/></svg>'
        });

        // НОВАЯ НАСТРОЙКА: Lumio Skin
        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'lumio_skin_enabled',
                type: 'trigger',
                default: false
            },
            field: {
                name: 'Стиль Lumio',
                description: 'Применить современный стиль Lumio к карточкам онлайн-источников'
            },
            onChange: function (value) {
                InterFaceMod.settings.lumio_skin_enabled = value;
                Lampa.Settings.update();
                
                if (value) {
                    applyLumioSkin();
                    Lampa.Noty.show('Стиль Lumio включён. Откройте карточку фильма для применения.');
                } else {
                    removeLumioSkin();
                    Lampa.Noty.show('Стиль Lumio выключен.');
                }
            }
        });

        // [Все остальные настройки...]
        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: { 
                type: 'button',
                component: 'about' 
            },
            field: {
                name: 'О плагине',
                description: 'Информация и поддержка'
            },
            onChange: showAbout
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'seasons_info_mode',
                type: 'select',
                values: {
                    'none': 'Выключить',
                    'aired': 'Актуальная информация',
                    'total': 'Полное количество'
                },
                default: 'aired'
            },
            field: {
                name: 'Информация о сериях',
                description: 'Выберите как отображать информацию о сериях и сезонах'
            },
            onChange: function (value) {
                InterFaceMod.settings.seasons_info_mode = value;
                InterFaceMod.settings.enabled = (value !== 'none');
                Lampa.Settings.update();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'label_position',
                type: 'select',
                values: {
                    'top-right': 'Верхний правый угол',
                    'top-left': 'Верхний левый угол',
                    'bottom-right': 'Нижний правый угол',
                    'bottom-left': 'Нижний левый угол'
                },
                default: 'top-right'
            },
            field: {
                name: 'Расположение лейбла о сериях',
                description: 'Выберите позицию лейбла на постере'
            },
            onChange: function (value) {
                InterFaceMod.settings.label_position = value;
                Lampa.Settings.update();
                Lampa.Noty.show('Для применения изменений откройте карточку сериала заново');
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'show_buttons',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Показывать все кнопки',
                description: 'Отображать все кнопки действий в карточке'
            },
            onChange: function (value) {
                InterFaceMod.settings.show_buttons = value;
                Lampa.Settings.update();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'season_info_show_movie_type',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Изменить лейблы типа',
                description: 'Изменить "TV" на "Сериал" и добавить лейбл "Фильм"'
            },
            onChange: function (value) {
                InterFaceMod.settings.show_movie_type = value;
                Lampa.Settings.update();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'theme_select',
                type: 'select',
                values: {
                    default: 'Нет',
                    bywolf_mod: 'Bywolf_mod',
                    dark_night: 'Dark Night bywolf',
                    blue_cosmos: 'Blue Cosmos',
                    neon: 'Neon',
                    sunset: 'Dark MOD',
                    emerald: 'Emerald V1',
                    aurora: 'Aurora'
                },
                default: 'default'
            },
            field: {
                name: 'Тема интерфейса',
                description: 'Выберите тему оформления интерфейса'
            },
            onChange: function(value) {
                InterFaceMod.settings.theme = value;
                Lampa.Settings.update();
                applyTheme(value);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'colored_ratings',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Цветные рейтинги',
                description: 'Изменять цвет рейтинга в зависимости от оценки'
            },
            onChange: function (value) {
                InterFaceMod.settings.colored_ratings = value;
                Lampa.Settings.update();
                
                if (value) {
                    setupVoteColorsObserver();
                    setupVoteColorsForDetailPage();
                } else {
                    $(".card__vote, .full-start__rate, .full-start-new__rate, .info__rate, .card__imdb-rate, .card__kinopoisk-rate").css("color", "");
                }
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'season_info',
            param: {
                name: 'colored_elements',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Цветные элементы',
                description: 'Отображать статусы сериалов и возрастные ограничения цветными'
            },
            onChange: function (value) {
                InterFaceMod.settings.colored_elements = value;
                Lampa.Settings.update();
                
                if (value) {
                    colorizeSeriesStatus();
                    colorizeAgeRating();
                }
            }
        });

        // Применяем настройки
        InterFaceMod.settings.show_buttons = Lampa.Storage.get('show_buttons', true);
        InterFaceMod.settings.show_movie_type = Lampa.Storage.get('season_info_show_movie_type', true);
        InterFaceMod.settings.theme = Lampa.Storage.get('theme_select', 'default');
        InterFaceMod.settings.colored_ratings = Lampa.Storage.get('colored_ratings', true);
        InterFaceMod.settings.colored_elements = Lampa.Storage.get('colored_elements', true);
        InterFaceMod.settings.seasons_info_mode = Lampa.Storage.get('seasons_info_mode', 'aired');
        InterFaceMod.settings.show_episodes_on_main = Lampa.Storage.get('show_episodes_on_main', false);
        InterFaceMod.settings.label_position = Lampa.Storage.get('label_position', 'top-right');
        InterFaceMod.settings.lumio_skin_enabled = Lampa.Storage.get('lumio_skin_enabled', false); // НОВАЯ НАСТРОЙКА
        
        InterFaceMod.settings.enabled = (InterFaceMod.settings.seasons_info_mode !== 'none');
        
        applyTheme(InterFaceMod.settings.theme);

        // НОВОЕ: Применяем Lumio Skin если включен
        if (InterFaceMod.settings.lumio_skin_enabled) {
            applyLumioSkin();
        }

        // Запускаем функции плагина
        if (InterFaceMod.settings.enabled) {
            addSeasonInfo();
        }
        
        showAllButtons();
        changeMovieTypeLabels();
        
        if (InterFaceMod.settings.colored_ratings) {
            setupVoteColorsObserver();
            setupVoteColorsForDetailPage();
        }
        
        if (InterFaceMod.settings.colored_elements) {
            colorizeSeriesStatus();
            colorizeAgeRating();
        }

        Lampa.Settings.listener.follow('open', function (e) {
            setTimeout(function() {
                var interfaceMod = $('.settings-folder[data-component="season_info"]');
                var interfaceStandard = $('.settings-folder[data-component="interface"]');
                
                if (interfaceMod.length && interfaceStandard.length) {
                    interfaceMod.insertAfter(interfaceStandard);
                }
            }, 100);
        });
    }

    // [Вставьте сюда функцию showAbout и все остальные функции...]

    // Ждем загрузки приложения
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }

    Lampa.Manifest.plugins = {
        name: 'Интерфейс мод',
        version: '2.2.0',
        description: 'Улучшенный интерфейс для приложения Lampa'
    };

    window.season_info = InterFaceMod;
})();
