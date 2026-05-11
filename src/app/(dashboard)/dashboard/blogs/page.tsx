"use client";

import { useState } from "react";
import {
  useBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog
} from "@/hooks/useBlog";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Tag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import BlogForm from "@/components/dashboard/BlogForm";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Blog } from "@/types";

export default function AdminBlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const { data: blogsData, isLoading } = useBlogs({ searchTerm });
  const blogs = blogsData?.data || [];

  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();

  const handleCreate = (data: any) => {
    createBlogMutation.mutate(data, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const handleUpdate = (data: any) => {
    if (editingBlog) {
      updateBlogMutation.mutate({ id: editingBlog.id, payload: data }, {
        onSuccess: () => setEditingBlog(null),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post? This will also remove the image from Cloudinary.")) {
      deleteBlogMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-clash text-foreground">Manage Blogs</h1>
          <p className="text-muted-foreground font-epilogue mt-1">
            Create, edit, and manage your career articles and tips.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-primary text-white font-bold h-12 px-6 flex items-center gap-2 shadow-lg shadow-primary/20 hover:brightness-110">
              <Plus size={20} />
              Create New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-clash">Create Blog Post</DialogTitle>
            </DialogHeader>
            <BlogForm onSubmit={handleCreate} isLoading={createBlogMutation.isPending} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by title, content or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-muted/30 border border-border/30 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-epilogue"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border/50">
                <th className="px-6 py-4 font-bold text-sm text-foreground font-clash">Post</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground font-clash">Author & Category</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground font-clash">Status</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground font-clash">Date</th>
                <th className="px-6 py-4 font-bold text-sm text-foreground font-clash text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-12 bg-muted rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-epilogue">
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                          {blog.image ? (
                            <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                          ) : (
                            <Tag className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/30" size={20} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground truncate max-w-[300px] font-clash">{blog.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[300px] font-epilogue">/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
                          <User size={14} className="text-primary/70" />
                          {blog.author}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Tag size={14} className="text-primary/70" />
                          {blog.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {blog.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-100">
                          <CheckCircle size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-zinc-50 text-zinc-500 px-2.5 py-1 rounded-full text-xs font-bold border border-zinc-100">
                          <Clock size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground/80 font-epilogue">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg">
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem onClick={() => setEditingBlog(blog)} className="gap-2 cursor-pointer">
                            <Edit2 size={16} /> Edit Post
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer text-primary" asChild>
                            <a href={`/blogs/${blog.slug}`} target="_blank">
                              <Eye size={16} /> View Live
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(blog.id)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                          >
                            <Trash2 size={16} /> Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingBlog} onOpenChange={(open) => !open && setEditingBlog(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold font-clash">Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingBlog && (
            <BlogForm
              initialData={editingBlog}
              onSubmit={handleUpdate}
              isLoading={updateBlogMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
