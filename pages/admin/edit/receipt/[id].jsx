import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { IMaskInput } from "react-imask";
import { parse, parseISO, format } from "date-fns";
import Notification from "../../../../components/notifications";
import Confirmation from "../../../../components/confirmationModal";
import Loader from "../../../../components/loader";

export default function Example() {
  const {
    register,
    unregister,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
  } = useForm();
  const [notification, setNotification] = useState(false);
  const [status, setStatus] = useState(true);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const id = router.query.id;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(`/api/admin/`, fetcher);
  const url = "/api/admin/receipts/details?id=" + id;
  const { data: request } = useSWR(url, fetcher);
  const { mutate } = useSWRConfig();

  const companies = data?.companies;
  const receipt = request;

  function openModal() {
    setOpen(true);
    setTimeout(function () {
      setOpen(false);
    }, 100);
  }

  useEffect(() => {
    setTimeout(function () {
      if (getValues("status") === "paid") {
        setStatus(true);
        register("paid_at", { value: paidAt() });
      } else {
        setStatus(false);
        unregister("paid_at");
      }
    }, 500);
  }, [watch("status"), receipt]);

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
    let paid_at = null;
    if (data.paid_at !== undefined) {
      paid_at = parse(data.paid_at, "yyyy-MM-dd", new Date());
    }

    const response = await axios({
      method: "PATCH",
      url: "/api/admin/receipts/" + id,
      data: {
        created_at: parse(data.created_at, "yyyy-MM-dd", new Date()),
        paid_at: paid_at,
        due_at: parse(data.due_at, "yyyy-MM-dd", new Date()),
        vendor: data.vendor,
        value: parseInt(data.value),
        order_id: data.order,
        company: data.company,
        observations: data.observations,
        paid: data.status === "paid",
      },
    });
    enabledButton();
    reset();
    mutate("/api/admin/receipts");
    mutate("/api/admin/receipts/details?id=" + id);
    setNotification(true);
    router.push("/recibos/" + data.company);
    setTimeout(function () {
      setNotification(false);
    }, 3000);
  };

  function Pago(status) {
    if (status) {
      return "paid";
    } else {
      return "pendent";
    }
  }

  function paidAt() {
    if (receipt?.paid_at !== null && receipt?.paid_at !== undefined) {
      return format(parseISO(receipt.paid_at), "yyyy-MM-dd");
    } else {
      return format(new Date(), "yyyy-MM-dd");
    }
  }

  if (!request) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <Head>
        <title>Novo recibo</title>
      </Head>
      <Notification
        type={true}
        title={"Recibo editado com sucesso!"}
        notification={notification}
      ></Notification>
      <Confirmation
        open={open}
        title={"Apagar Recibo"}
        description={"Você tem certeza que deseja apagar esse recibo?"}
        mutate={"/api/admin/receipts?id=" + id}
        endpoint={"/api/admin/receipts/" + id}
        redirect={"/recibos/" + receipt.company_id}
      ></Confirmation>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">Editar recibo</h1>
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
                          {...register("order", { value: request.order_id })}
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
                        {companies?.length > 0 && (
                          <select
                            {...register("company", {
                              value: receipt.company_id,
                            })}
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
                        )}
                      </div>
                    </div>
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Plataforma
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("vendor", { value: receipt.vendor })}
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
                    <div className="col-span-3 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("status", {
                            value: Pago(receipt.paid),
                          })}
                          name="status"
                          id="status"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="paid">Pago</option>
                          <option value="pendent">Pendente</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
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
                          value={String(receipt.value / 100)}
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
                          Data de Criação
                        </label>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("created_at", {
                            value: format(
                              parseISO(receipt.created_at),
                              "yyyy-MM-dd"
                            ),
                          })}
                          type="date"
                          name="created_at"
                          id="created_at"
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
                          Data de Vencimento
                        </label>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("due_at", {
                            value: format(
                              parseISO(receipt.due_at),
                              "yyyy-MM-dd"
                            ),
                          })}
                          type="date"
                          name="due_at"
                          id="due_at"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    {status && (
                      <div className="col-span-6 sm:col-span-2">
                        <div className="flex flex-row justify-between">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Data de Pagamento
                          </label>
                        </div>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <input
                            required
                            {...register("paid_at", {
                              value: paidAt(),
                            })}
                            type="date"
                            name="paid_at"
                            id="paid_at"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor="company-website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Observações
                    </label>
                    <div className="flex mt-1 rounded-md shadow-sm">
                      <textarea
                        {...register("observations", {
                          value: receipt.observations,
                        })}
                        rows={5}
                        placeholder="Observações internas"
                        name="observations"
                        id="observations"
                        className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 space-x-2 text-right bg-gray-50 sm:px-6">
                  <a
                    onClick={() => openModal()}
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm cursor-pointer hover:bg-red-700 "
                  >
                    Apagar
                  </a>
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
