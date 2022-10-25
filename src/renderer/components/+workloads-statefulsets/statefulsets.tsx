/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./statefulsets.scss";

import React from "react";
import { observer } from "mobx-react";
import type { StatefulSet } from "../../../common/k8s-api/endpoints";
import { KubeObjectListLayout } from "../kube-object-list-layout";
import { KubeObjectStatusIcon } from "../kube-object-status-icon";
import { SiblingsInTabLayout } from "../layout/siblings-in-tab-layout";
import { KubeObjectAge } from "../kube-object/age";
import type { StatefulSetStore } from "./store";
import type { EventStore } from "../+events/store";
import { withInjectables } from "@ogre-tools/injectable-react";
import eventStoreInjectable from "../+events/store.injectable";
import statefulSetStoreInjectable from "./store.injectable";

enum columnId {
  name = "name",
  namespace = "namespace",
  pods = "pods",
  age = "age",
  replicas = "replicas",
}

interface Dependencies {
  statefulSetStore: StatefulSetStore;
  eventStore: EventStore;
}

@observer
class NonInjectedStatefulSets extends React.Component<Dependencies> {
  renderPods(statefulSet: StatefulSet) {
    const { readyReplicas, currentReplicas } = statefulSet.status ?? {};

    return `${readyReplicas || 0}/${currentReplicas || 0}`;
  }

  render() {
    const { eventStore, statefulSetStore } = this.props;

    return (
      <SiblingsInTabLayout>
        <KubeObjectListLayout
          isConfigurable
          tableId="workload_statefulsets"
          className="StatefulSets"
          store={statefulSetStore}
          dependentStores={[eventStore]}
          sortingCallbacks={{
            [columnId.name]: statefulSet => statefulSet.getName(),
            [columnId.namespace]: statefulSet => statefulSet.getNs(),
            [columnId.age]: statefulSet => -statefulSet.getCreationTimestamp(),
            [columnId.replicas]: statefulSet => statefulSet.getReplicas(),
          }}
          searchFilters={[
            statefulSet => statefulSet.getSearchFields(),
          ]}
          renderHeaderTitle="Stateful Sets"
          renderTableHeader={[
            { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
            { title: "Namespace", className: "namespace", sortBy: columnId.namespace, id: columnId.namespace },
            { title: "Pods", className: "pods", id: columnId.pods },
            { title: "Replicas", className: "replicas", sortBy: columnId.replicas, id: columnId.replicas },
            { className: "warning", showWithColumn: columnId.replicas },
            { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
          ]}
          renderTableContents={statefulSet => [
            statefulSet.getName(),
            statefulSet.getNs(),
            this.renderPods(statefulSet),
            statefulSet.getReplicas(),
            <KubeObjectStatusIcon key="icon" object={statefulSet} />,
            <KubeObjectAge key="age" object={statefulSet} />,
          ]}
        />
      </SiblingsInTabLayout>
    );
  }
}

export const StatefulSets = withInjectables<Dependencies>(NonInjectedStatefulSets, {
  getProps: (di, props) => ({
    eventStore: di.inject(eventStoreInjectable),
    statefulSetStore: di.inject(statefulSetStoreInjectable),
    ...props,
  }),
});
