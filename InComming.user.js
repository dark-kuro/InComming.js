// ==UserScript==
// @name          InComming.js
// @version       0.2b
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
        content: 'ul#post-list-posts li'
    }).inComming();
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
            var next = this.link,
                content = this.content || 'body';
            console.log(next, content, '<=== this is the object');
        };
        main($);
    }
})();