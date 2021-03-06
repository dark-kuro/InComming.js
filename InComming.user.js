// ==UserScript==
// @name          InComming.js
// @version       1.1
// @description   Loads Next Page On a single one.
// @grant         unsafeWindow
// @run-at        document-start
// @match         http://*
// @match         https://*
// @include       https://yande.re/post*
// @include       http://danbooru.donmai.us/posts*
// @include       http://konachan.*/post*
// @include       https://gelbooru.com/index.php?page=post&s=list*
// @require       https://code.jquery.com/jquery-3.2.1.min.js
// @updateURL     https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// @downloadURL   https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// ==/UserScript==

function run($) {
    if (/danbooru/.test(location.href)) {
        $({
            link: 'a[rel="next"]',
            select: "article"
        }).inComming();
    } else if (/gelbooru/.test(location.href)) {
        $({
            link: 'a[alt="next"]',
            select: "div.thumbnail-preview"
        }).inComming(function(o) {
            var img = o.find('img.lazyload.preview').each(function() {
                $this = $(this);
                $this.attr('src', $this.attr('data-original'));
            });

        });
        return;
    } else {
        $({
            link: 'a.next_page',
            select: 'ul#post-list-posts li'
        }).inComming(function(o) {
            o.find('.javascript-hide').removeClass();
            o.find('img[width][height]').removeAttr("width height");
            o.find('li[style*="width"], .inner[style]').removeAttr("style");
        });
    }
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
        this.html = $(elementCss);
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
        return $.get(url, function(html) {
            _html = new Doc(html);
            var next = _html.href,
                content = $(html).find($select);
            $doc = new Doc(document);

            console.log(content, '<<<=============');

            content.appendTo($parent);
            console.log(next, url);
            $next = next;
            $callback($doc);
        }).done(function() {
            $trigger = false;
        });
    }
    nextAjax($url);

    console.log('INJECTING... to ', $(this));

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            console.log('NEAR BOTTOM');

            if (!$trigger) {
                $trigger = true;
                $('<div/>', {
                    style: 'display:inline-block !important'
                }).appendTo($parent).css({
                    backgroundColor: 'red',
                    width: '100%',
                    fontSize: 'xx-large',
                    textAlign: 'center'
                }).append($('<a>', {
                    text: $next,
                    title: 'The Page',
                    href: $next
                }));


                nextAjax($next);
                console.log($trigger);
            }
        }
    });
});
