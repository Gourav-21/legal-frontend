import { Locale } from "../../../i18n-config";
import { getDictionary } from "../../../get-dictionary";
import Image from 'next/image';
import { LawManagement } from "./lawmanagement";

export interface Law {
  id: string;
  text: string;
}

interface LawPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function LawPage(props: LawPageProps) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500">
            {dictionary.law?.title || "Labor Law Management"}
          </h1>
          <p className="text-lg text-center mb-xl-5 mb-4" data-aos="fade-up" data-aos-duration="1500">
            {dictionary.law?.subtitle || "View, add, edit, and delete labor laws in our system"}
          </p>

          <div className="Upload-document" data-aos="fade-up" data-aos-duration="1500">
            <Image
              className="vector1"
              src="/img/vector1.svg"
              alt="vector"
              width={200}
              height={200}
              data-aos="fade-right"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
            />
            <Image className="coin1 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
            <Image className="coin2 bounce-1" src="/img/coin.svg" alt="coin" width={50} height={50} />
            <h3 className="mb-1">{dictionary.law?.databaseTitle || "Labor Law Database"}</h3>
            <p className="mb-3">{dictionary.law?.databaseSubtitle || "Manage all your labor laws in one place"}</p>

            <LawManagement dictionary={dictionary} />
          </div>
        </div>
      </section>
    </main>
  );
}

