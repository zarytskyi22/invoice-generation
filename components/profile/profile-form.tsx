"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile, uploadAvatar } from "./actions";
import { ProfileData } from "@/utils/types";
import { SubmitButton } from "../submit-button";
import baseAvatar from "../../public/base_avatar.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Min 2 characters").max(25, "Max 25 characters"),
});

type ProfileFormProps = {
  profile: ProfileData | undefined;
};

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  const previewURL = file ? URL.createObjectURL(file) : "";
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
    },
  });

  const { isDirty } = form.formState;

  const onSubmit = (data: ProfileFormValues) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    startTransition(async () => {
      if (file) {
        const { error: uploadError } = await uploadAvatar(formData);

        if (uploadError) {
          console.error("Upload failed:", uploadError);
        }
      }

      if (isDirty) {
        const { error: updateError } = await updateProfile(data);

        if (updateError) {
          console.error("Updating profile failed:", updateError);
          return;
        }
      }

      router.refresh();
      // success toast
      console.log("Success updating profile");
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
      <Image
        height={80}
        width={80}
        className="rounded-full object-cover"
        src={previewURL ? previewURL : profile?.avatar_url || baseAvatar}
        alt="Avatar"
        priority
      />

      <input
        className="mt-2"
        type="file"
        name="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <label className="block mt-2">
        <p className="text-sm text-gray-600">Full name</p>

        <input
          type="text"
          {...form.register("full_name")}
          className="mt-1 w-full md:w-[300px] p-2 border rounded"
        />
        {form.formState.errors.full_name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.full_name.message}
          </p>
        )}
      </label>

      <SubmitButton
        className="w-[90px] mt-2"
        type="submit"
        disabled={isPending || !(isDirty || file)}
      >
        {isPending ? "Saving..." : "Save"}
      </SubmitButton>
    </form>
  );
}
