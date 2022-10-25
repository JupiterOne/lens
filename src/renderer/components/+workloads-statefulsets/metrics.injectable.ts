/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import { asyncComputed } from "@ogre-tools/injectable-react";
import { now } from "mobx-utils";
import type { StatefulSet } from "../../../common/k8s-api/endpoints";
import requestPodMetricsForStatefulSetsInjectable from "../../../common/k8s-api/endpoints/metrics.api/request-pod-metrics-for-stateful-sets.injectable";

const statefulSetMetricsInjectable = getInjectable({
  id: "stateful-set-metrics",
  instantiate: (di, statefulSet) => {
    const requestPodMetricsForStatefulSets = di.inject(requestPodMetricsForStatefulSetsInjectable);

    return asyncComputed(() => {
      now(60 * 1000);

      return requestPodMetricsForStatefulSets([statefulSet], statefulSet.getNs());
    });
  },
  lifecycle: lifecycleEnum.keyedSingleton({
    getInstanceKey: (di, statefulSet: StatefulSet) => statefulSet.getId(),
  }),
});

export default statefulSetMetricsInjectable;
