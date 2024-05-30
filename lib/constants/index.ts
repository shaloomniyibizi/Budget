export const Currencies = [
  { value: 'USD', label: '$ Dollar', locale: 'en-US' },
  { value: 'EUR', label: '€ Euro', locale: 'de-DE' },
  { value: 'JPY', label: '¥ Yen', locale: 'ja-JP' },
  { value: 'GBP', label: '£ Pound', locale: 'en-GB' },
  { value: 'RWF', label: 'Rwf Franc', locale: 'rw-RW' },
];

export type Currency = (typeof Currencies)[0];

export const MAX_DATE_RANGE_DAYS = 90;
