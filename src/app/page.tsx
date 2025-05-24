'use client'

import { useEffect, useState } from 'react'
import { Todo } from '@/types/todo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(data)
  }

  const createTodo = async () => {
    if (!newTodo) return
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

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
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
            <span
              className={`flex-1 cursor-pointer ${todo.is_complete ? 'line-through text-gray-500' : ''}`}
              onClick={() => toggleComplete(todo.id, todo.is_complete)}
            >
              {todo.title}
            </span>
            <button className="text-red-500" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
