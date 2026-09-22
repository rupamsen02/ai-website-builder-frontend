"use client";
import { BobbingDots } from "@/components/bobbing-dots";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectPreview from "../../ProjectPreview";
import { api } from "@/app/config/axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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

const preview = () => {
  const { data: session, isPending } = authClient.useSession();
  const { projectId, versionId } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  
  const fetchCode = async () => {
    try {
      const { data } = await api.get(`/api/project/preview/${projectId}`);
      setCode(data.project.current_code);
      if (versionId) {
        data.project.versions.forEach((version: Version) => {
          if (version.id === versionId) {
            setCode(version.code);
          }
        });
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };
  useEffect(() => {
    if (session?.user && !isPending) {
      fetchCode();
    }
  }, [session?.user]);

  if (loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-160">
          <BobbingDots className="size-12" />
          <p className="text-md">Hang on for a moment... </p>
        </div>
      </>
    );
  }
  return (
    <div className="">
      {code && (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenerating={false}
          showEditorPanel={false}
        />
      )}
    </div>
  );
};
export default preview;
