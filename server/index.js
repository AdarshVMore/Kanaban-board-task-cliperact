const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

let tasks = []
let idCounter = 1

const validPriorities = ['none', 'low', 'medium', 'high']

// GET /tasks — supports optional ?priority= filter
app.get('/tasks', (req, res) => {
  const { priority } = req.query

  if (priority) {
    // BUG: loose equality (==) instead of strict (===)
    const filtered = tasks.filter(t => t.priority == priority)
    return res.json(filtered)
  }

  res.json(tasks)
})

app.post('/tasks', (req, res) => {
  const title = req.body.title
  const description = req.body.description || ''
  const validStatuses = ['todo', 'inprogress', 'bug', 'done']
  const status = validStatuses.includes(req.body.status) ? req.body.status : 'todo'
  const priority = validPriorities.includes(req.body.priority) ? req.body.priority : 'none'

  // BUG: dueDate is accepted as-is with no format validation
  const dueDate = req.body.dueDate || null

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title cannot be empty' })
  }

  const task = {
    id: idCounter,
    title: title.trim(),
    description: description.trim(),
    status,
    priority,
    dueDate
  }

  idCounter++
  tasks.push(task)
  res.status(201).json(task)
})

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const status = req.body.status

  const valid = ['todo', 'inprogress', 'bug', 'done']
  if (!valid.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  let found = null
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      found = tasks[i]
      break
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Task not found' })
  }

  // BUG: only updates status — priority and dueDate updates are ignored
  found.status = status
  res.json(found)
})

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const idx = tasks.findIndex(t => t.id === id)

  if (idx === -1) {
    return res.status(404).json({ error: 'Task not found' })
  }

  tasks.splice(idx, 1)
  res.json({ message: 'deleted' })
})

app.listen(3001, () => {
  console.log('server is running on http://localhost:3001')
})
