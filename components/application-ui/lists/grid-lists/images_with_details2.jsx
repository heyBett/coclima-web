import Link from "next/link";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Loader from "../../../loader";

export default function Example() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("/api/views/marketing", fetcher, {
    refreshInterval: 120000,
  });

  function isPlanted(item) {
    return item.planted;
  }

  const plantations = data?.filter(isPlanted);

  if (!data) {
    return <Loader></Loader>;
  }

  if (plantations.length === 0) {
    return (
      <div className="">
        <h1 className="text-xl text-gray-600">
          Você <span className="font-semibold text-green-500">ainda</span> não
          tem nenhuma àrvore plantada
        </h1>
        <p className="pt-1 text-gray-600">
          Em breve as fotografias de suas plantações estarão disponíveis aqui!
        </p>
      </div>
    );
  }

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-4 gap-y-8 lg:grid-cols-3 sm:gap-x-4 xl:grid-cols-4"
    >
      {plantations.map((plantation) => (
        <li key={plantation.id} className="relative">
          <Link href={"/plantios/" + plantation.id}>
            <a>
              <div className="flex flex-col px-4 pt-4 bg-white rounded-lg shadow-sm">
                <div className="block w-full overflow-hidden bg-gray-100 rounded-lg aspect-1 group focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500">
                  {plantation.archives.length > 0 ? (
                    <Image
                      src={plantation.archives[0].data}
                      alt="Image of the plantation"
                      className="object-cover pointer-events-none group-hover:opacity-75 "
                      height={500}
                      width={500}
                    />
                  ) : (
                    <Image
                      src="/images/default_tree.jpg"
                      alt="Image of the plantation"
                      className="object-cover pointer-events-none group-hover:opacity-75"
                      height={500}
                      width={500}
                    />
                  )}
                </div>
                <div className="flex flex-row items-center justify-between py-4">
                  <div>
                    <p className="flex mb-1 font-medium text-gray-900 truncate pointer-events-none">
                      {(
                        plantation.handler
                          .map((item) => item)
                          .map((item) => item.value)
                          .reduce((a, b) => a + b, 0) / plantation.tree_value
                      ).toFixed(0)}{" "}
                      Árvores
                    </p>
                    <p className="flex text-xs font-medium text-gray-500 truncate pointer-events-none">
                      {format(parseISO(plantation.date), "dd/MM/yyyy")}
                    </p>
                  </div>
                  <p className="flex px-4 py-2 text-xs font-medium text-white bg-green-500 rounded-full">
                    Ver Mais
                  </p>
                </div>
              </div>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
