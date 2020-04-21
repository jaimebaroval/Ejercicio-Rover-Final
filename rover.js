// Tamaño Tabla Terreno Mars

let tableSize = {
    x: 30,
    y: 30
}
let tableCellSize = window.innerHeight / (tableSize.y * 1.28)
let fontSize = window.innerHeight / (tableSize.y * 2.5)
let numObstaculos = 10 * (tableSize.x * tableSize.y) / 100 // 10% de obstaculos
let numCommands = 100
let velVisionCommands = 20
let occupiedCells = []

const tableArray = []
const obstaculosArray = []
const roversArray = []
const directions = ['N', 'S', 'E', 'W']
const commands = ['F', 'B', 'R', 'L']
const color = [
    {
        color: 'red',
        cellAfterColor: '#ff000099'
    },
    {
        color: 'blue',
        cellAfterColor: '#0000ff99'
    },
    {
        color: 'green',
        cellAfterColor: '#00ff0099'
    }]







// Objeto Rover ()
function Rover(name) {
    this.posInit = {}
    this.posAfter = {}
    this.idAfter
    this.posActual = {}
    this.idActual
    this.posBefore = {}
    this.directionActual
    this.commandList = []
    this.command
    this.commandAfter
    this.name = name
    this.color
    this.cellAfterColor
    this.posLog = {}
}

// Rover Prototype
Rover.prototype = {
    directionInit() {
        this.directionActual = directions[Math.floor(Math.random() * directions.length)];
        // this.directionActual = 'N'
    },
    colorRover(color) {
        this.color = color.color
        this.cellAfterColor = color.cellAfterColor
    },
    calcInitPos(x, y) {
        this.x = tableSize.x
        this.y = tableSize.y

        do {
            let posCalc = {
                x: Math.floor((Math.random() * x) + 1),
                y: Math.floor((Math.random() * y) + 1)
            }

            // Impedir que se salgan de zona
            this.posActual.x = posCalc.x != x ? posCalc.x : (x - 1)
            this.posActual.y = posCalc.y != y ? posCalc.y : (y - 1)
        } while (checkCell(this.posActual) == 1)

        this.posInit.x = this.posActual.x
        this.posInit.y = this.posActual.y

        occupiedCells.push(this.posInit)

        roversArray.push(this.posInit)

    },
    createCommands(i) {
        this.commandList = []
        for (i = 0; i < numCommands; i++) {
            this.commandList[i] = commands[Math.floor(Math.random() * commands.length)]
        }
    },
    executeCommand(command) {

        this.posAfter.x = this.posActual.x
        this.posAfter.y = this.posActual.y

        if (command == 'F' || command == 'B') {
            this.moveRover(command)
        } else {
            this.turnRover(command)
        }
    },
    checkNextCell(commMove) {
        if (commMove.y <= 0 || commMove.y >= tableSize.y || commMove.x <= 0 || commMove.x >= tableSize.x) {
            console.log(this.name + ': FUERA DE TABLA');
            this.posActual.x = this.posAfter.x
            this.posActual.y = this.posAfter.y

        } else {
            // console.log(this.name + ': OK POSITION');
            let nextCell = document.getElementById('x' + commMove.x + 'y' + commMove.y).innerHTML

            if (nextCell == 'X') {
                console.log(this.name + ': OBSTACULO');
                this.posActual.x = this.posAfter.x
                this.posActual.y = this.posAfter.y
            } else if (nextCell == 'R1' || nextCell == 'R2' || nextCell == 'R3') {
                console.log(this.name + ': OTRO ROVER');
                this.posActual.x = this.posAfter.x
                this.posActual.y = this.posAfter.y
            } else {
                console.log(this.name + ': OK POSITION');
                // console.log('commMove.x: ' + commMove.x);
                // console.log('commMove.y: ' + commMove.y);

                this.posActual.x = commMove.x
                this.posActual.y = commMove.y

                this.drawRoverMove()
            }
        }
    },
    moveRover(command) {
        this.posBefore.x = this.posActual.x
        this.posBefore.y = this.posActual.y

        command == 'F' ? this.checkNextCell(this.avanzar()) :
            command == 'B' ? this.checkNextCell(this.retroceder()) :
                null
    },
    turnRover(command) {
        command == 'R' ? this.girarDerecha() : this.girarIzquierda()
    },
    girarDerecha() {
        this.directionActual == 'N' ? this.directionActual = 'E' :
            this.directionActual == 'S' ? this.directionActual = 'W' :
                this.directionActual == 'E' ? this.directionActual = 'S' :
                    this.directionActual == 'W' ? this.directionActual = 'N' :
                        null
        console.log(this.name + ': Gira: ' + this.directionActual);
    },
    girarIzquierda() {
        this.directionActual == 'N' ? this.directionActual = 'E' :
            this.directionActual == 'S' ? this.directionActual = 'W' :
                this.directionActual == 'E' ? this.directionActual = 'N' :
                    this.directionActual == 'W' ? this.directionActual = 'S' :
                        null
        console.log(this.name + ': Gira: ' + this.directionActual);
    },
    avanzar() {
        this.directionActual == 'N' ? this.posBefore.y = (this.posActual.y) - 1 :
            this.directionActual == 'S' ? this.posBefore.y = (this.posActual.y) + 1 :
                this.directionActual == 'E' ? this.posBefore.x = (this.posActual.x) + 1 :
                    this.directionActual == 'W' ? this.posBefore.x = (this.posActual.x) - 1 :
                        null

        return this.posBefore

    },
    retroceder() {
        this.directionActual == 'N' ? this.posBefore.y = (this.posActual.y) + 1 :
            this.directionActual == 'S' ? this.posBefore.y = (this.posActual.y) - 1 :
                this.directionActual == 'E' ? this.posBefore.x = (this.posActual.x) - 1 :
                    this.directionActual == 'W' ? this.posBefore.x = (this.posActual.x) + 1 :
                        null

        return this.posBefore
    },
    drawRover() {
        this.idActual = 'x' + this.posActual.x + 'y' + this.posActual.y
        let celda = document.getElementById(this.idActual)
        celda.innerHTML = this.name
        celda.style.backgroundColor = this.color
        celda.style.color = 'white'
    },
    drawRoverMove() {
        this.idActual = 'x' + this.posActual.x + 'y' + this.posActual.y
        this.idAfter = 'x' + this.posAfter.x + 'y' + this.posAfter.y

        let newCell = document.getElementById(this.idActual)
        let afterCell = document.getElementById(this.idAfter)

        newCell.innerHTML = this.name
        newCell.style.backgroundColor = this.color
        newCell.style.color = 'white'

        if (this.directionActual == 'N' || this.directionActual == 'S') {
            afterCell.innerHTML = '|'
        } else {
            afterCell.innerHTML = '='
        }

        afterCell.style.backgroundColor = this.cellAfterColor
        afterCell.style.color = 'white'

        this.savePosLog(this.posBefore)
    },
    savePosLog: function (cellExplored) {

        // cellExplored.x = this.posActual.x
        // cellExplored.y = this.posActual.y


        // console.log('cellExplored: ' + cellExplored.x + ' , ' + cellExplored.y);
        // console.log(occupiedCells);


    }

}

// Crear Terreno Mars
function CreateMars(x, y) {
    this.x = x
    this.y = y

    //body reference 
    var body = document.getElementById("lienzo");

    // create elements <table> and a <tbody>
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");
    tbl.setAttribute('class', 'mars')


    // cells creation
    for (var j = 0; j < y; j++) {
        // table row creation
        var row = document.createElement("tr");
        //Array Row Creation
        j == 0 ? row.style.backgroundColor = '#ffffff99' : null
        //Create tableArray
        tableArray[j] = []

        for (var i = 0; i < x; i++) {

            let idNum = 'x' + i + 'y' + (parseFloat((j).toString()))

            //Array Col Creation
            tableArray[j][i] = idNum
            var cell = document.createElement("td");
            cell.setAttribute("class", "cell")
            i == 0 ? cell.style.backgroundColor = '#ffffff99' : null
            if (j != 0 && i != 0) {
                cell.setAttribute("id", idNum);
            }
            if (j == 0 || i == 0) {
                //Pintar numeros
                var cellText = j >= 1 ? document.createTextNode(j) : document.createTextNode(i)
                cell.appendChild(cellText);
            } else {
                var cellText = document.createTextNode('')
                cell.appendChild(cellText);
            }

            row.appendChild(cell);
        }

        //row added to end of table body
        tblBody.appendChild(row);
    }

    // append the <tbody> inside the <table>
    tbl.appendChild(tblBody);
    // put <table> in the <body>
    body.appendChild(tbl);
    // tbl border attribute to 
    tbl.setAttribute("border", "1");


    // Cell Height adjust
    let cellHeight = document.querySelectorAll('td.cell')

    // body.style.height = `${window.innerHeight - 100}px`

    cellHeight.forEach(function (e) {
        e.style.height = `${tableCellSize}px`
        e.style.width = `${tableCellSize}px`
        e.style.fontSize = `${fontSize}px`
    })

}

// CreateMars () Prototype
CreateMars.prototype = {
    createObstaculos: function (numObs) {
        let posObs

        console.log('numObstaculos ' + numObs);
        for (i = 0; i < numObs; i++) {

            do {
                posObs = {
                    x: Math.floor((Math.random() * x) + 1),
                    y: Math.floor((Math.random() * y) + 1)
                }

                posObs.x = posObs.x != x ? posObs.x : (x - 1)
                posObs.y = posObs.y != y ? posObs.y : (y - 1)

            } while (checkCell(posObs) == 1)

            obstaculosArray[i] = posObs
            occupiedCells[i] = posObs

            this.drawObstacle(posObs)

        }

        console.log(obstaculosArray);

    },
    drawObstacle: function (posOb) {
        // Pintar Obstaculo en Tabla
        idObs = document.getElementById('x' + posOb.x + 'y' + posOb.y)
        idObs.innerHTML = 'X'
        idObs.style.backgroundColor = 'yellow'
    }
}

function checkCell(cell) {
    let check

    occupiedCells.forEach(function (j) {
        if (cell.x == j.x && cell.y == j.y) {
            console.log('COINCIDE!!!!!');
            check = 1
        }
    })

    return check
}

//Crear Instacias
let rover1 = new Rover('R1')
let rover2 = new Rover('R2')
let rover3 = new Rover('R3')


function initRovers() {


    let instancias = arguments.length

    for (i = 0; i < instancias; i++) {
        arguments[i].directionInit()
        arguments[i].colorRover(color[i])
        arguments[i].calcInitPos(tableSize.x, tableSize.y)
        arguments[i].createCommands(numCommands)
        arguments[i].drawRover()

        // console.log(arguments[i]);
        console.log('commandList: ' + arguments[i].commandList);
    }



    console.log(occupiedCells);

    startBtn.disabled = false

}



// Lanzar Programa

window.onload = function () {

    datos1.innerHTML = document.getElementById('customRange1').value
    datos2.innerHTML = document.getElementById('customRange2').value
    datos3.innerHTML = document.getElementById('customRange3').value
    datos4.innerHTML = document.getElementById('customRange4').value

    customRange1.addEventListener('mousemove', this.cambiarValores)
    customRange2.addEventListener('mousemove', this.cambiarValores)
    customRange3.addEventListener('mousemove', this.cambiarValores)
    customRange4.addEventListener('mousemove', this.cambiarValores)

    startBtn.addEventListener('click', dibujarTabla)
    // stopBtn.addEventListener('click', dibujarStop)

    CreateMars(tableSize.x, tableSize.y)
    CreateMars.prototype.createObstaculos(numObstaculos)

    initRovers(rover1, rover2, rover3)

    rover1.commandList.forEach(function (e, idx) {
        setTimeout(function () {
            rover1.executeCommand(e)
        }, (idx * velVisionCommands))

    })

    rover2.commandList.forEach(function (e, idx) {
        setTimeout(function () {
            rover2.executeCommand(e)
        }, (idx * velVisionCommands) + (velVisionCommands / 4))

    })

    rover3.commandList.forEach(function (e, idx) {
        setTimeout(function () {
            rover3.executeCommand(e)
        }, (idx * velVisionCommands) + (velVisionCommands / 2))

    })




}


function dibujarTabla() {


    occupiedCells = []

    let lienzo = document.getElementById("lienzo")
    let anchoTabla = document.getElementById('customRange1').value
    let numObst = document.getElementById('customRange2').value
    let numComandos = document.getElementById('customRange3').value
    let VelVision = document.getElementById('customRange4').value

    tableSize.x = anchoTabla
    tableSize.y = anchoTabla
    tableCellSize = window.innerHeight / (anchoTabla * 1.28)
    fontSize = window.innerHeight / (anchoTabla * 2.5)

    numObstaculos = numObst * (anchoTabla * anchoTabla) / 100


    lienzo.innerHTML = ''

    CreateMars(anchoTabla, anchoTabla)
    CreateMars.prototype.createObstaculos(numObstaculos)

    numCommands = numComandos

    // console.log('numCommands: ' + numCommands);

    initRovers(rover1, rover2, rover3)

    rover1.commandList.forEach(function (e, idx) {
        setTimeout(function () {
            rover1.executeCommand(e)
        }, (idx * VelVision))

    })

    rover2.commandList.forEach(function (e, idx) {
        setTimeout(function () {
            rover2.executeCommand(e)
        }, (idx * VelVision) + (VelVision / 4))

    })

    rover3.commandList.forEach(function (e, idx) {
        setTimeout(function () {
            rover3.executeCommand(e)
        }, (idx * VelVision) + (VelVision / 2))

    })




}

function cambiarValores() {

    datos1.innerHTML = document.getElementById('customRange1').value
    datos2.innerHTML = document.getElementById('customRange2').value
    datos3.innerHTML = document.getElementById('customRange3').value
    datos4.innerHTML = document.getElementById('customRange4').value

    let anchoTabla = datos1.value
    let numObst = datos2.value
    let numComandos = datos3.value
    // let velCommands = document.getElementById('customRange4').value

    numCommands = numComandos

    tableSize.x = anchoTabla
    tableSize.y = anchoTabla
    tableCellSize = window.innerHeight / (anchoTabla * 1.28)
    fontSize = window.innerHeight / (anchoTabla * 2.5)

    numObstaculos = numObst * (anchoTabla * anchoTabla) / 100

}

function dibujarStop() {

    console.log('STOP');

}

