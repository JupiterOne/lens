/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getGlobalOverride } from "../test-utils/get-global-override";
import clusterStoreInjectable from "./cluster-store.injectable";
import type { Cluster } from "../cluster/cluster";
import type { ClusterStore } from "./cluster-store";
import { observable } from "mobx";
import type { ClusterId } from "../cluster-types";

export default getGlobalOverride(clusterStoreInjectable, () => ({
  provideInitialFromMain: () => {},
  getById: () => ({}) as Cluster,
  clusters: observable.map<ClusterId, Cluster>(),
} as Partial<ClusterStore> as ClusterStore
));
