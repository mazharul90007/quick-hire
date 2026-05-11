export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "10 Tips to Ace Your Technical Interview",
    excerpt: "Technical interviews can be daunting. Learn the best strategies to showcase your coding skills and problem-solving abilities.",
    category: "Interview Tips",
    author: "Sarah Johnson",
    date: "May 10, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    title: "The Future of Remote Work in 2024",
    excerpt: "Remote work is evolving. Discover the latest trends and how to stay productive while working from anywhere in the world.",
    category: "Career Advice",
    author: "David Chen",
    date: "May 08, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "3",
    title: "How to Build a Portfolio That Gets You Hired",
    excerpt: "Your portfolio is your silent salesperson. Learn how to curate your best work and present it in a way that catches a recruiter's eye.",
    category: "Design",
    author: "Emily White",
    date: "May 05, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "4",
    title: "Navigating Career Transitions Successfully",
    excerpt: "Switching careers? Here's a step-by-step guide on how to leverage your transferable skills and land your dream role in a new industry.",
    category: "Career Advice",
    author: "Michael Brown",
    date: "May 01, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1454165833767-027ffea7025c?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "5",
    title: "Understanding Stock Options and Equity",
    excerpt: "Joining a startup? Make sure you understand the nuances of equity, vesting schedules, and what they mean for your financial future.",
    category: "Finance",
    author: "Robert Wilson",
    date: "April 28, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "6",
    title: "Mastering Soft Skills for Modern Leadership",
    excerpt: "Leadership isn't just about technical expertise. Discover why empathy and communication are the most critical skills for leaders today.",
    category: "Leadership",
    author: "Jessica Lee",
    date: "April 25, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=60",
  }
];
