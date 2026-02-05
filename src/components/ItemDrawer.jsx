import React, { useMemo, useState } from 'react'
import { useData, TYPES, STATUSES } from '../data/store'
import { isBlocked } from '../data/selectors'
import { uid } from '../data/mock'

const energyOptions = [
  { value:'', label:'—' },
  { value:'shallow', label:'Shallow' },
  { value:'deep', label:'Deep' },
]

export default function ItemDrawer({ itemId, onClose }){
  const { state, dispatch } = useData()
  const item = state.items.find(i=>i.id===itemId)
  const itemsById = useMemo(()=>{
    const m = {}
    state.items.forEach(i=> m[i.id]=i)
    return m
  }, [state.items])
  const [logText, setLogText] = useState('')

  if(!item) return null
  const blocked = isBlocked(item, itemsById)

  function update(patch){
    dispatch({ type:'UPSERT_ITEM', item: { ...item, ...patch } })
  }
  function toggleBlocker(id){
    const blockers = new Set(item.blockers || [])
    blockers.has(id) ? blockers.delete(id) : blockers.add(id)
    update({ blockers: Array.from(blockers) })
  }
  function addLogEntry(){
    const t = logText.trim()
    if(!t) return
    const log = [{ id: uid('l'), ts: Date.now(), text: t }, ...(item.log||[])]
    update({ log })
    setLogText('')
  }

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="hdr">
          <div style={{minWidth:0}}>
            <h3 style={{marginBottom:6}}>{item.title}</h3>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
              <span className={`pill ${item.type}`}>{item.type}</span>
              <span className={`badge ${item.status}`}>{item.status}</span>
              {blocked && <span className="chip" style={{borderColor:'rgba(245,158,11,.35)', color:'rgba(255,225,175,.9)', background:'rgba(245,158,11,.10)'}}>Blocked</span>}
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>

        <div className="section">
          <h4>Core</h4>
          <div className="grid">
            <div>
              <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Type</div>
              <select className="field" value={item.type} onChange={(e)=>update({ type: e.target.value })}>
                {TYPES.map(t=> <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Status</div>
              <select className="field" value={item.status} onChange={(e)=>update({ status: e.target.value })}>
                {STATUSES.map(s=> <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Next action date</div>
              <input className="field" type="date" value={item.nextActionDate || ''} onChange={(e)=>update({ nextActionDate: e.target.value })} />
            </div>
            <div>
              <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Due date</div>
              <input className="field" type="date" value={item.dueDate || ''} onChange={(e)=>update({ dueDate: e.target.value })} />
            </div>

            {item.type==='task' && (
              <>
                <div>
                  <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Energy</div>
                  <select className="field" value={item.energy || ''} onChange={(e)=>update({ energy: e.target.value })}>
                    {energyOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Estimate (min)</div>
                  <input className="field" inputMode="numeric" value={item.estimateMin || ''} onChange={(e)=>update({ estimateMin: e.target.value.replace(/[^0-9]/g,'') })} placeholder="e.g. 45" />
                </div>
              </>
            )}

            {item.type==='chase' && (
              <div style={{gridColumn:'1 / -1'}}>
                <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Person</div>
                <input className="field" value={item.person || ''} onChange={(e)=>update({ person: e.target.value })} placeholder="e.g. Alice / Vendor support" />
              </div>
            )}
          </div>

          <div className="actions" style={{marginTop:10}}>
            <button className="btn" onClick={()=>update({ nextActionDate: '' })}>Clear next action</button>
            <button className="btn" onClick={()=>update({ status: 'waiting' })}>Mark waiting</button>
            <button className="btn" onClick={()=>update({ status: 'done', log: [{ id: uid('l'), ts: Date.now(), text:'Marked done' }, ...(item.log||[])] })}>Mark done</button>
            {item.type==='chase' && <button className="btn" onClick={()=>update({ log: [{ id: uid('l'), ts: Date.now(), text:'Chased' }, ...(item.log||[])] })}>Mark chased now</button>}
          </div>
        </div>

        <div className="section">
          <h4>Dependencies</h4>
          <div style={{color:'rgba(234,241,255,.62)', fontSize:13, marginBottom:10}}>
            Blocked by items that aren’t done. Tick blockers to add/remove.
          </div>
          <div className="log">
            {state.items.filter(i=>i.id!==item.id && i.type!=='untriaged').slice(0,12).map(i=>{
              const checked = (item.blockers||[]).includes(i.id)
              return (
                <div key={i.id} className="entry" style={{alignItems:'center'}}>
                  <label style={{display:'flex', gap:10, alignItems:'center', cursor:'pointer'}}>
                    <input type="checkbox" checked={checked} onChange={()=>toggleBlocker(i.id)} />
                    <span style={{color:'rgba(234,241,255,.85)'}}>{i.title}</span>
                    <span className={`pill ${i.type}`}>{i.type}</span>
                  </label>
                  <span className={`badge ${i.status}`}>{i.status}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section">
          <h4>Log</h4>
          <div className="grid" style={{gridTemplateColumns:'1fr auto', alignItems:'end'}}>
            <div>
              <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Add log entry</div>
              <input className="field" value={logText} onChange={(e)=>setLogText(e.target.value)} placeholder="e.g. Reply received but incomplete" />
            </div>
            <button className="btn primary" onClick={addLogEntry}>Add</button>
          </div>
          <div className="log" style={{marginTop:12}}>
            {(item.log||[]).slice(0,10).map(e=>(
              <div key={e.id} className="entry">
                <span>{e.text}</span>
                <span style={{color:'rgba(234,241,255,.45)'}}>{new Date(e.ts).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
