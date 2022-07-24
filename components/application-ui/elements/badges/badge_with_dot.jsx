/* This example requires Tailwind CSS v2.0+ */
export default function Example() {
  return (
    <>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <svg
          className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx={4} cy={4} r={3} />
        </svg>
        Small
      </span>
      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <svg
          className="-ml-1 mr-1.5 h-2 w-2 text-green-400"
          fill="currentColor"
          viewBox="0 0 8 8"
        >
          <circle cx={4} cy={4} r={3} />
        </svg>
        Large
      </span>
    </>
  );
}
