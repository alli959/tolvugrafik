/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun á lyklaborðsatburðum til að hreyfa spaða
//
//    Hjálmtýr Hafsteinsson, janúar 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;
var locColor;
var bufferId;
var bufferId2;
var bufferIdBall;
var bufferIdScore;
var locPosition;
var vertices;
var vertices2;
var ball;
var right = true;
var left = false;
var down = true;
var up = false;
var leftArrow = false;
var rightArrow = false;
var verticesColor = vec4(1.0, 0.0, 0.0, 1.0);
var ballColor = vec4(0.0,0.0,0.0,1.0);
var candyColor = vec4(0.2,0.5,0.1,1.0)
var paddleRightSpeed = 0.02;
var paddleLeftSpeed = -0.02;
var RightBallSpeed = 0.01;
var LeftBallSpeed = -0.01;
var maxRightBallSpeed = 0.01;
var maxLeftBallSpeed = -0.01;
var yDownBallSpeed = -0.01;
var yUpBallSpeed = 0.01;
var score = 0;
var scoreCandy;




//random function for the score box

function randomCandyPos(){


    //x axis
    //let the box be to the left or to the right
    var xMinusOrPlus = Math.floor(Math.random() * Math.floor(2))
    var xPos = 0;
    if(xMinusOrPlus === 0){
        xPos = - Math.random();
    }
    else{
        xPos = Math.random();
    }

    //y axis
    //let the box be up or down
    var yPos = 0;
        yPos = Math.random();    


    if(xPos < -0.85){
        xPos = -0.85;
    }
    else if(xPos > 0.85){
        xPos = 0.85;
    }
    if(yPos > 0.75){
        yPos = 0.75;
    }






    return {
            "xPos":xPos, 
            "yPos":yPos
        };

}

function randomBallPos(){
    var xMinusOrPlus = Math.floor(Math.random() * Math.floor(2))
    var xPos = 0;
    if(xMinusOrPlus === 0){
        xPos = - Math.random();
    }
    else{
        xPos = Math.random();
    }

    if(xPos < -0.85){
        xPos = -0.85;
    }
    else if(xPos > 0.85){
        xPos = 0.85;
    }

    return xPos;

}


function restart(){
    score = 0;
    paddleRightSpeed = 0.02;
    paddleLeftSpeed = -0.02;
    RightBallSpeed = 0.01;
    LeftBallSpeed = -0.01;
    maxRightBallSpeed = 0.01;
    maxLeftBallSpeed = -0.01;
    yDownBallSpeed = -0.01;
    yUpBallSpeed = 0.01;
    down = true;
    up = false;
    document.getElementById("score").innerHTML = score;
    vertices = [
        vec2( -0.1, -0.9 ),
        vec2( -0.1, -0.86 ),
        vec2(  0.1, -0.86 ),
        vec2(  0.1, -0.9 ) 
    ];

    
    vertices2 = [
        vec2( -0.1, 0.9 ),
        vec2( -0.1, 0.86 ),
        vec2(  0.1, 0.86 ),
        vec2(  0.1, 0.9 ) 
    ];
    
    var ballPos = randomBallPos();
    ball = [
        vec2( ballPos -0.025, 0.04 ),
        vec2( ballPos -0.025, -0.02 ),
        vec2( ballPos +0.025, -0.02 ),
        vec2( ballPos +0.025, 0.04 )
    ];

    //get the positions for the scoreCandy

    var positions = randomCandyPos();

    scoreCandy = [
        vec2( positions.xPos - 0.055, positions.yPos + 0.08),
        vec2( positions.xPos - 0.055, positions.yPos - 0.05),
        vec2( positions.xPos + 0.055, positions.yPos - 0.05),
        vec2( positions.xPos + 0.055, positions.yPos + 0.08),
    ]

}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    vertices = [
        vec2( -0.1, -0.9 ),
        vec2( -0.1, -0.86 ),
        vec2(  0.1, -0.86 ),
        vec2(  0.1, -0.9 ) 
    ];

    
    vertices2 = [
        vec2( -0.1, 0.9 ),
        vec2( -0.1, 0.86 ),
        vec2(  0.1, 0.86 ),
        vec2(  0.1, 0.9 ) 
    ];
    
    var ballPos = randomBallPos();
    ball = [
        vec2( ballPos -0.025, 0.04 ),
        vec2( ballPos -0.025, -0.02 ),
        vec2( ballPos +0.025, -0.02 ),
        vec2( ballPos +0.025, 0.04 )
    ];

    //get the positions for the scoreCandy

    var positions = randomCandyPos();

    scoreCandy = [
        vec2( positions.xPos - 0.055, positions.yPos + 0.08),
        vec2( positions.xPos - 0.055, positions.yPos - 0.05),
        vec2( positions.xPos + 0.055, positions.yPos - 0.05),
        vec2( positions.xPos + 0.055, positions.yPos + 0.08),
    ]
    
    
    
    // Load the data into the GPU

    //vertices
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    //vertices2

    bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.DYNAMIC_DRAW );

    //ball

    bufferIdBall = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdBall);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(ball), gl.DYNAMIC_DRAW);
    
    //scorecandy

    bufferIdScore = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdScore);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(scoreCandy), gl.DYNAMIC_DRAW);


    // Associate out shader variables with our data buffer
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );
    locColor = gl.getUniformLocation( program, "rcolor" );

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 37:	// vinstri ör
                leftArrow = true;
                rightArrow = false;
                break;
            case 39:	// hægri ör
                rightArrow = true;
                leftArrow = false;
                break;
            default:
        }
    } );

    window.addEventListener("keyup", function(e) { 
        switch( e.keyCode ) {
            case 37:	// vinstri ör
                leftArrow = false;
                break;
            case 39:	// hægri ör
                rightArrow = false;
                break;
            default:
        }
       
    } );

    render();
}

function render() {

    
    gl.clear( gl.COLOR_BUFFER_BIT );

    //vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    gl.uniform4fv(locColor, flatten(verticesColor))
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    //vertices2
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices2));
    gl.uniform4fv(locColor, flatten(verticesColor))
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    //BALL
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdBall);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(ball));
    gl.uniform4fv(locColor, flatten(ballColor))
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    //scoreCandy
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdScore);
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(scoreCandy));
    gl.uniform4fv(locColor, flatten(candyColor))
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    updatePosition();

    window.requestAnimFrame(render);
}
function updatePosition(){
    for(i=0; i<4; i++) {

        // ---- arrow handlers ------
        if(leftArrow){
            if(vertices[i][0] + paddleLeftSpeed >= -1 && vertices2[i][0] + paddleRightSpeed <= 1){
                vertices[i][0] += paddleLeftSpeed;
                vertices2[i][0] += paddleRightSpeed;
            }
        }
        
        if(rightArrow){
            if(vertices[i][0] + paddleRightSpeed <= 1 && vertices2[i][0] + paddleLeftSpeed >= -1){
                vertices[i][0] += paddleRightSpeed;
                vertices2[i][0] += paddleLeftSpeed;
            }
        }


        
    //------ball collision with paddles and candy
        
    }
    if(down){
        up = false;
        if(right){
            //check paddle and ball collision
            if(ball[0][0] + RightBallSpeed >= vertices[0][0] && ball[2][0] + RightBallSpeed <= vertices[2][0]
                && ball[1][1] + yDownBallSpeed <= vertices[1][1] && ball[1][1] + yDownBallSpeed >= vertices[0][1]){
                    down = false;
                    up = true;
                }





                //check ball and candy collision
                if(ball[2][0] + RightBallSpeed >= scoreCandy[0][0] && ball[2][0] + RightBallSpeed <= scoreCandy[2][0]
                    && ball[1][1] + yDownBallSpeed <= scoreCandy[0][1] && ball[1][1] + yDownBallSpeed >= scoreCandy[1][1]){
                        var positions = randomCandyPos();
                        scoreCandy = [
                            vec2( positions.xPos - 0.055, positions.yPos + 0.08),
                            vec2( positions.xPos - 0.055, positions.yPos - 0.05),
                            vec2( positions.xPos + 0.055, positions.yPos - 0.05),
                            vec2( positions.xPos + 0.055, positions.yPos + 0.08),
                        ]
                        addScore()
                }
            }
        
        else if(left){
            //check ball and paddle collision
            if(ball[0][0] + LeftBallSpeed >= vertices[0][0] && ball[0][0] + LeftBallSpeed <= vertices[2][0]
                && ball[1][1] + yDownBallSpeed <= vertices[1][1] && ball[1][1] + yDownBallSpeed >= vertices[0][1]){
                    down = false;
                    up = true;
                }

            //check ball and candy collision
            if(ball[0][0] + LeftBallSpeed >= scoreCandy[0][0] && ball[0][0] + LeftBallSpeed <= scoreCandy[2][0]
                && ball[1][1] + yDownBallSpeed <= scoreCandy[0][1] && ball[1][1] + yDownBallSpeed >= scoreCandy[1][1]){
                    var positions = randomCandyPos();
                    scoreCandy = [
                        vec2( positions.xPos - 0.055, positions.yPos + 0.08),
                        vec2( positions.xPos - 0.055, positions.yPos - 0.05),
                        vec2( positions.xPos + 0.055, positions.yPos - 0.05),
                        vec2( positions.xPos + 0.055, positions.yPos + 0.08),
                    ]
                    addScore()
            }
        }


        
        if(ball[1][1] + yDownBallSpeed <= -1){
            restart();
        }
        else{
            for(i=0; i<4; i++) {
                ball[i][1] += yDownBallSpeed;
            }
        }
    }
    
    if(up){
        down = false;
        if(right){
            //check ball and paddle collision
            if(ball[0][0] + RightBallSpeed >= vertices2[0][0] && ball[2][0] + RightBallSpeed <= vertices2[2][0]
                && ball[0][1] + yUpBallSpeed >= vertices2[1][1] && ball[0][1] + yUpBallSpeed <= vertices2[0][1]  ){
                    up = false;
                    down = true;
                }

            if(ball[2][0] + RightBallSpeed >= scoreCandy[0][0] && ball[2][0] + RightBallSpeed <= scoreCandy[2][0]
                && ball[0][1] + yUpBallSpeed >= scoreCandy[1][1] && ball[0][1] + yUpBallSpeed <= scoreCandy[0][1] ){
                    var positions = randomCandyPos();
                    scoreCandy = [
                        vec2( positions.xPos - 0.055, positions.yPos + 0.08),
                        vec2( positions.xPos - 0.055, positions.yPos - 0.05),
                        vec2( positions.xPos + 0.055, positions.yPos - 0.05),
                        vec2( positions.xPos + 0.055, positions.yPos + 0.08),
                    ];
                    addScore()
            }
        }
        else if(left){
            //check ball and paddle collision
            if(ball[0][0] + LeftBallSpeed >= vertices2[0][0] && ball[2][0] + LeftBallSpeed <= vertices2[2][0]
                && ball[0][1] + yUpBallSpeed >= vertices2[1][1] && ball[0][1] + yUpBallSpeed <= vertices2[0][1]  ){
                    up = false;
                    down = true;
                }

                
            //check ball and candy collision
            if(ball[0][0] + LeftBallSpeed >= scoreCandy[0][0] && ball[0][0] + LeftBallSpeed <= scoreCandy[2][0]
                && ball[0][1] + yUpBallSpeed >= scoreCandy[1][1] && ball[0][1] + yUpBallSpeed <= scoreCandy[0][1] ){
                    var positions = randomCandyPos();
                    scoreCandy = [
                        vec2( positions.xPos - 0.055, positions.yPos + 0.08),
                        vec2( positions.xPos - 0.055, positions.yPos - 0.05),
                        vec2( positions.xPos + 0.055, positions.yPos - 0.05),
                        vec2( positions.xPos + 0.055, positions.yPos + 0.08),
                    ];
                    addScore()
            }
        
        }
        if(ball[0][1] + yUpBallSpeed >= 1){
            restart()
        }
        else{
            for(i=0; i<4; i++) {
                ball[i][1] += yUpBallSpeed;
            }

        }
    }

    //------ check ball and right/left wall collision
    if(right){
        left = false;
        if(ball[2][0] + RightBallSpeed >= 1){
            right = false;
            left = true;
        }
        else{
            for(i=0; i<4; i++){
                ball[i][0] += RightBallSpeed;
            }
        }
    }

    if(left){
        right = false;
        if(ball[0][0] + LeftBallSpeed <= -1){
            left = false;
            right = true;
        }
        else{
            for(i = 0; i<4; i++){
                ball[i][0] += LeftBallSpeed;
            }
        }
    }

    
}

function addScore(){

    //every 2 points the game goes faster
    score += 1;
    if(score%2 == 0){
        paddleRightSpeed += 0.0025;
        paddleLeftSpeed += -0.0025;
        LeftBallSpeed += -0.0025;
        RightBallSpeed += 0.0025;
        yDownBallSpeed += -0.0025;
        yUpBallSpeed += 0.0025;
    }
    document.getElementById("score").innerHTML = score;

}
