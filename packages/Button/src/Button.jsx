import './Button.css';

function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`button ${variant}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
