"use client";

import { useState, useTransition } from "react";
import { uploadAvatar } from "./actions";
import { SubmitButton } from "../submit-button";
import Image from "next/image";
import baseAvatar from "./base_avatar.png";

export default function UploadAvatar({ url }: { url: string }) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  const previewURL = file ? URL.createObjectURL(file) : "";

  console.log({ url });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadAvatar(formData);
      if (result?.error) {
        console.error("Upload failed:", result.error);
        return;
      }

      if (result?.success) {
        //
      }
    });
  };

  return (
    <form onSubmit={handleUpload} className="mt-2 flex flex-col">
      <Image
        height={80}
        width={80}
        className="rounded-full object-cover"
        src={previewURL ? previewURL : url}
        alt="Avatar"
        priority
      />

      <label className="flex">
        {/* {previewURL && (
          <Image
            height={30}
            width={30}
            className="rounded-full object-cover"
            src={previewURL}
            alt="Avatar"
          />
        )} */}
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
      </label>

      <SubmitButton
        className="w-[120px] mt-2"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Save"}
      </SubmitButton>
    </form>
  );
}
