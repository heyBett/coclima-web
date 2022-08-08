import Head from "next/head";
import Image from "next/image";
import Header from "../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../components/application-ui/data-display/stats/with_brand_icon";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Tooltip,
  BarChart,
  Legend,
  Bar,
  ReferenceLine,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";

export default function Home() {
  const [tab, setTab] = useState("Plantio");
  const [graph, setGraph] = useState([]);
  const [legenda, setLegenda] = useState("Árvores Plantadas:");
  const [style, setStyle] = useState("Linha");

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("/api/views/dashboard", fetcher, {
    refreshInterval: 120000,
  });

  useEffect(() => {
    if (tab === "Plantio") {
      setGraph(data?.graph.treeGraph);
      setLegenda("Árvores Plantadas:");
    }
    if (tab === "Repasse") {
      setGraph(data?.graph.valueGraph);
      setLegenda("Valor (R$):");
    }
  }, [tab, data]);

  if (!data) {
    return <></>;
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="flex flex-col justify-between m-6 sm:mx-10 sm:mt-10">
        <Hello data={data}></Hello>

        <div className="">
          <div className="flex flex-row justify-between mb-10">
            {tab === "Plantio" ? (
              <div className="flex flex-col sm:flex-row">
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-t-lg sm:rounded-r-none sm:rounded-l-lg">
                  Plantio
                </button>
                <button
                  onClick={() => setTab("Repasse")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-b-lg sm:rounded-l-none sm:rounded-r-lg"
                >
                  Repasse
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row">
                <button
                  onClick={() => setTab("Plantio")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-t-lg sm:rounded-r-none sm:rounded-l-lg"
                >
                  Plantio
                </button>
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-b-lg sm:rounded-l-none sm:rounded-r-lg">
                  Repasse
                </button>
              </div>
            )}
            {style === "Linha" ? (
              <div className="flex flex-col sm:flex-row">
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-t-lg sm:rounded-r-none sm:rounded-l-lg">
                  Linha
                </button>
                <button
                  onClick={() => setStyle("Barra")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-b-lg sm:rounded-l-none sm:rounded-r-lg"
                >
                  Barra
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row">
                <button
                  onClick={() => setStyle("Linha")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-t-lg sm:rounded-r-none sm:rounded-l-lg"
                >
                  Linha
                </button>
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-b-lg sm:rounded-l-none sm:rounded-r-lg">
                  Barra
                </button>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {style === "Linha" ? (
              <AreaChart
                data={graph}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="month" />
                <YAxis dataKey="value" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />

                <Area
                  animationEasing="ease-in-out"
                  type="natural"
                  dot={true}
                  dataKey="value"
                  stroke="#0A8F4A"
                  fill="#0EC164"
                  fillOpacity={1}
                  name={legenda}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={graph}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  animationEasing="ease-in-out"
                  dataKey="value"
                  label="Plantios"
                  fill="#0EC164"
                  name={legenda}
                />
              </BarChart>
            )}
          </ResponsiveContainer>

          <div className="flex justify-end">
            <div className="mt-3 space-x-7"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
