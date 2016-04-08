type Board = Coin[];

interface BoardSize {
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

interface Striker {
    xPos: number;
    yPos: number;
    diameter: number;
}

interface Coordinate {
  xPos : number;
  yPos : number;
}

interface Coin {
    coordinate : Coordinate;
    diameter: number;
    color: string;
}
interface IState {
    strikerPlacement: number; // where striker was shot from
    strikerAngle: number;     // angle at which striker was shot
    strikerSpeed: number;     // speed at which striker was shot
    board: Board;             // positons of all coins
}

module gameLogic {
  
  const QUEENCOLOR = "pink";
  const COLOR1 = "black";
  const COLOR2 = "white";
  
  // Return initial board 
  export function getInitialBoard(gameSettings : {[setting : string] : number}): Board {
    let boardSize : BoardSize = getInitialSize(gameSettings);
    let board: Board = [];
    
    // set the position of hte queen
    // insert that qqueen into board
    let queenCoordinate : Coordinate = {xPos: boardSize.centerX,
                                        yPos: boardSize.centerY};
    let queen : Coin = {coordinate:queenCoordinate,
                        diameter:gameSettings["coinDiameter"],
                        color:QUEENCOLOR};

    // Initialize two layers
    let coins : Coin[] = [];
    coins.push(queen);
    let numberOfSides = 6;
    
    let color : boolean = false;
    let outerColor : boolean =  false;
    
    let circles : Coordinate[] = [];
    for (let i = 1; i <= gameSettings["numberOfSides"]; i++) {
      let c = getCoordinates(gameSettings, boardSize.centerX, boardSize.centerY, i, gameSettings["hexSize"]);
      let c2 = getCoordinates(gameSettings, boardSize.centerX, boardSize.centerY, i, gameSettings["hexSize"]*2);
      circles.push(c2);
      
      let coinColor = color ? COLOR1 : COLOR2;
      let outerCoinColor = outerColor ? COLOR1 : COLOR2;
      
      color = !color;
      coins.push(createCoin(gameSettings, c, coinColor)); 
      coins.push(createCoin(gameSettings, c2, outerCoinColor));
    }
    
    //color = false;
    outerColor = !outerColor;
    for (let i = 0; i < circles.length; i++) {
      let c : Coordinate = {xPos: (circles[i].xPos + circles[(i+1)%gameSettings["numberOfSides"]].xPos)/2.0,
                            yPos: (circles[i].yPos + circles[(i+1)%gameSettings["numberOfSides"]].yPos)/2.0};
      let coinColor = outerColor ? COLOR1 : COLOR2;
      
      coins.push(createCoin(gameSettings, c, coinColor)); 
    }
    return coins;
  }
  
  function createCoin(gameSettings : {[setting : string] : number}, c : Coordinate, coinColor : string) : Coin {
    let coinCoordinate : Coordinate = {xPos:c.xPos,
                                   yPos:c.yPos};
    let coin : Coin = {coordinate:coinCoordinate,
                         diameter:gameSettings["coinDiameter"],
                         color:coinColor};
    return coin;
  }
  
  function getCoordinates(gameSettings : {[setting : string] : number}, centerX : number, centerY : number, index : number, hexSize : number) : Coordinate {
    
    let c : Coordinate = {xPos: centerX + hexSize * Math.cos(index * 2 * Math.PI / gameSettings["numberOfSides"]),
                          yPos: centerY + hexSize * Math.sin(index * 2 * Math.PI / gameSettings["numberOfSides"])};
    return c;
  }
  
  export function getInitialSize(gameSettings : {[setting : string] : number}): BoardSize {
      let boardSize : BoardSize = {width: gameSettings["outerBoardWidth"], 
                                   height: gameSettings["outerBoardHeight"],
                                   centerX: gameSettings["outerBoardWidth"]/2,
                                   centerY: gameSettings["outerBoardHeight"]/2};
      return boardSize;
  }

  export function getInitialState(gameSettings : {[setting : string] : number}): IState {
    return {
      strikerPlacement: 0,
      strikerAngle: 0,
      strikerSpeed: 0,
      board: getInitialBoard(gameSettings)
    };
  }
}
