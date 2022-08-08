import Images from "../../components/application-ui/lists/grid-lists/images_with_details3";
import Head from "next/head";

export default function Home(props) {
  return (
    <div>
      <Head>
        <title>Detalhes da Plantação</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <div className="mt-10"></div>
        <Images></Images>
      </main>
    </div>
  );
}
