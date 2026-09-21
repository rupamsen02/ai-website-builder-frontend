"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import Link from "next/link";
import { BobbingDots } from "@/components/bobbing-dots";
import { api } from "@/app/config/axios";
import { toast } from "sonner";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const myProject = () => {
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

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
    queryKey: ["My Projects"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/api/user/projects");
        console.log(data.projects);
        return data.projects;
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
    // enabled: !!session?.user && !isPending,
  });
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/");
      toast.success("Please login to view your projects");
    }
  }, [session?.user]);

  const deleteProjects = useMutation({
    mutationFn: async (projectId: string) => {
      const { data } = await api.delete(`/api/project/${projectId}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["My Projects"],
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

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
                <p className="">My Projects</p>
              </div>
              <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -top-32 -left-32" />
              <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -top-32 -right-32" />
              <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -bottom-10" />
              <motion.div
                initial="hidden"
                whileInView="visible"
                transition={{ staggerChildren: 0.2 }}
                viewport={{ once: false }}
                className="flex flex-wrap justify-center md:justify-start items-center  py-4 gap-7 w-full h-full"
              >
                {projects.map((project) => (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                    key={project.id}
                    className="relative mb-4 w-75 h-100 flex flex-col transition-transform duration-500 hover:scale-[1.02] items-start md:items-start border border-primary/50 justify-center overflow-hidden hover:border-primary"
                  >
                    <div className="relative pointer-events-auto w-150 sm:w-80 h-100 bg-gray-900 overflow-hidden border-gray-800">
                      <>
                        {project.current_code ? (
                          <iframe
                            srcDoc={project.current_code}
                            className="w-80 h-100 object-cover"
                            sandbox="allow-scripts allow-same-origin"
                            loading="lazy"
                          />
                        ) : (
                          <>
                            <p>No Preview</p>
                          </>
                        )}
                      </>
                    </div>

                    <div className="flex flex-col justify-center py-2 px-3 bg-black/80 items-start w-full">
                      <div className="inline-flex px-2 pt-1 justify-between items-center w-full">
                        <div className="flex flex-col justify-center w-30">
                          <div className="relative group w-50">
                            <span className="text-lg truncate text-white block">
                              {project.name}
                            </span>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mb-2 hidden group-hover:block border-black z-50 bg-white text-black text-sm px-3 py-1 mx-1 whitespace-normal w-max max-w-80 shadow-lg">
                              {project.name}
                            </div>
                          </div>
                          <div className="relative group w-50">
                            <span className="text-sm truncate text-white/80 block">
                              {project.initial_prompt}
                            </span>
                            <div className="absolute left-30 -translate-x-1/2 top-full mb-2 hidden border-black group-hover:block z-50 bg-white text-black text-sm px-3 py-1 mx-1 whitespace-normal w-max max-w-80 shadow-lg">
                              {project.initial_prompt}
                            </div>
                          </div>
                          <span className="text-gray-300/90 pt-2 text-xs">
                            {new Date(project.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <TooltipProvider>
                          <div className="flex flex-col w-full gap-4 items-end">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={`/components/myProject/project/${project.id}`}
                                  className="rounded-sm"
                                >
                                  <Edit2Icon className="w-4 h-4" />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right" align="center">
                                Edit
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() =>
                                    deleteProjects.mutate(project.id)
                                  }
                                  className="cursor-pointer"
                                >
                                  <Trash2Icon className="size-4.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="right" align="center">
                                Delete
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                      <div className="flex w-full gap-2 mt-10 px-2 py-4 justify-center items-center">
                        <Link
                          href={`/components/preview/${project.id}`}
                          className="px-4 py-1.5 rounded-sm bg-primary/90 text-white/80 w-full text-center"
                        >
                          Preview
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </>
        ) : (
          <>
            <div className="relative flex flex-col px-4 py-10 space-y-2 sm:px-20 lg:px-24 justify-center items-center">
              <div className="absolute bg-primary top-30 size-120 text-white/90 -z-20 blur-[250px]" />
              <img src="/no-data.png" alt="" className="w-80 h-80 " />
              <p className="">No projects added yet.</p>
              <p className="bg-primary/90 px-4 py-2 rounded-sm gap-2 flex">
                {" "}
                <span className="text-xl">+</span>
                <span className="pt-0.5">Create Project</span>
              </p>
            </div>
          </>
        )}
        <Footer />
      </div>
    </>
  );
};
export default myProject;
