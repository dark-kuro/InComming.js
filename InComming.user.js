// ==UserScript==
// @name          InComming.js
// @version       1.1
// @description   Loads Next Page On a single one.
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant         unsafeWindow
// @run-at        document-start
// @match         http://*
// @match         https://*
// @include       https://yande.re/post*
// @updateURL     https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// @downloadURL   https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// ==/UserScript==


function main($) {
    $.inComming({
        link: 'a.next_page',
        content: 'ul#post-list-posts li'
    }).load(function(o) {
        o.find('.javascript-hide').removeClass();
        o.find('img[width][height]').removeAttr("width height");
        o.find('li[style*="width"], .inner[style]').removeAttr("style");
    });
}

(function() {
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined')
            window.setTimeout(GM_wait, 100);
        else
            unsafeWindow.jQuery(function() {
                letsJQuery(unsafeWindow.jQuery);
            });
    }
    GM_wait();

    function letsJQuery($) {
        $.inComming = function(rule) {
            var $doc = $url = callback = next = $next = null,
                $trigger = false;
            $.extend({
                link: null,
                content: 'body'
            }, rule);
            if (!rule.link) return;

            var obj = {
                load: function(_callback) {
                    if (!callback) callback = _callback;
                    else if ($doc && callback) callback($doc);
                }
            };
            return (function() {
                var nextAjax = function(url) {
                    $.get(url, function(html) {
                        html = $(html);
                        next = html.find(rule.link).attr('href');
                        content = html.find(rule.content);
                        $doc = $(document);

                        content.appendTo(parent);

                        $('<div/>', {
                            text: next,
                            style: 'display:inline-block !important'
                        }).appendTo(parent).css({
                            background: 'red',
                            width: '100%',
                            fontSize: 'xx-large'
                        });

                        console.log(next, url);
                        $next = next;

                        obj.load($doc);
                        $trigger = false;
                    });
                }

                console.log('INJECTING... to ', $(this));

                $(window).scroll(function() {
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                        console.log('NEAR BOTTOM');

                        if (!$trigger) {
                            $trigger = true;
                            nextAjax($next);
                            console.log($trigger);
                        }
                    }
                });

                $doc = $(document);
                if (typeof(rule.link) === 'function') $url = rule.link($doc);
                else $url = $doc.find(rule.link).attr('href');

                var parent = $doc.find(rule.content).parent();

                $('<div/>', {
                    text: $url,
                    style: 'display:inline-block !important'
                }).appendTo(parent).css({
                    background: 'red',
                    width: '100%',
                    fontSize: 'xx-large'
                });

                nextAjax($url);

                console.log("init", rule.link, $url);

                return obj;
            })();
        };
        main($);
    }
})();