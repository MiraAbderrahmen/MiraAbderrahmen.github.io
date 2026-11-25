(function(){
  var root=document.documentElement;
  var stored=null; try{stored=localStorage.getItem('theme');}catch(e){}
  if(stored==='light'||stored==='dark') root.setAttribute('data-theme',stored);
  document.getElementById('themeBtn').addEventListener('click',function(){
    var cur=root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    var next=cur==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next);}catch(e){}
  });

  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* log reveal: one orchestrated load moment */
  var rows=document.querySelectorAll('#log .row');
  rows.forEach(function(r,i){ if(reduce){r.classList.add('in');} else setTimeout(function(){r.classList.add('in');},350+i*260); });

  /* stream canvas */
  var cv=document.getElementById('stream'), ctx=cv.getContext('2d'), W=0,H=0,dpr=1;
  var lanes=3, recs=[];
  function css(n){return getComputedStyle(root).getPropertyValue(n).trim();}
  function size(){dpr=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  function spawn(x){var l=Math.floor(Math.random()*lanes);recs.push({x:x,l:l,w:10+Math.random()*16,v:.6+Math.random()*.9+l*.15,hot:Math.random()<.06});}
  size(); for(var i=0;i<34;i++) spawn(Math.random()*W);
  window.addEventListener('resize',size);
  function draw(){
    ctx.clearRect(0,0,W,H);
    var lh=H/lanes, lane=css('--lane'), acc=css('--accent'), ev=css('--event'), mu=css('--muted');
    ctx.font='11px "IBM Plex Mono", monospace';
    for(var l=0;l<lanes;l++){
      var y=l*lh+lh/2;
      ctx.fillStyle=lane; ctx.beginPath(); ctx.roundRect?ctx.roundRect(54,y-9,W-54,18,9):ctx.rect(54,y-9,W-54,18); ctx.fill();
      ctx.fillStyle=mu; ctx.fillText('p'+l,4,y+4);
    }
    recs.forEach(function(r){
      var y=r.l*lh+lh/2;
      if(r.x<54) return;
      ctx.fillStyle=r.hot?ev:acc; ctx.globalAlpha=r.hot?1:.75;
      ctx.beginPath(); ctx.roundRect?ctx.roundRect(r.x,y-5,r.w,10,5):ctx.rect(r.x,y-5,r.w,10); ctx.fill();
    });
    ctx.globalAlpha=1;
  }
  function tick(){
    recs.forEach(function(r){r.x+=r.v;});
    recs=recs.filter(function(r){return r.x<W+30;});
    while(recs.length<34) spawn(20+Math.random()*30);
    draw();
    if(!document.hidden) requestAnimationFrame(tick); else setTimeout(function(){requestAnimationFrame(tick);},400);
  }
  if(reduce) draw(); else requestAnimationFrame(tick);
  if(reduce) window.addEventListener('resize',draw);
  var mq=matchMedia('(prefers-color-scheme: dark)'); if(mq.addEventListener) mq.addEventListener('change',draw);

  /* pipeline stages */
  var stages=[
    {k:'Sources',t:'Systems of record',d:'Operational data starts in Oracle and PostgreSQL databases, plus external APIs and file drops. The platform treats every one of them as a source of events.',tools:['Oracle','PostgreSQL','REST APIs','Files']},
    {k:'Ingest',t:'Change data capture and loaders',d:'Kafka Connect with Debezium captures every database change as it happens. PySpark streaming and batch jobs pick up the APIs and files.',tools:['Kafka','Kafka Connect','Debezium','PySpark']},
    {k:'Bronze',t:'Raw, replayable history',d:'Records land unchanged in the Bronze layer, so any table further down can be rebuilt from the original data.',tools:['Kafka topics','Raw tables']},
    {k:'Silver',t:'Cleaned and enriched',d:'PySpark transformation jobs clean, join and enrich the raw data into Silver-layer tables in ClickHouse.',tools:['PySpark','ClickHouse']},
    {k:'Gold',t:'Ready for BI',d:'Analytical models are built with dbt and ClickHouse materialized views, shaped for fast dashboard queries.',tools:['dbt','ClickHouse','Materialized views']},
    {k:'Operate',t:'Orchestrated and observed',d:'Apache Airflow schedules the workflows. Everything runs in containers on Kubernetes, with Prometheus and Grafana watching health and throughput.',tools:['Airflow','Kubernetes','Docker','Prometheus','Grafana']}
  ];
  var pipe=document.getElementById('pipe'), pT=document.getElementById('pTitle'), pD=document.getElementById('pText'), pL=document.getElementById('pTools');
  var btns=stages.map(function(s,i){
    var b=document.createElement('button');
    b.className='stage'+(s.k==='Bronze'?' bronze':''); b.type='button'; b.setAttribute('role','tab'); b.id='stage-'+i;
    b.innerHTML='<span class="dot">'+(i+1)+'</span><span class="nm">'+s.k+'</span>';
    b.addEventListener('click',function(){select(i);});
    b.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();select((i+1)%stages.length,true);}
      if(e.key==='ArrowLeft'){e.preventDefault();select((i+stages.length-1)%stages.length,true);}
    });
    pipe.appendChild(b); return b;
  });
  function select(i,focus){
    btns.forEach(function(b,j){b.setAttribute('aria-selected',j===i?'true':'false');b.tabIndex=j===i?0:-1;});
    var s=stages[i]; pT.textContent=s.t; pD.textContent=s.d;
    pL.innerHTML=''; s.tools.forEach(function(t){var li=document.createElement('li');li.textContent=t;pL.appendChild(li);});
    document.getElementById('panel').setAttribute('aria-labelledby','stage-'+i);
    if(focus) btns[i].focus();
  }
  select(1);

  /* copy email */
  document.getElementById('copyBtn').addEventListener('click',function(){
    var out=document.getElementById('copied'), em='abderrahmen.mira@gmail.com';
    function ok(){out.textContent='Email copied';setTimeout(function(){out.textContent='';},2500);}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(em).then(ok,function(){out.textContent=em;});}
    else out.textContent=em;
  });
})();
