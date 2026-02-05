import React from 'react'
export function Icon({ name, size=18 }){
  const common = { width:size, height:size, viewBox:'0 0 24 24', fill:'none', xmlns:'http://www.w3.org/2000/svg' }
  switch(name){
    case 'search':
      return <svg {...common}><path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2"/><path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    case 'today':
      return <svg {...common}><path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M6 11h5M6 15h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 5h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2"/></svg>
    case 'inbox':
      return <svg {...common}><path d="M4 4h16v10H4V4Z" stroke="currentColor" strokeWidth="2"/><path d="M4 14l3 6h10l3-6" stroke="currentColor" strokeWidth="2"/><path d="M9 14v2h6v-2" stroke="currentColor" strokeWidth="2"/></svg>
    case 'list':
      return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M3 6h1M3 12h1M3 18h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    case 'meet':
      return <svg {...common}><path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2"/><path d="M17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2"/><path d="M2 20a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 20a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    default:
      return <span style={{display:'inline-block', width:size, height:size}} />
  }
}
