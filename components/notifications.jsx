/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useEffect } from "react";

export default function Example(props) {
  const [show, setShow] = useState(false);
  const notification = props.notification;
  const type = props.type;
  const message = props.message;
  const title = props.title;

  useEffect(() => {
    setShow(notification);
  }, [notification]);

  let customClass = "";

  if (type) {
    customClass = "bg-green-800";
  } else {
    customClass = "bg-red-800";
  }

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="fixed inset-0 flex items-end px-4 py-6 mt-24 pointer-events-none sm:p-6 sm:items-start"
      >
        <div className="flex flex-col items-center w-full space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={
                "w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-lg pointer-events-auto  ring-1 ring-green-400 ring-opacity-5 " +
                customClass
              }
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 ">
                    {type ? (
                      <CheckCircleIcon
                        className="w-6 h-6 text-green-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircleIcon
                        className="w-6 h-6 text-red-600 "
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div className="ml-5 w-0 flex-1 pt-0.5">
                    <p className="font-medium text-white text-md ">{title}</p>
                    <p className="mt-1 text-sm text-green-400 ">{message}</p>
                  </div>
                  <div className="flex flex-shrink-0 ml-4">
                    <button
                      className="inline-flex text-white hover:text-red-600"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
