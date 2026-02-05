import React, { useMemo, useState } from 'react'
import { useData, STATUSES } from '../data/store'
import ItemDrawer from '../components/ItemDrawer'
import { cmpISO } from '../data/selectors'

export default function Items({ searchTerm='' }){
  const { state } = useData()
  const [drawerId, setDrawerId] = useState(null)
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('nextAction')

  const filtered = useMemo(()=>{
    let list = state.items.filter(i=> i.type !== 'untriaged')
    if(type !== 'all') list = list.filter(i=> i.type === type)
    if(status !== 'all') list = list.filter(i=> i.status === status)
    if(searchTerm.trim()){
      const q = searchTerm.trim().toLowerCase()
      list = list.filter(i=>{
        const m = state.meetings.find(x=>x.id===i.meetingId)
        return i.title.toLowerCase().includes(q) || (i.person||'').toLowerCase().includes(q) || (m?.title||'').toLowerCase().includes(q)
      })
    }
    if(sort==='nextAction') list = list.slice().sort((a,b)=> cmpISO(a.nextActionDate, b.nextActionDate))
    if(sort==='due') list = list.slice().sort((a,b)=> cmpISO(a.dueDate, b.dueDate))
    return list
  }, [state.items, state.meetings, type, status, sort, searchTerm])

  return (
    <div className="page">
      <h2>Items</h2>
      <p className="sub">Master list of all tasks + chases. Filter, sort, and open any item to edit.</p>

      <div className="card">
        <div className="hd">
          <div className="title">All items</div>
          <span className="chip">{filtered.length}</span>
        </div>

        <div style={{padding:14}}>
          <div className="toolbar">
            <select className="field" value={type} onChange={(e)=>setType(e.target.value)}>
              <option value="all">Type: All</option>
              <option value="task">Type: Task</option>
              <option value="chase">Type: Chase</option>
            </select>
            <select className="field" value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="all">Status: All</option>
              {STATUSES.map(s=> <option key={s.value} value={s.value}>Status: {s.label}</option>)}
            </select>
            <select className="field" value={sort} onChange={(e)=>setSort(e.target.value)}>
              <option value="nextAction">Sort: Next action</option>
              <option value="due">Sort: Due date</option>
            </select>
          </div>
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th><th>Type</th><th>Status</th><th>Next action</th><th>Due</th><th>Person</th><th>Meeting</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i=>{
                const meeting = i.meetingId ? state.meetings.find(m=>m.id===i.meetingId) : null
                return (
                  <tr key={i.id} onClick={()=>setDrawerId(i.id)} style={{cursor:'pointer'}}>
                    <td>
                      <div style={{fontWeight:650}}>{i.title}</div>
                      <div className="muted">
                        {i.type==='task' ? `${i.energy || '—'}${i.estimateMin ? ` • ${i.estimateMin}m` : ''}` : i.person ? `Person: ${i.person}` : '—'}
                      </div>
                    </td>
                    <td><span className={`pill ${i.type}`}>{i.type}</span></td>
                    <td><span className={`badge ${i.status}`}>{i.status}</span></td>
                    <td>{i.nextActionDate || '—'}</td>
                    <td>{i.dueDate || '—'}</td>
                    <td>{i.type==='chase' ? (i.person || '—') : '—'}</td>
                    <td className="muted">{meeting ? `${meeting.time} ${meeting.title}` : '—'}</td>
                  </tr>
                )
              })}
              {filtered.length===0 && <tr><td colSpan={7} style={{padding:18, color:'rgba(234,241,255,.6)'}}>No items match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {drawerId && <ItemDrawer itemId={drawerId} onClose={()=>setDrawerId(null)} />}
    </div>
  )
}
