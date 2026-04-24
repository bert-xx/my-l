(function () {
    'use strict';	

    
    var style = $('<style>' +
        '[data-action="anime"], ' +   // Скрывает Аниме
        '[data-action="indian"]' +    // Скрывает Индийское
        '{ display: none !important; }' +
    '</style>');
    
    $('head').append(style);

    
    Lampa.Listener.follow('app', (e) => {
        if (e.type == 'ready') {
            var clear = function() {
                $("[data-action='anime']").remove();
                $("[data-action='indian']").remove();
            };
            
            
            setTimeout(clear, 10); 
            setTimeout(clear, 500);
            setTimeout(clear, 2000);
        }
    });

})();
