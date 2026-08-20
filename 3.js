(function () {
    'use strict';

    function initTheme() {
        if (window.plugin_lampa_cards_theme_ready) return;
        window.plugin_lampa_cards_theme_ready = true;

        var styleId = 'lampa-cards-prestige-override';
        if (document.getElementById(styleId)) return;

        var css = `
            :root {
                --lp-cyan: #12D6DF;
                --lp-violet: #9B5CFF;
                --lp-bg-card: #0d1220;
                --lp-bg-focus: linear-gradient(120deg, rgba(20, 30, 60, 0.92), rgba(120, 60, 180, 0.55));
                --lp-text-title: #ffffff;
                --lp-text-sub: rgba(255, 255, 255, 0.62);
            }

            /* Контейнер карточки списка */
            .online-prestige.selector {
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
                border-radius: 12px !important;
                border: 2px solid transparent !important;
                box-sizing: border-box !important;
                position: relative !important;
                overflow: hidden !important;
                transform: translate3d(0, 0, 0) !important;
                transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease !important;
                animation: lpFadeIn 0.25s ease-out backwards !important;
            }

            @keyframes lpFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(4px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Фокус карточки */
            .online-prestige.selector.focus {
                background: var(--lp-bg-focus) !important;
                border-color: var(--lp-cyan) !important;
                box-shadow: 0 0 0 1px var(--lp-cyan), 0 0 20px rgba(18, 214, 223, 0.35) !important;
                transform: scale(1.008) !important;
                z-index: 5 !important;
            }

            /* Превью-блок (папка/постер/серия) */
            .online-prestige__folder {
                flex-shrink: 0 !important;
                width: 80px !important;
                height: 100% !important;
                min-height: 72px !important;
                max-height: 76px !important;
                border-radius: 8px !important;
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
                background-color: rgba(255, 255, 255, 0.04) !important;
            }

            .online-prestige__folder > img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                border-radius: 8px !important;
                display: block !important;
            }

            /* Ротация градиентов превью без постера */
            .online-prestige.selector:nth-child(4n+1) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(18, 214, 223, 0.34), rgba(155, 92, 255, 0.20) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+2) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(34, 197, 94, 0.32), rgba(18, 214, 223, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+3) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(155, 92, 255, 0.30), rgba(244, 114, 182, 0.18) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            .online-prestige.selector:nth-child(4n+4) .online-prestige__folder:not(:has(img)) {
                background: linear-gradient(145deg, rgba(250, 204, 21, 0.26), rgba(249, 115, 22, 0.16) 60%, rgba(15, 23, 42, 0.85)) !important;
            }

            /* Монохромная иконка микрофона для озвучек без постера */
            .online-prestige--voice .online-prestige__folder > svg,
            .online-prestige__folder > svg {
                width: 32px !important;
                height: 32px !important;
                fill: #ffffff !important;
                opacity: 0.92 !important;
            }

            /* Метка эпизода (S/E) */
            .online-prestige__episode-number {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                line-height: 1.15 !important;
                color: #ffffff !important;
                font-weight: 700 !important;
                font-size: 1.35em !important;
            }

            /* Тело карточки */
            .online-prestige__body {
                flex: 1 1 auto !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                min-width: 0 !important;
                padding-right: 12px !important;
            }

            .online-prestige__title {
                font-size: 1.4em !important;
                font-weight: 700 !important;
                color: var(--lp-text-title) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                margin-bottom: 4px !important;
                line-height: 1.25 !important;
            }

            .online-prestige__info {
                font-size: 0.95em !important;
                color: var(--lp-text-sub) !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                line-height: 1.2 !important;
                display: flex !important;
                align-items: center !important;
                flex-wrap: nowrap !important;
            }

            .online-prestige-split {
                display: inline-block !important;
                margin: 0 6px !important;
                opacity: 0.4 !important;
            }

            /* Бейджи и чипы */
            .online-prestige__badge,
            .online-prestige__info > span[class*="badge"],
            .online-prestige__info > span[class*="quality"] {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 0.4em !important;
                padding: 0.2em 0.55em !important;
                font-size: 0.8em !important;
                font-weight: 600 !important;
                white-space: nowrap !important;
                text-transform: uppercase !important;
                letter-spacing: 0.04em !important;
                margin-left: 6px !important;
                background: rgba(155, 92, 255, 0.28) !important;
                color: #eadcff !important;
            }

            /* Цветовые стили чипов */
            .online-prestige__info > span:is([class*="sub"], [class*="SUB"]),
            .online-prestige__info > span:is([class*="sd"], [class*="SD"], [class*="480p"], [class*="360p"]) {
                background: rgba(234, 179, 8, 0.22) !important;
                color: #ffe9a1 !important;
            }

            .online-prestige__info > span:is([class*="hd"], [class*="HD"], [class*="1080p"], [class*="720p"]) {
                background: rgba(34, 197, 94, 0.20) !important;
                color: #9dffc0 !important;
            }

            .online-prestige__info > span:is([class*="4k"], [class*="4K"], [class*="uhd"], [class*="UHD"], [class*="2160p"]) {
                background: rgba(155, 92, 255, 0.22) !important;
                color: #e4d4ff !important;
            }

            .online-prestige__info > span:is([class*="voice"], [class*="sound"]) {
                background: rgba(18, 214, 223, 0.18) !important;
                color: #bdfaff !important;
            }

            /* Прогресс-бар */
            .online-prestige__timeline {
                position: absolute !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                height: 3px !important;
                background: rgba(255, 255, 255, 0.13) !important;
                border-radius: 0 0 12px 12px !important;
                overflow: hidden !important;
            }

            .online-prestige__timeline-inner {
                height: 100% !important;
                background: linear-gradient(90deg, #22c55e, #6ee7b7) !important;
                box-shadow: 0 0 8px rgba(34, 197, 94, 0.5) !important;
                border-radius: 2px !important;
            }

            /* Изолированный лоадер балансеров */
            .lampac-balanser-loader,
            .broadcast__scan {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 20px 0 !important;
            }

            .lampac-balanser-loader::before,
            .broadcast__scan-circle {
                content: '' !important;
                width: 44px !important;
                height: 44px !important;
                border: 3px solid rgba(255, 255, 255, 0.1) !important;
                border-top-color: var(--lp-cyan) !important;
                border-right-color: var(--lp-violet) !important;
                border-radius: 50% !important;
                animation: lpSpin 0.9s cubic-bezier(0.65, 0.05, 0.35, 0.95) infinite, lpPulse 1.8s ease-in-out infinite !important;
            }

            @keyframes lpSpin {
                to { transform: rotate(360deg); }
            }

            @keyframes lpPulse {
                0%, 100% { opacity: 0.75; }
                50% { opacity: 1; }
            }
        `;

        var styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);
    }

    if (window.appready) {
        initTheme();
    } else if (window.Lampa && window.Lampa.Listener) {
        window.Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initTheme();
        });
    } else {
        document.addEventListener('DOMContentLoaded', initTheme);
    }
})();
