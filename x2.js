(function () {
    'use strict';

    // 1. Инициализация настроек
    Lampa.Storage.set('filter_russia', Lampa.Storage.get('filter_russia', 'true'));
    Lampa.Storage.set('filter_japan', Lampa.Storage.get('filter_japan', 'true'));
    Lampa.Storage.set('filter_india', Lampa.Storage.get('filter_india', 'true'));
    Lampa.Storage.set('filter_indonesia', Lampa.Storage.get('filter_indonesia', 'true'));

    // Функция для проверки, нужно ли удалять карточку
    function shouldHide(data) {
        if (!data) return false;

        const countries = data.origin_country || [];
        const lang = data.original_language || '';

        // Проверка России (Код RU)
        if (Lampa.Storage.get('filter_russia') === 'false') {
            if (countries.includes('RU') || lang === 'ru') return true;
        }

        // Проверка Японии (Код JP) - обычно это Аниме
        if (Lampa.Storage.get('filter_japan') === 'false') {
            if (countries.includes('JP') || lang === 'ja') return true;
        }

        // Проверка Индии (Код IN)
        if (Lampa.Storage.get('filter_india') === 'false') {
            const indianLangs = ['hi', 'kn', 'ml', 'ta', 'te'];
            if (countries.includes('IN') || indianLangs.includes(lang)) return true;
        }

        // Проверка Индонезии (Код ID)
        if (Lampa.Storage.get('filter_indonesia') === 'false') {
            if (countries.includes('ID') || lang === 'id') return true;
        }

        return false;
    }

    // Функция фильтрации карточек на экране
    function applyFilter() {
        $('.card').each(function () {
            const card = $(this);
            const data = card[0].card_data;
            if (shouldHide(data)) {
                card.remove();
            }
        });
    }

    // 2. Добавление раздела в настройки Lampa
    Lampa.Settings.add({
        title: 'Фильтр',
        type: 'button',
        icon: '<svg height="36" viewBox="0 0 24 24" width="36" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="white"/></svg>',
        onRender: (body) => {
            // Добавляем описание
            body.find('.settings-param__name').css('color', '#ffde1a').text('Настройка отображения стран');

            const items = [
                { title: 'Показывать Россию', key: 'filter_russia' },
                { title: 'Показывать Японию (Аниме)', key: 'filter_japan' },
                { title: 'Показывать Индию', key: 'filter_india' },
                { title: 'Показывать Индонезию', key: 'filter_indonesia' }
            ];

            items.forEach(item => {
                const isEnabled = Lampa.Storage.get(item.key) === 'true';
                const html = $(`
                    <div class="settings-param selector">
                        <div class="settings-param__name">${item.title}</div>
                        <div class="settings-param__value">${isEnabled ? 'Да' : 'Нет'}</div>
                    </div>
                `);

                html.on('hover:enter', () => {
                    const current = Lampa.Storage.get(item.key) === 'true';
                    const newValue = !current;
                    Lampa.Storage.set(item.key, newValue.toString());
                    html.find('.settings-param__value').text(newValue ? 'Да' : 'Нет');
                    
                    // Уведомление для пользователя
                    Lampa.Noty.show('Настройка сохранена. Перезагрузите раздел.');
                });

                body.append(html);
            });
        }
    });

    // 3. Запуск наблюдателя за появлением карточек
    Lampa.Listener.follow('app', (e) => {
        if (e.type == 'ready') {
            const observer = new MutationObserver(() => {
                applyFilter();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            applyFilter();
        }
    });

})();
