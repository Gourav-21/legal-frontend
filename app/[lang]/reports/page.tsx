import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed

interface PricingProps {
  params: Promise<{ lang: Locale }>;
}

export default async function PricingPage(props: PricingProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const pricingDict = dictionary.pricing;

  return (
    <main>
      {/* Reports section */}
      <section className="reports-section">
        <div className="container">
          <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500">My Reports</h1>
          <p className="text-lg text-center mb-4" data-aos="fade-up" data-aos-duration="1500">View and download your previous payroll analyses.</p>

          <div className="reports-card" data-aos="fade-up" data-aos-duration="1500">
            <div className="reports-filter">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectDate" aria-label="Floating label select example">
                      <option defaultValue="Last 30 Days">Last 30 Days</option>
                      <option value="1">Last 7 Days</option>
                      <option value="2">Today</option>
                    </select>
                    <label htmlFor="floatingSelectDate">By Date</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectType" aria-label="Floating label select example">
                      <option defaultValue="All">All</option>
                      <option value="1">Payslip</option>
                      <option value="2">Contract</option>
                      <option value="3">Legal Scenario</option>
                    </select>
                    <label htmlFor="floatingSelectType">By Type</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating mb-4">
                    <select className="form-select" id="floatingSelectResult" aria-label="Floating label select example">
                      <option defaultValue="All">All</option>
                      <option value="1">Compliant</option>
                      <option value="2">Non-compliant</option>
                    </select>
                    <label htmlFor="floatingSelectResult">By Legal Result</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Download Link</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mar 25, 2025</td>
                    <td>Payslip</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 me-2"></i> Compliant
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">Download PDF</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 22, 2025</td>
                    <td>Contract</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-x me-1"></i> Non-compliant
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">Download PDF</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 20, 2025</td>
                    <td>Legal Scenario</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 me-2"></i> Compliant
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">Download PDF</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 15, 2025</td>
                    <td>Payslip</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-x me-1"></i> Non-compliant
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">Download PDF</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 10, 2025</td>
                    <td>Contract</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-check2 me-2"></i> Compliant
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">Download PDF</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mar 5, 2025</td>
                    <td>Legal Scenario</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-x me-1"></i> Non-compliant
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-dark without-icon ms-auto">Download PDF</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-5 text-center" data-aos="fade-up" data-aos-duration="1500">
            <button type="button" className="btn btn-primary ms-auto me-auto">
              Download All Reports<span><i className="bi bi-arrow-right-short"></i></span>
            </button>
            <p className="mb-0 mt-3 text-muted">Get a ZIP file with all your previous payroll reports.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
