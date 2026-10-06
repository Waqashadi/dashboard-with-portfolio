"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateGithubProfile } from "@/hooks/useGithubProfile";
import type { GithubProfile } from "@/types/github";

interface ProfileFormModalProps {
  profile: GithubProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProfileFormValues = {
  name: string;
  bio: string;
  avatarUrl: string;
  company: string;
  location: string;
  email: string;
};

const toFormValues = (profile: GithubProfile): ProfileFormValues => ({
  name: profile.name ?? "",
  bio: profile.bio ?? "",
  avatarUrl: profile.avatarUrl ?? "",
  company: profile.company ?? "",
  location: profile.location ?? "",
  email: profile.email ?? "",
});

export function ProfileFormModal({ profile, open, onOpenChange }: ProfileFormModalProps) {
  const [values, setValues] = useState(() => toFormValues(profile));
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateProfile = useUpdateGithubProfile();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        data: {
          name: values.name.trim() || null,
          bio: values.bio.trim() || null,
          avatarUrl: values.avatarUrl.trim() || null,
          company: values.company.trim() || null,
          location: values.location.trim() || null,
          email: values.email.trim() || null,
        },
      });
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to update the profile.");
    }
  };

  const updateField = (field: keyof ProfileFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit GitHub profile</DialogTitle>
          <DialogDescription>Update the profile details shown on your dashboard.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Field label="Display name" name="name" value={values.name} onChange={(value) => updateField("name", value)} />
          <Field label="Bio" name="bio" value={values.bio} onChange={(value) => updateField("bio", value)} multiline />
          <Field label="Avatar URL" name="avatarUrl" value={values.avatarUrl} onChange={(value) => updateField("avatarUrl", value)} type="url" />
          <Field label="Company" name="company" value={values.company} onChange={(value) => updateField("company", value)} />
          <Field label="Location" name="location" value={values.location} onChange={(value) => updateField("location", value)} />
          <Field label="Email" name="email" value={values.email} onChange={(value) => updateField("email", value)} type="email" />
          {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateProfile.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  const className = "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-primary/10";
  return (
    <label className="block space-y-1.5 text-sm font-medium" htmlFor={name}>
      <span>{label}</span>
      {multiline ? (
        <textarea id={name} name={name} className={`${className} min-h-24 resize-y`} rows={3} value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      ) : (
        <Input id={name} name={name} className="h-11" type={type} value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      )}
    </label>
  );
}

export default ProfileFormModal;
