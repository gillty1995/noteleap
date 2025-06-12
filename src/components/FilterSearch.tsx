export default function FilterSearch() {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow">
      <input
        type="text"
        placeholder="Filter / search…"
        className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none text-gray-700"
      />
      <small className="text-gray-500">
        add a search bar to filter sessions/notes
      </small>
    </div>
  );
}
