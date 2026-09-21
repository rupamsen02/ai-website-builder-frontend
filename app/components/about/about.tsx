"use client";
import Navbar from "../navbar";
import { motion } from "motion/react";
import Footer from "../footer";
import Faqs from "../faqs";

const about = () => {
  return (
    <div className="min-h-screen overflow-hidden backdrop-blur-md">
      <Navbar />
      <div className="relative pointer-events-auto mx-auto max-w-3xl w-full my-4 flex flex-col justify-center items-center space-y-6">
        <div className="absolute size-100 top-60 blur-[250px] -z-20 left-1/5 w-1/2 bg-primary pointer-events-none" />
        <h1 className="text-2xl text-center">About Us</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative pointer-events-auto flex flex-col space-y-4 mb-10 justify-center items-start"
        >
          <label className="text-lg text-gray-400/80">
            Build Websites. Powered by AI.
          </label>
          <p className="mb-10 leading-7">
            Welcome to Web Builder, an AI-powered website creation platform
            designed to make building modern websites faster, simpler, and more
            accessible. Our platform allows users to turn their ideas into fully
            designed websites simply by describing what they want. Instead of
            starting from scratch, users can provide a natural-language prompt,
            and our AI-powered system transforms that idea into a functional,
            responsive website.
          </p>
          <label className="text-lg text-gray-400/80">Our Technology</label>
          <p className="mb-10 leading-7">
            Web Builder is built using modern web technologies to provide a
            fast, reliable, and scalable experience. Next.js & TypeScript — Used
            to build a modern, fast, and type-safe frontend experience. React —
            Powers the interactive user interface and dynamic website-building
            experience. Node.js & Express.js — Handles backend services, APIs,
            authentication, project management, and server-side operations.
            OpenRouter — Provides the AI model infrastructure that connects our
            application with powerful language models. Poolside AI – Laguna
            S-2.1-free — Our AI generation engine that understands user
            requirements and generates website code based on natural-language
            prompts. Prisma & PostgreSQL — Used for structured and reliable
            project and user data management.
          </p>
          <label className="text-lg text-gray-400/80">How It Works</label>
          <p className="mb-10 leading-7">
            Creating a website with Web Builder is simple: Describe → Generate →
            Customize → Preview → Publish Users describe the website they want,
            and our AI analyzes the requirements and generates the corresponding
            website code. The generated website can then be previewed,
            customized, saved as a project, and published.
          </p>
          <label className="text-lg text-gray-400/80">Our Goal</label>
          <p className="mb-10 leading-7">
            Our goal is to reduce the technical barrier to website development.
            We believe that creating a website should begin with an idea—not
            with complicated setup, frameworks, or hundreds of lines of code. By
            combining modern web development with generative AI, Web Builder
            aims to give users a faster way to transform their ideas into real
            websites.
          </p>
          <label className="text-lg text-gray-400/80">
            Built for Creativity
          </label>
          <p className="mb-5 leading-7">
            Whether you're creating a portfolio, landing page, business website,
            personal project, or experimenting with a new idea, Web Builder
            gives you a simple starting point and lets AI handle much of the
            technical implementation. We are continuously improving the platform
            to make AI-assisted website development more powerful, flexible, and
            accessible.
          </p>
          <p className="text-gray-400/80">
            Your idea is the starting point. Let AI build the web around it.
          </p>
        </motion.div>
      </div>
      <Faqs />
      <Footer />
    </div>
  );
};
export default about;
