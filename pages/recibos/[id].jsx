import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { setMonth } from "date-fns";
import { useState, useEffect } from "react";
import Table from "../../components/application-ui/lists/tables/with_avatars_and_multi_line_content6";
import Link from "next/link";
import Loader from "../../components/loader";

export default function Home(props) {
  const router = useRouter();
  const id = router.query.id;

  const [selectedMonth, setSelectedMonth] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [loaded, setLoaded] = useState(false);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(`/api/admin/receipts/${id}`, fetcher, {
    refreshInterval: 60000,
  });

  useEffect(() => {
    if (data?.receipts !== undefined && !loaded) {
      const lenght = data?.receipts.length;
      setSelectedMonth(data.receipts[lenght - 1].dateStr);
      setSelectedIndex(lenght - 1);
      setLoaded(true);
    }
  }, [data]);

  const receipts = data?.receipts;

  function uniqBy(a, key) {
    var seen = {};
    return a?.filter(function (item) {
      var k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  function fromThisMonth(item) {
    return item.dateStr === selectedMonth;
  }

  const months = uniqBy(
    data?.receipts?.map((item) => item.dateStr),
    JSON.stringify
  );

  if (!data) {
    return <Loader />;
  }

  return (
    <div>
      <Head>
        <title>Detalhes da Plantação</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">{data?.client}</h1>
        <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
          Administre recibos e pagamentos
        </h2>
        <div className="flex justify-center w-full m-auto my-5 ">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="w-full overflow-x-scroll">
              <Tab.List className="flex justify-center">
                {months?.map((month) => (
                  <Tab
                    key={month}
                    as={Fragment}
                    onClick={() => setSelectedMonth(month)}
                  >
                    {({ selected }) => (
                      <button
                        className={
                          (selected
                            ? "bg-green-500  text-white"
                            : "bg-white text-green-500   ") +
                          "  px-4 py-2 first:rounded-l-md last:rounded-r-md"
                        }
                      >
                        {month}
                      </button>
                    )}
                  </Tab>
                ))}
                {/* ...  */}
              </Tab.List>
            </div>
          </Tab.Group>
        </div>
        <Table receipts={data?.receipts.filter(fromThisMonth)}></Table>
      </main>
    </div>
  );
}
