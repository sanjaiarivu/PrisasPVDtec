(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var html = document.documentElement;
  var intro = document.getElementById('intro');
  var video = document.getElementById('introVideo');
  var introLogo = document.getElementById('introLogo');
  var navLogo = document.getElementById('navLogo');
  var transitioned = false;

  function initReveals(){
    var items = document.querySelectorAll('.reveal');
    if(reduceMotion || !('IntersectionObserver' in window)){
      items.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },{threshold:.18,rootMargin:'0px 0px -8% 0px'});
    items.forEach(function(el){io.observe(el);});
  }

  function revealSite(){
    navLogo.classList.add('visible');
    html.classList.add('site-revealed');
    document.body.style.overflow='';
    initReveals();
  }

  function flyLogoToNav(){
    var r1=introLogo.getBoundingClientRect();
    var r2=navLogo.getBoundingClientRect();
    var scale=r2.width/r1.width;
    var dx=(r2.left+r2.width/2)-(r1.left+r1.width/2);
    var dy=(r2.top+r2.height/2)-(r1.top+r1.height/2);

    intro.classList.add('flying');
    introLogo.style.transition='transform 900ms var(--ease)';
    introLogo.style.transformOrigin='center center';
    void introLogo.offsetWidth;
    introLogo.style.transform='translate('+dx+'px,'+dy+'px) scale('+scale+')';

    var done=false;
    function finish(){
      if(done)return;
      done=true;
      revealSite();
      intro.remove();
      // swap icon → full logo now that it has landed in the nav
      navLogo.src='Assests/fulllogo.png';
    }
    introLogo.addEventListener('transitionend',finish,{once:true});
    setTimeout(finish,1100);
  }

  function exitIntro(skipped){
    if(transitioned)return;
    transitioned=true;
    try{video.pause();}catch(e){}

    if(reduceMotion){
      intro.remove();
      revealSite();
      return;
    }

    if(skipped)intro.classList.add('instant');
    intro.classList.add('crossfade');

    var wait=skipped?60:520;
    setTimeout(function(){
      intro.classList.remove('instant');
      flyLogoToNav();
    },wait);
  }

  if(reduceMotion){
    exitIntro(true);
  }else{
    video.addEventListener('ended',function(){exitIntro(false);});
    var playPromise=video.play();
    if(playPromise&&playPromise.catch){
      playPromise.catch(function(){exitIntro(true);});
    }
  }

  var navToggle=document.getElementById('navToggle');
  var navPanel=document.getElementById('navPanel');

  navToggle.addEventListener('click',function(){
    var open=navPanel.classList.toggle('open');
    navToggle.setAttribute('aria-expanded',open?'true':'false');
  });

  navPanel.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){navPanel.classList.remove('open');});
  });
})();
