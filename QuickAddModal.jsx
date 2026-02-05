import React, { useEffect, useRef, useState } from 'react'
import { useData } from '../data/store'

export default function QuickAddModal({ open, onClose, meetingId='' }){
  const { createQuickNote } = useData()
  const [text, setText] = useState('')
  const ref = useRef(null)

  useEffect(()=>{
    if(open){
      setText('')
      setTimeout(()=>ref.current?.focus(), 50)
    }
  }, [open])

  if(!open) return null

  function submit(e){
    e.preventDefault()
    const t = text.trim()
    if(!t) return
    createQuickNote({ title: t, meetingId })
    onClose?.()
  }

  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="drawer" style={{width:'min(520px,100%)'}} onMouseDown={(e)=>e.stopPropagation()}>
        <div className="hdr">
          <div>
            <h3>Quick Add</h3>
            <div style={{color:'rgba(234,241,255,.6)', fontSize:13, marginTop:4}}>
              Creates an <b>Untriaged</b> note{meetingId ? ' linked to this meeting' : ''}.
            </div>
          </div>
          <button className="btn ghost" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={submit} className="section">
          <h4>Note</h4>
          <input ref={ref} className="field" placeholder="Type a quick note..." value={text} onChange={(e)=>setText(e.target.value)} />
          <div style={{display:'flex', justifyContent:'flex-end', marginTop:10}}>
            <button className="btn primary" type="submit">Add</button>
          </div>
        </form>

        <div className="section">
          <h4>What next</h4>
          <div style={{color:'rgba(234,241,255,.65)', fontSize:13, lineHeight:1.5}}>
            Open <b>Inbox</b> to convert notes into a <b>Task</b> or <b>Chase</b> and set the <b>Next action date</b>.
          </div>
        </div>
      </div>
    </div>
  )
}
