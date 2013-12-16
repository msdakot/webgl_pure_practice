var main = (function(){
  var gl, program, buffer, a_position, a_color, u_view_matrix, matrix;
  function main(){
    var canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);

    clear_color();
    init_program();
    init_matrix();
    init_buffer();
    draw();
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_program(){
    var VERTEX_SHADER = [
      'attribute vec3 a_position;',
      'attribute vec4 a_color;',
      'varying vec4 v_color;',
      'uniform mat4 u_view_matrix;',

      'void main(){',
      '  gl_Position = u_view_matrix * vec4(a_position, 1.0);',
      '  v_color = a_color;',
      '}'
    ].join('\n');

    var FRAGMENT_SHADER = [
      'precision mediump float;',
      'varying vec4 v_color;',
      'void main(){',
      '  gl_FragColor = v_color;',
      '}'
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    a_position = gl.getAttribLocation(program, "a_position");
    a_color = gl.getAttribLocation(program, "a_color");
    u_view_matrix = gl.getUniformLocation(program, "u_view_matrix");

    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_color);

    gl.useProgram(program);
  }

  function init_buffer(){
    buffer = gl.createBuffer();
    var arraybuffer = new ArrayBuffer(4 * 4 * 3 * 3);
    var triangles = new Float32Array(arraybuffer);
    var colors = new Uint32Array(arraybuffer);

    triangles[0] = 0.0;
    triangles[1] = 0.5;
    triangles[2] = -0.4;
    colors[3] = 0x88FF88FF;

    triangles[4] = -0.5;
    triangles[5] = -0.5;
    triangles[6] = -0.4;
    colors[7] = 0x88FF88FF;

    triangles[8] = 0.5;
    triangles[9] = -0.5;
    triangles[10] = -0.4;
    colors[11] = 0xFF8888FF;



    triangles[12] = 0.5;
    triangles[13] = 0.4;
    triangles[14] = -0.2;
    colors[15] = 0xFF8888FF;

    triangles[16] = -0.5;
    triangles[17] = 0.4;
    triangles[18] = -0.2;
    colors[19] = 0xFFFF88FF;

    triangles[20] = 0.0;
    triangles[21] = -0.6;
    triangles[22] = -0.2;
    colors[23] = 0x8888FFFF;
    

    triangles[24] = 0.0;
    triangles[25] = 0.5;
    triangles[26] = 0.0;
    colors[27] = 0x8888FFFF;

    triangles[28] = -0.5;
    triangles[29] = -0.5;
    triangles[30] = 0.0;
    colors[31] = 0x8888FFFF;

    triangles[32] = 0.5;
    triangles[33] = -0.5;
    triangles[34] = 0.0;
    colors[35] = 0xFF8888FF;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangles, gl.DYNAMIC_DRAW);
  }

  function init_matrix(){
    matrix = new Matrix4();
    matrix.setLookAt(0.20, 0.25, 0.25, 0, 0, 0, 0, 1, 0);
   // matrix.setIdentity();
    gl.uniformMatrix4fv(u_view_matrix, false, matrix.elements);
  }

  function draw() {
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(a_color, 4, gl.UNSIGNED_BYTE, true, 4 * 4, 4 * 3);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
  }

  return main;
})();
