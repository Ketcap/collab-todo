import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownSignout } from "../authentication/logout";
import { LoginButton } from "../authentication/login";

export const Navbar = async () => {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;

  return (
    <header className="flex flex-col items-center justify-between">
      <div className="flex border bg-card text-card-foreground shadow p-3 w-[100%] max-w-[500px] rounded-t-none rounded-b-md">
        <div className="flex items-center">
          <h2 className="text-lg font-bold leading-none">Collab-Todo</h2>
        </div>
        <div className="self-end ml-auto">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback>
                    {session.user.name?.split(" ").map((n) => n[0])}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>My Lists</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownSignout />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
};
