import { SET_NOTES, ADD_NOTE, UPDATE_NOTE, DELETE_NOTE, POPULATE_FILE } from '../actions/constants'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES:
      return action.notes || []
    case ADD_NOTE:
      return [...state, action.newNote]
    case UPDATE_NOTE:
      return state.map(note => (note._id === action.updatedNote._id ? action.updatedNote : note))
    case DELETE_NOTE:
      return state.filter(note => (note._id || note.date) !== action.noteID)
    case POPULATE_FILE:
      return state.map(note => (note._id === action.note._id ? action.note : note))
    default:
      return state
  }
}
