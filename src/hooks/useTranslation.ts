
import { useTranslation as useI18nTranslation } from 'react-i18next';

export function useTranslation() {
  return useI18nTranslation();
}

// Hook personalizado para facilitar el uso
export function useT() {
  const { t } = useI18nTranslation();
  return t;
}
