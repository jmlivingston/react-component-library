import './Button.scss';

const Button = ({ children, onClick, variant = 'primary' }) => (
  <button className={`button ${variant}`.trim()} onClick={onClick} type="button">
    {children}
  </button>
);

export default Button;
