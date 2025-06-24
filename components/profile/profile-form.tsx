"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile, uploadAvatar } from "./actions";
import { ProfileData } from "@/utils/types";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../submit-button";
import baseAvatar from "../../public/base_avatar.png";
import Image from "next/image";
import FormLabel from "../ui/form-label";

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Min 2 characters").max(25, "Max 25 characters"),
});

type ProfileFormProps = {
  profile: ProfileData | undefined;
};

type ProfileFormValues = z.infer<typeof ProfileSchema>;

const MAX_FILE_SIZE_MB = 50;

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const previewURL = file ? URL.createObjectURL(file) : "";
  const router = useRouter();

  const { formState, reset, handleSubmit, register } =
    useForm<ProfileFormValues>({
      resolver: zodResolver(ProfileSchema),
      defaultValues: {
        full_name: profile?.full_name || "",
      },
    });

  const onSubmit = (data: ProfileFormValues) => {
    setErrorMessage(null);
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

      if (formState.isDirty) {
        const { error: updateError } = await updateProfile(data);

        if (updateError) {
          console.error("Updating profile failed:", updateError);
          return;
        }
      }
      reset();
      setFile(null);
      router.refresh();
      // success toast
      console.log("Success updating profile");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
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
          const file = e.target.files?.[0];
          file &&
            (setFile(file),
            setErrorMessage(
              file.size > MAX_FILE_SIZE_MB * 1024 * 1024
                ? "File size too big!"
                : null
            ));
        }}
      />
      {errorMessage && (
        <p className="mt-1 text-[12px] text-red-500">{errorMessage}</p>
      )}

      <label className="block mt-2">
        <span className="text-sm text-gray-600">Full name</span>
        <input
          type="text"
          {...register("full_name")}
          className="mt-1 w-full md:w-[300px] p-2 border rounded"
        />
      </label>
      {formState.errors.full_name && (
        <p className="mt-1 text-[12px] text-red-500">
          {formState.errors.full_name.message}
        </p>
      )}

      <SubmitButton
        className="w-[90px] mt-2"
        type="submit"
        disabled={isPending || !(formState.isDirty || file) || !!errorMessage}
      >
        {isPending ? "Saving..." : "Save"}
      </SubmitButton>
    </form>
  );
}
