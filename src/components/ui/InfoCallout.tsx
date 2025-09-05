import React from 'react';

interface InfoCalloutProps {
  title: string;
  description: string;
  items?: string[];
  className?: string;
}

const InfoCallout: React.FC<InfoCalloutProps> = ({ title, description, items, className = '' }) => {
  return (
    <div className={`info-callout ${className}`}>
      <div className="info-callout-title">
        {title}
      </div>
      <p className="info-callout-description">
        {description}
      </p>
      {items && items.length > 0 && (
        <ul className="info-callout-list">
          {items.map((item, index) => (
            <li key={index} className="info-callout-list-item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfoCallout;