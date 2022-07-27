import Head from "next/head";
import Image from "next/image";
import Header from "../components/application-ui/headings/page-headings/with_actions_and_breadcrumbs_on_dark";
import Hello from "../components/application-ui/data-display/stats/with_brand_icon";
import Images from "../components/application-ui/lists/grid-lists/images_with_details";
import {
  TreeIcon,
  DollarIcon,
  CarbonIcon,
  PrimaryLogo,
} from "../components/vectors/custom";
import { useEffect } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = () => (
  <div>
    <img
      style={{ transform: "translateY(-50%)" }}
      src="/images/circledIcon.png"
    ></img>
  </div>
);

const defaultProps = {
  center: {
    lat: -23.014434852616468,
    lng: -43.44663240674625,
  },
  zoom: 0,
};

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
];

const handleApiLoaded = (map, maps) => {
  map.setMapTypeId("satellite");
};

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
      </Head>

      <div className="flex flex-col lg:flex-row lg:h-screen">
        <div className="z-10 overflow-scroll bg-green-500 lg:w-2/5 rounded-b-xl lg:rounded-bl-none lg:rounded-tr-xl 2xl:pb-20">
          <div className="m-6 sm:mx-10 sm:mt-10">
            <h1 className="text-4xl font-medium text-white">Meus Plantios</h1>
            <h2 className="mt-2 text-lg leading-6 text-gray-700 font-regular">
              Confira como estão as arvóres plantadas.
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

              <Images></Images>
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
              <AnyReactComponent
                lat={-23.014434852616468}
                lng={-43.44663240674625}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    </div>
  );
}
