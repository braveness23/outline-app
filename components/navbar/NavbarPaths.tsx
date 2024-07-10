import { Dictionary } from "@/app/dictionaries";

const navbarPaths = (dictionary: Dictionary): NavbarPath[] => {
  return [
    {
      path: "/",
      name: dictionary.homepage,
    },
    {
      path: "/history",
      name: dictionary.history.title,
    },
  ];
};

export type NavbarPath = {
  path: string;
  name: string;
};

export default navbarPaths;
