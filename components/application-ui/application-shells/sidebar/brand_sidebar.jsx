import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  CogIcon,
  HomeIcon,
  MenuAlt2Icon,
  BriefcaseIcon,
  ViewGridIcon,
  XIcon,
  LogoutIcon,
  CashIcon,
} from "@heroicons/react/solid";
import {
  PrimaryLogo,
  AdminIcon,
  MarketingIcon,
  TreeIcon,
  DashboardIcon,
} from "../../../vectors/custom";
import { SearchIcon } from "@heroicons/react/solid";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
const userNavigation = [{ name: "Editar Perfil", href: "#" }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar(props) {
  const session = props.session;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [current, setCurrent] = useState("Dashboard");
  const [sidebarNavigation, setSidebarNavigation] = useState([
    {
      name: "Dashboard",
      href: "/",
      icon: DashboardIcon,
    },
    { name: "Plantio", href: "/plantios", icon: TreeIcon },
    {
      name: "Marketing",
      href: "/marketing",
      icon: MarketingIcon,
    },
    {
      name: "Recursos",
      href: "/recursos",
      icon: CashIcon,
      admin: true,
    },
    {
      name: "Administrativo",
      href: "/admin",
      icon: AdminIcon,
      admin: true,
    },
  ]);
  const children = props.children;

  useEffect(() => {
    CurrentNav(window.location.pathname);
  }, []);

  function CurrentNav(href) {
    setCurrent(href);
    sidebarNavigation.forEach((item) => {
      item.current = item.href === href;
    });
    setSidebarNavigation(sidebarNavigation);
  }

  function menuMobile(href) {
    CurrentNav(href);
    closeMobileMenu();
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    const elem = document.getElementsByClassName("modalMobile")[0];
    elem.parentNode.removeChild(elem);
  }
  return (
    <>
      <div className="flex h-full">
        {/* Narrow sidebar */}
        <div className="fixed z-10 hidden w-48 h-screen overflow-y-auto bg-white md:block">
          <div className="flex flex-col items-center w-full py-6">
            <div className="flex items-center flex-shrink-0">
              <Link href="/">
                <a className="flex flex-col items-center mt-4 max-w">
                  <PrimaryLogo className={"max-w-[9rem]"}></PrimaryLogo>
                </a>
              </Link>
            </div>
            <div className="flex-1 w-full pr-2 mt-6 space-y-1">
              {sidebarNavigation.map((item) => (
                <Link href={item.href} key={item.name}>
                  <a
                    onClick={() => CurrentNav(item.href)}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-green-100 text-green-500 font-bold"
                        : "text-green-500 hover:bg-green-500 hover:text-white font-regular",
                      "group w-full p-3 rounded-r-md flex items-center text-sm"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.current ? (
                      <item.icon
                        className="w-5 h-5 fill-green-500"
                        aria-hidden="true"
                        filled
                      />
                    ) : (
                      <item.icon
                        className="w-5 h-5 fill-green-500 group-hover:fill-white"
                        aria-hidden="true"
                      />
                    )}

                    <span className="ml-3">{item.name}</span>
                  </a>
                </Link>
              ))}

              <a
                className="cursor-pointer flex items-center w-full p-3 !mt-10 pt-10 text-sm text-gray-500 border-t border-gray-200 rounded-md hover:text-red-500 hover:font-bold font-regular group"
                onClick={() => signOut()}
              >
                <LogoutIcon
                  className="w-6 h-6 text-gray-500 group-hover:text-red-500"
                  aria-hidden="true"
                />
                <span className="ml-3">Sair</span>
              </a>
            </div>
            <div className="absolute bottom-0 flex flex-shrink-0 w-48 p-4 border-t border-gray-200">
              <a href="#" className="flex-shrink-0 block group">
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block w-10 h-10 rounded-full"
                      src={session?.user.image}
                      alt={session?.user.name}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="overflow-hidden text-sm font-medium text-gray-700 w-28 group-hover:text-gray-900 text-ellipsis whitespace-nowrap">
                      {session?.user.name}
                    </p>
                    <p className="text-xs font-medium text-green-500 group-hover:text-gray-700">
                      Editar Perfil
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}

        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="md:hidden modalMobile"
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-10 flex">
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-600 dark:bg-gray-800 !bg-opacity-75" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-white">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 p-1 top-1 -mr-14">
                      <button
                        type="button"
                        className="flex items-center justify-center w-12 h-12 rounded-full"
                        onClick={() => closeMobileMenu()}
                      >
                        <XIcon
                          className="w-6 h-6 text-white"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Close sidebar</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-col items-center flex-shrink-0 px-4 py-4">
                    <PrimaryLogo></PrimaryLogo>
                  </div>
                  <div className="flex-1 h-0 px-2 mt-5 overflow-y-auto">
                    <nav className="flex flex-col h-full">
                      <div className="space-y-1">
                        {sidebarNavigation.map((item) => (
                          <Link href={item.href} key={item.name}>
                            <a
                              onClick={() => menuMobile(item.href)}
                              className={classNames(
                                item.current
                                  ? "bg-green-100 text-green-500 font-bold"
                                  : "text-green-500 hover:bg-green-500 hover:text-white font-regular",
                                "group w-full p-3 rounded-r-md flex items-center text-sm"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.current ? (
                                <item.icon
                                  className="w-5 h-5 fill-green-500"
                                  aria-hidden="true"
                                  filled
                                />
                              ) : (
                                <item.icon
                                  className="w-5 h-5 fill-green-500 group-hover:fill-white"
                                  aria-hidden="true"
                                />
                              )}
                              <span className="ml-3">{item.name}</span>
                            </a>
                          </Link>
                        ))}

                        <a className="cursor-pointer flex items-center w-full p-3 !mt-10 pt-10 text-sm text-gray-500 border-t border-gray-200 hover:text-red-500 hover:font-bold font-regular group">
                          <LogoutIcon
                            className="w-6 h-6 text-gray-500 group-hover:text-red-500"
                            aria-hidden="true"
                          />
                          <span className="ml-3">Sair</span>
                        </a>
                      </div>
                    </nav>
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Content area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="w-full md:hidden md:z-10">
            <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b-2 border-green-500 shadow-sm">
              <button
                type="button"
                className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="w-6 h-6" aria-hidden="true" />
              </button>
              <div className="flex justify-between flex-1 px-4 sm:px-6">
                <div className="flex items-center justify-center flex-1">
                  <PrimaryLogo></PrimaryLogo>
                </div>
                <div className="flex items-center ml-2 space-x-4 sm:ml-6 sm:space-x-6">
                  {/* Profile dropdown */}

                  <Menu as="div" className="relative flex-shrink-0">
                    <div>
                      <Menu.Button className="flex text-sm rounded-full">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={session?.user.image}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link href={item.href}>
                                <a
                                  className={classNames(
                                    active ? "bg-gray-100 " : "",
                                    "block px-4 py-2 text-sm text-gray-700 "
                                  )}
                                >
                                  {item.name}
                                </a>
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                        <Menu.Item>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Sair
                          </a>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/*} <button
                    type="button"
                    className="flex bg-rose-600 p-1 rounded-full items-center justify-center text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose`-500"
                  >
                    <PlusSmIcon className="w-6 h-6" aria-hidden="true" />
                    <span className="sr-only">Add file</span>
                                </button> */}
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="ContentContainer">
            {React.cloneElement(children, {
              status: "status",
              session: session,
              theme: "theme",
            })}
          </div>
        </div>
      </div>
    </>
  );
}
