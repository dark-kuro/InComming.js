// ==UserScript==
// @name          InComming.js
// @version       0.2
// @description   Loads Next Page On a single one.
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant         unsafeWindow
// @run-at        document-start
// @updateURL     https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.meta.js
// @downloadURL   https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.user.js
// ==/UserScript==    

var $ = unsafeWindow.jQuery;

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