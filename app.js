//kijk video vanaf 1:22:20
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0
    //laad de image van de speler in en de instellingen van image
    const image = new Image();
    image.src = "./img/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height,
      };
    };
  }

  draw() {
    // dit slaat deze instellingen van de speler op als het iets moet doen
    c.save()
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
      )

      c.rotate(this.rotation)

      c.translate(
        -player.position.x - player.width / 2,
        -player.position.y - player.height / 2
        )

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.restore()
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile{
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity

    this.radius = 4
  }
    draw() {
      c.beginPath()
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = 'red'
      c.fill()
      c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

// Instellingen van de Invader class
class Invader {
    constructor({position}) {
      this.velocity = {
        x: 0,
        y: 0,
      };
  
      
      //laad de image van de Invader in en de instellingen van image
      const image = new Image();
      image.src = "./img/invader.png";
      image.onload = () => {
        const scale = 1
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
        this.position = {
          x: position.x,
          y: position.y
        };
      };
    }
  
    draw() {
      // dit slaat deze instellingen van de Invader op als het iets moet doen
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  
    update({velocity}) {
      if (this.image) {
        this.draw();
        this.position.x += velocity.x
        this.position.y += velocity.y;
      }
    }
  }

class Grid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 2,
            y: 0
        }
        //spawnen van invaders
        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 3)

        this.width = columns * 30

        for (let x = 0; x < columns; x++){
            for (let y = 0; y < rows; y++){
            this.invaders.push(new Invader({
                position:{
                x: x * 30,
                y: y * 30
            }
        })
        )
        }
    }
        console.log(this.invaders)
    }

    update(){
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y

      this.velocity.y = 0

      if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
        this.velocity.x = -this.velocity.x
        this.velocity.y = 30
      }
    }
}

const player = new Player();
const projectiles = []
const grids = []
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};


let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)



function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  projectiles.forEach (projectile => {

    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() =>{
        projectiles.splice (projectile, 1)
      }, 0)
    
    } else {
      projectile.update();
    }
    
  })

  grids.forEach(grid => {
    grid.update()
    grid.invaders.forEach((invader, i) => {
        invader.update({velocity: grid.velocity})

          //dit is voor de aliens hit detectie
        projectiles.forEach((projectile, j) => {
          if (projectile.position.y - projectile.radius <= invader.position.y + invader.height 
              && projectile.position.x + projectile.radius >= invader.position.x 
              && projectile.position.x - projectile.radius <= invader.position.x + invader.width
              && projectile.position.y + projectile.radius >= invader.position.y){

            setTimeout(() =>{
              const invaderFound = grid.invaders.find(invader2 => 
              invader2 === invader
              )

              const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)

              if(invaderFound && projectileFound){
              grid.invaders.splice(i, 1)
              projectiles.splice(j, 1)
            }
            }, 0)

          }

        })
    })
  })
  //besturing van speler
  // als je op A druk dan ga je naar links met border limit
  // player.rotation is de rotatie van de speler als je een richting in ga
  if (keys.a.pressed && player.position.x >= 0)  {
    player.velocity.x = -7;
    player.rotation = -0.15
    // als je op D druk dan ga je naar rechts met border limit
    // player velocity is snelheid speler
  } else if (keys.d.pressed && player.position.x +player.width <= canvas.width) {
    player.velocity.x = 7
    player.rotation = 0.15
  } else {
    // dit gebeurt er met de speler als je niks indrukt
    player.velocity.x = 0
    player.rotation = -0
  }

  // console.log(frames)
  //spawned een nieuwe grid op een minimale fps van 500 en meer
  if(frames % randomInterval  === 0){
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500 + 500)
    frames = 0
    console.log(randomInterval)
  }
  
  frames++
}


animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case " ":
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -20
        }
      })
      )
      console.log(projectiles)
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case " ":
      break;
  }
});