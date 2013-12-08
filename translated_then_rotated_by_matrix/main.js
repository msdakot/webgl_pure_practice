var main = (function(){
  var gl, canvas, buffer, program, matrix, a_position, u_matrix;

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
      'attribute vec4 a_position;',
      'uniform mat4 u_matrix;',
      'void main(){',
      '  gl_Position = u_matrix * a_position;',
      '}'
    ].join('\n');

    var FRAGMENT_SHADER = [
      'void main(){',
        'gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
      '}'
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    a_position = gl.getAttribLocation(program, 'a_position');
    u_matrix = gl.getUniformLocation(program, 'u_matrix');
    gl.enableVertexAttribArray(a_position);
    gl.useProgram(program);
  }

  function init_buffer(){
    buffer = gl.createBuffer();
    var triangle = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle, gl.DYNAMIC_DRAW);

    matrix = new Matrix4();
    matrix.setTranslate(0, -0.5, 0.0, 1.0);
    matrix.rotate(45, 0, 0);
    gl.uniformMatrix4fv(u_matrix, false, matrix.elements);
  }

  function draw_triangle(){
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }


  return main_function;
})();