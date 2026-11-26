"use strict";
const $=s=>document.querySelector(s), D=DB.records, Q=DB.queries;
const e=(tag,t)=>Object.assign(document.createElement(tag),t===undefined?{}:{textContent:t});
const name=id=>D.artist.find(a=>a.artist_id===id)?.name;
const code=id=>D.art_group.find(g=>g.group_code===id)?.name;
const money=v=>new Intl.NumberFormat("en",{style:"currency",currency:"COP",maximumFractionDigits:0,currencyDisplay:"code"}).format(v);
const norm=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const sourced=v=>v==null?"Not published":v;
const link=(label,url)=>Object.assign(e("a",label),{href:url});
function table(sel,headers,data){
 const t=e("table"),h=e("thead"),b=e("tbody"),r=e("tr");
 headers.forEach(x=>r.append(Object.assign(e("th",x),{scope:"col"})));h.append(r);
 if(!data.length){const row=e("tr");row.append(Object.assign(e("td","No matching records."),{colSpan:headers.length}));b.append(row)}
 data.forEach(row=>{const tr=e("tr");row.forEach(c=>{const td=e("td");td.append(c instanceof Node?c:String(c));tr.append(td)});b.append(tr)});
 t.append(h,b);$(sel).replaceChildren(t);
}
const memberships=id=>D.artwork_group.filter(g=>g.artwork_id===id);
function artwork(){
 const q=norm($("#search").value.trim()),g=$("#group").value;
 const hits=D.artwork.filter(w=>norm(w.title+" "+w.artwork_id).includes(q)&&(!g||memberships(w.artwork_id).some(m=>m.group_code===g)));
 $("#count").textContent=hits.length+" of "+D.artwork.length+" works";
 $("#works-table").replaceChildren(...(hits.length?hits.map(w=>card(w)):[e("p","No works match these filters.")]));
}
function query(){
 const k=$("#query").value,id=$("#collector").value,q=Q[k], rec=k==="recommendations";
 $("#collector-controls").hidden=!rec;
 $("#sql").textContent=rec?"-- Parameter: "+id+"\n"+q.sql:q.sql;
 const heads={porto:["Code","Group","Membership source"],inventory:["Code","Group","Published memberships","Example memberships"],recommendations:["Artwork ID","Title","Liked artist","Liked group"]};
 const rows=rec?q.rows[id].map(r=>[r[0],r[1],r[2]?"Yes":"No",r[3]?"Yes":"No"]):k==="porto"?q.rows.map(r=>[r[0],r[1],r[2]==="portfolio"?"Published":"Case-study example"]):q.rows;
 table("#results",heads[k],rows);
}
table("#artist-table",["Artist ID","Name","Birthplace","Birthdate","Style"],D.artist.map(a=>[a.artist_id,a.name,sourced(a.birthplace),sourced(a.birthdate),sourced(a.style)]));
table("#group-table",["Group code","Published group name"],D.art_group.map(g=>[g.group_code,g.name]));
table("#customer-table",["Customer ID","Name","Address","Lifetime spend","Liked artists","Liked groups"],D.customer.map(c=>[c.customer_id,c.name,c.address,money(c.total_spent_cop),D.customer_artist.filter(x=>x.customer_id===c.customer_id).map(x=>name(x.artist_id)).join(", ")||"None",D.customer_group.filter(x=>x.customer_id===c.customer_id).map(x=>code(x.group_code)).join(", ")||"None"]));
D.art_group.forEach(g=>$("#group").append(Object.assign(e("option",g.name),{value:g.group_code})));
D.customer.forEach(c=>$("#collector").append(Object.assign(e("option",c.name),{value:c.customer_id})));
$("#search").addEventListener("input",artwork);$("#group").addEventListener("change",artwork);$("#query").addEventListener("change",query);$("#collector").addEventListener("change",query);$("#porto").addEventListener("click",()=>{$("#query").value="porto";query()});
artwork();query();

function photo(w){
 const img=e("img");img.alt=w.title;img.src=w.image_url;img.loading="lazy";img.decoding="async";
 img.addEventListener("error",()=>{const frame=img.parentElement;if(frame)frame.replaceChildren(e("span","Image unavailable"));},{once:true});
 return img;
}
function card(w,why){
 const el=e("article");el.className="art-card";
 const a=link("",w.source_url);
 const frame=e("div");frame.className="plate";frame.append(photo(w));
 a.append(frame,e("h3",w.title));el.append(a,e("p",[w.medium,w.year].filter(Boolean).join(" · ")));
 if(why){const p=e("p",why);p.className="reason";el.append(p);}
 return el;
}
const cover=e("div"); const heroWork=D.artwork.find(w=>w.artwork_id==="caracas-skyline");const heroImg=photo(heroWork);
heroImg.loading="eager";cover.append(heroImg);$("#hero-image").append(cover);
const picks={places:"venezia",people:"laia",creatures:"pescadito",objects:"porto"};
for(const g of D.art_group){
 const w=D.artwork.find(w=>w.artwork_id===picks[g.group_code])||D.artwork.find(w=>memberships(w.artwork_id).some(m=>m.group_code===g.group_code));
 const tile=link("","#works");tile.className="collection";
 const frame=e("div");frame.className="plate";if(w)frame.append(photo(w));
 tile.append(frame,e("strong",g.name));
 tile.addEventListener("click",()=>{$("#search").value="";$("#group").value=g.group_code;artwork();});
 $("#collection-grid").append(tile);
}
const profile=$("#match-profile");
for(const c of D.customer)profile.append(Object.assign(e("option",c.name),{value:c.customer_id}));
function refreshMatch(){
 const id=profile.value, customer=D.customer.find(c=>c.customer_id===id);
 const liked=D.customer_group.filter(g=>g.customer_id===id).map(g=>g.group_code);
 const preferred=D.customer_artist.filter(g=>g.customer_id===id).map(g=>g.artist_id);
 const rows=Q.recommendations.rows[id]||[];
 $("#collector-summary").replaceChildren(e("p",rows.length+" matching works · Fictional lifetime spend: "+money(customer.total_spent_cop)),e("p","Collects: "+[...preferred.map(name),...liked.map(code)].join(", ")));
 $("#collector-matches").replaceChildren(...rows.slice(0,6).map(([key,title,artist,group])=>{
  const w=D.artwork.find(w=>w.artwork_id===key), reasons=[];
  if(artist)reasons.push("Follows "+name(w.artist_id));
  if(group)reasons.push("Collects "+memberships(key).filter(m=>liked.includes(m.group_code)).map(m=>code(m.group_code)).join(" & "));
  return card(w,reasons.join(" · "));
 }));
 if(rows.length>6){const full=link("View all "+rows.length+" matches in SQL results ↓","#queries");full.addEventListener("click",()=>{ $(".technical").open=true;$("#query").value="recommendations";$("#collector").value=id;query();});$("#collector-summary").append(full);}
}
profile.addEventListener("change",refreshMatch);
refreshMatch();
