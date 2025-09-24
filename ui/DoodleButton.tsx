import React from 'react';

export interface DoodleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * A playful button styled to match the blueprint aesthetic.  This component
 * wraps a standard HTML button and applies custom colours and fonts.  It
 * accepts all native button props such as `onClick`, `disabled` and
 * `type`.
 */
const DoodleButton: React.FC<DoodleButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="text-3xl font-bold bg-transparent text-[#0048ab] py-4 px-12 border-4 border-[#0048ab] rounded-lg hover:bg-[#0048ab] hover:text-[#f4f1de] transition-colors duration-200 transform hover:scale-105 focus:outline-none"
      style={{ fontFamily: "'Kalam', cursive" }}
      {...props}
    >
      {children}
    </button>
  );
};

export default DoodleButton;
