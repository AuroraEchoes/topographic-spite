import type { Vec2 } from "../lib/vector"
import vector from "../lib/vector"

export type LineSegment = {
  start: Vec2,
  end: Vec2
}

enum CaseIndex {
  Case0 = 0,
  Case1 = 1,
  Case2 = 2,
  Case3 = 3,
  Case4 = 4,
  Case5 = 5,
  Case6 = 6,
  Case7 = 7,
  Case8 = 8,
  Case9 = 9,
  Case10 = 10,
  Case11 = 11,
  Case12 = 12,
  Case13 = 13,
  Case14 = 14,
  Case15 = 15,
}


const LOOKUP_TABLE: { case: CaseIndex, segments: LineSegment[] }[] = [
  {
    case: CaseIndex.Case0, segments: []
  },
  {
    case: CaseIndex.Case1, segments: [{ start: vector.make(0.5, 0.0), end: vector.make(0.0, 0.5) }]
  },
  {
    case: CaseIndex.Case2, segments: [{ start: vector.make(0.5, 0.0), end: vector.make(1.0, 0.5) }]
  },
  {
    case: CaseIndex.Case3, segments: [{ start: vector.make(0.0, 0.5), end: vector.make(1.0, 0.5) }]
  },
  {
    case: CaseIndex.Case4, segments: [{ start: vector.make(1.0, 0.5), end: vector.make(0.5, 1.0) }]
  },
  {
    case: CaseIndex.Case5, segments: [
      { start: vector.make(0.5, 0.0), end: vector.make(1.0, 0.5) },
      { start: vector.make(0.5, 1.0), end: vector.make(0.0, 0.5) }
    ]
  },
  {
    case: CaseIndex.Case6, segments: [{ start: vector.make(0.5, 0.0), end: vector.make(0.5, 1.0) }]
  },
  {
    case: CaseIndex.Case7, segments: [{ start: vector.make(0.5, 1.0), end: vector.make(0.0, 0.5) }]
  },
  {
    case: CaseIndex.Case8, segments: [{ start: vector.make(0.5, 1.0), end: vector.make(0.0, 0.5) }]
  },
  {
    case: CaseIndex.Case9, segments: [{ start: vector.make(0.5, 0.0), end: vector.make(0.5, 1.0) }]
  },
  {
    case: CaseIndex.Case10, segments: [
      { start: vector.make(1.0, 0.5), end: vector.make(0.5, 1.0) },
      { start: vector.make(0.0, 0.5), end: vector.make(0.5, 0.0) }
    ]
  },
  {
    case: CaseIndex.Case11, segments: [{ start: vector.make(1.0, 0.5), end: vector.make(0.5, 1.0) },]
  },
  {
    case: CaseIndex.Case12, segments: [{ start: vector.make(0.0, 0.5), end: vector.make(1.0, 0.5) }]
  },
  {
    case: CaseIndex.Case13, segments: [{ start: vector.make(0.5, 0.0), end: vector.make(1.0, 0.5) }]
  },
  {
    case: CaseIndex.Case14, segments: [{ start: vector.make(0.5, 0.0), end: vector.make(0.0, 0.5) }]
  },
  {
    case: CaseIndex.Case15, segments: []
  }
]

export function caseToLineSegments(caseIndex: CaseIndex): LineSegment[] {
  return LOOKUP_TABLE.find(x => x.case == caseIndex)!.segments
}

export function boolsToCase(bl: boolean, br: boolean, tr: boolean, tl: boolean): CaseIndex {
  let idx = 0
  if (bl)
    idx += 1
  if (br)
    idx += 2
  if (tr)
    idx += 4
  if (tl)
    idx += 8
  return Object.values(CaseIndex)[Object.values(CaseIndex).indexOf(idx)] as CaseIndex;
}
