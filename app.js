//Video Tijd 1:34:15
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//Instellingen Speler Class
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0
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

    c.save()
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );

    c.rotate(this.rotation)

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

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

//instellingen speler Projectiles
class Projectile {
  constructor({
    position,
    velocity
  }) {
    this.position = position
    this.velocity = velocity

    this.radius = 4
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0,Math.PI * 2)
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

//instellingen Particle Explosion
class Particle {
  constructor({
    position,
    velocity,
    radius,
    color
  }) {
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0,Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.opacity -= 0.01
  }
}


//Instellingen Invader Projectiles
class InvaderProjectile {
  constructor({
    position,
    velocity
  }) {
    this.position = position
    this.velocity = velocity


    this.width = 3
    this.height = 10
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width,
      this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

  }
}

// Instellingen van de Invader class
class Invader {
  constructor({
    position
  }) {
    this.velocity = {
      x: 0,
      y: 0,
    };


    const image = new Image();
    image.src = "./img/invader.png";
    image.onload = () => {
      const scale = 1;
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
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({
    velocity
  }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x
      this.position.y += velocity.y;
    }
  }

  //Schietfunctie Invaders
  shoot(invaderProjectiles) {
    invaderProjectiles.push(new InvaderProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.width
      },

      velocity: {
        x: 0,
        y: 5
      }

    }))
  }
}

//GridInstellingen Invaders
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 6,
      y: 0
    }
    //spawnen van invaders
    this.invaders = []
   //spawn hoeveelheid enemies lengte en breedte
   //spawn hoeveelheid enemies lengte en breedte
   const columns = Math.floor(Math.random() * 8 + 8)
   const rows = Math.floor(Math.random() * 1 + 3)

    this.width = columns * 30

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {

        this.invaders.push(new Invader({
          position: {
            x: x * 30,
            y: y * 30

          }
        }))
      }


    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    this.velocity.y = 0

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}
// Arrays
const player = new Player();
const Projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

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
 //spawned een nieuwe grid van enemies op een minimale fps van 700 tot en met 1300 fps
let randomInterval = Math.floor(Math.random() * 500 + 700)


function createParticles({object, color}) {
  particles.push(new Particle({
    position: {
      x:  object.position.x + object.width / 2,
      y:  object.position.y + object.height / 2
    },
    velocity: {
      x:  (Math.random() - 0.5) * 5, 
      y:  (Math.random() - 0.5) * 5
    },
    radius: Math.random() * 3,
    color: color || 'lightblue'

  })
  )
  }


// de functie om animatie's te laten zien
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  particles.forEach((particle, i) => {
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  console.log(particles)

  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1)

      }, 0)
    } else invaderProjectile.update()
// als een projectile de speler raakt dan stop  het spel
    if (invaderProjectile.position.y + invaderProjectile.
      height >=
       player.position.y && invaderProjectile.position.x +
       invaderProjectile.width >= player.position.x && 
       invaderProjectile.position.x <= player.position.x +
       player.width
       ) {

        console.log('you lose')
      }
  })


  Projectiles.forEach((Projectile, index) => {

    if (Projectile.position.y + Projectile.radius <= 0) {
      setTimeout(() => {
        Projectiles.splice(index, 1)
      }, 0)
    } else {
      Projectile.update()
    }

  })

  grids.forEach((grid, gridIndex) => {
    grid.update()

    //spawn projectiles invaders
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({
        velocity: grid.velocity
      })

      //projectile hit enemy
      Projectiles.forEach((Projectile, j) => {
        if (Projectile.position.y - Projectile.radius <=
          invader.position.y + invader.height &&
          Projectile.position.x + Projectile.radius >=
          invader.position.x && Projectile.position.x -
          Projectile.radius <= invader.position.x + invader.width &&
          Projectile.position.y + Projectile.radius >= invader.position.y
        ) {




          setTimeout(() => {
            const invaderFound = grid.invaders.find((invader2) => invader2 === invader)
            const ProjectileFound = Projectiles.find(
              (Projectile2) => Projectile2 === Projectile)

            //weg halen invader en projectile
            if (invaderFound && ProjectileFound) {
              for(let i = 0; i < 15; i++){
                createParticles({
                  object: invader
                })

              grid.invaders.splice(i, 1)
              Projectiles.splice(j, 1)
              //invader die aan de zijkanten staan makkerlijker neer schieten
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0]
                const lastInvader = grid.invaders[grid.invaders.length - 1]

                grid.width = lastInvader.position.x -
                  firstInvader.position.x + lastInvader.width
                grid.position.x = firstInvader.position.x
              } else {
                grids.splice(gridIndex, 1)
              }
            }
          }, 0)
        }
      })
    })
  })

  // als je op A druk dan ga je naar links
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15
    // als je op D druk dan ga je naar rechts
  } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7
    player.rotation = 0.15
  } else {
    player.velocity.x = 0;
    player.rotation = 0
  }

  //spwans de invaders in
  if (frames % randomInterval === 0) {
    grids.push(new Grid())
    //spawned een nieuwe grid van enemies op een minimale fps van 1500 tot en met 2000 fps
    randomInterval = Math.floor(Math.random() * 700 + 500)
    frames = 0
  }



  frames++

}
animate();

addEventListener("keydown", ({
  key
}) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case " ":
      Projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -10
        }
      }))
      break;
  }
});

addEventListener("keyup", ({
  key
}) => {
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