import React from 'react';

const GlassCard = ({ children, className = '', style = {}, ...rest }) => {
  return (
    <div 
      className={`obsidian-panel ${className}`} 
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};

export default GlassCard;
