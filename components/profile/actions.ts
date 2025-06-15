"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: unknown) {
  const profileSchema = z.object({
    full_name: z.string().min(2).max(100),
  });

  const data = profileSchema.parse(formData);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await supabase
    .from("profiles")
    .update({ full_name: data.full_name })
    .eq("id", user.id);
}

export async function uploadAvatar(formData: FormData) {
  const uploadAvatarSchema = z.object({
    file: z.instanceof(File),
  });

  const supabase = await createClient();

  const file = formData.get("file");
  const result = uploadAvatarSchema.safeParse({ file });

  if (!result.success) {
    return { error: "Invalid file" };
  }

  if (!(file instanceof File)) {
    return { error: "Invalid file type" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authorized" };

  const fileName = `${user.id}-image`;
  const filePath = "/" + fileName;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) return { error: "Uploading file error" };

  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  const avatarUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (updateError) return { error: "Saving avatar URL error" };

  revalidatePath("/protected/profile");

  return { success: true };
}
