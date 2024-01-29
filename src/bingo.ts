import API from "./api.ts";
import _ from "lodash";

interface Square {
  description: string;
  implemented: boolean;
  check: (api: API) => Promise<boolean>;
}

type Board = Square[];

const board: Board = [
  {
    description: "Re-survey a POI that's not been touched since 2010",
    implemented: false,
    check: async (_api: API) => Promise.resolve(false),
  },
  {
    description: "Map 10 buildings",
    implemented: true,
    check: async (api: API) => {
      const changes = await api.changes();
      const buildingsCreated = changes.flatMap((c) =>
        c.create.filter((c) => c.type === "way" && c.tags?.["building"]),
      );
      return buildingsCreated.length > 10;
    },
  },
  {
    description: "Record a 5 km (or longer) GPX trace",
    implemented: false,
    check: async (_api: API) => Promise.resolve(false),
  },
  {
    description: "Map objects in multiple countries country",
    implemented: false,
    check: async (_api: API) => Promise.resolve(false),
  },
  {
    description: "Use two different editors",
    implemented: true,
    check: async (api: API) => {
      const changesets = await api.changesets();
      const editors = _.uniq(
        changesets
          .map((c) => c.tags?.["created_by"]?.split(" ")[0])
          .filter((s) => s),
      );
      return editors.length > 2;
    },
  },
  {
    description: "Participate in a MapRoulette challenge",
    implemented: true,
    check: async (api: API) => {
      const changesets = await api.changesets();
      const cs = changesets
        .map((c) => c.tags?.["hashtag"])
        .filter((s) => s?.includes("#maproulette"));
      return cs.length > 1;
    },
  },
  {
    description: "Add a missing shop",
    implemented: true,
    check: async (api: API) => {
      const changes = await api.changes();
      const shopsCreated = changes.flatMap((c) =>
        c.create.filter((c) => c.tags?.["shop"]),
      );
      return shopsCreated.length > 1;
    },
  },
  {
    description: "Rate a changeset on OSMCha",
    implemented: false,
    check: async (_api: API) => Promise.resolve(false),
  },
  {
    description: "Comment on a changeset",
    implemented: false,
    check: async (_api: API) => Promise.resolve(false),
  },
];

export default board;
