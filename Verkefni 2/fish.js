/////////////////////////////////////////////////////////////////
//    S�nid�mi � T�lvugraf�k
//     Fiskur samsettur �r ferhyrndu spjaldi (b�kur) og
//     �r�hyrningi (spor�ur).  H�gt er a� sn�a me� m�sinni og
//     f�ra til me� upp- og ni�ur-�rvum (e�a m�sarhj�li).
//
//    Hj�lmt�r Hafsteinsson, febr�ar 2019
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 15;
var NumBody = 6;
var NumTail = 3;

var NumRhand = 3;
var NumLhand = 3;

//Fiskur
var vertices = [

    // líkami
    vec4( -0.5, -0.1, 0.0, 1.0 ),
    vec4(  0.5, -0.1, 0.0, 1.0 ),
    vec4( -0.5,  0.1, 0.0, 1.0 ),
    vec4( -0.5,  0.1, 0.0, 1.0 ),
    vec4(  0.5, -0.1, 0.0, 1.0 ),
    vec4(  0.5,  0.1, 0.0, 1.0 ),
    // sporður
    vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -1.0,  0.15, 0.0, 1.0 ),
    vec4( -1.0, -0.15, 0.0, 1.0 ),

    // Uggi1
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(-0.1, -0.1, 0.1, 1.0),
    vec4(0.1, -0.1, 0.1, 1.0),

    // Uggi2
    vec4(0.0, 0.0, 0.0, 1.0),
    vec4(-0.1, -0.1, -0.1, 1.0),
    vec4(0.1, -0.1, -0.1, 1.0)
];


var translateor = [
    [0.0,0.0,0.0],
    [0.0, -0.3, 0.0],
    [-1.8, 0.3, -0.2],
    [0.5, 0.9, 0.5 ],
    [-0.8, 0.8, 0.0],
    [0.0, 0.7, -0.6],
    [1.8, 0.5, 0.0],
    [-0.9, -1.6, -0.3],
    [0.5, 0.0, 0.3],
    [1, 1.7, 0.0]
]




var movement = false;     // Er m�sarhnappur ni�ri?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotTail =[
    0.0,
    26,
    -26,
    16,
    -14,
    30,
    34,
    -34,
    20,
    10
]        
var incTail = [
    2.0,
    -2.0,
    2.0,
    2.0,
    -2.0,
    2.0,
    -2.0,
    2.0,
    2.0,
    -2.0
]

var rotRHand = 0.0;
var incRHand = 1.0;
var rotLHand = 0.0;
var incLhand = -1.0;

var zView = 2.0; 

var funPoint = [
    -1.0,
    -1.0,
    -2.8,
    -0.5,
    -1.8,
    -1.0,
    0.8,
    -1.9,
    -0.5,
    0.0,
];


var bodyColors = [
    vec4(0.5, 1.0, 0.0, 1.0),
    vec4(0.6, 0.5, 0.4, 1.0),
    vec4(1.0, 1.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0),
    vec4(1.0, 0.0, 0.0, 1.0),
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(0.2, 0.6, 1.0, 1.0),
    vec4(0.1, 1.0, 0.4, 1.0),
    vec4(0.3, 0.3, 0.3, 1.0),
    vec4(0.7, 0.7, 0.7, 1.0),
]


var incFunPoint = 0.01;

var proLoc;
var mvLoc;
var colorLoc;


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );
 
    gl.enable(gl.DEPTH_TEST);
 
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // Setjum ofanvarpsfylki h�r � upphafi
    var proj = perspective( 90.0, 1.0, 0.1, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    

    // Atbur�af�ll fyrir m�s
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
        if(movement) {
    	    spinY += (e.offsetX - origX) % 360;
            spinX += (e.offsetY - origY) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Atbur�afall fyrir lyklabor�
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp �r
                zView += 0.2;
                break;
            case 40:	// ni�ur �r
                zView -= 0.2;
                break;
         }
     }  );  

    // Atbur�afall fyri m�sarhj�l
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zView += 0.2;
         } else {
             zView -= 0.2;
         }
     }  );  

    render();
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



  



    rotRHand += incRHand;
    if( rotRHand > 35.0 || rotRHand < -10.0){
        incRHand *= -1;
    }

    rotLHand += incLhand;
    if( rotLHand > 10 || rotLHand < -35.0){
        incLhand *= -1;
    }


    for(var i = 0; i<translateor.length; i++){
        rotTail[i] += incTail[i];
        if( rotTail[i] > 35.0  || rotTail[i] < -35.0 ){
            incTail[i] *= -1;
        }

        funPoint[i] += incFunPoint;
        if(funPoint[i] >= 2){
            funPoint[i] = -3.5;
        }

        var mv = lookAt( vec3(0.0, 0.0, zView), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
        mv = mult( mv, rotateX(spinX) );
        mv = mult( mv, rotateY(spinY) );
        mv = mult(mv, translate(translateor[i][0],translateor[i][1], translateor[i][2]));


        // Teikna líkama fisks
        gl.uniform4fv( colorLoc, bodyColors[i] );
        mv = mult(mv, translate(funPoint[i], 0, 0))
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays( gl.TRIANGLES, 0, NumBody );


        // Teikna sporð fisks og snúa honum
        gl.uniform4fv( colorLoc, vec4(1.0, 0.0, 0.0, 1.0) );
        
        mv = mult( mv, translate ( -0.5, 0, 0.0 ) );
        mv = mult( mv, rotateY( rotTail[i] ) );
        mv = mult( mv, translate ( 0.5, 0, 0.0 ) );
        
        
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays( gl.TRIANGLES, NumBody, NumTail );
        
        
        
        
        // teikna einn ugga fisks og snúa honum
        gl.uniform4fv(colorLoc, vec4(1.0, 0.0, 0.0, 0.5));
        
        mv = mult( mv, translate (-0.5, 0.0, 0.0));
        mv = mult(mv, rotateY(-rotTail[i]));
        mv = mult(mv, rotateX(rotRHand));
        mv = mult(mv, translate(0.5, 0.0, 0.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, NumBody + NumTail, NumRhand);

        
        // teikna hinn ugga fisks og snúa honum.
        
        mv = mult( mv, translate (-0.5, 0.0, 0.0));
        mv = mult(mv, rotateX(-rotRHand));
        mv = mult(mv, rotateX(rotLHand));
        
        mv = mult(mv, translate(0.5, 0.0, 0.0));
        gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
        gl.drawArrays(gl.TRIANGLES, NumBody+ NumTail + NumRhand, NumLhand);
    
}
    
    
    
    requestAnimFrame( render );
}

