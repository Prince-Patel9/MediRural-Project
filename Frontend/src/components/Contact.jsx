import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend or email service
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-2 sm:px-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10 rounded-3xl pointer-events-none -z-10"></div>
      <div className="w-full max-w-xl mx-auto backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-200">
        <h1 className="text-blue-600 text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-2"><strong>Email:</strong> <a href="mailto:support@medirural.com" className="text-blue-600 underline">support@medirural.com</a></p>
        <p className="mb-2"><strong>Phone:</strong> +91-9876543210</p>
        <p className="mb-2"><strong>Office Address:</strong><br />MediRural Private Limited<br />Surat Gujrat India</p>
        <p className="mb-4"><strong>Customer Support Hours:</strong> Monday to Saturday, 9am to 6pm</p>
        <div className="mb-4">
          <strong>Follow us:</strong>
          <span className="ml-3 space-x-3">
            <a href="/facebook" className="text-blue-600"><i className="fa-brands fa-facebook"></i></a>
            <a href="/instagram" className="text-blue-600"><i className="fa-brands fa-instagram"></i></a>
            <a href="/linkedin" className="text-blue-600"><i className="fa-brands fa-linkedin"></i></a>
          </span>
        </div>
        <h2 className="text-blue-600 text-xl font-semibold mt-6 mb-2">Send us a message</h2>
        {submitted ? (
          <div className="text-green-600 mt-4">Thank you for contacting us! We will get back to you soon.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-3">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-semibold text-base mt-2 transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact; 