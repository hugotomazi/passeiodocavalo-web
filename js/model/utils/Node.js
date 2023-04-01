class Node {
    constructor(line, column) {
        this.neighbors = []
        this.line = line
        this.column = column
        this.playNumber = null
    }

    updateNeighborns(nodes) {
        function isValidPosition(x, y) {
            return x >= 0 && x < 8 && y >= 0 && y < 8 
        }

        const { line: x, column: y } = this
        const positions = [
            { x: x + 2, y: y + 1 },
            { x: x + 2, y: y - 1 },
            { x: x + 1, y: y + 2 },
            { x: x + 1, y: y - 2 },
            { x: x - 2, y: y + 1 },
            { x: x - 2, y: y - 1 },
            { x: x - 1, y: y + 2 },
            { x: x - 1, y: y - 2 }
        ].filter(position => isValidPosition(position.x, position.y))

        this.neighbors = nodes.filter(node => positions.find(position => position.x === node.line && position.y === node.column))
    }

    applyHeuristic(isHeuristicOn) {
        if(isHeuristicOn) {
            return this.neighbors.filter(node => node.playNumber === null).sort((a, b) => a.neighbors.length - b.neighbors.length)
        } else {
            const aux = [ ...this.neighbors.filter(node => node.playNumber === null) ]
            for (let i = aux.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [aux[i], aux[j]] = [aux[j], aux[i]];
            }
            return aux;
        }
    }

    toMessage() {
        return {
            line: this.line,
            column: this.column,
            playNumber: this.playNumber
        }
    }

    playPosition(nodes, isHeuristicOn, playNumber) {
        this.playNumber = playNumber

        if(playNumber === 64) 
            return true

        const neighbors = this.applyHeuristic(isHeuristicOn)

        for(let i = 0; i < neighbors.length; ++i) {
            if(neighbors[i].playPosition(nodes, isHeuristicOn, playNumber + 1))
                return true
        }

        this.playNumber = null
        return false
    }
}