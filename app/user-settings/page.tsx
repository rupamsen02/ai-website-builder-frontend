import { AccountSettings } from "@/components/auth/settings/account/account-settings";
import Navbar from "../components/navbar";

export default function UserProfilePage() {
  return (
    <div className="backdrop-blur-md min-h-screen overflow-hidden">
      <Navbar />
      <div className="space-y-6 flex flex-col  mx-auto items-center justify-center w-3/4 px-4 md:px-15 lg:px-20 xl:px-35">
        <AccountSettings />
      </div>
    </div>
  );
}
