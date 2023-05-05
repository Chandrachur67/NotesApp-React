import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { db, notesCollection } from "./firebase"
import { onSnapshot, addDoc, setDoc, deleteDoc, doc } from "firebase/firestore"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const [tempNoteText, setTempNoteText] = React.useState("");

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote);
        console.log(newNoteRef.id)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId);
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
    }

    async function deleteNote(event, noteId) {
        event.stopPropagation()
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    React.useEffect(() => {
        const unSubscribe = onSnapshot(notesCollection, (snapShot) => {
            // console.log(snapShot.docs)
            let newNotes = [];
            if (snapShot.docs.length > 0) {
                // console.log(snapShot.docs[0].id)
                // const body = snapShot.docs[0].data()
                // console.log(body)
                newNotes = snapShot.docs.map(doc => {
                    return { ...doc.data(), id: doc.id }
                })
                newNotes.sort((note1, note2) => {
                    return note2.updatedAt - note1.updatedAt
                })
            }
            setNotes(newNotes)
        })
        return unSubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    }, [notes])

    React.useEffect(() => {
        if (currentNote) {
            setTempNoteText(currentNote?.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                tempNoteText={tempNoteText}
                                setTempNoteText={setTempNoteText}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
