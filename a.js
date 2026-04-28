(function () {
    'use strict';

    // Список корней слов только для эротики/порнографии
    // Мы не используем слова вроде "xxx", чтобы не удалить фильм "Три Икса"
    var pornWords = ['порно', 'porno', 'эрот', 'erotic', 'хентай', 'hentai'];

    function isAdultContent(data) {
        // 1. Официальный флаг базы данных. 
        // В TMDB он стоит ТОЛЬКО у порнографии. Жестокость и черные комедии его не имеют.
        if (data.adult === true) return true;

        var i;
        var title = (data.title || data.name || '').toLowerCase();
        var origTitle = (data.original_title || data.original_name || '').toLowerCase();

        // 2. Проверка названий
        for (i = 0; i < pornWords.length; i++) {
            var word = pornWords[i];
            if (title.indexOf(word) !== -1 || origTitle.indexOf(word) !== -1) {
                return true;
            }
        }

        // 3. Проверка по жанрам (на случай, если плагины трекеров отдают жанр текстом)
        if (data.genres && Array.isArray(data.genres)) {
            for (var j = 0; j < data.genres.length; j++) {
                var genreName = (data.genres[j].name || data.genres[j] || '').toLowerCase();
                for (i = 0; i < pornWords.length; i++) {
                    if (genreName.indexOf(pornWords[i]) !== -1) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    function hidePornContent() {
        var cards = $('.card');
        if (!cards.length) return;

        cards.each(function () {
            var card = $(this);
            var data = card[0].card_data;
            if (!data) return;

            // Если функция подтвердила, что это контент 18+ — удаляем карточку
            if (isAdultContent(data)) {
                card.remove();
            }
        });
    }

    function startPlugin() {
        console.log('Porn Filter: Плагин запущен');
        // Запускаем проверку каждую секунду для очистки сетки при скроллинге
        setInterval(hidePornContent, 1000);
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') startPlugin();
        });
    }
})();
