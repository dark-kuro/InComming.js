// ==UserScript==
// @name          InComming.js
// @version       2.1
// @description   Loads Next Page On A Single One.
// @grant         unsafeWindow
// @run-at        document-start
// @include       *://nhentai.net/*
// ==/UserScript==

let container, nextURL, latch = false
const config = {
    'nhentai.net':{
        mainCSS:'div.container.index-container',
        nextURL:'a.next',
        run:null
    }
};
const host = window.location.host,
      fetchHTML = url =>fetch(url).then(x=>x.text()).then(html=>new DOMParser().parseFromString(html, 'text/html'));
function run(host){
    if(!nextURL){
        nextURL = document.querySelector(host.nextURL).href
    }

    fetchHTML(nextURL).then(doc=>{
        var items = doc.querySelectorAll(host.mainCSS + ' > *');
        container = document.querySelector(host.mainCSS);

        var urlBtn = document.createElement('a');
        urlBtn.href = nextURL;
        urlBtn.innerText = nextURL;
        urlBtn.style.width = '100%';
        urlBtn.style.display = 'inline-block';
        urlBtn.style.fontSize = '30px';
        urlBtn.style.backgroundColor = 'crimson';
        container.appendChild(urlBtn)

        items.forEach(i=>{
            var img = i.querySelector('img[data-src][is="lazyload-image"]');
            if(!img)return;
            img.src = img.getAttribute('data-src');
            container.appendChild(i);
        })
        if(host.run){
            host.run(doc)
        }

        nextURL = doc.querySelector(host.nextURL).href;
        latch=false;
    }).catch(e=>{
        console.error('Incomming.js ERROR', e)
        latch = false;
    })
    latch = false
}

(()=>{
    window.addEventListener("scroll", () => {
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        var scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight-1;

        if(scrolledToBottom){
            if(!latch){
                latch = true;
                run(config[host]);
            }
        }
    }, false);

})()
