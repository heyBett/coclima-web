import Image from "next/image";

export default function Example(props) {
  const data = props.photos;

  if (!data)
    return (
      <ul
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
      </ul>
    );

  return (
    <ul
      role="list"
      className="grid grid-cols-3 p-5 my-4 bg-white rounded-lg lg:p-2 xl:p-5 gap-x-2 gap-y-2 sm:grid-cols-3 sm:gap-x-2 xl:gap-y-4 lg:grid-cols-3 xl:gap-x-4"
    >
      {data.map((file) => (
        <li key={file.id} className="relative">
          <div className="block w-full overflow-hidden bg-gray-100 rounded-lg aspect-1 group aspect-w-10 aspect-h-10 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-green-500">
            <Image
              width={150}
              height={150}
              src={file.data}
              alt=""
              className="object-cover pointer-events-none group-hover:opacity-75"
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
