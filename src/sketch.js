// src/sketch.js
// Tim Rodenbröker influenced generative background
import p5 from 'p5';

export const sketch = (s) => {
  let nodes = [];
  const nodeCount = 100;
  
  s.setup = () => {
    let canvas = s.createCanvas(s.windowWidth, s.windowHeight);
    canvas.parent('p5-canvas-container');
    
    // Initialize procedural nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: s.random(s.width),
        y: s.random(s.height),
        vx: s.random(-1, 1),
        vy: s.random(-1, 1),
        char: String.fromCharCode(s.floor(s.random(33, 126))) // ASCII chars
      });
    }
    s.textFont('Courier New');
    s.textSize(18);
  };

  s.draw = () => {
    s.clear(); // Transparent background
    
    s.stroke(0, 50);
    s.strokeWeight(1);
    
    // Draw kinetic connections (Rodenbröker)
    for (let i = 0; i < nodes.length; i++) {
        let n1 = nodes[i];
        
        // Update physics
        let dirX = s.mouseX - n1.x;
        let dirY = s.mouseY - n1.y;
        let dist = s.dist(s.mouseX, s.mouseY, n1.x, n1.y);
        
        // Repel from mouse to create friction
        if (dist < 150) {
            n1.vx -= (dirX / dist) * 0.5;
            n1.vy -= (dirY / dist) * 0.5;
        }

        n1.x += n1.vx;
        n1.y += n1.vy;
        
        // Dampening & friction
        n1.vx *= 0.95;
        n1.vy *= 0.95;

        // Wrap around
        if (n1.x < 0) n1.x = s.width;
        if (n1.x > s.width) n1.x = 0;
        if (n1.y < 0) n1.y = s.height;
        if (n1.y > s.height) n1.y = 0;

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
            let n2 = nodes[j];
            let d = s.dist(n1.x, n1.y, n2.x, n2.y);
            if (d < 100) {
                // Generative strict lines (Lorenz meets Rodenbröker)
                s.line(n1.x, n1.y, n2.x, n2.y);
            }
        }
        
        // Typographic nodes (Sugarscroll)
        s.noStroke();
        s.fill(13, 13, 13, 150);
        s.text(n1.char, n1.x, n1.y);
    }
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};
