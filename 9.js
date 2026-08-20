(function () {
    'use strict';

    function initGlobalTheme() {
        if (window.plugin_lampa_clean_theme_ready) return;
        window.plugin_lampa_clean_theme_ready = true;

        var styleId = 'lampa-clean-cyber-theme';
        if (document.getElementById(styleId)) return;

        var css = `
            :root {
                --lp-cyan: #12D6DF;
                --lp-violet: #9B5CFF;
                --lp-green: #22c55e;
                --lp-yellow: #eab308;
                --lp-bg-card: #0d1220;
                --lp-bg-focus: linear-gradient(120deg, rgba(20, 30, 60, 0.92), rgba(120, 60, 180, 0.55));
                --lp-radius-lg: 12px;
                --lp-radius-md: 8px;
                --lp-radius-sm: 5px;
            }

            /* ==========================================================================
               1. БАЗОВЫЕ КАРТОЧКИ И ФОКУС (БЕЗ ВМЕШАТЕЛЬСТВА В ПОЗИЦИИ И РАЗМЕРЫ)
               ========================================================================== */
            .torrent-item.selector,
            .torrent-serial.selector,
            .files-item.selector,
            .online-prestige.selector,
            .lumio-prestige.selector {
                background: var(--lp-bg-card) !important;
                border-radius: var(--lp-radius-lg) !important;
                border: 2px solid transparent !important;
                box-sizing: border-box !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
            }

            .torrent-item.selector.focus,
            .torrent-serial.selector.focus,
            .files-item.selector.focus,
            .online-prestige.selector.focus,
            .lumio-prestige.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 20px rgba(18, 214, 223, 0.35) !important;
            }

            /* Превью онлайна: скругление и ротация цветов без постера */
            .files-item__img,
            .online-prestige__folder,
            .lumio-prestige__media {
                border-radius: var(--lp-radius-md) !important;
                overflow: hidden !important;
            }

            .files-item__img > img,
            .online-prestige__folder > img,
            .lumio-prestige__media > img {
                border-radius: var(--lp-radius-md) !important;
                object-fit: cover !important;
            }

            .files-item:nth-child(4n+1) .files-item__img:not(:has(img)),
            .online-prestige:nth-child(4n+1) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(18, 214, 223, 0.34), rgba(155, 92, 255, 0.20) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .files-item:nth-child(4n+2) .files-item__img:not(:has(img)),
            .online-prestige:nth-child(4n+2) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(34, 197, 94, 0.32), rgba(18, 214, 223, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .files-item:nth-child(4n+3) .files-item__img:not(:has(img)),
            .online-prestige:nth-child(4n+3) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(155, 92, 255, 0.30), rgba(244, 114, 182, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .files-item:nth-child(4n+4) .files-item__img:not(:has(img)),
            .online-prestige:nth-child(4n+4) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(250, 204, 21, 0.26), rgba(249, 115, 22, 0.16) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            /* ==========================================================================
               2. БЕЙДЖИ И ЧИПЫ (ТОРРЕНТЫ И ОНЛАЙН)
               ========================================================================== */
            .torrent-item__tracker,
            .torrent-item__seeds,
            .torrent-item__grabs,
            .torrent-item__size,
            .torrent-item__quality,
            .torrent-serial__series,
            .torrent-item__series,
            .torrent-item__episode,
            .files-item__quality,
            .online-prestige__badge,
            .online-prestige__quality {
                border-radius: var(--lp-radius-sm) !important;
                padding: 0.2em 0.55em !important;
                font-weight: 600 !important;
                letter-spacing: 0.03em !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            /* Зеленый: Сиды / HD */
            .torrent-item__seeds,
            .files-item__quality,
            .online-prestige__quality,
            [data-badge="HD"], [data-badge="1080p"], [data-badge="720p"] {
                background: rgba(34, 197, 94, 0.20) !important;
                color: #9dffc0 !important;
            }

            /* Фиолетовый: Трекер / Пиры / DUB / MVO */
            .torrent-item__tracker,
            .torrent-item__grabs,
            .badge--dub, .badge--mvo, .badge--vo, .badge--avo,
            [data-badge="DUB"], [data-badge="MVO"], [data-badge="VO"], [data-badge="AVO"] {
                background: rgba(155, 92, 255, 0.28) !important;
                color: #eadcff !important;
            }

            /* Циан: Размер / Серии / Озвучка */
            .torrent-item__size,
            .badge--voice,
            [data-badge="voice"] {
                background: rgba(18, 214, 223, 0.18) !important;
                color: #bdfaff !important;
            }

            /* Желтый: SUB / SD */
            .badge--sub,
            [data-badge="SUB"], [data-badge="SD"], [data-badge="480p"], [data-badge="360p"] {
                background: rgba(234, 179, 8, 0.22) !important;
                color: #ffe9a1 !important;
            }

            /* 4K / UHD */
            [data-badge="4K"], [data-badge="UHD"], [data-badge="2160p"] {
                background: rgba(155, 92, 255, 0.22) !important;
                color: #e4d4ff !important;
            }

            /* ==========================================================================
               3. КАТАЛОГ, ДЕТАЛЬНЫЙ ЭКРАН И НАСТРОЙКИ
               ========================================================================== */
            .card__view {
                border-radius: var(--lp-radius-lg) !important;
                overflow: hidden !important;
                border: 2px solid transparent !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
            }

            .card.focus .card__view {
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 22px rgba(18, 214, 223, 0.35) !important;
            }

            .full-start__button.selector,
            .full-start__button-online.selector,
            .settings-folder.selector,
            .settings-param.selector,
            .selectbox-item.selector,
            .menu__item.selector {
                border-radius: var(--lp-radius-md) !important;
                border: 2px solid transparent !important;
                transition: all 0.2s ease !important;
            }

            .full-start__button.selector.focus,
            .full-start__button-online.selector.focus,
            .settings-folder.selector.focus,
            .settings-param.selector.focus,
            .selectbox-item.selector.focus,
            .menu__item.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 18px rgba(18, 214, 223, 0.35) !important;
            }

            /* ==========================================================================
               4. ПРОГРЕСС-БАРЫ
               ========================================================================== */
            .player-timeline__position,
            .online-prestige__timeline-inner,
            .files-item__progress > div {
                background: linear-gradient(90deg, #22c55e, #6ee7b7) !important;
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.5) !important;
            }

            .online-prestige__timeline,
            .lumio-prestige__progress,
            .files-item__progress {
                background: rgba(255, 255, 255, 0.12) !important;
                height: 3px !important;
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
