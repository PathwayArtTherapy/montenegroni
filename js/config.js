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

  // Where the RSVP form sends its answers.
  // Formspree example: "https://formspree.io/f/abcdwxyz"  (see README)
  // Leave as "" while testing; the form will pretend to send.
  FORM_ENDPOINT: "",

  // House cost, shown on the page. Plain text, write it how you'd say it.
  HOUSE_COST_NOTE: "$600 AUD per person ($1,200 per couple) for the 7 nights",

  // Deadlines shown on the page.
  HOUSE_EOI_DEADLINE: "before November 2026",
  RSVP_DEADLINE: "by December 2026",

  // Music that plays when someone taps to open the envelope.
  // FILE: the song file inside the site folder (an .m4a or .mp3 you own).
  // START_AT_SECONDS: skip an intro, e.g. 8 to start 8 seconds in.
  // PLAY_SECONDS: how long it plays before fading out.
  // Set FILE to "" to turn the music off.
  MUSIC: {
    FILE: "assets/audio/test-tune.m4a",
    START_AT_SECONDS: 0,
    PLAY_SECONDS: 20,
  },

  // The countdown target: the main celebration day, Perast time.
  CELEBRATION_DATE: "2027-06-26T00:00:00+02:00",
};
