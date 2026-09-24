# Lou Lou & Dylan — Perast celebration site

A one-page, mobile-first save-the-date, info hub and RSVP form.
Plain HTML, CSS and JavaScript. No build step: open `index.html` in a browser and it works.

## Where things live

| What | File |
|---|---|
| All the words on the page | `index.html` |
| WhatsApp numbers, form endpoint, house cost, deadlines | `js/config.js` |
| Colours, fonts, spacing | `css/style.css` (colours are at the very top) |
| Form behaviour, countdown, WhatsApp buttons | `js/main.js` |
| Link-preview image (WhatsApp card) | `assets/og-image.png`, generated from `tools/og-card.html` |
| "Add to calendar" files | `calendar/celebration.ics` and `calendar/perast-week.ics` |

## Filling in the placeholders

Open `js/config.js`. Every placeholder is there with a comment.

- **WhatsApp numbers**: one each for Lou Lou and Dylan, international format, digits only, e.g. `61412345678`. If one is left blank, that person's button is hidden.
- **House cost**: `HOUSE_COST_NOTE` is shown on the page as written.
- **Deadlines**: `HOUSE_EOI_DEADLINE` and `RSVP_DEADLINE` are plain text, so write them how you'd say them.

## Connecting the RSVP form (recommended: Formspree)

The simplest free option that gives you a spreadsheet-style inbox and an email per submission.

1. Go to formspree.io, sign up (free), and click **New form**. Name it "Perast RSVP".
2. Copy the form's endpoint. It looks like `https://formspree.io/f/abcdwxyz`.
3. Paste it into `FORM_ENDPOINT` in `js/config.js`.
4. Submit a test RSVP from the site. Formspree emails you on every submission and keeps them all in its dashboard, where you can export to CSV.

The free plan allows 50 submissions a month. If the guest list is bigger than that, either upgrade for one month around the RSVP deadline, or use the Google Sheets alternative below.

**Alternative: Google Sheets via Apps Script (free, unlimited).** Create a Google Sheet, open Extensions → Apps Script, paste a small `doPost` that appends the JSON fields to a row and calls `MailApp.sendEmail`, deploy as a Web App ("Anyone" can access), and put the web-app URL in `FORM_ENDPOINT`. More setup, but no limits and the answers land straight in a sheet.

While `FORM_ENDPOINT` is empty, the form pretends to send (and logs the answers to the browser console) so the page can be tested.

## Link preview image

WhatsApp shows `assets/og-image.png` when the link is shared. To regenerate it after changing the wording, open `tools/og-card.html` in a browser, right-click the card and save it as `assets/og-image.png`.

Once the site is live, replace `https://SITE_URL` in the `og:image` tag near the top of `index.html` with the real address, because link previews need a full URL.

## Hosting

Any static host works. The quickest free route is GitHub Pages, the same as the Pathway site:

1. Create a new GitHub repository and push this folder to it.
2. In the repository's Settings → Pages, choose the `main` branch and save.
3. The site appears at `https://<username>.github.io/<repo>/` within a minute or two. Add a custom domain there if you buy one.

Netlify also works (drag the folder onto app.netlify.com). If you host on Netlify you could swap the form to Netlify Forms, but Formspree works everywhere so it's the default here.

## Previewing locally

```bash
python3 -m http.server 8125
```

Then open http://localhost:8125.

## Still to confirm before launch

- [ ] Deposit timing and what the house cost includes
- [ ] Exact shuttle details and cost
- [ ] Domain name, if wanted
- [ ] Photos of Perast or the house (optional)
- [ ] Final check of travel times and entry rules
