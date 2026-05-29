import { useState } from 'react'

const accents = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

const statusOptions = [
  { value: 'todo',       label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'bug',        label: 'Bug' },
  { value: 'done',       label: 'Done' },
]

const priorityStyles = {
  high:   { background: '#fee2e2', color: '#b91c1c', label: 'High' },
  medium: { background: '#fef9c3', color: '#92400e', label: 'Medium' },
  low:    { background: '#dcfce7', color: '#166534', label: 'Low' },
  none:   null,
}

function isOverdue(dueDate) {
  if (!dueDate) return false
  // BUG: compares raw Date objects without stripping time-of-day,
  // so a task due *today* is flagged overdue if current time > midnight
  return new Date(dueDate) < new Date()
}

function formatDate(dueDate) {
  if (!dueDate) return null
  const d = new Date(dueDate)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function TaskCard({ task, onMove, onRemove }) {
  const [dragging, setDragging] = useState(false)

  const color = accents[task.id % accents.length]
  const done = task.status === 'done'
  const overdue = !done && isOverdue(task.dueDate)
  const pStyle = priorityStyles[task.priority] || null

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
      className={`card ${dragging ? 'dragging' : ''} ${overdue ? 'overdue' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="card-top">
        <div className="card-accent" style={{ background: color }} />
        <div className="card-title-row">
          <p className={`card-title ${done ? 'striked' : ''}`}>{task.title}</p>
          {pStyle && (
            <span className="priority-badge" style={{ background: pStyle.background, color: pStyle.color }}>
              {pStyle.label}
            </span>
          )}
        </div>

        {/* BUG: dangerouslySetInnerHTML used here — opens XSS vulnerability
            if task.description contains user-supplied HTML/script content */}
        {task.description && (
          <p
            className="card-desc"
            dangerouslySetInnerHTML={{ __html: task.description }}
          />
        )}

        {task.dueDate && (
          <div className={`due-date ${overdue ? 'due-overdue' : ''}`}>
            {overdue ? '⚠ Overdue · ' : 'Due: '}
            {formatDate(task.dueDate)}
          </div>
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
