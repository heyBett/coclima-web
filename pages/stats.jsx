import Head from "next/head";
import Image from "next/image";
import Header from "../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../components/application-ui/data-display/stats/with_brand_icon";
import { useEffect, useState } from "react";

import React from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import useSWR from "swr";
import Loader from "../components/loader";

export default function Home() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("/api/views/dashboard", fetcher, {
    refreshInterval: 120000,
  });

  const datas = [
    { name: "CoClima", value: 400 },
    { name: "NuvemShop", value: 300 },
    { name: "Tray", value: 300 },
  ];

  const renderCustomizedLabel = (item) => {
    const percentage = 10;
    const itemCard = item.name + " (" + percentage + "%)";
    return itemCard;
  };

  if (!data) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>

      <main className="flex flex-col justify-between m-6 sm:mx-10 sm:mt-10">
        <Hello data={data}></Hello>

        <div className="my-10">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                nameKey="name"
                name="name"
                startAngle={180}
                endAngle={0}
                data={datas}
                isAnimationActive={false}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-end">
            <div className="mt-3 space-x-7"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
