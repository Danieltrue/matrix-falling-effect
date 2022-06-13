const canvas  = document.querySelectorAll('#canvas')[0];

const matrixCharacter = '1234567890';

function generateQueryContructor(query) {
  for (const key in query) {
    this[key] = query[key];
  }
}

function randomNumber(from, to) {
  return Math.floor(Math.random() * (to + 1)) + from;
}

function randomInArray( arr) {
  const index = randomNumber(0 ,arr.length - 1);
  return arr[index]
}

class MatrixEffect {
  constructor() {
    generateQueryContructor.call(this, ...arguments);
  }
  get ctx() {
    return this.canvas.getContext('2d');
  }
  build(){
    this.#buildCanvas();
    this.#buildSymbols();
    this.#buildAnimation();
  }
  #buildCanvas() {
    const {canvas, settings} = this;

    //Set the canva width and height the device W/H
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Total colum
    this.totalColumn = Math.round(canvas.width / settings.columnSize);
  }
  #buildSymbols() {
    this.symbols = [...new Array(this.totalColumn)].map((__,index) => {
      const randomY = randomNumber(0, Math.round(this.canvas.height / this.settings.columnSize))
      const matrixSymbolSettings = {
        matrixEffect: this,
        text: randomInArray(matrixCharacter),
        x: index,
        y: randomY
      }
      return new MatrixSymbol( matrixSymbolSettings );
  });
  }
  #buildAnimation() {
    const {ctx,settings: {columnSize}} = this;
    ctx.font = `${columnSize}px monospace`
  }
  startAnimation() {
    const matrixAnimation = new MatrixAnimation({matrixEffect: this})
    matrixAnimation.animate();
  }
}


class MatrixSymbol {
  constructor() {
    generateQueryContructor.call(this, ...arguments);
  }
  draw() {
    const {canvas, ctx, settings: {columnSize,symbolsColors}} = this.matrixEffect;

    ctx.fillStyle = randomInArray(symbolsColors);
    const xPos = this.x * columnSize;
    const yPos = this.y * columnSize;

    ctx.fillText(this.text,xPos,yPos);

    this.#resetText();
    this.#resetYPos({yPos, canvas});
  }
  #resetText() {
    this.text = randomInArray(matrixCharacter);
  };
  #resetYPos({yPos, canvas}) {
    const delayCondition= Math.random() > 0.98
    this.y = yPos > canvas.height && delayCondition ? 0 : this.y + 1;
  }
}

class MatrixAnimation {
  constructor() {
    generateQueryContructor.call(this, ...arguments);
  }
  animate() {
    const { ctx, canvas, symbols, settings } = this.matrixEffect;

    ctx.fillStyle = `rgba(0,0,0,0.${settings.fadeOutEffect})`;
    ctx.textAlign = 'center';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    symbols.forEach(symbol => symbol.draw(ctx));

    requestAnimationFrame(this.animate.bind(this));
  }
}

const effect = new MatrixEffect({canvas, settings: {
  columnSize: 15,
  symbolsColors: ['#10ffb4'],
  fadeOutEffect: '05',
}});


//bulding the whole animation
effect.build()
effect.startAnimation()
