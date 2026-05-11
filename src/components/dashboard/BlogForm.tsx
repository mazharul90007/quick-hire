"use client";

import { useForm } from "react-hook-form";
import { Blog } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

interface BlogFormProps {
  initialData?: Blog;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const BlogForm = ({ initialData, onSubmit, isLoading }: BlogFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      author: "",
      readTime: "",
      isPublished: true,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (data: any) => {
    const formData = { ...data };
    if (selectedFile) {
      formData.imageFile = selectedFile;
    }
    onSubmit(formData);
  };

  const title = watch("title");
  
  // Auto-generate slug from title if slug is empty
  const generateSlug = () => {
    if (title && !initialData) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setValue("slug", slug);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            {...register("title", { required: "Title is required" })} 
            onBlur={generateSlug}
            placeholder="Enter blog title" 
          />
          {errors.title && <p className="text-destructive text-xs">{errors.title.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input 
            id="slug" 
            {...register("slug", { required: "Slug is required" })} 
            placeholder="enter-blog-slug" 
          />
          {errors.slug && <p className="text-destructive text-xs">{errors.slug.message as string}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register("category", { required: "Category is required" })} placeholder="e.g. Interview Tips" />
          {errors.category && <p className="text-destructive text-xs">{errors.category.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author", { required: "Author is required" })} placeholder="Your Name" />
          {errors.author && <p className="text-destructive text-xs">{errors.author.message as string}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="readTime">Read Time</Label>
          <Input id="readTime" {...register("readTime")} placeholder="e.g. 5 min read" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt (Brief Summary)</Label>
        <Textarea id="excerpt" {...register("excerpt")} placeholder="Write a short summary..." rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown or Plain Text)</Label>
        <Textarea id="content" {...register("content", { required: "Content is required" })} placeholder="Write your blog content here..." rows={10} />
        {errors.content && <p className="text-destructive text-xs">{errors.content.message as string}</p>}
      </div>

      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="flex items-center gap-4">
          <div className="relative h-32 w-48 rounded-xl border-2 border-dashed border-border/50 overflow-hidden bg-muted flex items-center justify-center">
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => { setImagePreview(null); setSelectedFile(null); }}
                  className="absolute top-1 right-1 bg-background/80 p-1 rounded-full text-foreground hover:bg-background"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Upload size={24} />
                <span className="text-xs font-bold">Upload Image</span>
              </Label>
            )}
          </div>
          <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="isPublished" 
          {...register("isPublished")} 
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="isPublished">Publish immediately</Label>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full md:w-auto px-8 rounded-xl bg-primary text-white font-bold h-12"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {initialData ? "Update Blog Post" : "Create Blog Post"}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
