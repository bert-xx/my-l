(function () {
    'use strict';

    var attempts = 0;
    var mode = 'quality_seeders';
    var sortKey = 'torrents_sort';

    function rank(item) {
        var title = String(item.Title || '');
        var height = parseInt(item.info && item.info.quality, 10);
        if (height === 2160 || /\b(?:4k|u[- ]?hd|ultra[- ]?hd|2160)[pр]?(?!\w)/i.test(title)) return 3;
        if (height === 1080 || /\b(?:full[- ]?hd|1080)[piр]?(?!\w)/i.test(title)) return 2;
        if (height === 720 || /\b720[pр]?(?!\w)/i.test(title)) return 1;
        return 0;
    }

    function install() {
        var L = window.Lampa;
        var $ = window.jQuery || window.$;
        if (window.plugin_torrents_qseed) return;
        if (!L || !L.Component || !L.Component.get || !L.Parser || !$) {
            if (++attempts < 120) window.setTimeout(install, 250);
            return;
        }

        var Native = L.Component.get('torrents');
        if (!Native) {
            if (++attempts < 120) window.setTimeout(install, 250);
            return;
        }

        function label(ru, en, uk) {
            var lang = L.Storage.field('language');
            return lang === 'en' ? en : lang === 'uk' ? uk : ru;
        }

        function Torrents(object) {
            // Some card sources supply genre_ids instead of TMDB's genres array.
            // Lampa's anime lookup calls genres.find() during the first start.
            var movie = object.movie;
            if (movie && /^(ja|zh)$/.test(movie.original_language) && !Array.isArray(movie.genres)) {
                object.movie = $.extend({}, movie, {
                    genres: (Array.isArray(movie.genre_ids) ? movie.genre_ids : []).map(function (id) {
                        return { id: id };
                    })
                });
            }
            var screen = new Native(object);
            if (['parse', 'sortResults', 'selectedSort', 'applyFilter', 'listEmpty', 'empty', 'start',
                'buildFilterd', 'selectedFilter', 'setFilterData', 'getFilterData', 'render', 'reset', 'append'].some(function (name) {
                return typeof screen[name] !== 'function';
            })) return screen;

            var root = $(screen.render()).addClass('explorer--fullsize qseed-screen');
            var parse = screen.parse;
            var sort = screen.sortResults;
            var selectedSort = screen.selectedSort;
            var reset = screen.reset;
            var append = screen.append;
            var start = screen.start;
            var empty = screen.empty;
            var listEmpty = screen.listEmpty;
            var data;
            var emptyView = false;
            object.page = 1;
            var qualityLabel = label('Качество + раздающие', 'Quality + seeders', 'Якість + сіди');
            var quick = $('<div class="qseed-quick"></div>');
            var seasonSignature;

            function button(title, action) {
                return $('<div class="simple-button selector"></div>').text(title).on('hover:enter', action);
            }

            function currentSort() {
                return L.Storage.get(sortKey, mode) || mode;
            }

            function updateControls() {
                var head = root.find('.explorer__files-head');
                var sortButton = head.find('.filter--sort');
                if (sortButton.length && !sortButton.hasClass('qseed-sort')) {
                    sortButton.addClass('qseed-sort').off('hover:enter').on('hover:enter', function () {
                        var items = [
                            { sort: mode, title: qualityLabel },
                            { sort: 'popular', title: L.Lang.translate('title_popular') },
                            { sort: 'Seeders', title: L.Lang.translate('torrent_parser_sort_by_seeders') },
                            { sort: 'Size', title: L.Lang.translate('torrent_parser_sort_by_size') },
                            { sort: 'Title', title: L.Lang.translate('torrent_parser_sort_by_name') },
                            { sort: 'Tracker', title: L.Lang.translate('torrent_parser_sort_by_tracker') },
                            { sort: 'PublisTime', title: L.Lang.translate('torrent_parser_sort_by_date') },
                            { sort: 'viewed', title: L.Lang.translate('torrent_parser_sort_by_viewed') }
                        ];
                        items.forEach(function (item) { item.selected = item.sort === currentSort(); });
                        L.Select.show({
                            title: L.Lang.translate('filter_sorted'),
                            items: items,
                            onBack: function () { screen.start(); },
                            onSelect: function (item) {
                                if (item) {
                                    L.Storage.set(sortKey, item.sort);
                                    screen.sortResults(item.sort);
                                    screen.applyFilter();
                                }
                                screen.start();
                            }
                        });
                    });
                }
                if (currentSort() === mode) sortButton.children('div').text(qualityLabel).removeClass('hide');

                if (!data || !data.Results.length) return;
                var seasons = [];
                if (object.movie.number_of_seasons) {
                    data.Results.forEach(function (item) {
                        (item.general && item.general.seasons || []).forEach(function (season) {
                            season = String(season);
                            if (seasons.indexOf(season) < 0) seasons.push(season);
                        });
                    });
                    seasons.sort(function (a, b) { return a - b; });
                }

                function chip(type, value, title) {
                    quick.append(button(title, function () {
                        var filters = screen.getFilterData();
                        var values = L.Arrays.toArray(filters[type]).slice();
                        var index = values.indexOf(value);
                        if (index < 0) values.push(value);
                        else values.splice(index, 1);
                        filters[type] = values;
                        screen.setFilterData(filters);
                        screen.buildFilterd();
                        screen.applyFilter();
                        screen.start();
                        L.Controller.collectionFocus(this, root[0]);
                    }).attr('data-type', type).attr('data-value', value));
                }

                var signature = seasons.join(',');
                if (signature !== seasonSignature) {
                    seasonSignature = signature;
                    quick.empty();
                    chip('quality', '4k', '4K');
                    chip('quality', '1080p', '1080p');
                    chip('quality', '720p', '720p');
                    seasons.forEach(function (season) {
                        chip('season', season, label('Сезон ', 'Season ', 'Сезон ') + season);
                    });
                    head.append(quick);
                }

                var active = screen.getFilterData();
                quick.children().each(function () {
                    var chip = $(this);
                    chip.toggleClass('qseed-active', L.Arrays.toArray(active[chip.attr('data-type')])
                        .indexOf(chip.attr('data-value')) >= 0);
                });
            }

            // The native component owns the result object and replaces its Results array for stock sorts.
            // Capture the object at the parser boundary so custom sorting still precedes pagination.
            screen.parse = function () {
                var get = L.Parser.get;
                L.Parser.get = function (query, success, failure) {
                    if (query !== object) return get.apply(this, arguments);
                    return get.call(this, query, function (result) {
                        if (!result || !Array.isArray(result.Results)) result = { Results: [] };
                        result.Results = result.Results.filter(function (item) {
                            return item && typeof item.Title === 'string';
                        });
                        result.Results.forEach(function (item) {
                            if (typeof item.Tracker !== 'string') item.Tracker = '';
                        });
                        data = result;
                        success(result);
                        updateControls();
                    }, failure);
                };
                try {
                    return parse.apply(this, arguments);
                } finally {
                    L.Parser.get = get;
                    updateControls();
                }
            };

            screen.sortResults = function (requested) {
                var selected = currentSort();
                if (selected !== mode || !data) return sort.call(this, requested);
                data.Results.sort(function (a, b) {
                    return rank(b) - rank(a) || (Number(b.Seeders) || 0) - (Number(a.Seeders) || 0);
                });
            };

            screen.selectedSort = function () {
                selectedSort.apply(this, arguments);
                updateControls();
            };

            var selectedFilter = screen.selectedFilter;
            screen.selectedFilter = function () {
                selectedFilter.apply(this, arguments);
                updateControls();
            };

            screen.reset = function () {
                object.page = 1;
                return reset.apply(this, arguments);
            };

            function hidePlaceholder() {
                root.find('.watched-history').each(function () {
                    var history = $(this);
                    history.toggleClass('qseed-no-history', history.find('.watched-history__body').text().trim()
                        === L.Lang.translate('no_watch_history'));
                });
            }

            function decorate(event) {
                if (event.type !== 'render') return;
                var item = $(event.item);
                var element = event.element;
                var seeds = Number(element.Seeders) || 0;
                item.find('.torrent-item__seeds span').toggleClass('qseed-zero', seeds === 0)
                    .toggleClass('qseed-many', seeds >= 20);
                if (parseFloat(item.find('.torrent-item__bitrate span').text().replace(',', '.')) > 50) {
                    item.find('.torrent-item__bitrate span').addClass('qseed-bitrate');
                }
                if (/kinozal|toloka|rutracker|rutor|torrentby|nnmclub|megapeer|bitru/i.test(element.Tracker)) {
                    item.find('.torrent-item__tracker').addClass('qseed-tracker');
                }
                var quality = rank(element);
                var badge = item.find('.m-resolution');
                if (!badge.length && quality) {
                    badge = $('<div class="m-resolution"></div>').text(['', '720p', '1080p', '4K'][quality]);
                    item.find('.torrent-item__ffprobe').removeClass('hide').append(badge);
                }
                badge.addClass('qseed-badge qseed-rank-' + quality);
            }

            screen.append = function () {
                L.Listener.follow('torrent', decorate);
                try {
                    return append.apply(this, arguments);
                } finally {
                    L.Listener.remove('torrent', decorate);
                    // On the initial page the scroll is attached after append returns.
                    window.setTimeout(hidePlaceholder, 0);
                }
            };

            screen.listEmpty = function () {
                listEmpty.apply(this, arguments);
                // The first render attaches the scroll after listEmpty returns.
                window.setTimeout(function () {
                    root.find('.empty-filter__buttons').each(function () {
                        var buttons = $(this);
                        if (!buttons.find('.qseed-reset').length) {
                            buttons.append(button(label('Сбросить фильтры', 'Reset filters', 'Скинути фільтри'), function () {
                                screen.setFilterData({});
                                screen.buildFilterd();
                                screen.applyFilter();
                                screen.start();
                            }).addClass('qseed-reset'));
                        }
                    });
                    var resetButtons = root.find('.qseed-reset');
                    if (resetButtons.length && root[0].offsetParent && L.Controller.enabled().name === 'content') {
                        L.Controller.collectionAppend(resetButtons);
                    }
                }, 0);
            };

            screen.empty = function () {
                empty.apply(this, arguments);
                emptyView = true;
                root.find('.explorer__files-head').removeClass('hide');
                var panel = root.find('.empty');
                if (panel.length && !panel.find('.qseed-back').length) {
                    panel.append(button(label('Назад', 'Back', 'Назад'), function () {
                        screen.back();
                    }).addClass('qseed-back'));
                }
                screen.start = function () {
                    L.Controller.add('content', {
                        toggle: function () {
                            L.Controller.collectionSet(root);
                            L.Controller.collectionFocus(false, root[0]);
                        },
                        up: function () { window.Navigator.move('up'); },
                        down: function () { window.Navigator.move('down'); },
                        left: function () { window.Navigator.move('left'); },
                        right: function () { window.Navigator.move('right'); },
                        back: screen.back
                    });
                    L.Controller.toggle('content');
                };
                screen.start();
            };

            screen.start = function () {
                var add = L.Controller.add;
                L.Controller.add = function (name, controller) {
                    if (name === 'content' && !emptyView) {
                        controller.left = function () {
                            if (window.Navigator.canmove('left')) window.Navigator.move('left');
                            else L.Controller.toggle('menu');
                        };
                    }
                    return add.call(this, name, controller);
                };
                var result;
                var normalStart = screen.start;
                try {
                    result = start.apply(this, arguments);
                } finally {
                    L.Controller.add = add;
                }
                if (screen.start !== normalStart) screen.start();
                return result;
            };

            return screen;
        }

        var style = document.createElement('style');
        style.textContent = [
            '.qseed-screen .explorer__left,.qseed-screen .qseed-no-history{display:none!important}',
            '.qseed-screen .explorer__files{width:100%!important}',
            '.qseed-screen .qseed-quick{display:flex;flex-wrap:wrap;margin-top:.5em}',
            '.qseed-screen .qseed-quick .simple-button{margin:.2em}',
            '.qseed-screen .qseed-active{background:#17658a;color:white}',
            '.qseed-screen .qseed-quick .focus,.selectbox-item.focus{background:#fff!important;color:#111!important}',
            '.selectbox-item.focus .selectbox-item__checkbox{filter:invert(1)}',
            '.qseed-screen .qseed-zero{color:#ff5252}',
            '.qseed-screen .qseed-many{color:#48e780;font-weight:bold}',
            '.qseed-screen .qseed-bitrate{color:#ff9a46;font-weight:bold}',
            '.qseed-screen .qseed-tracker{color:#caa0ec;font-weight:bold}',
            '.qseed-screen .qseed-badge{background:#565d65;color:white;font-weight:bold}',
            '.qseed-screen .qseed-rank-3{background:#a93226}',
            '.qseed-screen .qseed-rank-2{background:#21618c}',
            '.qseed-screen .qseed-rank-1{background:#117864}'
        ].join('');
        document.head.appendChild(style);
        L.Component.add('torrents', Torrents);
        window.plugin_torrents_qseed = true;
    }

    install();
})();


