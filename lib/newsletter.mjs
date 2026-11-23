import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

export function normaliseEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim();
  if (email.length > 254) return null;
  const [local, domain] = email.split("@");
  if (!local || local.length > 64 || !domain || email.indexOf("@") !== email.lastIndexOf("@")) {
    return null;
  }
  const localPart = /^[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*$/i;
  const domainPart = /^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i;
  return localPart.test(local) && domainPart.test(domain) ? email.toLowerCase() : null;
}

export function openNewsletter({ readOnly = false } = {}) {
  const path = resolve(process.env.NEWSLETTER_DB_PATH || ".data/newsletter.sqlite");
  if (!readOnly) mkdirSync(dirname(path), { recursive: true });

  const database = new DatabaseSync(path, { readOnly, timeout: 5000 });
  if (readOnly) return database;

  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS subscribers (
        email TEXT PRIMARY KEY,
        subscribed_at TEXT NOT NULL
      ) STRICT;
    `);
    return database;
  } catch (error) {
    database.close();
    throw error;
  }
}

export function saveSubscription(email) {
  const database = openNewsletter();
  try {
    database.prepare(`
      INSERT INTO subscribers (email, subscribed_at) VALUES (?, ?)
      ON CONFLICT (email) DO NOTHING
    `).run(email, new Date().toISOString());
  } finally {
    database.close();
  }
}
