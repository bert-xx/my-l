(function () {
    'use strict';
    if (window.cub_off_loaded) return;
    window.cub_off_loaded = true;

    // ── Настройки Lampa: отключить функции CUB ──────────────────────────
    var ls = window.lampa_settings = window.lampa_settings || {};
    var df = ls.disable_features = ls.disable_features || {};
    ['reactions', 'ads', 'subscribe', 'discuss', 'feed', 'notice', 'collections'].forEach(function (k) { df[k] = true; });

    // ── Блокировка запросов к CUB (TMDB-прокси для карточек остаётся) ───
    var CUB_HOST  = /(^|\.)(cub\.red|cub\.rip)$/i;
    var KEEP_HOST = /^(apitmdb|imagetmdb|tmdb)\./i;

    function blocked(u) {
        try {
            var a = new URL(String(u), location.href);
            return CUB_HOST.test(a.hostname) && !KEEP_HOST.test(a.hostname);
        } catch (e) { return false; }
    }

    var nativeFetch = window.fetch;
    if (nativeFetch) {
        window.fetch = function (input) {
            var u = typeof input === 'string' ? input : (input && input.url);
            if (blocked(u)) {
                return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            return nativeFetch.apply(this, arguments);
        };
    }

    var xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (blocked(url)) {
            arguments[0] = 'GET';
            arguments[1] = 'data:application/json,%7B%7D';
        }
        return xhrOpen.apply(this, arguments);
    };

    var NativeWS = window.WebSocket;
    if (NativeWS) {
        var FakeWS = function () {
            return {
                readyState: 3, send: function () {}, close: function () {},
                addEventListener: function () {}, removeEventListener: function () {},
                onopen: null, onmessage: null, onclose: null, onerror: null
            };
        };
        var WS = function (url, proto) {
            if (blocked(String(url).replace(/^ws/i, 'http'))) return FakeWS();
            return proto !== undefined ? new NativeWS(url, proto) : new NativeWS(url);
        };
        WS.prototype = NativeWS.prototype;
        ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function (k) { WS[k] = NativeWS[k]; });
        window.WebSocket = WS;
    }

    // ── CSS: скрыть элементы интерфейса CUB ─────────────────────────────
    var css = [
        '.button--subscribe',
        '.full-start__reactions, .full-start-new__reactions, .full-reactions',
        '.full-start [class*="reactions"], .full-start-new [class*="reactions"]',
        '.head .open--notice, .head .notice--icon, .head .open--premium, .head .open--feed, .head .open--profile',
        '.menu__item[data-action="feed"], .menu__item[data-action="subscribes"], .menu__item[data-action="collections"]',
        '.settings-folder[data-component="account"]',
        '.ad-bot, .ad-server'
    ].join(',\n') + ' { display: none !important; }';

    var style = document.createElement('style');
    style.id = 'cub_off_style';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);

    // ── Запасной вариант: скрыть кнопку «Подписаться» по тексту ─────────
    var RE_SUB = /^(подписаться|отписаться|подписка|subscribe|unsubscribe)$/i;

    function sweep() {
        var list = document.querySelectorAll('.full-start__button, .full-start-new__buttons > *, .full-start__buttons > *');
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            if (el.__cub_off) continue;
            var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
            if (RE_SUB.test(t) || /subscribe/i.test(el.className || '')) {
                el.style.display = 'none';
                el.__cub_off = 1;
            }
        }
    }

    var queued = false;
    function schedule() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; sweep(); });
    }

    function startObserver() {
        if (!document.body) return setTimeout(startObserver, 100);
        new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
        sweep();
    }
    startObserver();
})();
