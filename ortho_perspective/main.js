var main = (function(){
  var gl, program, buffer, a_position, a_color, u_proj_matrix, g_near = -1, g_far = 1, matrix = null;
  function main(){
    var canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);

    clear_color();
    init_program();
    init_buffer();
    init_ortho_matrix();
    draw();

    $(document).keydown(function(e){
      if (e.keyCode == 39) {
        g_near += 0.01;
      } else if (e.keyCode == 37) {
        g_near -= 0.01;
      } else if (e.keyCode == 38) {
        g_far += 0.01;
      } else if (e.keyCode == 40) {
        g_far -= 0.01;
      }
      
      console.log("g_near : " + g_near + "   g_far : " + g_far);
      init_ortho_matrix();
      clear_color();
      draw();
    });
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_program(){
    var VERTEX_SHADER = [
      'attribute vec3 a_position;',
      'attribute vec4 a_color;',
      'uniform mat4 u_proj_matrix;',
      'varying vec4 v_color;',
      'void main(){',
      '  gl_Position = u_proj_matrix * vec4(a_position, 1.0);',
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
    a_position = gl.getAttribLocation(program, 'a_position');
    a_color = gl.getAttribLocation(program, 'a_color');
    u_proj_matrix = gl.getUniformLocation(program, 'u_proj_matrix');

    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_color);

    gl.useProgram(program);
  }

  function init_ortho_matrix(){
    //left, right, bottom, top, near, far)
    if (matrix == null) {
      matrix = new Matrix4();  
    }
    
    matrix.setOrtho(-1, 1, -1, 1, g_near, g_far);
    gl.uniformMatrix4fv(u_proj_matrix, false, matrix.elements);
  }

  function init_buffer(){
    buffer = gl.createBuffer();
                                      // 버텍스 한개                       // 삼각형 하나  // 삼각형 세개 
    var arraybuffer = new ArrayBuffer(144);
    var vertices = new Float32Array(arraybuffer);
    var colors = new Uint32Array(arraybuffer);

    vertices[0] = 0.0;
    vertices[1] = 0.5;
    vertices[2] = -0.4;
    colors[3] = 0x88FF88FF;

    vertices[4] = -0.5;
    vertices[5] = -0.5;
    vertices[6] = -0.4;
    colors[7] = 0x88FF88FF;

    vertices[8] = 0.5;
    vertices[9] = -0.5;
    vertices[10] = -0.4;
    colors[11] = 0xFF8888FF;

    vertices[12] = 0.5;
    vertices[13] = 0.4;
    vertices[14] = -0.2;
    colors[15] = 0xFF8888FF;

    vertices[16] = -0.5;
    vertices[17] = 0.4;
    vertices[18] = -0.2;
    colors[19] = 0xFFFF88FF;

    vertices[20] = 0.0;
    vertices[21] = -0.6;
    vertices[22] = -0.2;
    colors[23] = 0x8888FFFF;
    

    vertices[24] = 0.0;
    vertices[25] = 0.5;
    vertices[26] = 0.0;
    colors[27] = 0x8888FFFF;

    vertices[28] = -0.5;
    vertices[29] = -0.5;
    vertices[30] = 0.0;
    colors[31] = 0x8888FFFF;

    vertices[32] = 0.5;
    vertices[33] = -0.5;
    vertices[34] = 0.0;
    colors[35] = 0xFF8888FF;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  }

  function draw(){
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(a_color, 4, gl.UNSIGNED_BYTE, true, 4 * 4, 4 * 3);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
  }




  return main;
})();
