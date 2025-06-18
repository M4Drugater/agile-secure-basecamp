
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal';
  showText?: boolean;
}

const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  it: '🇮🇹',
};

export function LanguageSelector({ variant = 'default', showText = true }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  if (variant === 'minimal') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <span className="text-lg">{languageFlags[language]}</span>
            {showText && <span className="text-sm">{t(`languages.${language}`)}</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
            <span className="mr-2">🇺🇸</span>
            {t('languages.en')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
            <span className="mr-2">🇪🇸</span>
            {t('languages.es')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleLanguageChange('it')}>
            <span className="mr-2">🇮🇹</span>
            {t('languages.it')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-lg">{languageFlags[language]}</span>
          {showText && <span>{t(`languages.${language}`)}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          <span className="mr-2">🇺🇸</span>
          {t('languages.en')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('es')}>
          <span className="mr-2">🇪🇸</span>
          {t('languages.es')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('it')}>
          <span className="mr-2">🇮🇹</span>
          {t('languages.it')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
