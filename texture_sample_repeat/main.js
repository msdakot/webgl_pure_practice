var main = (function(){
  var gl, program, buffer, texture, image, a_position, a_tex_coord, u_sampler, quad_vertices;

  function main_function(){
    var canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);

    init_program();
    init_buffer();
    init_texture();
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT); 
  }

  function init_program() {
    var VERTEX_SHADER = [
      "precision mediump float;",
      "attribute vec2 a_position;",
      "attribute vec2 a_tex_coord;",
      "varying vec2 v_tex_coord;",
      "void main(){",
      "  gl_Position = vec4(a_position, 0.0, 1.0);",
      "  v_tex_coord = a_tex_coord;",
      "}"
    ].join('\n');

    var FRAGMENT_SHADER = [
      "precision mediump float;",
      "uniform sampler2D u_sampler;",
      "varying vec2 v_tex_coord;",
      "void main(){",
      "  gl_FragColor = texture2D(u_sampler, v_tex_coord);",
      "}"
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);

    a_position = gl.getAttribLocation(program, "a_position");
    a_tex_coord = gl.getAttribLocation(program, "a_tex_coord");
    u_sampler = gl.getUniformLocation(program, "u_sampler");

    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_tex_coord);
  }

  function init_buffer(){
    buffer = gl.createBuffer();
    quad_vertices = new Float32Array([
      -0.5, 0.5, 0.0, 1.0,
      0.5, 0.5, 1.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, -0.5, 1.0, 0.0
    ]);
  }

  function init_texture(){
    texture = gl.createTexture();
    image = new Image();

    image.onload = function(){
      load_texture();
    }

    image.src = "../images/example.jpg";
  }

  function load_texture(){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    draw();
  }

  function draw(){
    clear_color();
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad_vertices, gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(a_tex_coord, 2, gl.FLOAT, false, 16, 8);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return main_function;
})();