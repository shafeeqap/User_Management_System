import { MdClose } from "react-icons/md";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      // onClick={onClose}
    >
      <div
        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        // onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div onClick={onClose} className="flex justify-end">
            <div className="rounded-full hover:bg-slate-200 p-1">
              <MdClose className="text-black text-2xl cursor-pointer" />
            </div>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mr-4 sm:mt-0 sm:text-left py-2 w-full">
              <h1
                className="text-xl font-bold leading-6 text-gray-900"
                id="modal-title"
              >
                {title}
              </h1>
              <div className="mt-10">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
