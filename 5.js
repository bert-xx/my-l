(function () {
    'use strict';

    function initGlobalTheme() {
        if (window.plugin_lampa_global_theme_ready) return;
        window.plugin_lampa_global_theme_ready = true;

        var styleId = 'lampa-global-cyber-theme';
        if (document.getElementById(styleId)) return;

        var css = `
            :root {
                --lp-cyan: #12D6DF;
                --lp-violet: #9B5CFF;
                --lp-green: #22c55e;
                --lp-yellow: #eab308;
                --lp-bg-card: #0d1220;
                --lp-bg-card-alt: #111728;
                --lp-bg-focus: linear-gradient(120deg, rgba(20, 30, 60, 0.92), rgba(120, 60, 180, 0.55));
                --lp-text-title: #ffffff;
                --lp-text-sub: rgba(255, 255, 255, 0.62);
                --lp-radius-lg: 12px;
                --lp-radius-md: 8px;
                --lp-radius-sm: 6px;
            }

            /* ==========================================================================
               1. КАРТОЧКИ КАТАЛОГА (ГЛАВНЫЙ ЭКРАН / ПОИСК / ЗАКЛАДКИ)
               ========================================================================== */
            .card {
                border-radius: var(--lp-radius-lg) !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }

            .card__view {
                border-radius: var(--lp-radius-lg) !important;
                overflow: hidden !important;
                border: 2px solid transparent !important;
                box-sizing: border-box !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
            }

            .card.focus .card__view {
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 22px rgba(18, 214, 223, 0.35) !important;
            }

            .card__vote,
            .card__quality,
            .card__type {
                border-radius: var(--lp-radius-sm) !important;
                font-weight: 700 !important;
                letter-spacing: 0.03em !important;
                padding: 0.2em 0.5em !important;
                text-transform: uppercase !important;
            }

            .card__quality {
                background: rgba(155, 92, 255, 0.35) !important;
                color: #eadcff !important;
            }

            .card__vote {
                background: rgba(18, 214, 223, 0.25) !important;
                color: #bdfaff !important;
            }

            /* ==========================================================================
               2. ОНЛАЙН СПИСКИ (БАЛАНСЕРЫ, СЕЗОНЫ, СЕРИИ, ОЗВУЧКИ)
               ========================================================================== */
            .online-prestige.selector,
            .lumio-prestige.selector,
            .files-item.selector {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: flex-start !important;
                width: 100% !important;
                min-height: 88px !important;
                height: 92px !important;
                margin-bottom: 6px !important;
                padding: 8px 16px 8px 8px !important;
                background: var(--lp-bg-card) !important;
                border-radius: var(--lp-radius-lg) !important;
                border: 2px solid transparent !important;
                box-sizing: border-box !important;
                position: relative !important;
                overflow: hidden !important;
                transform: translate3d(0, 0, 0) !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease !important;
            }

            .online-prestige.selector.focus,
            .lumio-prestige.selector.focus,
            .files-item.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 20px rgba(18, 214, 223, 0.35) !important;
                transform: scale(1.008) !important;
                z-index: 5 !important;
            }

            .online-prestige__folder,
            .lumio-prestige__media,
            .files-item__img {
                flex-shrink: 0 !important;
                width: 80px !important;
                height: 100% !important;
                min-height: 72px !important;
                max-height: 76px !important;
                border-radius: var(--lp-radius-md) !important;
                background-size: cover !important;
                background-position: center center !important;
                position: relative !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                margin-right: 14px !important;
                background-color: rgba(255, 255, 255, 0.04) !important;
            }

            .online-prestige__folder > img,
            .lumio-prestige__media > img,
            .files-item__img > img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                border-radius: var(--lp-radius-md) !important;
            }

            /* Ротация градиентов без постера */
            .online-prestige.selector:nth-child(4n+1) .online-prestige__folder:not(:has(img)),
            .torrent-item:nth-child(4n+1) .torrent-item__tracker {
                background: linear-gradient(145deg, rgba(18, 214, 223, 0.34), rgba(155, 92, 255, 0.20) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+2) .online-prestige__folder:not(:has(img)),
            .torrent-item:nth-child(4n+2) .torrent-item__tracker {
                background: linear-gradient(145deg, rgba(34, 197, 94, 0.32), rgba(18, 214, 223, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+3) .online-prestige__folder:not(:has(img)),
            .torrent-item:nth-child(4n+3) .torrent-item__tracker {
                background: linear-gradient(145deg, rgba(155, 92, 255, 0.30), rgba(244, 114, 182, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+4) .online-prestige__folder:not(:has(img)),
            .torrent-item:nth-child(4n+4) .torrent-item__tracker {
                background: linear-gradient(145deg, rgba(250, 204, 21, 0.26), rgba(249, 115, 22, 0.16) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            /* Иконка микрофона */
            .online-prestige--voice .online-prestige__folder > svg,
            .online-prestige__folder > svg {
                width: 30px !important;
                height: 30px !important;
                fill: #ffffff !important;
                opacity: 0.92 !important;
            }

            .online-prestige__body,
            .lumio-prestige__body,
            .files-item__body {
                flex: 1 1 auto !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                min-width: 0 !important;
                padding-right: 12px !important;
            }

            .online-prestige__title,
            .lumio-prestige__title,
            .files-item__title {
                font-size: 1.35em !important;
                font-weight: 700 !important;
                color: var(--lp-text-title) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                margin-bottom: 4px !important;
            }

            .online-prestige__info,
            .lumio-prestige__info,
            .files-item__info {
                font-size: 0.95em !important;
                color: var(--lp-text-sub) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }

            /* ==========================================================================
               3. МОДУЛЬ ТОРРЕНТОВ (TORRSERVER / TORRENTS)
               ========================================================================== */
            .torrent-item.selector,
            .torrent-serial.selector {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                width: 100% !important;
                min-height: 88px !important;
                margin-bottom: 6px !important;
                padding: 10px 16px !important;
                background: var(--lp-bg-card) !important;
                border-radius: var(--lp-radius-lg) !important;
                border: 2px solid transparent !important;
                box-sizing: border-box !important;
                position: relative !important;
                overflow: hidden !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease !important;
            }

            .torrent-item.selector.focus,
            .torrent-serial.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 20px rgba(18, 214, 223, 0.35) !important;
                transform: scale(1.008) !important;
                z-index: 5 !important;
            }

            .torrent-item__tracker {
                flex-shrink: 0 !important;
                width: 76px !important;
                height: 68px !important;
                border-radius: var(--lp-radius-md) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: 700 !important;
                font-size: 1.1em !important;
                color: #ffffff !important;
                margin-right: 14px !important;
                text-transform: uppercase !important;
            }

            .torrent-item__body {
                flex: 1 1 auto !important;
                min-width: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
            }

            .torrent-item__title {
                font-size: 1.3em !important;
                font-weight: 700 !important;
                color: #ffffff !important;
                margin-bottom: 5px !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }

            .torrent-item__details {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-size: 0.9em !important;
            }

            .torrent-item__seeds,
            .torrent-item__grabs,
            .torrent-item__size {
                display: inline-flex !important;
                align-items: center !important;
                padding: 0.22em 0.6em !important;
                border-radius: var(--lp-radius-sm) !important;
                font-weight: 600 !important;
            }

            .torrent-item__seeds {
                background: rgba(34, 197, 94, 0.20) !important;
                color: #9dffc0 !important;
            }

            .torrent-item__grabs {
                background: rgba(155, 92, 255, 0.25) !important;
                color: #eadcff !important;
            }

            .torrent-item__size {
                background: rgba(18, 214, 223, 0.18) !important;
                color: #bdfaff !important;
            }

            /* ==========================================================================
               4. ДЕТАЛЬНАЯ КАРТОЧКА ФИЛЬМА (FULL-SCREEN / FULL-START)
               ========================================================================== */
            .full-start__button.selector,
            .full-start__button-online.selector {
                border-radius: var(--lp-radius-md) !important;
                border: 2px solid transparent !important;
                background: rgba(255, 255, 255, 0.08) !important;
                transition: all 0.2s ease !important;
            }

            .full-start__button.selector.focus,
            .full-start__button-online.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 18px rgba(18, 214, 223, 0.4) !important;
                transform: scale(1.03) !important;
            }

            .full-descr__tag,
            .full-start__tag {
                background: rgba(255, 255, 255, 0.08) !important;
                border-radius: var(--lp-radius-sm) !important;
                color: #e2e8f0 !important;
                padding: 0.3em 0.7em !important;
                font-size: 0.9em !important;
            }

            /* ==========================================================================
               5. НАСТРОЙКИ, ПАРАМЕТРЫ И СЕЛЕКТБОКСЫ
               ========================================================================== */
            .settings-folder.selector,
            .settings-param.selector,
            .selectbox-item.selector {
                border-radius: var(--lp-radius-md) !important;
                border: 2px solid transparent !important;
                background: var(--lp-bg-card) !important;
                margin-bottom: 4px !important;
                transition: all 0.2s ease !important;
            }

            .settings-folder.selector.focus,
            .settings-param.selector.focus,
            .selectbox-item.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 16px rgba(18, 214, 223, 0.3) !important;
            }

            /* Чекбоксы и переключатели */
            .settings-param__toggle.active {
                background: var(--lp-cyan) !important;
                box-shadow: 0 0 10px rgba(18, 214, 223, 0.5) !important;
            }

            /* ==========================================================================
               6. МЕНЮ, ШАПКА И НАВИГАЦИЯ
               ========================================================================== */
            .menu__item.selector {
                border-radius: var(--lp-radius-md) !important;
                transition: all 0.2s ease !important;
                border: 2px solid transparent !important;
            }

            .menu__item.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 14px rgba(18, 214, 223, 0.35) !important;
            }

            .head__action.selector.focus,
            .head__search.selector.focus {
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 12px rgba(18, 214, 223, 0.4) !important;
            }

            /* ==========================================================================
               7. ПЛЕЕР И ПРОГРЕСС-БАРЫ
               ========================================================================== */
            .player-timeline__position,
            .online-prestige__timeline-inner {
                background: linear-gradient(90deg, #22c55e, #6ee7b7) !important;
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.6) !important;
            }

            .player-timeline__buffer {
                background: rgba(255, 255, 255, 0.25) !important;
            }

            /* Таймлайн списков */
            .online-prestige__timeline,
            .lumio-prestige__progress,
            .files-item__progress {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 3px !important;
                background: rgba(255, 255, 255, 0.12) !important;
                border-radius: 0 0 var(--lp-radius-lg) var(--lp-radius-lg) !important;
                overflow: hidden !important;
            }
        `;

        var styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);
    }

    if (window.appready) {
        initGlobalTheme();
    } else if (window.Lampa && window.Lampa.Listener) {
        window.Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initGlobalTheme();
        });
    } else {
        document.addEventListener('DOMContentLoaded', initGlobalTheme);
    }
})();
