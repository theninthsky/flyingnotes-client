import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';

import Note from '../../components/Note/Note';
import NewNote from '../../components/Note/NewNote';
import * as actions from '../../store/actions/index';
import styles from './Notes.module.scss';

const Notes = props => {
    const { user: { userId, notesFetched, theme }, notes, fetchNotes } = props;

    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchFilter, setSeachFilter] = useState('');

    useEffect(() => {
        console.log('[Notes] rendered!');
        if (!notesFetched) {
            fetchNotes();
        }
    }, [ userId, notesFetched, notes, fetchNotes, theme ]);

    const categoryFilterHandler = event => setCategoryFilter(event.target.value);
    
    const searchFilterHandler = event => setSeachFilter(event.target.value.toLowerCase());

    const backgroundTheme = {
        color: theme === 'light' ? 'inherit' : 'white',
        backgroundColor: `rgb(${theme === 'light' ? '250, 249, 244' : '64, 64 ,64'})`
    };

    const filteredNotes = useMemo(() => [...notes]
        .filter(({ category }) => !categoryFilter ? true : category === categoryFilter)
        .filter(({ title, content }) => (title + ' ' + content).toLowerCase().includes(searchFilter))
        .sort((a, b) => b.date - a.date)
        .map(note => 
            <Note 
                key={note._id} 
                id={note._id} 
                theme={backgroundTheme}
                color={note.color} 
                category={note.category} 
                title={note.title} 
                content={note.content} 
                date={note.date} 
            />
    ), [notes, categoryFilter, searchFilter, backgroundTheme]);

    return (
        <>
        <div className={styles.filters}>
            <select className={styles.categoryFilter} style={{color: backgroundTheme.color}} onChange={categoryFilterHandler}>
                <option defaultValue disabled>CATEGORY</option>
                <option value="">ALL</option>
                { notes.filter(({ category }) => category).map(({ category, _id }) => <option key={_id}>{category}</option>) }
            </select>
            <input 
                className={styles.searchFilter} 
                style={{color: backgroundTheme.color}} 
                type="text" value={searchFilter} 
                placeholder="Search" 
                onChange={searchFilterHandler} 
            />
        </div>
        <div className={styles.notesContainer}>
            <NewNote theme={backgroundTheme}/>
            { filteredNotes }
        </div>
        </>
    );
};

const mapStateToProps = state => ({
    user: state.user,
    notes: state.notes
  });
  
  const mapDispatchToProps = dispatch => ({
    fetchNotes: () => dispatch(actions.fetchNotes())
  });

export default connect(mapStateToProps, mapDispatchToProps)(Notes);

