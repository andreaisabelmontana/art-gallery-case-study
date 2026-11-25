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
 table("#works-table",["Artwork ID","Title / source","Artist ID","Year","Type","Medium","Price","Group codes"],hits.map(w=>[w.artwork_id,link(w.title,w.source_url),w.artist_id,w.year,sourced(w.art_type),sourced(w.medium),w.price_cop==null?"Not published":money(w.price_cop),memberships(w.artwork_id).map(m=>m.group_code+(m.provenance==="case-study"?" (example)":"")).join(", ")]));
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
