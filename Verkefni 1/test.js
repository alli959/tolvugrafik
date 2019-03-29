
var gl;

var frogpoints; // hnit frosksins
var grasspoints; // hnit grassins
var lanepoints = []; // hnit akreinanna

var locPosition;
var locColor;

//bufferar
var bufferIdFrog;
var bufferIdRoad;
var bufferIdlane;

var frogcolor = vec4(0.9, 0.2, 0, 1.0);
var grasscolor = vec4(0.4, 0.8, 0.0, 1.0);
var lanecolor = vec4(0.7, 0.7, 0.7, 1.0);
var pointbackground = vec4(1,1,0.15,1);
var pointsfill = vec4(1,0,0,1);
var carcolor = [
                vec4(0, 0.2, 0.7, 1),
                vec4(0.16, 0.69, 0.09, 1),
                vec4(0.23, 0.4, 0.4, 1),
                vec4(1, 0, 0.7, 1),
                vec4(1, 1, 0.83, 1),
                vec4(1,0.7,0,1),
                vec4(0.5, 0, 0, 1)
              ];

var negspeed = [-0.005,
                -0.006,
                -0.007,
                -0.008];

var posspeed = [0.005,
                0.006,
                0.007,
                0.008];

//attributar frosksins
var frogx; //x-hnit
var frogy; //y-hnit
var frogLeft; //hitbox vinstri
var frogRight; //hitbox hægri
var frogDir = true; // direction, true ef upp, false ef niður

var car1points;
var car1pos;
var car1Y = [];
var car1Left;
var car1Right;
var bufferIdcar1;
var colorindex1 = Math.floor(Math.random()*carcolor.length);
var speed1 = negspeed[Math.floor(Math.random()*negspeed.length)];

var car2points;
var car2pos;
var car2Y = [];
var car2Left;
var car2Right;
var bufferIdcar2;
var colorindex2 = Math.floor(Math.random()*carcolor.length);
var speed2 = negspeed[Math.floor(Math.random()*negspeed.length)];

var car3points;
var car3pos;
var car3Y = [];
var car3Left;
var car3Right;
var bufferIdcar3;
var colorindex3 = Math.floor(Math.random()*carcolor.length);
var speed3 = posspeed[Math.floor(Math.random()*posspeed.length)];

var car4points;
var car4pos;
var car4Y = [];
var car4Left;
var car4Right;
var bufferIdcar4;
var colorindex4 = Math.floor(Math.random()*carcolor.length);
var speed4 = posspeed[Math.floor(Math.random()*posspeed.length)];

var car5points;
var car5pos;
var car5Y = [];
var car5Left;
var car5Right;
var bufferIdcar5;
var colorindex5 = Math.floor(Math.random()*carcolor.length);
var speed5 = posspeed[Math.floor(Math.random()*posspeed.length)];

var car6points;
var car6pos;
var car6Y = [];
var car6Left;
var car6Right;
var bufferIdcar6;
var colorindex6 = Math.floor(Math.random()*carcolor.length);
var speed6 = negspeed[Math.floor(Math.random()*negspeed.length)];

var car7points;
var car7pos;
var car7Y = [];
var car7Left;
var car7Right;
var bufferIdcar7;
var colorindex7 = Math.floor(Math.random()*carcolor.length);
var speed7 = speed2

var car8points;
var car8pos;
var car8Y = [];
var car8Left;
var car8Right;
var bufferIdcar8;
var colorindex8 = Math.floor(Math.random()*carcolor.length);
var speed8 = speed4

var pointspoints = [];
var bufferIdpointspoints;

var pointsbase;
var bufferIdpoints;

var pointlines;
var bufferIdpointlines;

var alive = true;
var count = 0;
var over = false;
var across = 0;
var end = false;
var gameover = 0;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    ///////////////
    // Froskurin //
    ///////////////
    frogpoints = [vec2(0, -0.9),      //haus
                  vec2(-0.02, -0.95),
                  vec2(0.02, -0.95),

                  vec2(-0.01, -0.95), //hægri afturfótur
                  vec2(0.025, -1),
                  vec2(0.02, -0.95),

                  vec2(0.01, -0.95), //vinstri afturfótur
                  vec2(-0.025, -1),
                  vec2(-0.02, -0.95),

                  vec2(-0.01, -0.95),    //hægri framfótur
                  vec2(0.025, -0.9),
                  vec2(0.02, -0.95),

                  vec2(0.01, -0.95),    //vinstri framfótur
                  vec2(-0.025, -0.9),
                  vec2(-0.02, -0.95),
                  ];



    //gróf staðsetning á froskinum
    frogx = frogpoints[0][0];
    frogy = frogpoints[0][1];
    frogLeft = frogpoints[13][0]; //left arm
    frogRight = frogpoints[10][0]; //right arm
    //console.log(frogLeft, frogRight);



    ////////////
    // Grasið //
    ////////////
    //Hverjir 6 punkar eru ein graslengja
    grasspoints = [vec2(-1, 1), vec2(-1, 0.9), vec2(1, 0.9),
                   vec2(1, 0.9), vec2(1, 1), vec2(-1, 1),


                   vec2(-1, -1), vec2(-1, -0.9), vec2(1, -0.9),
                   vec2(1, -0.9), vec2(1, -1), vec2(-1, -1)
                ];

    //////////////
    // Akreinar //
    //////////////
    var x = -0.9;
    for (var i = 0; i < 14; i += 2) {
      lanepoints[i] = vec2(-1, x);
      lanepoints[i+1] = vec2(1, x);
      x += 0.3;
    }

    //////////
    // Stig //
    //////////
    pointsbase = [vec2(0.98, 0.98),
                    vec2(0.98, 0.92),
                    vec2(0.88, 0.92),
                    vec2(0.88, 0.98)];

    pointlines = [vec2(0.98, 0.98), vec2(0.98, 0.92),
                  vec2(0.98, 0.92), vec2(0.88, 0.92),
                  vec2(0.88, 0.92), vec2(0.88, 0.98),
                  vec2(0.88, 0.98), vec2(0.98, 0.98)];

    var pp = 0.88;
    for (var j = 0; j < 22; j += 2) {
      pointspoints[j] = vec2(pp, 0.98);
      pointspoints[j+1] = vec2(pp, 0.92);
      pp += 0.01;
    }

    ///////////                        a   b
    // Bílar //    horn bílsins   ->   [__]
    ///////////                       c   d

    car1points = [vec2(-0.1, -0.635),//a
                  vec2(0.1, -0.635),//b
                  vec2(0.1, -0.865),//d
                  vec2(-0.1, -0.865)];//c

    car2points = [vec2(-1, -0.035),//a
                  vec2(-1.2, -0.035),//b
                  vec2(-1.2, -0.265),//d
                  vec2(-1, -0.265)];//c

    car3points = [vec2(0.8, -0.335),//a
                  vec2(1, -0.335),//b
                  vec2(1, -0.565),//d
                  vec2(0.8, -0.565)];//c

    car4points = [vec2(0.8, 0.335),//a
                  vec2(1, 0.335),//b
                  vec2(1, 0.565),//d
                  vec2(0.8, 0.565)];//

    car5points = [vec2(0.2, 0.035),//a
                  vec2(0, 0.035),//b
                  vec2(0, 0.265),//d
                  vec2(0.2, 0.265)];//c

    car6points = [vec2(-0.6, 0.635),//a
                  vec2(-0.4, 0.635),//b
                  vec2(-0.4, 0.865),//d
                  vec2(-0.6, 0.865)];//c

    car7points = [vec2(0, -0.035),//a
                  vec2(0.2, -0.035),//b
                  vec2(0.2, -0.265),//d
                  vec2(0, -0.265)];//c

    car8points = [vec2(-0.4, 0.335),//a
                  vec2(-0.2, 0.335),//b
                  vec2(-0.2, 0.565),//d
                  vec2(-0.4, 0.565)];//


    /* Aðeins um fylki með vec:
    c[a][b]
    c er fylki af vec2, vec3 eða vec4
    a:  hvaða gildi í fylkinu er valið
    b:  hvaða gildi í vec er valið, 0, 1, 2 eða 3 eftir því
        sem á við.
    */



    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.1, 0.1, 0.1, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    bufferIdRoad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdRoad);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(grasspoints), gl.STATIC_DRAW);

    bufferIdFrog = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFrog);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(frogpoints), gl.STATIC_DRAW);

    bufferIdlane = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdlane );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(lanepoints), gl.STATIC_DRAW);

    bufferIdpoints = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdpoints );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsbase), gl.STATIC_DRAW);

    bufferIdpointlines = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdpointlines );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointlines), gl.STATIC_DRAW);

    bufferIdpointspoints = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdpointspoints );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointspoints), gl.STATIC_DRAW);

    bufferIdcar1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar1 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car1points), gl.STATIC_DRAW);

    bufferIdcar2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar2 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car2points), gl.STATIC_DRAW);

    bufferIdcar3 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar3 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car3points), gl.STATIC_DRAW);

    bufferIdcar4 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar4 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car4points), gl.STATIC_DRAW);

    bufferIdcar5 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar5 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car5points), gl.STATIC_DRAW);

    bufferIdcar6 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar6 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car6points), gl.STATIC_DRAW);

    bufferIdcar7 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar7 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car7points), gl.STATIC_DRAW);

    bufferIdcar8 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar8 );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(car8points), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    locColor = gl.getUniformLocation(program, "rcolor");


    ///////////////
    // Listeners //
    ///////////////

    // Froskur hægri og vinstri
    window.addEventListener("keydown", function(e) {
      switch(e.keyCode) {
        case 37: //vinstri
          if (frogx > -0.96) {  // boundary
            xmove = -0.05;
          }
          break;
        case 39: //hægri
          if (frogx < 0.96) {  // boundary
            xmove = 0.05;
          }
          break;
        default:
        xmove = 0.0;
      }
      for (i=0; i<frogpoints.length; i++) {
        frogpoints[i][0] += xmove;
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frogpoints));

      frogx = frogpoints[0][0];
      frogy = Math.round(frogpoints[1][1] * 10) / 10;
      frogLeft = frogpoints[13][0]; //left arm
      frogRight = frogpoints[10][0]; //right arm
    });


    //Froskur upp og niður
    window.addEventListener("keydown", function(e) {
      switch(e.keyCode) {
        case 38: //up
          if(frogy < 0.85) {  // boundary
            if (!frogDir) {
              frogpoints[0][1] += 0.1;
              frogDir = true;
            }
            if (frogy == -0.9 || frogy == 0.8) {
              xmove = 0.2;
            }
            else {
              xmove = 0.3
            }
          }
          break;
        case 40: //down
          if (frogy > -0.85 || (!frogDir && frogy < -1)) {  // boundary
            if (frogDir) {
              frogpoints[0][1] -= 0.1;
              frogDir = false;
            }
            if (frogy == 1 || frogy == -0.7) {
              xmove = -0.2;
            }
            else {
              xmove = -0.3
            }
          }
          break;
        default:
          xmove = 0.0;
      }
      for (j=0; j<frogpoints.length; j++) {
        frogpoints[j][1] += xmove;
      }
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frogpoints));

      frogx = frogpoints[0][0];
      frogy = Math.round(frogpoints[1][1] * 10) / 10;
      frogLeft = frogpoints[13][0]; //left arm
      frogRight = frogpoints[10][0]; //right arm
    });

    //stoppa leikinn
    window.addEventListener('keyup', function(e) {
      switch(e.keyCode) {
        case 80:
          end = true;
          break;
        case 83:
          if (end) {
            end = false;
            render();
          }
        default:
          end = false;
      }
    });


    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);


    if (gameover == 50) {
      alert('Þú vannst!');
      window.location.reload();
    }

    // Draw the road
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdRoad);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(grasscolor));
    gl.drawArrays(gl.TRIANGLES, 0, 12);

    // Draw the pointsbar
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdpoints);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(pointbackground));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdpointlines);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(pointsfill));
    gl.drawArrays(gl.LINES, 0, 8);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdpointspoints);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(pointsfill));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, (2*across) + 2);

    // Draw the lanes
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdlane);
    gl.vertexAttribPointer(locPosition, 2, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(locColor, flatten(lanecolor));
    gl.drawArrays(gl.LINES, 0, 14);


    // Draw the car
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar1);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex1]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car1points, car1Y, car1pos, car1Left, car1Right, speed1);

    // Car 2
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar2);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex2]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car2points, car2Y, car2pos, car2Left, car2Right, speed2);

    // Car 3
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar3);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex3]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car3points, car3Y, car3pos, car3Left, car3Right, speed3);

    // Car 4
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar4);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex4]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car4points, car4Y, car4pos, car4Left, car4Right, speed4);

    // Car 5
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar5);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex5]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car5points, car5Y, car5pos, car5Left, car5Right, speed5);

    // Car 6
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar6);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex6]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car6points, car6Y, car6pos, car6Left, car6Right, speed6);

    // Car 7
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar7);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex7]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car7points, car7Y, car7pos, car7Left, car7Right, speed7);

    // Car 8
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdcar8);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(carcolor[colorindex8]));
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    updateCar(car8points, car8Y, car8pos, car8Left, car8Right, speed8);

    // Draw the frog
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdFrog);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, flatten(frogcolor));
    gl.drawArrays(gl.TRIANGLES, 0, 15);

    if (frogy == 1 && !over) {
      across++;
      over = true;
    }
    if (frogy == -0.9 && over) {
      across++;
      over = false;
    }

    /*Console logs herna!*/
    if (count%100 == 0) {
      console.log(across);
    }
    count++;/**/

    if (across == 10) {
      gameover++;
    }



    if (alive && !end) {
      window.requestAnimFrame(render);
    }
    else {
      restart();
    }
}



function updateCar(car, y, pos, left, right, speed) {
  pos = car[0][0];

  if (car[0][1] <= 0) {
    y[0] = Math.round(car[0][1] * 10) / 10;
    y[1] = Math.round((y[0] - 0.1) * 10) / 10;
    y[2] = Math.round((y[1] - 0.1) * 10) / 10;
  }
  else if (car[0][1] > 0) {
    y[0] = Math.round(car[0][1] * 10) / 10;
    y[1] = Math.round((y[0] + 0.1) * 10) / 10;
    y[2] = Math.round((y[1] + 0.1) * 10) / 10;
  }

  for (var a = 0; a < car.length; a++) {
    car[a][0] -= speed;
  }

  left = car[0][0];
  right = car[1][0];

  if (speed > 0) {
    if (pos < -1.2) {
      restartcar(car, speed);
    }
  }
  if (speed < 0) {
    if (pos > 1.2) {
      restartcar(car, speed);
    }
  }

  checkCollision(y, left, right);

  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(car));
}


function restartcar(car, speed) {
    if (speed > 0) {
      car[0][0] = 1;
      car[1][0] = 1.2;
      car[2][0] = 1.2;
      car[3][0] = 1;
    }
    else if (speed < 0) {
      car[0][0] = -1;
      car[1][0] = -1.2;
      car[2][0] = -1.2;
      car[3][0] = -1;
    }
}

function checkCollision(y, left, right) {
  if (
      ((y[0] == frogy || y[1] == frogy || y[2] == frogy) && (frogRight > right) && (frogLeft < right))
      ||
      ((y[0] == frogy || y[1] == frogy || y[2] == frogy) && (frogRight - 0.01  > left) && (frogLeft < left))
    ) {
    alive = false;
  }
}

function swapcolor(color) {
  color = Math.floor(Math.random()*carcolor.length);
  color = false;
  return color;
}

function restart() {
  if (!end) {
    location.reload();
  }
}
