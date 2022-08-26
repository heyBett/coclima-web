import Head from "next/head";
import Image from "next/image";
import Header from "../../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../../components/application-ui/data-display/stats/with_brand_icon";
import useSWR from "swr";
import Companies from "../../components/application-ui/lists/tables/with_avatars_and_multi_line_content5";

export default function Home() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR("/api/admin/receipts", fetcher, {
    refreshInterval: 60000,
  });

  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <div className="mt-10">
          <Companies companies={data}></Companies>
        </div>
      </main>
    </div>
  );
}
