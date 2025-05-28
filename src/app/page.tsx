'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Todo } from '@/types/todo'
import { createClient } from '@/lib/supabaseClient'

const supabase = createClient()

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ✅ Check auth session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/login')
      } else {
        fetchTodos()
      }
      setLoading(false)
    }
    checkSession()
  }, [])

  const fetchTodos = async () => {
    const res = await fetch('/api/todos')
    const data = await res.json()

    if (Array.isArray(data)) {
      setTodos(data)
    } else {
      console.error('Invalid todos response:', data)
      setTodos([]) // fallback to empty array
    }
  }


  const createTodo = async () => {
    if (!newTodo.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title: newTodo }),
    })
    const data = await res.json()
    setTodos([data, ...todos])
    setNewTodo('')
  }

  const toggleComplete = async (id: string, isComplete: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_complete: !isComplete }),
    })
    const updated = await res.json()
    setTodos(todos.map(todo => (todo.id === id ? updated : todo)))
  }

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
  }

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: editTitle }),
    })
    const updated = await res.json()
    setTodos(todos.map(todo => (todo.id === id ? updated : todo)))
    setEditingId(null)
    setEditTitle('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p>Loading...</p>

  return (
    <main className="p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo App</h1>
        <button onClick={handleLogout} className="text-sm text-red-500 border px-2 py-1 rounded">
          Sign Out
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={createTodo}>
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo) => (  
          <li key={todo.id} className="flex justify-between items-center border-b py-2">
            {editingId === todo.id ? (
              <input
                className="flex-1 border p-1 mr-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <span
                className={`flex-1 cursor-pointer ${todo.is_complete ? 'line-through text-gray-500' : ''}`}
                onClick={() => toggleComplete(todo.id, todo.is_complete)}
              >
                {todo.title}
              </span>
            )}
            {editingId === todo.id ? (
              <button className="text-green-600 mr-2" onClick={() => saveEdit(todo.id)}>Save</button>
            ) : (
              <button className="text-yellow-500 mr-2" onClick={() => startEditing(todo)}>Edit</button>
            )}
            <button className="text-red-500" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p>No todos found or failed to load.</p>}
    </main>
  )
}
