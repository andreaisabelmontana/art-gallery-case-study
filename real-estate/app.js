"use strict";
const $=s=>document.querySelector(s), grid=$(".grid"), filters=$(".filters"), entry=$("#listing-form");
const areas={Malasana:["Malasaña",40.426,-3.7047,32,34],Chamartin:["Chamartín",40.4604,-3.6768,69,22],Chamberi:["Chamberí",40.436,-3.7038,46,20],Aravaca:["Aravaca",40.4567,-3.7834,22,56],Retiro:["Retiro",40.4106,-3.6789,73,69]};
const key="keys-to-madrid-demo-v1", seed=[...grid.querySelectorAll(".card")].map(node=>{
 const areaText=node.querySelector(".area").textContent;
 const caption=node.querySelector(".eyebrow").textContent;
 return {id:Number(caption.split("#")[1]),area:Object.keys(areas).find(k=>areaText.endsWith(areas[k][0])),type:areaText.startsWith("House")?"house":"apartment",deal:caption.startsWith("FOR RENT")?"rental":"purchase",price:Number(node.querySelector("h3").textContent.replace(/[^0-9]/g,"")),beds:parseInt(node.querySelector(".facts").textContent,10)||0,node};
});
let snapshot={added:[],closed:[]};
try{const raw=sessionStorage.getItem(key);if(raw)snapshot=JSON.parse(raw);}catch{}
const closed=new Set(snapshot.closed);
const inventory=()=>seed.concat(snapshot.added);
function save(){snapshot.closed=[...closed];try{sessionStorage.setItem(key,JSON.stringify(snapshot));}catch{}}
const euro=v=>"€"+Number(v).toLocaleString("en-IE",{maximumFractionDigits:2});
const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e};
const status=r=>!closed.has(r.id)?"Available":r.deal==="rental"?"RENTED":"SOLD";
const matches=(list,q,closedIds)=>{const priced=q.deal==="rental"||q.deal==="purchase";
 const result=list.filter(r=>(q.scope==="all"||!closedIds.has(r.id))&&(!q.type||r.type===q.type)&&(!q.deal||r.deal===q.deal)&&(!q.area||r.area===q.area)&&r.beds>=Number(q.beds||0)&&(!priced||(r.price>=Number(q.min||0)&&(!q.max||r.price<=Number(q.max)))));
 return result.sort(priced&&q.sort==="low"?(a,b)=>a.price-b.price:priced&&q.sort==="high"?(a,b)=>b.price-a.price:(a,b)=>a.id-b.id);
};
function card(r){
 let article=r.node?.cloneNode(true);
 if(!article){
  article=node("article","","card");
  const artClass=r.type==="house"?"art-four":({Malasana:"art-one",Retiro:"art-five",Chamartin:"art-alt-six"}[r.area]||"art-three");
  const art=node("div","","art "+artClass);art.append(node("span",status(r),"tag"));article.append(art);
  const copy=node("div","","card-copy"),head=node("h3",euro(r.price));
  if(r.deal==="rental")head.append(node("small"," / mo"));
  copy.append(node("div",(r.deal==="rental"?"FOR RENT":"FOR SALE")+" · #"+String(r.id).padStart(3,"0"),"eyebrow"),head,node("p",(r.beds?r.beds+" bd":"Studio")+" · "+r.baths+" ba · "+Number(r.sqft).toLocaleString("en-IE")+" sqft","facts"),node("p",(r.type==="house"?"House":"Apartment")+" · "+areas[r.area][0],"area"));
  const detail=node("details"), features=r.type==="house"?r.stories+" stories · Garage: "+r.garage+" · Fenced yard: "+r.fenced:"Balcony: "+r.balcony+" · Laundry: "+r.laundry;
  const terms=r.deal==="rental"?"Furnished: "+r.furnished+" · "+r.utilities:"Estimated property tax: "+euro(r.taxes)+" / yr";
  detail.append(node("summary","Listing details"),node("p",features),node("p",terms));copy.append(detail);article.append(copy);
 }
 article.querySelector(".tag").textContent=status(r);
 article.querySelector("form")?.remove();
 if(!closed.has(r.id)){
  const b=node("button",r.deal==="rental"?"Mark rented":"Mark sold","outline");
  b.type="button";b.addEventListener("click",()=>{if(confirm("Close this demo listing?")){closed.add(r.id);save();filters.elements.scope.value="all";render();}});
  article.querySelector(".card-copy").append(b);
 }
 return article;
}
const notice=node("p","","notice");notice.hidden=true;notice.setAttribute("role","status");filters.before(notice);
const q=()=>Object.fromEntries(new FormData(filters));
let map, layer;
const panel=$(".map"), fallback=$(".map-fallback");
fallback.querySelectorAll(".pin").forEach(el=>el.remove());
if(window.L){
 map=L.map("live-map",{scrollWheelZoom:false}).setView([40.431,-3.725],12);
 L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).once("tileload",()=>panel.classList.add("map-ready")).addTo(map);
 layer=L.layerGroup().addTo(map);
}
function updateMap(rows){
 const counts={};
 for(const r of rows)counts[r.area]=(counts[r.area]||0)+1;
 fallback.querySelectorAll(".pin").forEach(el=>el.remove());layer?.clearLayers();
 const points=[];
 for(const [area,count] of Object.entries(counts)){
  const [name,lat,lon,x,y]=areas[area];
  const make=cls=>{const a=node("a","",""+cls);a.href="#live-map";a.append(node("b",String(count)),document.createTextNode(" "+name));a.setAttribute("aria-label","Filter to "+name);a.onclick=e=>{e.preventDefault();filters.elements.area.value=area;render()};return a;};
  const fallbackPin=make("pin");fallbackPin.style.setProperty("--x",x+"%");fallbackPin.style.setProperty("--y",y+"%");fallback.append(fallbackPin);
  if(layer){const live=make("live-pin");live.onmousedown=e=>e.stopPropagation();live.ondblclick=e=>e.stopPropagation();
   L.marker([lat,lon],{interactive:false,keyboard:false,icon:L.divIcon({className:"pin-marker",html:live,iconSize:[110,25],iconAnchor:[55,12]})}).addTo(layer);points.push([lat,lon]);}
 }
 if(map){if(points.length>1)map.fitBounds(points,{padding:[50,44],maxZoom:13});else if(points.length)map.setView(points[0],14);}
}
function render(){
 const criteria=q(), priced=!!criteria.deal;
 const msg=!priced&&(criteria.min||criteria.max||criteria.sort)?"Select For rent or For sale to compare prices in the same units.":criteria.max&&Number(criteria.min)>Number(criteria.max)?"Minimum price cannot exceed maximum price.":"";
 notice.textContent=msg;notice.hidden=!msg;
 const list=inventory(), rows=matches(list,criteria,closed);
 $(".results-head h2").textContent=rows.length+" listing"+(rows.length===1?"":"s");
 $(".results-head small").textContent=list.filter(r=>!closed.has(r.id)).length+" available across the desk";
 grid.replaceChildren(...(rows.length?rows.map(card):[node("p","No listings match these filters.","empty")]));
 updateMap(rows);
}
filters.addEventListener("submit",e=>{e.preventDefault();render()});
filters.querySelector("a").addEventListener("click",e=>{e.preventDefault();filters.reset();render()});
entry.addEventListener("submit",e=>{
 e.preventDefault();const f=Object.fromEntries(new FormData(entry));
 if(f.deal==="rental"&&!f.utilities.trim()){const utility=entry.elements.utilities;utility.setCustomValidity("Enter a utilities description.");utility.reportValidity();utility.setCustomValidity("");return}
 const row={...f,id:Math.max(0,...inventory().map(r=>r.id))+1,beds:Number(f.beds),price:Number(f.deal==="rental"?f.rent:f.price)};
 if(!Number.isFinite(row.price)||row.price<=0||!(row.area in areas))return;
 snapshot.added.push(row);save();$("#add").close();entry.reset();$("#property-kind").dispatchEvent(new Event("change"));$("#deal-kind").dispatchEvent(new Event("change"));filters.reset();render();
});
render();
