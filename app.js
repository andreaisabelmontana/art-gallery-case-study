"use strict";
const $=s=>document.querySelector(s);
const el=(tag,text,attrs={})=>{const x=document.createElement(tag); if(text!==undefined)x.textContent=text; for(const [k,v] of Object.entries(attrs))x.setAttribute(k,v); return x};
const currency=new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0});
const money=n=>currency.format(n)+" COP";
const artist=id=>DB.artist.find(x=>x.artist_id===id);
const group=id=>DB.art_group.find(x=>x.group_code===id);
const groupsOf=id=>DB.artwork_group.filter(x=>x.artwork_id===id).map(x=>x.group_code);
const normalized=x=>x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const palettes=[["#b9593c","#efbd8a","#713a3e"],["#54786e","#d5c793","#394536"],["#76728a","#d7b8a3","#56434f"],["#b18b5a","#e7d6ae","#604436"],["#435d76","#a2b5c4","#271f40"],["#a47858","#d8ab76","#445648"]];
const thumb=w=>{const x=el("span",undefined,{class:"art","aria-hidden":"true"});palettes[DB.artwork.indexOf(w)].forEach((c,i)=>x.style.setProperty("--"+String.fromCharCode(97+i),c));return x};
const chips=xs=>{const wrap=el("div",undefined,{class:"chips"});xs.forEach(x=>wrap.append(el("span",x,{class:"chip"})));return wrap};
for(const g of DB.art_group)$("#group").append(el("option",g.name,{value:g.group_code}));
for(const c of DB.customer)$("#collector").append(el("option",c.name,{value:c.customer_id}));
function detail(w){const a=artist(w.artist_id), d=$("#dialogContent");
d.replaceChildren(thumb(w),el("p",w.artwork_id+" / "+w.art_type+" / "+w.year,{class:"eyebrow"}),el("h2",w.title,{id:"detailTitle"}),el("p",money(w.price_cop)),el("h3",a.name),el("p",a.artist_id+" · Born "+a.birthdate+" in "+a.birthplace+" · "+a.style),chips(groupsOf(w.artwork_id).map(g=>group(g).name)),el("p","Fictional artwork and artist.",{class:"muted"}));
$("#detail").showModal();}
function catalogue(){const q=normalized($("#search").value.trim()),t=$("#type").value,g=$("#group").value;
const hits=DB.artwork.filter(w=>(!t||t===w.art_type)&&(!g||groupsOf(w.artwork_id).includes(g))&&normalized([w.title,artist(w.artist_id).name,w.artwork_id].join(" ")).includes(q));
$("#count").textContent=hits.length+" of "+DB.artwork.length+" demo works";
$("#works").replaceChildren(...hits.map(w=>{const b=el("button",undefined,{type:"button",class:"card","aria-label":"View "+w.title});b.append(thumb(w),el("h3",w.title),el("span",artist(w.artist_id).name+" · "+w.year,{class:"muted"}));b.addEventListener("click",()=>detail(w));return b}));
if(!hits.length)$("#works").append(el("p","No works match those filters."));}
function table(headers,data){const t=el("table"),h=el("thead"),b=el("tbody"),r=el("tr");headers.forEach(x=>r.append(el("th",x,{scope:"col"})));h.append(r);data.forEach(row=>{const x=el("tr");row.forEach(c=>x.append(el("td",c)));b.append(x)});t.append(h,b);return t}
function query(){const kind=$("#query").value,cid=$("#collector").value;$("#collectorLabel").hidden=kind!=="preferences";const p=$("#profile");p.hidden=kind!=="preferences";let sql,cols,rows;
if(kind==="catalogue"){sql="SELECT * FROM gallery_catalogue\nWHERE art_type = 'Photography'\nORDER BY price_cop;";cols=["ID","Title","Artist","Year","Art type","Price"];rows=DB.artwork.filter(w=>w.art_type==="Photography").sort((a,b)=>a.price_cop-b.price_cop).map(w=>[w.artwork_id,w.title,artist(w.artist_id).name,w.year,w.art_type,money(w.price_cop)]);}
else if(kind==="groups"){sql="SELECT * FROM group_inventory ORDER BY group_code;";cols=["Group code","Group","Works"];rows=[...DB.art_group].sort((a,b)=>a.group_code.localeCompare(b.group_code)).map(g=>[g.group_code,g.name,DB.artwork_group.filter(x=>x.group_code===g.group_code).length]);}
else {const c=DB.customer.find(c=>c.customer_id===cid),aa=DB.customer_artist.filter(x=>x.customer_id===cid).map(x=>x.artist_id),gg=DB.customer_group.filter(x=>x.customer_id===cid).map(x=>x.group_code);
p.replaceChildren(el("p",c.name+" ("+c.customer_id+") · "+c.address+" · Lifetime spend: "+money(c.total_spent_cop)),chips([...aa.map(id=>"Artist: "+artist(id).name),...gg.map(id=>"Group: "+group(id).name)]));
sql="SELECT * FROM customer_recommendations\nWHERE customer_id = '"+cid+"' ORDER BY artwork_id;";cols=["ID","Title","Liked artist?","Liked group?"];rows=DB.artwork.map(w=>[w.artwork_id,w.title,aa.includes(w.artist_id),groupsOf(w.artwork_id).some(x=>gg.includes(x))]).filter(w=>w[2]||w[3]).map(w=>[w[0],w[1],w[2]?"Yes":"No",w[3]?"Yes":"No"]);}
$("#sql").textContent=sql;$("#result").replaceChildren(table(cols,rows));}
$("#search").addEventListener("input",catalogue);["#type","#group"].forEach(s=>$(s).addEventListener("change",catalogue));["#query","#collector"].forEach(s=>$(s).addEventListener("change",query));catalogue();query();
