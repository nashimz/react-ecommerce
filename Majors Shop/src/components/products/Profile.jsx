import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
export default function Profile() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="mt-4 text-center text-2xl font-bold font-figtree">
        User Profile
      </h1>

      <div className="wrapper mx-auto flex  max-w-[1200px] items-center justify-center font-figtree border border-white p-6 mt-8 bg-white rounded-lg">
        <section className="flex items-center gap-6 p-4">
          <article className="flex h-32 w-32 items-center justify-center rounded-full border border-black">
            <span className="text-6xl">
              <FontAwesomeIcon icon={faUser} />
            </span>
          </article>

          <article className="border border-black rounded-md p-4">
            <h2 className="text-xl font-semibold ">Personal Information</h2>
            <p>Name: {user?.name || "John Doe"}</p>
            <p>Email: {user?.email || "john.doe@example.com"}</p>
            <p>Phone: {user?.phone || "(123) 456-7890"}</p>

            <p>
              Address: {user?.address || "123 Main Street, City, State 12345"}
            </p>
          </article>
        </section>
      </div>
    </>
  );
}
