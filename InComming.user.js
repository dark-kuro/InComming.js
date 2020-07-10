// ==UserScript==
// @name          InComming.js
// @version       2.2
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
const createNextPageButton = (nextURL)=>{
      const link = document.createElement('a');
            link.href = nextURL;
            link.innerText = nextURL;
            link.style.width = '100%';
            link.style.display = 'inline-block';
            link.style.fontSize = '30px';
            link.style.backgroundColor = 'crimson';
        return link;
    };

function run(host){
    if(!nextURL){
        nextURL = document.querySelector(host.nextURL).href
    }

    fetchHTML(nextURL).then(doc=>{
        var items = doc.querySelectorAll(host.mainCSS + ' > div.gallery');
        container = document.querySelector(host.mainCSS);
        const nextUrlBtn = createNextPageButton(nextURL)

        container.appendChild(nextUrlBtn)

        items.forEach(i=>{
            var img = i.querySelector('img.lazyload[data-src]');
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

const isScrollAtEnd = ()=>{
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight-1;
        return scrolledToBottom;
};

(()=>{
    window.addEventListener("scroll", () => {
        if(isScrollAtEnd()){
            if(!latch){
                latch = true;
                run(config[host]);
            }
        }
    }, false);

})()
