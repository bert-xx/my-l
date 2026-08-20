(function () {
    'use strict';

    if (window.lumio_accent_theme_started) return;
    window.lumio_accent_theme_started = true;

    var ACCENT_ID = 'lumio-accent-theme-css';
    var ACCENT_CYAN = '#12D6DF';
    var ACCENT_VIOLET = '#9B5CFF';

    if (document.getElementById(ACCENT_ID)) return;

    var css = ''
        + ':root{'
        + '  --lumio-accent-a:' + ACCENT_CYAN + ';'
        + '  --lumio-accent-b:' + ACCENT_VIOLET + ';'
        + '  --lumio-accent-grad: linear-gradient(90deg, var(--lumio-accent-a), var(--lumio-accent-b));'
        + '}'

        /* ---- Card / item focus ---- */
        + '.card.focus .card__view,'
        + '.card.focus--visible .card__view,'
        + '.selector.focus,'
        + '.simple-button.focus,'
        + '.settings-param.focus,'
        + '.menu__item.focus,'
        + '.filter--item.focus{'
        + '  box-shadow: 0 0 0 .16em var(--lumio-accent-a), 0 0 1.4em rgba(18,214,223,.35) !important;'
        + '  transition: box-shadow .15s ease;'
        + '}'

        + '.card.focus .card__age,'
        + '.card.focus .card__quality{'
        + '  background: var(--lumio-accent-grad) !important;'
        + '  color:#0b0f1a !important;'
        + '}'

        /* ---- Buttons: primary / active states ---- */
        + '.simple-button--active,'
        + '.full-start__button.selector.active,'
        + '.settings-param.focus .settings-param__name,'
        + '.button--filter.active{'
        + '  background: var(--lumio-accent-grad) !important;'
        + '  color:#0b0f1a !important;'
        + '  border-color: transparent !important;'
        + '}'

        /* ---- Menu active item accent bar ---- */
        + '.menu__item.selected:before,'
        + '.menu .menu__item.active:before{'
        + '  content:"";'
        + '  position:absolute;'
        + '  left:0; top:.4em; bottom:.4em;'
        + '  width:.18em;'
        + '  border-radius:.2em;'
        + '  background: var(--lumio-accent-grad);'
        + '}'

        /* ---- Scrollbar accent ---- */
        + '.scroll__thumb,'
        + '::-webkit-scrollbar-thumb{'
        + '  background: var(--lumio-accent-grad) !important;'
        + '}'

        /* ---- Progress bars (watch progress, seek, loader) ---- */
        + '.card__progress div,'
        + '.progress__value,'
        + '.timeline__value,'
        + '.player-timeline__scrubber-fill,'
        + '.torrent-item__progress-value{'
        + '  background: var(--lumio-accent-grad) !important;'
        + '  box-shadow: 0 0 .5em rgba(18,214,223,.5);'
        + '}'

        /* ---- Loader: pulse + accent spinner ---- */
        + '.activity__loader .loader,'
        + '.broadcast__load,'
        + '.loading-layer .loader{'
        + '  border-top-color: var(--lumio-accent-a) !important;'
        + '  border-right-color: var(--lumio-accent-b) !important;'
        + '  animation: lumioSpin .85s linear infinite, lumioPulse 1.3s ease-in-out infinite !important;'
        + '}'

        + '@keyframes lumioSpin{ to{ transform: rotate(360deg); } }'
        + '@keyframes lumioPulse{ 0%,100%{ opacity:.75; } 50%{ opacity:1; } }'

        /* ---- Fade-in for freshly rendered cards / rows ---- */
        + '.card,'
        + '.items-line__item{'
        + '  animation: lumioFadeIn .28s ease both;'
        + '}'
        + '@keyframes lumioFadeIn{ from{ opacity:0; transform: translateY(.4em); } to{ opacity:1; transform:none; } }'

        /* ---- Search / input focus glow ---- */
        + '.selectbox-item.focus,'
        + 'input:focus,'
        + '.input-item.focus{'
        + '  box-shadow: 0 0 0 .14em var(--lumio-accent-b) !important;'
        + '}'

        /* ---- Checkbox / toggle active accent ---- */
        + '.selectbox-item.selector.selected .selectbox-item__checkbox,'
        + '.settings-param.selector .settings-param__value.active,'
        + '.checkbox--filled{'
        + '  background: var(--lumio-accent-grad) !important;'
        + '  border-color: transparent !important;'
        + '}';

    var style = document.createElement('style');
    style.id = ACCENT_ID;
    style.textContent = css;
    document.head.appendChild(style);
})();
