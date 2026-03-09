function StatsCard({ title, value, variant = "purple", icon: Icon }) {
  const variants = {
    purple: "bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  };

  const bgVariants = {
    purple: "bg-primary-500",
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${variants[variant]} border`}>
          {Icon && <Icon size={22} />}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Growth</span>
          <span className="text-emerald-500 text-xs font-bold">+12%</span>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black mt-1 text-gray-900 dark:text-white tracking-tight">{value}</h3>
      <div className="mt-4 w-full bg-gray-100 dark:bg-dark-bg h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${bgVariants[variant]} opacity-60`} style={{ width: '70%' }}></div>
      </div>
    </div>
  );
}

export default StatsCard;