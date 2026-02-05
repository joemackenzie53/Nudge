import React, { useMemo, useState } from 'react'
import { useData } from '../data/store'
import ItemDrawer from '../components/ItemDrawer'

const energyOptions = [
  { value:'', label:'Energy (—)' },
  { value:'shallow', label:'Shallow' },
  { value:'deep', label:'Deep' },
]

export default function Inbox({ searchTerm='' }){
  const { state, dispatch } = useData()
  const [drawerId, setDrawerId] = useState(null)

  const untriaged = useMemo(()=>{
    let list = state.items.filter(i=> i.type === 'untriaged')
    if(searchTerm.trim()){
      const q = searchTerm.trim().toLowerCase()
      list = list.filter(i=> i.title.toLowerCase().includes(q))
    }
    return list
  }, [state.items, searchTerm])

  function update(item, patch){
    dispatch({ type:'UPSERT_ITEM', item: { ...item, ...patch } })
  }

  return (
    <div className="page">
      <h2>Inbox</h2>
      <p className="sub">Untriaged notes. Convert each into a <b>Task</b> or <b>Chase</b>, then set the next action date.</p>

      <div className="card">
        <div className="hd">
          <div className="title">Untriaged queue</div>
          <span className="chip">{untriaged.length}</span>
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th style={{width:'40%'}}>Title</th>
                <th style={{width:'14%'}}>Convert to</th>
                <th style={{width:'18%'}}>Type fields</th>
                <th style={{width:'16%'}}>Next action</th>
                <th style={{width:'10%'}}>Meeting</th>
                <th style={{width:'2%'}}></th>
              </tr>
            </thead>
            <tbody>
              {untriaged.map(item=>{
                const meeting = item.meetingId ? state.meetings.find(m=>m.id===item.meetingId) : null
                return (
                  <tr key={item.id} onDoubleClick={()=>setDrawerId(item.id)} style={{cursor:'default'}}>
                    <td>
                      <div style={{fontWeight:650}}>{item.title}</div>
                      <div className="muted">Double-tap / double-click to open drawer</div>
                    </td>
                    <td>
                      <select className="field" value={item._draftType || ''} onChange={(e)=>update(item, { _draftType: e.target.value })}>
                        <option value="">Select…</option>
                        <option value="task">Task</option>
                        <option value="chase">Chase</option>
                      </select>
                    </td>
                    <td>
                      {item._draftType === 'task' && (
                        <div style={{display:'flex', gap:8}}>
                          <select className="field" value={item._draftEnergy || ''} onChange={(e)=>update(item, { _draftEnergy: e.target.value })}>
                            {energyOptions.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <input className="field" style={{maxWidth:120}} placeholder="Est (min)" value={item._draftEstimate || ''} onChange={(e)=>update(item, { _draftEstimate: e.target.value.replace(/[^0-9]/g,'') })} />
                        </div>
                      )}
                      {item._draftType === 'chase' && (
                        <input className="field" placeholder="Person" value={item._draftPerson || ''} onChange={(e)=>update(item, { _draftPerson: e.target.value })} />
                      )}
                      {!item._draftType && <span className="muted">—</span>}
                    </td>
                    <td>
                      <input className="field" type="date" value={item._draftNextAction || ''} onChange={(e)=>update(item, { _draftNextAction: e.target.value })} />
                    </td>
                    <td><div className="muted">{meeting ? `${meeting.time} ${meeting.title}` : '—'}</div></td>
                    <td>
                      <button className="btn primary" onClick={()=>{
                        if(!item._draftType) return alert('Select Task or Chase first.')
                        const base = {
                          type: item._draftType,
                          nextActionDate: item._draftNextAction || '',
                          _draftType: undefined,
                          _draftNextAction: undefined,
                        }
                        if(item._draftType==='task'){
                          update(item, {
                            ...base,
                            energy: item._draftEnergy || 'shallow',
                            estimateMin: item._draftEstimate || '',
                            _draftEnergy: undefined,
                            _draftEstimate: undefined,
                          })
                        } else {
                          update(item, {
                            ...base,
                            person: item._draftPerson || '',
                            _draftPerson: undefined,
                          })
                        }
                      }}>Convert</button>
                    </td>
                  </tr>
                )
              })}
              {untriaged.length===0 && (
                <tr><td colSpan={6} style={{padding:18, color:'rgba(234,241,255,.6)'}}>Inbox is empty. Use <b>Quick Add</b> to capture notes.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{padding:14, borderTop:'1px solid rgba(255,255,255,.06)', color:'rgba(234,241,255,.62)', fontSize:13}}>
          Tip: Convert fast here, then refine fields in the drawer if needed.
        </div>
      </div>

      {drawerId && <ItemDrawer itemId={drawerId} onClose={()=>setDrawerId(null)} />}
    </div>
  )
}
