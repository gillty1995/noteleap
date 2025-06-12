import NoteCard from "./NoteCard";

const dummyNotes = [
  { id: 1, title: "Note 1", body: "This is my first note." },
  { id: 2, title: "Note 2", body: "Details in this note." },
  { id: 3, title: "Note 3", body: "More text here." },
];

export default function NotesList() {
  return (
    <div className="flex-1 overflow-y-auto space-y-4">
      {dummyNotes.map((n) => (
        <NoteCard key={n.id} title={n.title} body={n.body} />
      ))}
    </div>
  );
}
