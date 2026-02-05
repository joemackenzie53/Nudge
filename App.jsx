import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { DataProvider } from './data/store'
import { Sidebar, BottomNav } from './components/Nav'
import Topbar from './components/Topbar'
import QuickAddModal from './components/QuickAddModal'

import Today from './pages/Today'
import Inbox from './pages/Inbox'
import Items from './pages/Items'
import Meetings from './pages/Meetings'
import MeetingDetail from './pages/MeetingDetail'

export default function App(){
  return (
    <DataProvider>
      <Shell />
    </DataProvider>
  )
}

function Shell(){
  const [search, setSearch] = useState('')
  const [quickOpen, setQuickOpen] = useState(false)
  const [quickMeetingId, setQuickMeetingId] = useState('')

  const openQuickAdd = (meetingId='')=>{
    setQuickMeetingId(meetingId)
    setQuickOpen(true)
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar search={search} setSearch={setSearch} onQuickAdd={()=>openQuickAdd('')} />

        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/inbox" element={<Inbox searchTerm={search} />} />
          <Route path="/items" element={<Items searchTerm={search} />} />
          <Route path="/meetings" element={<Meetings searchTerm={search} />} />
          <Route path="/meetings/:id" element={<MeetingDetail onQuickAddForMeeting={(id)=>openQuickAdd(id)} />} />
        </Routes>

        <BottomNav />

        <QuickAddModal open={quickOpen} meetingId={quickMeetingId} onClose={()=>setQuickOpen(false)} />
      </main>
    </div>
  )
}
