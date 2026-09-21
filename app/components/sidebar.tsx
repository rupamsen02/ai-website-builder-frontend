import {
  BotIcon,
  EyeIcon,
  Loader2Icon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api } from "../config/axios";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
interface SidebarProps {
  menuOpen: boolean;
  project: Project;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const sidebar = ({
  menuOpen,
  project,
  isGenerating,
  setIsGenerating,
}: SidebarProps) => {
  const [input, setInput] = useState("");
  const messageRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const fetchProject = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["My Projects", project.id],
    });
  };
  //Roll back to version
  const handleRollBackMutate = useMutation({
    mutationFn: async (versionId: string) => {
      const { data } = await api.put(
        `/api/project/rollback/${project.id}/${versionId}`,
      );
      // const {data: data2} = await api.get(`/api/user/project/rollback/${project.id}`);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ["My Projects", project.id],
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast.error(error.message);
    },
  });

  const handleRollBack = (versionId: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to rollback to this version?",
      );
      if (!confirm) return;
      setIsGenerating(true);
      // setProject(data2.project);
      handleRollBackMutate.mutate(versionId);
    } catch (error: any) {
      setIsGenerating(false);
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    }
  };
  //Make revision
  const handleRevisionMutate = useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post(`/api/project/revision/${project.id}`, {
        message,
      });
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setInput("");
      queryClient.invalidateQueries({
        queryKey: ["My Projects", project.id],
      });
      setIsGenerating(false);
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast.error(error.message);
    },
  });

  const handleRevisions = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || handleRevisionMutate.isPending) return;
    setIsGenerating(true);
    handleRevisionMutate.mutate(input);
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [project.conversation.length, isGenerating]);
  return (
    <div
      className={`h-screen md:max-w-3/6 py-2 px-2 bg-cyan-900/60 border-0 md:border-r-2 border-white transition-all ${menuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
          {[...project.conversation, ...project.versions]
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
            )
            .map((message) => {
              const isMessage = "content" in message;
              if (isMessage) {
                const msg = message as Message;
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start ml-6 md:px-5 px-10 py-2 gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-300 to-cyan-400 flex items-center justify-center">
                        <BotIcon className="size-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[60%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-related ${isUser ? "bg-linear-to-r from-primary to-cyan-400 text-white rounded-tr-none" : "text-gray-100 rounded-tl-none bg-cyan-600/60"}`}
                    >
                      {msg.content}
                    </div>
                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-cyan-500/80 flex items-center justify-center">
                        <UserIcon className="size-5 text-gray-200" />
                      </div>
                    )}
                  </div>
                );
              } else {
                const ver = message as Version;
                return (
                  <div
                    key={ver.id}
                    className="w-4/5 mx-auto my-2 p-3 rounded-xl bg-cyan-600 text-gray-100 shadow flex flex-col gap-2"
                  >
                    <div className="text-xs font-medium">
                      Code updated <br />
                      <span className="text-gray-500 text-xs font-normal">
                        {new Date(ver.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {project.current_version_index === ver.id ? (
                        <button className="px-3 py-1 rounded-md text-xs bg-gray-700">
                          Current version
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRollBack(ver.id)}
                          className="px-3 py-1 rounded-md text-xs bg-primary hover:bg-cyan-400 text-white"
                        >
                          Roll back to this version
                        </button>
                      )}
                      <Link
                        target="_blank"
                        href={`/components/preview/${project.id}`}
                      >
                        <EyeIcon className="size-6 p-1 bg-cyan-300 hover:bg-cyan-400 transition-colors rounded" />
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          {isGenerating && (
            <div className="flex items-start ml-11 gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-300 to-cyan-400 flex items-center justify-center">
                <BotIcon className="size-5 text-white" />
              </div>
              <div className="flex gap-1.5 h-full items-end">
                <span
                  className="size-2 rounded-full animate-bounce bg-primary"
                  style={{ animationDelay: "0s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce bg-primary"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="size-2 rounded-full animate-bounce bg-primary"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          )}
          <div ref={messageRef} />
        </div>
        <form onSubmit={handleRevisions} className="relative m-3 px-6">
          <div className="flex items-center gap-2">
            <textarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              name=""
              rows={4}
              placeholder="Describe your website or request changes..."
              className="flex-1 p-3  rounded-xl resize-none text-sm outline-none ring ring-primary/50 focus:ring-primary bg-cyan-400/40 text-gray-100 placeholder-gray-400 transition-all"
              disabled={isGenerating}
              id=""
            />
            <button
              disabled={isGenerating || !input.trim()}
              className="absolute bottom-2 right-8 rounded-full bg-linear-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-cyan-600 text-white transition-colors disabled:opacity-60"
            >
              {isGenerating ? (
                <Loader2Icon className="size-7 p-1.5 animate-spin text-white" />
              ) : (
                <SendIcon className="size-7 p-2 text-white" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default sidebar;
