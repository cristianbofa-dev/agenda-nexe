/* Agenda NEXE · app.js (interfície). Versió 2026.11.10-pwa1 */
const ZOG="Manresa–Girona (Vic, Olot, Ripoll)";
const Z=["Barcelona ciutat / Barcelonès","Baix Llobregat","Vallès Occidental","Vallès Oriental","Maresme","Anoia / Penedès / Garraf","Manresa / Bages / Berguedà",ZOG,"Girona","Tarragona Camp","Tarragona Ebre","Lleida","Franja / Aragó","Andorra","Altres"];
const nz=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[´'’`.]/g," ").replace(/\s+/g," ").trim();
const R={
ba:/manresa|berga|gironella|solsona|callus|navarcles|santpedor|fruit|vilatorrada|suria|cardona|sallent|balsareny|castellet|monistrol|navas|avinyo|puig reig|cercs|\bartes\b|moia|llorenc de morunys|castellgali|sant joan de vil/,
bcn:/barcelona|hospitalet|badalona|sant adria|san adria|coloma (de )?gram|montgat/,
bl:/cornella|prat de ll|el prat|sant boi|\bgava\b|viladecans|castelldefels|sant feliu de ll|molins de rei|sant joan desp|esplugues|sant just|sant vicenc dels horts|pallej|abrera|papiol|esparrag|esparreg|sant andreu de la barca|vallirana|llorenc d ?hortons|esteve (de )?sesrovires|martorell|olesa|coloma de cervell|corbera/,
vo:/sabadell|terrassa|\brubi\b|sant cugat|cerdanyola|ripollet|barbera|castellar|viladecavalls|vacarisses|sentmenat|palau de plegamans|montcada|santa perpetua|sant quirze|badia|matadepera|polinya/,
vr:/granollers|mollet|cardedeu|caldes de montbui|roca del valles|llinars|franqueses|llagosta|sant fost|sant celoni|vilamajor|villalba saserra|atmella|garriga|corro d|llica|canovelles|montmelo|parets/,
mar:/mataro|argentona|masnou|premia|vilassar|cabrils|pineda|calella/,
an:/igualada|odena|vallbona d ?anoia|vilafranca|geltru|cubelles|roquetes|sant sadurni|calaf|piera|capellades|sitges/,
er:/tortosa|amposta|ulldecona|deltebre|gandesa|ampolla|roquetes|roquetas|jesus|mora la nova|flix|rapita|pinell de brai/,
og:/\bvic\b|manlleu|torello|\btona\b|taradell|centelles|balenya|sant hipolit|roda de ter|voltrega|sant quirze de besora|calldetenes|\bseva\b|folgueroles|\bgurb\b|santa eugenia de berga|sant julia de vilatorta|l esquirol|santa maria de corco|prats de llucanes|\bolot\b|besalu|santa pau|castellfollit|sant joan les fonts|les preses|\bripoll\b|camprodon|sant joan de les abadesses|campdevanol|ribes de freser|sant pau de segurie|gombren|setcases|molló|mollo\b|ogassa/};
const ZN={ba:6,bcn:0,bl:1,vo:2,vr:3,mar:4,an:5};
function guess(t,pv,cp){const n=nz(t);pv=nz(pv);cp=String(cp||"").toUpperCase().replace(/\s/g,"");
 if(cp.startsWith("AD")||/andorra|encamp|canillo|escaldes|massana|ordino/.test(pv+" "+n))return"Andorra";
 const p=cp&&!cp.startsWith("AD")?(cp.length==4?"0"+cp:cp).slice(0,2):"";
 const k=pv.startsWith("ger")||(!pv&&p=="17")?"g":pv.startsWith("hues")||(!pv&&p=="22")?"h":/^(lerida|lleida)/.test(pv)||(!pv&&p=="25")?"l":pv.startsWith("tarr")||(!pv&&p=="43")?"t":pv.startsWith("barc")||(!pv&&p=="08")?"b":"";
 if(k=="g")return R.og.test(n)?ZOG:"Girona";if(k=="h")return"Franja / Aragó";if(k=="t")return R.er.test(n)?"Tarragona Ebre":"Tarragona Camp";
 if(k=="l")return R.ba.test(n)?Z[6]:"Lleida";
 if(k=="b"||!k){if(R.og.test(n))return ZOG;for(const x of["ba","bcn","bl","vo","vr","mar","an"])if(R[x].test(n))return Z[ZN[x]];}
 return"Altres"}
let S={clients:[],visits:[],cfg:{A:30,B:60,C:90},ts:0},tab="avui",sel=new Set(),zf="",q="",fz="",fc="",fa="",hq="",aq="",cv="mes",dbDoc=null,tmr;
const $=s=>document.querySelector(s);
const iso=d=>new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
const today=()=>iso(new Date());
let day=today();
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fd=d=>d?d.split("-").reverse().join("/"):"";
const dd=n=>{const d=new Date(day);d.setDate(d.getDate()+n);day=iso(d);render()};
const diff=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const cl=id=>S.clients.find(c=>c.id==id);
const badge=c=>`<span class="b b${c}">${c}</span>`;

function lastV(c){let m=null;for(const v of S.visits)if(v.cid==c.id&&v.st=="done"&&(!m||(v.date+(v.time||""))>(m.date+(m.time||""))))m=v;return m}
function lastH(c){const v=c&&c.id?lastV(c):null;if(!v)return`<div class=mu>Encara no hi ha cap visita registrada.</div>`;return `<div class=cm><b>${v.kind=="tel"?"Última conversa":"Última visita"} (${fd(v.date)}):</b> ${v.comment?esc(v.comment):"<span class=mu>sense comentari</span>"}</div>`}
function last(c){let m=null;for(const v of S.visits)if(v.cid==c.id&&v.st=="done"&&(!m||v.date>m))m=v.date;return m}
function since(c){const l=last(c);return l?diff(l,today()):null}
const CM=()=>S.cfg.M||20;
function dueCall(c){if(c.type!="m"||!c.active)return false;const s=since(c);return s===null||s>=CM()}
function due(c){if(!c.active||c.type=="m")return false;const s=since(c);return s===null||s>=S.cfg[c.cls]}
function pend(c){return S.visits.filter(v=>v.cid==c.id&&v.st=="plan"&&v.date>=today()).sort((a,b)=>a.date<b.date?-1:1)[0]}
const APPV="2026.11.10-pwa1",SNAP_MAX=10,SNAPFAIL="No s'ha pogut guardar una còpia interna de les dades actuals. No s'ha fet cap canvi: fes primer una còpia JSON.";
let stLocal=0,stInfo="",lsFail=false,idbFail=false,persistOk=null,editTmp=false,rsData=null,snapList=[],corList=[],updReady=false;
const cnt=x=>({c:(x&&x.clients||[]).length,v:(x&&x.visits||[]).length});
const isEmpty=x=>!x||(!(x.clients||[]).length&&!(x.visits||[]).length);
const hhmm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")};
const fdt=t=>fd(iso(new Date(t)))+" "+hhmm(t);
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}}
const rol=()=>{const r=lsGet("nexe_rol");return r=="consulta"||r=="principal"?r:(Plat.isIOS()?"consulta":"principal")};
function ro(){if(rol()=="consulta"&&!editTmp){N("Mode consulta: en aquest dispositiu només es consulten les dades. Els canvis es fan al Mac i arriben amb «Enviar a l'iPad». Si cal fer un canvi aquí, activa «Permetre editar temporalment» a Ajustos.");return true}return false}
function setRol(v){lsSet("nexe_rol",v);editTmp=false;render()}
function setCfg(k,val){if(ro()){render();return}S.cfg[k]=+val||1;save();render()}
function writeLocal(){const j=JSON.stringify(S);try{localStorage.setItem("nexe",j);lsFail=false}catch(e){lsFail=true}
 stLocal=Date.now();const p=Store.putState(j).then(()=>{idbFail=false},()=>{idbFail=true}).then(showSt);showSt();return p}
function save(){S.ts=Date.now();return writeLocal()}
function stTxt(){const p=[];
 if(lsFail&&idbFail)p.push(`<b class=wa>⚠ No s'ha pogut desar. Fes una còpia JSON ara.</b>`);
 else{if(stLocal)p.push("Desat "+hhmm(stLocal));if(idbFail)p.push(`<b class=wa>⚠ Desat només al navegador (base de dades local no disponible)</b>`);if(lsFail)p.push(`<b class=wa>⚠ Desat només a la base de dades local (navegador ple)</b>`)}
 if(stInfo)p.push(esc(stInfo));
 const lb=+lsGet("nexe_lastbk")||0,dl=lb?Math.floor((Date.now()-lb)/864e5):null;
 if(!isEmpty(S)&&rol()=="principal"){if(dl===null)p.push("Cap còpia JSON guardada en aquest dispositiu");else if(dl>7)p.push(`<span class=wa>Última còpia JSON fa ${dl} dies</span>`)}
 return p.join(" · ")}
function roTxt(){if(rol()!="consulta")return"";const f=+lsGet("nexe_from")||0,d=f?Math.floor((Date.now()-f)/864e5):null;
 return editTmp?"✏️ Mode consulta amb edició temporal: aquests canvis no arriben al Mac i es perdran en la propera actualització":"👁 MODE CONSULTA · "+(f?"dades del Mac del "+fdt(f)+(d>7?" (fa "+d+" dies)":""):"encara no hi ha dades del Mac")+" · els canvis es fan al Mac"}
function showSt(){const e=$("#st");if(e)e.innerHTML=stTxt();
 const r=$("#ro");if(r){const t=roTxt();r.textContent=t;r.className=t?(editTmp?"on ed":"on"):""}
 const u=$("#upd");if(u){u.innerHTML=updReady?`<span>Hi ha una versió nova de l'app. Les teves dades no es toquen.</span><button class=pri onclick="doUpdate()">Actualitzar</button>`:"";u.className=updReady?"on":""}}
async function doUpdate(){const ok=await Plat.applyUpdate(()=>Store.flush());if(!ok)location.reload()}
async function refreshLists(){try{snapList=await Store.listSnaps()}catch(e){snapList=[]}try{corList=await Store.listCorrupt()}catch(e){corList=[]}}
async function snap(why,obj){const o=obj||S;if(isEmpty(o))return true;try{await Store.addSnap({t:Date.now(),why,c:cnt(o).c,v:cnt(o).v},JSON.stringify(o),SNAP_MAX);await refreshLists();return true}catch(e){return false}}
function snaps(){return snapList}
async function recSnap(k){const x=snapList.find(s=>s.k==k);if(!x)return;let o=null;try{o=JSON.parse(await Store.getSnap(k))}catch(e){}
 if(!o||!Array.isArray(o.clients)||!Array.isArray(o.visits)){N("Aquesta còpia interna no es pot llegir.");return}
 Q("Recuperar les dades del "+fdt(x.t)+" ("+x.c+" clients, "+x.v+" visites)? Les actuals es guardaran com a còpia interna.",async()=>{if(!await snap("abans de recuperar")){N(SNAPFAIL);return}S=Object.assign({cfg:{A:30,B:60,C:90}},o);delete S._meta;mig();await save();render();N("Dades recuperades: "+cnt(S).c+" clients i "+cnt(S).v+" visites.")})}
function corKeys(){return corList}
async function vCor(k){const t=await Store.getCorrupt(k);M(`<h2>Dades malmeses</h2><p class=mu>Text tal com estava desat. Copia'l i guarda'l: es pot intentar recuperar a mà.</p><textarea rows=10 onfocus="this.select()">${esc(t||"")}</textarea><div class=bt><button onclick="X()">Tancar</button></div>`)}
function lbTxt(){const lb=+lsGet("nexe_lastbk")||0;return lb?"Última còpia JSON guardada des d'aquest dispositiu: "+fdt(lb):"Encara no s'ha guardat cap còpia JSON des d'aquest dispositiu."}
function snapsH(){const L=snapList,C=corList;
 let h=`<h2>Còpies internes (desfer)</h2><div class=card><p class=mu>Es guarden soles abans de restaurar o actualitzar des del Mac, importar clients, actualitzar la versió de les dades, esborrar un client o una visita tancada, canviar una zona, i quan en obrir l'app es troben dues versions diferents de les dades. Es conserven les ${SNAP_MAX} últimes en aquest dispositiu.</p>`+(L.length?L.map(x=>`<div class=bar style="margin:6px 0"><span style="flex:1">${fdt(x.t)} · ${esc(x.why)} <span class=mu>(${x.c} clients, ${x.v} visites)</span></span><button onclick="recSnap('${x.k}')">Recuperar</button></div>`).join(""):`<p class=mu>Encara no n'hi ha cap.</p>`)+`</div>`;
 if(C.length)h+=`<h2>Dades malmeses apartades</h2><div class=card>${C.map(k=>`<div class=bar style="margin:6px 0"><span style="flex:1">${esc(k.replace(/^(nexe_)?corrupte_/,""))}</span><button onclick="vCor('${k}')">Veure</button></div>`).join("")}</div>`;
 return h+`<p class=mu>Versió de l'app ${APPV}</p>`}
function devH(){const r=rol();return `<h2>Aquest dispositiu</h2><div class=card><label class=f>Funció d'aquest dispositiu</label><select id=rolsel onchange="setRol(this.value)"><option value=principal ${r=="principal"?"selected":""}>Principal (Mac): aquí es fan els canvis</option><option value=consulta ${r=="consulta"?"selected":""}>Consulta (iPad): només per consultar</option></select>`
 +(r=="consulta"?`<label style="display:flex;gap:6px;align-items:center;margin:10px 0 4px"><input type=checkbox id=edtmp style="width:auto" ${editTmp?"checked":""} onchange="editTmp=this.checked;render()"> Permetre editar temporalment</label><p class=mu>Els canvis fets aquí no arriben al Mac i es perdran en la propera actualització des del Mac.</p>`:"")
 +`<p class=mu>Emmagatzematge persistent: ${persistOk===true?"sí ✓":persistOk===false?"no garantit (fes còpies JSON sovint)":"desconegut"} · Base de dades local: ${idbFail?"⚠ no disponible, es desa només al navegador":"✓"}${Plat.standalone()?" · App instal·lada ✓":""}</p></div>`}
function welcomeH(){return `<div class=card style="margin-top:12px"><h2>Benvingut a l'Agenda NEXE</h2><p>Aquest dispositiu encara no té dades.</p><p class=mu>${rol()=="consulta"?"Obre la còpia que t'has enviat des del Mac (AirDrop o iCloud Drive).":"Importa la teva última còpia JSON de l'agenda."} Abans d'importar veuràs un informe amb els clients i les visites.</p><button class=pri onclick="rs()">Importar còpia JSON</button></div>`}
function expObj(){return Object.assign({},S,{_meta:{app:"Agenda NEXE",appv:APPV,exportedAt:new Date().toISOString(),device:rol(),clients:S.clients.length,visits:S.visits.length}})}
const srcT=r=>{const m=r&&r._meta,t=m&&m.exportedAt?Date.parse(m.exportedAt):0;return t||(r&&r.ts)||Date.now()};
async function sendIpad(){const f="agenda-nexe-per-ipad-"+today()+"-"+hhmm(Date.now()).replace(":","")+".json";const r=await Plat.saveFile(f,JSON.stringify(expObj()),"application/json",true);
 if(r=="ok"){lsSet("nexe_lastbk",String(Date.now()));showSt();N("Còpia preparada ("+f+"). Envia-la a l'iPad amb AirDrop o desa-la a iCloud Drive. A l'iPad: obre l'app → Ajustos → «Actualitzar des del Mac».")}else if(r=="cancel")N("Cancel·lat: no s'ha preparat cap còpia.");else N("No s'ha pogut preparar l'arxiu. Fes servir «Veure còpia (JSON)».")}
function chk(r){const E=[],W=[];if(!r||typeof r!="object"||Array.isArray(r))return{E:["L'arxiu no conté unes dades de l'agenda"],W};
 if(!Array.isArray(r.clients))E.push("Falta la llista de clients");if(!Array.isArray(r.visits))E.push("Falta la llista de visites");if(E.length)return{E,W};
 if(!r.clients.length&&!r.visits.length)E.push("La còpia està buida: substituiria totes les teves dades per res");
 const ic=new Set(),iv=new Set();let dc=0,dv=0,orf=0,bad=0,nn=0;
 r.clients.forEach(c=>{if(!c||typeof c!="object"||!c.id||ic.has(c.id))dc++;else ic.add(c.id);if(!c||!String(c.name||"").trim())nn++});
 r.visits.forEach(v=>{if(!v||typeof v!="object"||!v.id||iv.has(v.id))dv++;else iv.add(v.id);if(v&&!ic.has(v.cid))orf++;if(!v||!/^\d{4}-\d{2}-\d{2}$/.test(v.date||""))bad++});
 if(dc)E.push(dc+" clients sense identificador o amb identificador repetit");if(dv)E.push(dv+" visites sense identificador o amb identificador repetit");if(bad)E.push(bad+" visites amb una data no vàlida");
 if(orf)W.push(orf+" visites d'un client que no existeix (es conservaran)");if(nn)W.push(nn+" clients sense nom");return{E,W}}
function mig(){let ch=0;if((S.v||0)<2){S.clients.forEach(c=>{if(c.zone=="Barcelona / Vallès")c.zone=guess(c.town,"Barcelona",c.cp);else if(!Z.includes(c.zone))c.zone=guess(c.town,"",c.cp);if(/^Vendes any passat/.test(c.notes||""))c.notes=""});S.v=2;ch=1}
 if((S.v||0)<3){S.clients.forEach(c=>{delete c.zbe});S.v=3;ch=1}
 if((S.v||0)<4){S.clients.forEach(c=>{if(R.og.test(nz(c.town)))c.zone=ZOG});S.v=4;ch=1}
 if((S.v||0)<5){S.clients.forEach(c=>{if(c.zone===ZOG&&!R.og.test(nz(c.town)))c.zone=guess(c.town,"",c.cp)});S.v=5;ch=1}return ch}
async function init(){
 const okDb=await Store.open();if(!okDb)idbFail=true;
 let ls=null;try{ls=localStorage.getItem("nexe")}catch(e){}
 let idb=null;if(okDb){try{idb=await Store.getState()}catch(e){idb=null}}
 const bad=[];
 const parse=async(raw,src)=>{if(raw==null)return null;try{const o=JSON.parse(raw);if(!o||typeof o!="object"||!Array.isArray(o.clients)||!Array.isArray(o.visits))throw 0;delete o._meta;return o}catch(e){bad.push(src);await Store.keepCorrupt(raw,src);return null}};
 const a=await parse(idb,"base de dades"),b=await parse(ls,"navegador");
 const pick=a&&b?((b.ts||0)>(a.ts||0)?b:a):(a||b),other=pick===a?b:a;
 if(pick&&other&&(other.ts||0)!==(pick.ts||0)&&!isEmpty(other))await snap("versió diferent trobada en obrir",other);
 if(pick){const pre=JSON.stringify(pick);S=Object.assign(S,pick);
  if(mig()){await snap("abans d'actualitzar la versió de les dades",JSON.parse(pre));await writeLocal()}
  else if(!a||!b||(a.ts||0)!==(b.ts||0))await writeLocal()}
 else mig();
 await refreshLists();render();
 if(bad.length)N("Les dades desades ("+bad.join(" i ")+") estaven malmeses. No s'han esborrat: s'han apartat i les trobaràs a Ajustos."+(pick?" S'han carregat les dades correctes que hi havia.":" Restaura la teva última còpia JSON."));
 persistOk=await Plat.persist();if(tab=="set")render();
 Plat.registerSW(()=>{updReady=true;showSt()});
}
function M(h){$("#m").innerHTML=`<div class="mb" onclick="if(event.target==this)X()"><div class="md">${h}</div></div>`}
const X=()=>{$("#m").innerHTML=""};
let cb=null;
function Q(msg,f){cb=f;M(`<h2>${esc(msg)}</h2><div class=bt><button class=pri onclick="X();cb()">Sí</button><button onclick="X()">No</button></div>`)}
function N(msg){M(`<h2>${esc(msg)}</h2><div class=bt><button class=pri onclick="X()">D'acord</button></div>`)}
function render(){
 const y=window.scrollY,n=S.clients.filter(due).length+S.clients.filter(dueCall).length;
 $("#tabs").innerHTML=[["avui","Agenda"+(n?`<span class=n>${n}</span>`:"")],["cal","Calendari"],["clients","Clients"],["hist","Historial"],["set","Ajustos"]].map(([k,t])=>`<button class="${tab==k?"on":""}" onclick="tab='${k}';render()">${t}</button>`).join("");
 $("#app").className=tab=="avui"||tab=="cal"?"wide":"";
 $("#app").innerHTML={avui:vAvui,cal:vCal,clients:vCli,hist:vHist,set:vSet}[tab]();
 window.scrollTo(0,y);showSt();
}
function vAvui(){if(isEmpty(S))return welcomeH();
 const L=S.clients.filter(c=>c.active&&c.type!="m").filter(c=>(!zf||c.zone==zf)&&(!aq||nz(c.name+" "+c.town+" "+cn(c)).includes(nz(aq)))).sort((a,b)=>(since(b)??9999)-(since(a)??9999)||a.cls.localeCompare(b.cls)||a.name.localeCompare(b.name));
 let h=wkView(6)+`<h2>Visites del ${fd(day)}</h2>`+dayV()+callsH();
 h+=`<h2>${aq?"Resultats":"Clients per visitar"} (${L.length}${aq?"":" · "+L.filter(due).length+" ja toquen"})</h2><input id=aq type=search placeholder="Cerca client o població (ex: ram, barca…)" value="${esc(aq)}" oninput="setAq(this.value)" style="margin-bottom:8px"><div class=bar><select onchange="zf=this.value;render()"><option value="">Totes les zones</option>${Z.map(z=>`<option ${z==zf?"selected":""}>${z}</option>`).join("")}</select><button class=pri ${sel.size?"":"disabled"} onclick="planM()">Programar (${sel.size})</button></div>${day>today()?`<p class=mu>DV = dies sense visitar el dia seleccionat (${fd(day)}). En taronja, els que ja tocarien aquell dia.</p>`:""}`;
 h+=L.map(c=>{const s=since(c),p=pend(c),l=last(c),fu=day>today(),pd=l?diff(l,day):null,od=fu?(pd===null||pd>=S.cfg[c.cls]):due(c);return `<label class=card><input type=checkbox style="width:auto" ${sel.has(c.id)?"checked":""} onchange="tg('${c.id}')"> ${esc(c.name)} ${badge(c.cls)}<div class=mu>${esc(c.town)} · ${esc(c.zone)}</div><div class="${od?"wa":"mu"}">${s===null?"Mai visitat":"Fa "+s+" dies (límit "+S.cfg[c.cls]+")"}${fu&&pd!==null?` · <b>${pd} DV</b>`:""}${p?" · 📅 "+fd(p.date)+(p.deliver?" 📦":""):""}</div></label>`}).join("")||`<p class=mu>No hi ha clients actius.</p>`;
 return h}
const DN=["Dl","Dt","Dc","Dj","Dv","Ds","Dg"];
const addD=(d,n)=>{const x=new Date(d+"T12:00");x.setDate(x.getDate()+n);return iso(x)};
const mon=d=>{const x=new Date(d+"T12:00");return addD(d,-((x.getDay()+6)%7))};
let noClick=0;
function wkView(nd){
 const m=mon(day),vis=S.visits.filter(v=>v.st!="cancel"&&v.kind!="tel");let n=nd||5;
 if(vis.some(v=>v.date==addD(m,6)))n=7;
 let h=`<div class=bar><button onclick="day=addD(day,-7);render()">‹ Setm.</button><input type=date value="${day}" onchange="day=this.value||day;render()"><button onclick="day=addD(day,7);render()">Setm. ›</button><button onclick="day=today();render()">Avui</button></div><div class=wk style="grid-template-columns:repeat(${n},minmax(0,1fr))">`;
 for(let i=0;i<n;i++){const d=addD(m,i),L=vis.filter(v=>v.date==d).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
  h+=`<div class="col ${d==today()?"td":""} ${d==day?"sd":""}" data-d="${d}"><div class=ch onclick="day='${d}';render()"><span>${DN[i]} ${d.slice(8)}/${d.slice(5,7)}</span><span class=mu>${L.length||""}</span></div>`+L.map(v=>{const c=cl(v.cid)||{name:"(esborrat)",cls:"C",town:""};
   return `<div class="wv ${v.st}" onclick="vm('${v.id}')">${v.st=="plan"?`<span class=gr onpointerdown="dragStart(event,'${v.id}')">⠿</span>`:"✓ "}<b>${esc(v.time)}</b> ${esc(c.name)}${v.deliver?" 📦":""}<div class=mu>${esc(loc(c))}</div>${v.note?`<div class=mu>📝 ${esc(v.note)}</div>`:""}${badge(c.cls)}</div>`}).join("")+`</div>`}
 return h+`</div><p class=mu>Arrossega ⠿ per moure una visita a un altre dia. Toca una visita per veure-la, canviar-ne dia/hora o tancar-la.</p>`}
function dragDay(e,d){e.preventDefault();e.stopPropagation();if(ro())return;
 const L=S.visits.filter(v=>v.date==d&&v.st=="plan"&&v.kind!="tel");if(!L.length)return;
 const g=document.createElement("div");g.className="ghost";g.textContent=L.length+(L.length>1?" visites":" visita")+" del "+fd(d).slice(0,5);document.body.appendChild(g);let tgt=null;
 const clr=()=>document.querySelectorAll(".col.ov").forEach(x=>x.classList.remove("ov"));
 const mv=ev=>{g.style.left=ev.clientX+8+"px";g.style.top=ev.clientY+8+"px";const el=document.elementFromPoint(ev.clientX,ev.clientY),col=el&&el.closest?el.closest("[data-d]"):null;clr();if(col){col.classList.add("ov");tgt=col.dataset.d}else tgt=null};
 const up=ev=>{document.removeEventListener("pointermove",mv);document.removeEventListener("pointerup",up);document.removeEventListener("pointercancel",up);g.remove();clr();noClick=Date.now();render();
  if(tgt&&ev.type=="pointerup"&&tgt!=d)Q("Moure "+L.length+(L.length>1?" visites":" visita")+" del "+fd(d)+" al "+fd(tgt)+"?",()=>{L.forEach(v=>v.date=tgt);day=tgt;save();render()})};
 document.addEventListener("pointermove",mv);document.addEventListener("pointerup",up);document.addEventListener("pointercancel",up);mv(e)}
function dragStart(e,id){e.preventDefault();e.stopPropagation();if(ro())return;const v=S.visits.find(x=>x.id==id);if(!v)return;const c=cl(v.cid)||{name:""};
 const g=document.createElement("div");g.className="ghost";g.textContent=(v.time||"")+" "+c.name;document.body.appendChild(g);let tgt=null;
 const clr=()=>document.querySelectorAll(".col.ov").forEach(x=>x.classList.remove("ov"));
 const mv=ev=>{g.style.left=ev.clientX+8+"px";g.style.top=ev.clientY+8+"px";const el=document.elementFromPoint(ev.clientX,ev.clientY),col=el&&el.closest?el.closest("[data-d]"):null;clr();if(col){col.classList.add("ov");tgt=col.dataset.d}else tgt=null};
 const up=ev=>{document.removeEventListener("pointermove",mv);document.removeEventListener("pointerup",up);document.removeEventListener("pointercancel",up);g.remove();clr();noClick=Date.now();
  if(tgt&&ev.type=="pointerup"&&tgt!=v.date){v.date=tgt;day=tgt;save()}render()};
 document.addEventListener("pointermove",mv);document.addEventListener("pointerup",up);document.addEventListener("pointercancel",up);mv(e)}
function vm(id){if(Date.now()-noClick<400)return;const v=S.visits.find(x=>x.id==id);if(!v)return;const c=cl(v.cid)||{name:"(esborrat)",town:""};
 M(`<h2>${esc(c.name)}</h2><p class=mu>${esc(loc(c))}${v.comment?" · "+esc(v.comment):""}</p>${(c.contacts||[]).length?`<p class=mu>👤 ${cdl(c)}</p>`:""}${v.st=="plan"?lastH(c):""}`+(v.st=="plan"?`<label class=f>Dia</label><input type=date id=md value="${v.date}"><label class=f>Hora</label><input type=time id=mt value="${esc(v.time||"")}"><label class=f>Nota per recordar</label><textarea id=mn rows=3>${esc(v.note||"")}</textarea><label style="display:flex;gap:6px;align-items:center;margin:8px 0"><input type=checkbox id=mdl ${v.deliver?"checked":""} style="width:auto"> 📦 Tinc una comanda per entregar</label><div class=bt><button class=pri onclick="doMove('${id}')">Moure</button><button onclick="closeV('${id}')">Tancar visita</button><button onclick="X();delV('${id}')">Anul·lar</button></div>`:`${v.note?`<p class=mu>📝 ${esc(v.note)}</p>`:""}<div class=ok>✓ Feta ${fd(v.date)}${v.deliver?" · 📦 amb comanda":""}</div><label class=f>Comentari de la visita</label><textarea id=mc rows=4>${esc(v.comment||"")}</textarea><div class=bt style="flex-wrap:wrap"><button class=pri onclick="doEditC('${id}')">Guardar</button><button onclick="X()">Tancar</button>${v.kind!="tel"?`<button onclick="reopenV('${id}')">Reobrir</button>`:""}<button onclick="X();delDoneV('${id}')">Esborrar visita</button></div>`))}
function doEditC(id){if(ro())return;const v=S.visits.find(x=>x.id==id);v.comment=$("#mc").value.trim();save();X();render()}
function doMove(id){if(ro())return;const v=S.visits.find(x=>x.id==id);v.date=$("#md").value||v.date;v.time=$("#mt").value||v.time;v.note=$("#mn").value.trim();v.deliver=$("#mdl").checked===true;day=v.date;save();X();render()}
function dayV(){
 const pl=S.visits.filter(v=>v.date==day&&v.st!="cancel"&&v.kind!="tel").sort((a,b)=>(a.time||"").localeCompare(b.time||""));
 return pl.length?pl.map(v=>{const c=cl(v.cid)||{name:"(esborrat)",cls:"C",town:"",zone:""};return `<div class="card ${v.st}"><b>${esc(v.time)}</b> ${esc(c.name)} ${badge(c.cls)}${v.deliver?" 📦":""}<div class=mu>${esc(loc(c))} · ${esc(c.zone)}</div>${v.deliver?`<div class=cm>📦 Comanda per entregar</div>`:""}${v.note?`<div class=cm>📝 ${esc(v.note)}</div>`:""}${v.comment?`<div class=cm>${esc(v.comment)}</div>`:""}${v.st=="plan"&&c.id?lastH(c):""}${v.st=="plan"?`<div class=bt><button class=pri onclick="closeV('${v.id}')">Tancar visita</button><button onclick="delV('${v.id}')">Anul·lar</button></div>`:`<div class=ok>✓ Feta</div><div class=bt><button onclick="vm('${v.id}')">Editar comentari</button></div>`}</div>`}).join(""):`<p class=mu>Cap visita programada aquest dia.</p>`}
const MN=["Gener","Febrer","Març","Abril","Maig","Juny","Juliol","Agost","Setembre","Octubre","Novembre","Desembre"];
function vCal(){
 const tg=`<div class=bar><button class="${cv=="mes"?"pri":""}" onclick="cv='mes';render()">Mes</button><button class="${cv=="set"?"pri":""}" onclick="cv='set';render()">Setmana</button><button onclick="ics()" style="margin-left:auto">⬇ Exportar .ics</button></div>`;
 if(cv=="set")return tg+wkView(7)+`<h2>Visites del ${fd(day)}</h2>`+dayV();
 const y=+day.slice(0,4),mo=+day.slice(5,7)-1,first=iso(new Date(y,mo,1,12)),last=iso(new Date(y,mo+1,0,12)),vis=S.visits.filter(v=>v.st!="cancel"&&v.kind!="tel");
 let h=tg+`<div class=bar><button onclick="moveM(-1)">‹ Mes</button><b style="flex:1;text-align:center">${MN[mo]} ${y}</b><button onclick="moveM(1)">Mes ›</button><button onclick="day=today();render()">Avui</button></div><div class=cal>`+DN.map(d=>`<div class=ch style="justify-content:center">${d}</div>`).join("");
 for(let d=mon(first);d<=last||new Date(d+"T12:00").getDay()!=1;d=addD(d,1)){
  const L=vis.filter(v=>v.date==d).sort((a,b)=>(a.time||"").localeCompare(b.time||""));
  h+=`<div class="col mc ${d==today()?"td":""} ${d==day?"sd":""} ${d.slice(0,7)!=first.slice(0,7)?"o":""}" data-d="${d}" onclick="day='${d}';render()"><div class=ch><span>${+d.slice(8)}${L.some(v=>v.st=="plan")?` <span class=gr style="font-size:14px;padding:0 0 0 4px" title="Arrossega tot el dia" onpointerdown="dragDay(event,'${d}')">⇄</span>`:""}</span><span class=mu>${L.length||""}</span></div>`+L.slice(0,3).map(v=>{const c=cl(v.cid)||{name:"?",cls:"C"};return `<div class="mv ${v.st}" onclick="event.stopPropagation();vm('${v.id}')">${v.st=="plan"?`<span class=gr style="font-size:12px;padding-right:3px" onpointerdown="dragStart(event,'${v.id}')">⠿</span>`:"✓"}${esc(v.time||"")} ${esc(c.name)}${v.deliver?" 📦":""}${v.note?" 📝":""}</div>`}).join("")+(L.length>3?`<div class=mu>+${L.length-3} més</div>`:"")+`</div>`}
 return h+`</div><p class=mu>Toca un dia per veure'n les visites. Arrossega ⠿ per moure una visita, o ⇄ (al costat del número del dia) per moure totes les visites programades d'aquell dia a un altre.</p><h2>Visites del ${fd(day)}</h2>`+dayV()}
function moveM(n){const x=new Date(day+"T12:00");x.setMonth(x.getMonth()+n,1);day=iso(x);render()}
function keep(id,v){const e=$("#"+id);if(e){e.focus();try{e.setSelectionRange(v.length,v.length)}catch(x){}}}
function setQ(v){q=v;render();keep("cq",v)}
function setH(v){hq=v;render();keep("hqi",v)}
function setAq(v){aq=v;render();const e=$("#aq");if(e){e.focus();e.setSelectionRange(v.length,v.length)}}
let ect=[];
const loc=c=>[c.addr,c.town].filter(Boolean).join(", ");
const cn=c=>(c.contacts||[]).map(x=>x.name+" "+x.role).join(" ");
const cdl=c=>(c.contacts||[]).map(x=>esc(x.name)+(x.role?" ("+esc(x.role)+")":"")+(x.phone?` · <a href="tel:${esc(x.phone)}" onclick="event.stopPropagation()">${esc(x.phone)}</a>`:"")+(x.email?` · <a href="mailto:${esc(x.email)}" onclick="event.stopPropagation()">${esc(x.email)}</a>`:"")).join("<br>");
function ctsH(){return ect.map((x,i)=>`<div class=card style="margin:6px 0"><input id=cn${i} placeholder="Nom" value="${esc(x.name)}"><input id=cr${i} placeholder="Càrrec (ex: compres, gerent)" value="${esc(x.role)}" style="margin-top:4px"><input id=cp${i} type=tel placeholder="Telèfon" value="${esc(x.phone)}" style="margin-top:4px"><input id=ce${i} type=email placeholder="Correu" value="${esc(x.email)}" style="margin-top:4px"><button onclick="rmC(${i})" style="margin-top:6px">Treure</button></div>`).join("")}
function syncC(){ect.forEach((x,i)=>{x.name=$("#cn"+i).value.trim();x.role=$("#cr"+i).value.trim();x.phone=$("#cp"+i).value.trim();x.email=$("#ce"+i).value.trim()})}
function addC(){syncC();ect.push({name:"",role:"",phone:"",email:""});$("#cts").innerHTML=ctsH()}
function rmC(i){syncC();ect.splice(i,1);$("#cts").innerHTML=ctsH()}
function callsH(){
 const L=S.clients.filter(c=>c.type=="m"&&c.active&&(!aq||nz(c.name+" "+c.town+" "+cn(c)).includes(nz(aq)))).sort((a,b)=>(since(b)??9999)-(since(a)??9999));
 if(!L.length)return"";
 return `<h2>📞 Montadors (${L.filter(dueCall).length} per trucar)</h2>`+L.map(c=>{const s=since(c),od=dueCall(c);
  return `<div class=card><b>${esc(c.name)}</b> ${badge(c.cls)}<div class=mu>${esc(c.town)}${c.phone?` · <a href="tel:${esc(c.phone)}">${esc(c.phone)}</a>`:""}</div>${(c.contacts||[]).length?`<div class=mu>👤 ${cdl(c)}</div>`:""}<div class="${od?"wa":"mu"}">${s===null?"Mai contactat":"Última conversa fa "+s+" dies"}${od?" ⚠ (límit "+CM()+")":""}</div><div class=bt><button class=pri onclick="callV('${c.id}')">📞 He parlat</button></div></div>`}).join("")}
function callV(cid){if(ro())return;M(`<h2>Conversa amb ${esc(cl(cid).name)}</h2><label class=f>Comentari (opcional)</label><textarea id=cm rows=4></textarea><div class=bt><button class=pri onclick="doCall('${cid}')">Guardar</button><button onclick="X()">Cancel·lar</button></div>`)}
function doCall(cid){if(ro())return;const n=new Date();S.visits.push({id:uid(),cid,date:today(),time:n.toTimeString().slice(0,5),st:"done",kind:"tel",comment:$("#cm").value.trim()});save();X();render()}
function tg(id){sel.has(id)?sel.delete(id):sel.add(id);render()}
const selS=()=>[...sel].map(cl).filter(Boolean).sort((a,b)=>a.zone.localeCompare(b.zone)||a.town.localeCompare(b.town)||a.name.localeCompare(b.name));
function planM(){if(ro())return;M(`<h2>Programar ${sel.size} visites</h2><label class=f>Dia</label><input type=date id=pd value="${day}"><label class=f>Hora d'inici</label><input type=time id=pt value="09:00"><label class=f>Minuts per visita (inclou desplaçament)</label><input type=number id=pm value=60><p class=mu>S'ordenen per zona i població i es reparteixen una darrere l'altra.</p><label class=f>Notes per recordar (opcional)</label>${selS().map((c,i)=>`<div style="margin:4px 0"><span class=mu>${i+1}. ${esc(c.name)}</span><input id=pn${i} placeholder="Nota per a aquesta visita"><label style="display:flex;gap:6px;align-items:center;margin:4px 0"><input type=checkbox id=pc${i} style="width:auto"> 📦 Tinc una comanda per entregar</label></div>`).join("")}<div class=bt><button class=pri onclick="doPlan()">Programar</button><button onclick="X()">Cancel·lar</button></div>`)}
function doPlan(){if(ro())return;
 const d=$("#pd").value,m=+$("#pm").value||60;let[hh,mm]=$("#pt").value.split(":").map(Number),t=hh*60+mm;
 selS().forEach((c,i)=>{
  S.visits.push({id:uid(),cid:c.id,date:d,note:(($("#pn"+i)||{}).value||"").trim(),deliver:($("#pc"+i)||{}).checked===true,time:String(t/60|0).padStart(2,"0")+":"+String(t%60).padStart(2,"0"),dur:m,st:"plan",comment:""});t+=m});
 sel.clear();day=d;tab="avui";save();X();render()}
function closeV(id){if(ro())return;const v0=S.visits.find(x=>x.id==id)||{};M(`<h2>Tancar visita</h2>${v0.deliver?`<p class=mu>📦 Comanda per entregar</p>`:""}${v0.note?`<p class=mu>📝 ${esc(v0.note)}</p>`:""}<label class=f>Comentari (opcional)</label><textarea id=cm rows=4>${esc(v0.comment||"")}</textarea><div class=bt><button class=pri onclick="doClose('${id}')">Tancar</button><button onclick="X()">Cancel·lar</button></div>`)}
function doClose(id){if(ro())return;const v=S.visits.find(v=>v.id==id);v.st="done";v.comment=$("#cm").value.trim();if(v.date>today())v.date=today();save();X();render()}
function reopenV(id){if(ro())return;const v=S.visits.find(x=>x.id==id);if(!v||v.kind=="tel")return;v.st="plan";save();X();render()}
function delDoneV(id){if(ro())return;const v=S.visits.find(x=>x.id==id);if(!v)return;const c=cl(v.cid)||{name:"(esborrat)"};Q("Esborrar de l'historial la visita tancada de "+c.name+" del "+fd(v.date)+"? Abans es guardarà una còpia interna.",async()=>{if(!await snap("abans d'esborrar una visita de "+c.name)){N(SNAPFAIL);return}S.visits=S.visits.filter(x=>x.id!=id);save();render()})}
function delV(id){if(ro())return;Q("Anul·lar aquesta visita?",()=>{S.visits=S.visits.filter(v=>v.id!=id);save();render()})}
function quickV(cid){if(ro())return;M(`<h2>Visita feta: ${esc(cl(cid).name)}</h2><label class=f>Comentari (opcional)</label><textarea id=cm rows=4></textarea><div class=bt><button class=pri onclick="doQuick('${cid}')">Guardar</button><button onclick="X()">Cancel·lar</button></div>`)}
function doQuick(cid){if(ro())return;const n=new Date();S.visits.push({id:uid(),cid,date:today(),time:n.toTimeString().slice(0,5),st:"done",comment:$("#cm").value.trim()});save();X();render()}
function vCli(){
 const L=S.clients.filter(c=>(!q||nz(c.name+" "+c.town+" "+cn(c)).includes(nz(q)))&&(!fz||c.zone==fz)&&(!fc||c.cls==fc)&&(fa===""||String(+c.active)==fa)).sort((a,b)=>a.name.localeCompare(b.name));
 return `<div class=bar><input id=cq placeholder="Cerca client o població" value="${esc(q)}" oninput="setQ(this.value)"><button class=pri onclick="edM()">+ Nou</button><button onclick="impM()">Importar</button></div>
<div class=bar><select onchange="fz=this.value;render()"><option value="">Zona</option>${Z.map(z=>`<option ${z==fz?"selected":""}>${z}</option>`).join("")}</select><select onchange="fc=this.value;render()"><option value="">Classe</option>${["A","B","C"].map(c=>`<option ${c==fc?"selected":""}>${c}</option>`).join("")}</select><select onchange="fa=this.value;render()"><option value="">Tots</option><option value=1 ${fa=="1"?"selected":""}>Actius</option><option value=0 ${fa=="0"?"selected":""}>Inactius</option></select></div>
<p class=mu>${L.length} de ${S.clients.length} clients</p>`+L.map(c=>{const s=since(c);return `<div class=card ${c.active?"":"style=opacity:.55"}><div onclick="edM('${c.id}')"><b>${esc(c.name)}</b> ${badge(c.cls)}${c.type=="m"?` <span class="b bm">📞 MONTADOR</span>`:""} ${c.active?"":"<span class=mu>(inactiu)</span>"}<div class=mu>${esc(c.town)} · ${esc(c.zone)}${c.phone?" · "+esc(c.phone):""}</div>${(c.contacts||[]).length?`<div class=mu>👤 ${cdl(c)}</div>`:""}<div class=mu>${c.type=="m"?(s===null?"Mai contactat":"Última conversa fa "+s+" dies"+(dueCall(c)?" ⚠":"")):(s===null?"Mai visitat":"Última visita fa "+s+" dies")}</div></div>${c.active?(c.type=="m"?`<div class=bt><button onclick="callV('${c.id}')">📞 He parlat</button></div>`:`<div class=bt><button onclick="quickV('${c.id}')">✓ Visitat avui</button></div>`):""}</div>`}).join("")}
function edM(id){const c=id?cl(id):{name:"",town:"",zone:"Altres",cls:"C",active:true,phone:"",notes:""};
 ect=(c.contacts||[]).map(x=>({...x}));
 M(`<h2>${id?"Editar":"Nou"} client</h2>${id?lastH(c):""}<label class=f>Nom</label><input id=en value="${esc(c.name)}"><label class=f>Població</label><input id=et value="${esc(c.town)}"><label class=f>Zona</label><select id=ez>${Z.map(z=>`<option ${z==c.zone?"selected":""}>${z}</option>`).join("")}</select><label class=f>Classe</label><select id=ec>${["A","B","C"].map(x=>`<option ${x==c.cls?"selected":""}>${x}</option>`).join("")}</select><label class=f>Estat</label><select id=ea><option value=1 ${c.active?"selected":""}>Actiu</option><option value=0 ${c.active?"":"selected"}>Inactiu</option></select><label class=f>Tipus de client</label><select id=ety><option value="" ${c.type=="m"?"":"selected"}>Visita presencial</option><option value=m ${c.type=="m"?"selected":""}>Montador (venda per telèfon)</option></select><label class=f>Telèfon</label><input id=ep value="${esc(c.phone)}"><label class=f>Correu</label><input id=ee value="${esc(c.email||"")}"><label class=f>Adreça</label><input id=ed value="${esc(c.addr||"")}"><label class=f>Persones de contacte</label><div id=cts>${ctsH()}</div><button onclick="addC()" style="margin-top:4px">+ Afegir contacte</button><label class=f>Notes</label><textarea id=eo rows=3>${esc(c.notes)}</textarea><div class=bt><button class=pri onclick="saveC('${id||""}')">Guardar</button><button onclick="X()">Cancel·lar</button>${id?`<button onclick="delC('${id}')">Esborrar</button>`:""}</div>`)}
function saveC(id){if(ro())return;syncC();const o={type:$("#ety").value,contacts:ect.filter(x=>x.name||x.phone||x.email),name:$("#en").value.trim(),town:$("#et").value.trim(),zone:$("#ez").value,cls:$("#ec").value,active:$("#ea").value=="1",phone:$("#ep").value.trim(),email:$("#ee").value.trim(),addr:$("#ed").value.trim(),notes:$("#eo").value.trim()};if(!o.name)return;
 if(id)Object.assign(cl(id),o);else S.clients.push({id:uid(),...o});save();X();render()}
function delC(id){if(ro())return;Q("Esborrar client i el seu historial? Millor posar-lo inactiu.",async()=>{if(!await snap("abans d'esborrar "+((cl(id)||{}).name||"un client"))){N(SNAPFAIL);return}S.clients=S.clients.filter(c=>c.id!=id);S.visits=S.visits.filter(v=>v.cid!=id);sel.delete(id);save();render()})}
function impM(){if(ro())return;M(`<h2>Importar clients</h2><p class=mu>Puja el CSV de Salesforce/Numbers (separat per ;) o enganxa files: Nom, Població, Zona (opcional), Classe (opcional). Les dates de visites i les vendes antigues no es guarden (les vendes només serveixen per a la classe inicial). Els duplicats pel nom no s'afegeixen.</p><input type=file id=if accept=".csv,.txt"><textarea id=im rows=5 style="margin-top:8px"></textarea><label class=f><input type=checkbox id=iv checked style="width:auto"> Classe inicial segons vendes de l'any passat (no es guarden)</label><div class=bar><input type=number id=ia value=26000><input type=number id=ib value=3400></div><p class=mu>A = vendes ≥ primer valor (€), B = ≥ segon valor, C = la resta. Ho pots canviar client a client.</p><div class=bt><button class=pri onclick="doImp()">Importar</button><button onclick="X()">Cancel·lar</button></div>`);
 $("#if").onchange=e=>{const f=e.target.files[0];if(f)f.text().then(t=>$("#im").value=t)}}
const nm=x=>parseFloat(String(x||"").replace(/\./g,"").replace(",","."))||0;
async function doImp(){if(ro())return;if(!await snap("abans d'importar clients")){N(SNAPFAIL);return}const have=new Set(S.clients.map(c=>c.name.toLowerCase())),rows=$("#im").value.split(/\r?\n/).filter(l=>l.trim()).map(l=>l.split(/\t|;/).map(x=>x.trim().replace(/^"|"$/g,"")));let n=0;
 const H=rows[0]||[],hm=/^nombre de la cuenta|^nom|^client|^compte/i.test(H[0]||"");const ix=r=>H.findIndex(h=>r.test(h));
 const I=hm&&H.length>4?{n:0,m:ix(/e-?mail/i),a:ix(/direcci/i),cp:ix(/c[oó]digo postal/i),t:ix(/poblaci/i),p:ix(/estado|provincia/i),v:ix(/ventas del a[nñ]o pasado$/i)}:null;
 const A=+$("#ia").value||26000,B=+$("#ib").value||3400,uv=$("#iv").checked;
 rows.slice(hm?1:0).forEach(p=>{const g=k=>I&&I[k]>=0?(p[I[k]]||""):"";const name=p[0];if(!name||have.has(name.toLowerCase()))return;have.add(name.toLowerCase());
  const cp=g("cp");let town=I?g("t"):(p[1]||"");if(!town){if(/^0?80[0-4]\d$/.test(cp))town="Barcelona";else if(/^0?8173$/.test(cp))town="Sant Cugat del Vallès"}const zone=I?guess(town,g("p"),cp):(Z.find(z=>z.toLowerCase()==(p[2]||"").toLowerCase())||guess(town)),ven=I?nm(g("v")):0;
  let cls=I?(uv?(ven>=A?"A":ven>=B?"B":"C"):"C"):(/^[ABC]$/i.test(p[3]||"")?p[3].toUpperCase():"C");
  S.clients.push({id:uid(),name,town,zone,cls,active:true,phone:"",email:g("m"),addr:g("a"),cp,notes:""});n++});
 save();tab="clients";render();N(n+" clients afegits")}
function vHist(){
 const L=S.visits.filter(v=>v.st=="done").sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time)).filter(v=>{const c=cl(v.cid);return!hq||(c&&c.name.toLowerCase().includes(hq.toLowerCase()))});
 return `<div class=bar><input id=hqi placeholder="Cerca per client" value="${esc(hq)}" oninput="setH(this.value)"></div>`+(L.map(v=>{const c=cl(v.cid)||{name:"(esborrat)",cls:"C",town:""};return `<div class=card onclick="vm('${v.id}')" style="cursor:pointer"><b>${fd(v.date)} ${esc(v.time||"")}${v.kind=="tel"?" 📞":""}${v.deliver?" 📦":""}</b> ${esc(c.name)} ${badge(c.cls)}<div class=mu>${esc(c.town)}</div>${v.note?`<div class=mu>📝 ${esc(v.note)}</div>`:""}${v.comment?`<div class=cm>${esc(v.comment)}</div>`:""}</div>`}).join("")||`<p class=mu>Encara no hi ha visites tancades.</p>`)}
function vSet(){return `<h2>Dies màxims sense visita</h2><div class=card>${["A","B","C"].map(k=>`<label class=f>Classe ${k}: avisar passats (dies)</label><input type=number value="${S.cfg[k]}" onchange="setCfg('${k}',this.value)">`).join("")}<label class=f>Montadors (trucada): avisar passats (dies)</label><input type=number value="${CM()}" onchange="setCfg('M',this.value)"></div>
<h2>Actius / inactius per zona</h2><div class=card>${Z.map((z,i)=>{const L=S.clients.filter(c=>c.zone==z),n=L.filter(c=>c.active).length;return L.length?`<div class=bar style="margin:6px 0"><span style="flex:1">${esc(z)} <span class=mu>(${n} actius de ${L.length})</span></span><button onclick="zAct(${i},false)">Inactius</button><button onclick="zAct(${i},true)">Actius</button></div>`:""}).join("")}</div>
<h2>Calendari</h2><div class=card><p class=mu>Exporta les visites programades a partir del dia que tinguis seleccionat al calendari, per afegir-les al Calendari d'Apple.</p><button onclick="ics()">Exportar .ics</button></div>
${devH()}<h2>Còpia de seguretat</h2><div class=card><p class=mu>Les dades es desen en aquest dispositiu. Fes una còpia JSON sovint i guarda-la fora (per exemple, a iCloud Drive).</p><div class=bt>${rol()=="principal"?`<button class=pri onclick="saveBk(1)">Guardar còpia JSON</button><button onclick="bk()">Veure còpia (JSON)</button><button onclick="rs()">Restaurar</button><button onclick="sendIpad()">Enviar a l'iPad</button>`:`<button class=pri onclick="rs()">Actualitzar des del Mac</button><button onclick="bk()">Veure còpia (JSON)</button><button onclick="saveBk(1)">Guardar còpia JSON</button>`}</div><p class=mu>${lbTxt()}</p></div>${snapsH()}`}
function zAct(i,v){if(ro())return;const z=Z[i],L=S.clients.filter(c=>c.zone==z);Q((v?"Posar actius":"Posar inactius")+" els "+L.length+" clients de "+z+"?",async()=>{if(!await snap("abans de posar "+(v?"actius":"inactius")+" els clients de "+z)){N(SNAPFAIL);return}L.forEach(c=>c.active=v);save();render()})}
function ics(){const E=s=>String(s).replace(/[\\;,]/g,"\\$&").replace(/\n/g," ");const nw=new Date(),ST=nw.toISOString().replace(/[-:]/g,"").slice(0,15)+"Z",SQ=Math.floor(nw.getTime()/1000);let o=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//NEXE//Agenda//CA","CALSCALE:GREGORIAN"];
 S.visits.filter(v=>v.st=="plan"&&v.kind!="tel"&&v.date>=day).forEach(v=>{const c=cl(v.cid);if(!c)return;const[h,m]=(v.time||"09:00").split(":").map(Number),e=h*60+m+(v.dur||60),s=v.date.replace(/-/g,"");const T=x=>String(x/60|0).padStart(2,"0")+String(x%60).padStart(2,"0")+"00";
  o.push("BEGIN:VEVENT","UID:"+v.id+"@nexe",`DTSTAMP:${ST}`,"SEQUENCE:"+SQ,"LAST-MODIFIED:"+ST,`DTSTART:${s}T${T(h*60+m)}`,`DTEND:${s}T${T(Math.min(e,1439))}`,"SUMMARY:"+E("Visita "+c.name+(v.deliver?" (entregar comanda)":"")),"LOCATION:"+E(loc(c)),"END:VEVENT")});
 o.push("END:VCALENDAR");const fold=l=>{let r="";while(l.length>60){r+=l.slice(0,60)+"\r\n ";l=l.slice(60)}return r+l},data=o.map(fold).join("\r\n");
 const n=S.visits.filter(v=>v.st=="plan"&&v.kind!="tel"&&v.date>=day&&cl(v.cid)).length;if(!n){N("No hi ha visites programades a partir del "+fd(day)+".");return}
 icsData=data;M(`<h2>Exportar visites (.ics)</h2><p class=mu>${n} visites programades a partir del ${fd(day)}.</p><textarea rows=8 onfocus="this.select()">${esc(data)}</textarea><div class=bt><button class=pri onclick="saveIcs()">Guardar arxiu</button><button onclick="X()">Tancar</button></div><p class=mu id=bs></p><p class=mu>Es desarà com a arxiu .ics. Obre'l per afegir les visites al Calendari d'Apple.</p>`)}
let icsData="";
async function saveIcs(){const f="visites-nexe-des-de-"+day+".ics",st=m=>{const e=$("#bs");if(e)e.textContent=m};const r=await Plat.saveFile(f,icsData,"text/calendar");
 st(r=="ok"?(Plat.isIOS()?"Arxiu preparat: "+f+". Obre'l amb Calendari.":"Arxiu desat a Descàrregues: "+f+". Obre'l per afegir les visites al Calendari."):r=="cancel"?"Cancel·lat.":"No s'ha pogut desar l'arxiu. Copia el text de dalt.")}
function bk(){M(`<h2>Còpia de seguretat</h2><textarea rows=10 onfocus="this.select()">${esc(JSON.stringify(expObj()))}</textarea><div class=bt><button class=pri onclick="saveBk()">Guardar arxiu</button><button onclick="X()">Tancar</button></div><p class=mu id=bs></p>`)}
async function saveBk(direct){const f="agenda-nexe-"+today()+"-"+hhmm(Date.now()).replace(":","")+".json";const r=await Plat.saveFile(f,JSON.stringify(expObj()),"application/json");
 const msg=r=="ok"?(Plat.isIOS()?"Còpia preparada: "+f+". Desa-la a Arxius o a iCloud Drive.":"Còpia desada a Descàrregues: "+f):r=="cancel"?"Cancel·lat: no s'ha desat cap còpia.":"No s'ha pogut desar l'arxiu. Fes servir «Veure còpia (JSON)» i copia el text.";
 if(r=="ok"){lsSet("nexe_lastbk",String(Date.now()));showSt()}const e=$("#bs");if(e&&!direct)e.textContent=msg;else N(msg)}
function rs(){M(`<h2>Restaurar</h2><p class=mu>Tria l'arxiu .json guardat o enganxa'n el text. Substitueix totes les dades actuals.</p><input type=file id=rf accept=".json,.txt" onchange="loadF(this,'rj')"><textarea id=rj rows=8 style="margin-top:8px"></textarea><div class=bt><button class=pri onclick="doRs()">Restaurar</button><button onclick="X()">Cancel·lar</button></div>`)}
function loadF(el,id){const f=el.files[0];if(f)f.text().then(t=>{$("#"+id).value=t})}
function doRs(){let r;try{r=JSON.parse($("#rj").value)}catch(e){N("L'arxiu no és un JSON vàlid. No s'ha canviat res.");return}
 const {E,W}=chk(r),m=r&&r._meta,c=cnt(r),a=cnt(S),old=E.length?0:((r.ts||0)&&(S.ts||0)&&r.ts<S.ts);rsData=E.length?null:r;
 M(`<h2>Informe de la còpia</h2><div class=card><b>${c.c} clients · ${c.v} visites</b>${E.length&&!Array.isArray(r&&r.clients)?"":`<div class=mu>Versió de les dades ${esc(r.v||"?")}${(r.v||0)<5?" → 5 (s'actualitzarà)":""}${r.ts?" · desada el "+fdt(r.ts):""}${m&&m.exportedAt?" · exportada el "+fdt(Date.parse(m.exportedAt)):""}</div>`}<div class=mu>Ara tens: ${a.c} clients · ${a.v} visites</div></div>`
  +E.map(x=>`<p class=wa>✗ ${esc(x)}</p>`).join("")+W.map(x=>`<p class=wa>! ${esc(x)}</p>`).join("")+(old?`<p class=wa>! Aquesta còpia és més antiga que les dades actuals.</p>`:"")
  +(!E.length&&!W.length&&!old?`<p class=ok>✓ Cap problema detectat</p>`:"")
  +(E.length?`<p>No es pot restaurar aquesta còpia. No s'ha canviat res.</p><div class=bt><button onclick="X()">Tancar</button></div>`
   :`<p class=mu>Abans de substituir-les, les dades actuals es guardaran com a còpia interna (Ajustos → Còpies internes).</p><div class=bt><button class=pri onclick="applyRs()">Substituir</button><button onclick="X()">Cancel·lar</button></div>`))}
async function applyRs(){const r=rsData;rsData=null;if(!r)return;if(!await snap(rol()=="consulta"?"abans d'actualitzar des del Mac":"abans de restaurar")){X();N(SNAPFAIL);return}
 S=Object.assign({cfg:{A:30,B:60,C:90}},JSON.parse(JSON.stringify(r)));delete S._meta;mig();await save();lsSet("nexe_from",String(srcT(r)));X();render();N("Còpia restaurada: "+cnt(S).c+" clients i "+cnt(S).v+" visites.")}
init();
