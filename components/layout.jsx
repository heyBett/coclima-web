import { useEffect, useState } from "react";
const axios = require("axios").default;
import Sidebar from "../components/application-ui/application-shells/sidebar/brand_sidebar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Screen2 } from "../components/application-ui/forms/sign-in-forms/split_screen2";
import Loader from "./loader";

export function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);
  const [noName, setNoName] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      if (session) {
        setLoading(false);
      }
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && session.user.name !== null) {
      setLogin(false);
      setNoName(false);
      setLoading(false);
    }

    if (status === "unauthenticated") {
      setLogin(true);
    }

    if (status === "authenticated" && session.user.name === null) {
      setNoName(true);
    }
  }, [status, session]);

  if (login) {
    return (
      <div className="h-screen bg-gray-100">
        <Head>
          <title>Entre na Área de Parceiros</title>
        </Head>
        <Screen2></Screen2>
      </div>
    );
  }

  if (loading) {
    <Head>
      <title>COCLIMA</title>
    </Head>;
    return <Loader></Loader>;
  }

  return (
    <>
      <div className="bg-gray-100 page-wrapper ">
        <Sidebar session={session}>{children}</Sidebar>
      </div>
    </>
  );
}
