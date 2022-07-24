/* This example requires Tailwind CSS v2.0+ */
const people = [
  {
    name: "Lindsay Walton",
    email: "lindsay.walton@example.com",
    scope: "admin",
  },
  {
    name: "Lindsay Walton",
    email: "lisndsay.walton@example.com",
    scope: "user",
  },
  // More people...
];

export default function Example() {
  return (
    <div className="">
      <div className="sm:flex sm:items-center"></div>
      <div className="flex flex-col mt-8">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Nome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Escopo
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {people.map((person) => (
                    <tr key={person.email}>
                      <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                        <div className="flex items-center">
                          <div className="">
                            <div className="font-medium text-gray-900">
                              {person.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        <div className="text-gray-500">{person.email}</div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {person.scope === "admin" && (
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-amber-100 text-amber-800">
                            Administrador
                          </span>
                        )}
                        {person.scope === "user" && (
                          <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                            Usuário
                          </span>
                        )}
                      </td>

                      <td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
                        <a
                          href="#"
                          className="text-green-600 hover:text-green-900"
                        >
                          Editar<span className="sr-only">, {person.name}</span>
                        </a>
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
