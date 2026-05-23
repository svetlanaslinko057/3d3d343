// CTA helpers: build Telegram/WhatsApp deep links with prefilled Ukrainian message.
// Rewritten for air suspension focus.

export function buildInquiryMessage(productTitle) {
  if (productTitle) {
    return `Добрий день. Мене цікавить товар: ${productTitle}. Підкажіть, будь ласка, ціну, наявність та сумісність з моїм авто.`;
  }
  return `Добрий день. Хочу отримати підбір пневмопідвіски / пневмоподушок під моє авто.`;
}

function sanitizeTg(username) {
  if (!username) return "RPUA_Support";
  return String(username).replace(/^@/, "").trim();
}

function sanitizePhoneForWa(phone) {
  if (!phone) return "380737662545";
  return String(phone).replace(/\D/g, "");
}

function sanitizePhoneForCall(phone) {
  if (!phone) return "";
  return String(phone).replace(/[^\d+]/g, "");
}

export function telegramUrl(settings, productTitle) {
  const user = sanitizeTg(settings?.telegram_username);
  const text = encodeURIComponent(buildInquiryMessage(productTitle));
  return `https://t.me/${user}?text=${text}`;
}

export function whatsappUrl(settings, productTitle) {
  const phone = sanitizePhoneForWa(settings?.whatsapp_number);
  const text = encodeURIComponent(buildInquiryMessage(productTitle));
  return `https://wa.me/${phone}?text=${text}`;
}

export function telUrl(settings) {
  const p = sanitizePhoneForCall(settings?.phone);
  return p ? `tel:${p}` : "#";
}

export function mailtoUrl(settings, subject) {
  const email = settings?.email || "";
  if (!email) return "#";
  const s = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${email}${s}`;
}
