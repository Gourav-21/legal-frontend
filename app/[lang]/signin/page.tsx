import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed
import SignInForm from "../../../components/SignInForm"; // Import the new client component

interface SignInPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function SignInPage(props: SignInPageProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const signinDict = dictionary.signin; // Keep dictionary fetching on the server

  return (
    <main>
      {/* SignIn section */}
      <section className="SignUp-section">
        <div className="container">
          <div
            className="SignUp-SignIn-card mt-4"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="left-banner">
              <h1 className="py-4 py-md-5 px-lg-5 px-3 mb-0" dangerouslySetInnerHTML={{ __html: signinDict.leftBannerTitle }}></h1>
              <Image
                className="login-registration-img"
                src="/img/login-registration-img.png"
                alt={signinDict.leftBannerImageAlt}
                width={500}
                height={400}
              />
            </div>
            {/* Use the client component for the form */}
            <SignInForm lang={lang} dictionary={dictionary} />
          </div>
        </div>
      </section>
    </main>
  );
}
