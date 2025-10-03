import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { BadgeCheck } from "lucide-react";

export default function Modal({ message, onClose }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm">
      <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-2">
        {/* Success Icon */}
        <BadgeCheck className="text-green-600 flex-shrink-0" />

        {/* Message */}
        <p className="text-gray-800 font-semibold flex-1 text-sm sm:text-base">
          {message}
        </p>

        {/* Close (X) inline with text */}
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}
