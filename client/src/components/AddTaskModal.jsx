import { useState } from 'react'

function AddTaskModal({ colStatus, onClose, onAdd }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!title.trim()) return
    setBusy(true)
    await onAdd(title.trim(), desc.trim(), colStatus)
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
