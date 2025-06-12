import { useState } from "react";

export default function NoteCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="sharetech text-gray-700 text-xl mb-2">{title}</h3>
      {expanded && <p className="text-gray-700">{body}</p>}
    </div>
  );
}
