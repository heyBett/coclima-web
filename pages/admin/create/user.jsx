import Notification from "../../../components/notifications";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import useSWR from "swr";

import { useRouter } from "next/router";

export default function Example() {
  const [profileImage, setProfileImage] = useState("/images/default_user.jpg");
  const [notification, setNotification] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data } = useSWR(`/api/admin/`, fetcher);
  const router = useRouter();

  const companies = data?.companies;
  const partners = data?.partners;
  const companiesAndPartners = companies?.concat(partners);
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
    console.log(data);
    const response = await axios({
      method: "POST",
      url: "/api/admin/user",
      data: {
        name: data.name,
        email: data.email,
        role: data.role,
        company: data.company,
        avatar: {
          base64: profileImage,
          filename: data.avatar[0]?.name,
          contentType: data.avatar[0]?.type,
          size: data.avatar[0]?.size,
        },
      },
    });
    if (response.data !== "Exists") {
      router.push("/admin/?tab=users");
    } else {
      enabledButton();
      setNotification(true);
      setTimeout(function () {
        setNotification(false);
      }, 3000);
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

  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>
      <Notification
        type={false}
        title={"Esse usuário já existe"}
        notification={notification}
      ></Notification>
      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">
          Criar novo Usuário
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
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Perfil
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
                          {...register("name")}
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Empresa/Partner
                      </label>
                      <div className="flex mt-1 rounded-md shadow-sm">
                        <select
                          {...register("company", { required: true })}
                          name="company"
                          id="company"
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                        >
                          {companiesAndPartners?.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-span-2 xl:col-span-1">
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
                          <option value="User">Usuário</option>
                          <option value="Admin">Administrador</option>
                        </select>
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
                          {...register("email")}
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
                          <img src={profileImage} />
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

            {/*     <form action="#" method="POST">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-6 space-y-6 bg-white sm:p-6">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Personal Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Use a permanent address where you can recieve mail.
                    </p>
                  </div>

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <input
                        type="text"
                        name="email-address"
                        id="email-address"
                        autoComplete="email"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street address
                      </label>
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>

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
