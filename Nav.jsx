import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from './icons'

const links = [
  { to:'/', label:'Today', icon:'today' },
  { to:'/inbox', label:'Inbox', icon:'inbox' },
  { to:'/items', label:'Items', icon:'list' },
  { to:'/meetings', label:'Meetings', icon:'meet' },
]

export function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo" />
        <div>
          <h1>Nudge</h1>
          <div style={{color:'rgba(234,241,255,.55)', fontSize:12}}>Tasks + chases</div>
        </div>
      </div>
      <nav className="nav">
        {links.map(l=>(
          <NavLink key={l.to} to={l.to} className={({isActive})=> isActive ? 'active' : ''}>
            <Icon name={l.icon} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{marginTop:14, padding:12, border:'1px solid rgba(255,255,255,.08)', borderRadius:16, background:'rgba(0,0,0,.18)', color:'rgba(234,241,255,.62)', fontSize:12}}>
        Tip: Quick Add creates an <b>Untriaged</b> note. Convert it later in Inbox.
      </div>
    </aside>
  )
}

export function BottomNav(){
  return (
    <div className="bottom-nav">
      {links.map(l=>(
        <NavLink key={l.to} to={l.to} className={({isActive})=> isActive ? 'active' : ''}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
            <Icon name={l.icon} size={18} />
            <div>{l.label}</div>
          </div>
        </NavLink>
      ))}
    </div>
  )
}
