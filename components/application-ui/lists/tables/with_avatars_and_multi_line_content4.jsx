import Link from "next/link";

export default function Example(props) {
  const plantations = props.plantations;

  const total =
    plantations[0].handler
      .map((item) => item.value)
      .reduce((a, b) => a + b, 0) / plantations[0].tree_value;

  const investido =
    plantations[0].handler
      .map((item) => item.value)
      .reduce((a, b) => a + b, 0)
      .toFixed(2) / 100;

  return (
    <div className="">
      <div className="flex items-center justify-center">
        <Link href="/admin/create/plantation">
          <a className="px-4 py-3 my-6 text-white bg-green-500 rounded-md hover:bg-green-700">
            Criar Plantio
          </a>
        </Link>
      </div>
      <div className="sm:flex sm:items-center"></div>
      <div className="flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      role="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    ></th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Parceiro
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Árvores Plantadas
                    </th>
                    <th
                      role="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Valor Investido
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
                  {plantations.map((plantation) => (
                    <tr key={plantation.id}>
                      <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                        <div className="flex items-center">
                          <div className="font-semibold text-green-500">
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={
                                "http://www.google.com/maps/place/" +
                                plantation.geolocation.lat +
                                "," +
                                plantation.geolocation.lng
                              }
                            >
                              Ver no mapa
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          {plantation.partner.name}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          {(
                            plantation.handler
                              .map((item) => item.value)
                              .reduce((a, b) => a + b, 0) /
                            plantation.tree_value
                          ).toFixed(0) + " Árvores"}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">
                          {"R$ " +
                            plantation.handler
                              .map((item) => item.value)
                              .reduce((a, b) => a + b, 0) /* / 100 */
                              .toFixed(2)}
                        </div>
                      </td>

                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <Link href={"editar/plantation/" + plantation.id}>
                          <a className="text-green-600 hover:text-green-900">
                            Editar
                            <span className="sr-only">, {plantation.name}</span>
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
