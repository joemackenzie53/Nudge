export function isBlocked(item, itemsById){
  const blockers = item.blockers || []
  return blockers.some(id=>{
    const b = itemsById[id]
    return b && b.status !== 'done'
  })
}
export function cmpISO(a,b){
  if(!a && !b) return 0
  if(!a) return 1
  if(!b) return -1
  return a.localeCompare(b)
}
