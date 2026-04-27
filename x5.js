(function () {
    'use strict';

    // 1. Функция фильтрации карточек
    function applyFilter() {
        $('.card').each(function () {
            var card = $(this);
            var data = card[0].card_data;
            if (!data) return;

            var countries = data.origin_country || [];
            var lang = data.original_language || '';
            var hide = false;

            // Проверка настроек и данных карточки
            if (Lampa.Storage.field('filter_russia') === false) {
                if (countries.indexOf('RU') !== -1 || lang === 'ru') hide = true;
            }
            if (Lampa.Storage.field('filter_japan') === false) {
                if (countries.indexOf('JP') !== -1 || lang === 'ja') hide = true;
            }
            if (Lampa.Storage.field('filter_india') === false) {
                var inLangs = ['hi', 'kn', 'ml', 'ta', 'te'];
                if (countries.indexOf('IN') !== -1 || inLangs.indexOf(lang) !== -1) hide = true;
            }
            if (Lampa.Storage.field('filter_indonesia') === false) {
                if (countries.indexOf('ID') !== -1 || lang === 'id') hide = true;
            }

            if (hide) {
                card.remove(); // Полностью удаляем карточку из выдачи
            }
        });
    }

    // 2. Регистрация раздела в Настройках через SettingsApi
    function initSettings() {
        // Создаем компонент (пункт в боковом меню настроек)
        Lampa.SettingsApi.addComponent({
            component: 'filter_content',
            name: 'Фильтр контента',
            icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>'
        });

        // Добавляем переключатели Да/Нет
        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_japan', type: 'trigger', default: true },
            field: { name: 'Показывать Японию (Аниме)', description: 'Скрывает японские мультфильмы и фильмы' }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_russia', type: 'trigger', default: true },
            field: { name: 'Показывать Россию', description: 'Скрывает российский контент' }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_india', type: 'trigger', default: true },
            field: { name: 'Показывать Индию', description: 'Скрывает индийское кино' }
        });

        Lampa.SettingsApi.addParam({
            component: 'filter_content',
            param: { name: 'filter_indonesia', type: 'trigger', default: true },
            field: { name: 'Показывать Индонезию', description: 'Скрывает контент из Индонезии' }
        });
    }

    // 3. Запуск плагина
    function start() {
        initSettings();

        // Постоянная проверка экрана на наличие карточек (каждые 1.5 сек)
        // Это самый надежный способ для динамических списков Лампы
        setInterval(applyFilter, 1500);
        
        // Дополнительно удаляем кнопки из меню
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                $("[data-action=anime], [data-action=indian]").remove();
            }
        });
    }

    // Ожидание полной загрузки API Лампы
    if (window.appready) start();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') start();
        });
    }
})();
