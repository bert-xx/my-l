(function () {
    'use strict';

    if (window.plugin_lmepublictorr_ready) return;
    window.plugin_lmepublictorr_ready = true;
    Lampa.Platform.tv();

    var selectionKey = 'lme_url_two';
    var healthKey = 'lme_parser_health';
    var none = { id: 'no_parser', name: 'Не выбран' };
    var parsers = [
        { id: 'ru_jac_black', name: 'ru.jac.black', url: 'ru.jac.black' },
        { id: 'jac_black', name: 'jac.black', url: 'jac.black' },
        { id: 'jacred_stream', name: 'jacred.stream', url: 'jacred.stream', key: 'pp' },
        { id: 'jr_maxvol_pro', name: 'jr.maxvol.pro', url: 'https://jr.maxvol.pro' },
        { id: 'jacred_viewbox_dev', name: 'Viewbox', url: 'jacred.viewbox.dev', key: 'viewbox' },
        { id: 'unknown', name: 'Unknown', url: '188.119.113.252:9117', key: '1' },
        { id: 'trs_my_to', name: 'Trs.my.to', url: 'trs.my.to:9118' },
        { id: 'jacred_my_to', name: 'Jacred.my.to', url: 'jacred.my.to' },
        { id: 'jacred', name: 'Jac.red', url: 'jac.red' },
        { id: 'JaCred_su', name: 'JacRed.su', url: 'jacred.su' },
        { id: 'jac_red_ru', name: 'jac-red.ru', url: 'jac-red.ru' }
    ];
    var title = 'Каталог парсеров';
    var labels = {
        ok: 'Доступен',
        'auth-error': 'Ошибка ключа',
        'network-error': 'Недоступен',
        unknown: 'Не проверен',
        checking: 'Проверка...'
    };
    var statusClasses = 'status-ok status-auth-error status-network-error status-unknown status-checking';
    var cache = {};

    function selectedName() {
        var id = Lampa.Storage.get(selectionKey, none.id);
        var parser = parsers.find(function (entry) { return entry.id === id; });
        return (parser || none).name;
    }

    function checkParser(parser) {
        var protocol = Lampa.Utils && typeof Lampa.Utils.protocol === 'function'
            ? Lampa.Utils.protocol()
            : (location.protocol === 'https:' ? 'https://' : 'http://');
        var baseUrl = /^https?:\/\//i.test(parser.url) ? parser.url : protocol + parser.url;
        var url = baseUrl + '/api/v2.0/indexers/status:healthy/results?apikey=' + (parser.key || '');
        var cached = cache[url];
        if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.status);

        return new Promise(function (resolve) {
            $.ajax({
                url: url,
                method: 'GET',
                timeout: 5000,
                success: function (response, textStatus, xhr) {
                    var status = xhr.status === 200 ? 'ok' : 'network-error';
                    if (status === 'ok') cache[url] = { status: status, expiresAt: Date.now() + 600000 };
                    resolve(status);
                },
                error: function (xhr) {
                    resolve(xhr && xhr.status === 401 ? 'auth-error' : 'network-error');
                }
            });
        }).catch(function () { return 'unknown'; });
    }

    function setStatus(item, status) {
        item.removeClass(statusClasses).addClass('status-' + status);
        item.find('.pubtorr-parser-modal__status').text(labels[status]);
    }

    function openCatalog() {
        var modal = $(
            '<div class="pubtorr-parser-modal">' +
                '<div class="pubtorr-parser-modal__head">' +
                    '<div><div class="pubtorr-parser-modal__current-label">Текущий выбор:</div>' +
                    '<div class="pubtorr-parser-modal__current-value"></div></div>' +
                    '<div class="pubtorr-parser-modal__action selector">Обновить проверку</div>' +
                '</div>' +
                '<div class="pubtorr-parser-modal__list"></div>' +
                '<div class="pubtorr-parser-modal__legend"></div>' +
            '</div>'
        );
        var list = modal.find('.pubtorr-parser-modal__list');
        var refresh = modal.find('.pubtorr-parser-modal__action');
        var legend = modal.find('.pubtorr-parser-modal__legend');
        var rows = [none].concat(parsers).map(function (parser) {
            var item = $(
                '<div class="pubtorr-parser-modal__item selector">' +
                    '<div class="pubtorr-parser-modal__name"></div>' +
                    '<div class="pubtorr-parser-modal__status"></div>' +
                '</div>'
            );
            item.find('.pubtorr-parser-modal__name').text(parser.name);
            setStatus(item, 'unknown');
            item.on('hover:enter', function () {
                Lampa.Storage.set(selectionKey, parser.id);
                updateSelection();
                if (parser.url) {
                    Lampa.Storage.set('jackett_url', parser.url);
                    Lampa.Storage.set('jackett_key', parser.key || '');
                    Lampa.Storage.set('parser_torrent_type', 'jackett');
                }
            });
            list.append(item);
            return { parser: parser, item: item };
        });

        function updateSelection() {
            var id = Lampa.Storage.get(selectionKey, none.id);
            rows.forEach(function (row) {
                row.item.toggleClass('is-selected', row.parser.id === id);
            });
            var name = selectedName();
            modal.find('.pubtorr-parser-modal__current-value').text(name);
            $('.pubtorr-parser-selected').text('Выбрано: ' + name);
        }

        ['ok', 'auth-error', 'network-error', 'unknown'].forEach(function (status) {
            legend.append($('<div class="pubtorr-parser-modal__legend-item status-' + status + '"></div>').text(labels[status]));
        });

        updateSelection();
        Lampa.Modal.open({
            title: title,
            html: modal,
            size: 'medium',
            scroll_to_center: true,
            select: rows[0].item,
            onBack: function () {
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
            }
        });

        if (!Lampa.Storage.get(healthKey, true)) {
            refresh.addClass('hide');
            legend.addClass('hide');
            return;
        }

        var parserRows = rows.slice(1);
        function runChecks() {
            var requests = parserRows.map(function (row) {
                setStatus(row.item, 'checking');
                return checkParser(row.parser);
            });
            Promise.all(requests).then(function (statuses) {
                parserRows.forEach(function (row, index) {
                    setStatus(row.item, statuses[index]);
                });
            });
        }

        refresh.on('hover:enter', runChecks);
        runChecks();
    }

    function renderSetting(item, previous) {
        setTimeout(function () {
            var anchor = $('div[data-name="' + previous + '"]').first();
            if (anchor.length) item.insertAfter(anchor);
            if (Lampa.Storage.field('parser_use')) item.show();
            else item.hide();
        });
    }

    function install() {
        Lampa.Template.add('pubtorr_style', [
            '<style>',
            '.pubtorr-parser-modal,.pubtorr-parser-modal__list{display:flex;flex-direction:column}',
            '.pubtorr-parser-modal{gap:1em}.pubtorr-parser-modal__list{gap:.6em}',
            '.pubtorr-parser-modal__head,.pubtorr-parser-modal__item{display:flex;align-items:center;justify-content:space-between;gap:1em}',
            '.pubtorr-parser-modal__current-label{font-size:.9em;opacity:.7}.pubtorr-parser-modal__current-value{font-size:1.1em}',
            '.pubtorr-parser-modal__action{padding:.5em .9em;border-radius:.6em;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2)}',
            '.pubtorr-parser-modal__item{position:relative;padding:.8em 1em .8em 1.8em;border-radius:.7em;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}',
            '.pubtorr-parser-modal__item.is-selected,.pubtorr-parser-modal__item.focus,.pubtorr-parser-modal__action.focus{border-color:#fff}',
            '.pubtorr-parser-modal__status{font-size:.8em;opacity:.7;text-align:right;align-self:center}',
            '.pubtorr-parser-modal__legend{display:flex;flex-wrap:wrap;gap:.8em 1.2em;font-size:.85em;opacity:.7}',
            '.pubtorr-parser-modal__legend-item{position:relative;padding-left:1.2em}',
            '.pubtorr-parser-modal__item::before,.pubtorr-parser-modal__legend-item::before{content:"";position:absolute;border-radius:50%;background:var(--pubtorr-status-color,#8c8c8c)}',
            '.pubtorr-parser-modal__item::before{left:.8em;top:50%;width:.55em;height:.55em;transform:translateY(-50%);box-shadow:0 0 .6em rgba(0,0,0,.3)}',
            '.pubtorr-parser-modal__legend-item::before{left:0;top:.55em;width:.5em;height:.5em}',
            '.pubtorr-parser-modal .status-ok{--pubtorr-status-color:#19c37d}',
            '.pubtorr-parser-modal .status-auth-error,.pubtorr-parser-modal .status-network-error{--pubtorr-status-color:#ff4d4f}',
            '.pubtorr-parser-modal .status-checking{--pubtorr-status-color:#f5a623}',
            '@media(max-width:600px){.pubtorr-parser-modal__head,.pubtorr-parser-modal__item{flex-direction:column;align-items:flex-start}.pubtorr-parser-modal__status{text-align:left}}',
            '</style>'
        ].join('\n'));
        $('body').append(Lampa.Template.get('pubtorr_style', {}, true));

        Lampa.SettingsApi.addParam({
            component: 'parser',
            param: { name: 'lme_parser_manage', type: 'button' },
            field: {
                name: title,
                description: 'Нажмите для выбора парсера из ' + parsers.length + '<div class="pubtorr-parser-selected"></div>'
            },
            onChange: openCatalog,
            onRender: function (item) {
                item.find('.pubtorr-parser-selected').text('Выбрано: ' + selectedName());
                renderSetting(item, 'parser_use');
            }
        });
        Lampa.SettingsApi.addParam({
            component: 'parser',
            param: { name: healthKey, type: 'trigger', 'default': true },
            field: { name: 'Индикация состояния парсеров' },
            onRender: function (item) { renderSetting(item, 'lme_parser_manage'); }
        });
    }

    if (window.appready) install();
    else Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready') install();
    });
})();
