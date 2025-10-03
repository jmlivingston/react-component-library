import './Card.scss';

function Card({ title, children, footer }) {
  return (
    <div className="card">
      <div className="header">{title}</div>
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

export default Card;
