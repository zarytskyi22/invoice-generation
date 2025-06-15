"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "./actions";
import { ProfileData } from "@/utils/types";
import { SubmitButton } from "../submit-button";

const ProfileSchema = z.object({
  full_name: z.string().min(2, "Min 2 characters").max(25, "Max 25 characters"),
});

type ProfileFormProps = {
  profile: ProfileData | undefined;
};

type ProfileFormValues = z.infer<typeof ProfileSchema>;

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    startTransition(() => updateProfile(data));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
      <label className="block">
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
        className="w-[120px] mt-2"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save"}
      </SubmitButton>
    </form>
  );
}
