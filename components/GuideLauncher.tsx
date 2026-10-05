"use client";

import { useState } from "react";
import UserGuide from "@/components/UserGuide";

export default function GuideLauncher({
  onboarding = false,
}: {
  onboarding?: boolean;
}) {
  const [open, setOpen] = useState(onboarding);

  return (
    <>
      <button
        type="button"
        className="btn btn-quiet"
        onClick={() => setOpen(true)}
      >
        Guide Nexora 3D
      </button>

      {open && (
        <UserGuide
          onboarding={onboarding}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}