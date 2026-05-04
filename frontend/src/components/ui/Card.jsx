export default function Card({ children, className = "", hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`surface p-5 ${hover ? "post-card cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
