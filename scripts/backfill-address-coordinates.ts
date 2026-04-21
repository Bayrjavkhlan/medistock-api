import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const REQUEST_DELAY_MS = 1200;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const geocodeAddress = async (
  query: string,
  cache: Map<string, { lat: number; lon: number } | null>
) => {
  if (cache.has(query)) return cache.get(query) ?? null;

  const response = await fetch(
    `${NOMINATIM_URL}?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
    {
      headers: {
        "User-Agent": "medistock-backfill/1.0 (admin script)",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status}) for "${query}"`);
  }

  const result = (await response.json()) as Array<{ lat: string; lon: string }>;
  const first = result[0];
  if (!first) {
    cache.set(query, null);
    return null;
  }

  const value = {
    lat: Number(first.lat),
    lon: Number(first.lon),
  };

  if (!Number.isFinite(value.lat) || !Number.isFinite(value.lon)) {
    cache.set(query, null);
    return null;
  }

  cache.set(query, value);
  return value;
};

const main = async () => {
  if (process.env.BACKFILL_COORDS_CONFIRM !== "yes") {
    console.error(
      "Abort: set BACKFILL_COORDS_CONFIRM=yes to run this admin-only script."
    );
    process.exit(1);
  }

  const addresses = await prisma.address.findMany({
    where: {
      OR: [{ latitude: null }, { longitude: null }],
    },
    orderBy: { createdAt: "asc" },
  });

  const cache = new Map<string, { lat: number; lon: number } | null>();
  let updated = 0;
  let skipped = 0;

  for (const address of addresses) {
    const query = [address.address1, address.address2, address.province, "Mongolia"]
      .filter(Boolean)
      .join(", ");

    try {
      const result = await geocodeAddress(query, cache);
      if (!result) {
        skipped += 1;
        continue;
      }

      await prisma.address.update({
        where: { id: address.id },
        data: {
          latitude: result.lat,
          longitude: result.lon,
        },
      });

      updated += 1;
      await sleep(REQUEST_DELAY_MS);
    } catch (error) {
      console.error(`Failed for address ${address.id}:`, error);
      skipped += 1;
    }
  }

  console.log(
    `Backfill finished. Updated: ${updated}, skipped: ${skipped}, total: ${addresses.length}`
  );
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

