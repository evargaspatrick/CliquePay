import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary',
  ...props 
}) => {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };

  const baseStyle = "px-4 py-2 rounded-lg transition-all duration-200 font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
  
  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;