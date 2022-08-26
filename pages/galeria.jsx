import Head from "next/head";
import Image from "next/image";
import Header from "../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../components/application-ui/data-display/stats/with_brand_icon";
import Images from "../components/application-ui/lists/grid-lists/images_with_details2";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">Galeria</h1>
        <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
          Mostre que sua empresa está preocupada em construir um mundo melhor!
        </h2>
        <div className="mt-10"></div>
        <Images></Images>
      </main>
    </div>
  );
}
