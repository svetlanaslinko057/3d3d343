import FAQSection from "@/components/sections/FAQSection";
import ContactButtons from "@/components/shared/ContactButtons";

export default function FAQPage() {
  return (
    <div className="pb-20" data-testid="faq-page">
      <FAQSection />
      <div className="container-page">
        <div className="surface-card p-8 sm:p-10 text-center">
          <h3 className="font-heading font-semibold text-2xl text-[#111111] tracking-tight">Не знайшли відповіді?</h3>
          <p className="mt-3 text-[#666666]">Напишіть нам у месенджер — швидко відповімо.</p>
          <div className="mt-6 flex justify-center">
            <ContactButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
