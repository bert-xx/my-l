(function () {
    'use strict';	

    Lampa.Listener.follow('app', (e) => {
        if (e.type == 'ready') {
            setTimeout(function () {
               
                $("[data-action=anime]").remove();
           
                $("[data-action=indian]").remove();
            }, 100); 
        }
    });

})();
