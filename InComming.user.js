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
// @include       http://konachan.com/post*
// @updateURL     https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// @downloadURL   https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// ==/UserScript==

function run($) {
    $({
        link: 'a.next_page',
        content: 'ul#post-list-posts li'
    }).inComming(function(o) {
        o.find('.javascript-hide').removeClass();
        // o.find('img[width][height]').removeAttr("width height");
        // o.find('li[style*="width"], .inner[style]').removeAttr("style");
    });
}


(function(plugin) {
    function GM_wait() {
        if (typeof unsafeWindow.jQuery == 'undefined')
            window.setTimeout(GM_wait, 100);
        else
            unsafeWindow.jQuery(function() {
                if (typeof plugin === 'function') unsafeWindow.jQuery.fn[plugin.name] = plugin;
                run(unsafeWindow.jQuery);
            });
    }
    GM_wait();
})(function inComming(callback) {
    var $link = this.attr('link'),
        $select = this.attr('select') || 'body',
        $callback = function(doc) {
            if (typeof callback === 'function') callback(doc);
        };
    if (!$link) return;

    var Doc = function(elementCss) {
        this.raw = elementCss;
        this.html = jQuery(elementCss);
        this.find = function(css) {
            return this.html.find(css);
        };
        this.href = this.find($link).attr('href');
    };

    var $doc = new Doc(document),
        $parent = $doc.find($select).parent(),
        $trigger = false,
        $url = (typeof $link === 'function') ? $link($doc) : $doc.href,
        $next = $url;
    console.log($doc, $parent, $trigger, $url);

    function nextAjax(url) {
        $.get(url, function(html) {
            html = new Doc(html);
            var next = html.href,
                content = html.find($select);
            $doc = new Doc(document);

            console.log(html);

            content.appendTo($parent);
            $callback($doc);
            $trigger = false;
        });
    };
    nextAjax($url);

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
});