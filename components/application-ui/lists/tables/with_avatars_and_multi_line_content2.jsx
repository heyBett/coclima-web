import Link from "next/link";
const _ = require("lodash");

export default function Example(props) {
  const companies = props.companies;

  function handlerLength(item) {
    return item.handler.length > 0;
  }

  function receiptsLength(item) {
    return item.receipts.length > 0;
  }

  function validReceipts(item) {
    return item.deleted_at === null && item.paid;
  }
  const totalSpent = _.sum(
    companies
      .filter(handlerLength)
      .map((item) =>
        item.handler
          .map((item) => parseFloat(item.value))
          .reduce((a, b) => a + b)
      )
  );

  const avaibleValue =
    _.sum(
      _.flattenDeep(
        companies
          .filter(receiptsLength)
          .map((item) =>
            item.receipts
              .filter(validReceipts)
              .map(
                (receipt) => (receipt.value / 100) * parseInt(item.percentage)
              )
          )
      )
    ) /
      100 -
    totalSpent;

  return (
    <div className="">
      <div className="flex items-center justify-center">
        <Link href="/admin/create/company">
          <a className="px-4 py-3 my-6 text-white bg-green-500 rounded-md hover:bg-green-700">
            Criar Empresa/Parceiro
          </a>
        </Link>
      </div>
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
                      Nome
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Repasse Utilizado
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Repasse Disponível
                    </th>

                    <th
                      role="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.map((company) => (
                    <tr key={company.id}>
                      <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">
                            {company.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">{company.email}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          R${" "}
                          {company.handler
                            .map((item) => item)
                            .map((item) => item.value)
                            .reduce((a, b) => a + b, 0) /*  / 100 */
                            .toFixed(2)}{" "}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          R${" "}
                          {(
                            (company.receipts
                              .filter(validReceipts)
                              .map((item) => item)
                              .map((item) => item.value)
                              .reduce((a, b) => a + b, 0) /
                              10000) *
                              parseInt(company.percentage, 10) -
                            company.handler
                              .map((item) => item)
                              .map((item) => item.value)
                              .reduce((a, b) => a + b, 0)
                          ).toFixed(2)}
                        </div>
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <Link href={"admin/edit/company/" + company.id}>
                          <a className="text-green-600 hover:text-green-900">
                            Editar
                            <span className="sr-only">, {company.name}</span>
                          </a>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-green-500">
                    <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                      <div className="flex items-center">
                        <div className="font-bold text-white">TOTAL</div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-white whitespace-nowrap"></td>
                    <td className="px-3 py-4 text-sm text-white whitespace-nowrap">
                      <div className="text-white">
                        R$ {totalSpent.toFixed(2)}{" "}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-white whitespace-nowrap">
                      <div className="text-white">
                        R$ {avaibleValue.toFixed(2)}
                        {/* {(
                          (company.receipts
                            .map((item) => item)
                            .map((item) => item.value)
                            .reduce((a, b) => a + b, 0) /
                            10000) *
                            parseInt(company.percentage, 10).toFixed(2) -
                          company.handler
                            .map((item) => item)
                            .map((item) => item.value)
                            .reduce((a, b) => a + b, 0) 
                            .toFixed(2)
                        ).toFixed(2)} */}{" "}
                      </div>
                    </td>
                    <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
