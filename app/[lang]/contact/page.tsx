import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "@/get-dictionary"; // Adjust path as needed

// Define props type to include lang
interface HomeProps {
  params: Promise<{ lang: Locale }>;
}

export default async function Home(props: HomeProps) {
  const params = await props.params;

  const {
    lang
  } = params;

  // Make component async
  const dictionary = await getDictionary(lang); // Fetch dictionary
  return (
    <div>
     <main>
        {/* contact us section */}
        <section className="contact-us-section pb-4" data-aos="fade-up" data-aos-duration="1500">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h4 className="mt-4 mt-md-5">{dictionary.contact.title}</h4>
                        <h1>{dictionary.contact.subtitle}</h1>
                        <p className="text-dark">{dictionary.contact.description}</p>
                        <p>{dictionary.contact.supportText}</p>
                        <a href={`mailto:${dictionary.contact.email}`} className="email mt-4">
                            <i className="fa-solid fa-at"></i> {dictionary.contact.email}
                        </a>
                        <Image 
                            src="/img/contact-us.png" 
                            className="contact-us-img mt-4" 
                            alt="Contact Us"
                            width={500}
                            height={400}
                        />
                    </div>
                  
                    <div className="col-md-6">
                        <div className="contact-card mt-4">
                            <h3>{dictionary.contact.form.title}</h3>
                            <p className="mb-4">{dictionary.contact.form.subtitle}</p>

                            <div className="form-floating mb-4">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="floatingName" 
                                    placeholder={dictionary.contact.form.placeholders.name}
                                />
                                <label htmlFor="floatingName">{dictionary.contact.form.name}</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    id="floatingEmail" 
                                    placeholder={dictionary.contact.form.placeholders.email}
                                />
                                <label htmlFor="floatingEmail">{dictionary.contact.form.email}</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    id="floatingPhone" 
                                    placeholder={dictionary.contact.form.placeholders.phone}
                                />
                                <label htmlFor="floatingPhone">{dictionary.contact.form.phone}</label>
                            </div>
                            <div className="form-floating mb-4">
                                <textarea 
                                    className="form-control" 
                                    placeholder={dictionary.contact.form.placeholders.message}
                                    id="floatingTextarea"
                                />
                                <label htmlFor="floatingTextarea">{dictionary.contact.form.message}</label>
                            </div>
                          
                            <button type="submit" className="btn btn-lg btn-primary without-icon w-100">
                                {dictionary.contact.form.submit}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    </div>
  );
}
