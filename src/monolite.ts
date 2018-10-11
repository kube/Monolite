
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { assign } from './assign'
import { deepEqual } from './deepEqual'
import { getAccessorChain } from './accessorChain'

/**
 * Return a new tree with target key updated
 */
export const setFromAccessorChain = <T, R>(
  root: R,
  accessors: string[]
) => (value: T | ((_: T) => T)): R => {
  const currentNode: any = root

  if (accessors.length === 0) {
    // currentNode is the target
    const newNode: any =
      value instanceof Function ? value(currentNode) : value

    // Return currentNode if structural equality
    return deepEqual(currentNode, newNode) ? currentNode : newNode
  } else {
    // currentNode is a parent of the target
    const [key, ...nextAccessors] = accessors
    const newValue = setFromAccessorChain(
      currentNode[key],
      nextAccessors
    )(value)

    // Return currentNode if identity equality
    return currentNode[key] === newValue
      ? currentNode
      : Array.isArray(currentNode)
        ? [
            ...currentNode.slice(0, Number(key)),
            newValue,
            ...currentNode.slice(Number(key) + 1)
          ]
        : assign(
            Object.create(Object.getPrototypeOf(currentNode)),
            currentNode,
            { [key]: newValue }
          )
  }
}

/**
 * Return a new tree with target key updated
 */
export const set = <R, T>(
  root: R,
  accessor: ((_: R) => T) | string[]
) =>
  Array.isArray(accessor)
    ? setFromAccessorChain<T, R>(root, accessor)
    : setFromAccessorChain<T, R>(root, getAccessorChain(accessor))
