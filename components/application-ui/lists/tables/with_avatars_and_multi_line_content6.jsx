import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { mutate } from "swr";
const _ = require("lodash");
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Disclosure } from "@headlessui/react";
import { TagIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { parseJSON, format } from "date-fns";

export default function Example(props) {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  const receipts = props.receipts;

  const ordenedReceipts = _.orderBy(receipts, ["id"], ["desc"]);

  const paidReceipts = ordenedReceipts.filter((item) => item.paid);
  const paidReceiptsSum = (_.sumBy(paidReceipts, "value") / 100).toFixed(2);
  const unpaidReceipts = ordenedReceipts.filter((item) => !item.paid);
  const unpaidReceiptsSum = (_.sumBy(unpaidReceipts, "value") / 100).toFixed(2);

  const totalReceipts = (_.sumBy(ordenedReceipts, "value") / 100).toFixed(2);

  const router = useRouter();
  const id = router.query.id;

  function showLogs(logs) {
    setOpen(true);
    setLogs(logs);
    console.log(logs);
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function isPaid(paid) {
    if (paid) {
      return (
        <p>
          Status: <span className="text-green-600">Pago</span>
        </p>
      );
    } else {
      return (
        <p>
          Status: <span className="text-red-600">Não Pago</span>
        </p>
      );
    }
  }

  /* const onChange = async (item) => {
    await axios({
      method: "PATCH",
      url: "/api/admin/receipts/" + item.id,
      data: {
        id: item.id,
        paid: !item.paid,
      },
    });
    mutate("/api/admin/receipts/" + id);
  }; */

  function classSelect(item) {
    if (item) {
      return "bg-green-500";
    } else {
      return "bg-red-500";
    }
  }

  return (
    <div className="">
      {open && (
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={setOpen}
          >
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                  <div>
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                      <TagIcon
                        className="w-6 h-6 text-green-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Histórico de Alterações
                      </Dialog.Title>

                      <div className="">
                        <div className="">
                          <div className="">
                            <div className="max-w-3xl mx-auto divide-y-2 ">
                              <dl className="mt-6 divide-y ">
                                {logs.map((log) => (
                                  <Disclosure
                                    as="div"
                                    key={log.content.id}
                                    className="py-3"
                                  >
                                    {({ open }) => (
                                      <>
                                        <dt className="text-sm">
                                          <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-400">
                                            <p>
                                              {format(
                                                parseJSON(log.created_at),
                                                "dd/MM/yyyy"
                                              )}
                                            </p>
                                            <p className="">{log.event}</p>

                                            <span className="flex items-center ml-6 h-7">
                                              <ChevronDownIcon
                                                className={classNames(
                                                  open
                                                    ? "-rotate-180"
                                                    : "rotate-0",
                                                  "h-6 w-6 transform"
                                                )}
                                                aria-hidden="true"
                                              />
                                            </span>
                                          </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel
                                          as="dd"
                                          className="mt-2"
                                        >
                                          <div className="space-y-2 text-sm">
                                            <p className="text-base text-gray-500">
                                              {log.description}
                                            </p>
                                            <div className="flex justify-center space-x-3 text-gray-500 ">
                                              <p className="">
                                                Plataforma: {log.content.vendor}
                                              </p>
                                              <p>|</p>
                                              {isPaid(log.content.paid)}
                                            </div>

                                            {log.content.due_at !== null && (
                                              <p className="text-gray-500 ">
                                                Vencimento:{" "}
                                                {format(
                                                  parseJSON(log.content.due_at),
                                                  "dd/MM/yyyy"
                                                )}
                                              </p>
                                            )}

                                            {log.content.paid_at !== null && (
                                              <p className="text-gray-500 ">
                                                Data de Pagamento:{" "}
                                                {format(
                                                  parseJSON(
                                                    log.content.paid_at
                                                  ),
                                                  "dd/MM/yyyy"
                                                )}
                                              </p>
                                            )}

                                            <p className="text-gray-500 ">
                                              Valor: R${" "}
                                              {(log.content.value / 100)
                                                .toFixed(2, 10)
                                                .replace(".", ",")}
                                            </p>
                                            <p className="text-gray-500 ">
                                              Usuário: {log.owner}
                                            </p>
                                            <p className="text-gray-500 ">
                                              Observações:{" "}
                                              {log.content.observations}
                                            </p>
                                          </div>
                                        </Disclosure.Panel>
                                      </>
                                    )}
                                  </Disclosure>
                                ))}
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      )}
      <div className="sm:flex sm:items-center"></div>
      <div className="flex flex-col ">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      role="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      ID
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Plataforma
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Valor
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Comissão
                    </th>
                    <th
                      role="col"
                      className="text-center px-3 py-3.5  text-sm font-semibold text-gray-900"
                    >
                      Histórico
                    </th>
                    <th
                      role="col"
                      className="text-center px-3 py-3.5  text-sm font-semibold text-gray-900"
                    >
                      Controle
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ordenedReceipts?.map((receipt) => (
                    <tr
                      key={
                        receipt.id
                      } /* className={classSelect(receipt.paid)} */
                    >
                      <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-500">
                            {receipt.orderId !== null
                              ? receipt.orderId
                              : receipt.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800">{receipt.vendor}</div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800">
                          R$ {(receipt.value / 100).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-800">
                          R${" "}
                          {(
                            (receipt.value / 10000) *
                            parseInt(receipt.percentage, 10)
                          ).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="text-center text-gray-800">
                          <button
                            onClick={() => showLogs(receipt.log)}
                            className="px-3 py-2 text-gray-600 bg-gray-200 rounded-sm"
                          >
                            Ver Histórico
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap">
                        <div className="text-center text-gray-800">
                          <button
                            onClick={() =>
                              router.push("/admin/edit/receipt/" + receipt.id)
                            }
                            className="px-3 py-2 text-gray-600 bg-gray-200 rounded-sm"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-2">
              {unpaidReceiptsSum === "0.00" ? (
                <div className="px-5 py-2 text-center text-white bg-green-500 rounded-l-lg">
                  <h1>Status</h1>
                  <p className="text-xs">Pago</p>
                </div>
              ) : (
                <div className="px-5 py-2 text-center text-white rounded-l-lg bg-amber-500">
                  <h1>Status</h1>
                  <p className="text-xs">Pendente</p>
                </div>
              )}

              <div className="px-5 py-2 text-center text-white bg-green-500 rounded-r-lg">
                <h1>Comissão Total</h1>
                <p className="text-xs">
                  {"R$ " +
                    (
                      (totalReceipts / 100) *
                      parseInt(receipts[0]?.percentage, 10)
                    ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
