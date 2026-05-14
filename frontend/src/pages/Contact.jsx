import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import PageContainer from "../components/layout/PageContainer";
import SectionHeader from "../components/layout/SectionHeader";
import Button from "../components/ui/Button";
import { contactApi } from "../services/api/contactApi"; // adjust path

export default function Contact() {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // IMPORTANT: convert to FormData (because backend expects FormData)
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("subject", form.subject);
      formData.append("message", form.message);

      // API CALL 👇
      await contactApi.sendContactForm(form);

      showToast("Message sent successfully 🚀", "success");

      setSent(true);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      showToast("Failed to send message ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <PageContainer narrow>
        <SectionHeader
          eyebrow="Get in Touch"
          title="Contact us"
          description="Have a question, feedback, or want to partner? We read every message."
          align="center"
        />

        {sent ? (
          <div className="surface rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display text-2xl font-bold text-[#1a1814]">
              Message sent!
            </h3>
            <p className="text-[#6b6358] mt-2">
              We'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="surface rounded-2xl p-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label>Name</label>
                <input
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  type="email"
                  className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label>Subject</label>
              <input
                className="input-field"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Message</label>
              <textarea
                className="input-field min-h-36 resize-none"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send message →"}
            </Button>
          </form>
        )}
      </PageContainer>
    </div>
  );
}
