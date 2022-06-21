// herkijk video vanaf 1:22:34
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;



// instellingen van de speler
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0
    //laad de image van de speler in en de instellingen van image
    const image = new Image();
    image.src = "./img/plane.png";
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




//instellingen van de projectielen speler
class Projectile{
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity

    this.radius = 4
  }
    draw() {
      c.beginPath()
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
      c.fillStyle = 'lightblue'
      c.fill()
      c.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

//schieten van invaders
class InvaderProjectile{
  constructor({position, velocity}){
    this.position = position
    this.velocity = velocity

    this.width = 3
    this.height = 10
  }
    draw() {
      c.fillStyle = 'white'
      c.fillRect(this.position.x, this.position.y, this.width, this.height)
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

    shoot(InvaderProjectiles){
      InvaderProjectiles.push(new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height
        },
        velocity: {
          x: 0,
          y: 5
        }
      }))

    }
  }



// dit zijn de instellingen van de invaders als groep
class Grid {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 10,
            y: 0
        }
        //spawnen van invaders
        this.invaders = []

        //spawn hoeveelheid enemies lengte en breedte
        const columns = Math.floor(Math.random() * 12 + 8)
        const rows = Math.floor(Math.random() * 1 + 3)

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

// constante functie's
const player = new Player();
const projectiles = []
const grids = []
const InvaderProjectiles = []

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

// orginele variable waardes
let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)




// de functie om animatie's te laten zien
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  InvaderProjectiles.forEach(InvaderProjectile => {
    InvaderProjectile.update()
  })

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

    //projectile spawn
    if (frames % 100 === 0 && grid.invaders.lenght > 0){
      grid.invaders[Math.floor(Math.random() * grid.invaders.lenght)].shoot(InvaderProjectiles)
    }

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


              //remove invader / projectile
              if(invaderFound && projectileFound){
              grid.invaders.splice(i, 1)
              projectiles.splice(j, 1)

              if (grid.invaders.lenght > 0) {
                const firstInvader = grid.invaders[0]
                const lastInvader = grid.invaders[grid.invaders.lenght - 1]

                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                grid.position.x = firstInvader.position.x
              }
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
  //spawned een nieuwe grid van enemies op een minimale fps van 2300 tot en met 3000 fps
  if(frames % randomInterval  === 0){
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 700 + 1000)
    frames = 0
    // console.log(randomInterval)
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