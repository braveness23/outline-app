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
    {
      path: "/instructions",
      name: dictionary.instructions.title,
    },
    {
      path: "/about",
      name: dictionary.about.title,
    },
  ];
};

export type NavbarPath = {
  path: string;
  name: string;
};

export default navbarPaths;
