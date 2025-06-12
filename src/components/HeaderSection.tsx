export default function HeaderSection() {
  return (
    <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-lg rounded-2xl shadow">
      <h2 className="text-2xl sharetech text-gray-700">Session Title</h2>
      <div className="space-x-2 text-gray-700">
        {["1", "2", "3", "4"].map((key) => (
          <button
            key={key}
            className="px-3 py-1 bg-green-200/40 backdrop-blur-sm rounded-md hover:bg-green-200/60 transition"
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}
