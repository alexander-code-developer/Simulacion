export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white shadow-xs ${className}`}>
      {children}
    </div>
  );
}