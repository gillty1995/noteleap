const dummySessions = ["Session A", "Session B", "Session C"];

export default function SessionsList() {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow space-y-2">
      <h4 className="font-semibold">Sessions</h4>
      {dummySessions.map((s) => (
        <button
          key={s}
          className="block w-full text-gray-700 text-left sharetech px-3 py-2 hover:bg-green-100 rounded"
        >
          {s}
        </button>
      ))}
      <small className="text-gray-500">click to switch sessions</small>
    </div>
  );
}
