
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

    
    var verticesA = [
        vec2(points[0][0], points[0][1]),
        vec2(points[1][0], points[1][1]),
        vec2(points[6][0], points[6][1]),
        vec2(points[7][0], points[7][1]),
    ];

    var verticesB = [
        vec2(points[3][0], points[3][1]),
        vec2(points[2][0], points[2][1]),
        vec2(points[5][0], points[5][1]),
        vec2(points[4][0], points[4][1]),
    ]
    

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


    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    locColor = gl.getUniformLocation( program, "rcolor" );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    //Used two seperate arrays of triangle FAN

    //dot1 => dot2 => dot7 => dot8
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    

    
    //dot4 => dot3 => dot6 => dot5
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );



}
