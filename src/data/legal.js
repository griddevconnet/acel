// DRAFT legal copy. Written to match what the site actually does today
// (contact form + certification registration form, manual review, no accounts).
// It must be reviewed and completed by legal counsel before launch.
// Anything in [square brackets] is a gap the client needs to fill.

export const legalMeta = {
  contactEmail: '[contact email to be added]',
  organisation: 'African Chamber of ESG Leadership (ACEL)',
}

export const privacy = {
  title: 'Privacy policy',
  intro:
    'This policy explains what personal information the ACEL website collects, why, and what you can ask us to do with it.',
  sections: [
    {
      heading: 'Who we are',
      body: [
        `${legalMeta.organisation} runs this website. If you have a question about your information, write to ${legalMeta.contactEmail}.`,
      ],
    },
    {
      heading: 'What we collect',
      body: [
        'Contact form: your name, email address, organisation (if you give it), the topic of your message, and the message itself.',
        'Certification registration form: your name, email address, phone number (if you give it), country, current role, organisation (if you give it), the level you choose, and the background you describe. Paying the certification fee happens through Paystack\u2019s own checkout \u2014 we do not see or store your card or payment details.',
        'The site does not use its own advertising or analytics cookies and does not ask you to create an account. It loads its fonts from Google Fonts, so your browser contacts Google when a page opens. When you pay a certification fee, Paystack\u2019s checkout opens in its own secure window and sets its own cookies to process the payment and prevent fraud, under Paystack\u2019s privacy policy, not this one.',
      ],
    },
    {
      heading: 'How we use it',
      body: [
        'We use what you send to reply to your message, to review your certification registration, and to contact you about next steps. Registrations are reviewed by hand by the Secretariat, and may be shared with the relevant certification panel or board for that purpose.',
      ],
    },
    {
      heading: 'Who else sees it',
      body: [
        'Service providers that host this website and deliver form submissions to us can process your information on our behalf. If you pay a certification fee, Paystack processes that payment as an independent controller of your payment data \u2014 see Paystack\u2019s own privacy policy. We do not sell your information.',
      ],
    },
    {
      heading: 'How long we keep it',
      body: ['[Retention period to be set by the Chamber.]'],
    },
    {
      heading: 'Your choices',
      body: [
        `You can ask us to show you the information we hold about you, correct it, or delete it. Write to ${legalMeta.contactEmail} and tell us which form you used and the email address you gave.`,
      ],
    },
    {
      heading: 'Changes to this policy',
      body: ['If we change this policy we will update this page. [Add "last updated" date at launch.]'],
    },
  ],
}

export const terms = {
  title: 'Terms of use',
  intro: 'These terms apply to your use of the ACEL website.',
  sections: [
    {
      heading: 'About this website',
      body: [
        'This website gives general information about the Chamber, its membership, its certification pathway and its governance. It is not professional, legal or financial advice.',
      ],
    },
    {
      heading: 'Membership and certification',
      body: [
        'Information on this site, including fees, is indicative until confirmed by the Chamber. Submitting a form is a request, not an offer or a guarantee. Membership and certification are subject to review and approval under the Chamber\u2019s own rules and processes.',
      ],
    },
    {
      heading: 'Using the forms',
      body: [
        'Please give accurate information. We may decline or withdraw a request that contains information that is false or misleading.',
      ],
    },
    {
      heading: 'Intellectual property',
      body: [
        'The ACEL name, logo and the content of this website belong to the Chamber or its licensors. You may not reproduce them without permission, except for personal, non-commercial reference.',
      ],
    },
    {
      heading: 'Liability',
      body: ['[Limitation of liability wording to be drafted by legal counsel.]'],
    },
    {
      heading: 'Governing law',
      body: ['[Governing law and jurisdiction to be confirmed by the Chamber.]'],
    },
    {
      heading: 'Contact',
      body: [`Questions about these terms: ${legalMeta.contactEmail}.`],
    },
  ],
}
