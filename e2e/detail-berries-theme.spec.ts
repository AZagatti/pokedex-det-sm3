import { expect, test } from "@playwright/test";

test.describe("Pokémon detail page", () => {
  test("shows stats and can favorite", async ({ page }) => {
    await page.goto("/pokemon/pikachu");
    await expect(
      page.getByRole("heading", { level: 1, name: "Pikachu" })
    ).toBeVisible();
    await expect(page.getByText("Base Stats")).toBeVisible();
    await page.getByRole("button", { name: /favorites/iu }).click();
    await page.goto("/favorites");
    await expect(page.getByRole("heading", { name: "Pikachu" })).toBeVisible();
  });
});

test.describe("Berries", () => {
  test("lists berries and opens detail", async ({ page }) => {
    await page.goto("/berries");
    await expect(page.getByRole("heading", { name: "Berries" })).toBeVisible();
    await page.getByRole("link", { name: /Cheri/u }).first().click();
    await expect(
      page.getByRole("heading", { name: "Cheri Berry" })
    ).toBeVisible();
  });
});

test.describe("Theme toggle", () => {
  test("switches between light and dark", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /switch to/iu });
    const before = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    await toggle.click();
    const after = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(before).not.toBe(after);
  });
});
