import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed

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

          <div className="reports-card" data-aos="fade-up" data-aos-duration="1500">
            <div className="reports-filter">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectDate" aria-label="Floating label select example">
                      <option defaultValue="Last 30 Days">{reportsDict.filter.dateOptions.last30Days}</option>
                      <option value="1">{reportsDict.filter.dateOptions.last7Days}</option>
                      <option value="2">{reportsDict.filter.dateOptions.today}</option>
                    </select>
                    <label htmlFor="floatingSelectDate">{reportsDict.filter.byDate}</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectType" aria-label="Floating label select example">
                      <option defaultValue="All">{reportsDict.filter.typeOptions.all}</option>
                      <option value="1">{reportsDict.filter.typeOptions.payslip}</option>
                      <option value="2">{reportsDict.filter.typeOptions.contract}</option>
                      <option value="3">{reportsDict.filter.typeOptions.legalScenario}</option>
                    </select>
                    <label htmlFor="floatingSelectType">{reportsDict.filter.byType}</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectResult" aria-label="Floating label select example">
                      <option defaultValue="All">{reportsDict.filter.resultOptions.all}</option>
                      <option value="1">{reportsDict.filter.resultOptions.compliant}</option>
                      <option value="2">{reportsDict.filter.resultOptions.nonCompliant}</option>
                    </select>
                    <label htmlFor="floatingSelectResult">{reportsDict.filter.byResult}</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">{reportsDict.table.date}</th>
                    <th scope="col">{reportsDict.table.type}</th>
                    <th scope="col">{reportsDict.table.status}</th>
                    <th scope="col">{reportsDict.table.downloadLink}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mar 25, 2025</td>
                    <td>Payslip</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 me-2"></i> {reportsDict.filter.resultOptions.compliant}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">{reportsDict.table.downloadButton}</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 22, 2025</td>
                    <td>Contract</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-x me-1"></i> {reportsDict.filter.resultOptions.nonCompliant}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">{reportsDict.table.downloadButton}</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 20, 2025</td>
                    <td>Legal Scenario</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 me-2"></i> {reportsDict.filter.resultOptions.compliant}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">{reportsDict.table.downloadButton}</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 15, 2025</td>
                    <td>Payslip</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-x me-1"></i> {reportsDict.filter.resultOptions.nonCompliant}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">{reportsDict.table.downloadButton}</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 10, 2025</td>
                    <td>Contract</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 me-2"></i> {reportsDict.filter.resultOptions.compliant}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">{reportsDict.table.downloadButton}</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 5, 2025</td>
                    <td>Legal Scenario</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-x me-1"></i> {reportsDict.filter.resultOptions.nonCompliant}
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">{reportsDict.table.downloadButton}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

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
