var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
document.body.style.padding = '0px';
document.body.style.margin = '0px';
document.body.style.overflow = 'visible';



var w = window.innerWidth;
var h = window.innerHeight;
var ctx = canvas.getContext('2d');

let layers = {
  main: ctx,
  background: document.createElement('canvas').getContext('2d'),
  trails: document.createElement('canvas').getContext('2d'),
  trailsSwap: document.createElement('canvas').getContext('2d'),
};

for(let i in layers){
  if( !layers.hasOwnProperty(i) )
    continue;
  layers[i].canvas.width = w;
  layers[i].canvas.height = h;
}


var opts = {};
var gui = new dat.GUI();

function opt(name, value, min, max){
  opts[name] = value;
  return gui.add(opts, name, min, max);
}



class Snow{
  constructor(count, speed){
    this.speed = speed.slice(0);
    this.fallSpeed = speed[1];
    this.wind = this.speed[0]/2;
    this.targetWind = 0;
    this.count = count;
    this.particles = [];
    while(this.particles.length < this.count)
      this.particles.push( this.gen({pos: []}, 1) );
  }
  gen(t, init){
    t.garbage = 0;
    t.state = 'fall';
    t.color = `hsl(0, 0%, ${(Math.random()*50+50).toFixed(0)}%)`;
    t.pos[2] = 1 + Math.random()*2; // z distance
    if( !init && Math.random()<0.5 && Math.abs(this.wind)>1 ){
      t.pos[0] = this.wind > 0 ? 0 : w-1;
      t.pos[1] = h*Math.random();
    }else{
      t.pos[0] = w*Math.random();
      if(init)
        t.pos[1] = h*Math.random();
      else
        t.pos[1] = 0;
    }
    return t;
  }
  process(frame, ts){
    this.particles.length = Math.min(this.particles.length, this.count);
    while(this.particles.length < this.count)
      this.particles.push( this.gen({pos: []}) );

    if( frame%200===0 && Math.random()<0.5 ){
      this.targetWind = this.speed[0] * (Math.random()-0.5);
    }
    let speed = 0.01;
    this.wind = this.wind * (1-speed) + this.targetWind * speed;
    for(let particle of this.particles){
      if( particle.state === 'fallen' )
        this.gen(particle);
      if( particle.pos[1]>earthLevel ){ // fixme: don't use closures in class
        particle.state = 'fallen';
        continue;
      }
      particle.pos[1] += this.fallSpeed / particle.pos[2];
      particle.pos[0] += this.wind / particle.pos[2];
    }
  }
  render(layers){
    for(let particle of this.particles){
      let ctx = particle.state === 'fallen' ? layers.background : layers.main;
      ctx.beginPath();
      ctx.arc(particle.pos[0], particle.pos[1], 2, 0,Math.PI*2, 0);
      ctx.fillStyle = particle.color;
      ctx.fill();
    }
  }
}

class Platform{
  constructor({pos, size, vel, wheelsCount, barrelsCount, payloads}){
    this.size = ( size || [200, 50] ).slice(0);
    this.pos = (pos || [w/2, h/2] ).slice(0);
    this.wheelR = this.size[1] * 0.7 / 2;
    this.wheelPos = 0;
    this.wheelsCount = wheelsCount || 3;
    this.vel = ( vel || [0,0] ).slice(0);
    this.state = 'move'; // ['move', 'unload', 'leave']

    //payloads
    this.payloads = ( payloads || [] ).slice(0);
    for(let payload of payloads){
      payload.pos[0] = this.size[0]/2;
      payload.pos[1] = -payload.size[1]/2 - 20;
      payload.parent = this;
    }
    this.shake = {
      pos: [0,0],
      targetPos: [-10,-20],
      angle: 0,
      targetAngle: Math.PI/8,
    };
  }
  getRandomAngle(){
    return -Math.PI*(0.5+(Math.random()-0.5)/2);
  }
  renderWheel(ctx, x, y, pos){
    ctx.fillStyle = 'rgba(255,255,0, 0.3)';
    let n = 3;
    let sector = Math.PI/n;
    for(let i=0; i<n; ++i){
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.arc(x, y, this.wheelR, pos+sector*i*2, pos+sector*(i*2+1), 0);
      ctx.fill();
    }

    ctx.strokeStyle = '#242';
    ctx.beginPath();
    ctx.arc(x, y, this.wheelR, 0,Math.PI*2, 0);
    ctx.stroke();
  }
  renderWheels(ctx){
    let y = this.pos[1] + this.size[1] - this.wheelR;
    let innerWidth = this.size[0] - this.wheelR*2;
    for(let i=0; i<this.wheelsCount; ++i)
      this.renderWheel(
        ctx,
        this.pos[0] + this.wheelR + innerWidth / (this.wheelsCount-1) * i,
        y,
        this.wheelPos + Math.PI/5*i
      );
  }
  renderBarrels(layers){
    let ctx = layers.main;

    let y = this.pos[1] + this.size[1] - this.wheelR;
    let innerWidth = this.size[0];
    let i = 0;
    for(let barrel of this.barrels){
      ctx.save();
      ctx.beginPath();
      ctx.translate(
        this.pos[0] + barrel.pos[0],
        this.pos[1] + barrel.pos[1]
      );
      ctx.rotate(barrel.angle);
      ctx.fillStyle = '#a00';
      ctx.fillRect(0,-barrel.width/2, barrel.length, barrel.width);
      ctx.restore();

      // render trails
      layers.trails.beginPath();
      layers.trails.arc(
        this.pos[0] + barrel.end[0],
        this.pos[1] + barrel.end[1],
        4, Math.PI/2+barrel.angle,-Math.PI/2+barrel.angle, 1);
      layers.trails.fillStyle = '#f80';
      layers.trails.fill();
      ++i;
    }
  }
  renderWaves(ctx, a, b, waveLen, step, frame, animFrames, fade, color){
    let ga = ctx.globalAlpha;
    let dist = Math.hypot(a[0]-b[0], a[1]-b[1]);
    let angle = Math.atan2(b[1]-a[1], b[0]-a[0]) - waveLen/2;
    ctx.strokeStyle = color;
    for(let r=step/animFrames*(frame % animFrames); r<dist; r+=step){
      if(fade)
        ctx.globalAlpha = (dist-r)/dist;
      ctx.beginPath();
      ctx.arc(
        a[0], a[1],
        r,
        angle,
        angle+waveLen,
        0);
      ctx.stroke();
    }
    if(fade)
      ctx.globalAlpha = ga;
  }
  render(layers, frame){
    let ctx = layers.main;
    //this.renderBarrels(layers);

    ctx.fillStyle = '#060';
    ctx.strokeStyle = '#fff';
    //ctx.strokeRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
    ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]-this.wheelR*2);

    //candle
    let candleSize = [10, 50];
    ctx.fillStyle = '#a00';
    ctx.fillRect(this.pos[0]+this.size[0]-candleSize[0]-5, this.pos[1]-candleSize[1], candleSize[0], candleSize[1]);
    if(Math.random()<0.75){
      layers.trails.beginPath();
      layers.trails.arc(
        this.pos[0]+this.size[0]-candleSize[0]-5+candleSize[0]/2,
        this.pos[1]-candleSize[1],
        candleSize[0]/3,
        0, -Math.PI, 1);
      layers.trails.fillStyle = '#f80';
      layers.trails.fill();
    }

    if( this.payloads.length > 0 ){
      let animFrames = 30;
      let a = [
        this.pos[0]+this.size[0]-candleSize[0]-5+candleSize[0]/2,
        this.pos[1]-candleSize[1],
      ];
      let b = [
        this.pos[0]+this.payloads[0].pos[0],
        this.pos[1]+this.payloads[0].pos[1],
      ];
      this.renderWaves(ctx, a, b,
                       0.3129, 14,
                       animFrames - frame%animFrames, animFrames,
                       true, '#0f0');
    }

    this.renderWheels(ctx);
  }
  process(frame, ts){
    let speed = 0.01;

    if(this.pos[0] > w){
      this.garbage = true;
      return;
    }
    switch(this.state){
      case 'move':
        this.pos[0] += this.vel[0];
        this.wheelPos += this.vel[0] / this.wheelR;
        if( this.pos[0] > w/2 && this.payloads.length > 0 )
          this.state = 'unload';
        //this.pos[1] += this.vel[1]; // don't fly...
        if( frame%10 === 0 && Math.random()<0.5 ){
          this.shake.targetPos[0] = (Math.random()-0.5) * 40;
          this.shake.targetPos[1] = -Math.random() * 20;
          this.shake.targetAngle = (Math.random()-0.5) * Math.PI/8;
        }
        break;
      case 'unload':
        this.shake.targetAngle = 0;
        this.shake.targetPos[0] = -this.size[0]/2 - this.payloads[0].size[0]/2 - 10;
        this.shake.targetPos[1] = -this.payloads[0].size[1];
        if(
          Math.abs(this.shake.pos[0]-this.shake.targetPos[0])
          + Math.abs(this.shake.pos[1]-this.shake.targetPos[1])
          + Math.abs(this.shake.angle-this.shake.targetAngle)
          < 3
        ){
          this.shake.pos[0] = this.shake.targetPos[0];
          this.shake.pos[1] = this.shake.targetPos[1];
          this.shake.angle = this.shake.targetAngle;
          this.state = 'move';
          this.payloads[0].release();
          this.payloads.shift();
        }
        break;
                     }

    for(let payload of this.payloads){
      payload.pos[0] -= this.shake.pos[0];
      payload.pos[1] -= this.shake.pos[1];
      payload.angle -= this.shake.angle;
    }
    let f = 0.98;
    this.shake.pos[0] = this.shake.pos[0]*f + this.shake.targetPos[0]*(1-f);
    this.shake.pos[1] = this.shake.pos[1]*f + this.shake.targetPos[1]*(1-f);
    this.shake.angle = this.shake.angle*f + this.shake.targetAngle*(1-f);
    for(let payload of this.payloads){
      payload.pos[0] += this.shake.pos[0];
      payload.pos[1] += this.shake.pos[1];
      payload.angle += this.shake.angle;
    }
  }
}

class Payload{
  constructor({pos, size, parent, missiles}){
    this.pos = ( pos || [0,0] ).slice(0);
    this.size = ( size || [50,50] ).slice(0);
    this.angle = 0;
    this.parent = parent || null;
    this.state = 'move'; // ['move', 'wait', 'extend', 'launch', 'fade']
    this.alpha = 1;
    this.struts = {
      enabled: false,
      angle: -Math.PI/2,
      length: this.size[1] / 2,
    };
    this.barrel = {
      enabled: false,
      pos: [this.size[0]/2, 0],
      length: this.size[1]*0.75,
      width: 10,
      angleA: -Math.PI/2,
      angleB: -Math.PI/2 + (Math.random()-0.5) * (Math.PI/2),
    };
    this.barrel.angle = this.barrel.angleB;

    this.wait = 0;
    this.missiles = ( missiles || [] ).slice(0);
  }
  release(){
    if( !this.parent )
      return;
    this.pos[0] = this.pos[0] + this.parent.pos[0];
    this.pos[1] = this.pos[1] + this.parent.pos[1];
    this.parent = null;
  }
  render(layers){
    let ctx = layers.main;
    let ga = ctx.globalAlpha;
    ctx.globalAlpha = this.alpha;

    let x = this.pos[0]-this.size[0]/2;
    let y = this.pos[1]-this.size[1]/2;
    if( this.parent ){
      x += this.parent.pos[0];
      y += this.parent.pos[1];
    }
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(this.angle);

    ctx.fillStyle = '#c00';
    ctx.fillRect(0,0, this.size[0], this.size[1]);

    ctx.fillStyle = '#0c0';
    ctx.strokeStyle = '#888';
    let tapeWidth = 10;
    ctx.fillRect(0, this.size[1]/2-tapeWidth/2, this.size[0], tapeWidth);
    ctx.strokeRect(0, this.size[1]/2-tapeWidth/2, this.size[0], tapeWidth);
    ctx.fillStyle = '#c80';
    ctx.fillRect(this.size[0]/2-tapeWidth/2, 0, tapeWidth, this.size[1]);
    ctx.strokeRect(this.size[0]/2-tapeWidth/2, 0, tapeWidth, this.size[1]);

    ctx.lineWidth = 3;
    if(this.struts.enabled){
      let r,a, x,y;
      r = this.struts.length;

      a = this.struts.angle;
      x = this.size[0];
      y = this.size[1];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a)*r, y + Math.sin(a)*r);
      a = Math.PI-this.struts.angle;
      x = 0;
      y = this.size[1];
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a)*r, y + Math.sin(a)*r);
      ctx.strokeStyle = '#aaa';
      ctx.stroke();
    }

    if(this.barrel.enabled){
      ctx.lineWidth = this.barrel.width;
      ctx.beginPath();
      ctx.moveTo(this.barrel.pos[0], this.barrel.pos[1]);
      let a, r;
      if(this.extend<0.5){
        a = this.barrel.angleA;
        r = this.barrel.length * (this.extend*2);
      }else{
        a = (this.barrel.angle-this.barrel.angleA) * (this.extend-0.5)*2 + this.barrel.angleA;
        r = this.barrel.length;
      }
      ctx.lineTo(
        this.barrel.pos[0] + Math.cos(a) * r,
        this.barrel.pos[1] + Math.sin(a) * r
      );
      ctx.strokeStyle = '#888';
      ctx.stroke();
    }

    ctx.restore();
    ctx.globalAlpha = ga;
  }
  process(frame, ts){
    // fixme: don't use closures in class
    switch(this.state){
      case 'move':
        if( !this.parent ){
          this.angle = 0;
          if( this.pos[1] + this.size[1]/2 + g < earthLevel )
            this.pos[1] += g;
          else{
            this.pos[1] = earthLevel-this.size[1]/2;
            this.state = 'extend';
            this.struts.enabled = true;
            this.barrel.enabled = true;
            this.extend = 0;
          }
        }
        break;
      case 'extend':
        if( this.extend < 0.5 ){
          this.struts.angle = -Math.PI/2 * (1-this.extend*2);
        }else{
          let strutsHeight = -Math.sin(this.struts.angle) * this.struts.length;
          this.pos[1] -= strutsHeight;
          this.struts.angle = Math.PI/4 * (this.extend-0.5)*2;
          strutsHeight = -Math.sin(this.struts.angle) * this.struts.length;
          this.pos[1] += strutsHeight;
        }
        this.extend = Math.min(1, this.extend + 0.01);
        if( this.extend == 1 ){
          this.state = 'launch';
        }
        break;
      case 'launch':
        if( this.missiles.length < 1 )
          return this.state = 'fade';
        if( --this.wait > 0 )
          break;
        this.wait = 30;
        let missile = this.missiles.shift();
        let x = this.pos[0];
        let y = this.pos[1]-this.size[1]/2;
        x += Math.cos(this.barrel.angle) * this.barrel.length;
        y += Math.sin(this.barrel.angle) * this.barrel.length;
        missile.pos[0] = x;
        missile.pos[1] = y;
        missile.setAngle( this.barrel.angle );
        missiles.push(missile);
        break;
      case 'fade':
        this.alpha = Math.max(0, this.alpha-0.01);
        if(this.alpha == 0)
          this.garbage = true;
        break;
                     }
  }
}

class Missile{
  constructor({life}){
    this.pos = [0,0];
    this.vel = [0,5];
    this.angle = 0;
    this.color = '#f00';
    this.fogColor = '#f88';
    this.life = life || 60;
    this.rnd = Math.random()<0.5;
  }
  setAngle(angle){
    this.angle = angle || this.angle;
    let r = Math.hypot(this.vel[0], this.vel[1]);
    this.vel[0] = Math.cos(this.angle) * r;
    this.vel[1] = Math.sin(this.angle) * r;
  }
  render(layers){
    let ctx = layers.main;
    ctx.save();
    ctx.translate( this.pos[0], this.pos[1] );
    ctx.rotate( this.angle );
    ctx.beginPath();
    ctx.moveTo(10,0);
    ctx.lineTo(0,5);
    ctx.lineTo(0,-5);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();

    layers.trails.beginPath();
    layers.trails.arc(this.pos[0], this.pos[1], 3, 0,Math.PI*2, 0);
    layers.trails.fillStyle = this.fogColor;
    layers.trails.fill();
  }
  process(frame, ts){
    if(this.rnd)
      this.setAngle( this.angle + (Math.random()-0.5) * (Math.PI/8) );
    if( --this.life<0 ){
      if(Math.random()<0.5){
        let n = Math.random()*10+5;
        let step = Math.PI*2/n;
        let v = 1+Math.random()*3;
        for(let a=0; a<Math.PI*2; a+=step){
          let p = new Particle({
            pos: this.pos,
            vel: [
              Math.cos(a) * v,
              Math.sin(a) * v,
            ],
          });
          particles.push(p);
        }
      }else{
        let n = Math.random()*10+5;
        let range = Math.PI*1.5;
        let step = range/n;
        let v = 1+Math.random()*3;
        for(let a=0; a<range; a+=step){
          let a2 = a+this.angle-range/2;
          let p = new Particle({
            pos: this.pos,
            vel: [
              Math.cos(a2) * v,
              Math.sin(a2) * v,
            ],
            gravity: 0,
            br: 0.05,
          });
          particles.push(p);
        }
      }
      return this.garbage = true;
    }
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }
}

class Particle{
  constructor({pos, vel, color, gravity, br}){
    this.gravity = gravity || 0;
    this.pos = ( pos || [w/2, h/2] ).slice(0);
    this.vel = ( vel || [0,0] ).slice(0);
    this.color = color || `hsl(${Math.random()*360>>0}, 100%, 50%)`;
    this.life = 50 + Math.random()*20;
    this.br = br || 0;
  }
  render(layers, frame){
    let ctx = layers.trails;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], (frame/10)%3+1, 0,Math.PI*2, 0);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  process(frame, ts){
    if( --this.life < 0 )
      return this.garbage = true;
    this.vel[0] *= (1-this.br);
    this.vel[1] *= (1-this.br);
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.pos[1] += g * this.gravity;
  }
}

//opt('text', 'test');
let platforms = [];
let payloads = [];
let missiles = [];
let particles = [];
let g = 6;
let snow = new Snow(150, [14, g/2]);
let earthLevel = h-20;
let frame = 0;

function genPlatform(){
  /*
  payloads.push(new Payload({
    missiles: [new Missile({}), new Missile({})],
    pos: [w/2, h*0.75],
    size: [ 30+Math.random()*30, 30+Math.random()*30],
  }));
  return;
  */
  let missiles = [];
  let n = Math.random()*10+1;
  for(let i=0; i<n; ++i)
    missiles.push(new Missile({}));
  let payload = new Payload({
    size: [30+Math.random()*30, 30+Math.random()*30],
    missiles,
  });
  payloads.push(payload);
  let t = {
    payloads: [payload],
    pos: [0,0],
    vel: [2+Math.random()*4,0],
    wheelsCount: ( Math.random()*3 + 2 ) >> 0,
    size: [0, 30+Math.random()*60],
    barrelsCount: Math.random()*3+3,
  };
  t.size[0] = t.wheelsCount*t.size[1]*(Math.random()+1);
  t.pos[0] = -t.size[0];
  t.pos[1] = earthLevel - t.size[1] - 2;
  platforms.push( new Platform(t) );
}

~function(){
  let ctx = layers.background;
  let g = ctx.createLinearGradient(0,0, w/2,h);
  g.addColorStop(0, '#004');
  g.addColorStop(1, '#000');
  ctx.fillStyle = g;
  ctx.fillRect(0,0, w,h);
}();
function swapTrails(){
  [layers.trails, layers.trailsSwap] = [layers.trailsSwap, layers.trails];
  layers.trails.clearRect(0,0, w,h)
  layers.trails.globalAlpha = 0.8;
  layers.trails.drawImage(layers.trailsSwap.canvas, 0, 0, w, h);
  layers.trails.globalAlpha = 1;
}
function loop(){
  // stats.begin();

  ctx.drawImage(layers.background.canvas, 0, 0, w, h);

  ctx.fillStyle = '#ccc';
  ctx.fillRect(0, earthLevel, w, h-earthLevel);

  platforms = platforms.filter( p=>!p.garbage );
  payloads = payloads.filter( p=> !p.garbage && ( !p.parent || !p.parent.garbage ) );
  missiles = missiles.filter( p=>!p.garbage );
  particles = particles.filter( p=>!p.garbage );

  if(platforms.length < 1 && payloads.length<1)
    genPlatform();

  let lists = [platforms, payloads, missiles, particles];

  for(let list of lists)
    for(let item of list)
      item.process(frame, 1);
  snow.process(frame, 1);

  for(let list of lists)
    for(let item of list)
      item.render(layers, frame);
  snow.render(layers, frame);

  ctx.drawImage(layers.trails.canvas, 0, 0, w, h);
  swapTrails();

  ++frame;
  requestAnimationFrame(loop);
  // stats.end();
}
loop();
