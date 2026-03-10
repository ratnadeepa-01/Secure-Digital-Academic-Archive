function StatsCard({ title, value, variant = "indigo", icon: Icon }) {
  // Each variant defines: icon bg/text (light + dark-aware via Tailwind's built-in palette),
  // and a bar color. We keep Tailwind's named colors for status chips since they are
  // independent from the surface theme.
  const config = {
    blue: {
      wrap: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
      bar:  "bg-blue-500",
      num:  "text-blue-600 dark:text-blue-300",
    },
    orange: {
      wrap: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
      bar:  "bg-amber-500",
      num:  "text-amber-600 dark:text-amber-300",
    },
    green: {
      wrap: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
      bar:  "bg-emerald-500",
      num:  "text-emerald-600 dark:text-emerald-300",
    },
    red: {
      wrap: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-300",
      bar:  "bg-red-500",
      num:  "text-red-600 dark:text-red-300",
    },
    indigo: {
      wrap: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
      bar:  "bg-indigo-500",
      num:  "text-indigo-600 dark:text-indigo-300",
    },
  };

  const c = config[variant] || config.indigo;

  return (
    <div className="bg-theme-card border border-theme rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Icon row + value */}
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${c.wrap}`}>
          {Icon && <Icon size={19} />}
        </div>
        <span className={`text-3xl font-black tracking-tight ${c.num}`}>{value}</span>
      </div>

      {/* Label */}
      <p className="text-sm font-semibold text-theme-2">{title}</p>

      {/* Progress bar */}
      <div className="mt-3 w-full h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
        <div className={`h-full ${c.bar} rounded-full opacity-70`} style={{ width: "60%" }} />
      </div>
    </div>
  );
}

export default StatsCard;