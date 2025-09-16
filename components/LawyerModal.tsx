import Image from 'next/image';
import { Locale } from "@/i18n-config";

interface LawyerModalProps {
  lang: Locale;
  dictionary: any;
}

const LawyerModal: React.FC<LawyerModalProps> = ({ lang, dictionary }) => {
  return (
    <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">{dictionary.lawyerModal.title}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x"></i></button>
          </div>
          <div className="modal-body p-3 p-sm-4">
            {dictionary.lawyerModal.lawyers.map((lawyer: any, index: number) => (
              <div key={index} className={`lawyer-card${index < dictionary.lawyerModal.lawyers.length - 1 ? ' mb-3' : ''}`}>
                <Image src={`/img/lawyer-pic${index + 1}.jpg`} className="lawyer-profile me-3" alt={lawyer.name} width={120} height={120} />
                <div className="lawyer-info">
                  <h4 className="mt-2">{lawyer.name}</h4>
                  <div className="row">
                    <div className="col-lg-6">
                      <ul className="text-sm lawyer-info-list">
                        <li><i className="bi bi-geo-alt"></i> {lawyer.location}</li>
                        <li><i className="bi bi-bullseye"></i> {lawyer.experience}</li>
                        <li><i className="bi bi-star"></i> {lawyer.rating}</li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <h6>{lawyer.specialtiesTitle}</h6>
                      <ul className="text-sm">
                        {lawyer.specialties.map((specialty: any, specialtyIndex: number) => (
                          <li key={specialtyIndex}>{specialty}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-sm btn-outline-primary without-icon">
                    {lawyer.contactButton}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerModal;