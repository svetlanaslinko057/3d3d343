import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import SectionHeading from "@/components/shared/SectionHeading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection({ heading = true }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/faq").then((res) => setItems(res.data)).catch(() => {});
  }, []);

  return (
    <section className="section-y bg-[#F7F7F5]" data-testid="faq-section">
      <div className="container-page">
        {heading ? (
          <SectionHeading
            eyebrow="FAQ"
            title="Часті запитання до виробника"
            subtitle="Виробництво, опт, OEM, гарантія, відвантаження. Не знайшли відповіді — напишіть нам."
          />
        ) : null}
        <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="flex flex-col gap-2.5 sm:gap-3" data-testid="faq-accordion">
            {items.map((q) => (
              <AccordionItem
                key={q.id}
                value={q.id}
                className="surface-card px-4 sm:px-6 border"
                data-testid={`faq-item-${q.order}`}
              >
                <AccordionTrigger className="py-4 sm:py-6 text-left font-heading font-medium text-[#111111] hover:no-underline text-[15px] sm:text-[16px] leading-snug tracking-tight min-h-[48px]">
                  <span className="pr-2 min-w-0">{q.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-[#666666] pb-4 sm:pb-6 leading-relaxed text-[14px] sm:text-[15px]">
                  {q.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
