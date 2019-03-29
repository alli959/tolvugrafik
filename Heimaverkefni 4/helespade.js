/////////////////////////////////////////////////////////////////
//    Sýnislausn á dæmi 4 í heimadæmum 3 í Tölvugrafík
//     Notandi getur snúið, hliðrað og kvarðað tening
//
//    Hjálmtýr Hafsteinsson, febrúar 2018
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

//var NumVertices  = 36;

var NumVertices = 72;

var thetaLoc;


var points = [];
var colors = [];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var transX = 0.0;
var scaleXYZ = 1.0;

var matrixLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "rotation" );


    thetaLoc = gl.getUniformLocation(program, "theta");
    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if( movement ) {
      	    spinY = ( spinY + (e.offsetX - origX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            theta[1] = spinX;
            theta[0] = spinY;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    

    
    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d) 
{
    

    var vertices = [
        vec3(  -0.1, -0.55,  0.1 ),
        vec3(  -0.1,  0.55,  0.1 ),
        vec3(  0.1,  0.55,  0.1 ),
        vec3(  0.1, -0.55,  0.1 ),
        vec3(  -0.1, -0.55, -0.1 ),
        vec3(  -0.1,  0.55, -0.1 ),
        vec3(  0.1,  0.55, -0.1 ),
        vec3(  0.1, -0.55, -0.1 )
    ];

    
    var vertices2 = [
        vec3(  0.55, -0.1,  0.1 ),
        vec3(  0.55,  0.1,  0.1 ),
        vec3(  -0.55,  0.1,  0.1 ),
        vec3(  -0.55, -0.1,  0.1 ),
        vec3(  0.55, -0.1,  -0.1 ),
        vec3(  0.55,  0.1,  -0.1 ),
        vec3(  -0.55,  0.1,  -0.1 ),
        vec3(  -0.55, -0.1,  -0.1 )
    ];
    

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    // We need to partition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices
    
    //vertex color assigned by the index of the vertex
    
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[a]);
        
    }

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices2[indices[i] ])
        //colors.push( vertexColors[indices[i]] );
    
        // for solid colored faces use 
        colors.push(vertexColors[a]);
        
    }

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    
    
    theta[2] += 7.0;

    gl.uniform3fv(thetaLoc, theta);

    var ctm = mat4();
    
    ctm = mult( ctm, translate( transX, 0.0, 0.0 ) );
    
    ctm = mult( ctm, rotateX(spinX) );
    ctm = mult( ctm, rotateY(spinY) );
    
    ctm = mult( ctm, scalem( scaleXYZ, scaleXYZ, scaleXYZ ) );
    
    gl.uniformMatrix4fv(matrixLoc, false, flatten(ctm));
    
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}

