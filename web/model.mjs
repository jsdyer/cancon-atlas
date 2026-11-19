export function normalize(value) {
  return value.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim();
}
export function entries(rows) {
  return rows.map((r,i)=>({id:i,row:r,text:normalize([r[0],r[1],r[4],r[4].replaceAll('-','')].join(' '))}));
}
export function decade(date) {
  return /^\d{4}(?:-|$)/.test(date)?date.slice(0,3)+'0s':'Unspecified';
}
export function selectRows(items,query,cancon,language,sub,period='') {
  const words=normalize(query).split(/\s+/).filter(Boolean);
  return items.filter(({row:r,text}) => words.every(w=>text.includes(w))
    && (!cancon || r[2]===cancon) && (!language || (r[3]||'Unspecified')===language) && (!sub || r[8]===sub) && (!period || decade(r[5])===period));
}
