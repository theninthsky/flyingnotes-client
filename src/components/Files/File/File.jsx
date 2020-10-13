import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { downloadFile } from '../../../store/actions'
import FileSpinner from '../../UI/FileSpinner'

import downloadIcon from '../../../assets/images/download.svg'

// #region Styles
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 500px;
  height: 34px;
  margin: 20px;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  font-family: inherit;
  background-color: inherit;
  color: inherit;
  transition: 0.2s;
  animation: showFile 0.5s;

  &:hover {
    box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.2);
  }

  @keyframes showFile {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 480px) {
    width: 100%;
    margin: 10px 0;
  }
`
const Category = styled.div`
  width: 25%;
  padding: 9px 5px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(150, 150, 150);
  background-color: #ffffde;

  @media (max-width: 480px) {
    max-width: 40%;
  }
`
const Name = styled.h1`
  max-width: 100%;
  margin: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 18px;
  font-weight: normal;
`
const InfoWrap = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 15%;
  height: 100%;
`
const Extension = styled.div`
  @media (max-width: 480px) {
    font-size: 12px;
  }
`
const Download = styled.img`
  width: 15px;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
// #endregion

const saveFile = (name, extension, attachment) => {
  const link = document.createElement('a')

  link.href = window.URL.createObjectURL(new Blob([attachment]))
  link.setAttribute('download', `${name}.${extension}`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const mapStateToProp = state => ({ app: state.app })

const mapDispatchToProps = { downloadFile }

const File = ({
  file: { _id, category, name, extension, attachment },
  app: { downloadingFileID } = {},
  downloadFile,
}) => {
  useEffect(() => {
    if (attachment) saveFile(name, extension, attachment)
  }, [attachment, name, extension])

  const downloadFileHandler = () => {
    if (!attachment) return downloadFile(_id)

    saveFile(name, extension, attachment)
  }

  return (
    <Wrapper>
      {category && <Category>{category.toUpperCase()}</Category>}

      <Name title={name}>{name}</Name>

      <InfoWrap>
        <Extension title={extension}>{extension}</Extension>

        {downloadingFileID === _id ? (
          <FileSpinner />
        ) : (
          <Download alt="Download" src={downloadIcon} onClick={downloadFileHandler} />
        )}
      </InfoWrap>
    </Wrapper>
  )
}

export default connect(mapStateToProp, mapDispatchToProps)(File)