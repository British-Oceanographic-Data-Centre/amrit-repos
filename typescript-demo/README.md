This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Docker image is available publicly using `docker pull ghcr.io/british-oceanographic-data-centre/amrit-repos/typescript/app:{TAG}`.

## Getting Started


First, install dependencies:

```bash
npm run install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Linting

To lint the code base, after doing `npm install` use the command `npm run lint`.

## Testing

To test the code base, you can run Unit tests with Jest and E2E tests with Cypress.

Add unit *.test.tsx test files in `/__tests__/` and run them with:

```bash
npm test
```

Add E2E *.cy.js test files in `/cypress/e2e/` and run them with:

```bash
npm run cypress:run
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
