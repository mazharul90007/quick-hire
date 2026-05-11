"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, Search, Briefcase, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/useBlog";
import { BlogFilters } from "@/types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Interview Tips", "Career Advice", "Design", "Finance", "Leadership"];

export default function BlogsPage() {
  const [filters, setFilters] = useState<BlogFilters>({
    page: 1,
    limit: 12,
  });

  const { data: blogsData, isLoading } = useBlogs(filters);
  const blogPosts = blogsData?.data || [];

  const handleCategoryChange = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat === "All" ? undefined : cat, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-background font-epilogue">
      {/* Hero Section */}
      <section className="relative min-h-[380px] lg:min-h-[420px] overflow-hidden flex items-center">
        <div
            className="absolute inset-0"
            aria-hidden
            style={{
            background: `
                radial-gradient(ellipse 100% 80% at 10% 20%, var(--primary), transparent 55%),
                radial-gradient(ellipse 80% 60% at 90% 10%, var(--secondary), transparent 50%),
                oklch(0.99 0.004 240)
            `,
            opacity: 0.1,
            }}
        />
        <div className="absolute inset-0 opacity-[0.35] mix-blend-soft-light pointer-events-none">
            <Image
            src="/assets/images/Pattern.svg"
            alt=""
            fill
            className="object-cover object-center"
            priority
            />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6 py-16">
          <div className="max-w-3xl space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-clash text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight"
            >
              Career <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Blog</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Expert advice, industry trends, and practical strategies curated to help you land your dream role and grow professionally.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-4"
            >
               <form 
                  onSubmit={(e) => e.preventDefault()}
                  className="rounded-2xl border border-border/50 bg-white/90 p-2 shadow-xl backdrop-blur-md flex items-center max-w-xl"
               >
                 <div className="flex flex-1 items-center gap-3 px-3">
                   <Search className="text-primary h-5 w-5 shrink-0" />
                   <input 
                    type="text" 
                    placeholder="Search articles..." 
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm font-epilogue py-2.5"
                   />
                 </div>
                 <Button className="rounded-xl font-bold bg-primary hover:brightness-110 text-white shadow-lg shadow-primary/20 px-8 h-11">
                   Search
                 </Button>
               </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Categories Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground/80">
              <Filter size={18} className="text-primary" />
              <span>Browse by Category:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition-all whitespace-nowrap border ${
                    (cat === "All" && !filters.category) || filters.category === cat
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" 
                    : "bg-white/50 text-foreground border-border/50 hover:bg-white hover:border-primary/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col gap-4">
                        <div className="aspect-video w-full rounded-2xl bg-muted animate-pulse"></div>
                        <div className="h-6 w-3/4 bg-muted animate-pulse rounded-lg"></div>
                        <div className="h-4 w-full bg-muted animate-pulse rounded-lg"></div>
                      </div>
                  ))}
              </motion.div>
            ) : blogPosts.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-card rounded-3xl border border-dashed border-border"
              >
                  <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-clash">No articles found</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your filters or search keywords.</p>
                  <Button 
                    variant="link" 
                    onClick={() => setFilters({ page: 1, limit: 12 })}
                    className="text-primary font-bold mt-2"
                  >
                    Clear all filters
                  </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      {post.image ? (
                          <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 bg-muted">
                              <Briefcase size={40} />
                          </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-md text-primary text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-primary" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.readTime && (
                            <span className="flex items-center gap-1.5">
                              <Clock size={12} className="text-primary" />
                              {post.readTime}
                            </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold font-clash text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        <Link href={`/blogs/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="pt-4 flex items-center justify-between border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <User size={14} strokeWidth={2.5} />
                          </div>
                          <span className="text-xs font-bold text-foreground/80">{post.author}</span>
                        </div>
                        <Link 
                          href={`/blogs/${post.slug}`}
                          className="text-primary hover:text-secondary transition-colors"
                        >
                          <ArrowRight size={20} />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          {!isLoading && blogPosts.length > 0 && (
            <div className="mt-16 flex justify-center">
              <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-border/50 shadow-sm">
                <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 bg-primary text-white hover:bg-primary/90" disabled>1</Button>
                <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary font-bold transition-all">2</Button>
                <Button variant="ghost" className="rounded-xl h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary font-bold transition-all">3</Button>
                <span className="px-2 text-muted-foreground font-bold">...</span>
                <Button variant="ghost" className="rounded-xl px-4 h-10 flex items-center gap-2 hover:bg-primary/10 hover:text-primary font-bold transition-all">
                  Next <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
