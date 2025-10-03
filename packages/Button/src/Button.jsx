import './Button.scss';

function Button({ children, onClick, variant = 'primary' }) {
  return (
    <button className={`button ${variant}`.trim()} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export default Button;
