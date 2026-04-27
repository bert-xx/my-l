(function () {
    'use strict';

    function filterContent() {
        // Ищем все карточки на странице
        $('.card').each(function () {
            var card = $(this);
            
            var data = card[0].card_data;

            if (data) {
                var isIndian = false;
                var isAnime = false;

                // 1. Проверка на Индию (по коду страны IN)
                if (data.origin_country && data.origin_country.includes('IN')) {
                    isIndian = true;
                }
                // Доп. проверка по языку, если страна не указана
                if (data.original_language === 'hi' || data.original_language === 'kn' || data.original_language === 'ml' || data.original_language === 'ta' || data.original_language === 'te') {
                    isIndian = true;
                }

                // 2. Проверка на Аниме (Жанр 16 - Мультфильм + Японский язык)
                if (data.genre_ids && data.genre_ids.includes(16) && data.original_language === 'ja') {
                    isAnime = true;
                }
                
                // Если это Аниме или Индия — удаляем карточку
                if (isIndian || isAnime) {
                    card.remove();
                }
            }
        });

        
        $("[data-action=anime], [data-action=indian], [data-id=indian]").remove();
    }

    // Запуск фильтрации при изменениях на странице
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            // Создаем наблюдатель, который следит за появлением новых карточек при скролле
            var observer = new MutationObserver(function (mutations) {
                filterContent();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            // Первичная очистка
            filterContent();
        }
    });
})();
