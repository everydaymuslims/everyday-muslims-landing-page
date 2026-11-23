"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const messages = {
  success: "You’re on the list. We’ll be in touch when we launch.",
  invalid: "Enter a valid email address.",
  error: "We couldn’t save your email. Please try again.",
};

export function Newsletter({ initialStatus }) {
  const [reducedMotion, setReducedMotion] = useState(true);
  const [status, setStatus] = useState(
    Object.hasOwn(messages, initialStatus) ? initialStatus : "idle"
  );
  const [submitting, setSubmitting] = useState(false);
  const email = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(media.matches);
    syncMotionPreference();
    media.addEventListener("change", syncMotionPreference);
    return () => media.removeEventListener("change", syncMotionPreference);
  }, []);

  async function subscribe(event) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus("idle");
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (response.ok) {
        setStatus("success");
        form.reset();
      } else if (response.status === 400) {
        setStatus("invalid");
        email.current?.focus();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="newsletter" className="newsletter">
      <form action="/api/newsletter" method="post" onSubmit={subscribe}>
        <label htmlFor="launch-email">Get the launch email</label>
        <div className="form-row grid">
          <input
            id="launch-email"
            name="email"
            type="email"
            inputMode="email"
            placeholder="Your email address"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={254}
            required
            ref={email}
            aria-describedby="newsletter-note newsletter-feedback"
            aria-invalid={status === "invalid" ? true : undefined}
            onChange={() => {
              if (status !== "idle") setStatus("idle");
            }}
          />
          <motion.button
            className="submit-button inline-flex items-center justify-center"
            type="submit"
            disabled={submitting}
            whileHover={reducedMotion || submitting ? undefined : { y: -2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            {submitting ? "Saving…" : "Notify me"}
            <span aria-hidden="true">→</span>
          </motion.button>
        </div>
        <p id="newsletter-note" className="newsletter-note">
          For parents and grown-ups. First looks and launch updates.
        </p>
        <p id="newsletter-feedback" className="newsletter-feedback" data-state={status} role="status">
          {messages[status] ?? ""}
        </p>
      </form>
    </div>
  );
}
