function StatsCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <p className="text-gray-500 text-sm uppercase">{title}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}

export default StatsCard;