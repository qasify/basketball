import React from "react";
import {
  AccordionContainer,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordion";
import { Mail, HelpCircle, LifeBuoy } from "lucide-react";
import { supportFaqs } from "@/utils/constants/supportFaq";

const SupportPage = () => {
  return (
    <div className="h-full w-full min-w-0 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div className="w-full space-y-8">
        <header className="rounded-2xl border border-borderPurple/70 bg-card-radial p-6 shadow-lg sm:p-8">
          <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-purpleFill/35 bg-purpleFill/10 shadow-[0_0_0_1px_rgba(176,55,255,0.1)_inset]">
            <LifeBuoy className="h-5 w-5 text-purpleFill" aria-hidden />
          </div>
          <h1 className="text-white text-2xl font-bold uppercase tracking-wide sm:text-3xl">
            Support
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-textGrey sm:text-base">
            Need help with HoopRoster? Reach out to us directly or check the
            common questions below.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[10px] lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-purpleFill/30 bg-purpleFill/10">
                <Mail className="h-4 w-4 text-purpleFill" aria-hidden />
              </div>
              <h2 className="text-lg font-semibold text-white">Contact Email</h2>
            </div>
            <p className="mt-3 text-sm text-textGrey">
              For support, bug reports, and account help, email us at:
            </p>
            <a
              href="mailto:hooproster@gmail.com"
              className="mt-3 inline-flex items-center rounded-lg border border-purpleFill/35 bg-purpleFill/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purpleFill/20"
            >
              hooproster@gmail.com
            </a>
          </section>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[10px]">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Support Window
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              Mon - Fri
            </p>
            <p className="mt-1 text-sm text-textGrey">
              We usually reply within 24 hours.
            </p>
          </aside>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-[10px] sm:p-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-purpleFill/30 bg-purpleFill/10">
              <HelpCircle className="h-4 w-4 text-purpleFill" aria-hidden />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <AccordionContainer
            type="single"
            collapsible
            className="mt-4 w-full divide-y divide-white/10"
          >
            {supportFaqs.map((item, idx) => (
              <AccordionItem
                key={item.question}
                value={`faq-${idx}`}
                className="border-white/10 px-1"
              >
                <AccordionTrigger className="text-left text-sm text-white hover:text-purpleFill hover:no-underline sm:text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-textGrey/95">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </AccordionContainer>
        </section>
      </div>
    </div>
  );
};

export default SupportPage;