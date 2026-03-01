import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaDribbble,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#202430] text-white pt-12 font-epilogue">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6 py-6">
          {/* Logo and Description */}
          <div className="col-span-4 flex flex-col gap-6 max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/brand-logo.svg"
                alt="QuickHire"
                width={32}
                height={32}
                className=""
              />
              <span className="text-2xl font-bold tracking-tight font-clash">
                QuickHire
              </span>
            </Link>
            <p className="text-[#ABB3C7] text-base leading-relaxed">
              Great platform for the job seeker that passionate about startups.
              Find your dream job easier.
            </p>
          </div>

          {/* About Links */}
          <div className="col-span-2 flex flex-col gap-6">
            <h3 className="text-lg font-bold">About</h3>
            <ul className="flex flex-col gap-4 text-[#D6DDEB]">
              <li>
                <Link
                  href="/companies"
                  className="hover:text-white transition-colors"
                >
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/advice"
                  className="hover:text-white transition-colors"
                >
                  Advice
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-2 flex flex-col gap-6">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="flex flex-col gap-4 text-[#D6DDEB]">
              <li>
                <Link
                  href="/docs"
                  className="hover:text-white transition-colors"
                >
                  Help Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="hover:text-white transition-colors"
                >
                  Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/updates"
                  className="hover:text-white transition-colors"
                >
                  Updates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-4 flex flex-col gap-6">
            <h3 className="text-lg font-bold">Get job notifications</h3>
            <p className="text-[#ABB3C7] text-base">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Email Address"
                className="bg-white text-zinc-900 px-4 py-3 outline-none grow min-w-0"
              />
              <button className="bg-[#4640DE] hover:bg-[#3b36c0] text-white px-6 py-3 font-bold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-zinc-700/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#ABB3C7] text-sm md:text-base">
            2021 @ QuickHire. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="p-2 rounded-full bg-zinc-600/70 flex items-center justify-center hover:bg-[#4640DE] transition-all"
            >
              <FaFacebookF size={18} className="text-white" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-full bg-zinc-600/70 flex items-center justify-center hover:bg-[#4640DE] transition-all"
            >
              <FaInstagram size={18} className="text-white" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-full bg-zinc-600/70 flex items-center justify-center hover:bg-[#4640DE] transition-all"
            >
              <FaDribbble size={18} className="text-white" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-full bg-zinc-600/70 flex items-center justify-center hover:bg-[#4640DE] transition-all"
            >
              <FaLinkedinIn size={18} className="text-white" />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-full bg-zinc-600/70 flex items-center justify-center hover:bg-[#4640DE] transition-all"
            >
              <FaTwitter size={18} className="text-white" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
