"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserButton } from "@/components/auth/user/user-button";
import { api } from "../config/axios";
import { toast } from "sonner";
import { motion } from "motion/react";

const navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [credits, setCredits] = useState(0);
  const { data: session } = authClient.useSession();
  // const getCredits = async () => {
  //   try {
  //     const { data } = await api.get("/api/user/credits");
  //     setCredits(data.credits);
  //   } catch (error: any) {
  //     toast.error(error.message);
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   //User is available
  //   if (session?.user) {
  //     getCredits();
  //   }
  // }, [session?.user]); // these function gets executed whenever user changes
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col relative justify-center overflow-hidden items-center px-0 sm:px-5 lg:px-20"
    >
      <div
        className={` ${credits ? "hidden lg:flex" : "hidden md:flex"} items-center border border-primary/10 backdrop-blur-sm ${credits ? "xl:w-230" : "xl:220"} gap-8 text-center justify-between overflow-hidden rounded-full px-4 my-10 py-3`}
      >
        <Link href="/" className="px-0 flex flex-wrap gap-1">
          <img src="/ai-logo-white.png" alt="" className="w-10 h-10" />
          <div className="text-xl xl:text-3xl font-bold md:pt-2 xl:pt-0 text-primary glow-text">
            Web Builder
          </div>
        </Link>
        <div className="flex gap-4">
          <Link
            href="/"
            className={`text-center text-sm xl:text-base ${pathname === "/" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
          >
            Home
          </Link>
          <Link
            href="/components/pricing"
            className={`text-center text-sm xl:text-base ${pathname === "/components/pricing" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"}  py-2`}
          >
            Pricing
          </Link>
          <Link
            href="/components/project/:projectId"
            className="text-center text-sm xl:text-base px-4 py-2 hidden"
          >
            Projects
          </Link>
          <Link
            href="/components/contact"
            className={`text-center text-sm xl:text-base ${pathname === "/components/contact" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
          >
            Contact
          </Link>
          <Link
            href="/components/about"
            className={`text-center text-sm xl:text-base ${pathname === "/components/about" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
          >
            About
          </Link>
        </div>
        {!session?.user ? (
          <Link
            href="/auth/sign-in"
            className=" bg-primary px-3 xl:px-5 py-2 text-sm xl:text-base rounded-full"
          >
            Sign In
          </Link>
        ) : (
          <>
            <Link
              href="/components/myProject"
              className={`text-center text-sm xl:text-base ${pathname === "/components/myProject" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
            >
              Myprojects
            </Link>
            <Link
              href="/components/preview/:projectId"
              className="text-center px-2 hidden"
            >
              Preview
            </Link>
            <Link
              href="/components/preview/:projectId/:versionId"
              className="text-center px-2 hidden"
            >
              Preview
            </Link>
            <Link
              href="/components/community"
              className={`text-center text-sm xl:text-base ${pathname === "/components/community" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
            >
              Community
            </Link>
            <Link href="/view/:projectId" className="text-center px-2 hidden">
              Community
            </Link>
            <button className="bg-white/10 px-2 py-1.5 text-xs sm:text-sm border text-gray-200 rounded-full">
              Credits : <span className="text-indigo-300">{credits}</span>
            </button>
            <UserButton size="icon" />
          </>
        )}
      </div>
      {/* mobile menu */}
      <div
        className={`flex ${credits ? "lg:hidden" : "md:hidden"}  justify-between gap-20 w-90 sm:w-100 items-center px-6 md:px-8 lg:px-20 xl:px-32 border border-primary/30 rounded-full my-10 py-3`}
      >
        <div className="px-0 flex gap-2">
          <img src="/ai-logo-white.png" alt="" className="w-10 h-10" />
          <h1 className="text-2xl pt-1 font-bold text-primary glow-text">
            Web Builder
          </h1>
        </div>
        <button
          className={`credits ? 'lg:hidden' : 'md:hidden'`}
          onClick={() => setMobileOpen(true)}
        >
          <img src="/list.png" alt="" className="w-7 h-7" />
        </button>
        <div
          className={`fixed inset-0 z-10 bg-black/95 flex flex-col overflow-hidden items-center py-50 sm:py-30 ${credits ? "lg:py-30" : "md:py-30"} transition-transform duration-300 ${credits ? "lg:hidden" : "md:hidden"} ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            className={`${credits ? "lg:hidden" : "md:hidden"} absolute top-8 right-8`}
            onClick={() => setMobileOpen(false)}
          >
            <img src="/close.png" alt="" className="w-6 h-6" />
          </button>
          <div className="px-0 flex gap-2">
            <img src="/ai-logo-white.png" alt="" className="w-10 h-10" />
            <h1 className="text-3xl font-bold text-primary glow-text">
              Web Builder
            </h1>
          </div>
          <div className="flex flex-col space-y-4 mt-8 gap-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`text-center ${pathname === "/" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
            >
              Home
            </Link>
            <Link
              href="/components/pricing"
              onClick={() => setMobileOpen(false)}
              className={`text-center ${pathname === "/components/pricing" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
            >
              Pricing
            </Link>
            <Link
              href="/components/project/:projectId"
              onClick={() => setMobileOpen(false)}
              className="text-center px-2 hidden"
            >
              Projects
            </Link>
            <Link
              href="/components/contact"
              onClick={() => setMobileOpen(false)}
              className={`text-center text-sm xl:text-base ${pathname === "/components/contact" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
            >
              Contact
            </Link>
            <Link
              href="/components/about"
              onClick={() => setMobileOpen(false)}
              className={`text-center text-sm xl:text-base ${pathname === "/components/about" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"} py-2`}
            >
              About
            </Link>
          </div>
          <div className="space-y-8 pt-6 flex flex-col items-center justify-center">
            {!session?.user ? (
              <Link
                href="/auth/signup"
                onClick={() => setMobileOpen(false)}
                className=" bg-primary px-5 py-2 my-6 rounded-full"
              >
                Signup
              </Link>
            ) : (
              <>
                <Link
                  href="/components/myProject"
                  className={`text-center py-2 ${pathname === "/components/myProject" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"}`}
                >
                  Myprojects
                </Link>
                <Link
                  href="/components/preview/:projectId"
                  className="text-center px-2 hidden"
                >
                  Preview
                </Link>
                <Link
                  href="/components/preview/:projectId/:versionId"
                  className="text-center px-2 hidden"
                >
                  Preview
                </Link>
                <Link
                  href="/components/community"
                  onClick={() => setMobileOpen(false)}
                  className={`text-center px-2 ${pathname === "/components/community" ? "px-3 xl:px-4 bg-gray-400/10 rounded-4xl" : "px-2 xl:px-4"}`}
                >
                  Community
                </Link>
                <Link
                  href="/view/:projectId"
                  className="text-center px-2 hidden"
                >
                  Community
                </Link>
                <button className="bg-white/10 px-5 py-2 text-xs sm:text-sm border text-gray-200 rounded-full">
                  Credits : <span className="text-indigo-300">{credits}</span>
                </button>
                <UserButton size="icon" />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default navbar;
