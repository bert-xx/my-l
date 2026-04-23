(function () {
    'use strict';	

    Lampa.Listener.follow('app', (e) => {
        if (e.type == 'ready') {
            setTimeout(function () {
                // Удаляем Аниме
                $("[data-action=anime]").remove();
                // Удаляем Индийское
                $("[data-action=indian]").remove();
            }, 100); // Немного увеличил задержку для надежности
        }
    });

})();
