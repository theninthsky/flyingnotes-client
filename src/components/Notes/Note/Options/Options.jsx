import React, { useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { deleteNote } from '../../../../store/actions/index'

import editSymbol from '../../../../assets/images/edit.svg'
import deleteSymbol from '../../../../assets/images/delete.svg'
import confirmSymbol from '../../../../assets/images/confirm.svg'
import cancelSymbol from '../../../../assets/images/cancel.svg'

// #region Styles
const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 21.5px;
  border-radius: 4px 4px 0 0;
  background-color: transparent;
  animation: showOptions 0.5s;

  @keyframes showOptions {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
const Confirm = styled.img`
  position: absolute;
  bottom: 6px;
  left: 2.5%;
  height: 75%;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
const Cancel = styled.img`
  position: absolute;
  bottom: 6px;
  left: 15%;
  height: 75%;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
const Edit = styled.img`
  position: absolute;
  bottom: 6px;
  left: 2.5%;
  height: 75%;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
const Delete = styled.img`
  position: absolute;
  bottom: 6px;
  left: 15%;
  height: 75%;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
// #endregion

const mapDispatchToProps = {
  deleteNote,
}

const Options = ({ id, edit, deleteNote, toggleConfirmMessage }) => {
  const [showConfirmIcons, setShowConfirmIcons] = useState(false)

  const deletePressedHandler = bool => {
    toggleConfirmMessage(bool)
    setShowConfirmIcons(bool)
  }

  return (
    <Wrapper>
      {showConfirmIcons ? (
        <>
          <Confirm src={confirmSymbol} alt="Confirm" title="Confirm" onClick={() => deleteNote(id)} />
          <Cancel src={cancelSymbol} alt="Cancel" title="Cancel" onClick={() => deletePressedHandler(false)} />
        </>
      ) : (
        <>
          <Edit src={editSymbol} alt="Edit" title="Edit" onClick={edit} />
          <Delete src={deleteSymbol} alt="Delete" title="Delete" onClick={() => deletePressedHandler(true)} />
        </>
      )}
    </Wrapper>
  )
}

export default connect(null, mapDispatchToProps)(Options)