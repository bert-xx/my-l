(function () {
    'use strict';

    // Функция для очистки контента
    function applyFilter() {
        if (!$('.card').length) return;

        $('.card').each(function () {
            var card = $(this);
            var data = card[0].card_data;
            if (!data) return;

            var countries = data.origin_country || [];
            var lang = data.original_language || '';
            var hide = false;

            // Проверка России
            if (Lampa.Storage.get('filter_russia') === 'false') {
                if (countries.indexOf('RU') !== -1 || lang === 'ru') hide = true;
            }
            // Проверка Японии
            if (Lampa.Storage.get('filter_japan') === 'false') {
                if (countries.indexOf('JP') !== -1 || lang === 'ja') hide = true;
            }
            // Проверка Индии
            if (Lampa.Storage.get('filter_india') === 'false') {
                var inLangs = ['hi', 'kn', 'ml', 'ta', 'te'];
                if (countries.indexOf('IN') !== -1 || inLangs.indexOf(lang) !== -1) hide = true;
            }
            // Проверка Индонезии
            if (Lampa.Storage.get('filter_indonesia') === 'false') {
                if (countries.indexOf('ID') !== -1 || lang === 'id') hide = true;
            }

            if (hide) {
                card.remove();
            }
        });
    }

    // Регистрация настроек
    function addSettings() {
        // Устанавливаем значения по умолчанию
        if (!Lampa.Storage.field('filter_russia')) Lampa.Storage.set('filter_russia', 'true');
        if (!Lampa.Storage.field('filter_japan')) Lampa.Storage.set('filter_japan', 'true');
        if (!Lampa.Storage.field('filter_india')) Lampa.Storage.set('filter_india', 'true');
        if (!Lampa.Storage.field('filter_indonesia')) Lampa.Storage.set('filter_indonesia', 'true');

        var item = {
            title: 'Фильтр',
            type: 'button',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>',
            onRender: function (body) {
                var fields = [
                    { title: 'Показывать Россию', key: 'filter_russia' },
                    { title: 'Показывать Японию (Аниме)', key: 'filter_japan' },
                    { title: 'Показывать Индию', key: 'filter_india' },
                    { title: 'Показывать Индонезию', key: 'filter_indonesia' }
                ];

                fields.forEach(function (f) {
                    var status = Lampa.Storage.get(f.key) === 'true' ? 'Да' : 'Нет';
                    var html = $(
                        '<div class="settings-param selector">' +
                            '<div class="settings-param__name">' + f.title + '</div>' +
                            '<div class="settings-param__value">' + status + '</div>' +
                        '</div>'
                    );

                    html.on('hover:enter', function () {
                        var current = Lampa.Storage.get(f.key) === 'true';
                        Lampa.Storage.set(f.key, (!current).toString());
                        $(this).find('.settings-param__value').text(!current ? 'Да' : 'Нет');
                        Lampa.Noty.show('Изменено: ' + f.title);
                    });

                    body.append(html);
                });
            }
        };

        // Добавляем в список настроек
        Lampa.Settings.add(item);
    }

    // Таймер для постоянной проверки (самый надежный метод для всех ТВ)
    function init() {
        addSettings();
        
        setInterval(function() {
            applyFilter();
        }, 1000); // Проверяем экран каждую секунду на наличие мусора
    }

    // Ждем готовности приложения
    if (window.appready) init();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') init();
        });
    }
})();
