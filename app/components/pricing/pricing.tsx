"use client";
import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Check } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { api } from "@/app/config/axios";
import { motion } from "motion/react";

interface Plan {
  id: string;
  name: string;
  price: string;
  credits: number;
  description: string;
  features: string[];
}
const pricing = () => {
  const projects = [
    {
      id: "basic",
      name: "Basic",
      price: "$5",
      credits: 100,
      description: "Start Now, scale up as you grow.",
      features: [
        "Upto 20 Creations",
        "Limited Revisions",
        "Basic AI Models",
        "Email support",
        "Basic analytics",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19",
      credits: 400,
      description: "Add credits to create more projects",
      features: [
        "Upto 80 Creations",
        "Extended Revisions",
        "Advanced AI Models",
        "Priority email support",
        "Advanced analytics",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49",
      credits: 1000,
      description: "Add credits to create more projects",
      features: [
        "Upto 200 Creations",
        "Increased Revisions",
        "Advanced AI Models",
        "Email + chat support",
        "Advanced analytics",
      ],
    },
  ];
  const { data: session } = authClient.useSession();
  const [plans] = React.useState<Plan[]>(projects);

  const handlePurchase = async (planId: string) => {
    try {
      if (!session?.user) return toast("Please login to purchase the credits.");
      const { data } = await api.post("/api/user/purchase-credits", { planId });
      window.location.href = data.payment_link;
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <div className="backdrop-blur-md min-h-screen overflow-hidden">
        <Navbar />
        <div className="relative max-w-5xl mx-auto mb-20 max-md:px-4 py-8 min-h-20 text-center">
          <div className="absolute size-120 top-20 blur-[200px] left-1/2 -z-60 sm:left-1/5 bg-linear-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#3a3a3a] opacity-30 pointer-events-none" />
          <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -top-32 -left-32" />
          <div className="absolute w-64 h-64 bg-[#00f3ff] rounded-full filter blur-3xl opacity-20 -bottom-10 -right-32" />
          <div className="relative space-y-1 flex flex-col justify-center items-center text-center">
            <h1 className="text-2xl">Choose Your Plan</h1>
            <p className="max-w-md text-md text-gray-400">
              Start for free and scale up as you grow. Find the perfect plan for
              your content creation needs
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.2 }}
            viewport={{ once: false }}
            className="relative flex flex-wrap w-full gap-4 mx-auto items-center justify-center"
          >
            {projects.map((project) => {
              return (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                  key={project.id}
                  className="px-6 py-7 bg-black/40 text-start my-10 border border-primary/30 hover:border-primary transition-all duration-500 w-76"
                >
                  <h1 className="font-bold text-lg">{project.name}</h1>
                  <p className="pt-2 space-x-1">
                    <span className="text-4xl font-bold">{project.price}</span>
                    <span className="text-gray-300">
                      / {project.credits} credits
                    </span>
                  </p>
                  <p className="pt-1 mb-6 text-gray-300">
                    {project.description}
                  </p>
                  <p>
                    {project.features.map((feature, index) => (
                      <p key={index} className="text-gray-400 flex gap-2">
                        <span>
                          <Check className="w-5" />
                        </span>
                        <span>{feature}</span>
                      </p>
                    ))}
                  </p>
                  <button
                    onClick={() => handlePurchase(project.id)}
                    className="bg-primary flex items-center text-white/80 font-semibold justify-center w-full mt-4 py-1 rounded-md"
                  >
                    Buy Now
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="relative space-y-1 my-2 flex flex-col justify-center items-center text-center">
            <p className="max-w-md text-md text-gray-400">
              Project <span className="text-white/90">Creation / Revision</span>{" "}
              consume <span className="text-white/90">5 credits.</span> You can
              purchase more credits to create more projects.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default pricing;
