###
 * Binary Heap
 *
 * @see http:#eloquentjavascript.net/appendix2.html
 ###
BinaryHeap = exports.BinaryHeap = (scoreFunction) ->
  ### @ignore ###
  this.content = []
  ### @ignore ###
  this.scoreFunction = scoreFunction
  return this

###
 * Add element to heap.
 * @param {Object} element
 ###
BinaryHeap.prototype.push = (element) ->
  this.content.push(element)
  this.sinkDown(this.content.length - 1)
  return

###
 * Return first element from heap.
 * @param {Object} element
 * @returns {Object} element
 ###
BinaryHeap.prototype.pop = () ->
  # Store the first element so we can return it later.
  result = this.content[0]
  # Get the element at the end of the array.
  end = this.content.pop()
  # If there are any elements left, put the end element at the
  # start, and let it bubble up.
  if (this.content.length > 0)
    this.content[0] = end
    this.bubbleUp(0)
  return result

###
 * Remove the given element from the heap.
 * @param {Object} element
 * @throws {Error} if node not found
 ###
BinaryHeap.prototype.remove = (node) ->
  # To remove a value, we must search through the array to find
  # it.
  isFound = this.content.some((cNode, idx) ->
    if (cNode == node)
      end = this.content.pop()
      if (idx != this.content.length)
        this.content[idx] = end
        if (this.scoreFunction(end) < this.scoreFunction(node))
          this.sinkDown(idx)
        else
          this.bubbleUp(idx)
      return true
    return false
  , this)
  #if (!isFound)
     #throw new Error("Node not found.")
  return

### Number of elements in heap.  ###
BinaryHeap.prototype.size = () ->
  return this.content.length

### @ignore ###
BinaryHeap.prototype.sinkDown = (idx) ->
  # Fetch the element that has to be sunk
  element = this.content[idx]
  # When at 0, an element can not sink any further.
  while (idx > 0)
    # Compute the parent element's index, and fetch it.
    parentIdx = Math.floor((idx + 1) / 2) - 1
    parent = this.content[parentIdx]
    # Swap the elements if the parent is greater.
    if (this.scoreFunction(element) < this.scoreFunction(parent))
      this.content[parentIdx] = element
      this.content[idx] = parent
      # Update 'n' to continue at the new position.
      idx = parentIdx
    # Found a parent that is less, no need to sink any further.
    else
      break
  return


### @ignore ###
BinaryHeap.prototype.bubbleUp = (idx) ->
  # Look up the target element and its score.
  length = this.content.length
  element = this.content[idx]
  elemScore = this.scoreFunction(element)

  while(true)
    # Compute the indices of the child elements.
    child2Idx = (idx + 1) * 2
    child1Idx= child2Idx - 1
    # This is used to store the new position of the element,
    # if any.
    swapIdx = null
    # If the first child exists (is inside the array)...
    if (child1Idx < length)
      # Look it up and compute its score.
      child1 = this.content[child1Idx]
      child1Score = this.scoreFunction(child1)
      # If the score is less than our element's, we need to swap.
      swapIdx = child1Idx if (child1Score < elemScore)
       
    # Do the same checks for the other child.
    if (child2Idx < length)
      child2 = this.content[child2Idx]
      child2Score = this.scoreFunction(child2)
      if (child2Score < (if swapIdx == null then elemScore else child1Score))
        swapIdx = child2Idx

    # If the element needs to be moved, swap it, and continue.
    if (swapIdx != null)
      this.content[idx] = this.content[swapIdx]
      this.content[swapIdx] = element
      idx = swapIdx
    # Otherwise, we are done.
    else
      break
  return
