import { useEffect, useState } from "react";
const axios = require("axios").default;
import Sidebar from "../components/application-ui/application-shells/sidebar/brand_sidebar";
import Head from "next/head";

export function Layout({ children }) {
  const [loading, setLoading] = useState(false);

  if (loading) {
    <Head>
      <title>COCLIMA</title>
    </Head>;
    return <h1>Carregando</h1>;
  }

  return (
    <>
      <div className="bg-gray-100 page-wrapper ">
        <Sidebar>{children}</Sidebar>
      </div>
    </>
  );
}
