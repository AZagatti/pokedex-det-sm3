import { expect, test } from "@playwright/test";

test.describe("Pokédex home page", () => {
  test("loads and shows pokemon cards", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Explore the Pokédex" })
    ).toBeVisible();
    await expect(page.getByTestId("pokemon-card").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("search filters the list", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search Pokémon").fill("pikachu");
    await expect(
      page.getByRole("heading", { exact: true, name: "Pikachu" })
    ).toBeVisible();
  });
});
