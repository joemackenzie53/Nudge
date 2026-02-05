import React, { useMemo, useState } from 'react'
import { useData } from '../data/store'
import { isBlocked } from '../data/selectors'
import ItemDrawer from '../components/ItemDrawer'
import { todayISO } from '../data/mock'

function ItemRow({ item, openDrawer }){
  const typeLabel = item.type === 'task' ? 'Task' : item.type === 'chase' ? 'Chase' : 'Untriaged'
  return (
    <div className="row" onClick={()=>openDrawer(item.id)} style={{cursor:'pointer'}}>
      <div className="checkbox" />
      <div className="meta">
        <div className="t">
          <div className="name">{item.title}</div>
          <span className={`pill ${item.type}`}>{typeLabel}</span>
        </div>
        <div className="d">
          <span className={`badge ${item.status}`}>{item.status}</span>
          {item.type==='task' && item.energy && <span className="chip">{item.energy}</span>}
          {item.type==='task' && item.estimateMin && <span className="chip">{item.estimateMin} min</span>}
          {item.type==='chase' && item.person && <span className="chip">{item.person}</span>}
          {item.nextActionDate && <span className="chip">Next: {item.nextActionDate}</span>}
          {item.dueDate && <span className="chip">Due: {item.dueDate}</span>}
        </div>
      </div>
      <div className="right"><span className="kbtn">Open</span></div>
    </div>
  )
}

export default function Today(){
  const { state } = useData()
  const [drawerId, setDrawerId] = useState(null)
  const today = todayISO()

  const itemsById = useMemo(()=>{
    const m = {}; state.items.forEach(i=> m[i.id]=i); return m
  }, [state.items])

  const actionable = state.items
    .filter(i=> i.type !== 'untriaged')
    .filter(i=> i.status !== 'done')
    .filter(i=> i.nextActionDate && i.nextActionDate <= today)

  const nextActions = actionable.filter(i=> !isBlocked(i, itemsById))
  const blocked = actionable.filter(i=> isBlocked(i, itemsById))

  const meetingsToday = state.meetings.filter(m=> m.date===today).sort((a,b)=>a.time.localeCompare(b.time))
  const meetingOpenCount = (mid)=> state.items.filter(i=> i.meetingId===mid && i.type!=='untriaged' && i.status!=='done').length

  return (
    <div className="page">
      <h2>Today</h2>
      <p className="sub">Your cockpit: next actions, blocked items, and meetings. (Mocked data, editable.)</p>

      <div className="grid2">
        <div className="card">
          <div className="hd">
            <div className="title"><span style={{width:10,height:10,borderRadius:999,background:'rgba(59,130,246,.9)',display:'inline-block'}}/> Next Actions</div>
            <span className="chip">{nextActions.length}</span>
          </div>
          <div className="list">
            {nextActions.length===0 && <div style={{color:'rgba(234,241,255,.55)', fontSize:13}}>Nothing queued for today.</div>}
            {nextActions.map(i=> <ItemRow key={i.id} item={i} openDrawer={setDrawerId} />)}
          </div>
        </div>

        <div className="card">
          <div className="hd">
            <div className="title"><span style={{width:10,height:10,borderRadius:999,background:'rgba(245,158,11,.95)',display:'inline-block'}}/> Blocked Items</div>
            <span className="chip">{blocked.length}</span>
          </div>
          <div className="list">
            {blocked.length===0 && <div style={{color:'rgba(234,241,255,.55)', fontSize:13}}>No blocked items due today.</div>}
            {blocked.map(i=>(
              <div key={i.id} className="row" onClick={()=>setDrawerId(i.id)} style={{cursor:'pointer'}}>
                <div className="checkbox" />
                <div className="meta">
                  <div className="t">
                    <div className="name">{i.title}</div>
                    <span className={`pill ${i.type}`}>{i.type}</span>
                    <span className="chip" style={{borderColor:'rgba(245,158,11,.35)', color:'rgba(255,225,175,.9)', background:'rgba(245,158,11,.10)'}}>Blocked</span>
                  </div>
                  <div className="d">
                    <span className={`badge ${i.status}`}>{i.status}</span>
                    {i.nextActionDate && <span className="chip">Next: {i.nextActionDate}</span>}
                  </div>
                </div>
                <div className="right"><span className="kbtn">Open</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop:14}}>
        <div className="hd">
          <div className="title"><span style={{width:10,height:10,borderRadius:999,background:'rgba(34,197,94,.95)',display:'inline-block'}}/> Meetings Today</div>
          <span className="chip">{meetingsToday.length}</span>
        </div>
        <div className="list">
          {meetingsToday.length===0 && <div style={{color:'rgba(234,241,255,.55)', fontSize:13}}>No meetings today.</div>}
          {meetingsToday.map(m=>(
            <a key={m.id} href={`#/meetings/${m.id}`} className="row" style={{cursor:'pointer'}}>
              <div className="checkbox" style={{borderRadius:999}} />
              <div className="meta">
                <div className="t">
                  <div className="name">{m.time} — {m.title}</div>
                  <span className="chip">{meetingOpenCount(m.id)} open actions</span>
                </div>
                <div className="d"><span className="chip">Agenda: {m.agenda || '—'}</span></div>
              </div>
              <div className="right"><span className="kbtn">Open</span></div>
            </a>
          ))}
        </div>
      </div>

      {drawerId && <ItemDrawer itemId={drawerId} onClose={()=>setDrawerId(null)} />}
    </div>
  )
}
