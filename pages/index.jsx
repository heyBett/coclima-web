import Head from "next/head";
import Image from "next/image";
import Header from "../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../components/application-ui/data-display/stats/with_brand_icon";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <Hello></Hello>
      </main>
    </div>
  );
}
