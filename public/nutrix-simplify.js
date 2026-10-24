(function(){
'use strict';
function accordion(el,label,sub,icon){
  if(!el||el.classList.contains('nx-acc'))return null;
  el.classList.add('nx-acc');
  const b=document.createElement('button');b.type='button';b.className='nx-acc-toggle';if(icon){b.classList.add('nx-acc-rich');b.innerHTML='<i class="nx-ico">'+icon+'</i><span class="nx-acc-txt"><b>'+label+'</b><small>'+(sub||'')+'</small></span>';}else b.textContent=label;
  b.addEventListener('click',()=>el.classList.toggle('open'));
  el.insertBefore(b,el.firstChild);return el;
}
function go(tab){ if(typeof window.showTab==='function')window.showTab(tab); else document.querySelector('#pulse-nav-links .tab[data-tab="'+tab+'"]')?.click(); window.scrollTo({top:0,behavior:'smooth'}); }
function simplifyNav(){
  const nav=document.getElementById('pulse-nav-links');if(!nav||nav.dataset.nxSimple)return;nav.dataset.nxSimple='1';
  const ar=()=>document.documentElement.lang==='ary';
  const health=nav.querySelector('.tab[data-tab="health"]');
  if(health){const lab=health.querySelector('.pulse-nav-label');if(lab){const set=()=>{if(lab.textContent!=='Journal')lab.textContent='Journal';};set();new MutationObserver(set).observe(lab,{childList:true,characterData:true,subtree:true});}health.setAttribute('aria-label','Mon journal');health.setAttribute('data-short','Journal');health.title='Mon journal';}
  const coach=nav.querySelector('.tab[data-tab="ai"]');
  if(coach){const lab=coach.querySelector('.pulse-nav-label');if(lab)lab.textContent='Coach';}
  ['journal','studio','faq'].forEach(t=>nav.querySelector('.tab[data-tab="'+t+'"]')?.classList.add('nx-nav-hidden'));
  const more=document.createElement('button');more.type='button';more.className='nx-more-btn';more.setAttribute('aria-haspopup','true');more.setAttribute('aria-expanded','false');
  more.innerHTML='<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg><span class="pulse-nav-label">Plus</span>';
  nav.appendChild(more);
  const sheet=document.createElement('div');sheet.className='nx-more-sheet';sheet.hidden=true;
  sheet.innerHTML='<button type="button" data-go="journal">🔎 <span><b>Découvrir</b><small>Chercher un produit, favoris, science</small></span></button><button type="button" data-go="studio">🎨 <span><b>Studio</b><small>Outils créatifs Nutrix</small></span></button><button type="button" data-go="faq">ℹ️ <span><b>À propos</b><small>Le projet Nutrix</small></span></button>';
  document.body.appendChild(sheet);
  const close=()=>{sheet.hidden=true;more.setAttribute('aria-expanded','false');};
  more.addEventListener('click',e=>{e.stopPropagation();sheet.hidden=!sheet.hidden;more.setAttribute('aria-expanded',String(!sheet.hidden));});
  sheet.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){go(b.dataset.go);close();}});
  document.addEventListener('click',e=>{if(!sheet.hidden&&!sheet.contains(e.target))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
}
function simplifyHome(){
  const cta=document.querySelector('.pulse-hero-cta');if(!cta||cta.dataset.nxSimple)return;cta.dataset.nxSimple='1';
  const sub=document.querySelector('.pulse-hero-sub');if(sub)sub.textContent='Scanne un produit ou note ton repas : on te dit si c’est un bon choix.';
  cta.innerHTML='<button type="button" class="nx-big nx-big-primary" id="nx-go-scan"><i class="nx-ico"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M8 9v6M11 9v6M14 9v6M17 9v6" stroke-width="1.8"/></svg></i><span class="nx-big-txt"><b>Scanner un produit</b><small>Code-barres ou photo</small></span></button><button type="button" class="nx-big nx-big-secondary" id="nx-go-meal"><i class="nx-ico"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M17 3c-2.2 1.4-3 3.8-3 6.5 0 1.9 1 2.9 3 3v8.5"/></svg></i><span class="nx-big-txt"><b>Ajouter un repas</b><small>Suivre mes calories</small></span></button>';
  document.getElementById('nx-go-scan').addEventListener('click',()=>go('nutri'));
  document.getElementById('nx-go-meal').addEventListener('click',()=>{go('health');setTimeout(()=>{const d=document.getElementById('nh-existing');if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}},350);});
}

function robotMarkup(id){return '<svg class="nx-robot" viewBox="0 0 80 96" aria-hidden="true" focusable="false"><defs><linearGradient id="nxRH__ID__" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#0d9488"/></linearGradient><linearGradient id="nxRB__ID__" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34d399"/><stop offset="1" stop-color="#047857"/></linearGradient></defs><ellipse class="nx-r-shadow" cx="40" cy="92" rx="20" ry="3.2" fill="#000" opacity=".18"/><g class="nx-r-float"><g class="nx-r-ant"><line x1="40" y1="8" x2="40" y2="20" stroke="#0f766e" stroke-width="3" stroke-linecap="round"/><circle class="nx-r-bulb" cx="40" cy="7" r="5" fill="#fbbf24"/></g><rect x="12" y="38" width="6" height="14" rx="3" fill="#0f766e"/><rect x="62" y="38" width="6" height="14" rx="3" fill="#0f766e"/><rect x="16" y="18" width="48" height="40" rx="16" fill="url(#nxRH__ID__)"/><rect x="16" y="18" width="48" height="20" rx="14" fill="#fff" opacity=".18"/><rect x="22" y="25" width="36" height="26" rx="11" fill="#0b2f2a"/><g class="nx-r-eyes"><ellipse cx="32" cy="37" rx="4" ry="5" fill="#a7f3d0"/><ellipse cx="48" cy="37" rx="4" ry="5" fill="#a7f3d0"/></g><path d="M35 45q5 4.5 10 0" stroke="#a7f3d0" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="26" cy="45" r="2.6" fill="#fb7185" opacity=".7"/><circle cx="54" cy="45" r="2.6" fill="#fb7185" opacity=".7"/><rect x="26" y="60" width="28" height="24" rx="10" fill="url(#nxRB__ID__)"/><path class="nx-r-heart" d="M40 77c-5-3.4-6.5-5.6-6.5-7.6a3.2 3.2 0 0 1 6.5-.9 3.2 3.2 0 0 1 6.5.9c0 2-1.5 4.2-6.5 7.6z" fill="#fff" opacity=".95"/><rect x="29" y="82" width="8" height="8" rx="3.5" fill="#0f766e"/><rect x="43" y="82" width="8" height="8" rx="3.5" fill="#0f766e"/><rect x="18" y="62" width="9" height="16" rx="4.5" fill="#10b981" transform="rotate(10 22 62)"/><g class="nx-r-wave"><rect x="53" y="62" width="9" height="16" rx="4.5" fill="#10b981"/></g></g></svg>'.replace(/__ID__/g,id);}
function setupRobot(){
  const fab=document.getElementById('v11-ai-launch');
  if(fab&&!fab.dataset.nxRobot){
    fab.dataset.nxRobot='1';fab.classList.add('nx-robot-fab');fab.innerHTML=robotMarkup('F');
    const ar=document.documentElement.lang==='ary';
    const bubble=document.createElement('div');bubble.className='nx-robot-bubble';bubble.hidden=true;bubble.textContent=ar?'محتاج مساعدة؟':'Besoin d’aide ?';document.body.appendChild(bubble);
    let seen=false;try{seen=sessionStorage.getItem('nx-robot-hint')==='1';}catch{}
    if(!seen){setTimeout(()=>{bubble.hidden=false;bubble.classList.add('show');setTimeout(()=>{bubble.classList.remove('show');setTimeout(()=>bubble.hidden=true,400);},5200);try{sessionStorage.setItem('nx-robot-hint','1');}catch{}},3500);}
    fab.addEventListener('click',()=>{bubble.hidden=true;});
  }
  const top=document.querySelector('#v11-ai-drawer .v11-ai-top');
  if(top&&!top.querySelector('.nx-robot-head')){const h=document.createElement('div');h.className='nx-robot-head';h.innerHTML=robotMarkup('T');top.insertBefore(h,top.firstChild);}
}
function init(){
  setupRobot();setTimeout(setupRobot,800);
  simplifyNav();simplifyHome();setTimeout(()=>{simplifyNav();simplifyHome();},600);
  const cmp=accordion(document.getElementById('nutri-compare-card'),'Comparer deux produits','Lequel est le meilleur choix ?','<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="8" height="14" rx="2.2"/><rect x="13" y="5" width="8" height="14" rx="2.2"/><path d="M6 10h2M16 10h2M6 14h2M16 14h2"/></svg>');
  document.getElementById('nutri-focus-compare')?.addEventListener('click',()=>cmp&&cmp.classList.add('open'));
  accordion(document.getElementById('v5-laboratoire'),'🔬 Comprendre Nutri-Score, NOVA et additifs');
  // Health: make the real food logging entry obvious
  const t=setInterval(()=>{
    const s=document.querySelector('#nh-existing>summary');
    if(s){clearInterval(t);const d=s.parentElement;
      s.innerHTML='<i class="nx-ico"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></i><span class="nx-meal-txt"><b>Ajouter un repas</b><small>Repas · calories · sommeil · poids</small></span><em class="nx-chev" aria-hidden="true"></em>';
      d.classList.add('nx-add-meal');
      const grid=document.querySelector('#nh-dashboard .nh-grid'),after=grid&&grid.querySelector('.nh-overview');
      if(grid&&after&&d.parentElement!==grid)after.insertAdjacentElement('afterend',d);}
  },300);setTimeout(()=>clearInterval(t),8000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
