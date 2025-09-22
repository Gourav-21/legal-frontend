import { Locale } from "@/i18n-config"; // Adjust path as needed
import { getDictionary } from "@/get-dictionary"; // Adjust path as needed
import ReportHistoryTable from "@/components/ReportHistoryTable"; // Added import

interface ReportsPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function ReportsPage(props: ReportsPageProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const reportsDict = dictionary.reports;

  return (
    <main>
      {/* Reports section */}
      <section className="reports-section">
        <div className="container">
          <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500">{reportsDict.title}</h1>
          <p className="text-lg text-center mb-4" data-aos="fade-up" data-aos-duration="1500">{reportsDict.subtitle}</p>

          <ReportHistoryTable reportsDict={reportsDict} />

          <div className="mt-5 text-center" data-aos="fade-up" data-aos-duration="1500">
            <button type="button" className="btn btn-primary ms-auto me-auto">
              {reportsDict.downloadAll.button}<span><i className="bi bi-arrow-right-short"></i></span>
            </button>
            <p className="mb-0 mt-3 text-muted">{reportsDict.downloadAll.text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
