import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRef } from "react";
import { IMaskInput } from "react-imask";
import { parse } from "date-fns";
import Notification from "../../../components/notifications";

export default function Example() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [notification, setNotification] = useState(false);
  const ref = useRef(null);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(`/api/admin/`, fetcher);

  const companies = data?.companies;

  //New Comment
  function disabledButton() {
    document.getElementById("submitButton").disabled = true;
    document.getElementById("submitButton").innerHTML = "Carregando...";
    document.getElementById("submitButton").classList.add("!bg-green-800");
  }

  function enabledButton() {
    document.getElementById("submitButton").disabled = false;
    document.getElementById("submitButton").innerHTML = "Salvar";
    document.getElementById("submitButton").classList.remove("!bg-green-800");
  }

  const onSubmit = async (data) => {
    disabledButton();
    const response = await axios({
      method: "POST",
      url: "/api/admin/receipts",
      data: {
        date: parse(data.date, "yyyy-MM-dd", new Date()),
        vendor: data.vendor,
        value: parseInt(data.value),
        order: data.order,
        company: data.company,
        paid: data.status === "paid",
      },
    });
    enabledButton();
    reset();
    setNotification(true);
    setTimeout(function () {
      setNotification(false);
    }, 3000);
  };

  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>
      <Notification
        type={true}
        title={"Recibo criado com sucesso!"}
        notification={notification}
      ></Notification>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">
          Criar novo recibo
        </h1>
        <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
          {/* Mostre que sua empresa está preocupada em construir um mundo melhor! */}
        </h2>
        <div className="mt-10"></div>
        <div className="lg:grid lg:gap-x-5">
          <div className="space-y-6 sm:px-6 lg:px-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-6 space-y-8 bg-white sm:p-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900"></h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Lembre-se de adicionar o valor total. O cálculo da
                      porcentagem de repasse é feito automaticamente.
                    </p>
                  </div>

                  <div className="grid grid-cols-6 gap-4 ">
                    <div className="col-span-8 sm:col-span-2">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Identificador
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          ID do Pedido
                        </span>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("order")}
                          type="text"
                          name="order"
                          id="order"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Empresa
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("company")}
                          name="company"
                          id="company"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          {companies?.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Plataforma
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("vendor")}
                          name="vendor"
                          id="vendor"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="Coclima">Coclima</option>
                          <option value="Nuvemshop">Nuvemshop</option>
                          <option value="Tray">Tray</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("status")}
                          name="status"
                          id="status"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="paid">Pago</option>
                          <option value="pendent">Pendente</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Valor (R$)
                        </label>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <IMaskInput
                          mask={Number}
                          radix="."
                          scale={2}
                          signed={false}
                          padFractionalZeros={true}
                          normalizeZeros={false}
                          step="any"
                          unmask={false} // true|false|'typed'
                          {...register("value")} // access to nested input
                          // DO NOT USE onChange TO HANDLE CHANGES!
                          // USE onAccept INSTEAD
                          onAccept={
                            // depending on prop above first argument is
                            // `value` if `unmask=false`,
                            // `unmaskedValue` if `unmask=true`,
                            // `typedValue` if `unmask='typed'`
                            (value, mask) => {
                              setValue("value", value.replace(".", ""));
                            }
                          }
                          // ...and more mask props in a guide

                          // input props also available

                          type="number"
                          name="value"
                          id="value"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Data
                        </label>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("date")}
                          type="date"
                          name="date"
                          id="date"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    id="submitButton"
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
