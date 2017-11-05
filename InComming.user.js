// ==UserScript==
// @name          InComming.js
// @version       0.3b
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
    $({
        link: 'a.next_page',
        select: 'ul#post-list-posts li'
    }).inComming(function(o) {
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
        $.fn.inComming = function(callback) {
            $(function() {

                if (!this.link) return;
                var $this = this,
                    $trigger = false;
                var select = $this.select || 'body';
                var getHref = function(doc) {
                    return doc.find($this.link).attr('href');
                }

                var $doc = $(document),
                    $parent = $doc.find(select).parent(),
                    $url = null,
                    $nextLoad = function(html) {
                        html = $(html);
                        next = getHref(html);
                        content = html.find(select);
                        content.appendTo($parent);

                        console.log(next, url);
                        $next = next;

                        $trigger = false;
                        callback($doc);
                    };

                if (typeof $this.link === 'function') $url = $this.link($doc);
                else $url = getHref($this.link);

                $('<div/>', {
                    text: $url,
                    style: 'display:inline-block !important'
                }).appendTo($parent).css({
                    background: 'red',
                    width: '100%',
                    textAlign: 'center',
                    fontSize: 'xx-large'
                });

                callback($doc);
                $.get($url, nextLoad);

            })
        };
        main($);
    }
})();