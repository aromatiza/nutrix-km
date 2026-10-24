/* NUTRIX Yuka-style layer — loaded last.
   - Scanner page: camera + barcode only; Récents / Favoris / Comparer in an iOS segmented control
   - Product sheet (full-screen iOS sheet) opens when a product is selected
   - Articles on Home: swipe carousel (scroll-snap) with dots + arrows
   No existing id / listener is removed: elements are only re-parented. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const ary=()=>document.documentElement.lang==='ary';
const L=(fr,ar)=>ary()?ar:fr;
const ICON={
  back:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  prev:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  next:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  bars:'<svg viewBox="0 0 24 24" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M8 8v8M11 8v8M14 8v8M17 8v8" stroke-width="2"/></svg>',
  cam:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l1.6-2.4h6.8L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.2" r="3.6"/></svg>'
};

/* ------------------------------------------------------------------ */
/* 1) SCANNER PAGE                                                     */
/* ------------------------------------------------------------------ */
function buildScanner(){
  const page=$('page-nutri');
  const shell=page&&page.querySelector('.nutri-shell');
  if(!shell||shell.dataset.yk)return;
  const scanCard=shell.querySelector('.nutri-scan-card');
  const box=$('nutri-scan-box'),scanBtn=$('nutri-scan-btn'),stopBtn=$('nutri-scan-stop');
  const input=$('nutri-barcode'),goBtn=$('nutri-barcode-btn'),status=$('nutri-status');
  const feature=$('nutri-feature-card'),compare=$('nutri-compare-card');
  const bottom=shell.querySelector('.nutri-bottom-grid');
  if(!scanCard||!box||!scanBtn||!stopBtn||!input||!goBtn||!status||!feature||!compare||!bottom)return;
  shell.dataset.yk='1';page.classList.add('yk');

  /* --- camera card ------------------------------------------------ */
  const cam=document.createElement('section');cam.className='yk-cam';cam.id='yk-cam';
  const vf=document.createElement('div');vf.className='yk-vf';
  vf.innerHTML='<div class="yk-vf-idle"><i>'+ICON.bars+'</i><b>'+L('Scanne un code-barres','سكاني الكود-بار')+'</b><small>'+L('Place le produit devant la caméra','حط المنتوج قدّام الكاميرا')+'</small></div><i class="yk-c yk-c1"></i><i class="yk-c yk-c2"></i><i class="yk-c yk-c3"></i><i class="yk-c yk-c4"></i><span class="yk-laser"></span>';
  vf.appendChild(box);
  const acts=document.createElement('div');acts.className='yk-acts';
  scanBtn.classList.add('yk-shutter');
  scanBtn.innerHTML=ICON.cam+'<span>'+L('Scanner avec la caméra','سكاني بالكاميرا')+'</span>';
  stopBtn.classList.add('yk-stop');stopBtn.textContent=L('Arrêter','وقف');
  acts.append(scanBtn,stopBtn);
  const manual=document.createElement('div');manual.className='yk-manual';
  const lab=document.createElement('span');lab.className='yk-or';lab.textContent=L('ou saisis le code','ولا كتب الكود');
  const row=document.createElement('div');row.className='yk-row';
  input.placeholder=L('Code-barres (ex. 3017620422003)','الكود-بار (مثلا 3017620422003)');
  input.setAttribute('inputmode','numeric');input.setAttribute('enterkeyhint','search');input.setAttribute('autocomplete','off');
  goBtn.classList.add('yk-go');goBtn.textContent=L('Chercher','قلّب');
  row.append(input,goBtn);
  status.classList.add('yk-status');
  manual.append(lab,row,status);
  cam.append(vf,acts,manual);
  shell.insertBefore(cam,shell.firstChild);
  const syncLive=()=>{const live=!box.hidden;cam.classList.toggle('live',live);};
  new MutationObserver(syncLive).observe(box,{attributes:true,attributeFilter:['hidden']});syncLive();

  /* --- segmented control: Récents · Favoris · Comparer ------------- */
  const recentCard=bottom.children[0],favCard=bottom.children[1];
  const seg=document.createElement('div');seg.className='yk-seg';seg.setAttribute('role','tablist');
  const tabs=[
    {k:'recent',fr:'Récents',ar:'الأخيرة',el:recentCard},
    {k:'fav',fr:'Favoris',ar:'المفضلة',el:favCard},
    {k:'compare',fr:'Comparer',ar:'قارن',el:compare}
  ];
  const panels=document.createElement('div');panels.className='yk-panels';
  tabs.forEach(t=>{
    const b=document.createElement('button');b.type='button';b.className='yk-seg-b';b.dataset.k=t.k;b.setAttribute('role','tab');
    b.innerHTML='<span>'+L(t.fr,t.ar)+'</span><em hidden></em>';
    seg.appendChild(b);t.btn=b;
    t.el.classList.add('yk-panel');t.el.dataset.k=t.k;panels.appendChild(t.el);
  });
  const hint=document.createElement('p');hint.className='yk-credit';
  hint.textContent=L('Données Open Food Facts · Le score /100 est une estimation Nutrix, pas un avis médical.','المعطيات من Open Food Facts · النقطة /100 تقديرية ماشي رأي طبي.');
  shell.append(seg,panels,hint);
  const thumb=document.createElement('i');thumb.className='yk-seg-thumb';seg.insertBefore(thumb,seg.firstChild);
  function select(k){
    tabs.forEach((t,i)=>{
      const on=t.k===k;t.btn.classList.toggle('on',on);t.btn.setAttribute('aria-selected',on);
      t.el.classList.toggle('yk-on',on);
      if(on)seg.style.setProperty('--i',i);
    });
    try{sessionStorage.setItem('yk-seg',k);}catch{}
  }
  seg.addEventListener('click',e=>{const b=e.target.closest('.yk-seg-b');if(b)select(b.dataset.k);});
  let init='recent';try{init=sessionStorage.getItem('yk-seg')||'recent';}catch{}
  select(tabs.some(t=>t.k===init)?init:'recent');
  // the old "Comparer" chips / accordion toggles must open the right panel
  $('nutri-focus-compare')?.addEventListener('click',()=>select('compare'));
  compare.classList.add('open');

  const counts=()=>{
    const n=id=>$(id)?.querySelectorAll('.nutri-saved-item').length||0;
    const set=(k,v)=>{const em=tabs.find(t=>t.k===k).btn.querySelector('em');em.textContent=v;em.hidden=!v;};
    set('recent',n('nutri-recent'));set('fav',n('nutri-favorites'));
    const a=$('nutri-compare-a')?.value,b=$('nutri-compare-b')?.value;
    set('compare',a&&b&&a!==b?2:'');
  };
  ['nutri-recent','nutri-favorites','nutri-compare-a','nutri-compare-b'].forEach(id=>{const el=$(id);if(el)new MutationObserver(counts).observe(el,{childList:true,subtree:true});});
  window.addEventListener('space:nutri-update',counts);counts();

  /* --- product sheet --------------------------------------------- */
  const sheet=document.createElement('div');sheet.className='yk-sheet';sheet.id='yk-sheet';sheet.hidden=true;
  sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');
  const bar=document.createElement('div');bar.className='yk-sheet-bar';
  bar.innerHTML='<button type="button" class="yk-sheet-back" aria-label="'+L('Fermer','سدّ')+'">'+ICON.back+'<span>'+L('Retour','رجوع')+'</span></button><b>'+L('Fiche produit','بطاقة المنتوج')+'</b><i></i>';
  const body=document.createElement('div');body.className='yk-sheet-body';
  body.appendChild(feature);
  sheet.append(bar,body);
  page.appendChild(sheet);
  feature.classList.add('yk-feature');
  const open=()=>{if(!sheet.hidden)return;sheet.hidden=false;body.scrollTop=0;document.documentElement.classList.add('yk-lock');requestAnimationFrame(()=>sheet.classList.add('in'));};
  const close=()=>{if(sheet.hidden)return;sheet.classList.remove('in');document.documentElement.classList.remove('yk-lock');setTimeout(()=>{if(!sheet.classList.contains('in'))sheet.hidden=true;},260);};
  bar.querySelector('.yk-sheet-back').addEventListener('click',close);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  sheet.addEventListener('click',e=>{
    if(e.target.closest('[data-nutri-a],[data-nutri-b]')){setTimeout(()=>{close();select('compare');cam.scrollIntoView({block:'start'});},60);}
    if(e.target.closest('#nutri-add-featured'))setTimeout(close,80);
  });
  // swipe down from the top bar closes the sheet (iOS gesture)
  let sy=null;
  bar.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;},{passive:true});
  bar.addEventListener('touchend',e=>{if(sy!=null&&e.changedTouches[0].clientY-sy>60)close();sy=null;},{passive:true});
  const feat=$('nutri-feature');
  new MutationObserver(()=>{
    if(feat.querySelector('.nutri-feature-wrap,.nx-verdict,.nutri-feature-top')||feat.className.includes('nutri-feature-wrap')){
      enhanceAdditives(feat);
      if(page.classList.contains('active'))open();
    }
  }).observe(feat,{childList:true,attributes:true,attributeFilter:['class']});
  // leaving the scanner page closes everything
  new MutationObserver(()=>{if(!page.classList.contains('active')){close();stopBtn.hidden||stopBtn.click();}}).observe(page,{attributes:true,attributeFilter:['class']});
  window.ykCloseSheet=close;
}

/* ------------------------------------------------------------------ */
/* 2) ARTICLES — swipe carousel                                        */
/* ------------------------------------------------------------------ */
function buildCarousel(){
  const rail=$('nx-morocco-items');
  if(!rail||rail.dataset.yk)return;
  rail.dataset.yk='1';rail.classList.add('yk-rail');
  const ui=document.createElement('div');ui.className='yk-car-ui';
  ui.innerHTML='<button type="button" class="yk-arrow" data-d="-1" aria-label="'+L('Précédent','السابق')+'">'+ICON.prev+'</button><div class="yk-dots" aria-hidden="true"></div><button type="button" class="yk-arrow" data-d="1" aria-label="'+L('Suivant','الموالي')+'">'+ICON.next+'</button>';
  rail.insertAdjacentElement('afterend',ui);
  const dots=ui.querySelector('.yk-dots');
  let slides=[],cur=0;
  const isSlide=el=>el.nodeType===1&&!el.classList.contains('nx-empty-state')&&el.tagName!=='P'&&!el.matches('button.nx133-retry');
  const go=i=>{
    i=Math.max(0,Math.min(slides.length-1,i));const s=slides[i];if(!s)return;
    rail.scrollTo({left:s.offsetLeft-(parseFloat(getComputedStyle(rail).paddingLeft)||0),behavior:'smooth'});
  };
  const paint=()=>{
    ui.querySelectorAll('.yk-dots i').forEach((d,i)=>d.classList.toggle('on',i===cur));
    const c=ui.querySelector('.yk-count');if(c)c.textContent=(cur+1)+' / '+slides.length;
    ui.querySelector('[data-d="-1"]').disabled=cur<=0;ui.querySelector('[data-d="1"]').disabled=cur>=slides.length-1;
  };
  const rebuild=()=>{
    slides=[...rail.children].filter(isSlide);
    rail.classList.toggle('yk-has',slides.length>0);
    ui.hidden=slides.length<2;
    if(slides.length<=8)dots.innerHTML=slides.map(()=>'<i></i>').join('');
    else dots.innerHTML='<span class="yk-count"></span>';
    cur=Math.min(cur,Math.max(0,slides.length-1));paint();
  };
  let tick=0;
  rail.addEventListener('scroll',()=>{
    if(tick)return;tick=requestAnimationFrame(()=>{
      tick=0;if(!slides.length)return;
      const pl=parseFloat(getComputedStyle(rail).paddingLeft)||0,mid=rail.scrollLeft+pl;let best=0,bd=1e9;
      slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-mid);if(d<bd){bd=d;best=i;}});
      if(best!==cur){cur=best;paint();}
    });
  },{passive:true});
  ui.addEventListener('click',e=>{
    const a=e.target.closest('.yk-arrow');if(a){go(cur+Number(a.dataset.d));return;}
    const d=e.target.closest('.yk-dots i');if(d)go([...dots.children].indexOf(d));
  });
  new MutationObserver(rebuild).observe(rail,{childList:true});
  rebuild();
}

/* ------------------------------------------------------------------ */
/* 3) ADDITIVES — rôle (pourquoi) + niveau de risque                   */
/*    Indicatif : EFSA (UE), CIRC/IARC, ANSES. Pas un avis médical.     */
/* ------------------------------------------------------------------ */
const CAT={
  col:['Colorant','ملوّن'],cons:['Conservateur','مادة حافظة'],ox:['Antioxydant','مضاد للأكسدة'],acid:['Acidifiant','مُحمِّض'],
  epa:['Épaississant / gélifiant','مُكثّف'],emu:['Émulsifiant','مستحلب'],edu:['Édulcorant','محلّي'],exa:['Exhausteur de goût','معزّز النكهة'],
  ant:['Anti-agglomérant','مانع التكتل'],reg:['Régulateur d’acidité / sels','منظّم الحموضة'],gla:['Agent d’enrobage','مادة التلميع'],
  lev:['Agent levant','مادة رافعة'],amd:['Amidon modifié','نشا معدّل'],gaz:['Gaz alimentaire','غاز غذائي'],enz:['Enzyme','إنزيم'],div:['Autre additif','إضافة أخرى']
};
const LV={
  '-1':{fr:'Non évalué',ar:'ماشي مقيَّم',k:'u'},
  0:{fr:'Sans risque connu',ar:'ما فيه حتى خطر معروف',k:'0'},
  1:{fr:'Risque faible',ar:'خطر ضعيف',k:'1'},
  2:{fr:'Risque modéré',ar:'خطر متوسط',k:'2'},
  3:{fr:'Risque élevé',ar:'خطر عالي',k:'3'}
};
const AZO='Colorant azoïque : peut aggraver l’agitation et l’attention chez certains enfants, et provoquer des réactions chez les personnes sensibles. Mention d’avertissement obligatoire dans l’UE.';
const PHOS='Un excès de phosphates ajoutés est associé à des problèmes osseux et rénaux ; les sodas et produits transformés en apportent beaucoup.';
const SULF='Allergène à déclarer : peut déclencher des crises d’asthme et des réactions chez les personnes sensibles.';
const MODS='Rend le produit plus stable ou plus épais sans cuisson.';
const AD={};
function A(codes,name,c,l,w,r){codes.split(' ').forEach(k=>{AD[k]={n:name,c,l,w,r}});}
const fix=(codes,names,c,l,w,r)=>{const ns=names.split('|');codes.split(' ').forEach((k,i)=>{AD[k]={n:ns[i]||ns[0],c,l,w,r}});};
/* colorants */
A('E100','Curcumine','col',0,'Colore en jaune (extrait de curcuma).','Naturel ; aucun risque connu aux doses alimentaires.');
A('E101','Riboflavine (vitamine B2)','col',0,'Colore en jaune et apporte de la vitamine B2.','Aucun risque connu.');
A('E102','Tartrazine','col',2,'Donne une couleur jaune vif, uniquement esthétique.',AZO);
A('E104','Jaune de quinoléine','col',2,'Donne une couleur jaune, uniquement esthétique.',AZO);
A('E110','Jaune orangé S','col',2,'Donne une couleur orange, uniquement esthétique.',AZO);
A('E122','Azorubine (carmoisine)','col',2,'Donne une couleur rouge, uniquement esthétique.',AZO);
A('E124','Ponceau 4R','col',2,'Donne une couleur rouge, uniquement esthétique.',AZO);
A('E129','Rouge allura AC','col',2,'Donne une couleur rouge, uniquement esthétique.',AZO);
A('E120','Carmin (cochenille)','col',1,'Colore en rouge ; extrait d’insectes (cochenilles).','Origine animale (non végétarien). Allergies rares possibles.');
A('E127','Érythrosine','col',2,'Colore en rose/rouge (cerises confites).','Contient de l’iode ; en excès, peut perturber la thyroïde. Usage très limité dans l’UE.');
A('E131','Bleu patenté V','col',1,'Colore en bleu, uniquement esthétique.','Réactions allergiques rares.');
A('E132','Indigotine','col',1,'Colore en bleu, uniquement esthétique.','Bien toléré ; réactions rares.');
A('E133','Bleu brillant FCF','col',1,'Colore en bleu, uniquement esthétique.','Peu absorbé par l’organisme ; risque faible.');
A('E140','Chlorophylles','col',0,'Colore en vert (naturel).','Aucun risque connu.');
A('E141','Chlorophylles cuivrées','col',0,'Colore en vert.','Aucun risque connu aux doses d’usage.');
A('E150a','Caramel ordinaire','col',0,'Colore en brun et donne un goût caramel.','Aucun risque connu.');
A('E150b','Caramel de sulfite caustique','col',1,'Colore en brun.','Risque faible aux doses d’usage.');
A('E150c','Caramel ammoniacal','col',1,'Colore en brun (sodas, sauces).','Peut contenir des traces de 4-méthylimidazole (4-MeI), classé « peut-être cancérogène » (2B) à forte dose ; teneurs limitées dans l’UE.');
A('E150d','Caramel au sulfite d’ammonium','col',1,'Colore en brun foncé (colas, sauces).','Peut contenir des traces de 4-méthylimidazole (4-MeI), classé « peut-être cancérogène » (2B) à forte dose ; teneurs limitées dans l’UE.');
A('E153','Carbone végétal','col',0,'Colore en noir.','Aucun risque connu.');
A('E160a','Carotènes','col',0,'Colore en orange (provitamine A).','Aucun risque connu.');
A('E160b','Rocou (annatto)','col',1,'Colore en jaune-orange (fromages, snacks).','Réactions allergiques rares.');
A('E160c','Extrait de paprika','col',0,'Colore en rouge-orangé.','Aucun risque connu.');
A('E160d','Lycopène','col',0,'Colore en rouge (tomate).','Aucun risque connu.');
A('E161b','Lutéine','col',0,'Colore en jaune.','Aucun risque connu.');
A('E162','Rouge de betterave (bétanine)','col',0,'Colore en rouge-rose.','Aucun risque connu.');
A('E163','Anthocyanes','col',0,'Colore en rouge/violet (fruits).','Aucun risque connu.');
A('E170','Carbonate de calcium','col',0,'Colore en blanc, régule l’acidité, apporte du calcium.','Aucun risque connu.');
A('E171','Dioxyde de titane','col',3,'Rend le produit très blanc et opaque (confiseries, glaçages).','Interdit comme additif alimentaire dans l’UE depuis 2022 : l’EFSA ne peut pas exclure un risque pour l’ADN. S’il apparaît, le produit est ancien ou hors UE.');
A('E172','Oxydes de fer','col',0,'Colore en jaune, rouge ou noir.','Aucun risque connu aux doses d’usage.');
/* conservateurs */
A('E200','Acide sorbique','cons',1,'Empêche moisissures et levures (fromages, pâtisseries).','Bien toléré aux doses autorisées ; irritation cutanée rare.');
A('E202','Sorbate de potassium','cons',1,'Empêche moisissures et levures (boissons, fromages, pâtisseries).','Bien toléré aux doses autorisées.');
A('E203','Sorbate de calcium','cons',1,'Empêche moisissures et levures.','Bien toléré aux doses autorisées.');
fix('E210 E211 E212 E213','Acide benzoïque|Benzoate de sodium|Benzoate de potassium|Benzoate de calcium','cons',2,'Empêche bactéries et moisissures (boissons, sauces).','Peut provoquer des réactions chez les personnes sensibles (urticaire, asthme). Avec la vitamine C, peut former des traces de benzène.');
fix('E220 E221 E222 E223 E224 E226 E227 E228','Dioxyde de soufre|Sulfite de sodium|Bisulfite de sodium|Métabisulfite de sodium|Métabisulfite de potassium|Sulfite de calcium|Bisulfite de calcium|Bisulfite de potassium','cons',2,'Conserve et empêche le brunissement (vin, fruits secs, pommes de terre).',SULF);
A('E234','Nisine','cons',0,'Antibactérien naturel (fromages).','Aucun risque connu.');
A('E235','Natamycine','cons',1,'Empêche les moisissures en surface (fromages, saucissons).','Risque faible aux doses autorisées.');
A('E249','Nitrite de potassium','cons',3,'Conserve la charcuterie, fixe sa couleur rose et limite le botulisme.','Peut former des nitrosamines (cancérogènes). La charcuterie transformée est classée cancérogène avéré (groupe 1, CIRC) : à limiter.');
A('E250','Nitrite de sodium','cons',3,'Conserve la charcuterie, fixe sa couleur rose et limite le botulisme.','Peut former des nitrosamines (cancérogènes). La charcuterie transformée est classée cancérogène avéré (groupe 1, CIRC) : à limiter.');
A('E251','Nitrate de sodium','cons',2,'Conserve la charcuterie et certains fromages.','Se transforme en nitrite dans l’organisme ; même vigilance que pour les nitrites.');
A('E252','Nitrate de potassium','cons',2,'Conserve la charcuterie et certains fromages.','Se transforme en nitrite dans l’organisme ; même vigilance que pour les nitrites.');
A('E260','Acide acétique (vinaigre)','acid',0,'Acidifie et conserve.','Aucun risque connu.');
A('E270','Acide lactique','acid',0,'Acidifie et conserve.','Aucun risque connu.');
fix('E280 E281 E282 E283','Acide propionique|Propionate de sodium|Propionate de calcium|Propionate de potassium','cons',1,'Empêche les moisissures (pain, viennoiseries).','Risque faible ; quelques études suggèrent un effet sur le comportement de l’enfant, données limitées.');
A('E290','Dioxyde de carbone','gaz',0,'Donne les bulles (boissons gazeuses).','Aucun risque connu.');
A('E296','Acide malique','acid',0,'Acidifie, donne un goût acidulé.','Aucun risque connu.');
A('E297','Acide fumarique','acid',0,'Acidifie.','Aucun risque connu.');
/* antioxydants / acidifiants */
A('E300','Acide ascorbique (vitamine C)','ox',0,'Empêche l’oxydation et le brunissement.','Aucun risque connu.');
A('E301','Ascorbate de sodium','ox',0,'Empêche l’oxydation (vitamine C).','Aucun risque connu.');
A('E304','Palmitate d’ascorbyle','ox',0,'Empêche le rancissement des graisses.','Aucun risque connu.');
fix('E306 E307 E308 E309','Extraits riches en tocophérols|Alpha-tocophérol|Gamma-tocophérol|Delta-tocophérol','ox',0,'Empêche le rancissement des graisses (vitamine E).','Aucun risque connu.');
fix('E310 E311 E312','Gallate de propyle|Gallate d’octyle|Gallate de dodécyle','ox',1,'Empêche le rancissement des graisses.','Réactions allergiques possibles ; données limitées.');
A('E319','TBHQ','ox',2,'Empêche le rancissement des huiles et snacks.','Limité à de faibles doses ; à fortes doses, effets toxiques observés chez l’animal.');
A('E320','BHA','ox',3,'Empêche le rancissement (chips, chewing-gum).','Perturbateur endocrinien suspecté ; classé « peut-être cancérogène » (2B) par le CIRC.');
A('E321','BHT','ox',2,'Empêche le rancissement des graisses.','Données contradictoires, perturbateur endocrinien suspecté ; en cours de réévaluation.');
A('E322','Lécithines','emu',0,'Mélange eau et graisse, texture homogène (chocolat, pâtisserie).','Aucun risque connu ; peut provenir du soja (allergène) ou du tournesol.');
fix('E325 E326 E327','Lactate de sodium|Lactate de potassium|Lactate de calcium','reg',0,'Régule l’acidité et conserve.','Aucun risque connu.');
A('E330','Acide citrique','acid',0,'Acidifie, donne un goût acidulé, conserve.','Aucun risque connu ; peut abîmer l’émail des dents dans les boissons acides.');
fix('E331 E332 E333','Citrates de sodium|Citrates de potassium|Citrates de calcium','reg',0,'Régule l’acidité.','Aucun risque connu.');
A('E334','Acide tartrique','acid',0,'Acidifie (raisin, vin, levures chimiques).','Aucun risque connu.');
A('E338','Acide phosphorique','acid',2,'Acidifie et donne le piquant des colas.',PHOS);
fix('E339 E340 E341 E450 E451 E452','Phosphates de sodium|Phosphates de potassium|Phosphates de calcium|Diphosphates|Triphosphates|Polyphosphates','reg',2,'Retient l’eau, stabilise, aide à lever (charcuterie, fromages fondus, sodas).',PHOS);
A('E385','EDTA calcique disodique','ox',1,'Empêche l’oxydation dans les sauces et conserves.','Risque faible aux doses autorisées.');
/* épaississants */
fix('E400 E401 E402 E404','Acide alginique|Alginate de sodium|Alginate de potassium|Alginate de calcium','epa',0,'Épaissit et gélifie (extrait d’algues).','Aucun risque connu.');
A('E406','Agar-agar','epa',0,'Gélifie (extrait d’algues).','Aucun risque connu.');
A('E407','Carraghénanes','epa',2,'Épaissit et gélifie (desserts lactés, charcuterie).','Des études (animales et cellulaires) suggèrent une inflammation de l’intestin ; l’EFSA les juge acceptables aux doses autorisées, le débat reste ouvert.');
A('E407a','Algues Eucheuma transformées','epa',1,'Épaissit et gélifie.','Même débat que les carraghénanes, à un moindre degré.');
A('E410','Farine de graines de caroube','epa',0,'Épaissit (glaces, sauces).','Aucun risque connu.');
A('E412','Gomme guar','epa',0,'Épaissit et stabilise.','Aucun risque connu ; légère action laxative en excès.');
A('E413','Gomme adragante','epa',1,'Épaissit.','Réactions allergiques rares.');
A('E414','Gomme arabique','epa',0,'Épaissit et stabilise (boissons, confiseries).','Aucun risque connu.');
A('E415','Gomme xanthane','epa',0,'Épaissit et stabilise les sauces.','Aucun risque connu ; peut ballonner en grande quantité.');
A('E416','Gomme karaya','epa',1,'Épaissit.','Réactions allergiques rares.');
A('E418','Gomme gellane','epa',0,'Gélifie et stabilise.','Aucun risque connu.');
A('E420','Sorbitol','edu',1,'Remplace le sucre et garde l’humidité (chewing-gum, produits « sans sucre »).','Effet laxatif et ballonnements au-delà de ~20 g par jour.');
A('E421','Mannitol','edu',1,'Remplace le sucre.','Effet laxatif en excès.');
A('E422','Glycérol','div',0,'Garde l’humidité du produit.','Aucun risque connu.');
A('E425','Konjac','epa',1,'Épaissit et gélifie.','Risque d’étouffement avec certains gels : à éviter pour les jeunes enfants.');
A('E440','Pectines','epa',0,'Gélifie (confitures, extraites de fruits).','Aucun risque connu.');
A('E459','Bêta-cyclodextrine','epa',1,'Stabilise les arômes.','Effet laxatif en excès.');
A('E460','Cellulose','ant',0,'Épaissit, évite les grumeaux (fromage râpé).','Aucun risque connu.');
fix('E461 E463 E464','Méthylcellulose|Hydroxypropylcellulose|Hydroxypropylméthylcellulose','epa',0,'Épaissit et donne de la texture.','Aucun risque connu ; légère action laxative en excès.');
A('E466','Carboxyméthylcellulose (CMC)','emu',1,'Texture crémeuse (glaces, sauces).','Des études chez la souris suggèrent un effet sur le microbiote ; l’EFSA ne voit pas de problème aux doses autorisées.');
/* émulsifiants */
fix('E471 E472a E472b E472c E472e E472f','Mono- et diglycérides d’acides gras|Esters acétiques|Esters lactiques|Esters citriques|Esters mono-/diacétyltartriques (DATEM)|Esters tartriques','emu',1,'Mélange eau et graisse, texture moelleuse (pain, glaces, biscuits).','Risque faible ; peuvent contenir des traces de gras trans. Origine végétale ou animale selon le produit.');
fix('E473 E474 E475 E476 E477 E481 E482 E491 E492','Sucroesters|Sucroglycérides|Esters polyglycériques|PGPR|Esters de propylène glycol|Stéaroyl-2-lactylate de sodium|Stéaroyl-2-lactylate de calcium|Monostéarate de sorbitane|Tristéarate de sorbitane','emu',1,'Mélange eau et graisse, améliore la texture.','Risque faible aux doses autorisées.');
/* régulateurs / anti-agglomérants */
fix('E500 E501 E503 E504','Carbonates de sodium (bicarbonate)|Carbonates de potassium|Carbonates d’ammonium|Carbonates de magnésium','lev',0,'Fait lever la pâte et régule l’acidité.','Aucun risque connu.');
A('E507','Acide chlorhydrique','reg',0,'Régule l’acidité (très dilué, éliminé à la fabrication).','Aucun risque connu.');
A('E508','Chlorure de potassium','reg',0,'Gélifie et remplace le sel.','Aucun risque connu pour la plupart des gens ; à éviter en cas de problème rénal.');
A('E509','Chlorure de calcium','reg',0,'Raffermit (légumes en conserve, fromages).','Aucun risque connu.');
A('E516','Sulfate de calcium','reg',0,'Raffermit et régule l’acidité (pain, tofu).','Aucun risque connu.');
A('E524','Hydroxyde de sodium (soude)','reg',0,'Régule l’acidité (bretzels, cacao).','Aucun risque connu aux doses d’usage.');
A('E530','Oxyde de magnésium','ant',0,'Anti-agglomérant.','Aucun risque connu.');
A('E551','Dioxyde de silicium (silice)','ant',1,'Empêche les poudres de former des grumeaux (sel, épices, soupes).','Peu de risque ; données incomplètes sur la forme nanométrique.');
A('E552','Silicate de calcium','ant',1,'Anti-agglomérant.','Peu de risque aux doses d’usage.');
A('E553b','Talc','ant',1,'Anti-agglomérant et agent de glaçage.','Doit être exempt d’impuretés (amiante) ; risque faible si pureté respectée.');
A('E570','Acide stéarique','ant',0,'Anti-agglomérant, agent d’enrobage.','Aucun risque connu.');
A('E575','Glucono-delta-lactone','acid',0,'Acidifie doucement (tofu, charcuterie).','Aucun risque connu.');
/* exhausteurs */
fix('E620 E621 E622 E623 E624 E625','Acide glutamique|Glutamate monosodique (MSG)|Glutamate monopotassique|Diglutamate de calcium|Glutamate d’ammonium|Diglutamate de magnésium','exa',1,'Renforce le goût salé (umami) : soupes, chips, plats préparés.','Bien toléré à dose normale ; certaines personnes rapportent maux de tête ou palpitations. Apporte du sodium.');
fix('E627 E631 E635','Guanylate disodique|Inosinate disodique|Ribonucléotides disodiques','exa',1,'Renforce le goût (souvent avec le glutamate).','À éviter en cas de goutte ou d’asthme sensible ; non recommandé pour les nourrissons.');
/* enrobage */
A('E901','Cire d’abeille','gla',0,'Fait briller (confiseries, fruits).','Origine animale ; aucun risque connu.');
A('E902','Cire de candelilla','gla',0,'Fait briller.','Aucun risque connu.');
A('E903','Cire de carnauba','gla',0,'Fait briller (confiseries).','Aucun risque connu.');
A('E904','Gomme laque (shellac)','gla',1,'Fait briller (dragées, fruits).','Résine d’insecte (non végétarien) ; risque faible.');
A('E905','Cires microcristallines','gla',1,'Fait briller, protège la surface.','Risque faible aux doses autorisées.');
A('E920','L-cystéine','div',1,'Assouplit la pâte (pain industriel).','Peut être d’origine animale (plumes, cheveux) ou synthétique.');
A('E941','Azote','gaz',0,'Gaz de conditionnement (évite l’oxydation).','Aucun risque connu.');
A('E948','Oxygène','gaz',0,'Gaz de conditionnement.','Aucun risque connu.');
/* édulcorants */
A('E950','Acésulfame K','edu',1,'Remplace le sucre (~200× plus sucrant) : boissons « zéro », produits allégés.','Effets à long terme encore débattus (microbiote, métabolisme) ; l’EFSA le juge sûr aux doses autorisées.');
A('E951','Aspartame','edu',2,'Remplace le sucre (~200× plus sucrant) : boissons « zéro », produits allégés.','Classé « peut-être cancérogène » (2B) par le CIRC en 2023 ; la dose journalière admissible (40 mg/kg) a été maintenue. Interdit aux personnes atteintes de phénylcétonurie.');
A('E952','Cyclamates','edu',2,'Remplace le sucre.','Interdit dans certains pays (États-Unis) ; la dose admissible est facilement dépassée par les enfants.');
A('E954','Saccharine','edu',1,'Remplace le sucre (~300× plus sucrant).','Risque faible aux doses autorisées ; arrière-goût métallique.');
A('E955','Sucralose','edu',1,'Remplace le sucre (~600× plus sucrant).','Une étude de 2023 évoque une toxicité pour l’ADN d’un produit de dégradation à forte dose ; à confirmer.');
A('E960','Glycosides de stéviol (stévia)','edu',0,'Remplace le sucre (extrait de la plante stévia).','Aucun risque connu aux doses admissibles.');
A('E961','Néotame','edu',1,'Remplace le sucre.','Risque faible aux doses autorisées.');
A('E962','Sel d’aspartame-acésulfame','edu',2,'Remplace le sucre.','Mêmes réserves que l’aspartame et l’acésulfame K.');
fix('E965 E966 E967 E968','Maltitol|Lactitol|Xylitol|Érythritol','edu',1,'Remplace le sucre (produits « sans sucre », chewing-gums).','Effet laxatif en excès. Une étude de 2023 associe un taux élevé d’érythritol à un risque cardiovasculaire (à confirmer). Le xylitol est toxique pour les chiens.');
A('E999','Extrait de quillaia','emu',1,'Fait mousser (boissons).','Risque faible aux doses autorisées.');
A('E1105','Lysozyme','cons',0,'Conserve (fromages).','Dérivé de l’œuf : allergène.');
A('E1200','Polydextrose','epa',0,'Épaissit et remplace le sucre.','Légère action laxative en excès.');
A('E1520','Propylène glycol','div',1,'Garde l’humidité, solvant d’arômes.','Risque faible aux doses autorisées.');
const RANGE=[
  [100,199,'col','Colore le produit.'],[200,299,'cons','Aide à conserver le produit.'],[300,399,'ox','Empêche le rancissement ou règle l’acidité.'],
  [400,499,'epa','Donne de la texture (épaissit, gélifie ou émulsionne).'],[500,599,'reg','Règle l’acidité ou empêche les grumeaux.'],
  [600,699,'exa','Renforce le goût.'],[900,999,'div','Agent de surface, gaz ou édulcorant.'],[1000,1599,'amd','Modifie la texture ou la stabilité.']
];
function addInfo(label){
  const m=String(label||'').trim().match(/^E\s?(\d{3,4})([a-z]?)/i);
  if(!m)return {code:String(label||'').trim(),n:String(label||'').trim(),c:'div',l:-1,w:'Rôle non renseigné.',r:'Nous n’avons pas d’évaluation pour cet additif.'};
  const num=+m[1],lt=m[2].toLowerCase(),code='E'+m[1]+lt;
  let d=AD[code]||AD['E'+m[1]];
  if(d)return {code,...d};
  const g=RANGE.find(r=>num>=r[0]&&num<=r[1]);
  if(num>=1400&&num<=1451)return {code,n:'Amidon modifié',c:'amd',l:0,w:MODS,r:'Aucun risque connu aux doses d’usage.'};
  return {code,n:code,c:g?g[2]:'div',l:-1,w:g?g[3]:'Rôle non renseigné.',r:'Nous n’avons pas d’évaluation détaillée pour cet additif : le risque n’est pas déterminé.'};
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function additivesHTML(labels){
  const items=[...new Set(labels)].map(addInfo).sort((a,b)=>b.l-a.l||a.code.localeCompare(b.code));
  const worst=items.reduce((m,x)=>Math.max(m,x.l),-1);
  const lv=l=>LV[l][ary()?'ar':'fr'];
  const rows=items.map(x=>`<div class="yk-add" data-l="${LV[x.l].k}"><div class="yk-add-h"><b>${esc(x.code)} · ${esc(x.n)}</b><span class="yk-lv"><i></i>${esc(lv(x.l))}</span></div><p><em>${L('Pourquoi','علاش')} · ${esc(CAT[x.c][ary()?1:0])}</em>${esc(x.w)}</p><p><em>${L('À savoir','خاصك تعرف')}</em>${esc(x.r)}</p></div>`).join('');
  return {worst,items,html:`<div class="yk-add-list">${rows}</div><p class="yk-add-note">${L('Niveaux indicatifs d’après l’EFSA, le CIRC et l’ANSES. Un additif autorisé n’est pas dangereux à dose normale ; ce n’est pas un avis médical.','المستويات تقريبية حسب EFSA وCIRC وANSES. الإضافة المرخّصة ماشي خطيرة بالجرعة العادية؛ هادا ماشي رأي طبي.')}</p>`};
}
function enhanceAdditives(root){
  const d=[...root.querySelectorAll('details.v8-expand')].find(x=>/additif/i.test(x.querySelector('summary')?.textContent||''));
  if(!d||d.dataset.yk)return;
  const pills=[...d.querySelectorAll('.nutri-pill')].map(x=>x.textContent.trim()).filter(Boolean);
  d.dataset.yk='1';
  if(!pills.length)return;
  const {worst,items,html}=additivesHTML(pills);
  const sum=d.querySelector('summary');
  sum.innerHTML=`<span>${L('Additifs','الإضافات')} (${items.length})</span><span class="yk-lv yk-lv-s" data-l="${LV[worst].k}"><i></i>${esc(LV[worst][ary()?'ar':'fr'])}</span>`;
  d.querySelector('.v8-expand-body').innerHTML=html;
  d.open=true;d.classList.add('yk-additives');
  // verdict takes additives into account (like Yuka: a high-risk additive caps the verdict)
  const v=root.querySelector('.nx-verdict');
  if(v&&worst>=2&&!v.dataset.yk){
    v.dataset.yk='1';
    const bad=items.filter(x=>x.l>=2).slice(0,3).map(x=>x.code).join(', ');
    const em=v.querySelector('.nx-verdict-emoji'),st=v.querySelector('.nx-verdict-body strong');
    const green=/#16a34a/i.test(v.getAttribute('style')||'')||em?.textContent==='🟢';
    const yellow=/#d97706/i.test(v.getAttribute('style')||'')||em?.textContent==='🟡';
    let cap=null;
    if(worst>=3&&(green||yellow))cap={e:'🔴',w:L('À limiter','قلل منو'),t:'#dc2626'};
    else if(worst===2&&green)cap={e:'🟡',w:L('Moyen','وسط'),t:'#d97706'};
    if(cap){em.textContent=cap.e;st.textContent=cap.w;v.style.setProperty('--tone',cap.t);}
    let ul=v.querySelector('.nx-verdict-list');
    if(!ul){ul=document.createElement('ul');ul.className='nx-verdict-list';v.querySelector('.nx-verdict-body').appendChild(ul);}
    const li=document.createElement('li');li.textContent='⚠️ '+L('Additif à surveiller','إضافة خاصك تنتابه')+' : '+bad;ul.prepend(li);
    while(ul.children.length>3)ul.lastElementChild.remove();
  }
  // additives are shown right under the verdict, not hidden in "Voir tous les détails"
  (v||d.parentElement).insertAdjacentElement(v?'afterend':'beforebegin',d);
}
function init(){
  buildScanner();buildCarousel();
  // other layers build parts of the DOM late: retry a few times
  let n=0;const t=setInterval(()=>{buildScanner();buildCarousel();if(++n>12)clearInterval(t);},500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
