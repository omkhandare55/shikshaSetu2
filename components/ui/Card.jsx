// components/ui/Card.jsx — Card component
export default function Card({ children, className = '', interactive = false, ...props }) {
  return (
    <div
      className={`${interactive ? 'card-interactive' : 'card'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
