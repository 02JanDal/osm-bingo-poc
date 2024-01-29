import * as OSM from "osm-api";
import _ from "lodash";

export default class API {
  constructor(
    private uid: number,
    private period: readonly [Date, Date],
  ) {
    this.changesets = _.memoize(this.changesets);
    this.changes = _.memoize(this.changes);
  }

  async changesets(): Promise<OSM.Changeset[]> {
    return OSM.listChangesets({
      user: this.uid,
      time: [this.period[0].toISOString(), this.period[1].toISOString()],
    });
  }

  async changes(): Promise<OSM.OsmChange[]> {
    return Promise.all(
      (await this.changesets()).map((c) => OSM.getChangesetDiff(c.id)),
    );
  }
}
