import { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Loader } from "../ui/loader";
import { AskPassword } from "../Auth/AskPassword";
import { useMutation } from "@tanstack/react-query";
import {
  getAuth,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

export const DeleteItem = ({
  name,
  isText,
  handleDelete,
  isPending,
  isGoogle,
}: {
  name: string;
  isText: boolean;
  handleDelete: () => Promise<void>;
  isPending: boolean;
  isGoogle?: boolean;
}) => {
  const [confirm, setConfirm] = useState(false);
  const [isNeedPassword, setIsNeedPassword] = useState(true);
  const user = getAuth().currentUser;

  const { mutate, isError, error, isSuccess } = useMutation({
    mutationFn: async () => {
      try {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user!, provider);
      } catch (error) {
        console.error(error);
        throw new Error("error");
      }
    },
    onSuccess: () => setIsNeedPassword(false),
  });

  return (
    <Modal
      title={`Delete ${name}`}
      isModalOpen={confirm}
      setIsModalOpen={setConfirm}
    >
      {name === "comment" ? (
        <button className="bg-gray-100 rounded-xl text-xs px-3 h-8 text-gray-500 hover:bg-gray-200">
          Delete
        </button>
      ) : (
        <Button
          className={`w-fit h-10 px-3 rounded-xl bg-gray-50 text-black flex gap-2 shadow-none border-none hover:bg-gray-300 ${isText ? "w-full py-3" : ""}`}
        >
          <Trash size={16} /> {isText ? `Delete ${name}` : null}
        </Button>
      )}
      <div className="flex flex-col gap-3 items-center font-bold p-3 pt-10">
        {name === "account" && isNeedPassword ? (
          <>
            {isGoogle ? (
              <>
              <p>Please re-authenticate before deleting your account</p>
              <Button
              onClick={() => mutate()}
              className="uppercase w-full flex items-center py-6 rounded-xl"
            >
              <FcGoogle color="white" style={{ marginRight: "6px" }} /> Google
            </Button>
            </>
            ) : (
              <AskPassword setIsNeedPassword={setIsNeedPassword} />
            )}
          </>
        ) : (
          <>
            <p>Are your sure you want to delete this {name} ?</p>
            <div className="flex w-3/4 m-auto  items-center gap-10">
              <Button
                onClick={handleDelete}
                className="rounded-xl border-none shadow-none w-full"
              >
                {isPending ? (
                  <Loader data={{ color: "white", size: "1rem" }} />
                ) : (
                  "Yes"
                )}
              </Button>
              <Button
                onClick={() => setConfirm(false)}
                className="bg-gray-100 rounded-xl text-black border-none shadow-none w-full hover:bg-gray-300"
              >
                No
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
