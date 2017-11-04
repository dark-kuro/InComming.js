// ==UserScript==
// @name          InComming.js
// @version       0.5
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

const $ = jQuery = unsafeWindow.jQuery;

(function($) {
    $.fn.inComming = function(urlRx) {
        $(function() {
            console.log("ready!");
            alert('hello world ' + urlRx);
        });
        return {
            load: function(callback) {
                callback($(document));
            }
        };
    };
})(jQuery);

$('https://yande.re/post').inComming('hohohho')