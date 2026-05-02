export default function Card({ children, className = "" }) {
  return <div className={`surface p-5 ${className}`}>{children}</div>;
}
