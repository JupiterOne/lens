/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { RequestInit, Response } from "node-fetch";
import __UNSAFE_nodeFetchInjectable from "./unsafe-fetch.injectable";

export type Fetch = (url: string, init?: RequestInit) => Promise<Response>;

const fetchInjectable = getInjectable({
  id: "fetch",
  instantiate: (di): Fetch => di.inject(__UNSAFE_nodeFetchInjectable).default,
  causesSideEffects: true,
});

export default fetchInjectable;
