
var gl;

// Global variables (accessed in render)
var locPosition;
var locColor;
var bufferIdA;
var bufferIdB;
var colorA = vec4(1.0, 0.0, 0.0, 1.0);
var colorB = vec4(0.0, 1.0, 0.0, 1.0);


var points = [[-0.75,-0.5],[-0.75,0],[-0.25,0], [-0.25,0.5], [0.25,0.5], [0.25,0], [0.75,0], [0.75,-0.5]];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //let's make 8 triangles
    var verticesA = [ vec2( points[0][0],points[0][1] ), vec2( points[1][0],points[1][1] ), vec2(points[2][0], points[2][1])]; 
    
    var verticesB = [vec2(points[0][0],
                        points[0][1]),
                    vec2(points[5][0], points[5][1]),

                    vec2(points[2][0], points[2][1])
                    ];

    var verticesC = [
        vec2(points[7][0], points[7][1]),
        vec2(points[2][0], points[2][1]),
        vec2(points[5][0], points[5][1])
    ];

    var verticesD = [
        vec2(points[7][0], points[7][1]),
        vec2(points[6][0], points[6][1]),
        vec2(points[5][0], points[5][1])
    ];


    var verticesE = [
        vec2(points[0][0], points[0][1]),
        vec2((points[2][0] + points[5][0])/2, points[2][1]),
        vec2(points[7][0], points[7][1])
    ];

    var verticesF = [
        vec2(points[2][0], points[2][1]),
        vec2(points[3][0], points[3][1]),
        vec2(points[4][0], points[4][1])
    ];

    var verticesG = [
        vec2(points[5][0], points[5][1]),
        vec2(points[4][0], points[4][1]),
        vec2(points[3][0], points[3][1]),
    ];

    var verticesH = [
        vec2(points[5][0], points[5][1]),
        vec2(points[2][0], points[2][1]),
        vec2((points[5][0]+points[2][0])/2, (points[5][1] + points[4][1])/2)
    ];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Define two VBOs and load the data into the GPU
    bufferIdA = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesA), gl.STATIC_DRAW );
    
    bufferIdB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesB), gl.STATIC_DRAW );
    
    bufferIdC = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesC), gl.STATIC_DRAW );
  
  
    bufferIdD = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdD );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesD), gl.STATIC_DRAW );
  
    bufferIdE = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdE );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesE), gl.STATIC_DRAW );
  
    bufferIdF = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdF );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesF), gl.STATIC_DRAW );
  
    bufferIdG = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdG );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesG), gl.STATIC_DRAW );
  
    bufferIdH = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdH );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(verticesH), gl.STATIC_DRAW );

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    locColor = gl.getUniformLocation( program, "rcolor" );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // Draw first triangle    

    //dot1 => dot2 => dot3
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );


    //draw second triangle

    // dot1 => dot6 => dot3
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    //draw third triangle

    // dot8 => dot3 => dot6
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    //draw forth triangle

    // dot8 => dot7 => dot6
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdD );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    //draw fifth triangle

    //dot1 => (xPos(dot3) + xPos(dot6))/2 yPos of dot3
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdE );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    //draw sixth triangle

    //dot3 => dot4 => dot5
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdF );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    //draw seventh triangle

    // dot6 => dot5 => dot4
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdG );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );
    
    //draw eighth triangle

    //dot6 => dot3 => (xPos(dot6) + xPos(dot6)) / 2 and (yPos(dot6) + yPos(dot5)/2
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdH );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );


}
