// Whether a pod must re-check the registry for this image on every start.
//
// A channel tag (latest, dev-sw) moves under the same name, so a copy cached on
// the node may be stale and the manifest has to be re-checked -- that is the
// only way a pushed dev image reaches the next pod. A pinned `:v1.2.3` is
// immutable and the cached copy IS the right one, so pulling Always would put a
// registry round-trip in front of every boot for nothing, and a registry that is
// rate limiting or down would stop work that could have started from disk.
//
// It is also what makes a locally built image usable: tag it `:v0-something`,
// import it into the node's containerd, and nothing tries to pull it.
export function imagePullPolicyFor(image: string): "Always" | "IfNotPresent" {
  const tag = image.slice(image.lastIndexOf("/") + 1).split(":")[1] ?? "";

  return /^v\d/.test(tag) ? "IfNotPresent" : "Always";
}
