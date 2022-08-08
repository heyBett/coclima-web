/* This example requires Tailwind CSS v2.0+ */
const user = {
  name: "Nome do Usuário",
  role: "Nome da Empresa",
  imageUrl:
    "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const stats = [
  {
    label: "Árvores Plantadas",
    value: 12,
    preffix: "",
    suffix: "",
    icon: "tree",
  },
  {
    label: "Carbono Compensado",
    value: 4,
    preffix: "",
    suffix: "g",
    icon: "tree",
  },
  {
    label: "Capital Repassado",
    value: 2,
    preffix: "R$ ",
    suffix: "",
    icon: "tree",
  },
];

export default function Hello() {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <h2 className="sr-only" id="profile-overview-title">
        Profile Overview
      </h2>
      <div className="p-6 bg-white">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
              <p className="text-sm font-medium text-gray-600">
                Olá novamente,
              </p>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                {users.name}
              </p>
              <p className="text-sm font-medium text-gray-600">{users.role}</p>
            </div>
          </div>
          <div className="flex justify-center mt-5 sm:mt-0">
            <a
              href="#"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              View profile
            </a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 border-t border-gray-200 divide-y divide-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-6 py-5 text-sm font-medium text-center"
          >
            <span className="text-gray-900">{stat.label}</span>
            {": "}
            <span className="text-gray-600">
              {stat.preffix + stat.value + stat.suffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
