import {compute} from '../services/calcService.js';

function expose (msg, status = 400) {
  const e = new Error(msg);
  e.status = status;
  e.expose = true;
  return e;
}

export function getCalc(req, res, next){
  try{
    const {op,a,b} = req.query;
    if (!op) 
        throw expose('Query param "op" is required');
    const result = compute(String(op), a, b);
    res.json({op, a: Number(a), b: Number(b), result});
    }catch (e){ 
        next(e);
    }
}

export function postCalc (req, res, next) {
    try{
        const {op,a,b } = req.body || {};
        if(!op) 
            throw expose('Body field "op" is required');
        const result = compute(String(op), a, b);
        res.json({ op, a: Number(a), b: Number(b), result});
    } 
    catch(e){ 
        next(e); 
    }
}

