(function () {
    'use strict';

    if (window.plugin_lampa_cards_theme_ready) return;
    window.plugin_lampa_cards_theme_ready = true;

    var styleId = 'lampa-cards-theme-styles';
    if (document.getElementById(styleId)) return;

    var css = `
        :root {
            --accent-cyan: #12D6DF;
            --accent-violet: #9B5CFF;
            --bg-card: #0d1220;
            --bg-card-hover: #131b2e;
            --bg-card-focus-grad: linear-gradient(120deg, rgba(20, 30, 60, 0.92), rgba(120, 60, 180, 0.55));
            --text-title: #ffffff;
            --text-sub: rgba(255, 255, 255, 0.62);
            --card-radius: 12px;
            --media-radius: 8px;
        }

        /* Список и карточка */
        .online-prestige,
        .lumio-prestige,
        .files-item.selector {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            width: 100% !important;
            min-height: 88px !important;
            height: 92px !important;
            margin-bottom: 6px !important;
            padding: 8px 14px 8px 8px !important;
            background: var(--bg-card) !important;
            border-radius: var(--card-radius) !important;
            border: 2px solid transparent !important;
            box-sizing: border-box !important;
            position: relative !important;
            overflow: hidden !important;
            transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
            animation: cardFadeIn 0.28s ease backwards !important;
        }

        @keyframes cardFadeIn {
            from {
                opacity: 0;
                transform: translateY(6px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Фокус карточки */
        .online-prestige.focus,
        .lumio-prestige.focus,
        .files-item.selector.focus {
            background: var(--bg-card-focus-grad) !important;
            border-color: var(--accent-cyan) !important;
            box-shadow: 0 0 0 1px var(--accent-cyan), 0 0 22px rgba(18, 214, 223, 0.35) !important;
            transform: scale(1.01) !important;
            z-index: 2 !important;
        }

        /* Превью / Левый блок */
        .online-prestige__media,
        .lumio-prestige__media,
        .files-item__img {
            flex-shrink: 0 !important;
            width: 80px !important;
            height: 100% !important;
            min-height: 72px !important;
            max-height: 76px !important;
            border-radius: var(--media-radius) !important;
            background-size: cover !important;
            background-position: center center !important;
            background-repeat: no-repeat !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            overflow: hidden !important;
            margin-right: 14px !important;
        }

        .online-prestige__media > img,
        .lumio-prestige__media > img,
        .files-item__img > img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            border-radius: var(--media-radius) !important;
        }

        /* Ротация фонов превью без постера */
        .online-prestige:nth-child(4n+1) .online-prestige__media:not(:has(img:not([src=""]))),
        .lumio-prestige:nth-child(4n+1) .lumio-prestige__media:not(:has(img:not([src=""]))),
        .files-item:nth-child(4n+1) .files-item__img:not(:has(img:not([src=""]))) {
            background: linear-gradient(145deg, rgba(18, 214, 223, 0.34), rgba(155, 92, 255, 0.20) 60%, rgba(15, 23, 42, 0.85)) !important;
        }

        .online-prestige:nth-child(4n+2) .online-prestige__media:not(:has(img:not([src=""]))),
        .lumio-prestige:nth-child(4n+2) .lumio-prestige__media:not(:has(img:not([src=""]))),
        .files-item:nth-child(4n+2) .files-item__img:not(:has(img:not([src=""]))) {
            background: linear-gradient(145deg, rgba(34, 197, 94, 0.32), rgba(18, 214, 223, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
        }

        .online-prestige:nth-child(4n+3) .online-prestige__media:not(:has(img:not([src=""]))),
        .lumio-prestige:nth-child(4n+3) .lumio-prestige__media:not(:has(img:not([src=""]))),
        .files-item:nth-child(4n+3) .files-item__img:not(:has(img:not([src=""]))) {
            background: linear-gradient(145deg, rgba(155, 92, 255, 0.30), rgba(244, 114, 182, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
        }

        .online-prestige:nth-child(4n+4) .online-prestige__media:not(:has(img:not([src=""]))),
        .lumio-prestige:nth-child(4n+4) .lumio-prestige__media:not(:has(img:not([src=""]))),
        .files-item:nth-child(4n+4) .files-item__img:not(:has(img:not([src=""]))) {
            background: linear-gradient(145deg, rgba(250, 204, 21, 0.26), rgba(249, 115, 22, 0.16) 60%, rgba(15, 23, 42, 0.85)) !important;
        }

        /* Иконка микрофона */
        .online-prestige__media--voice::before,
        .lumio-prestige__media--voice::before {
            content: '' !important;
            width: 32px !important;
            height: 32px !important;
            background-color: #ffffff !important;
            opacity: 0.92 !important;
            -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>') !important;
            mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>') !important;
            -webkit-mask-repeat: no-repeat !important;
            mask-repeat: no-repeat !important;
            -webkit-mask-position: center !important;
            mask-position: center !important;
            -webkit-mask-size: contain !important;
            mask-size: contain !important;
        }

        /* Метка эпизода (S/E) */
        .online-prestige__episode-number,
        .lumio-prestige__episode {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1.15 !important;
            text-align: center !important;
        }

        .online-prestige__episode-season {
            font-size: 0.85em !important;
            font-weight: 500 !important;
            letter-spacing: 0.1em !important;
            color: rgba(255, 255, 255, 0.6) !important;
            text-transform: uppercase !important;
        }

        .online-prestige__episode-index {
            font-size: 1.5em !important;
            font-weight: 700 !important;
            color: #ffffff !important;
        }

        /* Центральная часть / Тело */
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
            font-size: 1.4em !important;
            font-weight: 700 !important;
            color: var(--text-title) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            margin-bottom: 4px !important;
            line-height: 1.25 !important;
        }

        .online-prestige__info,
        .online-prestige__details,
        .lumio-prestige__info,
        .files-item__info {
            font-size: 0.95em !important;
            color: var(--text-sub) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            line-height: 1.2 !important;
        }

        /* Правая колонка / Бейджи */
        .online-prestige__right,
        .online-prestige__tags,
        .lumio-prestige__badges,
        .files-item__size {
            flex-shrink: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-end !important;
            justify-content: center !important;
            gap: 5px !important;
            margin-left: auto !important;
        }

        .online-prestige__badge,
        .lumio-prestige__badge,
        .badge {
            border-radius: 0.4em !important;
            padding: 0.24em 0.55em !important;
            font-size: 0.8em !important;
            font-weight: 600 !important;
            white-space: nowrap !important;
            text-transform: uppercase !important;
            letter-spacing: 0.04em !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* Цвета бейджей */
        .badge--dub, .badge--mvo, .badge--vo, .badge--avo,
        [data-badge="DUB"], [data-badge="MVO"], [data-badge="VO"], [data-badge="AVO"] {
            background: rgba(155, 92, 255, 0.28) !important;
            color: #eadcff !important;
        }

        .badge--sub,
        [data-badge="SUB"] {
            background: rgba(234, 179, 8, 0.22) !important;
            color: #ffe9a1 !important;
        }

        .badge--hd,
        [data-badge="HD"], [data-badge="1080p"], [data-badge="720p"] {
            background: rgba(34, 197, 94, 0.20) !important;
            color: #9dffc0 !important;
        }

        .badge--sd,
        [data-badge="SD"], [data-badge="480p"], [data-badge="360p"] {
            background: rgba(234, 179, 8, 0.22) !important;
            color: #ffe58a !important;
        }

        .badge--4k, .badge--uhd,
        [data-badge="4K"], [data-badge="UHD"], [data-badge="2160p"] {
            background: rgba(155, 92, 255, 0.22) !important;
            color: #e4d4ff !important;
        }

        .badge--voice,
        [data-badge="voice"] {
            background: rgba(18, 214, 223, 0.18) !important;
            color: #bdfaff !important;
        }

        /* Прогресс-бар */
        .online-prestige__timeline,
        .lumio-prestige__progress,
        .files-item__progress {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 3px !important;
            background: rgba(255, 255, 255, 0.13) !important;
            border-radius: 0 0 var(--card-radius) var(--card-radius) !important;
            overflow: hidden !important;
        }

        .online-prestige__timeline-inner,
        .lumio-prestige__progress-inner,
        .files-item__progress > div {
            height: 100% !important;
            background: linear-gradient(90deg, #22c55e, #6ee7b7) !important;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.5) !important;
            border-radius: 2px !important;
        }

        /* Шапка списка */
        .online-prestige__head,
        .files-head {
            display: flex !important;
            align-items: center !important;
            padding: 8px 12px 14px !important;
            font-size: 1.1em !important;
            color: rgba(255, 255, 255, 0.7) !important;
        }

        .online-prestige__head-source,
        .files-head__title {
            display: inline-flex !important;
            align-items: center !important;
            background: rgba(255, 255, 255, 0.08) !important;
            padding: 0.3em 0.8em !important;
            margin-left: 8px !important;
            border-radius: 8px !important;
            color: #ffffff !important;
            font-size: 0.9em !important;
            font-weight: 500 !important;
        }

        .online-prestige__head-search,
        .files-head__search {
            margin-left: auto !important;
            cursor: pointer !important;
            opacity: 0.8 !important;
            transition: opacity 0.2s ease !important;
        }

        .online-prestige__head-search:hover,
        .files-head__search.focus {
            opacity: 1 !important;
        }

        /* Лоадер */
        .activity__loader,
        .loader {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 16px !important;
        }

        .loader-item,
        .activity__loader-spinner,
        .broadcast__loader {
            width: 48px !important;
            height: 48px !important;
            border: 3px solid rgba(255, 255, 255, 0.1) !important;
            border-top-color: var(--accent-cyan) !important;
            border-right-color: var(--accent-violet) !important;
            border-radius: 50% !important;
            animation: prestigeSpin 0.9s cubic-bezier(0.65, 0.05, 0.35, 0.95) infinite, prestigePulse 1.8s ease-in-out infinite !important;
        }

        @keyframes prestigeSpin {
            to { transform: rotate(360deg); }
        }

        @keyframes prestigePulse {
            0%, 100% { opacity: 0.75; }
            50% { opacity: 1; }
        }

        .activity__loader-line {
            width: 15em !important;
            height: 3px !important;
            background: rgba(255, 255, 255, 0.12) !important;
            border-radius: 2px !important;
            overflow: hidden !important;
            position: relative !important;
        }

        .activity__loader-line::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 40% !important;
            background: linear-gradient(90deg, var(--accent-cyan), var(--accent-violet)) !important;
            animation: nexusLoad 1.1s ease-in-out infinite !important;
        }

        @keyframes nexusLoad {
            0% { left: -40%; width: 40%; }
            50% { width: 60%; }
            100% { left: 100%; width: 40%; }
        }
    `;

    var styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);
})();
