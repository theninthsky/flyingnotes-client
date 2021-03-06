import { useState, useEffect, useRef } from 'react'
import { bool, string, func, shape, arrayOf } from 'prop-types'
import useClickOutside from 'use-click-outside'
import cx from 'clsx'

import { CATEGORY, TITLE, SAVE, DELETE_MESSAGE, RTL_REGEX } from './constants'
import If from 'components/If'
import Options from 'components/Options'

import style from './Note.scss'
import PinIcon from 'images/pin.svg'
import CheckedIcon from 'images/checked.svg'
import UncheckedIcon from 'images/unchecked.svg'

const emptyItem = { value: '', checked: false }
const defaultItems = [emptyItem]

const Note = ({
  newNote,
  list,
  _id,
  pinned = false,
  category: propsCategory = '',
  title: propsTitle = '',
  content: propsContent = '',
  items: propsItems = defaultItems,
  date,
  onCreate,
  onUpdatePin,
  onUpdate,
  onCheckItem,
  onDelete
}) => {
  const [category, setCategory] = useState(propsCategory)
  const [title, setTitle] = useState(propsTitle)
  const [content, setContent] = useState(propsContent)
  const [items, setItems] = useState(propsItems)
  const [editMode, setEditMode] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [confirmMessageVisible, setConfirmMessageVisible] = useState(false)
  const [checkingItem, setCheckingItem] = useState(false)
  const [loading, setLoading] = useState(false)

  const noteRef = useRef()
  const itemsRef = useRef()

  useEffect(() => {
    setCategory(propsCategory)
    setTitle(propsTitle)
    setContent(propsContent)
    setItems(propsItems)
  }, [propsCategory, propsTitle, propsContent, propsItems])

  useClickOutside(noteRef, () => {
    setOptionsVisible(false)
    setConfirmMessageVisible(false)
    setEditMode(false)
  })

  const reset = () => {
    setCategory('')
    setTitle('')
    setContent('')
    setItems([emptyItem])
  }

  const handleEnterPress = (event, index) => {
    if (event.key === 'Enter' && event.target.value) {
      setItems(prevItems => [...prevItems.slice(0, index + 1), emptyItem, ...prevItems.slice(index + 1)])

      const items = itemsRef.current.childNodes
      const nextIndex = [...items].findIndex(item => item.childNodes[1] === event.target) + 1

      setTimeout(() => items[nextIndex].childNodes[1].focus())
    }
  }

  const handleBackspacePress = (event, index) => {
    if ((event.key === 'Backspace' || event.key === 'Delete') && items.length > 1 && !items[index].value) {
      event.preventDefault()

      setItems(prevItems => prevItems.filter((_, ind) => ind !== index))

      const items = itemsRef.current.childNodes
      const prevIndex = [...items].findIndex(item => item.childNodes[1] === event.target) - 1

      setTimeout(() => items[prevIndex > 0 ? prevIndex : 0].childNodes[1].focus())
    }
  }

  const updatePin = async event => {
    event.stopPropagation()

    onUpdatePin(_id, pinned)
  }

  const checkItem = async (event, index) => {
    event.stopPropagation()

    const item = items[index]

    if (!item.value || checkingItem) return

    setCheckingItem(true)

    const otherItems = items.filter((_, ind) => ind !== index)
    const updatedItems = item.checked
      ? [{ ...item, checked: false }, ...otherItems]
      : [...otherItems, { ...item, checked: true }]

    await onCheckItem(_id, index, item, updatedItems)
    setItems(updatedItems)
    setCheckingItem(false)
  }

  const saveNote = async event => {
    event.preventDefault()

    const note = {
      pinned,
      category: list ? undefined : category.trim(),
      title: title.trim(),
      content: content.trim(),
      items: list ? items.map(item => ({ ...item, value: item.value.trim() })) : undefined
    }

    setLoading(true)

    if (newNote) {
      await onCreate(note)
      reset()
    } else {
      note._id = _id

      await onUpdate(note)
    }

    setEditMode(false)
    setOptionsVisible(false)
    setLoading(false)
  }

  const deleteNote = async () => {
    setLoading(true)
    onDelete(_id)
  }

  const originalItems = [...propsItems]
    .sort((a, b) => a.value.localeCompare(b.value))
    .map(({ value }) => value)
    .toString()
  const currentItems = [...items]
    .sort((a, b) => a.value.localeCompare(b.value))
    .map(({ value }) => value)
    .toString()

  const changed =
    category !== propsCategory || title !== propsTitle || content !== propsContent || originalItems !== currentItems

  return (
    <form
      className={cx(style.wrapper, { [style.disabled]: loading })}
      ref={noteRef}
      autoComplete="off"
      onClick={() => {
        if (!newNote) setOptionsVisible(true)
        setEditMode(true)
      }}
      onKeyPress={event => {
        if (list && event.key === 'Enter') event.preventDefault()
      }}
      onSubmit={saveNote}
    >
      <If condition={!newNote}>
        <PinIcon className={cx(style.pinIcon, { [style.pinned]: pinned })} onClick={updatePin} />
      </If>

      <If condition={!list && (newNote || category || editMode)}>
        <input
          className={style.category}
          value={category}
          dir="auto"
          placeholder={CATEGORY}
          aria-label="category"
          onChange={event => setCategory(event.target.value.toUpperCase().slice(0, 24))}
        />
      </If>

      <If condition={newNote || title || editMode}>
        <input
          className={style.title}
          value={title}
          dir="auto"
          placeholder={TITLE}
          aria-label="title"
          onChange={event => setTitle(event.target.value)}
        />
      </If>

      {list ? (
        <div
          className={style.content}
          ref={itemsRef}
          aria-label="content"
          onClick={() => {
            if (items.every(({ checked }) => checked)) {
              setItems([emptyItem, ...items])
              setTimeout(() => itemsRef.current.childNodes[0].childNodes[1].focus())
            }
          }}
        >
          {[...items]
            .sort((a, b) => a.checked - b.checked)
            .map(({ value, checked }, ind) => (
              <div className="d-flex" key={ind}>
                {checked ? (
                  <CheckedIcon className={style.checkIcon} onClick={event => checkItem(event, ind)} />
                ) : (
                  <UncheckedIcon className={style.checkIcon} onClick={event => checkItem(event, ind)} />
                )}

                <input
                  className={cx(style.item, { [style.disabled]: checked })}
                  dir={RTL_REGEX.test(value) ? 'rtl' : 'ltr'}
                  value={value}
                  required
                  disabled={checked}
                  onChange={event =>
                    setItems(prevItems =>
                      prevItems.map((item, index) => (index === ind ? { ...item, value: event.target.value } : item))
                    )
                  }
                  onKeyDown={event => handleBackspacePress(event, ind)}
                  onKeyUp={event => handleEnterPress(event, ind)}
                  onBlur={() => {
                    if (!value && items.length > 1) setItems(prevItems => prevItems.filter((_, index) => index !== ind))
                  }}
                />
              </div>
            ))}
        </div>
      ) : (
        <textarea
          className={style.content}
          rows={Math.floor(content.length / 50)}
          dir={RTL_REGEX.test(content) ? 'rtl' : 'ltr'}
          value={content}
          aria-label="content"
          required
          onChange={event => setContent(event.target.value)}
        />
      )}

      <If condition={optionsVisible}>
        <Options onDelete={deleteNote} setConfirmMessage={setConfirmMessageVisible} />
      </If>

      {confirmMessageVisible ? (
        <div className={style.confirmMessage}>{DELETE_MESSAGE}</div>
      ) : changed || newNote ? (
        <input
          className={cx(style.save, { [style.hidden]: !changed && !newNote })}
          type="submit"
          value={SAVE}
          aria-label="save"
        />
      ) : (
        <If condition={!newNote}>
          <div className={style.date}>{new Date(date).toLocaleString('en-GB').replace(',', '').slice(0, -3)}</div>
        </If>
      )}
    </form>
  )
}

Note.propTypes = {
  newNote: bool,
  list: bool,
  _id: string,
  pinned: bool,
  category: string,
  title: string,
  content: string,
  items: arrayOf(shape({ checked: bool, value: string })),
  date: string,
  onCreate: func,
  onUpdatePin: func,
  onUpdate: func,
  onCheckItem: func,
  onDelete: func
}

export default Note
