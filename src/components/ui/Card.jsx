export default function Card({ padded = false, className = '', children, ...rest }) {
  const classes = `card ${padded ? 'card--padded' : ''} ${className}`.trim();
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}