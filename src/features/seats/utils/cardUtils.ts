export const CARD_PATTERNS = {
  visa: /^4/,
  mastercard: /^(5[1-5]|2[2-7])/,
  amex: /^3[47]/,
  elo: /^(4011|431274|438935|451416|457393|4576|457631|457632|504175|627780|636297|636368|636369|(6503[1-3])|(6500(3[5-9]|4[0-9]|5[0-1]))|(6504(0[5-9]|1[0-9]|2[0-9]|3[0-9]))|(650(48[5-9]|49[0-9]|50[0-9]|51[0-9]|52[0-9]|53[0-7]))|(6505(4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-8]))|(6507(0[0-9]|1[0-8]))|(6507(2[0-7]))|(650(90[1-9]|91[0-9]|920))|(6516(5[2-9]|6[0-9]|7[0-9]))|(6550(0[0-9]|1[0-9]))|(6550(2[1-9]|3[0-9]|4[0-9]|5[0-8])))/,
  hipercard: /^(606282\d{10}(\d{3})?)|(3841\d{15})/,
  diners: /^3(?:0[0-5]|[68][0-9])[0-9]/,
} as const;

export type CardBrand = keyof typeof CARD_PATTERNS;

export function getCardBrand(cardNumber: string): CardBrand | null {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  for (const [brand, pattern] of Object.entries(CARD_PATTERNS)) {
    if (pattern.test(cleanNumber)) {
      return brand as CardBrand;
    }
  }
  
  return null;
}

export function formatCardNumber(value: string): string {
  const cleanNumber = value.replace(/\D/g, '');
  const brand = getCardBrand(cleanNumber);
  
  if (brand === 'amex') {
    return cleanNumber
      .replace(/(\d{4})/, '$1 ')
      .replace(/(\d{4}) (\d{6})/, '$1 $2 ')
      .substring(0, 17);
  }
  
  return cleanNumber
    .replace(/(\d{4})/g, '$1 ')
    .trim()
    .substring(0, 19);
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Luhn Algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
} 