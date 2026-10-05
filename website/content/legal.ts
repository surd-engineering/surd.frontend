export type LegalSubsection = {
  id: string;
  title: string;
  body: string[];
};

export type LegalSection = {
  id: string;
  title: string;
  body: string[];
  subsections?: LegalSubsection[];
};

export type LegalDocument = {
  title: string;
  updatedLabel: string;
  sections: LegalSection[];
};

const INTRO_BODY = [
  "These terms of service, in conjunction with our privacy policy (accessible at https://www.surd.finance/privacy-policy), and any additional agreements you may have entered with us, constitute a legally binding contract between you and SURD. By navigating our site or engaging in transactions, you are participating in our services and agree to abide by the ensuing terms. Applicable to all site users, these terms apply universally.",
];

const DEFINITION_BODY = [
  "All novel additions or improvements made to the website will be governed by these terms. The latest version, subject to periodic revisions, alterations, or substitutions, can be found on this page. It is your responsibility to routinely review this page for updates. If you continue to use or access the site after modifications, it signifies your acceptance of the revised terms.",
];

const RESPONSIBILITY_BODY = [
  "User Content Responsibility:",
  "Users acknowledge that all content, whether public or private, is the sole responsibility of its originator. SURD does not guarantee the accuracy, integrity, or quality of the provided content, and users assume any associated risks.",
];

function section(
  id: string,
  title: string,
  body: string[],
  definitionNumber: string,
): LegalSection {
  return {
    id,
    title,
    body,
    subsections: [
      {
        id: `${id}-definition`,
        title: `${definitionNumber} Definition`,
        body: DEFINITION_BODY,
      },
    ],
  };
}

const SHARED_SECTIONS: LegalSection[] = [
  section("introduction", "Introduction", INTRO_BODY, "1.1"),
  section(
    "acknowledgement",
    "Acknowledgement",
    [
      "These terms define the terms of use for our service and establish a mutual agreement between you and SURD, outlining the rights and responsibilities of all users. Your access to and utilization of the service signify your acknowledgment of and adherence to these terms, which are binding for all visitors, users, and others who interact with the service.",
    ],
    "2.1",
  ),
  section("conduct", "Conduct", RESPONSIBILITY_BODY, "3.1"),
  section("obligations", "Obligations", RESPONSIBILITY_BODY, "4.1"),
  section(
    "user-content-responsibility",
    "User Content Responsibility",
    RESPONSIBILITY_BODY,
    "5.1",
  ),
  section("liability", "Limitation of Liability", RESPONSIBILITY_BODY, "6.1"),
  section("termination", "Termination", RESPONSIBILITY_BODY, "7.1"),
  section("governing-law", "Governing Law", RESPONSIBILITY_BODY, "8.1"),
];

export const TERMS_OF_SERVICE: LegalDocument = {
  title: "Terms of Service",
  updatedLabel: "Updated April 27, 2026",
  sections: SHARED_SECTIONS,
};

export const PRIVACY_POLICY: LegalDocument = {
  title: "Privacy Policy",
  updatedLabel: "Document amended November 13, 2025",
  sections: SHARED_SECTIONS,
};
