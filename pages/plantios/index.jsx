import Head from "next/head";
import Image from "next/image";
import Header from "../../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../../components/application-ui/data-display/stats/with_brand_icon";
import Images from "../../components/application-ui/lists/grid-lists/images_with_details";
import {
  TreeIcon,
  DollarIcon,
  CarbonIcon,
  PrimaryLogo,
} from "../../components/vectors/custom";
import { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import useSWR from "swr";
import Loader from "../../components/loader";
const defaultProps = {
  center: {
    lat: -23.014434852616468,
    lng: -43.44663240674625,
  },
  zoom: 0,
};

const handleApiLoaded = (map, maps) => {
  map.setMapTypeId("satellite");
};

export default function Home(props) {
  const [test, setTest] = useState(true);
  const session = props.session;
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: dashboard } = useSWR("/api/views/dashboard", fetcher, {
    refreshInterval: 120000,
  });
  const { data } = useSWR("/api/views/plantations", fetcher, {
    refreshInterval: 120000,
  });
  const stats = [
    {
      id: 1,
      name: "Árvores Plantadas",
      stat: dashboard?.trees.toFixed(0),
      icon: TreeIcon,
      change: "122",
      changeType: "increase",
      preffix: "",
      suffix: "",
    },
    {
      id: 2,
      name: "Carbono Compensado",
      stat: (dashboard?.carbon / 1000).toFixed(2),
      icon: CarbonIcon,
      change: "5.4",
      changeType: "increase",
      preffix: "",
      suffix: "toneladas",
    },
  ];

  function isPlanted(item) {
    return item.planted;
  }

  function yourTrees(item) {
    return item.company_id === session.user.company_id;
  }

  const PlantationOf = (props) => {
    const items = props.items;
    return (
      items.plantation.handler
        .map((item) => item)
        .map((item) => item.value)
        .reduce((a, b) => a + b, 0) / items.plantation.tree_value
    ).toFixed(0);
  };

  const OfYours = (props) => {
    const items = props.items;
    return (
      items.plantation.handler
        .filter(yourTrees)
        .map((item) => item)
        .map((item) => item.value)
        .reduce((a, b) => a + b, 0) / items.plantation.tree_value
    ).toFixed(0);
  };

  const Pin = (items) => (
    <div
      className="flex flex-col items-center justify-center w-40 test"
      style={{ transform: "translate(-50%,-90%)" }}
    >
      <div className="px-2 py-1">
        <p className="px-2 py-1.5 text-center text-white bg-green-600 rounded-t-lg">
          Plantação de <PlantationOf items={items}></PlantationOf> Árvores
        </p>
        <p className="px-3 py-2 text-center text-green-600 bg-white rounded-b-lg">
          <span className="font-bold">
            <OfYours items={items}></OfYours> são suas!
          </span>
        </p>
      </div>
      <Image
        width={50}
        height={50}
        quality={100}
        className=""
        src="/images/circledIcon.png"
      ></Image>
    </div>
  );

  if (!data) {
    return <Loader></Loader>;
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <div
        className="flex flex-col lg:flex-row lg:h-screen"
        onClick={() => setTest(!test)}
      >
        <div className="z-10 overflow-scroll bg-green-500 lg:w-2/5 rounded-b-xl lg:rounded-bl-none lg:rounded-tr-xl 2xl:pb-20">
          <div className="m-6 sm:mx-10 sm:mt-10">
            <h1 className="text-4xl font-medium text-white">Meus Plantios</h1>
            <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
              Confira como estão as árvores plantadas.
            </h2>
            <dl className="grid grid-cols-1 gap-5 mt-10 2xl:-mx-6 2xl:grid-cols-2">
              {stats.map((item) => (
                <div
                  key={item.id}
                  className="relative px-4 py-5 overflow-hidden bg-white rounded-lg shadow sm:py-6 sm:px-6"
                >
                  <dt>
                    <div className="absolute p-2 rounded-md">
                      <item.icon
                        className="w-8 h-8 text-gray-800 fill-gray-800"
                        aria-hidden="true"
                        filled
                      />
                    </div>
                    <p className="ml-16 text-xs font-medium text-green-500 truncate">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="flex items-baseline ml-16 ">
                    <p className="text-2xl font-semibold text-green-500">
                      <span className="text-xs">{item.preffix}</span>
                      {item.stat}
                      <span className="text-sm"> {item.suffix}</span>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="">
              <div className="flex flex-row justify-between mt-10">
                <h2 className="text-2xl text-white">Fotos</h2>
                <h2 className="flex items-center px-4 py-1 text-xs font-medium text-green-500 uppercase bg-white rounded-full">
                  Ver Todas
                </h2>
              </div>

              <Images photos={data.photos}></Images>
            </div>
          </div>
          <div className="2xl:absolute  bottom-0 py-8 2xl:w-[calc(40%-5rem)]  px-10 bg-green-500 rounded-r-lg">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-2xl text-white">Dúvidas?</h2>
              <h2 className="flex items-center px-4 py-2 text-xs font-medium text-green-500 uppercase bg-white rounded-full">
                saber mais
              </h2>
            </div>
          </div>
        </div>
        <div className="lg:-ml-[6.666667%] -mt-[6.666667%]  lg:mt-0 bg-green-200 lg:w-4/6">
          <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_MAPS_KEY }}
              defaultCenter={defaultProps.center}
              defaultZoom={defaultProps.zoom}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
            >
              {data.plantations.filter(isPlanted).map((plantation) => (
                <Pin
                  key={plantation.id}
                  plantation={plantation}
                  lat={plantation.geolocation.lat}
                  lng={plantation.geolocation.lng}
                />
              ))}
            </GoogleMapReact>
          </div>
        </div>
      </div>
    </div>
  );
}
