"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// A simple modal component which can be shown/hidden with a boolean and a function
// Because of the setIsModalOpen function, you can't use it in a server component.
const Modal = ({ isModalOpen, setIsModalOpen }) => {
  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full overflow-hidden items-start md:items-center justify-center p-2">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl h-full overflow-visible transform text-left align-middle shadow-2xl transition-all rounded-2xl bg-white dark:bg-slate-900 p-6 md:p-8 border border-black/5 dark:border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h2" className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                    I&apos;m a modal
                  </Dialog.Title>
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>

                <section className="text-slate-600 dark:text-slate-400 font-medium">And here is my content</section>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;