"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, User, Briefcase } from "lucide-react";
import Heading from "../shared/Heading";
import { useBlogs } from "@/hooks/useBlog";
import { motion } from "framer-motion";

const BlogSection = () => {
  const { data: blogsData, isLoading } = useBlogs({ limit: 3 });
  const featuredBlogs = blogsData?.data || [];

  if (!isLoading && featuredBlogs.length === 0) return null;

  return (
    <section className="py-20 bg-background font-epilogue">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <Heading first="Career" second="Insights" />
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Stay updated with the latest industry news, career tips, and hiring trends.
            </p>
          </div>
          <Link
            href="/blogs"
            className="group flex items-center gap-2 text-primary font-bold hover:text-secondary transition-all"
          >
            Explore all articles
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                      <div className="aspect-video w-full rounded-2xl bg-muted animate-pulse"></div>
                      <div className="h-6 w-3/4 bg-muted animate-pulse rounded-lg"></div>
                      <div className="h-4 w-full bg-muted animate-pulse rounded-lg"></div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
            </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
