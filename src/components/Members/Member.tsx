import { useGetDoc } from "@/firebase/fetchHook";
import { UserType } from "@/utils/types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { UserMinus } from "lucide-react";
import { useAuth } from "@/firebase/authHook";

export const Member = ({
  userId,
  type,
  creator,
  handleDeleteMember,
}: {
  userId: string;
  type: "list" | "avatar";
  creator?: string;
  handleDeleteMember?: (id: string) => Promise<void>;
}) => {
  const { currentUser } = useAuth();
  const {
    data: member,
    isFetched,
    isError,
  } = useGetDoc<UserType>("users", userId);
  const fallback = member?.name.charAt(0);
  const isCreator = member?.id === creator

  if (isError || !currentUser) {
    return null;
  }

  if (!isFetched) {
    if (type === "avatar") {
      return <Skeleton className="w-10 h-10 rounded-full" />;
    } else {
      return (
        <div>
          <Skeleton className="w-64 h-10 rounded-xl" />
        </div>
      );
    }
  }

  return (
    <>
      {member && isFetched && (
        <div className="flex items-center gap-2">
          <Avatar className="w-10 h-10 rounded-full border-2">
            <AvatarImage src={member?.photoURL} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          {type === "list" && (
            <div className="flex flex-col w-full relative">
              <p className="text-sm font-bold leading-3">
                {member.name}{" "}
                {isCreator && (
                  <span className="text-gray-500"> - Creator</span>
                )}
              </p>
              <span className="text-xs">{member.email}</span>
              {
                currentUser.id === creator && !isCreator && 
                handleDeleteMember && (
                  <Button onClick={() => handleDeleteMember(member.id)} className="absolute right-0 top-0 bg-red-50 w-fit h-fit py-2 gap-2 text-black border-none shadow-none hover:bg-red-500 hover:text-white text-[10px] px-3">
                    <UserMinus size={16} />
                  </Button>
                )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
