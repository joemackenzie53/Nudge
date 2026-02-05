import React from 'react'
import { useData } from '../data/store'

export default function Meetings({ searchTerm='' }){
  const { state } = useData()
  const q = searchTerm.trim().toLowerCase()
  const list = state.meetings
    .filter(m=> !q || m.title.toLowerCase().includes(q))
    .slice().sort((a,b)=> `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))

  const openCount = (mid)=> state.items.filter(i=> i.meetingId===mid && i.type!=='untriaged' && i.status!=='done').length
  const untriagedCount = (mid)=> state.items.filter(i=> i.meetingId===mid && i.type==='untriaged').length

  return (
    <div className="page">
      <h2>Meetings</h2>
      <p className="sub">Create tasks and chases inside meeting notes. Capture untriaged notes during the meeting.</p>

      <div className="card">
        <div className="hd">
          <div className="title">All meetings</div>
          <span className="chip">{list.length}</span>
        </div>
        <div className="list">
          {list.map(m=>(
            <a key={m.id} href={`#/meetings/${m.id}`} className="row" style={{cursor:'pointer'}}>
              <div className="checkbox" style={{borderRadius:999}} />
              <div className="meta">
                <div className="t">
                  <div className="name">{m.date} {m.time} — {m.title}</div>
                  <span className="chip">{openCount(m.id)} open</span>
                  <span className="chip" style={{color:'rgba(226,232,240,.75)'}}>{untriagedCount(m.id)} untriaged</span>
                </div>
                <div className="d"><span className="chip">Agenda: {m.agenda || '—'}</span></div>
              </div>
              <div className="right"><span className="kbtn">Open</span></div>
            </a>
          ))}
          {list.length===0 && <div style={{color:'rgba(234,241,255,.55)', fontSize:13}}>No meetings.</div>}
        </div>
      </div>
    </div>
  )
}
