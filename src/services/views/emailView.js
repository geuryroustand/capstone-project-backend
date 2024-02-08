import contactUsLocaleContent from "../locales/contactUsLocaleContent.js";

const generateEmailContent = (locale, data) => {
  const content = contactUsLocaleContent[locale];
  return {
    subject: content.subject,
    html: `
      <p>${content.greeting} ${data.name},</p>
      <p>${content.first_paragraph}</p>
      <p>${content.second_paragraph}</p>
      <p>${content.third_paragraph}</p>
      <p>${content.closing}</p>
      <p>${content.signature}</p>
      <p>${content.company}</p>
      <p><a href="tel:+17036592119">${content.phone}</a></p>
      <p><a href="https://wa.me/+17036592119">WhatsApp</a></p>
      <p><a href="mailto:info@vacationstaxis.com">${content.email}</a></p>
      <p><a href="https://www.vacationstaxis.com">${content.website}</a></p>
    `,
  };
};

export default {
  generateEmailContent,
};
