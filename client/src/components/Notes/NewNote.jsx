import React, { useState } from 'react'
import { connect } from 'react-redux'
import { GithubPicker } from 'react-color'

import * as actions from '../../store/actions/index'
import { fileToBase64 } from '../../util/data_uri'
import NoteSpinner from '../UI/NoteSpinner'
import styles from './NewNote.module.scss'

import colorPaletteIcon from '../../assets/images/color-palette.svg'
import uploadIcon from '../../assets/images/upload.svg'

const colorsArray = [
  '#c0392b',
  '#d35400',
  '#f39c12',
  '#27ae60',
  '#16a085',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
  '#7f8c8d',
  '#bdc3c7'
]

const NewNote = props => {
  const { update, toggleEditMode, closeOptions } = props
  const { theme, addingNote } = props.user
  const { addNote, updateNote } = props

  const [showColorPicker, setShowColorPicker] = useState(false)
  const [color, setColor] = useState(
    props.color || colorsArray[Math.floor(Math.random() * 10)]
  )
  const [category, setCategory] = useState(props.category || '')
  const [title, setTitle] = useState(props.title || '')
  const [content, setContent] = useState(props.content || '')
  const [selectedFile, setSelectedFile] = useState(
    props.fileName ? { fileName: props.fileName } : null
  )

  const colorHanlder = color => {
    setColor(color.hex)
    setShowColorPicker(false)
  }

  const categoryHanlder = event => setCategory(event.target.value.slice(0, 24)) // forces maxLength on mobile

  const titleHandler = event => setTitle(event.target.value)

  const contentHandler = event => setContent(event.target.value)

  const fileHandler = event => {
    const file = event.target.files[0]

    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        fileToBase64(file).then(encoded =>
          setSelectedFile({ fileName: file.name, file: encoded })
        )
      } else {
        alert('File size exceeds 2MB')
        setSelectedFile(null)
        document.querySelector('input[type="file"]').value = ''
      }
    } else {
      setSelectedFile(null)
    }
  }

  const saveNoteHandler = event => {
    event.preventDefault()
    const note = {
      _id: props._id,
      color,
      category: category.trim(),
      title: title.trim(),
      content,
      ...selectedFile
    }
    if (update) {
      updateNote(note)
      toggleEditMode()
      closeOptions()
    } else {
      addNote(note)
      setColor('#006B76')
      setCategory('')
      setTitle('')
      setContent('')
      setSelectedFile(null)
    }
  }

  return (
    <div
      className={`${styles.note} ${theme === 'dark' ? styles.noteDark : ''}`}
    >
      <form onSubmit={saveNoteHandler} autoComplete="off">
        <img
          className={styles.colorPalette}
          src={colorPaletteIcon}
          alt="Choose color"
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        {showColorPicker ? (
          <GithubPicker
            className={styles.colorPicker}
            width="262px"
            triangle="hide"
            colors={colorsArray}
            onChangeComplete={colorHanlder}
          />
        ) : (
          <>
            <div
              className={styles.categoryBackground}
              style={{ backgroundColor: color }}
            >
              &nbsp;
            </div>
            <input
              className={styles.category}
              type="text"
              value={category.toUpperCase()}
              dir="auto"
              placeholder="CATEGORY"
              maxLength="24"
              title="Optional"
              onChange={categoryHanlder}
            />
          </>
        )}
        <input
          className={`${styles.title} ${
            theme === 'dark' ? styles.titleDark : ''
          }`}
          type="text"
          dir="auto"
          placeholder="Title"
          value={title}
          title="Optional"
          maxLength="60"
          onChange={titleHandler}
        />
        <>
          <textarea
            className={styles.content}
            dir="auto"
            value={content}
            title="Note's content"
            required
            onChange={contentHandler}
          ></textarea>
          {localStorage.name ? (
            <>
              <label htmlFor={`file-input-${props._id}`}>
                <img
                  className={styles.upload}
                  src={uploadIcon}
                  alt={selectedFile ? selectedFile.fileName : 'Upload a File'}
                  title={selectedFile ? selectedFile.fileName : 'Upload a File'}
                  onClick={() => {}}
                />
              </label>
              <input
                className={styles.fileInput}
                id={`file-input-${props._id}`}
                type="file"
                onChange={fileHandler}
              />
            </>
          ) : null}
        </>
        <input className={styles.save} type="submit" value="SAVE" />
        {addingNote ? <NoteSpinner /> : null}
      </form>
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  addNote: note => dispatch(actions.addNote(note)),
  updateNote: note => dispatch(actions.updateNote(note))
})

export default connect(mapStateToProps, mapDispatchToProps)(NewNote)
