export default function PageContainer({ children, className = "", narrow = false }) {
  return (
    <div className={`mx-auto w-full ${narrow ? "max-w-4xl" : "max-w-7xl"} px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
