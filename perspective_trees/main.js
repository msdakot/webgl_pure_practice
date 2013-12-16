var main = (function(){
  var gl, program, buffer, a_position, a_color, u_mvp_matrix, view_matrix, proj_matrix;

  function main(){
    var canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);

    init_program();
    init_buffer();
    init_matrix();
    draw();
  }

  function init_program(){
    var VERTEX_SHADER = [
      'attribute vec3 a_position;',
      'attribute vec4 a_color;',
      'varying vec4 v_color;',
      'uniform mat4 u_mvp_matrix;',
      'void main(){',
      '  gl_Position = u_mvp_matrix * vec4(a_position, 1.0);',
      '  v_color = a_color.abgr;',
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
    
    gl.useProgram(program);
    
    a_position = gl.getAttribLocation(program, "a_position");
    a_color = gl.getAttribLocation(program, "a_color");
    u_mvp_matrix = gl.getUniformLocation(program, "u_mvp_matrix");

    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_color);
  }

  function init_matrix(){
    view_matrix = new Matrix4();
    view_matrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
    proj_matrix = new Matrix4();
    proj_matrix.setPerspective(30, $("#webgl_canvas").width() / $("#webgl_canvas").height(), 1, 100);

  }

  function init_buffer(){
    buffer = gl.createBuffer();

    var array_buffer = new ArrayBuffer(4 * 4 * 3 * 3);
    var vertices = new Float32Array(array_buffer);
    var colors = new Uint32Array(array_buffer);


    // 3rd triangle
    vertices[0] = 0.0;
    vertices[1] = 1.0;
    vertices[2] = -5.0;
    colors[3] = 0x0716FFFF;

    vertices[4] = -0.5;
    vertices[5] = -1.0;
    vertices[6] = -5.0;
    colors[7] = 0x0716FFFF;

    vertices[8] = 0.5;
    vertices[9] = -1.0;
    vertices[10] = -5.0;
    colors[11] = 0xFFFFFFFF;


    // 2nd trianglew
    vertices[12] = 0.0;
    vertices[13] = 1.0;
    vertices[14] = -5.0;
    colors[15] = 0xFFDC0AFF;

    vertices[16] = -1.5;
    vertices[17] = -1.0;
    vertices[18] = -5.0;
    colors[19] = 0xFFDC0AFF;

    vertices[20] = 0.5;
    vertices[21] = -1.5;
    vertices[22] = -5.0;
    colors[23] = 0xFF8888FF;



    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  }

  function clear_color_depth(){
   // gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  function draw(){
    clear_color_depth();
    gl.enable(gl.POLYGON_OFFSET_FILL);

    var mvp_matrix = new Matrix4();
    var model_matrix = new Matrix4();
    gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 4 * 4, 0);
    gl.vertexAttribPointer(a_color, 4, gl.UNSIGNED_BYTE, true, 4 * 4, 4 * 3);

    model_matrix.setIdentity();

    gl.uniformMatrix4fv(u_mvp_matrix, false, mvp_matrix.set(proj_matrix).multiply(view_matrix).multiply(model_matrix).elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.polygonOffset(1.0, 1.0);

    gl.drawArrays(gl.TRIANGLES, 3, 3);

  }


  return main;
})();
