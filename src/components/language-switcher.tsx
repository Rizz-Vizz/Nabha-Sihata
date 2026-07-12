import React from 'react';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from './language-context';

interface LanguageSwitcherProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function LanguageSwitcher({ 
  variant = 'outline', 
  size = 'sm', 
  className = '' 
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageSwitch = () => {
    const languages = ['en', 'hi', 'pa'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLanguageSwitch}
      className={`flex items-center space-x-2 ${className}`}
      aria-label="Switch Language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm uppercase font-medium">{language}</span>
    </Button>
  );
}