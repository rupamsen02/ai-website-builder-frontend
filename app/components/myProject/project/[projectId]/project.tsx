"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../../navbar";
import { BobbingDots } from "../../../../../components/bobbing-dots";
import { BouncingDots } from "../../../../../components/bouncing-dots";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/app/components/sidebar";
import {
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FullscreenIcon,
  HomeIcon,
  Laptop,
  SaveIcon,
  SmartphoneIcon,
  TabletSmartphoneIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectPreviewRef } from "@/app/components/ProjectPreview";
import ProjectPreviewPanel from "@/app/components/ProjectPreviewPanel";
import { api } from "@/app/config/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  isPublished?: boolean;
  versionId?: string;
  conversation: Message[];
  versions: Version[];
  current_version_index: string;
}
const project = () => {
  const { projectId } = useParams();
  const [isGenerating, setIsGenerating] = useState(true);
  const [device, setDevice] = useState<"phone" | "tablet" | "desktop">(
    "desktop",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<ProjectPreviewRef>(null);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["My Projects", projectId],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/user/project/${projectId}`);
        console.log(data.project);
        setIsGenerating(data.project.current_code ? false : true);
        return data.project;
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    },
    enabled: !!session?.user && !isPending,
    refetchInterval: (query) => {
      if (!query.state.data?.current_code) {
        return 10000;
      }
      return false;
    },
  });

  const saveProjectMutate = useMutation({
    mutationFn: async (code: string) => {
      try {
        const { data } = await api.put(`/api/project/save/${projectId}`, {
          code,
        });
        return data;
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    onSuccess: (data) => {
      (toast.success(data.message),
        queryClient.invalidateQueries({
          queryKey: ["My Projects", projectId],
        }));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const saveProject = async () => {
    if (!previewRef.current) return;
    const code = previewRef.current.getCode();
    if (!code) return;
    saveProjectMutate.mutate(code);
  };

  const download = () => {
    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) {
      if (isGenerating) {
        return;
      }
      return;
    }
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = "homePage.html";
    document.body.appendChild(element);
    element.click();
  };

  const publishMutate = useMutation({
    mutationFn: async () => {
      try {
        const { data } = await api.get(`/api/user/toggle-publish/${projectId}`);
        return data;
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["My Projects", projectId],
      });
    },
    onError(error: any) {
      toast.error(error.message);
    },
  });

  const publish = () => {
    publishMutate.mutate();
  };

  useEffect(() => {
    if (!session?.user && !isPending) {
      router.push("/");
      toast("Please login to view your project.");
    }
  }, [session?.user]);

  if (isLoading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen">
          <BobbingDots className="size-12" />
          <p className="text-md">Hang on for a moment...</p>
        </div>
      </>
    );
  }
  return project ? (
    <>
      <div className="flex flex-col md:flex-row relative">
        <div className=" cursor-pointer">
          <TooltipProvider>
            <div className="absolute left-2 top-2 rounded-md z-40 pointer-events-none flex text-center justify-center gap-4 pt-3 px-4 pb-2">
              <section className="relative flex flex-col pointer-events-auto cursor-pointer space-y-2 gap-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/`} className="bg-sky-800 rounded-sm">
                      <HomeIcon
                        className={`size-8 pl-1 py-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    Home
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/components/myProject`}
                      className="bg-sky-800 rounded-sm"
                    >
                      <img
                        src="/project.png"
                        className={`size-9 p-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`}
                      />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    My Projects
                  </TooltipContent>
                </Tooltip>
              </section>
            </div>
          </TooltipProvider>
        </div>
        <Sidebar
          menuOpen={menuOpen}
          project={project}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
        <div className="flex-1 flex">
          <ProjectPreviewPanel
            ref={previewRef}
            project={project}
            isGenerating={isGenerating}
            device={device}
          />
        </div>
        <TooltipProvider>
          <div className="absolute right-0 px-4 bottom-4 pointer-events-none space-y-8 z-40 flex items-end w-full md:w-1/2 cursor-pointer justify-between">
            <section className="relative flex flex-col pointer-events-auto cursor-pointer space-y-2 gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setDevice("phone")}
                    className="bg-mauve-800 rounded-sm"
                  >
                    <SmartphoneIcon
                      className={`size-8 p-1 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Phone Size
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setDevice("tablet")}
                    className="bg-mauve-800 rounded-sm"
                  >
                    <TabletSmartphoneIcon
                      className={`size-8 p-1 rounded cursor-pointer ${device === "tablet" ? "bg-gray-700" : ""}`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Tablet Size
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setDevice("desktop")}
                    className="bg-mauve-800 rounded-sm"
                  >
                    <Laptop
                      onClick={() => setDevice("desktop")}
                      className={`size-8 p-1 rounded cursor-pointer ${device === "desktop" ? "bg-gray-700" : ""}`}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Desktop Size
                </TooltipContent>
              </Tooltip>
            </section>
            <section className="relative pointer-events-auto flex flex-col space-y-9">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={isSaving}
                    onClick={saveProject}
                    className="bg-mauve-800 rounded-sm p-1"
                  >
                    {isSaving ? (
                      <BouncingDots className="size-6.5" />
                    ) : (
                      <SaveIcon className="size-6.5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="z-9999" side="right" align="center">
                  {isSaving ? "Saving..." : "Save"}{" "}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    target="_blank"
                    href={`/components/preview/${projectId}`}
                    className="bg-mauve-800 rounded-sm p-1"
                  >
                    {" "}
                    <FullscreenIcon className="size-7" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Preview
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={download}
                    className="bg-mauve-800 rounded-sm p-1"
                  >
                    {" "}
                    <DownloadIcon className="size-7" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  Download
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={publish}
                    className="bg-mauve-800 rounded-sm pt-1"
                  >
                    {project.isPublished ? (
                      <button>
                        <EyeOffIcon className="size-6.5" />{" "}
                      </button>
                    ) : (
                      <button>
                        <EyeIcon className="size-6.5" />
                      </button>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" align="center">
                  {project.isPublished ? "Unpublish" : "Publish"}
                </TooltipContent>
              </Tooltip>
            </section>
          </div>
        </TooltipProvider>
      </div>
      {/* </div> */}
    </>
  ) : (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-100">
        <p className="bg-primary text-white/90 rounded-md px-4 py-2">
          Unable to load project!
        </p>
      </div>
    </>
  );
};
export default project;
