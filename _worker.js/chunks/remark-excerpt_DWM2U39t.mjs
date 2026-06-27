globalThis.process ??= {}; globalThis.process.env ??= {};
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
const MANY_TRAILING_SLASHES = /\/{2,}$/g;
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
const INTERNAL_PREFIXES = /* @__PURE__ */ new Set(["/_", "/@", "/.", "//"]);
const JUST_SLASHES = /^\/{2,}$/;
function isInternalPath(path) {
  return INTERNAL_PREFIXES.has(path.slice(0, 2)) && !JUST_SLASHES.test(path);
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i) => {
    if (i === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
const URL_PROTOCOL_REGEX = /^(?:(?:http|ftp|https|ws):?\/\/|\/\/)/;
function isRemotePath(src) {
  const decoded = src.replace(/%5C/gi, "\\");
  if (decoded[0] === "\\") {
    return true;
  }
  if (/^(?:http|https|ftp|ws):\\/.test(decoded)) {
    return true;
  }
  return URL_PROTOCOL_REGEX.test(decoded) || decoded.startsWith("data:");
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function removeBase(path, base) {
  if (path.startsWith(base)) {
    return path.slice(removeTrailingForwardSlash(base).length);
  }
  return path;
}
const WITH_FILE_EXT = /\/[^/]+\.\w+$/;
function hasFileExtension(path) {
  return WITH_FILE_EXT.test(path);
}

const env_d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const global_d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

/// <reference types="mdast" />

const rehypeComponentAdmonition = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

/// <reference types="mdast" />

const rehypeComponentGithubCard = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const remarkDirectiveRehype = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

// biome-ignore lint/suspicious/noShadowRestrictedNames: <toString from mdast-util-to-string>

const remarkExcerpt = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

export { appendForwardSlash as a, removeBase as b, collapseDuplicateTrailingSlashes as c, isRemotePath as d, env_d as e, fileExtension as f, global_d as g, hasFileExtension as h, isInternalPath as i, joinPaths as j, rehypeComponentAdmonition as k, rehypeComponentGithubCard as l, remarkDirectiveRehype as m, remarkExcerpt as n, prependForwardSlash as p, removeTrailingForwardSlash as r, slash as s, trimSlashes as t };
