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
import ImagePicker from "../image-picker";
import FormLabel from "../form-label";

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Min 2 characters").max(25, "Max 25 characters"),
});

type ProfileFormProps = {
  profile: ProfileData | undefined;
};

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState<File | null>(null);

  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
    },
  });

  const { formState, reset, handleSubmit } = form;

  const onSubmit = (data: ProfileFormValues) => {
    const formData = new FormData();

    if (avatar) {
      formData.append("file", avatar);
    }

    startTransition(async () => {
      if (avatar) {
        const { error: uploadError } = await uploadAvatar(formData);

        if (uploadError) {
          console.error("Upload failed:", uploadError);
        }
      }

      if (formState.isDirty) {
        const { error: updateError } = await updateProfile(data);

        if (updateError) {
          console.error("Updating profile failed:", updateError);
          // error toast
          return;
        }
      }
      reset();
      router.refresh();
      setTimeout(() => setAvatar(null), 3000);
      // success toast
      console.log("Success updating profile");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <ImagePicker
        file={avatar}
        setFile={setAvatar}
        fallbackImage={profile?.avatar_url || baseAvatar}
      />

      <FormLabel
        formMethods={form}
        name="full_name"
        label="Full name:"
        errorMessage={formState.errors.full_name?.message}
        className="mt-2"
      />

      <SubmitButton
        className="w-[90px] mt-2"
        type="submit"
        disabled={
          isPending || !formState.isValid || !(formState.isDirty || avatar)
        }
      >
        {isPending ? "Updating..." : "Update"}
      </SubmitButton>
    </form>
  );
}
