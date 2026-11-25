"use strict";
const $=s=>document.querySelector(s);
const el=(tag,text,attrs={})=>{const x=document.createElement(tag); if(text!==undefined)x.textContent=text; for(const [k,v] of Object.entries(attrs))x.setAttribute(k,v); return x};
const currency=new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0});
const money=n=>currency.format(n)+" COP";
const artist=id=>DB.artist.find(x=>x.artist_id===id);
const group=id=>DB.art_group.find(x=>x.group_code===id);
const groupsOf=id=>DB.artwork_group.filter(x=>x.artwork_id===id).map(x=>x.group_code);
const normalized=x=>x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const thumb=w=>{const wrap=el("span",undefined,{class:"art"});wrap.append(el("img",undefined,{src:w.image_url,alt:w.title+" by Andrea Montaña",loading:"lazy",decoding:"async"}));return wrap};
const chips=xs=>{const wrap=el("div",undefined,{class:"chips"});xs.forEach(x=>wrap.append(el("span",x,{class:"chip"})));return wrap};
for(const g of DB.art_group)$("#group").append(el("option",g.name,{value:g.group_code}));
for(const c of DB.customer)$("#collector").append(el("option",c.name,{value:c.customer_id}));
function detail(w){const a=artist(w.artist_id), d=$("#dialogContent");
d.replaceChildren(thumb(w),el("p",w.artwork_id+" / "+(w.medium||"Medium not published")+" / "+w.year,{class:"eyebrow"}),el("h2",w.title,{id:"detailTitle"}),el("p",w.price_cop===null?"Price not published":money(w.price_cop)),el("h3",a.name),el("p","Artist ID "+a.artist_id+" · Birthplace, birthdate and style not published for this exercise.",{class:"muted"}),chips(DB.artwork_group.filter(g=>g.artwork_id===w.artwork_id).map(g=>group(g.group_code).name+(g.provenance==="case-study"?" (example tag)":""))),el("p","Artwork © Andrea Montaña."),el("a","View in Andrea’s original catalogue ↗",{href:w.source_url}));
$("#detail").showModal();}
function catalogue(){const q=normalized($("#search").value.trim()),t=$("#type").value,g=$("#group").value;
const hits=DB.artwork.filter(w=>(!t||t===(w.art_type||"unknown"))&&(!g||groupsOf(w.artwork_id).includes(g))&&normalized([w.title,artist(w.artist_id).name,w.artwork_id].join(" ")).includes(q));
$("#count").textContent=hits.length+" of "+DB.artwork.length+" published works";
$("#works").replaceChildren(...hits.map(w=>{const b=el("button",undefined,{type:"button",class:"card","aria-label":"View "+w.title});b.append(thumb(w),el("h3",w.title),el("span",artist(w.artist_id).name+" · "+w.year,{class:"muted"}));b.addEventListener("click",()=>detail(w));return b}));
if(!hits.length)$("#works").append(el("p","No works match those filters."));}
function table(headers,data){const t=el("table"),h=el("thead"),b=el("tbody"),r=el("tr");headers.forEach(x=>r.append(el("th",x,{scope:"col"})));h.append(r);data.forEach(row=>{const x=el("tr");row.forEach(c=>x.append(el("td",c)));b.append(x)});t.append(h,b);return t}
function query(){const kind=$("#query").value,cid=$("#collector").value;$("#collectorLabel").hidden=kind!=="preferences";const p=$("#profile");p.hidden=kind!=="preferences";let sql,cols,rows;
if(kind==="catalogue"){sql="SELECT * FROM gallery_catalogue\nWHERE art_type = 'Painting'\nORDER BY year, title;";cols=["ID","Title","Artist","Year","Art type","Medium","Price"];rows=DB.artwork.filter(w=>w.art_type==="Painting").sort((a,b)=>a.year-b.year || (a.title===b.title?0:a.title<b.title?-1:1)).map(w=>[w.artwork_id,w.title,artist(w.artist_id).name,w.year,w.art_type,w.medium,w.price_cop===null?"Not published":money(w.price_cop)]);}
else if(kind==="groups"){sql="SELECT * FROM group_inventory ORDER BY group_code;";cols=["Group code","Group","Works"];rows=[...DB.art_group].sort((a,b)=>a.group_code.localeCompare(b.group_code)).map(g=>[g.group_code,g.name,DB.artwork_group.filter(x=>x.group_code===g.group_code).length]);}
else {const c=DB.customer.find(c=>c.customer_id===cid),aa=DB.customer_artist.filter(x=>x.customer_id===cid).map(x=>x.artist_id),gg=DB.customer_group.filter(x=>x.customer_id===cid).map(x=>x.group_code);
p.replaceChildren(el("p",c.name+" ("+c.customer_id+") · "+c.address+" · Lifetime spend: "+money(c.total_spent_cop)),chips([...aa.map(id=>"Artist: "+artist(id).name),...gg.map(id=>"Group: "+group(id).name)]));
sql="SELECT * FROM customer_recommendations\nWHERE customer_id = '"+cid+"' ORDER BY artwork_id;";cols=["ID","Title","Liked artist?","Liked group?"];rows=DB.artwork.map(w=>[w.artwork_id,w.title,aa.includes(w.artist_id),groupsOf(w.artwork_id).some(x=>gg.includes(x))]).filter(w=>w[2]||w[3]).sort((a,b)=>a[0]===b[0]?0:a[0]<b[0]?-1:1).map(w=>[w[0],w[1],w[2]?"Yes":"No",w[3]?"Yes":"No"]);}
$("#sql").textContent=sql;$("#result").replaceChildren(table(cols,rows));}
$("#search").addEventListener("input",catalogue);["#type","#group"].forEach(s=>$(s).addEventListener("change",catalogue));["#query","#collector"].forEach(s=>$(s).addEventListener("change",query));catalogue();query();
