"use client";

import { useState } from "react";

import { useGetAllCategories } from "@/hooks/useCategory";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import CreateCategoryModal from "@/components/dashboard/CreateCategoryModal";

export default function ManageCategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: categories, isLoading } = useGetAllCategories();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-clash text-[#2D2D2D]">
            Job Categories
          </h1>
          <p className="text-[#515B6F] font-epilogue">
            Organize and manage the departments in your company.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#4640DE] hover:bg-[#3b36c0] text-white h-12 px-6 font-bold font-epilogue rounded-lg cursor-pointer"
        >
          <Plus className="mr-2" size={18} />
          Add New Category
        </Button>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white animate-pulse border border-zinc-100"
            />
          ))
        ) : categories && categories.length > 0 ? (
          categories.map((category: Category) => (
            <div
              key={category.id}
              className="bg-white border border-zinc-100 py-4 px-8 shadow-sm group hover:border-[#4640DE] transition-all rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-clash text-[#2D2D2D]">
                    {category.title}
                  </h3>
                  <p className="text-xs font-bold text-[#4640DE] uppercase tracking-widest bg-indigo-50 px-2 py-0.5 inline-block">
                    {category.status}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-2 text-zinc-400 hover:text-[#4640DE] transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center font-epilogue text-[#515B6F]">
            No categories found. Add your first category to get started.
          </div>
        )}
      </div>
    </div>
  );
}
