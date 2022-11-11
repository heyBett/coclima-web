import {
  CreditCardIcon,
  KeyIcon,
  UserCircleIcon,
  UserGroupIcon,
  ViewGridAddIcon,
} from "@heroicons/react/outline";
import Head from "next/head";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";

export default function Example() {
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();
  //New Comment
  function disabledButton() {
    document.getElementById("submitButton").disabled = true;
    document.getElementById("submitButton").innerHTML = "Carregando...";
    document.getElementById("submitButton").classList.add("!bg-green-800");
  }

  function enabledButton() {
    document.getElementById("submitButton").disabled = false;
    document.getElementById("submitButton").innerHTML = "Salvar";
    document.getElementById("submitButton").classList.remove("!bg-green-800");
  }

  const onSubmit = async (data) => {
    disabledButton();
    const response = await axios({
      method: "POST",
      url: "/api/admin/company",
      data: data,
    });

    router.push("/admin?tab=companies");
  };

  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">
          Criar nova Empresa/Partner
        </h1>
        <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
          {/* Mostre que sua empresa está preocupada em construir um mundo melhor! */}
        </h2>
        <div className="mt-10"></div>
        <div className="lg:grid lg:gap-x-5">
          <div className="space-y-6 sm:px-6 lg:px-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-6 space-y-8 bg-white sm:p-6">
                  <div>
                    {/* <p className="mt-1 text-sm text-gray-500">
                      Essa informação será visível para o usuário.
                    </p> */}
                  </div>

                  <div className="grid grid-cols-4 gap-4 ">
                    <div className="col-span-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nome
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          Obrigatório
                        </span>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("name")}
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          CNPJ/CPF
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          Obrigatório
                        </span>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("cpfcnpj")}
                          type="text"
                          name="cpfcnpj"
                          id="cpfcnpj"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          Obrigatório
                        </span>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("email")}
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Telefone
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          Obrigatório
                        </span>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          {...register("phone")}
                          type="text"
                          name="phone"
                          id="phone"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="company-website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Escopo
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("role")}
                          name="role"
                          id="role"
                          autoComplete="role"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          <option value="company">Empresa</option>
                          <option value="partner">Parceiro</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="company-website"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Repasse (%)
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          defaultValue={2}
                          min={1}
                          required
                          type="number"
                          {...register("percentage")}
                          name="percentage"
                          id="percentage"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Site
                      </label>
                      <input
                        type="text"
                        {...register("site")}
                        name="site"
                        id="site"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="fees"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Juros (inadimplência)
                      </label>
                      <input
                        defaultValue={0}
                        min={0}
                        required
                        type="number"
                        {...register("fees")}
                        name="fees"
                        id="fees"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Multa (inadimplência)
                      </label>
                      <input
                        defaultValue={0}
                        min={0}
                        required
                        type="number"
                        {...register("penalty")}
                        name="penalty"
                        id="penalty"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CEP
                      </label>
                      <input
                        type="text"
                        {...register("cep")}
                        name="cep"
                        id="cep"
                        autoComplete="cep"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Estado
                      </label>
                      <select
                        id="state"
                        {...register("state")}
                        name="state"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option value="AC">Acre</option>
                        <option value="AL">Alagoas</option>
                        <option value="AP">Amapá</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                        <option value="EX">Estrangeiro</option>
                      </select>
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cidade
                      </label>
                      <input
                        type="text"
                        {...register("city")}
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Bairro
                      </label>
                      <input
                        type="text"
                        {...register("district")}
                        name="district"
                        id="district"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2 lg:col-span-1 ">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="street"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Rua
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          Obrigatório
                        </span>
                      </div>
                      <input
                        required
                        type="text"
                        {...register("street")}
                        name="street"
                        autoComplete="street"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Número
                      </label>
                      <input
                        type="text"
                        {...register("number")}
                        name="number"
                        id="number"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2 lg:col-span-1">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Complemento
                      </label>
                      <input
                        type="text"
                        {...register("complement")}
                        name="complement"
                        id="complement"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    id="submitButton"
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>

            {/*}
            <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-6 space-y-6 bg-white sm:p-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Notifications
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Provide basic informtion about the job. Be specific with
                      the job title.
                    </p>
                  </div>

                  <fieldset>
                    <legend className="text-base font-medium text-gray-900">
                      By Email
                    </legend>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="comments"
                            name="comments"
                            type="checkbox"
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="comments"
                            className="font-medium text-gray-700"
                          >
                            Comments
                          </label>
                          <p className="text-gray-500">
                            Get notified when someones posts a comment on a
                            posting.
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="candidates"
                              name="candidates"
                              type="checkbox"
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="candidates"
                              className="font-medium text-gray-700"
                            >
                              Candidates
                            </label>
                            <p className="text-gray-500">
                              Get notified when a candidate applies for a job.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="offers"
                              name="offers"
                              type="checkbox"
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="offers"
                              className="font-medium text-gray-700"
                            >
                              Offers
                            </label>
                            <p className="text-gray-500">
                              Get notified when a candidate accepts or rejects
                              an offer.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  <fieldset className="mt-6">
                    <legend className="text-base font-medium text-gray-900">
                      Push Notifications
                    </legend>
                    <p className="text-sm text-gray-500">
                      These are delivered via SMS to your mobile phone.
                    </p>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="push-everything"
                          name="push-notifications"
                          type="radio"
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="push-everything" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">
                            Everything
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-email"
                          name="push-notifications"
                          type="radio"
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="push-email" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">
                            Same as email
                          </span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="push-nothing"
                          name="push-notifications"
                          type="radio"
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <label htmlFor="push-nothing" className="ml-3">
                          <span className="block text-sm font-medium text-gray-700">
                            No push notifications
                          </span>
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form> */}
          </div>
        </div>
      </main>
    </div>
  );
}
