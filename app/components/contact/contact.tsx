"use client";
import { useState } from "react";
import Navbar from "../navbar";
import { toast } from "sonner";
import { motion } from "motion/react";
import Footer from "../footer";

const contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event: any) => {
    event.preventDefault();

    const loadingMsg = toast.loading("Sending....");

    const formData = new FormData(event.target);
    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB_3_FORMS_SECRET as string,
    );

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    toast.dismiss(loadingMsg);
    if (data.success) {
      toast.success("Form Submitted Successfully");
      event.target.reset();
    } else {
      toast.error("Error");
    }
  };
  return (
    <div className="relative backdrop-blur-md min-h-screen overflow-hidden">
      <Navbar />
      <div className="relative pointer-events-auto max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto w-full">
        <div className="absolute size-100 top-50 blur-[250px] -z-20 left-1/5 w-1/2 bg-primary pointer-events-none" />
        <form
          onSubmit={onSubmit}
          className="relative pointer-events-auto flex flex-col justify-center text-white mx-auto w-full"
        >
          <div className="space-y-2 flex flex-col justify-center items-center mb-6 text-center w-full">
            <h1 className="text-2xl">Contact Us</h1>
            <p className="text-center max-w-md text-md text-gray-400">
              Get in touch with us <br />
              You can connect with us for your problem. We will help you if any
              issues you face.
            </p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.2 }}
            viewport={{ once: false }}
            className="flex flex-col sm:flex-row  justify-center items-start pt-6 gap-8"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
              className="py-2 flex flex-col gap-2 w-full"
            >
              <label htmlFor="">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Enter your name"
                required
                className="bg-white px-3 py-2 mb-2.5 rounded-sm text-black"
              />
              <label htmlFor="">Contact</label>
              <input
                name="contact"
                type="text"
                placeholder="Enter your contact"
                required
                className="bg-white px-3 py-2 mb-2.5 rounded-sm text-black"
              />
              <label htmlFor="">Email</label>
              <input
                name="email"
                type="text"
                placeholder="Enter your email"
                required
                className="bg-white px-3 py-2 mb-2.5 rounded-sm text-black"
              />
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center h-70 w-full gap-2"
            >
              <label htmlFor="">Message</label>
              <textarea
                name="message"
                placeholder="Enter your message"
                id=""
                required
                className="bg-white px-3 py-2 mb-5 h-full rounded-sm text-black"
              ></textarea>
            </motion.div>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            type="submit"
            className="bg-primary/90 py-2 px-3 rounded-md my-2 mb-16 flex items-center justify-center"
          >
            Submit
          </motion.button>
        </form>
      </div>
      <Footer />
    </div>
  );
};
export default contact;
