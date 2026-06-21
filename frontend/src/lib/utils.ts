import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initTheme() {
  // 1. Dark Mode
  const isDark = localStorage.getItem('wisecompanion_dark_mode') === 'true';
  if (isDark) {
    document.documentElement.classList.add('dark-mode', 'dark');
    document.body.classList.add('dark-mode', 'dark');
  } else {
    document.documentElement.classList.remove('dark-mode', 'dark');
    document.body.classList.remove('dark-mode', 'dark');
  }

  // 2. High Contrast
  const isHighContrast = localStorage.getItem('wisecompanion_high_contrast') === 'true';
  if (isHighContrast) {
    document.documentElement.classList.add('high-contrast');
    document.body.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
    document.body.classList.remove('high-contrast');
  }

  // 3. Font Size
  const fontSize = localStorage.getItem('wisecompanion_font_size') || 'large';
  document.body.classList.remove('font-normal', 'font-large', 'font-extra-large');
  if (fontSize === 'extra-large' || fontSize === 'xlarge') {
    document.body.classList.add('font-extra-large');
  } else if (fontSize === 'normal') {
    document.body.classList.add('font-normal');
  } else {
    document.body.classList.add('font-large'); // default (19px)
  }
}

export function toggleDarkMode() {
  const isDark = localStorage.getItem('wisecompanion_dark_mode') === 'true';
  const nextDark = !isDark;
  localStorage.setItem('wisecompanion_dark_mode', nextDark ? 'true' : 'false');
  if (nextDark) {
    document.documentElement.classList.add('dark-mode', 'dark');
    document.body.classList.add('dark-mode', 'dark');
  } else {
    document.documentElement.classList.remove('dark-mode', 'dark');
    document.body.classList.remove('dark-mode', 'dark');
  }
  window.dispatchEvent(new Event('theme-change'));
  return nextDark;
}

export function toggleHighContrast() {
  const isHighContrast = localStorage.getItem('wisecompanion_high_contrast') === 'true';
  const nextContrast = !isHighContrast;
  localStorage.setItem('wisecompanion_high_contrast', nextContrast ? 'true' : 'false');
  if (nextContrast) {
    document.documentElement.classList.add('high-contrast');
    document.body.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
    document.body.classList.remove('high-contrast');
  }
  window.dispatchEvent(new Event('theme-change'));
  return nextContrast;
}

