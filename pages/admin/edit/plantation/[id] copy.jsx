import { XIcon } from "@heroicons/react/outline";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import Select from "react-select";
import { useRouter } from "next/router";
import Loader from "../../../../components/loader";
import { addBusinessDays, format, parseISO, parse } from "date-fns";

export default function Example() {
  const [photos, setPhotos] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [cost, setCost] = useState("25");
  const [applied, setApplied] = useState(false);

  function handleCompanies(selectedOption) {
    setSelectedCompanies(selectedOption);
  }
  const router = useRouter();
  const id = router.query.id;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const url = "/api/admin/plantation?id=" + id;
  const { data: request } = useSWR(url, fetcher);
  const { data } = useSWR(`/api/admin/`, fetcher);
  const { register, handleSubmit, reset, getValues, setValue } = useForm();

  const handlers = request?.handler;
  const plantation = request?.plantation;

  const filteredHandlers = [].concat.apply(
    [],
    selectedCompanies.map((item) => item.handler.filter(fromThisPlantation))
  );

  function fromThisPlantation(item) {
    return item.plantation_id === id;
  }

  useEffect(() => {
    if (handlers) {
      setSelectedCompanies(handlers?.map((item) => item.company));
    }
  }, [plantation]);

  useEffect(() => {
    if (!applied) {
      const converted = plantation?.archives.map((file) =>
        setPhotos((photos) => [...photos, fileConvert(file)])
      );
    }
  }, [plantation]);

  function fileConvert(file) {
    return {
      contentType: file.type,
      data: file.data,
      filename: file.name,
      size: 0,
    };
  }

  const groupedOptions = [
    {
      label: "Empresas",
      options: data?.companies,
    },
  ];

  useEffect(() => {
    setValue("partner", plantation?.partner_id);
  }, [data]);

  useEffect(() => {
    if (!applied) {
      if (filteredHandlers.length !== 0) {
        filteredHandlers.map((item, index) => applySelectedTrees(item, index));

        function applySelectedTrees(item, index) {
          const value = item.value;
          const trees = item.value / plantation?.tree_value;
          setValue("companyData[" + index + "].treeQuantity", trees);
          setValue(
            "companyData[" + index + "].value",
            parseInt(getValues("companyData[" + index + "].treeQuantity"), 10) *
              parseInt(cost, 10)
          );
          if (item.value === []) {
            console.log("tá vazio");
          }
        }
        setApplied(true);
        setCost(plantation?.tree_value);
      }
    }
  }, [filteredHandlers]);

  useEffect(() => {
    if (applied) {
      selectedCompanies.map((company, index) => {
        setValue(
          "companyData[" + index + "].treeQuantity",
          getValues("companyData[" + index + "].treeQuantity")
        );

        setValue(
          "companyData[" + index + "].value",

          parseInt(getValues("companyData[" + index + "].treeQuantity"), 10) *
            parseInt(cost, 10)
        );
        setValue(
          "companyData[" + index + "].avaibleValue",

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
                getValues("companyData[" + index + "].treeQuantity"),
                10
              ) *
                parseInt(cost, 10)
            ).toFixed(2)
        );
      });
    }
  }, [cost]);

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
        method: "PATCH",
        url: "/api/admin/plantation?id=" + id,
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
  };

  async function handleFile(event) {
    [...event.target.files].map(async (file) => {
      const base64 = await convertBase64(file);
      const photo = {
        data: base64,
        filename: file.name,
        contentType: file.type,
        size: file.size,
      };
      if (photo.size > 2000000) {
        alert("Tamanho máximo de arquivo: 2MB");
      } else setPhotos((photos) => [...photos, photo]);
    });
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

  function removeAsset(item) {
    setPhotos((photos) => photos.filter((photo) => photo.data !== item.data));
  }

  if (!plantation) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <Head>
        <title>Dashboard | Coclima</title>
      </Head>

      <main className="m-6 sm:mx-10 sm:mt-10">
        <h1 className="text-4xl font-medium text-green-500">Editar Plantio</h1>
        {/*   <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
          Construa um mundo melhor!
        </h2> */}
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
                            value: plantation.partner_id,
                          })}
                          name="partner"
                          id="partner"
                          defaultValue={plantation.partner_id}
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
                          <option value={"false"}>Pendente</option>
                          <option value={"true"}>Concluída</option>
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
                          min={1}
                          defaultValue={cost}
                          type="number"
                          onChange={(e) => {
                            setCost(e.target.value);
                          }}
                          name={"tree_cost"}
                          id={"tree_cost"}
                          className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                            value: plantation?.geolocation.lng,
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

                  {data?.companies !== undefined && (
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
                      }, */
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
                      onChange={handleCompanies}
                      options={groupedOptions}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      isClearable
                      isMulti
                      isSearchable
                    />
                  )}
                  <div className="-mx-4 sm:-mx-6">
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
                                {...register("companyData[" + index + "].id", {
                                  value: company.id,
                                })}
                                name={"companyData[" + index + "].id"}
                                id={"companyData[" + index + "].id"}
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
                                  "companyData[" + index + "].avaibleValue"
                                )}
                                id={"companyData[" + index + "].avaibleValue"}
                                name={"companyData[" + index + "].avaibleValue"}
                                disabled
                                type="text"
                                className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                                  "companyData[" + index + "].treeQuantity"
                                )}
                                defaultValue={0}
                                min={0}
                                type="number"
                                onChange={(e) => {
                                  setValue(
                                    "companyData[" + index + "].value",

                                    parseInt(e.target.value, 10) *
                                      parseInt(cost, 10)
                                  );
                                  setValue(
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
                                name={"companyData[" + index + "].treeQuantity"}
                                id={"companyData[" + index + "].treeQuantity"}
                                className="flex-grow block w-full min-w-0 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              />
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">
                              Custo
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
                                /* disabled */
                                {...register(
                                  "companyData[" + index + "].value"
                                )}
                                disabled
                                name={"companyData[" + index + "].value"}
                                id={"companyData[" + index + "].value"}
                                type="text"
                                className="flex-grow block w-full min-w-0 bg-gray-200 border-gray-300 rounded-r-md focus:ring-green-500 focus:border-green-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
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
          </div>
        </div>
      </main>
    </div>
  );
}
