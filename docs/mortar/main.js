title = "MORTAR";

description = `
[Slide] Aim
[Tap] Shoot
`;

characters = [
  `
 rrr
rllrr
rlrrr
rrrrr
 rrr
  r  
`,
  `
 yyy
yyyyy
yyyycc
yyyycc
yyyyy
yy yy
`,
  `
  r
  r
rr rr
  r
  r
`,
];

//const sseed = rndi(-1000000, 1000000);
//console.log(sseed);
//-37914

options = {
  viewSize: {x: 150, y: 100},
  seed: -37914,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "crt",
};

/** @type { {pos: Vector}[] } */
let balons;
let nextBalonDist;
let pAngle;
let px;
let pos;
/** @type { {pos: Vector}[]} */
let shots;
/** @type { {pos: Vector, vel:Vector}[]} */
let mortars;
let mortarTicks;
let speedRatio;
let rain;

function update() {
  if (!ticks) {
    balons = [];
    nextBalonDist = 0;
    shots = [];
    mortars = [];
    mortarTicks = 0;
    px = 75;
    pos = vec(50, 10);
    rain = times(30, () => {
      const posX = rnd(0, 150);
      const posY = rnd(0, 90);
      return {
        pos: vec(posX, posY),
        speed: rnd(1.0, 2.0)
      };
    });
  }
  color("green");
  rect(0, 90, 150, 10);
  let scr = difficulty;
  nextBalonDist -= scr;
  if (nextBalonDist < 0) {
    balons.push({pos: vec(rnd(20, 130), -4)});
    nextBalonDist = rnd(100, 110);
  }
  if (input.isPressed) {
    if (mortarTicks < 1) {
      play("hit");
      color("yellow");
      particle(75, 70, 20, 1.3, -PI/2, PI/2);
      shots.push({pos: vec(70, 70)});
      mortars.push({pos: vec(input.pos.x, -40), vel: vec(rnd(-.15, .15), 2 + scr/4)});
      mortarTicks++;
    }
  }
  remove(shots, (sh) => {
    sh.pos.y -= 20 + scr/4;
    color("yellow");
    rect(sh.pos.x, sh.pos.y, 10, 10);
    return sh.pos.y < -10;
  });
  remove(mortars, (m) => {
    m.pos.y += scr;
    m.pos.add(m.vel);
    color("black");
    const c = char("b", m.pos).isColliding;
    if (m.pos.y > 90) {
      mortarTicks--;
      color("light_yellow");
      particle(m.pos.x, m.pos.y + 3, 30, 1.1, -PI/2, PI/3)
      return (true);
    }
  });
  remove (balons, (b) => {
    b.pos.y += scr/3;
    color("black");
    const bc = char("a", b.pos).isColliding;
    if (bc.char.b) {
      score += 5 * difficulty;
      play("explosion");
      color("red")
      particle(b.pos);
      return true
    }
    if (bc.rect.green) {
      play("lucky");
      end();
    }
    return ((b.pos.x < 85 && b.pos.x > 65) || b.pos.x < 5 || b.pos.x > 145)
  })
  pos.x = clamp(input.pos.x, 3, 147);
  pos.y = clamp(input.pos.y, 2, 87);
  color("black");
  char("c", pos.x, pos.y);
  color("light_black");
  rect(64, 82, 22, 20)
  color("light_green");
  rect(67, 65, 16, 33);
  color("light_yellow");
  rect(67, 70, 16, 2);
  color("light_yellow");
  rect(67, 73, 16, 2);
  color("light_black");
  rect(61, 87, 28, 20);
  rain.forEach((r) => {
    r.pos.y += r.speed;
    if (r.pos.y > 95) {
      r.pos.x = rnd(0, 150);
      r.pos.y = 0;
    };
    color("light_cyan");
    box(r.pos, 1);
  })
}
