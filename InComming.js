// ==UserScript==
// @name          InComming.js
// @version       0.1
// @description   Loads Next Page On a single one.
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @run-at        document-start
// @updateURL     https://raw.githubusercontent.com/onenyon/InComming.js/master/InComming.js
// ==/UserScript==    

var $ = unsafeWindow.jQuery;

(function( $ ){
   $.fn.inComming = function(urlRx) {
      alert('hello world '+urlRx);
      return this;
   }; 
})( jQuery );

$('https://yande.re/post').inComming()