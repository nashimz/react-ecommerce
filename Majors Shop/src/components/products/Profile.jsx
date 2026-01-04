import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEdit,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "../modal/ModalContext"; // Ajusta la ruta si es necesario
import { updateUserProfile } from "@/services/userService"; // Tu servicio

export default function Profile() {
  const { user, setUser } = useAuth();
  const { showModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  // Inicializamos el estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
  });

  // Sincronizamos el formulario cuando el usuario carga o cambia
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser); // Actualizamos el contexto global
      setIsEditing(false); // Cerramos el modo edición
      showModal("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      showModal(error.message || "Failed to update profile.");
    }
  };

  return (
    <div className="pb-10">
      <h1 className="mt-8 text-center text-3xl font-bold font-figtree text-gray-800">
        User Profile
      </h1>

      <div className="wrapper mx-auto flex max-w-[1000px] items-center justify-center font-figtree border border-gray-100 shadow-lg p-8 mt-8 bg-white rounded-xl">
        <section className="flex flex-col md:flex-row items-center md:items-start gap-10 w-full">
          {/* Avatar Section */}
          <article className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-4 border-add-cart bg-gray-50 text-add-cart">
            <span className="text-6xl">
              <FontAwesomeIcon icon={faUser} />
            </span>
          </article>

          {/* Details Section */}
          <article className="flex-1 w-full">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h2 className="text-xl font-bold text-gray-700">
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-add-cart font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              )}
            </div>

            {isEditing ? (
              // FORMULARIO DE EDICIÓN
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">
                      Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-add-cart"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-600">
                      Surname
                    </label>
                    <input
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-add-cart"
                      placeholder="Your surname"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border rounded-md p-2 outline-none focus:ring-2 focus:ring-add-cart"
                    placeholder="Phone number"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="bg-add-cart text-white px-6 py-2 rounded-md font-bold hover:brightness-90 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-bold hover:bg-gray-300 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              // VISTA DE INFORMACIÓN (LECTURA)
              <div className="space-y-3 text-lg">
                <p>
                  <span className="font-bold text-gray-600">Full Name:</span>{" "}
                  {user?.name} {user?.surname || ""}
                </p>
                <p>
                  <span className="font-bold text-gray-600">Email:</span>{" "}
                  {user?.email}
                </p>
                <p>
                  <span className="font-bold text-gray-600">Phone:</span>{" "}
                  {user?.phone || "Not provided"}
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 italic">
                    Shipping addresses can be managed during the checkout
                    process.
                  </p>
                </div>
              </div>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}
