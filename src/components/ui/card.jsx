export function Card({ children, className = "" }) {
  return <div className={`rounded-xl shadow p-4 border ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
