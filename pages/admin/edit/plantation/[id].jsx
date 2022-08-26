import { XIcon } from "@heroicons/react/outline";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Select from "react-select";
import { useRouter } from "next/router";
import { IMaskInput } from "react-imask";
import Resizer from "react-image-file-resizer";
import Loader from "../../../../components/loader";
import { addBusinessDays, format, parseISO, parse } from "date-fns";

export default function Example() {
  const [photos, setPhotos] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [cost, setCost] = useState("25");
  const [applied, setApplied] = useState(false);

  const router = useRouter();
  const id = router.query.id;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const url = "/api/admin/plantation?id=" + id;
  const { data: request } = useSWR(url, fetcher);
  const { data } = useSWR(`/api/admin/`, fetcher);
  const { register, handleSubmit, getValues, setValue, unregister, watch } =
    useForm();

  const plantation = request?.plantation;
  const handlers = request?.handler;

  /* const filteredHandlers = [].concat.apply(
    [],
    selectedCompanies.map((item) => item.handler.filter(fromThisPlantation))
  ); */

  /*   function fromThisPlantation(item) {
    return item.plantation_id === id;
  } */

  useEffect(() => {
    if (handlers) {
      setSelectedCompanies(handlers?.map((item) => item.company));
    }
  }, [plantation]);

  function returnIndex(company) {
    const indexOf = data?.companies.findIndex(findIt);
    function findIt(item) {
      if (company !== undefined) {
        return company === item.id;
      }
    }
    if (indexOf !== -1) {
      return indexOf;
    }
  }

  /*   useEffect(() => {
    console.log("Values:", getValues("companyData"));
    setValue(
      "totalDisponível",
      getValues("companyData")
        ?.map((item) => parseFloat(item.avaibleValue))
        .reduce((a, b) => a + b)
    );
    setValue(
      "totalUtilizado",
      getValues("companyData")
        ?.map((item) => parseFloat(item.value))
        .reduce((a, b) => a + b)
    );
    setValue(
      "totalArvores",
      getValues("companyData")
        ?.map((item) => parseFloat(item.treeQuantity))
        .reduce((a, b) => a + b)
    ); 
  }, [selectedCompanies]); */

  /*  const groupedOptions = [
    {
      label: "Empresas",
      options: data?.companies,
    },
  ]; */

  useEffect(() => {
    setValue("partner", plantation?.partner_id);
  }, [data]);

  /* useEffect(() => {
    if (!applied) {
      if (filteredHandlers.length !== 0) {
        filteredHandlers.map((item, index) => applySelectedTrees(item, index));

        function applySelectedTrees(item, index) {
          const value = item.value;
          const trees = item.value / plantation?.tree_value;

          setValue(
            "companyData[" + returnIndex(item.company_id) + "].treeQuantity",
            trees
          );
          setValue(
            "companyData[" + returnIndex(item.company_id) + "].value",
            parseInt(
              getValues(
                "companyData[" + returnIndex(item.company_id) + "].treeQuantity"
              ),
              10
            ) * parseInt(cost, 10)
          );
          if (item.value === []) {
            console.log("tá vazio");
          }
        }
        setApplied(true);
        setCost(plantation?.tree_value);
      }
    }
  }, [filteredHandlers]); */

  /* useEffect(() => {
    if (applied) {
      selectedCompanies.map((company, index) => {
        console.log(company.id);
        setValue(
          "companyData[" + returnIndex(company.id) + "].treeQuantity",
          getValues("companyData[" + returnIndex(company.id) + "].treeQuantity")
        );

        setValue(
          "companyData[" + returnIndex(company.id) + "].value",

          parseInt(
            getValues(
              "companyData[" + returnIndex(company.id) + "].treeQuantity"
            ),
            10
          ) * parseInt(cost, 10)
        );
        setValue(
          "companyData[" + returnIndex(company.id) + "].avaibleValue",

          "R$ " +
            (
              (company.receipts
                ?.map((item) => item)
                .map((item) => item.value)
                .reduce((a, b) => a + b, 0) /
                10000) *
                parseInt(company.percentage, 10) -
              company.handler
                .map((item) => item)
                .map((item) => item.value)
                .reduce((a, b) => a + b, 0) -
              parseInt(
                getValues(
                  "companyData[" + returnIndex(company.id) + "].treeQuantity"
                ),
                10
              ) *
                parseInt(cost, 10)
            ).toFixed(2)
        );
      });
    }
  }, [cost]); */

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

  function isSelected(item) {
    return (
      selectedCompanies.some((company) => item.id === company.id) &&
      parseInt(item.treeQuantity, 10) > 0 &&
      item.value > 0
    );
  }

  const onSubmit = async (data) => {
    data.photos = photos;

    disabledButton();
    if (data.companyData === undefined) {
      alert("Escolha ao menos uma empresa");
    } else {
      const response = await axios({
        method: "POST",
        url: "/api/admin/plantation",
        data: {
          handler: data.companyData.filter(isSelected),
          photos: data.photos,
          partner: data.partner,
          date: parse(data.date, "yyyy-MM-dd", new Date()),
          planted: Boolean(data.planted === "true"),
          tree_cost: parseInt(data.tree_cost, 10),
          description: data.description,
          observations: data.observations,
          geolocation: {
            lat: parseFloat(data.latitude),
            lng: parseFloat(data.longitude),
          },
          external: data.external,
        },
      });
    }
    enabledButton();
    /*  setPhotos([]);
    setSelectedCompanies([]);
    setCost("25");
    reset(); */
    /*  router.push("/admin?tab=plantations"); */
  };

  useEffect(() => {
    console.log(photos);
  }, [photos]);

  async function handleFile(event) {
    [...event.target.files].map(async (file) => {
      if (
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/gif" ||
        file.type === "image/webp" ||
        file.type === "image/jpeg"
      ) {
        const base64 = await convertBase64(file);
        const thumbnail = await makeThumbnail(file);
        const blur = await makeBlur(file);
        const social = await makeSocial(file);

        const photo = {
          data: base64,
          thumbnail: thumbnail,
          blur: blur,
          social: social,
          filename: file.name,
          contentType: file.type,
          size: file.size,
        };
        setPhotos((photos) => [...photos, photo]);
      }
    });
  }

  const makeSocial = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000,
        1000,
        "WEBP",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const makeThumbnail = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        200,
        200,
        "WEBP",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const makeBlur = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        25,
        25,
        "WEBP",
        90,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

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

  function removeAsset(item) {
    setPhotos((photos) => photos.filter((photo) => photo.data !== item.data));
  }

  if (!plantation || !handlers) {
    return <Loader></Loader>;
  }

  if (plantation) {
    return (
      <div>
        <Head>
          <title>Dashboard | Coclima</title>
        </Head>

        <main className="m-6 sm:mx-10 sm:mt-10">
          <h1 className="text-4xl font-medium text-green-500">
            Criar novo Plantio
          </h1>
          <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
            Construa um mundo melhor!
          </h2>
          <div className="mt-10"></div>
          <div className="lg:grid lg:gap-x-5">
            <div className="space-y-6 sm:px-6 lg:px-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-6 space-y-8 bg-white sm:p-6">
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Informações do plantio
                      </h3>
                    </div>

                    <div className="grid grid-cols-12 gap-4 ">
                      <div className="col-span-12 md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Parceiro
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <select
                            {...register("partner", {
                              value: plantation?.partner_id,
                            })}
                            name="partner"
                            id="partner"
                            defaultValue={data?.partners[0].id}
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          >
                            {data?.partners.map((partner) => (
                              <option key={partner.id} value={partner.id}>
                                {partner.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <select
                            {...register("planted", {
                              value: plantation.planted.toString(),
                            })}
                            name="planted"
                            id="planted"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          >
                            <option value={false}>Pendente</option>
                            <option value={true}>Concluída</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-span-12 sm:col-span-4">
                        <div className="flex flex-row justify-between">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Custo/Árvore (R$)
                          </label>
                        </div>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <input
                            {...register("tree_cost", {
                              value: plantation?.tree_value,
                            })}
                            disabled
                            defaultValue={cost}
                            type="number"
                            name={"tree_cost"}
                            id={"tree_cost"}
                            className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Descrição
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <textarea
                            {...register("description", {
                              value: plantation?.description,
                            })}
                            rows={5}
                            placeholder="Essa informação será mostrada para o usuário."
                            name="description"
                            id="description"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <label
                          htmlFor="company-website"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Observações
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <textarea
                            {...register("observations", {
                              value: plantation?.observations,
                            })}
                            rows={5}
                            placeholder="Observações internas"
                            name="observations"
                            id="observations"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Latitude
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <input
                            {...register("latitude", {
                              value: plantation?.geolocation.lat,
                            })}
                            step="any"
                            type="number"
                            name="latitude"
                            id="latitude"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Longitude
                        </label>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <input
                            {...register("longitude", {
                              value: plantation?.geolocation.lon,
                            })}
                            step="any"
                            type="number"
                            name="longitude"
                            id="longitude"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-12 sm:col-span-3">
                        <div className="flex flex-row justify-between">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Link Externo
                          </label>
                        </div>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <input
                            {...register("external", {
                              value: plantation?.external,
                            })}
                            type="text"
                            name="external"
                            id="external"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      <div className="col-span-12 sm:col-span-3">
                        <div className="flex flex-row justify-between">
                          <label
                            htmlFor="company-website"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Data
                          </label>
                        </div>
                        <div className="flex mt-1 rounded-md shadow-sm">
                          <input
                            required
                            {...register("date", {
                              value: format(
                                parseISO(plantation?.date),
                                "yyyy-MM-dd"
                              ),
                            })}
                            type="date"
                            name="date"
                            id="date"
                            className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Fotografias do plantio
                      </h3>
                    </div>
                    <div>
                      {" "}
                      <div className="col-span-4 ">
                        <div className="flex flex-col mt-1">
                          <label className="py-3 text-sm font-medium leading-4 text-center text-white bg-green-600 border rounded-md shadow-sm cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <input
                              type="file"
                              className="sr-only"
                              name="files[]"
                              onChange={(e) => handleFile(e)}
                              accept="image/*"
                              multiple
                            />
                            Adicionar Imagens
                          </label>
                          <div className="mt-4 space-x-2">
                            {photos.map((photo) => (
                              <span
                                key={photo.data}
                                className="inline-block w-24 h-24 overflow-hidden bg-gray-100 rounded-lg test2"
                              >
                                <div className="absolute flex justify-end w-24 text-black">
                                  <XIcon
                                    onClick={() => removeAsset(photo)}
                                    className="w-5 p-1 mt-1 mr-1 text-center text-red-500 bg-white bg-opacity-50 rounded-full cursor-pointer aspect-1"
                                  ></XIcon>
                                </div>
                                <img
                                  className="object-cover bg-black aspect-1"
                                  src={photo.data}
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Empresas participantes
                      </h3>
                    </div>

                    {handlers && (
                      <div>
                        <div className="flex flex-col">
                          <div className="py-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full align-middle md:px-6 lg:px-8">
                              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th
                                        role="col"
                                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                      >
                                        Nome
                                      </th>

                                      <th
                                        role="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Carbono Utilizado
                                      </th>
                                      <th
                                        role="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                      >
                                        Árvores Plantadas
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {handlers.map((item) => (
                                      <tr key={item.company.id}>
                                        <td className="py-4 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-6">
                                          <div className="flex items-center">
                                            <div className="font-medium text-gray-900">
                                              {item.company.name}
                                            </div>
                                          </div>
                                        </td>

                                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          <div className="text-gray-500">
                                            R$ {item.value.toFixed(2)}
                                          </div>
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          <div className="text-gray-500">
                                            {(
                                              item.value / plantation.tree_value
                                            ).toFixed(2)}
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                    <tr>
                                      <td className="py-4 pl-4 pr-3 text-sm bg-green-600 whitespace-nowrap sm:pl-6">
                                        <div className="flex items-center">
                                          <div className="font-medium text-white">
                                            Total
                                          </div>
                                        </div>
                                      </td>

                                      <td className="px-3 py-4 text-sm bg-green-600 whitespace-nowrap">
                                        <div className="text-gray-100">
                                          R${" "}
                                          {request?.handler
                                            .map((item) => item.value)
                                            .reduce((a, b) => a + b)
                                            .toFixed(2)}
                                        </div>
                                      </td>
                                      <td className="px-3 py-4 text-sm bg-green-600 whitespace-nowrap">
                                        <div className="text-gray-100">
                                          {request?.handler
                                            .map((item) =>
                                              parseFloat(
                                                item.value /
                                                  plantation.tree_value
                                              )
                                            )
                                            .reduce((a, b) => a + b)}
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* {data?.companies !== undefined && (
                      <Select
                        theme={(theme) => ({
                          ...theme,
                          borderRadius: 7,
                          /*  groupHeading: "#0F172A", */
                    /* colors: {
                        ...theme.colors,
                        primary25: "#0F172A",
                        primary: "#0F172A",
                        dangerLight: "white",
                        neutral0: "#0F172A",
                        neutral5: "#334155",
                        neutral20: "#334155",
                        neutral40: "#E11D48",
                        neutral80: "white",
                        neutral90: "white",
                        neutral10: "#1E293B",
                      }, 
                        })}
                        value={selectedCompanies}
                        noOptionsMessage={() => "Nenhuma empresa encontrada"}
                        loadingMessage={() => "Carregando..."}
                        placeholder="Selecione empresas participantes"
                        id="selectUser"
                        className="!text-black dark:!text-white"
                        getOptionValue={(option) => `${option.id}`}
                        getOptionLabel={(option) => `${option.name}`}
                        inputClassName="bg-red-600 "
                        onChange={setSelectedCompanies}
                        options={groupedOptions}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        isClearable
                        isMulti
                        isSearchable
                      />
                    )} */}
                    {/*  <div className="-mx-4 sm:-mx-6">
                      {selectedCompanies.length > 0 &&
                        selectedCompanies.map((company, index) => (
                          <div
                            key={company.id}
                            className="flex flex-col justify-between px-4 py-6 space-x-0 space-y-4 sm:px-6 even:bg-green-100 md:space-x-4 md:space-y-0 md:flex-row"
                          >
                            <div className="col-span-12 md:col-span-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Empresa
                              </label>
                              <div className="flex mt-1 rounded-md shadow-sm">
                                <input
                                  value={company.name}
                                  disabled
                                  type="text"
                                  className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                                <input
                                  {...register(
                                    "companyData[" +
                                      returnIndex(company.id) +
                                      "].id",
                                    {
                                      value: company.id,
                                      shouldUnregister: true,
                                    }
                                  )}
                                  name={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].id"
                                  }
                                  id={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].id"
                                  }
                                  disabled
                                  type="text"
                                  className="flex-grow hidden w-full min-w-0 bg-gray-200 border-gray-300 rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Valor Disponível
                              </label>
                              <div className="flex mt-1 rounded-md shadow-sm">
                                <span className="w-12">
                                  <input
                                    type="text"
                                    id="rs1"
                                    name="rs1"
                                    disabled
                                    value={" R$ "}
                                    className="block text-white bg-green-600 min-w-1 rounded-l-md sm:text-sm"
                                  ></input>
                                </span>
                                <input
                                  {...register(
                                    "companyData[" +
                                      returnIndex(company.id) +
                                      "].avaibleValue",
                                    {
                                      value: (
                                        (company.receipts
                                          .map((item) => item)
                                          .map((item) => item.value)
                                          .reduce((a, b) => a + b, 0) /
                                          10000) *
                                          parseInt(company.percentage, 10) -
                                        company.handler
                                          .map((item) => item)
                                          .map((item) => item.value)
                                          .reduce((a, b) => a + b, 0)
                                      ).toFixed(2),
                                      shouldUnregister: true,
                                    }
                                  )}
                                  /* {...register(
                                  "companyData[" + index + "].avaibleValue",
                                  {
                                    value: (
                                      (company.receipts
                                        .map((item) => item)
                                        .map((item) => item.value)
                                        .reduce((a, b) => a + b, 0) /
                                        10000) *
                                        parseInt(company.percentage, 10) -
                                      company.handler
                                        .map((item) => item)
                                        .map((item) => item.value)
                                        .reduce((a, b) => a + b, 0)
                                    ).toFixed(2),
                                    shouldUnregister: true,
                                  }
                                )} 

                                  id={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].avaibleValue"
                                  }
                                  name={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].avaibleValue"
                                  }
                                  disabled
                                  type="number"
                                  className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <div className="col-span-12 md:col-span-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Valor Utilizado
                              </label>
                              <div className="flex mt-1 rounded-md shadow-sm">
                                <span className="w-12">
                                  <input
                                    type="text"
                                    id="rs"
                                    name="rs"
                                    disabled
                                    value={" R$ "}
                                    className="block text-white bg-green-600 min-w-1 rounded-l-md sm:text-sm"
                                  ></input>
                                </span>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="hidden"
                                  id={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].value"
                                  }
                                  name={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].value"
                                  }
                                  {...register(
                                    "companyData[" +
                                      returnIndex(company.id) +
                                      "].value",
                                    {
                                      shouldUnregister: true,
                                      value: (
                                        (company.receipts
                                          .map((item) => item)
                                          .map((item) => item.value)
                                          .reduce((a, b) => a + b, 0) /
                                          10000) *
                                          parseInt(company.percentage, 10) -
                                        company.handler
                                          .map((item) => item)
                                          .map((item) => item.value)
                                          .reduce((a, b) => a + b, 0)
                                      ).toFixed(2),
                                    }
                                  )}
                                ></input>
                                <IMaskInput
                                  mask={Number}
                                  radix="."
                                  scale={2}
                                  signed={false}
                                  key={company.id}
                                  padFractionalZeros={true}
                                  normalizeZeros={false}
                                  step="any"
                                  unmask={false} // true|false|'typed'
                                  defaultValue={(
                                    (company.receipts
                                      .map((item) => item)
                                      .map((item) => item.value)
                                      .reduce((a, b) => a + b, 0) /
                                      10000) *
                                      parseInt(company.percentage, 10) -
                                    company.handler
                                      .map((item) => item)
                                      .map((item) => item.value)
                                      .reduce((a, b) => a + b, 0)
                                  ).toFixed(2)}
                                  max={parseFloat(
                                    (company.receipts
                                      .map((item) => item)
                                      .map((item) => item.value)
                                      .reduce((a, b) => a + b, 0) /
                                      10000) *
                                      parseInt(company.percentage, 10) -
                                      company.handler
                                        .map((item) => item)
                                        .map((item) => item.value)
                                        .reduce((a, b) => a + b, 0)
                                  ).toFixed(2)}
                                  // DO NOT USE onChange TO HANDLE CHANGES!
                                  // USE onAccept INSTEAD
                                  onAccept={
                                    // depending on prop above first argument is
                                    // `value` if `unmask=false`,
                                    // `unmaskedValue` if `unmask=true`,
                                    // `typedValue` if `unmask='typed'`

                                    (value, mask) => {
                                      setValue(
                                        "companyData[" +
                                          returnIndex(company.id) +
                                          "].value",
                                        value
                                      );

                                      setValue(
                                        "companyData[" +
                                          returnIndex(company.id) +
                                          "].treeQuantity",
                                        (
                                          parseInt(
                                            getValues(
                                              "companyData[" +
                                                returnIndex(company.id) +
                                                "].value"
                                            ),
                                            10
                                          ) / parseInt(cost, 10)
                                        ).toFixed(2)
                                      );
                                      setValue(
                                        "totalDisponível",
                                        getValues("companyData")
                                          ?.map((item) =>
                                            parseFloat(item.avaibleValue)
                                          )
                                          .reduce((a, b) => a + b)
                                          .toFixed(2)
                                      );
                                      setValue(
                                        "totalUtilizado",
                                        getValues("companyData")
                                          ?.map((item) =>
                                            parseFloat(item.value)
                                          )
                                          .reduce((a, b) => a + b)
                                          .toFixed(2)
                                      );
                                      setValue(
                                        "totalArvores",
                                        getValues("companyData")
                                          ?.map((item) =>
                                            parseFloat(item.treeQuantity)
                                          )
                                          .reduce((a, b) => a + b)
                                          .toFixed(2)
                                      );
                                    }
                                  }
                                  // ...and more mask props in a guide

                                  // input props also available

                                  type="number"
                                  name={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].value"
                                  }
                                  id={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].value"
                                  }
                                  className="flex-grow block w-full min-w-0 border-gray-300 rounded-r-md sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="col-span-12 md:col-span-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Número de Árvores
                              </label>
                              <div className="flex mt-1 rounded-md shadow-sm">
                                <input
                                  {...register(
                                    "companyData[" +
                                      returnIndex(company.id) +
                                      "].treeQuantity",
                                    {
                                      value: (
                                        ((company.receipts
                                          .map((item) => item)
                                          .map((item) => item.value)
                                          .reduce((a, b) => a + b, 0) /
                                          10000) *
                                          parseInt(company.percentage, 10) -
                                          company.handler
                                            .map((item) => item)
                                            .map((item) => item.value)
                                            .reduce((a, b) => a + b, 0)) /
                                        parseInt(cost, 10)
                                      ).toFixed(2),
                                      shouldUnregister: true,
                                    }
                                  )}
                                  disabled
                                  key={company.id}
                                  min={0}
                                  type="number"
                                  /* onChange={(e) => {
                                  setValue(
                                    "companyData[" + index + "].value",

                                    parseInt(e.target.value, 10) *
                                      parseInt(cost, 10)
                                  );  setValue(
                                    "companyData[" + index + "].avaibleValue",

                                    "R$ " +
                                      (
                                        (
                                          (company.receipts
                                            .map((item) => item)
                                            .map((item) => item.value)
                                            .reduce((a, b) => a + b, 0) /
                                            10000) *
                                          parseInt(company.percentage, 10)
                                        ).toFixed(2) -
                                        company.handler
                                          .map((item) => item)
                                          .map((item) => item.value)
                                          .reduce((a, b) => a + b, 0)
                                          .toFixed(2) -
                                        parseInt(e.target.value, 10) *
                                          parseInt(cost, 10)
                                      ).toFixed(2)
                                  );
                                }} 
                                  name={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].treeQuantity"
                                  }
                                  id={
                                    "companyData[" +
                                    returnIndex(company.id) +
                                    "].treeQuantity"
                                  }
                                  className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      {selectedCompanies.length > 0 && (
                        <div className="flex flex-col justify-between px-4 py-6 space-x-0 space-y-4 sm:px-6 even:bg-green-100 md:space-x-4 md:space-y-0 md:flex-row">
                          <div className="col-span-12 md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 opacity-0">
                              Totais
                            </label>
                            <div className="flex mt-1 rounded-md">
                              <input
                                disabled
                                type="text"
                                value={"Totais:"}
                                className="flex-grow block w-full min-w-0 font-semibold text-center text-white bg-green-600 border-0 rounded-md sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Total Disponível
                            </label>
                            <div className="flex mt-1 rounded-md shadow-sm">
                              <span className="w-12">
                                <input
                                  type="text"
                                  id="rs1"
                                  name="rs1"
                                  disabled
                                  value={" R$ "}
                                  className="block text-white bg-green-600 min-w-1 rounded-l-md sm:text-sm"
                                ></input>
                              </span>
                              {/*  {getValues("companyData") !== undefined && (
                                <input
                                  {...register("totalDisponível", {
                                    value: getValues("companyData")
                                      .map((item) =>
                                        parseFloat(item.avaibleValue)
                                      )
                                      .reduce((a, b) => a + b),
                                  })}
                                  disabled
                                  type="text"
                                  className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                />
                              )} 
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Total Utilizado
                            </label>
                            <div className="flex mt-1 rounded-md shadow-sm">
                              <span className="w-12">
                                <input
                                  type="text"
                                  id="rs"
                                  name="rs"
                                  disabled
                                  value={" R$ "}
                                  className="block text-white bg-green-600 min-w-1 rounded-l-md sm:text-sm"
                                ></input>
                              </span>
                              {/* <input
                                {...register("totalUtilizado", {
                                  value: getValues("companyData")
                                    .map((item) => parseFloat(item.value))
                                    .reduce((a, b) => a + b),
                                })}
                                disabled
                                type="text"
                                className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-r-md sm:text-sm"
                              /> 
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Total de Árvores
                            </label>
                            <div className="flex mt-1 rounded-md shadow-sm">
                              {/*  <input
                                {...register("totalArvores", {
                                  value: getValues("companyData")
                                    .map((item) =>
                                      parseFloat(item.treeQuantity)
                                    )
                                    .reduce((a, b) => a + b),
                                })}
                                disabled
                                type="text"
                                className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              /> 
                            </div>
                          </div>
                        </div>
                      )}
                    </div> */}
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
            </div>
          </div>
        </main>
      </div>
    );
  }
}
