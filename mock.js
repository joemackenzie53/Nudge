export function uid(prefix='id'){
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}
export function isoDate(d){
  const pad=(n)=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}
export function todayISO(){ return isoDate(new Date()) }
export function addDaysISO(iso, days){
  const d = new Date(iso+'T00:00:00')
  d.setDate(d.getDate()+days)
  return isoDate(d)
}
export function createMockData(){
  const today = todayISO()
  const meetings = [
    { id:'m1', title:'Project Sync', date: today, time:'15:00', agenda:'Status, blockers, next steps', notes:'', decisions:[] },
    { id:'m2', title:'1:1', date: today, time:'17:00', agenda:'Progress, support, next week', notes:'', decisions:[] },
    { id:'m3', title:'Stakeholder update', date: addDaysISO(today, 1), time:'11:00', agenda:'Metrics + risks', notes:'', decisions:[] },
  ]
  const items = [
    { id:'i1', type:'chase', title:'Chase Alice re: KYC ticket', status:'open', nextActionDate: today, dueDate:'', energy:'', estimateMin:'', person:'Alice', meetingId:'', blockers:[], log:[{id:uid('l'), ts:Date.now()-86400000*3, text:'Created'},{id:uid('l'), ts:Date.now()-86400000*1, text:'Chased (email)'}]},
    { id:'i2', type:'task', title:'Draft release notes', status:'open', nextActionDate: today, dueDate: addDaysISO(today,2), energy:'deep', estimateMin:'45', person:'', meetingId:'', blockers:[], log:[{id:uid('l'), ts:Date.now()-86400000*2, text:'Created'}]},
    { id:'i3', type:'task', title:'Submit payout file', status:'open', nextActionDate: today, dueDate: today, energy:'deep', estimateMin:'45', person:'', meetingId:'', blockers:['i4'], log:[{id:uid('l'), ts:Date.now()-86400000, text:'Created'}]},
    { id:'i4', type:'task', title:'Confirm bank data', status:'open', nextActionDate: today, dueDate:'', energy:'shallow', estimateMin:'10', person:'', meetingId:'', blockers:[], log:[{id:uid('l'), ts:Date.now()-86400000, text:'Created'}]},
    { id:'i5', type:'untriaged', title:'Follow up with Kora support about payout failure', status:'open', nextActionDate:'', dueDate:'', energy:'', estimateMin:'', person:'', meetingId:'', blockers:[], log:[{id:uid('l'), ts:Date.now()-3600*1000, text:'Quick note added'}]},
    { id:'i6', type:'untriaged', title:'Send revised PRD to design team', status:'open', nextActionDate:'', dueDate:'', energy:'', estimateMin:'', person:'', meetingId:'m1', blockers:[], log:[{id:uid('l'), ts:Date.now()-2400*1000, text:'Quick note added (from meeting)'}]},
    { id:'i7', type:'task', title:'Write stakeholder update email', status:'open', nextActionDate: addDaysISO(today,1), dueDate: addDaysISO(today,1), energy:'shallow', estimateMin:'15', person:'', meetingId:'m3', blockers:[], log:[{id:uid('l'), ts:Date.now()-86400000, text:'Created'}]},
  ]
  return { items, meetings }
}
