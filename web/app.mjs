import {$,el,num,load,select,fail} from './ui.mjs';
import {entries,normalize,selectRows} from './model.mjs';
let all=[],matches=[],page=0,selected,edition;
const size=30, fields=['Title','Artist','Canadian content','Majority language','ISRC','Release date','Duration','Content category','Subcategory','Emerging status'];
function details(id,jump=false) {
  const entry=all[id]; if(!entry)return;
  selected=id;
  $('record-title').textContent=entry.row[0];
  const dl=el('dl');
  fields.slice(1).forEach((f,i)=>dl.append(el('dt',f),el('dd',entry.row[i+1]||'Unspecified')));
  const related=all.filter(e=>normalize(e.row[0])===normalize(entry.row[0]) && normalize(e.row[1])===normalize(entry.row[1]));
  const group=el('div',undefined,'buttons');
  for(const e of related) {
    const b=el('button',e.row[4]||('Source row '+(e.id+2)));b.disabled=e.id===id;b.onclick=()=>details(e.id);group.append(b);
  }
  $('detail').replaceChildren(el('p',entry.row[1]+' · CSV row '+(id+2),'meta'),dl,el('h3','Same artist and title in this edition'),group);
  const url=new URL(location.href);
  url.searchParams.set('edition',edition);url.searchParams.set('row',String(id+2));url.searchParams.set('q',$('q').value);
  history.replaceState(null,'',url);
  if(jump)$('record').focus();
}
function display() {
  const slice=matches.slice(page*size,(page+1)*size);
  const trs=slice.map(({id,row})=>{
    const tr=el('tr'),td=el('td'),b=el('button',row[0]||'Untitled','link');b.onclick=()=>details(id,true);
    td.append(b);tr.append(td,...[1,2,3,4].map(i=>el('td',row[i]||'Unspecified')));return tr;
  });
  $('rows').replaceChildren(...trs);$('count').textContent=num(matches.length)+' matching rows';
  $('stats').textContent=num(matches.filter(x=>x.row[2]==='Yes').length)+' marked Canadian · '+num(new Set(matches.map(x=>x.row[1])).size)+' distinct artist labels';
  $('range').textContent=matches.length?'Rows '+num(page*size+1)+'–'+num(page*size+slice.length)+' of '+num(matches.length):'No matching rows. Try a shorter search or change a filter.';
  $('prev').disabled=page===0;$('next').disabled=(page+1)*size>=matches.length;
}
function search() {
  matches=selectRows(all,$('q').value,$('cancon').value,$('lang').value,$('genre').value);page=0;display();
  $('record').hidden=!matches.length;
  if(matches.length)details(matches[0].id);
}
async function start(){
  const [data,status]=await Promise.all([load('recordings'),load('status')]);
  all=entries(data);edition=status.edition;
  const options=(id,column,label)=>select(id,[['',label],...[...new Set(data.map(r=>r[column]||'Unspecified'))].sort().map(v=>[v,v])]);
  options('cancon',2,'All statuses');options('lang',3,'All languages');options('genre',8,'All subcategories');
  const params=new URLSearchParams(location.search);
  $('q').value=params.get('q')??'Sloan';$('raw').href=status.source;
  $('status').textContent=num(status.count)+' source rows · CRTC edition '+edition+' · Retrieved '+status.retrieved;
  $('filters').onsubmit=e=>e.preventDefault();
  $('q').oninput=search;for(const id of ['cancon','lang','genre'])$(id).onchange=search;
  $('prev').onclick=()=>{page--;display();};$('next').onclick=()=>{page++;display();};
  search();
  const target=Number(params.get('row'))-2;
  if(params.get('edition')===edition && matches.some(e=>e.id===target))details(target);
}
start().catch(fail);
