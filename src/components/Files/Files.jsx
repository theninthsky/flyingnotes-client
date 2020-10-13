import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

// import NewFile from './NewFile'
import File from './File'
import { getFiles } from '.././../store/actions'

const Wrapper = styled.div`
  margin: 0 auto;
  width: 95%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
`

const mapStateToProp = state => ({ files: state.files })

const Files = ({ files }) => {
  useEffect(() => {
    getFiles()
  }, [])

  const sortedFiles = useMemo(() => [...files].sort((a, b) => new Date(b.date) - new Date(a.date)), [files])

  return (
    <Wrapper>
      {/* <NewFile /> */}

      {sortedFiles.map(file => (
        <File key={file._id} file={file} />
      ))}
    </Wrapper>
  )
}

export default connect(mapStateToProp)(Files)