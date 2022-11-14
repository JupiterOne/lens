/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Headers, HeadersInit } from "node-fetch";
import __UNSAFE_nodeFetchInjectable from "./unsafe-fetch.injectable";

export type CreateHeaders = (init?: HeadersInit) => Headers;

const createHeadersInjectable = getInjectable({
  id: "create-headers",
  instantiate: (di): CreateHeaders => {
    const { Headers } = di.inject(__UNSAFE_nodeFetchInjectable);

    return (init) => new Headers(init);
  },
});

export default createHeadersInjectable;
