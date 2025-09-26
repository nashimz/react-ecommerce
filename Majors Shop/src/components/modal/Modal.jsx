import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Modal({ message, onClose }) {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative bg-white rounded-2xl shadow-xl p-4 w-96 flex items-center gap-3">
        {/* Success Icon */}
        <FontAwesomeIcon icon={faCheck} className="text-green-600 text-lg" />

        {/* Message */}
        <p className="text-gray-800 font-semibold flex-1">{message}</p>

        {/* Close (X) at top-right */}
        <button
          onClick={onClose}
          className="absolute  right-2 text-gray-400 hover:text-gray-600"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
}
