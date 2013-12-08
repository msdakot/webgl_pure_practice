var main = (function(){

  var gl, canvas, program, buffer, a_position, a_pointsize;
  function main_function(){
    canvas = $("#webgl_canvas")[0];

    gl = getWebGLContext(canvas);

    clear_color();
    init_program();
    init_buffer();
    draw_points();
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_program(){
    var VERTEX_SHADER = [
      "attribute vec2 a_position;",
      "attribute float a_pointsize;",
      "void main() {",
      "  gl_Position = vec4(a_position, 0.0, 1.0);",
      "  gl_PointSize = a_pointsize;",
      "}"
    ].join('\n');


    var FRAGMENT_SHADER = [
      "void main(){",
        "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
      "}"
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    gl.useProgram(program);
    a_position = gl.getAttribLocation(program, "a_position");
    a_pointsize = gl.getAttribLocation(program, "a_pointsize");

    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_pointsize);
  }

  function init_buffer(){
    buffer = gl.createBuffer();
    var points = new Float32Array([
      0, -0.5, 40, 
      -0.5, 0.5, 20,
      0.5, 0.5, 5
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.DYNAMIC_DRAW);

  }

  function draw_points(){
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 12, 0);
    gl.vertexAttribPointer(a_pointsize, 1, gl.FLOAT, false, 12, 8);

    gl.drawArrays(gl.POINTS, 0, 3);
  }


  return main_function;
})();