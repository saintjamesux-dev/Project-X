/**
 * A Day for Sebastian — all personal details and display text.
 *
 * Edit anything on the site from this one file. Line breaks inside
 * headlines are written as separate array items.
 */

export const birthday = {
  site: {
    title: "A Day for Sebastian",
    description:
      "A birthday celebration for Uncle Sebastian Omordia — with love, respect and gratitude from his nephew, Chukwuemeka.",
  },

  people: {
    recipient: "Uncle Sebastian",
    recipientFullName: "Sebastian Omordia",
    relationship: "Nephew",
    sender: "Chukwuemeka Omordia",
    senderFirstName: "Chukwuemeka",
  },

  /**
   * Portrait shown in Chapter 02. Set to `null` to show an elegant
   * empty frame instead. Replace the file in /public/images to change it.
   */
  portrait: {
    src: "/images/sebastian.jpg",
    alt: "Portrait of Sebastian Omordia in a navy suit and patterned tie",
    width: 1086,
    height: 1449,
    caption: "Sebastian Omordia",
  } as { src: string; alt: string; width: number; height: number; caption: string } | null,

  entrance: {
    eyebrow: "Happy Birthday",
    name: ["Uncle", "Sebastian"],
    tagline: "Today, we celebrate you.",
    scrollCue: "There’s something special waiting for you",
  },

  celebrate: {
    kicker: "A Man Worth Celebrating",
    headline: ["Some people make an impression.", "Others make a difference."],
    body: "Today is more than a celebration of another year. It is an opportunity to recognise a man whose presence, wisdom, generosity and influence continue to make a difference in the lives of those around him.",
  },

  influence: {
    kicker: "Your Influence",
    intro: "What those around you carry with them.",
    statements: [
      "Your wisdom gives direction.",
      "Your generosity creates opportunities.",
      "Your leadership inspires confidence.",
      "Your actions remind others what it means to make a difference.",
      "Your influence extends beyond what words can describe.",
    ],
  },

  note: {
    kicker: "A Personal Note",
    headline: "From someone who is grateful to call you family.",
    salutation: "Uncle,",
    paragraphs: [
      "There are things I don’t say often enough, so I want to say them properly today.",
      "Thank you for the place you hold in my life. So much of what steadies me comes from simply knowing you are there — someone I can look to, learn from, and quietly measure myself against.",
      "Thank you for everything you have done for our family. The support you have given and the doors you have opened were never small things to us, even when you made them look easy. I see what your kindness has made possible, and I don’t take any of it for granted.",
      "I have always respected the way you see things — with patience, clarity and a calm that makes hard things feel manageable. Your advice has a way of staying with me long after the conversation ends, and more often than you know, I find myself asking what you would do.",
      "Your encouragement means more to me than I can easily put into words. When you believe in someone, they begin to believe in themselves — and I have been fortunate to be one of those people.",
      "And thank you for trusting me. I carry that trust carefully. It pushes me to grow, to work harder, and to make sure I am worthy of it.",
      "As you step into this new year, I pray for good health and renewed strength, for peace of mind, for joy in ordinary days, and for the deep fulfilment of watching everything you have planted continue to grow. You have given so much of yourself to others. I hope this year gives a great deal back to you.",
    ],
    closing: "With love and respect,",
    signature: "Chukwuemeka",
  },

  wishes: {
    kicker: "A Wish for Your New Chapter",
    headline: "May this new chapter be extraordinary.",
    items: [
      "May you experience good health and renewed strength.",
      "May your efforts continue to yield beautiful results.",
      "May opportunities find you in unexpected places.",
      "May your home remain filled with peace, love and laughter.",
      "May the years ahead bring even greater reasons to celebrate.",
      "May God continue to guide, protect and bless you.",
    ],
  },

  finale: {
    kicker: "Make a Wish",
    headline: "Every birthday deserves a wish.",
    prompt: "Take a moment. Make yours.",
    button: "Make a Wish",
    afterWish: "Your wish is on its way.",
    message: {
      title: ["Happy Birthday,", "Uncle Sebastian."],
      blessing:
        "May your light never grow dim, your influence never cease, and your best years always remain ahead of you.",
      closing: "With love, respect and gratitude.",
      signature: "From your nephew, Chukwuemeka.",
    },
    replay: "Light the candles again",
    candles: 5,
  },

  music: {
    play: "Play a birthday melody",
    pause: "Pause the melody",
  },
} as const;

export type BirthdayContent = typeof birthday;
