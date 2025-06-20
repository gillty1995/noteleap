interface FilterSearchProps {
  onFilterSearch?: (value: string) => void;
}

export default function FilterSearch({onFilterSearch}: FilterSearchProps) {
  const changeInput = (evt: React.ChangeEvent<HTMLInputElement>) =>{
    const searchValue = evt.target.value;
    onFilterSearch?.(searchValue);
  }
  return (
    <div className="p-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow">
      <input
        type="text"
        placeholder="Filter / search…"
        className="w-full px-3 py-2 border rounded-lg focus:ring focus:outline-none text-gray-700"
        onChange={changeInput}
      />
      <small className="text-gray-500">
        Search bar to filter sessions and notes
      </small>
    </div>
  );
}

