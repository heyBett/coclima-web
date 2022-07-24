/* This example requires Tailwind CSS v2.0+ */
import { ArrowSmDownIcon, ArrowSmUpIcon } from "@heroicons/react/solid";
import {
  CursorClickIcon,
  MailOpenIcon,
  UsersIcon,
  CloudIcon,
} from "@heroicons/react/solid";
import {
  TreeIcon,
  DollarIcon,
  CarbonIcon,
  PrimaryLogo,
} from "../../../vectors/custom";

const stats = [
  {
    id: 1,
    name: "Árvores Plantadas",
    stat: "71,897",
    icon: TreeIcon,
    change: "122",
    changeType: "increase",
    preffix: "",
    suffix: "",
  },
  {
    id: 2,
    name: "Carbono Compensado",
    stat: "58.16",
    icon: CarbonIcon,
    change: "5.4",
    changeType: "increase",
    preffix: "",
    suffix: "g",
  },
  {
    id: 3,
    name: "Capital Repassado",
    stat: "10000",
    icon: DollarIcon,
    change: "3.2",
    changeType: "decrease",
    preffix: "R$ ",
    suffix: "",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <div>
      <h1 className="text-4xl font-medium text-green-500">Dashboard</h1>
      <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
        Veja o quanto você já mudou o mundo!
      </h2>

      <dl className="grid grid-cols-1 gap-5 mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative px-4 py-5 overflow-hidden bg-green-500 rounded-lg shadow sm:py-6 sm:px-6"
          >
            <dt>
              <div className="absolute p-2 rounded-md">
                <item.icon
                  className="w-8 h-8 text-gray-800 fill-gray-800"
                  aria-hidden="true"
                />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-100 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="flex items-baseline ml-16 ">
              <p className="text-2xl font-semibold text-white">
                <span className="text-xs">{item.preffix}</span>
                {item.stat}
                <span className="text-sm"> {item.suffix}</span>
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
