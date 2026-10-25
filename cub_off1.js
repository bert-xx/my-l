(function () {
    'use strict';
    if (window.cub_off_loaded) return;
    window.cub_off_loaded = true;

    function safe(fn) { try { return fn(); } catch (e) {} }

    // ── Настройки Lampa: отключить функции CUB ──────────────────────────
    safe(function () {
        var ls = window.lampa_settings = window.lampa_settings || {};
        var df = ls.disable_features = ls.disable_features || {};
        ['reactions', 'ads', 'subscribe', 'discuss', 'feed', 'notice', 'collections'].forEach(function (k) { df[k] = true; });
    });

    // ── Блокировка запросов к CUB (TMDB и Lampac остаются) ──────────────
    var CUB_HOST  = /(^|\.)(cub\.red|cub\.rip|cub\.best)$/i;
    var KEEP_HOST = /^(apitmdb|imagetmdb|tmdb)\./i;

    function blocked(u) {
        try {
            var a = new URL(String(u), location.href);
            return CUB_HOST.test(a.hostname) && !KEEP_HOST.test(a.hostname);
        } catch (e) { return false; }
    }

    safe(function () {
        var nativeFetch = window.fetch;
        if (!nativeFetch) return;
        window.fetch = function (input) {
            var u = typeof input === 'string' ? input : (input && input.url);
            if (blocked(u)) {
                return Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }));
            }
            return nativeFetch.apply(this, arguments);
        };
    });

    safe(function () {
        var xhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (blocked(url)) {
                arguments[0] = 'GET';
                arguments[1] = 'data:application/json,%7B%7D';
            }
            return xhrOpen.apply(this, arguments);
        };
    });

    safe(function () {
        var NativeWS = window.WebSocket;
        if (!NativeWS) return;
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
    });

    // ── Метрики: sendBeacon и пиксели ───────────────────────────────────
    safe(function () {
        if (!navigator.sendBeacon) return;
        var nativeBeacon = navigator.sendBeacon.bind(navigator);
        navigator.sendBeacon = function (url) {
            if (blocked(url)) return true;
            return nativeBeacon.apply(navigator, arguments);
        };
    });

    safe(function () {
        var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
        if (!desc || !desc.set) return;
        Object.defineProperty(HTMLImageElement.prototype, 'src', {
            configurable: true,
            enumerable: desc.enumerable,
            get: desc.get,
            set: function (v) {
                if (blocked(v) && !this.closest) { return; }
                // пиксели без DOM-родителя (new Image().src = ...) к CUB не отправляем
                if (blocked(v) && !this.parentNode) { return; }
                return desc.set.call(this, v);
            }
        });
    });

    safe(function () {
        function stubMetric() {
            if (!window.Lampa || !Lampa.Metric) return;
            Object.keys(Lampa.Metric).forEach(function (k) {
                if (typeof Lampa.Metric[k] === 'function') Lampa.Metric[k] = function () {};
            });
        }
        if (window.appready) stubMetric();
        else if (window.Lampa && Lampa.Listener) {
            Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') stubMetric(); });
        }
    });

    // ── CSS: скрыть неинтерактивные элементы CUB ────────────────────────
    safe(function () {
        var css = [
            '.button--subscribe',
            '.full-start__reactions, .full-start-new__reactions, .full-reactions',
            '.full-start [class*="reactions"], .full-start-new [class*="reactions"]',
            '.head .open--notice, .head .notice--icon, .head .open--premium, .head .open--feed, .head .open--profile',
            '.menu__item[data-action="feed"], .menu__item[data-action="subscribes"], .menu__item[data-action="collections"]',
            '.ad-bot, .ad-server'
        ].join(',\n') + ' { display: none !important; }';

        var style = document.createElement('style');
        style.id = 'cub_off_style';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    });

    // ── Кнопка «Подписаться»: удалить из DOM ────────────────────────────
    var RE_SUB = /^(подписаться|отписаться|подписка|subscribe|unsubscribe)$/i;

    function sweepSubscribe() {
        var list = document.querySelectorAll('.full-start__button, .full-start-new__buttons > *, .full-start__buttons > *');
        for (var i = 0; i < list.length; i++) {
            var el = list[i];
            var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
            if (RE_SUB.test(t) || /subscribe/i.test(el.className || '')) {
                if (el.parentNode) el.parentNode.removeChild(el);
            }
        }
    }

    // ── Расширения: оставить только блок со своими плагинами ────────────
    var refocusTimer = null;

    function refocus() {
        safe(function () {
            if (!window.Lampa || !Lampa.Controller) return;
            var name = Lampa.Controller.enabled().name;
            if (name) Lampa.Controller.toggle(name);
        });
    }

    function sweepExtensions() {
        var root = document.querySelector('.extensions');
        if (!root) return;
        var blocks = root.querySelectorAll('.extensions__block');
        var removed = false;
        for (var i = 0; i < blocks.length; i++) {
            var b = blocks[i];
            if (b.querySelector('.extensions__block-add')) continue;
            if (b.parentNode) { b.parentNode.removeChild(b); removed = true; }
        }
        if (removed) {
            clearTimeout(refocusTimer);
            refocusTimer = setTimeout(refocus, 150);
        }
    }

    // ── Раздел «Аккаунт» в настройках: удалить из DOM ───────────────────
    function removeAccountFolder(root) {
        var nodes = (root || document).querySelectorAll('.settings-folder[data-component="account"]');
        var removed = false;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].parentNode) { nodes[i].parentNode.removeChild(nodes[i]); removed = true; }
        }
        return removed;
    }

    function hookSettings() {
        safe(function () {
            if (!window.Lampa || !Lampa.Settings || !Lampa.Settings.listener) return;
            Lampa.Settings.listener.follow('open', function (e) {
                var body = e && e.body ? (e.body[0] || e.body) : null;
                var changed = removeAccountFolder(body && body.querySelectorAll ? body : document);
                if (!changed) changed = removeAccountFolder(document);
                if (changed) {
                    setTimeout(refocus, 0);
                    setTimeout(refocus, 200);
                }
            });
        });
    }

    if (window.appready) hookSettings();
    else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') hookSettings(); });
    } else {
        var tries = 0;
        var iv = setInterval(function () {
            if (window.Lampa && Lampa.Settings && Lampa.Settings.listener) {
                clearInterval(iv);
                hookSettings();
            } else if (++tries > 100) clearInterval(iv);
        }, 200);
    }

    // ── Наблюдатель DOM ─────────────────────────────────────────────────
    var queued = false;
    function schedule() {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
            queued = false;
            safe(sweepSubscribe);
            safe(sweepExtensions);
        });
    }

    function startObserver() {
        if (!document.body) return setTimeout(startObserver, 100);
        new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
        schedule();
    }
    startObserver();
})();
