import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../data/store'
import ItemDrawer from '../components/ItemDrawer'

export default function MeetingDetail({ onQuickAddForMeeting }){
  const { id } = useParams()
  const { state, dispatch, createItem, createQuickNote } = useData()
  const meeting = state.meetings.find(m=>m.id===id)
  const [drawerId, setDrawerId] = useState(null)
  const [newTitle, setNewTitle] = useState('')

  const linked = useMemo(()=> state.items.filter(i=>i.meetingId===id), [state.items, id])

  if(!meeting){
    return <div className="page"><h2>Meeting not found</h2><p className="sub">Prototype.</p></div>
  }
  const update = (patch)=> dispatch({ type:'UPSERT_MEETING', meeting: { ...meeting, ...patch } })

  return (
    <div className="page">
      <h2>{meeting.title}</h2>
      <p className="sub">{meeting.date} • {meeting.time}</p>

      <div className="grid2">
        <div className="card">
          <div className="hd"><div className="title">Notes</div><span className="chip">Meeting</span></div>
          <div style={{padding:14}}>
            <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Agenda</div>
            <input className="field" value={meeting.agenda || ''} onChange={(e)=>update({ agenda: e.target.value })} />
            <div style={{height:10}} />
            <div style={{color:'rgba(234,241,255,.65)', fontSize:12, marginBottom:6}}>Notes</div>
            <textarea className="field" style={{minHeight:140, resize:'vertical'}} value={meeting.notes || ''} onChange={(e)=>update({ notes: e.target.value })} placeholder="Notes…" />
            <div style={{height:10}} />
            <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
              <button className="btn" onClick={()=>createQuickNote({ title:'(quick note) Follow-up', meetingId:id })}>Add quick note</button>
              <button className="btn" onClick={()=>onQuickAddForMeeting?.(id)}>Quick Add (modal)</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="hd"><div className="title">Actions</div><span className="chip">{linked.length}</span></div>
          <div style={{padding:14}}>
            <div style={{display:'flex', gap:10, flexWrap:'wrap', alignItems:'center'}}>
              <input className="field" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} placeholder="New action title…" />
              <button className="btn primary" onClick={()=>{
                const t=newTitle.trim(); if(!t) return
                createItem({ type:'task', title:t, meetingId:id }); setNewTitle('')
              }}>Add Task</button>
              <button className="btn" onClick={()=>{
                const t=newTitle.trim(); if(!t) return
                createItem({ type:'chase', title:t, meetingId:id }); setNewTitle('')
              }}>Add Chase</button>
            </div>

            <div style={{height:12}} />
            <div className="log">
              {linked.map(i=>(
                <div key={i.id} className="entry" style={{cursor:'pointer'}} onClick={()=>setDrawerId(i.id)}>
                  <span style={{display:'flex', gap:10, alignItems:'center'}}>
                    <span className={`pill ${i.type}`}>{i.type}</span>
                    <span style={{color:'rgba(234,241,255,.85)'}}>{i.title}</span>
                  </span>
                  <span style={{display:'flex', gap:8, alignItems:'center'}}>
                    <span className={`badge ${i.status}`}>{i.status}</span>
                    <span style={{color:'rgba(234,241,255,.45)'}}>{i.nextActionDate || ''}</span>
                  </span>
                </div>
              ))}
              {linked.length===0 && <div style={{color:'rgba(234,241,255,.55)', fontSize:13}}>No items linked yet.</div>}
            </div>
          </div>
        </div>
      </div>

      {drawerId && <ItemDrawer itemId={drawerId} onClose={()=>setDrawerId(null)} />}
    </div>
  )
}
