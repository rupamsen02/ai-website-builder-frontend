"use client";

import { fileToAvatarDataUrl } from "@better-auth-ui/core";
import { useAuth, useSession, useUpdateUser } from "@better-auth-ui/react";
import { Trash2, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/auth/user/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export type ChangeAvatarProps = {
  className?: string;
};

export function ChangeAvatar({ className }: ChangeAvatarProps) {
  const { authClient, localization, avatar } = useAuth();
  const { data: session } = useSession(authClient);

  const { mutate: updateUser, isPending: updatePending } =
    useUpdateUser(authClient);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isPending = updatePending || isUploading || isDeleting;

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    setIsUploading(true);

    try {
      const resized =
        (await avatar.resize?.(file, avatar.size, avatar.extension)) || file;

      const image =
        (await avatar.upload?.(resized)) ||
        (await fileToAvatarDataUrl(resized));

      updateUser(
        { image },
        {
          onSuccess: () =>
            toast.success(localization.settings.avatarChangedSuccess),
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }

    setIsUploading(false);
  }

  async function handleDelete() {
    const currentImage = session?.user.image;

    updateUser(
      { image: null },
      {
        onSuccess: async () => {
          if (currentImage) {
            setIsDeleting(true);
            try {
              await avatar.delete?.(currentImage);
            } finally {
              setIsDeleting(false);
            }
          }

          toast.success(localization.settings.avatarDeletedSuccess);
        },
      },
    );
  }

  return (
    <Field className={className}>
      <FieldLabel>User Image</FieldLabel>
      <div className="border border-primary rounded-xl">
        <div className="">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <Card className={cn("bg-amber-80",className)}>
          <CardContent>
            <button
              type="button"
              className="p-0 h-auto w-auto rounded-full"
            >
              <UserAvatar className="size-12" isPending={isPending} />
            </button>
          </CardContent>
          <CardFooter className="bg-amber-80 border-t-primary">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(buttonVariants({ size: "sm" }))}
                disabled={!session || isPending}
              >
                {isPending && <Spinner />}

                {localization.settings.changeAvatar}
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-fit">
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Upload className="text-muted-foreground" />

                  {localization.settings.uploadAvatar}
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  disabled={!session?.user.image}
                  onClick={handleDelete}
                >
                  <Trash2 />

                  {localization.settings.deleteAvatar}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      </div>
    </Field>
  );
}
