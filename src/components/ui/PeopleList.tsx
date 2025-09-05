import React from 'react';
import { BeneficialOwner } from '../../data/mockData';

interface PeopleListProps {
  title: string;
  people: BeneficialOwner[];
  showCount?: boolean;
  showRoles?: boolean;
  className?: string;
}

const PeopleList: React.FC<PeopleListProps> = ({ 
  title, 
  people, 
  showCount = true, 
  showRoles = true, 
  className = '' 
}) => {
  const displayTitle = showCount ? `${title} (${people.length})` : title;
  
  // Use the same styling for both variants
  return (
    <div className={`verification-owners-section ${className}`}>
      <div className="verification-owners-header">
        <h3 className="section-title">{displayTitle}</h3>
      </div>
      <div className="verification-owners-list">
        {people.map((person) => (
          <div key={person.id} className="verification-owner-item">
            {person.name}
            {showRoles && person.role && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                {person.role}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleList;