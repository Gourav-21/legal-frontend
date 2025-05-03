import Image from "next/image";
import { Locale } from "../../../i18n-config"; // Adjust path as needed
import { getDictionary } from "../../../get-dictionary"; // Adjust path as needed
import SignUpForm from '../../../components/SignUpForm'; // Import the new component

interface SignUpPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function SignUpPage(props: SignUpPageProps) {
  const params = await props.params;
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  const signupDict = dictionary.signup;

  return (
    <main>
      {/* SignUp section */}
      <section className="SignUp-section">
        <div className="container">
          <div
            className="SignUp-SignIn-card mt-4"
            data-aos="fade-up"
            data-aos-duration="1500"
          >
            <div className="left-banner">
              <h1 className="py-4 py-md-5 px-lg-5 px-3 mb-0" dangerouslySetInnerHTML={{ __html: signupDict.leftBannerTitle }}></h1>
              <Image
                className="login-registration-img"
                src="/img/login-registration-img.png"
                alt="Signup Banner"
                width={500} // Add appropriate width
                height={400} // Add appropriate height
              />
            </div>
            <div className="right-form">
              {/* Render the client component here */}
              <SignUpForm signupDict={signupDict} lang={lang} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}