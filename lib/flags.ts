export const COUNTRY_TO_ISO2: Record<string, string> = {
  // Common F1 countries and aliases (normalized to lowercase)
  "australia": "au",
  "bahrain": "bh",
  "saudi arabia": "sa",
  "japan": "jp",
  "china": "cn",
  // United States variants
  "united states": "us",
  "united states of america": "us",
  "usa": "us",
  "u.s.a.": "us",
  "us": "us",
  // United Kingdom variants
  "united kingdom": "gb",
  "uk": "gb",
  "great britain": "gb",
  "britain": "gb",
  "england": "gb",
  "italy": "it",
  "monaco": "mc",
  "canada": "ca",
  "spain": "es",
  "austria": "at",
  "hungary": "hu",
  "belgium": "be",
  "netherlands": "nl",
  "singapore": "sg",
  "azerbaijan": "az",
  "qatar": "qa",
  "mexico": "mx",
  "brazil": "br",
  // United Arab Emirates variants
  "united arab emirates": "ae",
  "uae": "ae",
  "u.a.e.": "ae",
};

function normalizeCountryName(name: string): string {
  return name.trim().toLowerCase();
}

export function countryNameToISO2(countryName: string): string | undefined {
  const code = COUNTRY_TO_ISO2[normalizeCountryName(countryName)];
  return code;
}

/**
 * Derive an ISO2 country code from explicit country name if available,
 * otherwise parse it from a location string formatted like
 * "City, Country" or just "Country".
 */
export function getFlagCode(explicitCountry?: string, location?: string): string | undefined {
  if (explicitCountry) {
    const code = countryNameToISO2(explicitCountry);
    if (code) return code;
  }

  if (location) {
    const parts = location.split(",");
    const maybeCountry = parts[parts.length - 1]?.trim();
    if (maybeCountry) {
      const code = countryNameToISO2(maybeCountry);
      if (code) return code;
    }
  }

  return undefined;
}
