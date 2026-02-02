/**
 * i18n Translation Tests - Verify all payment-related translation keys exist
 * 
 * Tests cover:
 * - All locale files have required keys
 * - Translation key consistency across languages
 * - Payment status translations (success, failed, expired, underpaid, overpaid)
 */

import * as fs from 'fs';
import * as path from 'path';

const LOCALES_DIR = path.join(__dirname, '../../public/locales');
const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'nl', 'pt'];

// Required payment-related translation keys
const REQUIRED_PAYMENT_KEYS = {
  'checkout': [
    'paymentLinkExpired',
    'securePayment',
    'toPay',
    'copied',
  ],
  'crypto': [
    'paymentDetected',
    'paymentConfirmed',
    'paymentExpired',
    'paymentFailed',
    'paymentLinkExpired',
    'paymentError',
  ],
  'underpayment': [
    'title',
    'subtitle',
    'paymentProgress',
    'complete',
    'graceWarning',
    'paid',
    'payRemainingCrypto',
  ],
  'overpayment': [
    'title',
    'subtitle',
    'totalDue',
    'excess',
    'refundNotice',
  ],
  'expired': [
    'title',
    'message',
    'merchant',
    'goBack',
  ],
  'failed': [
    'title',
    'message',
    'merchant',
    'tryAgain',
    'goBack',
  ],
  'success': [
    'paymentSuccessful',
    'transactionId',
    'done',
    'thankYou',
  ],
};

describe('i18n Translation Files', () => {
  const loadLocale = (lang: string): Record<string, any> => {
    const filePath = path.join(LOCALES_DIR, lang, 'common.json');
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  };

  describe('All locale files exist and are valid JSON', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang}/common.json exists and is valid JSON`, () => {
        const filePath = path.join(LOCALES_DIR, lang, 'common.json');
        expect(fs.existsSync(filePath)).toBe(true);
        
        expect(() => {
          const content = fs.readFileSync(filePath, 'utf-8');
          JSON.parse(content);
        }).not.toThrow();
      });
    });
  });

  describe('Required payment keys exist in all languages', () => {
    Object.entries(REQUIRED_PAYMENT_KEYS).forEach(([section, keys]) => {
      describe(`Section: ${section}`, () => {
        SUPPORTED_LANGUAGES.forEach((lang) => {
          keys.forEach((key) => {
            it(`${lang} has ${section}.${key}`, () => {
              const locale = loadLocale(lang);
              expect(locale[section]).toBeDefined();
              expect(locale[section][key]).toBeDefined();
              expect(typeof locale[section][key]).toBe('string');
              expect(locale[section][key].length).toBeGreaterThan(0);
            });
          });
        });
      });
    });
  });

  describe('Failed payment translations', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has complete 'failed' section`, () => {
        const locale = loadLocale(lang);
        
        expect(locale.failed).toBeDefined();
        expect(locale.failed.title).toBeDefined();
        expect(locale.failed.message).toBeDefined();
        expect(locale.failed.tryAgain).toBeDefined();
        expect(locale.failed.goBack).toBeDefined();
      });
    });
  });

  describe('Expired payment translations', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has complete 'expired' section`, () => {
        const locale = loadLocale(lang);
        
        expect(locale.expired).toBeDefined();
        expect(locale.expired.title).toBeDefined();
        expect(locale.expired.message).toBeDefined();
        expect(locale.expired.goBack).toBeDefined();
      });
    });
  });

  describe('Underpayment translations', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has complete 'underpayment' section`, () => {
        const locale = loadLocale(lang);
        
        expect(locale.underpayment).toBeDefined();
        expect(locale.underpayment.title).toBeDefined();
        expect(locale.underpayment.subtitle).toBeDefined();
        expect(locale.underpayment.payRemainingCrypto).toBeDefined();
      });
    });
  });

  describe('Overpayment translations', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has complete 'overpayment' section`, () => {
        const locale = loadLocale(lang);
        
        expect(locale.overpayment).toBeDefined();
        expect(locale.overpayment.title).toBeDefined();
        expect(locale.overpayment.subtitle).toBeDefined();
        expect(locale.overpayment.refundNotice).toBeDefined();
      });
    });
  });

  describe('Success translations', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has complete 'success' section`, () => {
        const locale = loadLocale(lang);
        
        expect(locale.success).toBeDefined();
        expect(locale.success.paymentSuccessful).toBeDefined();
        expect(locale.success.transactionId).toBeDefined();
      });
    });
  });

  describe('Crypto error translations', () => {
    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has crypto error messages`, () => {
        const locale = loadLocale(lang);
        
        expect(locale.crypto.paymentExpired).toBeDefined();
        expect(locale.crypto.paymentFailed).toBeDefined();
        expect(locale.crypto.paymentLinkExpired).toBeDefined();
        expect(locale.crypto.paymentError).toBeDefined();
      });
    });
  });

  describe('Translation consistency', () => {
    it('All languages have the same top-level keys as English', () => {
      const enLocale = loadLocale('en');
      const enKeys = Object.keys(enLocale).sort();
      
      SUPPORTED_LANGUAGES.filter(l => l !== 'en').forEach((lang) => {
        const locale = loadLocale(lang);
        const langKeys = Object.keys(locale).sort();
        
        // Check that all English keys exist in other language
        enKeys.forEach((key) => {
          expect(langKeys).toContain(key);
        });
      });
    });

    it('Failed section has same keys across all languages', () => {
      const enLocale = loadLocale('en');
      const enFailedKeys = Object.keys(enLocale.failed).sort();
      
      SUPPORTED_LANGUAGES.filter(l => l !== 'en').forEach((lang) => {
        const locale = loadLocale(lang);
        const failedKeys = Object.keys(locale.failed).sort();
        
        expect(failedKeys).toEqual(enFailedKeys);
      });
    });

    it('Expired section has same keys across all languages', () => {
      const enLocale = loadLocale('en');
      const enExpiredKeys = Object.keys(enLocale.expired).sort();
      
      SUPPORTED_LANGUAGES.filter(l => l !== 'en').forEach((lang) => {
        const locale = loadLocale(lang);
        const expiredKeys = Object.keys(locale.expired).sort();
        
        expect(expiredKeys).toEqual(enExpiredKeys);
      });
    });
  });

  describe('No empty translations', () => {
    const checkNoEmptyValues = (obj: any, path: string = ''): string[] => {
      const emptyKeys: string[] = [];
      
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          emptyKeys.push(...checkNoEmptyValues(value, currentPath));
        } else if (typeof value === 'string' && value.trim() === '') {
          emptyKeys.push(currentPath);
        }
      });
      
      return emptyKeys;
    };

    SUPPORTED_LANGUAGES.forEach((lang) => {
      it(`${lang} has no empty translation strings`, () => {
        const locale = loadLocale(lang);
        const emptyKeys = checkNoEmptyValues(locale);
        
        expect(emptyKeys).toEqual([]);
      });
    });
  });
});
