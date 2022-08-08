import { useForm, getValues } from "react-hook-form";
import { useState } from "react";
import { getCsrfToken } from "next-auth/react";

import { PrimaryLogo } from "../../../../components/vectors/custom";
const axios = require("axios").default;

export function Screen2(context) {
  const [verification, setVerification] = useState(false);
  const [token, setToken] = useState("");

  async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context);
    setToken(csrfToken);
  }
  getServerSideProps(context);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    document.getElementById("submitButton").disabled = true;
    document.getElementById("submitButton").innerHTML = "Enviando link...";
    document.getElementById("submitButton").classList.add("!bg-rose-900");

    const response = await axios({
      method: "post",
      url: "/api/auth/signin/email",
      data: {
        email: data.email,
        csrfToken: token,
      },
    });

    setVerification(true);
  };

  return (
    <>
      <div className="flex min-h-full">
        <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          {verification ? (
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 ">
                Confira seu email.
              </h2>
              <p className="mt-2 text-sm text-gray-600 ">
                <span className="font-medium text-rose-600 hover:text-rose-500">
                  Um link de login
                </span>{" "}
                foi enviado para sua caixa de entrada.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-sm mx-auto lg:w-96">
              <div>
                <PrimaryLogo></PrimaryLogo>
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900 ">
                  Plantando o futuro.
                </h2>
                <p className="mt-2 text-sm text-gray-600 ">
                  Enviaremos um email para você entrar.
                  <p className="mt-1 text-sm font-medium text-rose-600 hover:text-rose-500">
                    {" "}
                    Caso ainda não tenha uma conta, criaremos uma agora!
                  </p>
                </p>
              </div>

              <div className="mt-8">
                {/* <div>
                  <div></div>
                  <div className="relative mt-6">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-green-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 text-gray-500 bg-gray-100">
                        Plante o futuro
                      </span>
                    </div>
                  </div>
                </div> */}

                <div className="mt-6">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    method="post"
                    className="space-y-6"
                  >
                    <div>
                      <input
                        name="csrfToken"
                        type="hidden"
                        defaultValue={token}
                      />
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 "
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          {...register("email")}
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        id="submitButton"
                        type="submit"
                        className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-rose-600 hover:bg-rose-700 "
                      >
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative flex-1 hidden w-0 bg-green-900 lg:block">
          <img
            className="absolute inset-0 object-cover w-full h-full opacity-30 mix-blend-luminosity"
            src="/images/login.jpg"
            alt="Plantando o Futuro"
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
}
