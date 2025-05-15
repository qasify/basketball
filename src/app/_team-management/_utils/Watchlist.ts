import { Player, PositionFilter } from "../_types";

export const filters: PositionFilter[] = [
  {
    label: "PG",
    value: "Point Guard",
  },
  {
    label: "SG",
    value: "Shooting Guard",
  },
  {
    label: "SF",
    value: "Small Forward",
  },
  {
    label: "PF",
    value: "Power Forward",
  },
  {
    label: "C",
    value: "Center",
  },
];
export const players: Player[] = [
  {
    id: 1,
    name: "Hermannsson Martin",
    position: "Point Guard",
    age: 29,
    country: "Iceland",
    image: "/images/players/1.png",
    number: 23,
  },
  {
    id: 2,
    name: "Bean Justin",
    position: "Power Forward",
    age: 27,
    country: "USA",
    image: "/images/players/2.png",
    number: 25,
  },
  {
    id: 3,
    name: "McCormack David",
    position: "Center",
    age: 24,
    country: "USA",
    image: "/images/players/3.png",
    number: 41,
  },
  {
    id: 4,
    name: "Koumadje Christ",
    position: "Small Forward",
    age: 27,
    country: "USA",
    image: "/images/players/4.png",
    number: 62,
  },
  {
    id: 5,
    name: "Williams Trevion",
    position: "Shooting Guard",
    age: 23,
    country: "USA",
    image: "/images/players/5.png",
    number: 72,
  },
  {
    id: 6,
    name: "Hermannsson Martin",
    position: "Point Guard",
    age: 29,
    country: "Iceland",
    image: "/images/players/6.png",
    number: 31,
  },
];
