import { signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Logout = ({ className }: { className?: string }) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleConfirmLogout = async () => {
    await signOut({ redirect: false });
    setShowModal(false);
    toast.success("Logout Successfully");
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted ${className ?? ""}`}
      >
        Logout
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            aria-describedby="logout-description"
            className="w-full max-w-sm rounded-xl border bg-card p-6 text-card-foreground shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="logout-title" className="text-lg font-semibold">
              Sign out?
            </h2>
            <p
              id="logout-description"
              className="mt-2 text-sm text-muted-foreground"
            >
              Are you sure you want to end your session?
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Yes, log out
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default Logout;