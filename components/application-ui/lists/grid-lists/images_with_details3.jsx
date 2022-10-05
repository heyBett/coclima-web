import useSWR from "swr";
import { useRouter } from "next/router";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Loader from "../../../loader";
export default function Example() {
  const id = useRouter().query.id;

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(`/api/views/plantations/${id}`, fetcher);

  if (!data) return <Loader></Loader>;
  {
    /* <ul
        role="list"
        className="grid grid-cols-3 p-5 my-4 bg-white rounded-lg lg:p-2 xl:p-5 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-x-2 xl:gap-y-4 lg:grid-cols-3 xl:gap-x-4"
      >
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
        <li className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <img
              src="/images/default_tree.jpg"
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
      </ul> */
  }
  return (
    <div className="">
      <h1 className="text-4xl font-medium text-green-500">
        {(
          data.handler
            .map((item) => item)
            .map((item) => item.value)
            .reduce((a, b) => a + b, 0) / data.tree_value
        ).toFixed(0)}{" "}
        Árvores Plantadas
      </h1>
      <h2 className="mt-2 leading-6 text-gray-700 text-md font-regular">
        Plantado em {format(parseISO(data.date), "dd/MM/yyyy")} por{" "}
        {data.partner.name}
      </h2>
      <ul
        role="list"
        className="grid grid-cols-3 p-5 my-4 bg-white rounded-lg lg:p-2 xl:p-5 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-x-2 xl:gap-y-4 lg:grid-cols-3 xl:gap-x-4"
      >
        {data?.archives.map((file) => (
          <li key={file.id} className="relative">
            <div className="block w-full overflow-hidden bg-gray-100 rounded-lg group aspect-1 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "/plantations/" +
                  file.plantation_id +
                  "/" +
                  file.id +
                  "_full.jpg"
                }
              >
                <Image
                  height={500}
                  width={500}
                  src={
                    "/plantations/" +
                    file.plantation_id +
                    "/" +
                    file.id +
                    "_social.jpg"
                  }
                  alt="Árvore"
                  className="object-cover pointer-events-none group-hover:opacity-75"
                />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
