import { useState } from 'react'
import TaskCard from './TaskCard'

const dotColors = {
  todo: '#3b82f6',
  inprogress: '#f97316',
  bug: '#ef4444',
  done: '#22c55e'
}

function Column({ label, colType, items, onMove, onRemove, onAddClick }) {
  const [dragOver, setDragOver] = useState(false)

  function handleDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const id = parseInt(e.dataTransfer.getData('taskId'))
    const from = e.dataTransfer.getData('fromStatus')
    if (from !== colType) {
      onMove(id, colType)
    }
  }

  return (
    <div
      className={`column ${colType} ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="col-head">
        <div className="col-head-left">
          <span className="col-dot" style={{ background: dotColors[colType] }} />
          <span className="col-label">{label}</span>
        </div>
        <span className="col-count">{items.length}</span>
      </div>

      <div className="cards-wrap">
        {items.length === 0 && (
          <div className="empty-hint">Drop tasks here</div>
        )}
        {items.map(item => (
          <TaskCard
            key={item.id}
            task={item}
            onMove={onMove}
            onRemove={onRemove}
          />
        ))}
      </div>

      <button className="add-col-btn" onClick={onAddClick}>
        + Add task
      </button>
    </div>
  )
}

export default Column
