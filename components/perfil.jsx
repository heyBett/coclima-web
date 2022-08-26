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
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "./loader";

export default function Example(props) {
  const [profileImage, setProfileImage] = useState("/images/default_user.jpg");
  const [cpfCnpj, setCpfCnpj] = useState("CNPJ");
  const { data: session, status } = useSession();
  const user = session?.user;

  const { register, handleSubmit, reset, getValues, setValue } = useForm();
  const router = useRouter();

  const firstLogin = session?.user.company_id === null;
  const noCNPJ =
    session?.user.company_cnpj === null ||
    session?.user.company_cnpj.includes("Sem CNPJ");

  useEffect(() => {
    setProfileImage(session?.user.image);
  }, [session]);

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

  function verifica_cpf_cnpj(valor) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, "");
    if (valor.length === 11) {
      return "CPF";
    } else if (valor.length === 14) {
      return "CNPJ";
    } else {
      return false;
    }
  }
  function calc_digitos_posicoes(digitos, posicoes = 10, soma_digitos = 0) {
    digitos = digitos.toString();
    for (var i = 0; i < digitos.length; i++) {
      soma_digitos = soma_digitos + digitos[i] * posicoes;
      posicoes--;
      if (posicoes < 2) {
        posicoes = 9;
      }
    }
    soma_digitos = soma_digitos % 11;
    if (soma_digitos < 2) {
      soma_digitos = 0;
    } else {
      soma_digitos = 11 - soma_digitos;
    }
    var cpf = digitos + soma_digitos;
    return cpf;
  }

  function valida_cpf(valor) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, "");
    var digitos = valor.substr(0, 9);
    var novo_cpf = calc_digitos_posicoes(digitos);
    var novo_cpf = calc_digitos_posicoes(novo_cpf, 11);
    if (novo_cpf === valor) {
      return true;
    } else {
      return false;
    }
  }

  function valida_cnpj(valor) {
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, "");
    var cnpj_original = valor;
    var primeiros_numeros_cnpj = valor.substr(0, 12);
    var primeiro_calculo = calc_digitos_posicoes(primeiros_numeros_cnpj, 5);
    var segundo_calculo = calc_digitos_posicoes(primeiro_calculo, 6);
    var cnpj = segundo_calculo;
    if (cnpj === cnpj_original) {
      return true;
    }
    return false;
  }

  function valida_cpf_cnpj(valor) {
    var valida = verifica_cpf_cnpj(valor);
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, "");
    if (valida === "CPF") {
      return valida_cpf(valor);
    } else if (valida === "CNPJ") {
      return valida_cnpj(valor);
    } else {
      return false;
    }
  }

  function formata_cpf_cnpj(valor) {
    var formatado = false;
    var valida = verifica_cpf_cnpj(valor);
    valor = valor.toString();
    valor = valor.replace(/[^0-9]/g, "");
    if (valida === "CPF") {
      if (valida_cpf(valor)) {
        formatado = valor.substr(0, 3) + ".";
        formatado += valor.substr(3, 3) + ".";
        formatado += valor.substr(6, 3) + "-";
        formatado += valor.substr(9, 2) + "";
      }
    } else if (valida === "CNPJ") {
      if (valida_cnpj(valor)) {
        formatado = valor.substr(0, 2) + ".";
        formatado += valor.substr(2, 3) + ".";
        formatado += valor.substr(5, 3) + "/";
        formatado += valor.substr(8, 4) + "-";
        formatado += valor.substr(12, 14) + "";
      }
    }
    return formatado;
  }

  function CPFCNPJMask(v) {
    if (v.replace(/[^\d]/g, "").length < 12) {
      v = v.replace(/\D/g, "");
      v = v.replace(/^(\d{3})(\d)/g, "$1.$2");
      v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
      v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})\/(\d{2})(\d)/, "$1.$2.$3-$4");
      return v.substring(0, 14);
    } else {
      v = v.replace(/\D/g, "");
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5");
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      return v.substring(0, 18);
    }
  }

  const onSubmit = async (data) => {
    if (valida_cpf_cnpj(data.cpfcnpj)) {
      data.cpfcnpj = data.cpfcnpj.replace(/[^\d]/g, "");
      data.avatar.base64 = profileImage;
      console.log(data);
      disabledButton();
      if (firstLogin) {
        const response = await axios({
          method: "POST",
          url: "/api/firstLogin",
          data,
        });
      }
      if (noCNPJ && !firstLogin) {
        const response = await axios({
          method: "POST",
          url: "/api/cnpjUpdate",
          data,
        });
      }

      enabledButton();
      window.location.replace("/");
    } else {
      alert("CNPJ/CPF inválido");
    }
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

  if (!session) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        {firstLogin && !noCNPJ && (
          <h1 className="text-4xl font-medium text-green-500">Criar Perfil</h1>
        )}

        {!firstLogin && noCNPJ && (
          <h1 className="text-4xl font-medium text-green-500">
            Completar Perfil
          </h1>
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
                            value: session?.user.name,
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
                            value: session?.user.email,
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

                {!firstLogin && noCNPJ && (
                  <div className="px-4 !pt-16 space-y-8 bg-white sm:p-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Preencha o CNPJ de sua empresa
                      </h3>
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
                            onChange={(event) => {
                              const { value } = event.target;
                              event.target.value = CPFCNPJMask(value);
                            }}
                            type="text"
                            name="cpfcnpj"
                            id="cpfcnpj"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
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
