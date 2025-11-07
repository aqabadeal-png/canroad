import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, ...args: any[]) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
    const savedLang = localStorage.getItem('canroad-lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
        return savedLang as Language;
    }
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(getInitialLanguage);

    useEffect(() => {
        localStorage.setItem('canroad-lang', language);
        const langAttr = language === 'fr' ? 'fr-CA' : 'en-CA';
        document.documentElement.setAttribute('lang', langAttr);
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = useCallback((key: TranslationKey, ...args: any[]): string => {
        let translation = translations[language]?.[key] || translations['en'][key];

        if (translation === undefined) {
            if (args.length > 0 && typeof args[0] === 'string') return args[0];
            console.warn(`Translation not found for key: "${key}"`);
            return String(key);
        }

        if (args.length > 0) {
            const replacements = args[0];
            if (typeof replacements === 'object' && replacements !== null && !Array.isArray(replacements)) {
                // Named replacements: t('key', {name: 'John'})
                for (const placeholder in replacements) {
                    const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
                    translation = translation.replace(regex, replacements[placeholder]);
                }
            } else {
                // Indexed replacements: t('key', 'val1', 'val2')
                args.forEach((arg, index) => {
                    const regex = new RegExp(`\\{${index}\\}`, 'g');
                    translation = translation.replace(regex, String(arg));
                });
            }
        }
        
        return translation;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};