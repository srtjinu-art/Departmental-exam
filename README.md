# Train Man

Railway departmental exam PDF library for Netlify. Public visitors can search, filter and view PDFs. Only the Netlify Identity account matching `ADMIN_EMAIL` can upload or delete.

## Publish on Netlify

1. Push this directory to a Git repository, then create a Netlify project from that repository. Netlify reads `netlify.toml` and runs `npm run build`.
2. In Netlify, enable **Identity** for the project. Set registration to **Invite only**. Invite your own email address and complete the invite.
3. In **Project configuration → Environment variables**, add `ADMIN_EMAIL` with that same email address, then trigger a fresh deploy. Keep this value private; never place passwords in source code.
4. Open the deployed HTTPS site, select **Admin login**, sign in, and upload PDFs. PDF files are limited to 4 MB per upload because of the Netlify Function request limit.

For local development, run `npm install` and `npm run dev` after linking the project with `netlify login` and `netlify link`. `npm run build` checks the frontend independently, but authentication and uploads require a deployed Netlify project or `netlify dev` connected to it.
