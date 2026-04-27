(function () {
    'use strict';

    function startPlugin() {
        // Инициализация настроек (если их нет, ставим true - показывать)
        if (Lampa.Storage.get('filter_russia') === null) Lampa.Storage.set('filter_russia', 'true');
        if (Lampa.Storage.get('filter_japan') === null) Lampa.Storage.set('filter_japan', 'true');
        if (Lampa.Storage.get('filter_india') === null) Lampa.Storage.set('filter_india', 'true');
        if (Lampa.Storage.get('filter_indonesia') === null) Lampa.Storage.set('filter_indonesia', 'true');

        // Функция фильтрации
        function applyFilter() {
            $('.card').each(function () {
                var card = $(this);
                var data = card[0].card_data;
                if (!data) return;

                var countries = data.origin_country || [];
                var lang = data.original_language || '';
                var hide = false;

                // Россия
                if (Lampa.Storage.get('filter_russia') === 'false') {
                    if (countries.indexOf('RU') !== -1 || lang === 'ru') hide = true;
                }
                // Япония
                if (Lampa.Storage.get('filter_japan') === 'false') {
                    if (countries.indexOf('JP') !== -1 || lang === 'ja') hide = true;
                }
                // Индия
                if (Lampa.Storage.get('filter_india') === 'false') {
                    var inLangs = ['hi', 'kn', 'ml', 'ta', 'te'];
                    if (countries.indexOf('IN') !== -1 || inLangs.indexOf(lang) !== -1) hide = true;
                }
                // Индонезия
                if (Lampa.Storage.get('filter_indonesia') === 'false') {
                    if (countries.indexOf('ID') !== -1 || lang === 'id') hide = true;
                }

                if (hide) {
                    card.css('display', 'none'); // Скрываем, чтобы не нарушать работу движка
                    card.remove(); // И удаляем из DOM
                }
            });
        }

        // Добавляем пункт в настройки
        Lampa.Settings.add({
            title: 'Фильтр стран',
            type: 'button',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="white"/></svg>',
            onRender: function (body) {
                var items = [
                    { title: 'Показывать Россию', key: 'filter_russia' },
                    { title: 'Показывать Японию', key: 'filter_japan' },
                    { title: 'Показывать Индию', key: 'filter_india' },
                    { title: 'Показывать Индонезию', key: 'filter_indonesia' }
                ];

                items.forEach(function (item) {
                    var isEnabled = Lampa.Storage.get(item.key) === 'true';
                    var html = $(
                        '<div class="settings-param selector">' +
                            '<div class="settings-param__name">' + item.title + '</div>' +
                            '<div class="settings-param__value">' + (isEnabled ? 'Да' : 'Нет') + '</div>' +
                        '</div>'
                    );

                    html.on('hover:enter', function () {
                        var current = Lampa.Storage.get(item.key) === 'true';
                        var newValue = !current;
                        Lampa.Storage.set(item.key, newValue.toString());
                        $(this).find('.settings-param__value').text(newValue ? 'Да' : 'Нет');
                        Lampa.Noty.show('Настройка сохранена');
                    });

                    body.append(html);
                });
            }
        });

        // Наблюдатель за появлением новых карточек
        var observer = new MutationObserver(function () {
            applyFilter();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        applyFilter();
    }

    // Запуск плагина строго после загрузки Lampa
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                startPlugin();
            }
        });
    }
})();
