import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { db, notesCollection } from "./firebase"
import { onSnapshot, addDoc, setDoc, deleteDoc, doc } from "firebase/firestore"

export default function App() {
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState("")

    const currentNote =
        notes.find(note => note.id === currentNoteId)
        || notes[0]

    React.useEffect(() => {
        const unSubscribe = onSnapshot(notesCollection, (snapShot) => {
            console.log(snapShot.docs)
            console.log(snapShot.docs[0].id)
            const body = snapShot.docs[0].data()
            console.log(body)
            const newNotes = snapShot.docs.map(doc => {
                return { ...doc.data(), id: doc.id }
            })
            setNotes(newNotes)
        })
        return unSubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id);
        }
    }, [notes])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        }
        const newNoteRef = addDoc(notesCollection, newNote);
        console.log(newNoteRef)
        setCurrentNoteId(newNoteRef)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId);
        const data = {
            ...currentNote,
            body: text
        }

        await setDoc(docRef, data);
    }

    async function deleteNote(event, noteId) {
        event.stopPropagation()
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

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
                                currentNote={currentNote}
                                updateNote={updateNote}
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
