"use client";
import { useState } from "react";
import Navbar from "./components/navbar";
import { Ellipsis, Loader } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { api } from "./config/axios";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const hero = () => {
  const { data: session } = authClient.useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      //User not sign in
      if (!session?.user) {
        return toast.error("Please sign in to create a project");
      } else if (!input.trim()) {
        return toast.error("Please enter a message");
      }
      setLoading(true);
      const { data } = await api.post("/api/user/project", {
        initial_prompt: input,
      });
      setLoading(false);
      console.log("Project ID:", data.projectId);
      console.log(
        "Navigating to:",
        `/components/myProject/project/${data.projectId}`,
      );
      router.push(`/components/myProject/project/${data.projectId}`);
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  return (
    <div className="backdrop-blur-md min-h-screen overflow-hidden">
      <video
        src="/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute opacity-4 object-cover h-full w-900"
      />
      <Navbar />
      <div className="relative pointer-events-auto flex flex-col space-y-5 items-center justify-center text-center py-8 px-4 sm:px-20 lg:px-24 ">
        <div className="absolute w-full h-full pointer-events-none inset-0 z-30 bg-black/30" />
        <div className="text-center flex pl-1.5 gap-2 py-1 rounded-full w-75 bg-pink-300/15">
          <span className="py-0.5 px-3 bg-primary rounded-3xl">New</span>
          <span className="py-0.5 flex">Try 30 days free trial option</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0"
            height="0"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-right-icon lucide-chevron-right mr-2 w-3.5 h-3.5 mt-1.5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
        <p className="flex text-center justify-center items-center text-4xl md:text-5xl font-semibold  text-white/90">
          Use Our Ai tool to develop <br /> your desired website
        </p>
        <p className="flex text-center justify-center items-center md:text-md text-base text-white/80">
          Creating and customizing your website can be done <br /> more faster
          way now.
        </p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onSubmit={onSubmitHandler}
          className="flex relative items-center space-y-2 text-sm lg:text-base mx-2 md:mx-0 justify-center py-4"
        >
          <div className="relative transition-all py-4 duration-500 hover:border-2 hover:border-primary/90 w-90 md:w-140 lg:w-180 rounded-lg border-2 border-primary/40 bg-black/60">
            <textarea
              required
              onChange={(event) => setInput(event.target.value)}
              className="px-4 resize-none text-primary outline-0 overflow-y-hidden no-scrollbar w-180 h-35"
              placeholder="Describe your project to build website..."
            />
            <div className="flex justify-start px-4 border-t pt-2">
              <button className="mt-1.5 gap-1 py-2 w-40 bg-linear-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-cyan-600 rounded-lg outline-0 border px-4">
                {!loading ? (
                  <div className="flex gap-1">
                    Create with Ai
                    <img src="/ai(1).png" alt="" className="w-4 h-4 mt-1" />
                  </div>
                ) : (
                  <div className="flex gap-1">
                    Creating
                    <Ellipsis className="size-5 animate-pulse mt-1" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </motion.form>
        <div className="container mx-auto flex flex-col py-5 mt-8 items-center text-center justify-center space-y-10 px-2">
          <p>Trusting by leading brands, including</p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.2 }}
            viewport={{ once: false }}
            className="flex flex-wrap gap-20 text-white/90 gap-y-10 text-center w-full items-center justify-center font-semibold"
          >
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="flex gap-1"
            >
              <img src="/framer.png" alt="" className="w-6 h-8" />
              <span className="text-lg">Framer</span>
            </motion.section>
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="inline-flex gap-1"
            >
              <img src="/facebook.png" alt="" className="w-8 h-8" />
              <span className="text-lg mt-0.5">Facebook</span>
            </motion.section>
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="flex gap-1"
            >
              <img src="/instagram.png" alt="" className="w-8 h-8" />
              <span className="text-lg mt-0.5">Instagram</span>
            </motion.section>
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="flex gap-1"
            >
              <img src="/microsoft.png" alt="" className="w-7 h-7 mt-0.5" />
              <span className="text-lg mt-0.5">Microsoft</span>
            </motion.section>
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="flex gap-1"
            >
              <img src="/github.png" alt="" className="w-8 h-8" />
              <span className="text-lg mt-0.5">GitHub</span>
            </motion.section>
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="flex gap-1"
            >
              <img src="/linkedin.png" alt="" className="w-7 h-7" />
              <span className="text-lg">LinkedIn</span>
            </motion.section>
            <motion.section
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
              className="flex gap-1"
            >
              <img src="/pinterest.png" alt="" className="w-8 h-8" />
              <span className="text-lg mt-0.5">Pinterest</span>
            </motion.section>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default hero;
