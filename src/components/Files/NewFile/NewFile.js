import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { uploadFile } from '../../../store/actions'

import uploadIcon from '../../../assets/images/upload.svg'
import style from './NewFile.module.scss'

const mapStateToProps = state => ({
  app: state.app,
  user: state.user,
})

const mapDispatchToProps = { uploadFile }

const NewFile = props => {
  const {
    app: { theme, uploadingFile },
    uploadFile,
  } = props

  const [category, setCategory] = useState(props.category || '')
  const [name, setName] = useState(props.name || '')
  const [extension, setExtension] = useState(props.extension || '')
  const [selectedFile, setSelectedFile] = useState()

  useEffect(() => {
    if (!uploadingFile) {
      setCategory('')
      setName('')
      setExtension('')
      setSelectedFile(null)
    }
  }, [uploadingFile])

  const fileHandler = event => {
    const [file] = event.target.files

    if (!file) return

    if (file.size <= 1024 * 1024 * 10) {
      const fileName = file.name.slice(0, file.name.lastIndexOf('.'))
      const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)

      setName(fileName.trim())
      setExtension(fileExtension.toLowerCase().trim())
      setSelectedFile(file)
    } else {
      alert('File size exceeds 10MB')
      setCategory('')
      setName('')
      setExtension('')
      setSelectedFile(null)
      document.querySelector('#file-input').value = ''
    }
  }

  const submitForm = event => {
    event.preventDefault()

    if (!selectedFile) return alert('No file selected')
    if (!name) return alert('File name is required')

    uploadFile({ category, name, extension, selectedFile })
  }

  return (
    <form className={`${style.file} ${uploadingFile ? style.uploading : ''}`} onSubmit={submitForm} autoComplete="off">
      <input
        className={style.category}
        type="text"
        value={category}
        dir="auto"
        placeholder="CATEGORY"
        maxLength="24"
        title="Optional"
        onChange={event => setCategory(event.target.value.toUpperCase().slice(0, 24))} // forces maxLength on mobile devices
      />

      <input
        className={`${style.name} ${theme === 'dark' ? style.nameDark : ''}`}
        type="text"
        dir="auto"
        placeholder="Name"
        value={name}
        onChange={event => setName(event.target.value)}
      />

      <div className={style.infoWrap}>
        <div className={style.extension} title={extension}>
          {extension}
        </div>

        <label className={style.fileLabel} htmlFor="file-input">
          <img
            className={style.selectFile}
            src={uploadIcon}
            alt={selectedFile ? selectedFile.name : props.name || 'Upload a File'}
            title={selectedFile ? selectedFile.name : props.name || 'Upload a File'}
          />
        </label>
        <input className={style.fileInput} id="file-input" type="file" onChange={fileHandler} />

        <input className={style.upload} type="submit" value="UPLOAD" />
      </div>
    </form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NewFile)
