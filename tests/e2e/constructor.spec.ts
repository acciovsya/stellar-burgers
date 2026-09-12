import { test, expect, Locator, Page } from '@playwright/test';

const getIngredientId = async (card: Locator): Promise<string> => {
  const testId = await card.getAttribute('data-testid');
  return testId!.replace(/^ingredient-/, '');
};

test.describe('Страница конструктора бургера', () => {
  test.describe('Добавление ингредиента в конструктор', () => {
    test.beforeEach(async ({ page, context }) => {
      await context.routeFromHAR('tests/hars/ingredients.har', {
        url: '**/ingredients'
      });

      await page.goto('/', { waitUntil: 'domcontentloaded' });

      await expect(
        page
          .getByTestId('ingredients-list-bun')
          .getByTestId(/^ingredient-/)
          .first()
      ).toBeAttached();
    });

    test('добавляется булка', async ({ page }) => {
      await page
        .getByTestId('ingredients-list-bun')
        .getByTestId(/^ingredient-/)
        .first()
        .getByRole('button', { name: 'Добавить' })
        .click();

      await expect(page.getByTestId('constructor-bun-top')).toBeVisible();
      await expect(page.getByTestId('constructor-bun-bottom')).toBeVisible();
    });

    test('добавляется начинка', async ({ page }) => {
      const filling = page
        .getByTestId('ingredients-list-main')
        .getByTestId(/^ingredient-/)
        .first();
      const fillingId = await getIngredientId(filling);

      await filling.getByRole('button', { name: 'Добавить' }).click();

      await expect(
        page
          .getByTestId('constructor-ingredients-list')
          .getByTestId(`constructor-ingredient-${fillingId}`)
      ).toBeVisible();
    });
  });

  test.describe('Модальное окно ингредиента', () => {
    test.beforeEach(async ({ page, context }) => {
      await context.routeFromHAR('tests/hars/ingredients.har', {
        url: '**/ingredients'
      });

      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(
        page
          .getByTestId('ingredients-list-bun')
          .getByTestId(/^ingredient-/)
          .first()
      ).toBeAttached();
    });

    test('открывается по клику и показывает данные именно выбранного ингредиента', async ({
      page
    }) => {
      const card = page.getByTestId(/^ingredient-/).nth(1);
      const ingredientId = await getIngredientId(card);

      await card.click();

      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible();
      await expect(
        modal.getByTestId(`ingredient-details-${ingredientId}`)
      ).toBeVisible();
    });

    test('закрывается по клику на крестик', async ({ page }) => {
      await page
        .getByTestId(/^ingredient-/)
        .first()
        .click();

      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible();

      await page.getByTestId('modal-close-button').click();
      await expect(modal).not.toBeVisible();
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      await page
        .getByTestId(/^ingredient-/)
        .first()
        .click();

      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible();

      await page
        .getByTestId('modal-overlay')
        .click({ position: { x: 5, y: 5 } });
      await expect(modal).not.toBeVisible();
    });
  });

  test.describe('Создание заказа', () => {
    test.beforeEach(async ({ page, context }) => {
      await context.addCookies([
        {
          name: 'accessToken',
          value: 'Bearer fake-access-token',
          url: 'http://localhost:4000'
        }
      ]);
      await page.addInitScript(() => {
        window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      });

      await context.routeFromHAR('tests/hars/ingredients.har', {
        url: '**/ingredients'
      });
      await context.routeFromHAR('tests/hars/user.har', {
        url: '**/auth/user'
      });
      await context.routeFromHAR('tests/hars/order.har', {
        url: '**/orders'
      });

      await page.goto('/', { waitUntil: 'domcontentloaded' });

      await expect(page.getByText('e2e-test')).toBeVisible();

      await expect(
        page
          .getByTestId('ingredients-list-bun')
          .getByTestId(/^ingredient-/)
          .first()
      ).toBeAttached();
    });

    const addBun = async (page: Page) => {
      await page
        .getByTestId('ingredients-list-bun')
        .getByTestId(/^ingredient-/)
        .first()
        .getByRole('button', { name: 'Добавить' })
        .click();
    };

    const addMain = async (page: Page) => {
      await page
        .getByTestId('ingredients-list-main')
        .getByTestId(/^ingredient-/)
        .first()
        .getByRole('button', { name: 'Добавить' })
        .click();
    };

    const addSauce = async (page: Page) => {
      await page
        .getByTestId('ingredients-list-sauce')
        .getByTestId(/^ingredient-/)
        .first()
        .getByRole('button', { name: 'Добавить' })
        .click();
    };

    test('создаёт заказ: отправляет выбранные ингредиенты, показывает номер и очищает конструктор', async ({
      page
    }) => {
      const bunId = await getIngredientId(
        page
          .getByTestId('ingredients-list-bun')
          .getByTestId(/^ingredient-/)
          .first()
      );
      const mainId = await getIngredientId(
        page
          .getByTestId('ingredients-list-main')
          .getByTestId(/^ingredient-/)
          .first()
      );
      const sauceId = await getIngredientId(
        page
          .getByTestId('ingredients-list-sauce')
          .getByTestId(/^ingredient-/)
          .first()
      );

      await addBun(page);
      await addMain(page);
      await addSauce(page);

      const [request] = await Promise.all([
        page.waitForRequest(
          (req) => req.url().includes('/orders') && req.method() === 'POST'
        ),
        page.waitForResponse(
          (res) =>
            res.url().includes('/orders') && res.request().method() === 'POST'
        ),
        page.getByTestId('order-panel').locator('button').click()
      ]);

      const body = JSON.parse(request.postData()!);
      expect(body.ingredients).toEqual([bunId, mainId, sauceId, bunId]);

      const modal = page.getByTestId('modal');
      await expect(modal).toBeVisible();
      await expect(page.getByTestId('order-number')).toHaveText('110107');

      await expect(
        page.getByTestId('constructor-ingredients-list')
      ).toContainText('Выберите начинку');

      await page.getByTestId('modal-close-button').click();
      await expect(modal).not.toBeVisible();
    });
  });
});
