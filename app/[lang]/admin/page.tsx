import Image from 'next/image';
import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import RulesManagement from "./rulesmanagement";

interface AdminPageProps {
  params: Promise<{ lang: Locale }>;
}

export default async function AdminPage(props: AdminPageProps) {
  const params = await props.params;
  const dictionary = await getDictionary(params.lang);

  return (
    <main>
      <section className="hero-section">
        <div className="container">
          <h1 className="text-center mt-4" data-aos="fade-up" data-aos-duration="1500">
            {dictionary.admin.page.title}
          </h1>
          <p className="text-lg text-center mb-xl-5 mb-4" data-aos="fade-up" data-aos-duration="1500">
            {dictionary.admin.page.subtitle}
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
            <h3 className="mb-1">{dictionary.admin.page.laborLawRulesManagement}</h3>
            <p className="mb-3">{dictionary.admin.page.createUpdateDeleteRules}</p>

            <RulesManagement lang={params.lang} dictionary={dictionary} />
          </div>
        </div>
      </section>
    </main>
  );
}