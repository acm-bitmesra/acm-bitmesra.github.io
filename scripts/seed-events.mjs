import * as dotenv from "dotenv";
dotenv.config();
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function seedEvents() {
  console.log("🌱 Seeding chapter_events in Neon...");

  const hacktoberfest = {
    id: "evt_hacktoberfest_2026",
    slug: "hacktoberfest-2026",
    title: "Hacktoberfest 2026",
    tagline: "Build. Experiment. Share.",
    description: "Hacktoberfest 2026 is here. This October, ACM BIT Mesra invites students and developers to explore open source, experiment with AI and open-weight models, and build something meaningful.\n\nLearn, build, experiment, and showcase what you create throughout the month.",
    category: "FLAGSHIP",
    status: "UPCOMING",
    startDate: new Date("2026-10-01T00:00:00.000Z"),
    endDate: new Date("2026-10-31T23:59:59.000Z"),
    location: "Online & BIT Mesra Campus, Ranchi",
    isOnline: true,
    registrationUrl: "/events/hacktoberfest-2026",
    bannerUrl: "/images/events/hacktoberfest-2026-og.png",
    featured: true,
    tags: JSON.stringify([
      "Open Source",
      "Hacktoberfest",
      "AI",
      "Open-Weight Models",
      "Developer Community",
      "Building & Experimentation"
    ])
  };

  try {
    await sql`
      INSERT INTO chapter_events (
        id, slug, title, tagline, description, category, status,
        start_date, end_date, location, is_online, registration_url,
        banner_url, featured, tags, created_at, updated_at
      ) VALUES (
        ${hacktoberfest.id},
        ${hacktoberfest.slug},
        ${hacktoberfest.title},
        ${hacktoberfest.tagline},
        ${hacktoberfest.description},
        ${hacktoberfest.category},
        ${hacktoberfest.status},
        ${hacktoberfest.startDate},
        ${hacktoberfest.endDate},
        ${hacktoberfest.location},
        ${hacktoberfest.isOnline},
        ${hacktoberfest.registrationUrl},
        ${hacktoberfest.bannerUrl},
        ${hacktoberfest.featured},
        ${hacktoberfest.tags}::jsonb,
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        tagline = EXCLUDED.tagline,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        location = EXCLUDED.location,
        is_online = EXCLUDED.is_online,
        registration_url = EXCLUDED.registration_url,
        banner_url = EXCLUDED.banner_url,
        featured = EXCLUDED.featured,
        tags = EXCLUDED.tags,
        updated_at = NOW();
    `;

    console.log("✅ Successfully seeded Hacktoberfest 2026 into chapter_events!");

    // Verify row
    const [row] = await sql`SELECT id, slug, title, status FROM chapter_events WHERE slug = 'hacktoberfest-2026'`;
    console.log("Verified in DB:", row);
  } catch (err) {
    console.error("❌ Failed to seed event:", err);
    process.exit(1);
  }
}

seedEvents();
