"use client";

/**
 * Admin course management:
 * - Create / edit sellable courses (price, access duration, publish flag).
 * - Delete removes only when there are no paid sales; otherwise server unpublishes.
 */
import { useState } from "react";
import type { CourseAccessDuration, CourseAdminRow } from "@/types";
import {
  useAdminCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/useCourse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatCourseMajorPrice } from "@/lib/course-price";

const DURATIONS: CourseAccessDuration[] = ["MONTHS_6", "MONTHS_12", "UNLIMITED"];

type FormState = {
  title: string;
  slug: string;
  description: string;
  priceAmount: string;
  currency: string;
  accessDuration: CourseAccessDuration;
  thumbnailUrl: string;
  isPublished: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  priceAmount: "99.99",
  currency: "bdt",
  accessDuration: "UNLIMITED",
  thumbnailUrl: "",
  isPublished: false,
};

function rowToForm(row: CourseAdminRow): FormState {
  return {
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    priceAmount: String(row.priceAmount),
    currency: row.currency,
    accessDuration: row.accessDuration,
    thumbnailUrl: row.thumbnailUrl ?? "",
    isPublished: row.isPublished,
  };
}

export default function AdminCoursesPage() {
  const { data: courses = [], isLoading } = useAdminCourses();
  const createMut = useCreateCourse();
  const updateMut = useUpdateCourse();
  const deleteMut = useDeleteCourse();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CourseAdminRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row: CourseAdminRow) => {
    setEditing(row);
    setForm(rowToForm(row));
    setOpen(true);
  };

  const submit = async () => {
    const priceAmount = parseFloat(form.priceAmount);
    if (!form.title.trim() || Number.isNaN(priceAmount) || priceAmount <= 0) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      priceAmount,
      currency: form.currency.trim().toLowerCase() || "bdt",
      accessDuration: form.accessDuration,
      thumbnailUrl: form.thumbnailUrl.trim() || null,
      isPublished: form.isPublished,
      ...(form.slug.trim() ? { slug: form.slug.trim() } : {}),
    };

    if (editing) {
      await updateMut.mutateAsync({
        courseId: editing.id,
        payload: {
          ...payload,
          slug: form.slug.trim() || undefined,
        },
      });
    } else {
      await createMut.mutateAsync(payload);
    }
    setOpen(false);
  };

  const remove = async (row: CourseAdminRow) => {
    if (!window.confirm(`Remove or unpublish “${row.title}”?`)) return;
    await deleteMut.mutateAsync(row.id);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 font-epilogue text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Monetization
          </p>
          <h1 className="font-clash text-4xl font-bold text-zinc-900">Courses</h1>
          <p className="mt-2 max-w-2xl font-epilogue text-zinc-600">
            Price is major currency (decimals allowed, e.g. 99.99 BDT). The server
            converts to Stripe minor units at checkout. Use a high enough total so
            Stripe’s minimum charge is met in test mode.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="rounded-xl bg-zinc-900 font-bold text-white hover:bg-zinc-800"
        >
          <Plus className="mr-2 h-4 w-4" />
          New course
        </Button>
      </header>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-200 bg-white text-zinc-900 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-clash">
              {editing ? "Edit course" : "Create course"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="border-zinc-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (optional — auto from title if empty)</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="my-course"
                className="border-zinc-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={4}
                className="border-zinc-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price (major currency)</Label>
                <Input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={form.priceAmount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, priceAmount: e.target.value }))
                  }
                  className="border-zinc-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input
                  value={form.currency}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, currency: e.target.value }))
                  }
                  className="border-zinc-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Access duration</Label>
              <select
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                value={form.accessDuration}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    accessDuration: e.target.value as CourseAccessDuration,
                  }))
                }
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
                className="border-zinc-200"
              />
            </div>
            <label className="flex items-center gap-2 font-epilogue text-sm">
              <Checkbox
                checked={form.isPublished}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isPublished: v === true }))
                }
              />
              Published on catalog
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-zinc-900 text-white"
              disabled={createMut.isPending || updateMut.isPending}
              onClick={() => void submit()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p className="font-epilogue text-zinc-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-left font-epilogue text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50 text-xs font-semibold uppercase text-zinc-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Access</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3">Sales</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-zinc-50">
                  <td className="px-4 py-3 font-semibold text-zinc-900">{c.title}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {formatCourseMajorPrice(c.priceAmount, c.currency)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {c.accessDuration.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {c.isPublished ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{c._count.purchases}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => openEdit(c)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 text-rose-600"
                        onClick={() => void remove(c)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
