import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { initTheme, toggleDarkMode, toggleHighContrast } from '../../frontend/src/lib/utils.ts';

// Sets for capturing DOM class manipulations
const documentClasses = new Set<string>();
const bodyClasses = new Set<string>();

// Mock browser globals for Node.js test environment
class LocalStorageMock {
  store: Record<string, string> = {};
  getItem(key: string) { return this.store[key] || null; }
  setItem(key: string, value: string) { this.store[key] = String(value); }
  removeItem(key: string) { delete this.store[key]; }
  clear() { this.store = {}; }
}

const mockLocalStorage = new LocalStorageMock();

// Attach mocks to global context
global.window = {
  dispatchEvent: () => {}
} as any;

global.Event = class {} as any;

global.document = {
  documentElement: {
    classList: {
      add: (cls: string) => documentClasses.add(cls),
      remove: (cls: string) => documentClasses.delete(cls),
    }
  },
  body: {
    classList: {
      add: (cls: string) => bodyClasses.add(cls),
      remove: (cls: string) => bodyClasses.delete(cls),
    }
  }
} as any;

global.localStorage = mockLocalStorage as any;

describe('WiseCompanion AI - Frontend Utils Unit Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    documentClasses.clear();
    bodyClasses.clear();
  });

  test('initTheme - should set classes correctly based on localStorage dark mode', () => {
    // 1. Test when dark mode is true
    mockLocalStorage.setItem('wisecompanion_dark_mode', 'true');
    initTheme();
    assert.ok(documentClasses.has('dark-mode'));
    assert.ok(bodyClasses.has('dark-mode'));

    // Reset and test when dark mode is false
    documentClasses.clear();
    bodyClasses.clear();
    mockLocalStorage.setItem('wisecompanion_dark_mode', 'false');
    initTheme();
    assert.ok(!documentClasses.has('dark-mode'));
    assert.ok(!bodyClasses.has('dark-mode'));
  });

  test('initTheme - should handle high contrast setting', () => {
    mockLocalStorage.setItem('wisecompanion_high_contrast', 'true');
    initTheme();
    assert.ok(documentClasses.has('high-contrast'));
    assert.ok(bodyClasses.has('high-contrast'));
  });

  test('initTheme - should set correct font-size class', () => {
    mockLocalStorage.setItem('wisecompanion_font_size', 'extra-large');
    initTheme();
    assert.ok(bodyClasses.has('font-extra-large'));
    assert.ok(!bodyClasses.has('font-large'));
  });

  test('toggleDarkMode - should flip dark mode state in localStorage and classes', () => {
    mockLocalStorage.setItem('wisecompanion_dark_mode', 'false');
    const result = toggleDarkMode();
    
    assert.strictEqual(result, true);
    assert.strictEqual(mockLocalStorage.getItem('wisecompanion_dark_mode'), 'true');
    assert.ok(documentClasses.has('dark-mode'));
  });

  test('toggleHighContrast - should flip high contrast state in localStorage and classes', () => {
    mockLocalStorage.setItem('wisecompanion_high_contrast', 'false');
    const result = toggleHighContrast();
    
    assert.strictEqual(result, true);
    assert.strictEqual(mockLocalStorage.getItem('wisecompanion_high_contrast'), 'true');
    assert.ok(documentClasses.has('high-contrast'));
  });
});
