"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import Link from "next/link";
import { BobbingDots } from "@/components/bobbing-dots";
import { api } from "@/app/config/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  fullname?: string;
  imageUrl?: string;
  name?: string;
  image?: string;
}

interface Message {
  id: string;
  role: any;
  content: string;
  timestamp: string;
}

interface Version {
  id: string;
  timestamp: string;
  code: string;
}

interface Project {
  id: string;
  name: string;
  initial_prompt: string;
  current_code: string;
  current_version_index: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  isPublished?: boolean;
  versionId?: string;
  conversation?: Message[];
  versions?: Version[];
}

const community = () => {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [openModal]);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["publisedProject"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/project/published");
        return data.projects;
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    enabled: !!session?.user && !isPending,
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
      toast.success("Please login to view your projects");
    }
  }, [session?.user, isPending, router]);

  useEffect(() => {
    if (isPending || isLoading) {
      setLoading(true);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isPending, isLoading]);

  return (
    <>
      <div className="backdrop-blur-md min-h-screen overflow-hidden">
        <img
          src="/bg-pricing.jpg"
          alt=""
          className="absolute opacity-5 h-full w-900 object-cover"
        />
        <Navbar />
        {isLoading || isPending || loading ? (
          <>
            <div className="flex flex-col items-center justify-center my-50">
              <BobbingDots className="size-12" />
              <p className="text-md mb-20">Hang on for a moment...</p>
            </div>
          </>
        ) : projects.length > 0 ? (
          <>
            <div className="relative flex flex-col my-8 justify-center items-center px-10 sm:px-20 lg:px-25">
              <div className="flex justify-center gap-4 mb-4 items-center text-white/90">
                <p className="">Your Published Projects</p>
              </div>
              <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -top-32 -left-32" />
              <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -top-32 -right-32" />
              <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -bottom-10" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                transition={{ staggerChildren: 0.2 }}
                viewport={{ once: false }}
                className="flex flex-wrap item-center justify-center md:justify-start gap-7 py-4 w-full h-full"
              >
                {projects.map((project) => (
                  <>
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.6 }}
                      key={project.id}
                      className="relative gap-1 mb-4 w-75 h-100 flex flex-col items-start md:items-start transition-transform duration-500 hover:scale-[1.02] cursor-pointer justify-center overflow-hidden hover:border-primary border border-primary/20"
                    >
                      <div className="relative w-150 sm:w-80 h-100 bg-gray-900 overflow-hidden border-gray-800">
                        <>
                          {project.current_code ? (
                            <iframe
                              srcDoc={project.current_code}
                              className="w-80 h-100 object-cover pointer-events-none"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          ) : (
                            <>
                              <p>No Preview</p>
                            </>
                          )}
                        </>
                      </div>

                      <div className="relative flex flex-col items-start bg-black/70 h-60 py-3 px-3 w-full">
                        <div className="flex flex-col mb-2 w-50">
                          <span className="text-lg truncate text-white">
                            {project.name}
                          </span>
                          <span className="text-sm truncate text-white/80">
                            {project.initial_prompt}
                          </span>
                        </div>
                        <span className="text-gray-300/90 text-xs ">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/components/view/${project.id}`}
                          className="py-2 px-2 text-center mt-10 w-full bg-primary/90"
                        >
                          Preview
                        </Link>
                      </div>
                    </motion.div>
                  </>
                ))}
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <div className="relative flex flex-col px-4 py-10 space-y-2 sm:px-20 lg:px-24 justify-center items-center">
              <div className="absolute bg-primary top-30 size-120 text-white/90 -z-20 blur-[250px]" />
              <p className="bg-primary/90 px-4 py-2 rounded-sm gap-2 flex">
                {" "}
                <span className="pt-0.5">Loading Community Projects...</span>
              </p>
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  );
};

export default community;
