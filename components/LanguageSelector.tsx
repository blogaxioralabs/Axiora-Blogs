// components/LanguageSelector.tsx
'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'; // Assuming you use shadcn/ui
import { Languages } from 'lucide-react';

// Define the languages you want to support
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'si', name: 'සිංහල' }, // Sinhala
  { code: 'ta', name: 'தமிழ்' },   // Tamil
  { code: 'hi', name: 'हिन्दी' },   // Hindi
  // Add more world standard languages here as needed
  { code: 'es', name: 'Español' }, // Spanish
  { code: 'fr', name: 'Français' }, // French
  { code: 'de', name: 'Deutsch' }, // German
  { code: 'zh', name: '中文' },     // Chinese
  { code: 'ja', name: '日本語' },    // Japanese
  { code: 'ar', name: 'العربية' },   // Arabic
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  disabled?: boolean;
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <Select
      value={selectedLanguage}
      onValueChange={onLanguageChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-auto gap-2 text-xs h-8 px-2 border rounded-full">
        <Languages className="h-3.5 w-3.5" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}