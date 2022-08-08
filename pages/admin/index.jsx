import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import Header from "../../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../../components/application-ui/data-display/stats/with_brand_icon";
import Users from "../../components/application-ui/lists/tables/with_avatars_and_multi_line_content";
import Companies from "../../components/application-ui/lists/tables/with_avatars_and_multi_line_content2";
import Partners from "../../components/application-ui/lists/tables/with_avatars_and_multi_line_content3";
import Plantations from "../../components/application-ui/lists/tables/with_avatars_and_multi_line_content4";
import Options from "../../components/application-ui/navigation/tabs/bar_with_underline";
import useSWR from "swr";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [current, setCurrent] = useState("users");
  const [tabs, setTabs] = useState([
    { name: "Usuários", scope: "users", current: true },
    { name: "Empresas", scope: "companies", current: false },
    { name: "Parceiros", scope: "partners", current: false },
    { name: "Plantios", scope: "plantations", current: false },
  ]);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(`/api/admin`, fetcher);

  const users = data?.users;
  const companies = data?.companies;
  const partners = data?.partners;
  const plantations = data?.plantations;

  if (!data) {
    return <></>;
  }

  function CurrentNav(scope) {
    setCurrent(scope);
    tabs.forEach((item) => {
      item.current = item.scope === scope;
    });
    setTabs(tabs);
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">
          Área do Administrador
        </h1>
        <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
          Adicione, edite e delete dados.
        </h2>

        <div className="mt-10"></div>
        <div>
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Select a tab
            </label>
            {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
            <select
              id="tabs"
              name="tabs"
              className="block w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          <div className="hidden sm:block">
            <nav
              className="relative z-0 flex divide-x divide-gray-200 rounded-lg shadow"
              aria-label="Tabs"
            >
              {tabs.map((tab, tabIdx) => (
                <a
                  onClick={() => CurrentNav(tab.scope)}
                  key={tab.name}
                  href={tab.href}
                  className={classNames(
                    tab.current
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-white hover:bg-green-500",
                    tabIdx === 0 ? "rounded-l-lg" : "",
                    tabIdx === tabs.length - 1 ? "rounded-r-lg" : "",
                    "group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center focus:z-10 cursor-pointer"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  <span>{tab.name}</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      tab.current ? "bg-green-500" : "bg-transparent",
                      "absolute inset-x-0 bottom-0 h-0.5"
                    )}
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
        {current === "users" && <Users users={users}></Users>}
        {current === "companies" && (
          <Companies companies={companies}></Companies>
        )}

        {current === "partners" && <Partners partners={partners}></Partners>}
        {current === "plantations" && (
          <Plantations plantations={plantations}></Plantations>
        )}
      </main>
    </div>
  );
}
