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
| Link-preview image (WhatsApp card) | `assets/og-envelope.png`, generated from `tools/og-card.html` |
| "Add to calendar" files | `calendar/celebration.ics` and `calendar/perast-week.ics` |

## Filling in the placeholders

Open `js/config.js`. Every placeholder is there with a comment.

- **WhatsApp numbers**: one each for Lou Lou and Dylan, international format, digits only, e.g. `61412345678`. If one is left blank, that person's button is hidden.
- **House cost**: `HOUSE_COST_NOTE` is shown on the page as written.
- **Deadlines**: `HOUSE_EOI_DEADLINE` and `RSVP_DEADLINE` are plain text, so write them how you'd say them.

## The RSVP form (Web3Forms)

RSVPs are sent by Web3Forms, a free service that emails each one to the address the access key was created with. The key is in `WEB3FORMS_ACCESS_KEY` in `js/config.js`. It's designed to be public, so it's fine in the code.

Each email has the subject "RSVP: name — what they chose", and hitting Reply goes straight to the guest. The free plan allows 250 submissions a month. Sign in at web3forms.com to see past submissions or change the destination email.

To switch sending off, set `FORM_ENDPOINT` to `""`. On the live site the form will then ask guests to message you on WhatsApp instead of pretending to send.

## Link preview image

iMessage and WhatsApp show `assets/og-envelope.png` (the sealed envelope) with the title "Tap the seal to open". To redraw it, open `tools/og-card.html` in a browser, right-click the image and save it. Save it under a new file name and update the `og:image` tag, because messaging apps cache preview images by address.

The link-preview tags point at https://montenegroni.site. If the domain ever changes, update the `og:image` and `og:url` tags at the top of `index.html` and `gallery.html`, and the `CNAME` file.

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

