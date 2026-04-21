// BUG: useCallback is imported but never used
import { useState, useCallback } from 'react'

function AddTaskModal({ colStatus, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState('none')
  const [dueDate, setDueDate] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!title.trim()) return
    setBusy(true)
    await onAdd(title.trim(), desc.trim(), colStatus, priority, dueDate || null)
    setBusy(false)
    onClose()
  }

  function handleOverlayKey(e) {
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="overlay" onClick={onClose} onKeyDown={handleOverlayKey}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>New Task</h3>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Title</label>
            <input
              autoFocus
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              placeholder="Add some details... (optional)"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={4}
            />
          </div>
          <div className="field">
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)} className="status-select">
              <option value="none">None</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="field">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-submit"
            onClick={submit}
            disabled={busy || !title.trim()}
          >
            {busy ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTaskModal
