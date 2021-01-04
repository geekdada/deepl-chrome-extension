export const getFirstRange = (sel: RangySelection): RangyRange | undefined => {
  return sel.rangeCount ? sel.getRangeAt(0) : undefined
}
