import test from 'node:test';import assert from 'node:assert/strict';import {entries,selectRows} from '../web/model.mjs';
const items=entries([['ADAM ET EVE','Kaïn','Yes','French','CAP680524001','','','','21','N/A'],['COAX ME','Sloan','Yes','English','CAV170500004','','','','21','N/A']]);
test('Artist accents, word order and language filter',()=>{assert.equal(selectRows(items,'eve kain','Yes','French','21').length,1);assert.equal(selectRows(items,'Sloan','','French','').length,0);assert.equal(selectRows(items,'cav170500004','','','')[0].id,1);});
