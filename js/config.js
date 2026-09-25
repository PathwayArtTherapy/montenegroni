// ============================================================
//  SITE SETTINGS — the only file you need to edit for the
//  placeholders. Save, refresh, done.
// ============================================================
window.SITE_CONFIG = {

  // WhatsApp numbers in international format, digits only
  // (Australian numbers: drop the leading 0, add 61).
  WHATSAPP: {
    LOU_LOU: "61488236805",
    DYLAN: "61439731210",
  },

  // Where the RSVP form sends its answers: Web3Forms (free), which emails
  // each RSVP to the address the access key was created with.
  // The access key is designed to be public, so it's fine in this file.
  // Set FORM_ENDPOINT to "" to switch sending off.
  FORM_ENDPOINT: "https://api.web3forms.com/submit",
  WEB3FORMS_ACCESS_KEY: "5042ef81-8530-4516-bb1e-46bf82b2a75f",

  // House cost, shown on the page. Plain text, write it how you'd say it.
  HOUSE_COST_NOTE: "$600 AUD per person ($1,200 per couple) for the 7 nights",

  // Deadlines shown on the page.
  HOUSE_EOI_DEADLINE: "before November 2026",
  RSVP_DEADLINE: "by December 2026",

  // Thank-you messages after someone RSVPs. One is picked at random each time.
  // Add, remove or reword as many as you like.
  THANK_YOU: {
    COMING: [
      { title: "Euro summer, baby!", text: "We can't wait to have a negroni with you!" },
      { title: "Živjeli!", text: "That's cheers in Montenegrin. We can't wait to raise a glass with you by the water!" },
      { title: "See you in Perast!", text: "Pack the silks and the sunscreen. The first spritz is on us." },
      { title: "Top 3 buttons open!", text: "You're in. Start planning the outfit, and we'll have the negronis ready." },
    ],
    CANT_MAKE_IT: [
      { title: "We'll miss you!", text: "You'll be there in spirit, and we will have a drink for you!" },
      { title: "A negroni in your honour", text: "You'll be there in spirit, and we will have a drink for you by the water." },
    ],
  },

  // The countdown target: the main celebration day, Perast time.
  CELEBRATION_DATE: "2027-06-26T00:00:00+02:00",
};
