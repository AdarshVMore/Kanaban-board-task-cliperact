import { useState, useEffect, useRef } from 'react'
import Column from './components/Column'
import AddTaskModal from './components/AddTaskModal'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)
  const [modalCol, setModalCol] = useState(null)
  const [boardName, setBoardName] = useState('My Board')
  const [editingName, setEditingName] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    loadAll()
  }, [])

  useEffect(() => {
    if (editingName && nameRef.current) {
      nameRef.current.focus()
      nameRef.current.select()
    }
  }, [editingName])

  async function loadAll() {
    try {
      const res = await fetch('/tasks')
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      setErr('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(title, desc, status) {
    try {
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: desc, status })
      })
      if (!res.ok) {
        const body = await res.json()
        setErr(body.error)
        return
      }
      const created = await res.json()
      setTasks(prev => [...prev, created])
    } catch (e) {
      setErr('Failed to add task')
    }
  }

  async function moveTask(id, newStatus) {
    try {
      const res = await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const updated = await res.json()
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    } catch (e) {
      setErr('Failed to move task')
    }
  }

  async function removeTask(id) {
    try {
      await fetch(`/tasks/${id}`, { method: 'DELETE' })
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      setErr('Failed to delete task')
    }
  }

  function saveName() {
    if (!boardName.trim()) setBoardName('My Board')
    setEditingName(false)
  }

  const cols = [
    { label: 'To Do',       type: 'todo' },
    { label: 'In Progress', type: 'inprogress' },
    { label: 'Bug',         type: 'bug' },
    { label: 'Done',        type: 'done' },
  ]

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          {editingName ? (
            <input
              ref={nameRef}
              className="name-input"
              value={boardName}
              onChange={e => setBoardName(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => { if (e.key === 'Enter') saveName() }}
            />
          ) : (
            <span className="board-name" title="Click to rename" onClick={() => setEditingName(true)}>
              {boardName}
            </span>
          )}
        </div>
        <span className="total-badge">{tasks.length} tasks</span>
      </header>

      {err && (
        <div className="err-toast">
          <span>{err}</span>
          <button onClick={() => setErr(null)}>✕</button>
        </div>
      )}

      {loading ? (
        <div className="loader-wrap">
          <div className="spin" />
        </div>
      ) : (
        <div className="board">
          {cols.map(col => (
            <Column
              key={col.type}
              label={col.label}
              colType={col.type}
              items={tasks.filter(t => t.status === col.type)}
              onMove={moveTask}
              onRemove={removeTask}
              onAddClick={() => setModalCol(col.type)}
            />
          ))}
        </div>
      )}

      {modalCol && (
        <AddTaskModal
          colStatus={modalCol}
          onClose={() => setModalCol(null)}
          onAdd={addTask}
        />
      )}
    </div>
  )
}

export default App
