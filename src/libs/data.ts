interface SubLink {
  title: string;
  path: string;
}

interface Link {
  title: string;
  path: string;
  sub_links?: SubLink[];
}
export const links: Link[] = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Movies & Shows",
    path: "/movies&shows",
  },
  {
    title: "Support",
    path: "/support",
  },
  {
    title: "Subscriptions",
    path: "/subscriptions",
  },
];

export const footerLinks: Link[] = [
  {
    title: "Home",
    path: "/",
    sub_links: [
      {
        title: "Categories",
        path: "/#categories",
      },
      {
        title: "Devices",
        path: "/#devices",
      },
      {
        title: "Pricing",
        path: "/#pricing",
      },
      {
        title: "FAQ",
        path: "/#faq",
      },
    ],
  },
  {
    title: "Movies",
    path: "/movies&shows",
    sub_links: [
      {
        title: "Gernes",
        path: "/#gernes",
      },
      {
        title: "Trending",
        path: "/#trending",
      },
      {
        title: "New Release",
        path: "/#newrelease",
      },
      {
        title: "Popular",
        path: "/#popular",
      },
    ],
  },
  {
    title: "Shows",
    path: "/movies&shows",
    sub_links: [
      {
        title: "Gernes",
        path: "/#gernes",
      },
      {
        title: "Trending",
        path: "/#trending",
      },
      {
        title: "New Release",
        path: "/#newrelease",
      },
      {
        title: "Popular",
        path: "/#popular",
      },
    ],
  },
  {
    title: "Support",
    path: "/support",
    sub_links: [
      {
        title: "Contact Us",
        path: "/#contactus",
      },
    ],
  },
  {
    title: "Subscriptions",
    path: "/subscriptions",
    sub_links: [
      {
        title: "Plans",
        path: "/#plans",
      },
      {
        title: "Features",
        path: "/#features",
      },
    ],
  },
];
