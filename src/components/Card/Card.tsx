import React from 'react'

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({children, className, ...props }) => {
  return (
    <div
      className={`bg-card-radial p-4 rounded-[10px] text-sm border border-borderPurple border-image-source-card-gradient ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card