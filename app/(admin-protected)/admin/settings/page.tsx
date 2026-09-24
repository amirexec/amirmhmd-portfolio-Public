import SettingsManager from "@/components/admin/SettingsManager";

export default function SettingsPage() {
  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">SITE SETTINGS</h1>
      <p className="text-stone text-sm mb-8">نام سایت، لوگو، SEO و اطلاعات تماس</p>
      <SettingsManager />
    </div>
  );
}
