import React from 'react'
import { Icon } from './icons'

export default function Topbar({ search, setSearch, onQuickAdd }){
  return (
    <div className="topbar">
      <div className="search">
        <Icon name="search" />
        <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search items & meetings..." />
      </div>
      <button className="btn primary" onClick={onQuickAdd}>
        <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
          <Icon name="plus" />
          Quick Add
        </span>
      </button>
      <button className="btn ghost" onClick={()=>alert('Prototype: hook this to auth later')}>Sign out</button>
    </div>
  )
}
