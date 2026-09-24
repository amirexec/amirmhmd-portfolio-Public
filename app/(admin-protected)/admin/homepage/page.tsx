import HomepageContentManager from "@/components/admin/HomepageContentManager";

// Client-fetches its own data from /api/admin/homepage so the same request
// that pre-fills the form also resolves the referenced media rows.
export default function HomepageContentPage() {
  return (
    <div dir="rtl" className="font-vazir px-8 py-10">
      <h1 className="eng text-2xl mb-1">HOMEPAGE CONTENT</h1>
      <p className="text-stone text-sm mb-8">متن و تصاویر صفحه اصلی، درباره من و Showreel</p>
      <HomepageContentManager />
    </div>
  );
}
