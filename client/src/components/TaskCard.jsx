import { useState } from 'react'

const accents = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

const statusOptions = [
  { value: 'todo',       label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },

]

function TaskCard({ task, onMove, onRemove }) {
  const [dragging, setDragging] = useState(false)

  const color = accents[task.id % accents.length]
  const done = task.status === 'done'

  function onDragStart(e) {
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.setData('fromStatus', task.status)
    e.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  function onDragEnd() {
    setDragging(false)
  }

  function handleStatusChange(e) {
    const next = e.target.value
    if (next !== task.status) {
      onMove(task.id, next)
    }
  }

  return (
    <div
      className={`card ${dragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="card-top">
        <div className="card-accent" style={{ background: color }} />
        <p className={`card-title ${done ? 'striked' : ''}`}>{task.title}</p>
        {task.description && (
          <p className="card-desc">{task.description}</p>
        )}
      </div>
      <div className="card-foot">
        <button className="btn-del" onClick={() => onRemove(task.id)}>
          Delete
        </button>
        <select
          className="status-select"
          value={task.status}
          onChange={handleStatusChange}
          onClick={e => e.stopPropagation()}
        >
          {statusOptions.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default TaskCard
