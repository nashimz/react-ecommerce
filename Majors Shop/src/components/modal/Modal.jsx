import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { BadgeCheck } from "lucide-react";

export default function Modal({ message, onClose }) {
  return (
    <div className="fixed bottom-4 left-1/2 sm:left-4 -translate-x-1/2 sm:translate-x-0 z-50 w-[calc(100%-1rem)] sm:w-auto sm:max-w-sm">
      <div className="bg-black rounded-2xl shadow-xl p-4 flex items-center gap-2 font-figtree">
        <BadgeCheck className="text-green-600 flex-shrink-0" />
        <p className="text-white flex-1 text-sm sm:text-base font-bold">
          {message}
        </p>
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}
