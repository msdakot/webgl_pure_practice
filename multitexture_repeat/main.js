var main = (function(){
  var gl, program, buffer, a_position, a_tex_coord, u_sampler0, u_sampler1, texture0, texture1, u_sampler0_loaded = false, u_sampler1_loaded = false;
  function main_function(){
    canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);

    init_program();
    init_buffer();
    init_texture();
    load_texture({
      sampler_id: u_sampler0,
      texture_obj: texture0,
      texture_id: gl.TEXTURE0,
      url: '../images/example.jpg',
      sampler_assign: 0
    });
     load_texture({
      sampler_id: u_sampler1,
      texture_obj: texture1,
      texture_id: gl.TEXTURE1,
      url: '../images/mask.jpg',
      sampler_assign: 1
    });
  }

  function init_program(){
    var VERTEX_SHADER = [
      'precision mediump float;',
      'attribute vec2 a_position;',
      'attribute vec2 a_tex_coord;',
      'varying vec2 v_tex_coord;',

      'void main(){',
      '  gl_Position = vec4(a_position, 0.0, 1.0);',
      '  v_tex_coord = a_tex_coord;',
      '}'
    ].join('\n');

    var FRAGMENT_SHADER = [
      "precision mediump float;",
      "varying vec2 v_tex_coord;",
      "uniform sampler2D u_sampler0;",
      "uniform sampler2D u_sampler1;",
      "void main(){",
      "  vec4 color1 = texture2D(u_sampler0, v_tex_coord);",
      "  vec4 color2 = texture2D(u_sampler1, v_tex_coord);",
      "  gl_FragColor = color1 * color2;",
      "}"
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    a_position = gl.getAttribLocation(program, "a_position");
    a_tex_coord = gl.getAttribLocation(program, "a_tex_coord");
    u_sampler0 = gl.getUniformLocation(program, "u_sampler0");
    u_sampler1 = gl.getUniformLocation(program, "u_sampler1");
    gl.useProgram(program);
    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_tex_coord);

  }

  function init_buffer(){
    buffer = gl.createBuffer();
    var quad_points = new Float32Array([
      -0.5, 0.5, 0.0, 1.0,
      0.5, 0.5, 1.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, -0.5, 1.0, 0.0, 
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad_points, gl.DYNAMIC_DRAW);
  }

  function init_texture(){
    texture0 = gl.createTexture();
    texture1 = gl.createTexture();
  }

  function load_texture(params){
    var image = new Image();

    image.onload = function(){
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.activeTexture(params.texture_id);
      gl.bindTexture(gl.TEXTURE_2D, params.texture_obj);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(params.sampler_id, params.sampler_assign);

      if (params.sampler_assign == 0) {
        u_sampler0_loaded = true;
      } else if (params.sampler_assign == 1) {
        u_sampler1_loaded = true;
      }

      if (u_sampler0_loaded && u_sampler1_loaded){
        draw();
      }
    }

    image.src = params.url;
  }

  function draw(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(a_tex_coord, 2, gl.FLOAT, false, 16, 8);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }



  return main_function;
})();
