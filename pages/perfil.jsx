import {
  CreditCardIcon,
  KeyIcon,
  UserCircleIcon,
  UserGroupIcon,
  ViewGridAddIcon,
} from "@heroicons/react/outline";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import { useRouter } from "next/router";

export default function Example(props) {
  const [profileImage, setProfileImage] = useState("/images/default_user.jpg");

  const { register, handleSubmit, reset, getValues, setValue } = useForm();
  const router = useRouter();

  const session = props.session;
  const firstLogin = session.user.company_id === null;

  useEffect(() => {
    setProfileImage(session.user.image);
  }, []);

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
    data.avatar.base64 = profileImage;
    console.log(data);
    disabledButton();
    if (firstLogin) {
      const response = await axios({
        method: "POST",
        url: "/api/firstLogin",
        data,
      });
    } else {
      const response = await axios({
        method: "PATCH",
        url: "/api/admin/user",
        data: {
          name: data.name,
          email: data.email,
          avatar: {
            base64: profileImage,
          },
        },
      });
    }
    enabledButton();
    window.location.replace("/");
  };

  async function handleFile(event) {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    setProfileImage(base64);
  }

  async function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        {firstLogin ? (
          <h1 className="text-4xl font-medium text-green-500">Criar Perfil</h1>
        ) : (
          <h1 className="text-4xl font-medium text-green-500">Editar Perfil</h1>
        )}
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
                    {firstLogin ? (
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Hora de criar seu perfil
                      </h3>
                    ) : (
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Perfil
                      </h3>
                    )}

                    {/* <p className="mt-1 text-sm text-gray-500">
                      Essa informação será visível para o usuário.
                    </p> */}
                  </div>

                  <div className="grid grid-cols-4 gap-4 ">
                    <div className="col-span-4 sm:col-span-2">
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
                          {...register("name", {
                            value: session.user.name,
                          })}
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="col-span-4 sm:col-span-2">
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
                          {...register("email", {
                            value: session.user.email,
                          })}
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    {/* <div className="col-span-4 sm:col-span-2 xl:col-span-1">
                      <div className="flex flex-row justify-between">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Senha
                        </label>
                        <span className="text-sm font-medium text-gray-300">
                          Obrigatório
                        </span>
                      </div>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <input
                          required
                          type="password"
                          name="password"
                          {...register("password")}
                          id="password"
                          autoComplete="password"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div> */}
                    <div className="col-span-4 ">
                      <div className="flex items-center mt-1">
                        <span className="inline-block w-24 h-24 overflow-hidden bg-gray-100 rounded-full">
                          <img
                            className="object-cover bg-black aspect-1"
                            src={profileImage}
                          />
                        </span>
                        <label className="px-3 py-2 ml-5 text-sm font-medium leading-4 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                          <input
                            type="file"
                            className="sr-only"
                            {...register("avatar")}
                            onChange={(e) => handleFile(e)}
                            accept="image/*"
                          />
                          Mudar Avatar
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                {firstLogin && (
                  <div className="px-4 !pt-16 space-y-8 bg-white sm:p-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Agora é hora da sua empresa
                      </h3>
                      {/* <p className="mt-1 text-sm text-gray-500">
                      Essa informação será visível para o usuário.
                    </p> */}
                    </div>

                    <div className="grid grid-cols-4 gap-4 ">
                      <div className="col-span-4 sm:col-span-2">
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
                            {...register("busname")}
                            type="text"
                            name="busname"
                            id="busname"
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
                            {...register("busemail")}
                            type="email"
                            name="busemail"
                            id="busemail"
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
                      <div className="col-span-4 sm:col-span-2">
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

                      <div className="col-span-4 sm:col-span-2 lg:col-span-2">
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
                )}
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
          </div>
        </div>
      </main>
    </div>
  );
}
