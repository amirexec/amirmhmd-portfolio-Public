import ContactForm from "@/components/site/ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="px-6 md:px-14 py-28 bg-void border-t border-line">
      <div className="text-center mb-14">
        <p className="eng text-red text-sm mb-4">06 — START A PROJECT</p>
        <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-bold leading-tight">
          یک ایده داری؟
          <br />
          بیایید تبدیلش کنیم به تصویر.
        </h2>
      </div>
      <ContactForm />
    </section>
  );
}
