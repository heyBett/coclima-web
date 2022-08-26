import { useEffect, useState } from "react";
const axios = require("axios").default;
import Sidebar from "../components/application-ui/application-shells/sidebar/brand_sidebar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Screen2 } from "../components/application-ui/forms/sign-in-forms/split_screen2";
import Loader from "./loader";
import { useRouter } from "next/router";
import Perfil from "../components/perfil";

export function Layout({ children }) {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);
  const [firstLogin, setFirstLogin] = useState(false);
  const [onboarding, setOnboarding] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

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

      setLoading(false);
    }

    if (status === "unauthenticated") {
      setLogin(true);
    }

    if (
      (status === "authenticated" && session?.user.name === null) ||
      (status === "authenticated" && session?.user.company_id === null) ||
      (status === "authenticated" && session?.user.company_cnpj === null) ||
      (status === "authenticated" &&
        session?.user.company_cnpj.includes("Sem CNPJ"))
    ) {
      setFirstLogin(true);
    }
    if (
      status === "authenticated" &&
      session?.user.name !== null &&
      session?.user.company_id !== null &&
      session?.user.company_cnpj !== null &&
      !session?.user.company_cnpj.includes("Sem CNPJ")
    ) {
      setFirstLogin(false);
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

  if (firstLogin) {
    return <Perfil></Perfil>;
  }

  if (loading) {
    <Head>
      <title>Dashboard | Coclima</title>
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
