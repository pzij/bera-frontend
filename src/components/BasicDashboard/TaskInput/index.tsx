import React, { InputHTMLAttributes, useMemo, useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, type DraftTodoRecordType, type TodoRecordType } from '../BasicDashboardSlice'
import { getUrl } from '../../../utils/env'

function TaskInput (props: any) {
  const { path, date, todo, isLast } = props

  const authorization: string = useSelector((state: any) => {
    return `JWT ${state.main.authToken}`
  })
  const inputRef = useRef<any>()
  const dispatch = useDispatch()

  useEffect(() => {
    if (inputRef.current && todo.text) {
      inputRef.current.value = todo.text
    }
  }, [inputRef.current, todo.text])

  const addTask = async () => {
    if (inputRef.current?.value === '') return
    const value = inputRef.current?.value
    if (isLast) {
      const ts = new Date().getTime()
      // const tdId = ts.toString(32) + Math.floor(Math.random() * 1000);
      const newTodo: DraftTodoRecordType = {
        date,
        listId: null,
        note: null,
        text: value,
        done: false,
        modifiedAt: ts.toString(),
        createdAt: ts.toString(),
        isMD: null,
        tags: null
      }
      dispatch({ type: 'basicDashboard/addTodo', payload: newTodo })
      await fetch(`${getUrl()}/api/todorecord`, {
        method: 'post',
        body: JSON.stringify(newTodo),
        headers: {
          'content-type': 'application/json',
          authorization
        }
      }).catch(e => { console.error(e) })
    } else if (value) {
      const newTodo: Partial<TodoRecordType> = {
        id: todo.id,
        text: value as string
      }
      dispatch({ type: 'basicDashboard/updateTodo', payload: newTodo })
      await fetch(`${getUrl()}/api/todorecord/${newTodo.id ?? ''}`, {
        method: 'put',
        body: JSON.stringify(newTodo),
        headers: {
          'content-type': 'application/json',
          authorization
        }
      }).catch(e => { console.error(e) })
    }
  }

  return (
        <input
            ref={inputRef}
            key={path}
            className={'relative w-full py-1 px-2 mb-1 border-b-slate-300 border-b-[.01rem] focus:rounded-sm focus:outline-dashed focus:outline-1 focus:outline-neutral-400 dark:bg-[#313a47] dark:text-slate-200'}
            onChange={e => {
              console.log('e.target', e)
              if (inputRef.current) {
                inputRef.current.value = e.target.value
              }
            }}
            onBlur={() => { void addTask() }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void addTask()
              }
            }}
        />
  )
}

export default TaskInput
