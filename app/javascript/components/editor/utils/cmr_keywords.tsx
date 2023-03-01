import { cloneDeep } from 'lodash'

// Private

export type Node = {
  value?: string
  subfields?: string[]
}

// Private function used to traverse through the cmr keywords response and build a multidimensional array of keywords, see exported/public interface below.
function traverse(node: Node, parent: string, name: string, path: string[], paths: string[][], filter: string[]) {
  const children = node[name]
  if (node.value && filter.includes(parent)) {
    path.push(node.value)
  }
  children.forEach((child: Node) => {
    const childPath = cloneDeep(path)
    if (child.subfields) {
      child.subfields.forEach((subfield: string) => {
        traverse(child, name, subfield, cloneDeep(childPath), paths, filter)
      })
    } else {
      if (child.value && filter.includes(name)) {
        childPath.push(child.value)
      }
      paths.push(childPath)
    }
  })
}

// Private function used by buildMap function to parse through a multidimensional array of keywords and build a map, see exported/public interface below.
function traverseArrays(parent: Node, tokens: string[]) {
  if (tokens.length > 0) {
    const token = tokens.shift()
    if (token === '') {
      traverseArrays(parent, tokens)
      return
    }
    if (!parent[token]) {
      const p: Node = parent
      p[token] = {}
    }
    traverseArrays(parent[token], tokens)
  }
}

// This parses through the response of parseCmrResponse below (which is a multidimensional array of keywords) and
// produces a map of keywords used by the controlled fields widget.   The map is used like below:
// map['atmosphere']['atmospheric phenomema'] returns ['hurricanes']
export function buildMap(paths: string[][]) {
  const map = { } as Node
  paths.forEach((tokens: string[]) => {
    traverseArrays(map, tokens)
  })
  return map
}

// This parses the cmr response and produces an multidimensional array that looks like this:
// [
//   ['atmosphere', 'atmospheric phenomena', 'hurricanes'],
//   ['oceans', 'ocean temperature', 'sea surface temperature'],
//   ['land surface', 'soils', 'carbon', 'soil organic'],
// ]
// You specify a "filter" array which specifies which fields you want to include in
// multidimensional array (e.g, 'category', 'topic', 'term', 'variable')

export function parseCmrResponse(response: Node, filter: string[]) {
  let paths = [] as string[][]
  const path = [] as string[]
  traverse(response, 'root', Object.keys(response)[0], path, paths, filter)

  paths = paths.sort((a:string[], b:string[]) => {
    const j1 = a.join('>')
    const j2 = b.join('>')
    return j1.localeCompare(j2)
  })
  return paths
}
