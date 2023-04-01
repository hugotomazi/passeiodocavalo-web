let inExecution = false
function initBoard() {
    const carregando = document.getElementsByClassName('carregando')[0]
    carregando.setAttribute('style', 'display:none')
    const board = document.getElementsByClassName('tabuleiro')[0]
    for(let i = 0; i < 8; ++i) {
        for(let j = 0; j < 8; ++j) {
            const div = document.createElement('div')
            div.id = `position-${i}-${j}`
            div.onclick = onClickPosition

            if( (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
                div.className = 'position-pair'
            } else {
                div.className = 'position-odd'
            }

            const text = document.createElement('div')
            div.appendChild(text)
            board.appendChild(div)
        }
    }
}

function renderPlayNumber(line, column, playNumber) {
    const div = document.querySelector(`#position-${line}-${column} > div`)
    div.textContent = `${playNumber ? playNumber : ''}`
}

function finishExecution(result, nodes) {
    inExecution = false
    const carregando = document.getElementsByClassName('carregando')[0]
    carregando.setAttribute('style', 'display:none')
    nodes.forEach(node => renderPlayNumber(node.line, node.column, node.playNumber))
    setTimeout(() => {
        if(result) {
            alert('Problema solucionado com sucesso!')
        } else {
            alert('Não foi possível encontrar uma resposta a partir deste ponto de início!')
        }
    }, 100)
}

function processEvent(event) {
    const data = event.data
    switch(data.event){
        case 'finishExecution':
            finishExecution(data.result, data.nodes)
            break;
    }
}

function onClickPosition() {
    if(inExecution) {
        return alert('Já existe uma execução em andamento, aguarde...')
    }
    for(let i = 0; i < 8; ++i) {
        for(let j = 0; j < 8; ++j) {
            renderPlayNumber(i, j, null)
        }
    }

    const carregando = document.getElementsByClassName('carregando')[0]
    carregando.setAttribute('style', 'display:flex')

    const position = this.id.replace('position-', '').split('-')
    if(window.Worker) {
        const worker = new Worker('js/model/worker.js')
        worker.onmessage = processEvent
        worker.onerror = function(error) {
            console.log(`ERRO NO WEB-WORKER`, error)
        }
        inExecution = true
        worker.postMessage({ 
            line: parseInt(position[0]),
            column: parseInt(position[1]),
            isHeuristicOn: document.querySelector('input[name="tipo-execucao"]:checked').value === '1'
        })
    } else {
        console.log('not support web-worker')
    }
}

function main() {
    initBoard()
}

window.onload = main