const dummyTags = ["react", "recipes", "interview"];

export default function TagSection() {
  return (
    <div className="p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow space-x-2">
      {dummyTags.map((tag) => (
        <button
          key={tag}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
        >
          {tag}
        </button>
      ))}
      <small className="block text-gray-500 mt-2">click to filter by tag</small>
    </div>
  );
}
