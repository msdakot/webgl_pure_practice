var main = (function(){
  var canvas, gl, program, buffer, a_position, u_matrix, matrix, rotation = 0, triangle;
  var last_time = Date.now();

  function main_function(){
    canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);

    clear_color();
    init_program();
    init_buffer();

    tick();
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_program(){
    var VERTEX_SHADER = [
      'attribute vec4 a_position;',
      'uniform mat4 u_matrix;',
      'void main(){',
        'gl_Position = u_matrix * a_position;',
      '}'
    ].join('\n');

    var FRAGMENT_SHADER = [
      'void main(){',
        'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    a_position = gl.getAttribLocation(program, "a_position");
    u_matrix = gl.getUniformLocation(program, "u_matrix");
    gl.enableVertexAttribArray(a_position);
    gl.useProgram(program);
  }

  function init_buffer(){
    buffer = gl.createBuffer();

    triangle = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    matrix = new Matrix4();
  }

  function tick(){
    requestAnimationFrame(tick);
    draw();
  }

  function draw(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    var now = Date.now();
    var elapsed = now - last_time;
    
    rotation = rotation + (2 * elapsed) / 1000.0;
    rotation = rotation % 360;

    last_time = now;
    matrix.setRotate(rotation, 0, 0, 1);

    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }



  return main_function;
})();
