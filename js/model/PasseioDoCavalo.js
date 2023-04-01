class PasseioDoCavalo {

    constructor() {
        this.executing = false
        this.nodes = []
        this.generateNodes()
    }

    generateNodes() {
        for(let i = 0; i < 8; ++i) {
            for(let j = 0; j < 8; ++j) {
                const node = new Node(i, j)
                this.nodes.push(node)
            }
        }
    }

    play(line, column, isHeuristicOn) {
        console.log(`Playing on line ${line} and column ${column}`)
        this.nodes.forEach(node => node.updateNeighborns(this.nodes))

        const startNode = this.nodes.find((node) => node.line === line && node.column === column)
        const result = startNode.playPosition(this.nodes, isHeuristicOn, 1)
        postMessage({ event: 'finishExecution', result, nodes: this.nodes.map(node => node.toMessage()) })
    }
}