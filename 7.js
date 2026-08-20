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
                --lp-bg-focus: linear-gradient(120deg, rgba(20, 30, 60, 0.94), rgba(120, 60, 180, 0.60));
                --lp-text-title: #ffffff;
                --lp-text-sub: rgba(255, 255, 255, 0.65);
                --lp-radius-lg: 14px;
                --lp-radius-md: 10px;
                --lp-radius-sm: 7px;
            }

            /* ==========================================================================
               1. КАРТОЧКИ ОНЛАЙНА (УВЕЛИЧЕННАЯ ВЫСОТА И ШИРИНА)
               ========================================================================== */
            .online-prestige.selector,
            .lumio-prestige.selector,
            .files-item.selector {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                justify-content: flex-start !important;
                width: 100% !important;
                min-height: 120px !important;
                height: 124px !important;
                margin-bottom: 10px !important;
                padding: 14px 22px 14px 14px !important;
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
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 26px rgba(18, 214, 223, 0.4) !important;
                transform: scale(1.008) !important;
                z-index: 5 !important;
            }

            /* Превью-блок онлайна */
            .online-prestige__folder,
            .lumio-prestige__media,
            .files-item__img {
                flex-shrink: 0 !important;
                width: 165px !important;
                min-width: 165px !important;
                height: 96px !important;
                min-height: 96px !important;
                max-height: 96px !important;
                border-radius: var(--lp-radius-md) !important;
                background-size: cover !important;
                background-position: center center !important;
                position: relative !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                margin-right: 18px !important;
                background-color: rgba(255, 255, 255, 0.04) !important;
            }

            .online-prestige__folder > img,
            .lumio-prestige__media > img,
            .files-item__img > img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                border-radius: var(--lp-radius-md) !important;
                display: block !important;
            }

            /* Ротация градиентов без постера */
            .online-prestige.selector:nth-child(4n+1) .online-prestige__folder:not(:has(img)),
            .files-item:nth-child(4n+1) .files-item__img:not(:has(img)) {
                background: linear-gradient(145deg, rgba(18, 214, 223, 0.34), rgba(155, 92, 255, 0.20) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+2) .online-prestige__folder:not(:has(img)),
            .files-item:nth-child(4n+2) .files-item__img:not(:has(img)) {
                background: linear-gradient(145deg, rgba(34, 197, 94, 0.32), rgba(18, 214, 223, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+3) .online-prestige__folder:not(:has(img)),
            .files-item:nth-child(4n+3) .files-item__img:not(:has(img)) {
                background: linear-gradient(145deg, rgba(155, 92, 255, 0.30), rgba(244, 114, 182, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+4) .online-prestige__folder:not(:has(img)),
            .files-item:nth-child(4n+4) .files-item__img:not(:has(img)) {
                background: linear-gradient(145deg, rgba(250, 204, 21, 0.26), rgba(249, 115, 22, 0.16) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            /* Иконка микрофона */
            .online-prestige--voice .online-prestige__folder > svg,
            .online-prestige__folder > svg {
                width: 38px !important;
                height: 38px !important;
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
                padding-right: 16px !important;
                gap: 6px !important;
            }

            .online-prestige__title,
            .lumio-prestige__title,
            .files-item__title {
                font-size: 1.45em !important;
                font-weight: 700 !important;
                color: var(--lp-text-title) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                line-height: 1.3 !important;
            }

            .online-prestige__info,
            .lumio-prestige__info,
            .files-item__info {
                font-size: 1em !important;
                color: var(--lp-text-sub) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }

            /* Правый блок онлайна */
            .files-item__right,
            .online-prestige__right {
                flex-shrink: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-end !important;
                justify-content: center !important;
                gap: 8px !important;
                margin-left: auto !important;
            }

            .files-item__time,
            .online-prestige__time {
                font-size: 1em !important;
                color: var(--lp-text-sub) !important;
                font-weight: 600 !important;
            }

            .files-item__quality,
            .online-prestige__quality,
            .online-prestige__badge {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: rgba(34, 197, 94, 0.20) !important;
                color: #9dffc0 !important;
                border-radius: var(--lp-radius-sm) !important;
                padding: 0.3em 0.7em !important;
                font-size: 0.85em !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                letter-spacing: 0.04em !important;
            }

            /* ==========================================================================
               2. КАРТОЧКИ ТОРРЕНТОВ (УВЕЛИЧЕННАЯ ВЫСОТА И ВНУТРЕННИЕ ОТСТУПЫ)
               ========================================================================== */
            .torrent-item.selector,
            .torrent-serial.selector {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                width: 100% !important;
                min-height: 120px !important;
                height: auto !important;
                margin-bottom: 10px !important;
                padding: 16px 24px !important;
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
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 26px rgba(18, 214, 223, 0.4) !important;
                transform: scale(1.008) !important;
                z-index: 5 !important;
            }

            /* Тело торрента */
            .torrent-item__body {
                flex: 1 1 auto !important;
                min-width: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                gap: 12px !important;
            }

            /* Строка 1: Название */
            .torrent-item__title {
                font-size: 1.45em !important;
                font-weight: 700 !important;
                color: #ffffff !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                display: block !important;
                line-height: 1.3 !important;
            }

            /* Строка 2: Метаданные (трекер, дата, сериал, сиды, размер) */
            .torrent-item__details {
                display: flex !important;
                flex-direction: row !important;
                align-items: center !important;
                flex-wrap: wrap !important;
                gap: 10px !important;
                font-size: 0.95em !important;
                color: var(--lp-text-sub) !important;
            }

            .torrent-item__tracker {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0.3em 0.8em !important;
                border-radius: var(--lp-radius-sm) !important;
                background: rgba(155, 92, 255, 0.28) !important;
                color: #eadcff !important;
                font-weight: 700 !important;
                text-transform: uppercase !important;
                font-size: 0.88em !important;
                letter-spacing: 0.04em !important;
            }

            .torrent-serial__series,
            .torrent-item__series,
            .torrent-item__episode {
                display: inline-flex !important;
                align-items: center !important;
                background: rgba(255, 255, 255, 0.12) !important;
                border-radius: var(--lp-radius-sm) !important;
                padding: 0.28em 0.7em !important;
                font-weight: 600 !important;
                color: #ffffff !important;
                font-size: 0.9em !important;
            }

            .torrent-item__seeds {
                display: inline-flex !important;
                align-items: center !important;
                background: rgba(34, 197, 94, 0.20) !important;
                color: #9dffc0 !important;
                padding: 0.28em 0.75em !important;
                border-radius: var(--lp-radius-sm) !important;
                font-weight: 600 !important;
            }

            .torrent-item__grabs {
                display: inline-flex !important;
                align-items: center !important;
                background: rgba(155, 92, 255, 0.25) !important;
                color: #eadcff !important;
                padding: 0.28em 0.75em !important;
                border-radius: var(--lp-radius-sm) !important;
                font-weight: 600 !important;
            }

            .torrent-item__size {
                display: inline-flex !important;
                align-items: center !important;
                background: rgba(18, 214, 223, 0.18) !important;
                color: #bdfaff !important;
                padding: 0.28em 0.8em !important;
                border-radius: var(--lp-radius-sm) !important;
                font-weight: 600 !important;
                margin-left: auto !important;
            }

            /* ==========================================================================
               3. КАРТОЧКИ КАТАЛОГА (ГЛАВНАЯ / ПОИСК)
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
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 24px rgba(18, 214, 223, 0.38) !important;
            }

            /* ==========================================================================
               4. ДЕТАЛЬНЫЙ ЭКРАН И НАСТРОЙКИ
               ========================================================================== */
            .full-start__button.selector,
            .full-start__button-online.selector,
            .settings-folder.selector,
            .settings-param.selector,
            .selectbox-item.selector {
                border-radius: var(--lp-radius-md) !important;
                border: 2px solid transparent !important;
                background: var(--lp-bg-card) !important;
                padding: 12px 18px !important;
                min-height: 52px !important;
                transition: all 0.2s ease !important;
            }

            .full-start__button.selector.focus,
            .full-start__button-online.selector.focus,
            .settings-folder.selector.focus,
            .settings-param.selector.focus,
            .selectbox-item.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 20px rgba(18, 214, 223, 0.38) !important;
            }

            /* ==========================================================================
               5. ПРОГРЕСС-БАРЫ
               ========================================================================== */
            .player-timeline__position,
            .online-prestige__timeline-inner,
            .files-item__progress > div {
                background: linear-gradient(90deg, #22c55e, #6ee7b7) !important;
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.6) !important;
            }

            .online-prestige__timeline,
            .lumio-prestige__progress,
            .files-item__progress {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 4px !important;
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
