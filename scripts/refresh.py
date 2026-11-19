"""Read the latest English CSV advertised by the CRTC dataset."""
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urlparse
import csv,gzip,io,json,re
ROOT=Path(__file__).resolve().parents[1]
DATASET='086cf10b-d8d3-4c11-8bc2-60b4769d50db'
FIELDS=['Title','Artist','CanCon Status','Language','ISRC','Release Date','Duration','Category','Subcategory','Emerging Status']
def fetch(url):
    with urlopen(Request(url,headers={'User-Agent':'CoolCode CanCon Atlas'}),timeout=60) as r:return r.read()
def main():
    package=json.loads(fetch('https://open.canada.ca/data/api/3/action/package_show?id='+DATASET))['result']
    editions=[]
    for r in package['resources']:
        match=re.search(r'\d{4}-\d\d-\d\d',r['name'])
        if r['format'].lower()=='csv' and 'en' in r['language'] and match:editions.append((match.group(),r['url']))
    date,url=max(editions)
    if urlparse(url).hostname!='open.canada.ca':raise ValueError('Unexpected music download domain')
    reader=csv.DictReader(io.StringIO(fetch(url).decode('utf-8-sig')))
    if reader.fieldnames!=FIELDS:raise ValueError('Unrecognized CRTC schema')
    rows=[]
    for record in reader:
        if None in record or None in record.values():raise ValueError('Incomplete CSV row')
        rows.append([record[k].strip() for k in FIELDS])
    if len(rows)<15000:raise ValueError('Unexpectedly small music edition')
    out=ROOT/'web/data';status={'edition':date,'retrieved':datetime.now(timezone.utc).date().isoformat(),'count':len(rows),'source':url}
    prior=out/'status.json'
    if prior.exists() and date<json.loads(prior.read_text())['edition']:raise ValueError('Earlier source edition')
    raw=json.dumps(rows,ensure_ascii=False,separators=(',',':')).encode('utf-8')
    (out/'recordings.json.gz').write_bytes(gzip.compress(raw,mtime=0))
    prior.write_text(json.dumps(status,indent=2)+'\n');print(status)
if __name__=='__main__': main()
