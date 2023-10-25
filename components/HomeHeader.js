import { useSession } from "next-auth/react";

export default function HomeHeader() {
  const { data: session } = useSession();
  return (
    <div className="flex justify-between">
      <h2 className="text-md">
        <div className="flex gap-3 items-center">
          <img
            src={session?.user?.image}
            alt="img-User"
            className="w-10 h-10 rounded-lg sm:hidden"
          />
          Bonjour,
          <p className="text-black">
            <b>{session?.user?.name}</b>
          </p>
        </div>
      </h2>
      <div className="hidden sm:block">
        <img
          src={session?.user?.image}
          alt="img-User"
          className="w-20 h-20 rounded-lg"
        />
      </div>
    </div>
  );
}
