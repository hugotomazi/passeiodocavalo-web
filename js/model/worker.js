importScripts('./PasseioDoCavalo.js')
importScripts('./utils/Node.js')
onmessage = function(event) {
    const { line, column, isHeuristicOn } = event.data
    const passeioDoCavalo = new PasseioDoCavalo()
    passeioDoCavalo.play(line, column, isHeuristicOn)
}