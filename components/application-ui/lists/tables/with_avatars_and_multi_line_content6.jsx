import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { mutate } from "swr";
const _ = require("lodash");

export default function Example(props) {
  const receipts = props.receipts;

  const ordenedReceipts = _.orderBy(receipts, ["id"], ["desc"]);

  useEffect(() => {
    console.log(receipts);
  }, [receipts]);

  const router = useRouter();
  const id = router.query.id;

  const onChange = async (item) => {
    await axios({
      method: "PATCH",
      url: "/api/admin/receipts/" + item.id,
      data: {
        id: item.id,
        paid: !item.paid,
      },
    });
    mutate("/api/admin/receipts/" + id);
  };

  return (
    <div className="">
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
                      Order ID
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Vendor
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
                      Controle
                    </th>

                    <th
                      role="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Detalhes</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ordenedReceipts?.map((receipt) => (
                    <tr key={receipt.id}>
                      <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">
                            {receipt.orderId !== null
                              ? receipt.orderId
                              : receipt.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">{receipt.vendor}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          R$ {(receipt.value / 100).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          {receipt.paid ? (
                            <button
                              onClick={() => onChange(receipt)}
                              className="px-3 py-1 text-white bg-red-600 rounded-md"
                            >
                              Marcar como não pago
                            </button>
                          ) : (
                            <button
                              onClick={() => onChange(receipt)}
                              className="px-3 py-1 text-white bg-green-600 rounded-md"
                            >
                              Marcar como pago
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <Link href={"/recursos/" + receipt.id}>
                          <a className="text-green-600 hover:text-green-900">
                            Detalhes
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
