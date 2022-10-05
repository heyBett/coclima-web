import Link from "next/link";

export default function Example(props) {
  const companies = props.companies;

  function paidReceipt(item) {
    return item.paid;
  }

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-medium text-green-500">Recibos</h1>
          <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
            Administre recibos e pagamentos
          </h2>
        </div>
        <div className="">
          <Link href="/admin/create/receipt">
            <a className="block px-4 py-3 my-6 text-center text-white bg-green-500 rounded-md hover:bg-green-700">
              Criar Recibo
            </a>
          </Link>
        </div>
      </div>
      <div className="mt-10 sm:flex sm:items-center"></div>
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
                      Empresa
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Capturado
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Pago
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Disponibilizado
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
                  {companies?.map((company) => (
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
                        R${" "}
                        {company?.receipts
                          .map((item) => item.value)
                          .reduce((a, b) => a + b, 0) / (100).toFixed(2)}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          R${" "}
                          {company?.receipts
                            .map((item) => item)
                            .filter(paidReceipt)
                            .map((item) => item.value)
                            .reduce((a, b) => a + b, 0) / (100).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          R${" "}
                          {(
                            (company?.receipts
                              .map((item) => item)
                              .filter(paidReceipt)
                              .map((item) => item.value)
                              .reduce((a, b) => a + b, 0) /
                              10000) *
                            parseInt(company.percentage)
                          ).toFixed(2)}
                        </div>
                      </td>
                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        {company?.receipts.length > 0 && (
                          <Link href={"/recibos/" + company.id}>
                            <a className="text-green-600 hover:text-green-900">
                              Detalhes
                              <span className="sr-only">, {company.name}</span>
                            </a>
                          </Link>
                        )}
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
