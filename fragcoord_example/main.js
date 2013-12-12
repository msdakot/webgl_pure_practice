var canvas, gl, program, vertex_buffer, vertices, a_position, u_width, u_height;

var main = function(){
  canvas = $("#webgl_canvas")[0];
  $("#webgl_canvas").width(400).height(400);

  gl = getWebGLContext(canvas);

  if (!gl){
    console.log("Failed to get the rendering context");
    return;
  }

  var VSHADER_SOURCE = [
    'attribute vec4 a_position;',
    'void main(){ ', 
    '  gl_Position = a_position;',
    '}'
  ].join('\n');

  var FSHADER_SOURCE = [
    "precision mediump float;",
    'uniform float u_width;',
    'uniform float u_height;',
    'void main(){',
      'gl_FragColor = vec4(gl_FragCoord.x / u_width, 0, gl_FragCoord.y / u_height, 1.0);',
    '}'
  ].join('\n');



  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  gl.useProgram(program);

  gl.program = program;

  vertex_buffer = gl.createBuffer();
  vertices = new Float32Array([
    0, 0.5,  -0.5, -0.5, 0.5, -0.5
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  a_position = gl.getAttribLocation(program, "a_position");
  u_width = gl.getUniformLocation(program, "u_width");
  u_height = gl.getUniformLocation(program, "u_height");

  gl.enableVertexAttribArray(a_position);

  gl.uniform1f(u_width, parseFloat(400.0));
  gl.uniform1f(u_height, parseFloat(400.0));
  gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}