import './Card.scss';

const Card = ({ title, children, footer }) => (
  <div className="card">
    <div className="header">{title}</div>
    <div className="body">{children}</div>
    {footer && <div className="footer">{footer}</div>}
  </div>
);

export default Card;
