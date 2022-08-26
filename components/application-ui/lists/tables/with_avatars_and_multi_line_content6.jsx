import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { mutate } from "swr";
const _ = require("lodash");

export default function Example(props) {
  const receipts = props.receipts;

  const ordenedReceipts = _.orderBy(receipts, ["id"], ["desc"]);

  const paidReceipts = ordenedReceipts.filter((item) => item.paid);
  const paidReceiptsSum = (_.sumBy(paidReceipts, "value") / 100).toFixed(2);
  const unpaidReceipts = ordenedReceipts.filter((item) => !item.paid);
  const unpaidReceiptsSum = (_.sumBy(unpaidReceipts, "value") / 100).toFixed(2);

  const router = useRouter();
  const id = router.query.id;

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
                            onClick={() => onChange(receipt)}
                            className="w-24 px-3 py-2 text-gray-600 bg-gray-200 rounded-sm"
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
                <div className="px-5 py-2 text-center text-white bg-green-700 rounded-l-lg">
                  <h1>Pendente</h1>
                  <p className="text-xs">Nenhuma pendência</p>
                </div>
              ) : (
                <div className="px-5 py-2 text-center text-white bg-red-500 rounded-l-lg">
                  <h1>Pendente</h1>
                  <p className="text-xs">
                    {"R$ " +
                      (
                        (unpaidReceiptsSum / 100) *
                        parseInt(receipts[0]?.percentage, 10)
                      ).toFixed(2)}
                  </p>
                </div>
              )}

              <div className="px-5 py-2 text-center text-white bg-green-600 rounded-r-lg">
                <h1>Pagos</h1>
                <p className="text-xs">
                  {"R$ " +
                    (
                      (paidReceiptsSum / 100) *
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
