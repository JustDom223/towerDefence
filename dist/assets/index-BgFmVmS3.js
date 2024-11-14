var tt=Object.defineProperty;var et=(s,t,e)=>t in s?tt(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var o=(s,t,e)=>et(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const h of a.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&i(h)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();class w{constructor(t,e={x:0,y:0}){o(this,"size");o(this,"width");o(this,"height");o(this,"health");o(this,"maxHealth");o(this,"speed");o(this,"position");o(this,"waypointIndex");o(this,"path");o(this,"spawnOffsetMagnitude");o(this,"spawnOffsetDirection");o(this,"spawnOffset");o(this,"isDefeated");o(this,"points");o(this,"value");this.size=50,this.width=this.size,this.height=this.size,this.health=100,this.maxHealth=100,this.speed=1,this.position={x:t[0].x+e.x,y:t[0].y+e.y},this.waypointIndex=0,this.path=t,this.spawnOffsetMagnitude=Math.hypot(e.x,e.y),this.spawnOffsetDirection=e.x>=0?1:-1,this.isDefeated=!1,this.points=10,this.value=1,this.spawnOffset={x:0,y:0}}update(){if(this.isAtEnd()){this.isDefeated=!0;return}const t=this.path[this.waypointIndex],e=this.path[this.waypointIndex+1],i=e.x-t.x,n=e.y-t.y,a=Math.hypot(i,n),h=i/a,p=-(n/a),x=h;this.spawnOffset={x:this.spawnOffsetMagnitude*p*this.spawnOffsetDirection,y:this.spawnOffsetMagnitude*x*this.spawnOffsetDirection};const f=e.x+this.spawnOffset.x,c=e.y+this.spawnOffset.y,d=f-this.position.x,v=c-this.position.y,y=Math.hypot(d,v);y<this.speed?(this.position.x=f,this.position.y=c,this.waypointIndex++):(this.position.x+=d/y*this.speed,this.position.y+=v/y*this.speed),this.health<=0&&(this.isDefeated=!0)}isAtEnd(){return this.waypointIndex>=this.path.length-1}render(t){t.fillStyle="red",t.fillRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height),t.strokeStyle="black",t.lineWidth=1,t.strokeRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height),this.renderHealthBar(t)}renderHealthBar(t){const e=this.width,i=5,n=this.position.x-e/2,a=this.position.y-this.height/2-10;t.fillStyle="black",t.fillRect(n,a,e,i),t.fillStyle="green",t.fillRect(n,a,e*(this.health/this.maxHealth),i)}}class I extends w{constructor(t,e={x:0,y:0}){super(t,e),this.size=25,this.width=this.size,this.height=this.size,this.speed=2,this.health=75,this.maxHealth=75,this.points=15,this.value=.5}render(t){t.fillStyle="orange",t.fillRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height),t.strokeStyle="black",t.lineWidth=1,t.strokeRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height),this.renderHealthBar(t)}}class b extends w{constructor(t,e={x:0,y:0}){super(t,e),this.size=75,this.width=this.size,this.height=this.size,this.speed=.7,this.health=200,this.maxHealth=200,this.points=30,this.value=2}render(t){t.fillStyle="purple",t.fillRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height),t.strokeStyle="black",t.lineWidth=1,t.strokeRect(this.position.x-this.width/2,this.position.y-this.height/2,this.width,this.height),this.renderHealthBar(t)}}class st{constructor(t,e,i,n,a){o(this,"x");o(this,"y");o(this,"target");o(this,"damage");o(this,"speed");o(this,"radius");o(this,"context");o(this,"isExpired");this.x=t,this.y=e,this.target=i,this.damage=n,this.speed=5,this.radius=3,this.context=a,this.isExpired=!1}update(){const t=this.target.position.x-this.x,e=this.target.position.y-this.y,i=Math.sqrt(t**2+e**2);i<this.speed?(this.target.health-=this.damage,this.isExpired=!0,this.target.health<=0&&(this.target.isDefeated=!0)):(this.x+=t/i*this.speed,this.y+=e/i*this.speed)}render(){this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,0,Math.PI*2),this.context.fillStyle="black",this.context.fill()}}const it=20,K=32,Z=0,T=100,j=100,W=[[{x:20,y:0},{x:20,y:20},{x:80,y:20},{x:80,y:40},{x:20,y:40},{x:20,y:60},{x:80,y:60},{x:80,y:100}]];class nt{constructor(t,e,i,n){o(this,"x");o(this,"y");o(this,"range");o(this,"fireRate");o(this,"fireTimer");o(this,"context");o(this,"enemies");o(this,"damage");this.x=t,this.y=e,this.range=150,this.fireRate=65,this.fireTimer=0,this.context=i,this.enemies=n,this.damage=25}update(t){if(this.fireTimer<=0){const e=this.getEnemyClosestToExit();e&&(t.push(new st(this.x,this.y,e,this.damage,this.context)),this.fireTimer=this.fireRate)}else this.fireTimer--}render(){this.context.fillStyle="blue",this.context.fillRect(this.x-T/2,this.y-T/2,T,T)}getNearestEnemy(){let t=null,e=this.range;for(let i of this.enemies){const n=i.position.x-this.x,a=i.position.y-this.y,h=Math.hypot(n,a);h<e&&(e=h,t=i)}return t}getEnemyWithMostHealth(){let t=null,e=-1/0;for(let i of this.enemies){const n=i.position.x-this.x,a=i.position.y-this.y;Math.hypot(n,a)<=this.range&&i.health>e&&(e=i.health,t=i)}return t}getEnemyWithLeastHealth(){let t=null,e=1/0;for(let i of this.enemies){const n=i.position.x-this.x,a=i.position.y-this.y;Math.hypot(n,a)<=this.range&&i.health<e&&(e=i.health,t=i)}return t}getEnemyClosestToExit(){let t=null,e=-1/0;for(let i of this.enemies){const n=i.position.x-this.x,a=i.position.y-this.y;Math.hypot(n,a)<=this.range&&i.waypointIndex>e&&(e=i.waypointIndex,t=i)}return t}}const H=[{number:1,spawnGroups:[{class:w,count:10,spawnInterval:1e3,startDelay:0}]},{number:2,spawnGroups:[{class:w,count:12,spawnInterval:900,startDelay:0},{class:I,count:5,spawnInterval:800,startDelay:2e3}]},{number:3,spawnGroups:[{class:b,count:3,spawnInterval:1500,startDelay:0},{class:I,count:7,spawnInterval:700,startDelay:3e3},{class:w,count:15,spawnInterval:1e3,startDelay:5e3}]},{number:4,spawnGroups:[{class:w,count:15,spawnInterval:900,startDelay:0},{class:I,count:10,spawnInterval:600,startDelay:2500},{class:b,count:4,spawnInterval:1200,startDelay:4e3}]},{number:5,spawnGroups:[{class:I,count:15,spawnInterval:500,startDelay:0},{class:b,count:5,spawnInterval:1100,startDelay:0},{class:w,count:20,spawnInterval:800,startDelay:6e3},{class:I,count:15,spawnInterval:10,startDelay:4e3}]},{number:6,spawnGroups:[{class:w,count:20,spawnInterval:850,startDelay:4e3},{class:I,count:12,spawnInterval:550,startDelay:2e3},{class:b,count:6,spawnInterval:1e3,startDelay:0}]},{number:7,spawnGroups:[{class:I,count:20,spawnInterval:450,startDelay:5e3},{class:b,count:7,spawnInterval:900,startDelay:2500},{class:w,count:25,spawnInterval:700,startDelay:0}]},{number:8,spawnGroups:[{class:w,count:25,spawnInterval:800,startDelay:0},{class:I,count:15,spawnInterval:500,startDelay:4e3},{class:b,count:8,spawnInterval:800,startDelay:2e3}]},{number:9,spawnGroups:[{class:I,count:25,spawnInterval:400,startDelay:0},{class:b,count:10,spawnInterval:700,startDelay:2500},{class:w,count:30,spawnInterval:600,startDelay:5e3}]},{number:10,spawnGroups:[{class:w,count:35,spawnInterval:500,startDelay:2e3},{class:I,count:20,spawnInterval:350,startDelay:3e3},{class:b,count:12,spawnInterval:600,startDelay:4500}]}];let u={x:0,y:0,visible:!1,color:"rgba(0, 0, 255, 0.3)"};function at(s,t){const{gold:e,deductGold:i,addTower:n,isOnPath:a,isOnTower:h,isGameActive:m}=t;let p=!1;function x(f){return f-20}s.addEventListener("mousemove",function(f){if(p)return;if(!m()){u.visible=!1;return}const c=s.getBoundingClientRect(),d=s.width/c.width,v=s.height/c.height,y=(f.clientX-c.left)*d,g=(f.clientY-c.top)*v;u.x=y,u.y=g;const O=!a(y,g)&&!h(y,g);u.visible=!0,u.color=O?"rgba(0, 255, 0, 0.3)":"rgba(255, 0, 0, 0.3)"}),s.addEventListener("click",function(f){if(p||!m())return;const c=s.getBoundingClientRect(),d=s.width/c.width,v=s.height/c.height,y=(f.clientX-c.left)*d,g=(f.clientY-c.top)*v;!a(y,g)&&!h(y,g)?e.value>=10?(n(y,g),i(10)):console.log("Not enough gold"):console.log("Cannot place here")}),s.addEventListener("touchstart",function(f){if(p=!0,f.preventDefault(),!m()){u.visible=!1;return}const c=f.touches[0],d=s.getBoundingClientRect(),v=s.width/d.width,y=s.height/d.height,g=(c.clientX-d.left)*v,O=(c.clientY-d.top)*y;u.x=g,u.y=x(O);const F=!a(g,u.y)&&!h(g,u.y);u.visible=!0,u.color=F?"rgba(0, 255, 0, 0.3)":"rgba(255, 0, 0, 0.3)"},{passive:!1}),s.addEventListener("touchmove",function(f){if(!p)return;if(f.preventDefault(),!m()){u.visible=!1;return}const c=f.touches[0],d=s.getBoundingClientRect(),v=s.width/d.width,y=s.height/d.height,g=(c.clientX-d.left)*v,O=(c.clientY-d.top)*y;u.x=g,u.y=x(O);const F=!a(g,u.y)&&!h(g,u.y);u.color=F?"rgba(0, 255, 0, 0.3)":"rgba(255, 0, 0, 0.3)"},{passive:!1}),s.addEventListener("touchend",function(f){if(!p||(f.preventDefault(),!m()))return;const c=u.x,d=u.y;!a(c,d)&&!h(c,d)?e.value>=10?(n(c,d),i(10)):console.log("Not enough gold"):console.log("Cannot place here"),u.visible=!1,p=!1},{passive:!1})}function lt(){return u}const r=document.getElementById("gameCanvas"),l=r.getContext("2d");function ot(){r.width=1080,r.height=1920}ot();window.addEventListener("resize",()=>{Y=$(N)});const L={value:K};let C=Z,G,N,Y,D,P,E,k,A,z,S,X,R,M,B;function J(){G=Math.floor(Math.random()*W.length),N=W[G],Y=$(N),D=[],P=[],E=[],k=it,C=Z,L.value=K,A=!1,z=!1,S=0,X=!1,R=2e3,M=[],B=Date.now()}J();function $(s){return s.map(t=>({x:t.x/100*r.width,y:t.y/100*r.height}))}function rt(s,t){const e=s[1].x-s[0].x,i=s[1].y-s[0].y,n=Math.hypot(e,i),a=-i/n,h=e/n,p=j/2-t/2,x=-p,f=Math.random()*(p-x)+x,c=f>=0?1:-1,d=Math.abs(f);return{x:d*a*c,y:d*h*c}}function ht(s,t,e,i,n,a){const h=(n-e)**2+(a-i)**2;if(h===0)return Math.hypot(s-e,t-i);let m=((s-e)*(n-e)+(t-i)*(a-i))/h;m=Math.max(0,Math.min(1,m));const p=e+m*(n-e),x=i+m*(a-i);return Math.hypot(s-p,t-x)}function q(){if(S>=H.length){z=!0,A=!0,Q();return}const s=H[S];console.log(`Starting Wave ${s.number}`),M=s.spawnGroups.map(t=>({class:t.class,remainingCount:t.count,spawnInterval:t.spawnInterval,spawnTimer:t.startDelay,active:!1})),X=!0}function ct(s){if(!X){R>0&&(R-=s,R<=0&&q());return}M.slice().forEach((t,e)=>{if(!t.active)t.spawnTimer-=s,t.spawnTimer<=0&&(t.active=!0,t.spawnTimer=t.spawnInterval,console.log(`SpawnGroup started: ${t.class.name}, Count: ${t.remainingCount}`));else if(t.spawnTimer-=s,t.spawnTimer<=0&&t.remainingCount>0){let i;t.class===w?i=20:t.class===I?i=10:t.class===b?i=30:i=20;const n=rt(Y,i);D.push(new t.class(Y,n)),t.remainingCount--,t.spawnTimer=t.spawnInterval,console.log(`Spawned ${t.class.name}. Remaining: ${t.remainingCount}`),t.remainingCount<=0&&(M.splice(e,1),console.log(`SpawnGroup completed: ${t.class.name}`))}}),M.length===0&&D.length===0&&ft()}function ft(){X=!1,R=2e3,S++,console.log(`Wave ${S} completed.`)}function dt(){const s=["gray","orange","purple","cyan"];l.lineWidth=j,l.lineCap="round",W.forEach((t,e)=>{const i=$(t);l.strokeStyle=s[e%s.length],l.beginPath(),l.moveTo(i[0].x,i[0].y);for(let n=1;n<i.length;n++)l.lineTo(i[n].x,i[n].y);l.stroke()})}function _(){const s=Date.now(),t=s-B;B=s,A?(V(),z?Q():pt()):(ut(t),V(),requestAnimationFrame(_))}function ut(s){ct(s);for(let t of D)t.update();for(let t=D.length-1;t>=0;t--){const e=D[t];e.isDefeated&&(e.health<=0?(C+=e.points,L.value+=e.value):(k--,k<=0&&(A=!0)),D.splice(t,1))}for(let t of P)t.update(E);for(let t of E)t.update();for(let t=E.length-1;t>=0;t--)E[t].isExpired&&E.splice(t,1)}function V(){l.clearRect(0,0,r.width,r.height),dt();for(let t of P)t.render();for(let t of D)t.render(l);for(let t of E)t.render();l.fillStyle="black",l.font="20px Arial",l.textAlign="left",l.fillText(`Lives: ${k}`,10,30),l.fillText(`Score: ${C}`,10,60),l.fillText(`Gold: ${L.value}`,10,90),l.fillText(`Wave: ${S<H.length?H[S].number:"N/A"}`,10,120),l.fillText(`Enemies Remaining: ${D.length}`,10,150);const s=lt();s.visible&&(l.fillStyle=s.color,l.fillRect(s.x-T/2,s.y-T/2,T,T))}function pt(){l.fillStyle="rgba(0, 0, 0, 0.7)",l.fillRect(0,0,r.width,r.height),l.fillStyle="white",l.font="40px Arial",l.textAlign="center",l.fillText("Game Over",r.width/2,r.height/2-40),l.font="20px Arial",l.fillText(`Final Score: ${C}`,r.width/2,r.height/2),l.fillText("Tap/Click to Restart",r.width/2,r.height/2+60),U()}function Q(){l.fillStyle="rgba(0, 0, 0, 0.7)",l.fillRect(0,0,r.width,r.height),l.fillStyle="white",l.font="40px Arial",l.textAlign="center",l.fillText("You Win!",r.width/2,r.height/2-40),l.font="20px Arial",l.fillText(`Final Score: ${C}`,r.width/2,r.height/2),l.fillText("Tap/Click to Restart",r.width/2,r.height/2+60),U()}function U(){const s=()=>{r.removeEventListener("click",s),r.removeEventListener("touchend",s),yt()};r.addEventListener("click",s),r.addEventListener("touchend",s)}function yt(){J(),D.length=0,P.length=0,E.length=0,l.clearRect(0,0,r.width,r.height),q(),requestAnimationFrame(_)}function gt(){return!A&&!z}function mt(s,t){P.push(new nt(s,t,l,D))}function wt(s){L.value-=s}at(r,{gold:L,deductGold:wt,addTower:mt,isOnPath:xt,isOnTower:vt,isGameActive:gt});q();requestAnimationFrame(_);function xt(s,t){const e=j/2,i=T/2;for(let n of W){const a=$(n);for(let h=0;h<a.length-1;h++){const m=a[h].x,p=a[h].y,x=a[h+1].x,f=a[h+1].y;if(ht(s,t,m,p,x,f)<e+i)return!0}}return!1}function vt(s,t){for(let e of P){const i=s-e.x,n=t-e.y;if(Math.hypot(i,n)<T)return!0}return!1}