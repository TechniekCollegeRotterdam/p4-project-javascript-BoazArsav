//kijk video vanaf 1:00:39
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

    this.radius = 3
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
  
    update() {
      if (this.image) {
        this.draw();
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y;
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
            x: 0,
            y: 0
        }
        //spawnen van invaders
        this.invaders = []

        const rows = Math.floor(Math.random() * 5)
        for (let x = 0; x < 10; x++){
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

    }
}

const player = new Player();
const projectiles = []
const grids = [new Grid()]
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
    grid.invaders.forEach(invader => {
        invader.update()
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