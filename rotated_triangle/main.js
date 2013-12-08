var main = (function(){
  var canvas, gl, program, buffer, a_position, matrix, u_matrix;

  function main_function(){
    canvas = $("#webgl_canvas")[0];

    gl = getWebGLContext(canvas);

    clear_color();
    init_program();
    init_buffer();
    draw_triangle();
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_program(){
    var VERTEX_SHADER = [
      "attribute vec4 a_position;",
      "uniform mat4 u_matrix;",
      "void main(){",
        "gl_Position = u_matrix * a_position;",
      "}"
    ].join('\n');

    var FRAGMENT_SHADER = [
      "void main(){",
        "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
      "}"
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    a_position = gl.getAttribLocation(program, "a_position");
    u_matrix = gl.getUniformLocation(program, "u_matrix");
    gl.enableVertexAttribArray(a_position); 
  }

  function init_buffer(){
    var triangle = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.DYNAMIC_DRAW);

    var angle = 90;
    var radian = Math.PI * angle / 180;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);

    matrix = new Float32Array([
      cosB, sinB, 0.0, 0.0,
      -sinB, cosB, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0  
    ]);



  }

  function draw_triangle(){
    gl.useProgram(program);
    gl.uniformMatrix4fv(u_matrix, false, matrix);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  return main_function;
})();
