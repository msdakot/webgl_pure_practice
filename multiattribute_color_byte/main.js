
  var gl, canvas, program, buffer, color_buffer, a_position, a_color, points, color_points, arraybuffer;
var main = (function(){

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
      "attribute vec4 a_color;",
      "varying vec4 v_color;",
      "void main() {",
      "  gl_Position = vec4(a_position, 0.0, 1.0);",
      "  v_color = a_color.agbr;",
      "}"
    ].join('\n');


    var FRAGMENT_SHADER = [
      "precision mediump float;",
      "varying vec4 v_color;",
      "void main(){",
        "gl_FragColor = v_color;",
      "}"
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    gl.useProgram(program);
    a_position = gl.getAttribLocation(program, "a_position");
    a_color = gl.getAttribLocation(program, "a_color");

    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_color);
  }

  function init_buffer(){
    buffer = gl.createBuffer();
    color_buffer = gl.createBuffer();


    arraybuffer = new ArrayBuffer(12 * 3);

    points = new Float32Array(arraybuffer);
    color_points = new Uint32Array(arraybuffer);

    points[0] = 0;  points[1] = -0.5;
    points[3] = -0.5;  points[4] = 0.5;
    points[6] = 0.5;  points[7] = 0.5;
    
    color_points[2] = 0xFF0000FF;
    color_points[5] = 0x00FF00FF;
    color_points[8] = 0x0000FFFF;

  }

  function draw_points(){
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 12, 0);
    gl.vertexAttribPointer(a_color, 4, gl.UNSIGNED_BYTE, true, 12, 8);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }


  return main_function;
})();