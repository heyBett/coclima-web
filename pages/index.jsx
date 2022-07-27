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

export default function Home() {
  const [tab, setTab] = useState("Plantio");
  const [data, setData] = useState([]);
  const [style, setStyle] = useState("Linha");

  useEffect(() => {
    if (tab === "Plantio") {
      setData([
        {
          name: "Jan/22",
          plantations: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: "Fev/22",
          plantations: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: "Mar/22",
          plantations: 2000,
          pv: 9800,
          amt: 2290,
        },
      ]);
    }
    if (tab === "Repasse") {
      setData([
        {
          name: "Jan/22",
          plantations: 3000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: "Fev/22",
          plantations: 6000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: "Mar/22",
          plantations: 1000,
          pv: 9800,
          amt: 2290,
        },
      ]);
    }
  }, [tab]);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="flex flex-col justify-between m-6 sm:mx-10 sm:mt-10">
        <Hello></Hello>

        <div className="">
          <div className="flex justify-between mb-10">
            {tab === "Plantio" ? (
              <div>
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-l-lg">
                  Plantio
                </button>
                <button
                  onClick={() => setTab("Repasse")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-r-lg"
                >
                  Repasse
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setTab("Plantio")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-l-lg"
                >
                  Plantio
                </button>
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-r-lg">
                  Repasse
                </button>
              </div>
            )}
            {style === "Linha" ? (
              <div>
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-l-lg">
                  Linha
                </button>
                <button
                  onClick={() => setStyle("Barra")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-r-lg"
                >
                  Barra
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setStyle("Linha")}
                  className="px-5 py-2 font-medium text-green-500 uppercase bg-gray-200 rounded-l-lg"
                >
                  Linha
                </button>
                <button className="px-5 py-2 font-medium text-white uppercase bg-green-500 rounded-r-lg">
                  Barra
                </button>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            {style === "Linha" ? (
              <AreaChart
                data={data}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>

                <Area
                  animationEasing="ease-in-out"
                  type="natural"
                  dot={true}
                  dataKey="plantations"
                  stroke="#0A8F4A"
                  fill="#0EC164"
                  fillOpacity={1}
                />
              </AreaChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  animationEasing="ease-in-out"
                  dataKey="plantations"
                  label="Plantios"
                  fill="#0EC164"
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
